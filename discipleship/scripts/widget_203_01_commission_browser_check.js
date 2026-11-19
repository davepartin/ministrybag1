#!/usr/bin/env node
/**
 * 203-01 The Great Commission standalone widget browser verification.
 * Serve discipleship/ locally and pass GC_BASE_URL (default http://127.0.0.1:8794/widgets/great-commission-203.html).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_FILE = path.join(ROOT, 'widgets', 'great-commission-203.html');
const BASE = process.env.GC_BASE_URL || 'http://127.0.0.1:8794/widgets/great-commission-203.html';
const SCREENSHOT_DIR = process.env.GC_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'The Great Commission',
  'You, Loved by God',
  'Home and Church',
  'Your Jerusalem',
  'Judea and Samaria',
  'The End of the Earth',
  'Go and Make Disciples'
];

const JOBS = [
  { width: 375, height: 812, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'no-preference' },
  { width: 1280, height: 800, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'reduce' }
];

(async () => {
  const sourceText = fs.readFileSync(WIDGET_FILE, 'utf8');
  if (sourceText.includes('\u2014')) {
    throw new Error('FAIL: Em dash found in widgets/great-commission-203.html');
  }
  const visibleHtml = sourceText.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  for (const forbidden of ['tap', 'click', 'widget', 'diagram']) {
    if (new RegExp(`\\b${forbidden}\\b`, 'i').test(visibleHtml.replace(/<[^>]+>/g, ' '))) {
      throw new Error(`FAIL: Forbidden visible word "${forbidden}" found in HTML copy`);
    }
  }

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
      await ctx.addInitScript(() => {
        window.__gcStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            window.__gcStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
      });

      const page = await ctx.newPage();
      const errors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => {
        if (r.status() >= 400) httpErrors.push(`${r.status()} ${r.url()}`);
      });

      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.locator('#next-btn').waitFor();
      await page.waitForTimeout(120);

      const cardHeight = await page.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const widgetHeight = await page.locator('#widget').evaluate(e => e.getBoundingClientRect().height);
      const stepCount = await page.locator('.step-dot').count();
      check(`${tag}: seven step dots present`, stepCount === 7);

      const sizesOk = await page.evaluate(() => {
        const navOk = Array.from(document.querySelectorAll('.nav-btn')).every(b => b.getBoundingClientRect().height >= 44);
        const dotOk = Array.from(document.querySelectorAll('.step-dot')).every(b => {
          const r = b.getBoundingClientRect();
          return r.width >= 28 && r.height >= 28;
        });
        return navOk && dotOk;
      });
      check(`${tag}: buttons >= 44px and dots >= 28x28`, sizesOk);

      if (job.width === 390) {
        check(`${tag}: total widget height <= 560px (${Math.round(widgetHeight)}px)`, widgetHeight <= 560);
      }

      for (let s = 0; s < stepCount; s++) {
        if (s > 0) await page.locator('#next-btn').click();
        const dur = Number(await page.locator('#widget').getAttribute('data-step-dur')) || 0;
        if (job.reducedMotion === 'reduce') {
          check(`${tag}: reduced motion instant step ${s}`,
            dur === 0 && await page.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
        }
        await page.waitForTimeout(dur ? dur + 520 : 120);

        check(`${tag}: active dot step ${s}`,
          await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: heading matches step ${s}`,
          await page.locator('#card-heading').textContent() === EXPECTED_HEADINGS[s]);
        check(`${tag}: constant card height step ${s}`,
          await page.locator('#card-content').evaluate((e, h) => Math.abs(e.getBoundingClientRect().height - h) <= 1, cardHeight));
        check(`${tag}: card content fits step ${s}`,
          await page.locator('#card-content').evaluate(e => e.scrollHeight <= e.clientHeight + 1));
        check(`${tag}: zero horizontal overflow step ${s}`,
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

        // Verify expected SVG elements are drawn/visible for each step
        const vis = await page.evaluate(step => {
          const op = id => Number(getComputedStyle(document.getElementById(id)).opacity);
          return {
            w0: op('wash-0'), w1: op('wash-1'), w2: op('wash-2'), w3: op('wash-3'), w4: op('wash-4'),
            globe: op('globe-layer'), jdot: op('jerusalem-dot'),
            cross: op('cross-outer'),
            crossOffset: Number(document.getElementById('cross-outer').style.strokeDashoffset || 0)
          };
        }, s);

        if (s === 0) {
          check(`${tag}: step 0 nothing drawn`, vis.w0 === 0 && vis.globe === 0 && vis.cross === 0);
        } else if (s === 1) {
          check(`${tag}: step 1 center drawn`, vis.w0 === 1 && vis.w1 === 0);
        } else if (s === 2) {
          check(`${tag}: step 2 ring 1 drawn`, vis.w0 === 1 && vis.w1 === 1 && vis.w2 === 0);
        } else if (s === 3) {
          check(`${tag}: step 3 ring 2 drawn`, vis.w2 === 1 && vis.w3 === 0);
        } else if (s === 4) {
          check(`${tag}: step 4 ring 3 drawn`, vis.w3 === 1 && vis.w4 === 0 && vis.globe === 0);
        } else if (s === 5) {
          check(`${tag}: step 5 ring 4 + globe + Jerusalem dot drawn`, vis.w4 === 1 && vis.globe === 1 && vis.jdot === 1 && vis.cross === 0);
        } else if (s === 6) {
          check(`${tag}: step 6 full picture + globe + crimson cross drawn`, vis.w4 === 1 && vis.globe === 1 && vis.jdot === 1 && vis.cross === 1 && vis.crossOffset === 0);
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Back restores prior state instantly (step 6 -> step 5 hides cross, keeps globe)
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Back from step 6 restores step 5 instantly`,
        await page.locator('#widget').getAttribute('data-step') === '5' &&
        await page.locator('#widget').getAttribute('data-step-dur') === '0' &&
        await page.evaluate(() => Number(getComputedStyle(document.getElementById('cross-outer')).opacity) === 0 && Number(getComputedStyle(document.getElementById('globe-layer')).opacity) === 1));

      // Back from step 5 -> step 4 hides globe and ring 4
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Back from step 5 restores step 4 instantly`,
        await page.locator('#widget').getAttribute('data-step') === '4' &&
        await page.evaluate(() => Number(getComputedStyle(document.getElementById('globe-layer')).opacity) === 0 && Number(getComputedStyle(document.getElementById('wash-4')).opacity) === 0));

      // Keyboard Space on final dot activates step 6
      await page.locator('.step-dot').last().focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(80);
      check(`${tag}: Space on final dot reaches step 6`,
        await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '6');

      // Start Over returns to step 0
      await page.locator('#next-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Start Over returns to step 0`,
        await page.locator('#widget').getAttribute('data-step') === '0' &&
        await page.locator('#prev-btn').isDisabled());

      // Zero idle DOM mutations & zero localStorage writes
      await page.waitForTimeout(150);
      await page.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(500);
      check(`${tag}: zero idle DOM mutations`, await page.evaluate(() => window.__idleMut) === 0);
      check(`${tag}: zero localStorage writes`, await page.evaluate(() => window.__gcStorageWrites) === 0);
      check(`${tag}: zero page or HTTP errors`, errors.length === 0 && httpErrors.length === 0);

      console.log(`PASS ${tag}: card=${Math.round(cardHeight)}px widget=${Math.round(widgetHeight)}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`${passed} 203-01 Great Commission widget checks passed.`);
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
