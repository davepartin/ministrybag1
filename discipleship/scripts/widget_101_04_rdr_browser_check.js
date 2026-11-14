#!/usr/bin/env node
/**
 * 101-04 Read, Discover, Respond widget browser verification.
 * Serve discipleship/ locally and pass RDR_BASE_URL (default http://127.0.0.1:8798/index.html).
 * Uses isolated contexts and synthetic answers only.
 */
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.RDR_BASE_URL || 'http://127.0.0.1:8798/index.html';
const lesson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', '101-04.json'), 'utf8'));

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
  function check(name, ok) {
    assert.ok(ok, name);
    passed += 1;
  }

  for (const job of JOBS) {
    const tag = `${job.width}/${job.reducedMotion}`;
    const ctx = await browser.newContext({
      viewport: { width: job.width, height: job.height },
      reducedMotion: job.reducedMotion
    });
    try {
      await ctx.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
      await ctx.addInitScript(() => {
        window.__rdrStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            if (location.pathname.includes('read-discover-respond')) window.__rdrStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
        if (window === window.top && !sessionStorage.getItem('rdrSeed')) {
          localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            'question-101-4-1': 'SYN-rdr-101-04'
          }));
          sessionStorage.setItem('rdrSeed', '1');
        }
      });

      const page = await ctx.newPage();
      const errors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => {
        if (r.url().includes('read-discover-respond') && r.status() >= 400) {
          httpErrors.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.goto(`${BASE}#101-4`, { waitUntil: 'networkidle' });
      const section = page.locator('#session-4');
      await section.waitFor();

      const frameEl = section.locator('iframe[src*="widgets/read-discover-respond.html"]');
      check(`${tag}: exactly one widget iframe`, await frameEl.count() === 1);
      const frame = await (await frameEl.elementHandle()).contentFrame();
      await frame.locator('#next-btn').waitFor();
      await page.waitForTimeout(200);

      check(`${tag}: all existing questions preserved`,
        await section.locator('.question-textarea').count() === lesson.blocks.filter(b => b.type === 'question').length);
      check(`${tag}: saved answer restored`,
        await section.locator('#question-101-4-1').inputValue() === 'SYN-rdr-101-04');

      const cardHeight = await frame.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const stepCount = await frame.locator('.step-dot').count();
      check(`${tag}: six study steps present`, stepCount === 6);

      for (let s = 0; s < stepCount; s++) {
        if (s > 0) await frame.locator('#next-btn').click();
        const dur = Number(await frame.locator('#widget').getAttribute('data-step-dur')) || 0;
        if (job.reducedMotion === 'reduce') {
          check(`${tag}: reduced motion instant step ${s}`, dur === 0 && await frame.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
        }
        if (dur) await page.waitForTimeout(dur + 80);

        check(`${tag}: active dot step ${s}`,
          await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: constant card height step ${s}`,
          await frame.locator('#card-content').evaluate((e, h) => Math.abs(e.getBoundingClientRect().height - h) <= 1, cardHeight));
        check(`${tag}: zero horizontal overflow step ${s}`,
          await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      }

      const gaps = await frame.evaluate(() => [1, 2, 3].map(i => {
        const g = document.getElementById(`lane-${i}`);
        return g.querySelector('.lane-cue').getBoundingClientRect().left - g.querySelector('.lane-title').getBoundingClientRect().right;
      }));
      check(`${tag}: SVG lane title/cue spacing >= 12px`, gaps.every(px => px >= 12));

      await frame.locator('#lane-1').click({ force: true });
      check(`${tag}: lane tap jumps to step 2`,
        await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '2');
      await frame.locator('#prev-btn').click();
      check(`${tag}: Back returns to step 1`,
        await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '1');
      await frame.locator('.step-dot').last().focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(700);
      check(`${tag}: Space activates final step`,
        await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '5');
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
      check(`${tag}: widget never writes storage`, await frame.evaluate(() => window.__rdrStorageWrites) === 0);
      check(`${tag}: zero page or HTTP errors`, errors.length === 0 && httpErrors.length === 0);

      console.log(`PASS ${tag}: card=${cardHeight}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`${passed} 101-04 Read, Discover, Respond widget checks passed.`);
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
