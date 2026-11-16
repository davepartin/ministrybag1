#!/usr/bin/env node
/**
 * 101-03 The Lord's Prayer accordion widget browser verification.
 * Serve discipleship/ locally and pass LP_BASE_URL (default http://127.0.0.1:8797/index.html).
 * Uses isolated contexts and synthetic answers only.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.LP_BASE_URL || 'http://127.0.0.1:8797/index.html';
const SCREENSHOT_DIR = process.env.LP_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
const lesson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', '101-03.json'), 'utf8'));

const questions = lesson.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-101-' + q.id, 'SYN-lp-answer-' + i]));
seed['question-202-unrelated'] = 'SYN-lp-other-course';

const EXPECTED_HEADINGS = [
  null,
  'Connect Relationally',
  'Worship His Name',
  'Pray His Agenda First',
  'Depend on Him for Everything',
  'Forgive and Be Forgiven',
  'Engage in Spiritual Warfare',
  'Return the Glory to God'
];

const JOBS = [
  { width: 375, height: 812, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'no-preference' },
  { width: 1280, height: 800, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'reduce' }
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : { channel: 'chrome' })
  });

  let passed = 0;
  function check(label, cond) {
    if (!cond) throw new Error('FAIL: ' + label);
    passed += 1;
  }

  for (const job of JOBS) {
    const tag = `${job.width}/${job.reducedMotion}`;
    const ctx = await browser.newContext({
      viewport: { width: job.width, height: job.height },
      reducedMotion: job.reducedMotion
    });
    try {
      await ctx.addInitScript(seed => {
        window.__lpStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            if (location.pathname.includes('lords-prayer')) window.__lpStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
        if (window === window.top && !sessionStorage.getItem('lpSeed')) {
          localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
          sessionStorage.setItem('lpSeed', '1');
        }
      }, seed);

      const page = await ctx.newPage();
      const errors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => {
        if (r.url().includes('lords-prayer') && r.status() >= 400) {
          httpErrors.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.goto(`${BASE}#101-3`, { waitUntil: 'networkidle' });
      const section = page.locator('#session-3');
      await section.waitFor();

      const frameEl = section.locator('iframe[src*="widgets/lords-prayer.html"]');
      check(`${tag}: exactly one widget iframe`, await frameEl.count() === 1);
      const frame = await (await frameEl.elementHandle()).contentFrame();
      await frame.locator('#next-btn').waitFor();
      await page.waitForTimeout(200);

      check(`${tag}: all existing questions preserved`,
        await section.locator('.question-textarea').count() === questions.length);
      for (const q of questions) {
        const key = 'question-101-' + q.id;
        check(`${tag}: saved answer restored ${key}`, await section.locator('#' + key).inputValue() === seed[key]);
      }
      check(`${tag}: approved placement`, await frameEl.evaluate(el => {
        const block = el.closest('.block-widget');
        return block.previousElementSibling.textContent.includes('Read the prayer below') &&
          block.nextElementSibling.textContent.includes('The prayer moves in six simple steps');
      }));

      const itemCount = await frame.locator('.prayer-item').count();
      check(`${tag}: seven accordion prayer lines present`, itemCount === 7);

      const targetsOk = await frame.evaluate(() => {
        const els = Array.from(document.querySelectorAll('.prayer-summary, .nav-btn'));
        return els.every(el => {
          const r = el.getBoundingClientRect();
          return r.width >= 24 && r.height >= 24;
        });
      });
      check(`${tag}: all interactive targets >= 24x24px`, targetsOk);

      if (job.reducedMotion === 'reduce') {
        check(`${tag}: reduced motion instant class set`,
          await frame.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
      }

      for (let s = 0; s <= itemCount; s++) {
        if (s > 0) await frame.locator('#next-btn').click();
        await page.waitForTimeout(job.reducedMotion === 'reduce' ? 60 : 180);

        check(`${tag}: iframe fits widget step ${s}`,
          await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
        check(`${tag}: zero horizontal overflow step ${s}`,
          await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

        if (s === 0) {
          check(`${tag}: all accordion drawers closed on step 0`,
            await frame.locator('.prayer-item[open]').count() === 0);
        } else {
          check(`${tag}: exclusive drawer ${s} open and heading matches`,
            await frame.locator('.prayer-item[open]').count() === 1 &&
            await frame.locator(`.prayer-item[data-step="${s}"][open]`).count() === 1 &&
            await frame.locator(`.prayer-item[data-step="${s}"] .step-heading`).textContent() === EXPECTED_HEADINGS[s]);

          if (s < itemCount) {
            const pushedDown = await frame.evaluate(step => {
              const cur = document.querySelector(`.prayer-item[data-step="${step}"] .step-drawer`).getBoundingClientRect();
              const next = document.querySelector(`.prayer-item[data-step="${step + 1}"]`).getBoundingClientRect();
              return next.top >= cur.bottom - 1;
            }, s);
            check(`${tag}: open drawer ${s} sits right above next line`, pushedDown);
          }
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference' && [0, 1, 3, 7].includes(s)) {
          await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      await frame.locator('.prayer-item[data-step="3"] summary').click();
      await page.waitForTimeout(100);
      check(`${tag}: clicking line 3 closes line 7 and opens Pray His Agenda First`,
        await frame.locator('.prayer-item[open]').count() === 1 &&
        await frame.locator('.prayer-item[data-step="3"][open]').count() === 1 &&
        await frame.locator('#step-count').textContent() === 'Step 3 of 6');

      await frame.locator('.prayer-item[data-step="3"] summary').click();
      await page.waitForTimeout(100);
      check(`${tag}: clicking open line 3 again collapses accordion cleanly`,
        await frame.locator('.prayer-item[open]').count() === 0 &&
        await frame.locator('#step-count').textContent() === 'Ready' &&
        await frame.locator('#prev-btn').isDisabled());

      await frame.locator('.prayer-item[data-step="6"] summary').click();
      await page.waitForTimeout(100);
      check(`${tag}: clicking line 6 opens Engage in Spiritual Warfare`,
        await frame.locator('.prayer-item[data-step="6"][open]').count() === 1 &&
        await frame.locator('#step-count').textContent() === 'Step 6 of 6');

      await frame.locator('#prev-btn').click();
      await page.waitForTimeout(100);
      check(`${tag}: Back moves from line 6 to line 5`,
        await frame.locator('.prayer-item[data-step="5"][open]').count() === 1 &&
        await frame.locator('#step-count').textContent() === 'Step 5 of 6');

      await frame.locator('#next-btn').click();
      await frame.locator('#next-btn').click();
      await page.waitForTimeout(100);
      check(`${tag}: Next reaches closing Amen`,
        await frame.locator('.prayer-item[data-step="7"][open]').count() === 1 &&
        await frame.locator('#step-count').textContent() === 'Amen');

      await frame.locator('#next-btn').click();
      await page.waitForTimeout(100);
      check(`${tag}: Start Over closes all rows back to Ready`,
        await frame.locator('.prayer-item[open]').count() === 0 &&
        await frame.locator('#prev-btn').isDisabled());

      await page.waitForTimeout(200);
      await frame.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(450);
      check(`${tag}: zero idle DOM mutations`, await frame.evaluate(() => window.__idleMut) === 0);
      check(`${tag}: widget never writes storage`, await frame.evaluate(() => window.__lpStorageWrites) === 0);
      check(`${tag}: zero page or HTTP errors`, errors.length === 0 && httpErrors.length === 0);

      const editKey = 'question-101-' + questions[0].id;
      await section.locator('#' + editKey).fill('SYN-lp-edited');
      await page.reload();
      await section.locator('#' + editKey).waitFor();
      check(`${tag}: edited answer survives reload`, await section.locator('#' + editKey).inputValue() === 'SYN-lp-edited');
      check(`${tag}: all other saved answers remain exact`, await page.evaluate(({ seed, editKey }) => {
        const saved = JSON.parse(localStorage.getItem('christianFoundationsResponses'));
        return Object.entries(seed).every(([k, v]) => saved[k] === (k === editKey ? 'SYN-lp-edited' : v));
      }, { seed, editKey }));

      await page.locator('#email-lesson-btn').click();
      const outgoing = await page.locator('#export-preview-text').textContent();
      check(`${tag}: Email contains all eight current answers`,
        outgoing.includes('SYN-lp-edited') && questions.slice(1).every(q => outgoing.includes(seed['question-101-' + q.id])));
      check(`${tag}: Email excludes another course`, !outgoing.includes('SYN-lp-other-course'));
      const widgetH = await frameEl.evaluate(e => e.clientHeight);
      console.log(`PASS ${tag}: widget=${widgetH}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`${passed} 101-03 Lord's Prayer widget checks passed.`);
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
