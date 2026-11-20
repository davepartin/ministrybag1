#!/usr/bin/env node
/**
 * 203-10 Marks of a True Christian (Romans 12:9-21) standalone widget browser verification.
 * Optionally pass MARKS_BASE_URL to test a live preview URL.
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
  'A Life Shaped by Jesus',
  '1. Love Sincerely',
  '2. Keep Following Jesus',
  '3. Share Life Humbly',
  '4. Love Through Conflict',
  'The love you have received becomes the love you give.'
];

const EXPECTED_COUNTS = [0, 4, 5, 5, 6, 0];

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

      const tabLabels = await page.locator('.tab-btn').allTextContents();
      check(`${tag}: four expected tab labels`,
        tabLabels.join('|') === 'Sincere Love|Faithfulness|Humility|Loving Enemies');

      const sizesOk = await page.evaluate(() => {
        const navOk = Array.from(document.querySelectorAll('.nav-btn')).every(b => b.getBoundingClientRect().height >= 44);
        const dotOk = Array.from(document.querySelectorAll('.step-dot')).every(b => {
          const r = b.getBoundingClientRect();
          return r.width >= 28 && r.height >= 28;
        });
        const tabOk = Array.from(document.querySelectorAll('.tab-btn')).every(b => b.getBoundingClientRect().height >= 30);
        return navOk && dotOk && tabOk;
      });
      check(`${tag}: buttons >= 44px, dots >= 28x28, tabs >= 30px`, sizesOk);

      if (job.width === 390) {
        check(`${tag}: total widget height <= 595px (${Math.round(widgetHeight)}px)`, widgetHeight <= 595);
      }

      for (let s = 0; s < stepCount; s++) {
        if (s > 0) await page.locator('#next-btn').click();
        const dur = Number(await page.locator('#widget').getAttribute('data-step-dur')) || 0;
        if (job.reducedMotion === 'reduce') {
          check(`${tag}: reduced motion instant step ${s}`, dur === 0);
        }
        await page.waitForTimeout(dur ? dur + 200 : 80);

        check(`${tag}: active dot step ${s}`,
          await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: heading matches step ${s}`,
          await page.locator('#card-heading').textContent() === EXPECTED_HEADINGS[s]);
        check(`${tag}: bullet count matches step ${s}`,
          await page.locator('#action-list li').count() === EXPECTED_COUNTS[s]);
        check(`${tag}: constant card height step ${s}`,
          await page.locator('#card-content').evaluate((e, h) => Math.abs(e.getBoundingClientRect().height - h) <= 1, cardHeight));
        check(`${tag}: card content fits step ${s}`,
          await page.locator('#card-content').evaluate(e => e.scrollHeight <= e.clientHeight + 1));
        check(`${tag}: zero horizontal overflow step ${s}`,
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

        const vis = await page.evaluate(() => {
          const cls = id => document.getElementById(id).classList;
          return {
            s1: cls('scene-1').contains('is-shown') || cls('scene-1').contains('is-dim'),
            s2: cls('scene-2').contains('is-shown') || cls('scene-2').contains('is-dim'),
            s3: cls('scene-3').contains('is-shown') || cls('scene-3').contains('is-dim'),
            s4: cls('scene-4').contains('is-shown'),
            s1Full: cls('scene-1').contains('is-shown'),
            s2Full: cls('scene-2').contains('is-shown'),
            s3Full: cls('scene-3').contains('is-shown'),
            frame: cls('finish-frame').contains('is-shown'),
            graceVisible: !document.getElementById('card-grace').hidden
          };
        });

        if (s === 0) {
          check(`${tag}: step 0 open table ready`, !vis.s1 && !vis.s2 && !vis.s3 && !vis.s4);
        } else if (s === 1) {
          check(`${tag}: step 1 sincere love visible`, vis.s1Full && !vis.s2);
        } else if (s === 2) {
          check(`${tag}: step 2 sharing bread visible`, vis.s1 && vis.s2Full && !vis.s3);
        } else if (s === 3) {
          check(`${tag}: step 3 sitting with grieving visible`, vis.s2 && vis.s3Full && !vis.s4);
        } else if (s === 4) {
          check(`${tag}: step 4 welcoming outsider visible`, vis.s3 && vis.s4 && !vis.frame);
        } else if (s === 5) {
          check(`${tag}: step 5 whole table visible with grace line`,
            vis.s1Full && vis.s2Full && vis.s3Full && vis.s4 && vis.frame && vis.graceVisible);
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Direct tab jump works
      await page.locator('.tab-btn[data-tab="3"]').click();
      await page.waitForTimeout(80);
      check(`${tag}: Humility tab jumps to step 3`,
        await page.locator('#widget').getAttribute('data-step') === '3');

      // Back restores step 2
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Back restores step 2`,
        await page.locator('#widget').getAttribute('data-step') === '2');

      // Full passage disclosure opens cleanly and contains Romans 12:9-21 text
      await page.locator('#full-passage summary').click();
      await page.waitForTimeout(60);
      const passageOpen = await page.locator('#full-passage').evaluate(el => el.open && el.textContent.includes('Let love be genuine') && el.textContent.includes('overcome evil with good'));
      check(`${tag}: Read the full passage opens with full Romans 12:9-21`, passageOpen);
      if (SCREENSHOT_DIR && tag === '390/no-preference') {
        await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, 'full-passage-open.png') });
      }
      await page.locator('#full-passage summary').click();
      await page.waitForTimeout(60);

      // Start Over from step 5 returns to step 0
      await page.locator('.step-dot[data-step="5"]').click();
      await page.waitForTimeout(80);
      await page.locator('#next-btn').click();
      await page.waitForTimeout(80);
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
