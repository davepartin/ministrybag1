#!/usr/bin/env node
/**
 * 203-10 Marks of a True Christian (Romans 12:9-21) standalone widget browser verification.
 * Serve discipleship/ locally and pass MARKS_BASE_URL (default http://127.0.0.1:8794/widgets/marks-of-genuine-love.html).
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_FILE = path.join(ROOT, 'widgets', 'marks-of-genuine-love.html');
const SCREENSHOT_DIR = process.env.MARKS_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'Let Love Be Genuine',
  '1. A Genuine Heart',
  '2. Up Toward God',
  '3. Family in Christ',
  '4. Out Toward Everyone, Even Enemies',
  'Love Comes Down, Goes Up, and Reaches Out'
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
    throw new Error('FAIL: Em dash found in widgets/marks-of-genuine-love.html');
  }
  const visibleHtml = sourceText.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  for (const forbidden of ['tap', 'click', 'widget', 'diagram']) {
    if (new RegExp(`\\b${forbidden}\\b`, 'i').test(visibleHtml.replace(/<[^>]+>/g, ' '))) {
      throw new Error(`FAIL: Forbidden visible word "${forbidden}" found in HTML copy`);
    }
  }

  let localServer = null;
  let BASE = process.env.MARKS_BASE_URL || '';
  if (!BASE) {
    localServer = http.createServer((req, res) => {
      const html = fs.readFileSync(WIDGET_FILE);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    await new Promise(resolve => localServer.listen(0, '127.0.0.1', resolve));
    BASE = `http://127.0.0.1:${localServer.address().port}/widgets/marks-of-genuine-love.html`;
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
        window.__marksStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            window.__marksStorageWrites += 1;
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
      await page.waitForTimeout(100);

      const cardHeight = await page.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const widgetHeight = await page.locator('#widget').evaluate(e => e.getBoundingClientRect().height);
      const stepCount = await page.locator('.step-dot').count();
      check(`${tag}: six step dots present`, stepCount === 6);

      const sizesOk = await page.evaluate(() => {
        const navOk = Array.from(document.querySelectorAll('.nav-btn')).every(b => b.getBoundingClientRect().height >= 44);
        const dotOk = Array.from(document.querySelectorAll('.step-dot')).every(b => {
          const r = b.getBoundingClientRect();
          return r.width >= 28 && r.height >= 28;
        });
        const pillOk = Array.from(document.querySelectorAll('.lens-pill')).every(b => b.getBoundingClientRect().height >= 28);
        return navOk && dotOk && pillOk;
      });
      check(`${tag}: buttons >= 44px, dots >= 28x28, lens pills >= 28px`, sizesOk);

      if (job.width === 390) {
        check(`${tag}: total widget height <= 595px (${Math.round(widgetHeight)}px)`, widgetHeight <= 595);
      }

      for (let s = 0; s < stepCount; s++) {
        if (s > 0) await page.locator('#next-btn').click();
        await page.waitForTimeout(80);

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

        const state = await page.evaluate(() => {
          const activeGroups = Array.from(document.querySelectorAll('.v-seg.is-active')).map(el => el.getAttribute('data-group'));
          const litPills = Array.from(document.querySelectorAll('.lens-pill.is-lit')).map(el => el.getAttribute('data-lens'));
          return { activeGroups: Array.from(new Set(activeGroups)).sort(), litPills };
        });

        if (s === 0) {
          check(`${tag}: step 0 no group active`, state.activeGroups.length === 0 && state.litPills.length === 0);
        } else if (s >= 1 && s <= 4) {
          check(`${tag}: step ${s} highlights group ${s}`,
            state.activeGroups.length === 1 && state.activeGroups[0] === String(s) &&
            state.litPills.length === 1 && state.litPills[0] === String(s));
        } else if (s === 5) {
          check(`${tag}: step 5 illuminates all four groups`,
            state.activeGroups.join(',') === '1,2,3,4' && state.litPills.join(',') === '1,2,3,4');
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Direct interaction: clicking a verse span in the passage selects its group
      await page.locator('.v-seg[data-group="2"]').first().click();
      await page.waitForTimeout(60);
      check(`${tag}: clicking verse group 2 jumps to step 2`,
        await page.locator('#widget').getAttribute('data-step') === '2');

      // Direct interaction: clicking lens pill 4 jumps to step 4
      await page.locator('.lens-pill[data-lens="4"]').click();
      await page.waitForTimeout(60);
      check(`${tag}: clicking lens pill 4 jumps to step 4`,
        await page.locator('#widget').getAttribute('data-step') === '4');

      // Back restores step 3
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Back from step 4 restores step 3`,
        await page.locator('#widget').getAttribute('data-step') === '3');

      // Start Over from step 5 returns to step 0
      await page.locator('.step-dot[data-step="5"]').click();
      await page.waitForTimeout(60);
      await page.locator('#next-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Start Over returns to step 0`,
        await page.locator('#widget').getAttribute('data-step') === '0' &&
        await page.locator('#prev-btn').isDisabled());

      // Zero idle DOM mutations & zero localStorage writes
      await page.waitForTimeout(120);
      await page.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(400);
      check(`${tag}: zero idle DOM mutations`, await page.evaluate(() => window.__idleMut) === 0);
      check(`${tag}: zero localStorage writes`, await page.evaluate(() => window.__marksStorageWrites) === 0);
      check(`${tag}: zero page or HTTP errors`, errors.length === 0 && httpErrors.length === 0);

      console.log(`PASS ${tag}: card=${Math.round(cardHeight)}px widget=${Math.round(widgetHeight)}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  if (localServer) localServer.close();
  console.log(`${passed} 203-10 Marks of a True Christian widget checks passed.`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
