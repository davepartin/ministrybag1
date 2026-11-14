#!/usr/bin/env node
// Regression check for 201-10 The Learning Circle widget (Studio Wash Edition).
// Serves nothing itself; pass GT_BASE_URL or start python3 -m http.server in discipleship/.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8814/index.html';
const SCREENSHOT_DIR = process.env.GT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let passed = 0;
function ck(label, cond) {
  assert.ok(cond, label);
  passed++;
}

(async () => {
  const launchOpts = { headless: true };
  if (process.env.GT_CHROMIUM_PATH) launchOpts.executablePath = process.env.GT_CHROMIUM_PATH;
  else launchOpts.channel = 'chrome';

  const browser = await chromium.launch(launchOpts);
  try {
    const lessonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../data/201-10.json'), 'utf8')
    );
    const questions = lessonData.blocks.filter(b => b.type === 'question');
    const seed = Object.fromEntries(
      questions.map((q, i) => ['question-201-' + q.id, 'SYN-lc-' + i])
    );

    const cases = [
      { width: 375, motion: 'no-preference' },
      { width: 390, motion: 'no-preference' },
      { width: 1280, motion: 'no-preference' },
      { width: 390, motion: 'reduce' }
    ];

    for (const c of cases) {
      const tag = c.width + '/' + c.motion;
      const context = await browser.newContext({
        viewport: { width: c.width, height: 844 },
        reducedMotion: c.motion
      });

      try {
        await context.route('**/scripts/account.js', r =>
          r.fulfill({ body: '', contentType: 'text/javascript' })
        );
        await context.addInitScript(s => {
          window.__lcStorageWrites = 0;
          for (const name of ['setItem', 'removeItem', 'clear']) {
            const orig = Storage.prototype[name];
            Storage.prototype[name] = function (...args) {
              if (window !== window.top) window.__lcStorageWrites++;
              return orig.apply(this, args);
            };
          }
          if (window === window.top && !sessionStorage.getItem('lc-seeded')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(s));
            sessionStorage.setItem('lc-seeded', '1');
          }
        }, seed);

        const page = await context.newPage();
        const errors = [];
        const httpErrors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => {
          if (r.url().includes('/widgets/') && r.status() >= 400) {
            httpErrors.push(r.status() + ' ' + r.url());
          }
        });

        await page.goto(BASE + '#201-10');
        const lesson = page.locator('#session-10');
        const frameEl = lesson.locator('iframe[src*="widgets/learning-circle2.html"]');
        await frameEl.waitFor();
        const frame = await (await frameEl.elementHandle()).contentFrame();
        await frame.locator('.title-bar h1').waitFor();
        await page.waitForTimeout(250);

        const snap = async name => {
          if (SCREENSHOT_DIR && c.width === 390 && c.motion === 'no-preference') {
            await frameEl.evaluate(e =>
              window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 100, behavior: 'instant' })
            );
            await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'learning-circle-' + name + '.png') });
          }
        };

        // 1. Studio Wash header + title/tag alignment
        const hdr = await frame.evaluate(() => {
          const h = document.querySelector('.title-bar');
          const t = h.querySelector('h1');
          const tagEl = h.querySelector('.course-tag');
          return {
            title: t.textContent.trim(),
            courseTag: tagEl.textContent.trim(),
            bg: getComputedStyle(h).backgroundColor,
            color: getComputedStyle(t).color,
            fontSize: getComputedStyle(t).fontSize,
            tagColor: getComputedStyle(tagEl).color
          };
        });
        ck(tag + ' header format', hdr.title === 'The Learning Circle' && hdr.courseTag === '201-10');
        ck(
          tag + ' header Studio Wash colors',
          hdr.bg === 'rgb(44, 36, 22)' &&
            hdr.color === 'rgb(250, 248, 243)' &&
            hdr.fontSize === '17px' &&
            hdr.tagColor === 'rgb(229, 222, 201)'
        );

        const dotCount = await frame.locator('.step-dot').count();
        ck(tag + ' 7 clickable step dots', dotCount === 7);

        const cardHeight = () =>
          frame.locator('.verse-card').evaluate(el => Math.round(el.getBoundingClientRect().height));
        const h0 = await cardHeight();
        ck(tag + ' intro card visible', (await frame.locator('.verse-card-title').textContent()).includes('Getting Back on the Path'));
        await snap('0-intro');

        const waitStep = c.motion === 'reduce' ? 60 : 920;

        // Walk all 6 stops with Next ->
        await frame.locator('[data-control="begin"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 1 The Path of Jesus', (await frame.locator('.verse-card-title').textContent()).includes('Path of Jesus'));
        await snap('1-path');

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 2 Drift', (await frame.locator('.verse-card-title').textContent()).includes('Following Your Own Way'));
        await snap('2-drift');

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 3 Conviction', (await frame.locator('.verse-card-title').textContent()).includes('Conviction'));

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 4 Repent', (await frame.locator('.verse-card-title').textContent()).includes('Repent'));

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 5 Believe', (await frame.locator('.verse-card-title').textContent()).includes('Believe'));
        await snap('5-believe');

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        const hFinal = await cardHeight();
        ck(tag + ' step 6 Back on the Path', (await frame.locator('.verse-card-title').textContent()).includes('Back on the Path'));
        ck(tag + ' card height locked across all steps', Math.abs(h0 - hFinal) <= 1);
        ck(tag + ' return arrow visible at step 6', await frame.locator('#return-arrow').evaluate(el => el.classList.contains('is-on')));
        await snap('6-restored');

        // Back button check
        await frame.locator('[data-control="back"]').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' Back returns to Believe', (await frame.locator('.verse-card-title').textContent()).includes('Believe'));

        // Direct step dot jump check + Start Over
        await frame.locator('.step-dot').nth(1).click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step dot jumps to Path', (await frame.locator('.verse-card-title').textContent()).includes('Path of Jesus'));

        await frame.locator('.step-dot').last().click();
        await page.waitForTimeout(waitStep);
        await frame.locator('[data-control="restart"]').click();
        await page.waitForTimeout(200);
        ck(tag + ' Start Over resets to Intro', (await frame.locator('.verse-card-title').textContent()).includes('Getting Back on the Path'));

        // Layout fit & idle stability
        const frameOverflow = await frame.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1
        );
        const pageOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1
        );
        ck(tag + ' zero horizontal overflow', !frameOverflow && !pageOverflow);
        ck(tag + ' no localStorage writes from widget', (await frame.evaluate(() => window.__lcStorageWrites)) === 0);
        ck(tag + ' SVG accessibility title/desc present', (await frame.locator('#lc-desc').textContent()).trim().length > 10);

        await frameEl.evaluate(el => {
          window.__lcHeightWrites = 0;
          new MutationObserver(ms => {
            window.__lcHeightWrites += ms.length;
          }).observe(el, { attributes: true, attributeFilter: ['style'] });
        });
        await page.waitForTimeout(500);
        ck(tag + ' zero idle iframe mutations', (await page.evaluate(() => window.__lcHeightWrites)) === 0);
        ck(tag + ' zero console/HTTP errors', errors.length === 0 && httpErrors.length === 0);
      } finally {
        await context.close();
      }
    }
    console.log('ALL CHECKS PASSED (' + passed + ' assertions)');
  } finally {
    await browser.close();
  }
})();
