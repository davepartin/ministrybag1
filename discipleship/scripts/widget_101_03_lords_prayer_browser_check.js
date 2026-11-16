#!/usr/bin/env node
/**
 * 101-03 The Lord's Prayer widget browser verification.
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
  'Click any line to see its step',
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

      const cardHeight = await frame.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const lineCount = await frame.locator('.prayer-line').count();
      const stepCount = await frame.locator('.step-dot').count();
      check(`${tag}: seven prayer lines present`, lineCount === 7);
      check(`${tag}: eight study steps present`, stepCount === 8);

      const targetsOk = await frame.evaluate(() => {
        const els = Array.from(document.querySelectorAll('.prayer-line, .step-dot'));
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

      for (let s = 0; s < stepCount; s++) {
        if (s > 0) await frame.locator('#next-btn').click();
        await page.waitForTimeout(job.reducedMotion === 'reduce' ? 40 : 120);

        check(`${tag}: active dot step ${s}`,
          await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: expected heading step ${s}`,
          await frame.locator('#card-heading').textContent() === EXPECTED_HEADINGS[s]);
        check(`${tag}: constant card height step ${s}`,
          await frame.locator('#card-content').evaluate((e, h) => Math.abs(e.getBoundingClientRect().height - h) <= 1, cardHeight));
        check(`${tag}: card content fits step ${s}`,
          await frame.locator('#card-content').evaluate(e => e.scrollHeight <= e.clientHeight + 1));
        check(`${tag}: iframe fits widget step ${s}`,
          await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
        check(`${tag}: zero horizontal overflow step ${s}`,
          await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

        if (s === 0) {
          check(`${tag}: no prayer line pressed on step 0`,
            await frame.locator('.prayer-line[aria-pressed="true"]').count() === 0);
        } else {
          check(`${tag}: line ${s} pressed on step ${s}`,
            await frame.locator(`.prayer-line[data-step="${s}"][aria-pressed="true"]`).count() === 1);
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference' && [0, 1, 3, 7].includes(s)) {
          await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      await frame.locator('.prayer-line[data-step="3"]').click();
      check(`${tag}: clicking line 3 highlights it and shows Pray His Agenda First`,
        await frame.locator('.prayer-line[data-step="3"]').getAttribute('aria-pressed') === 'true' &&
        await frame.locator('#card-heading').textContent() === 'Pray His Agenda First');

      await frame.locator('#prev-btn').click();
      check(`${tag}: Back returns from line 3 to step 2`,
        await frame.locator('.prayer-line[data-step="2"]').getAttribute('aria-pressed') === 'true' &&
        await frame.locator('#card-heading').textContent() === 'Worship His Name');

      await frame.locator('.prayer-line[data-step="6"]').click();
      check(`${tag}: clicking line 6 jumps to Engage in Spiritual Warfare`,
        await frame.locator('.prayer-line[data-step="6"]').getAttribute('aria-pressed') === 'true' &&
        await frame.locator('#card-heading').textContent() === 'Engage in Spiritual Warfare');

      await frame.locator('.step-dot').last().focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(80);
      check(`${tag}: Space activates closing praise step`,
        await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '7' &&
        await frame.locator('#card-heading').textContent() === 'Return the Glory to God');

      await frame.locator('#next-btn').click();
      check(`${tag}: Start Over returns to step 0`,
        await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '0' &&
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
      console.log(`PASS ${tag}: card=${cardHeight}px widget=${widgetH}px`);
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
