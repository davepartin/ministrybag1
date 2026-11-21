#!/usr/bin/env node
/**
 * 202-07 Open Hands standalone widget browser verification.
 * Optionally pass HANDS_BASE_URL to test a live preview URL.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_FILE = path.join(ROOT, 'widgets', 'open-hands-202.html');
const SCREENSHOT_DIR = process.env.HANDS_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'Open Hands',
  'God Gives First',
  'Time, Talents, Treasure',
  'The Closed Fist',
  'The Open Hand',
  'God Owns It All'
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
    throw new Error('FAIL: Em dash found in widgets/open-hands-202.html');
  }
  const visibleHtml = sourceText.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  for (const forbidden of ['tap', 'click', 'widget', 'diagram']) {
    if (new RegExp(`\\b${forbidden}\\b`, 'i').test(visibleHtml.replace(/<[^>]+>/g, ' '))) {
      throw new Error(`FAIL: Forbidden visible word "${forbidden}" found in HTML copy`);
    }
  }

  let localServer = null;
  let BASE = process.env.HANDS_BASE_URL || '';
  if (!BASE) {
    localServer = http.createServer((req, res) => {
      if (req.url && req.url.includes('favicon.ico')) {
        res.writeHead(404);
        res.end();
        return;
      }
      const html = fs.readFileSync(WIDGET_FILE);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    await new Promise(resolve => localServer.listen(0, '127.0.0.1', resolve));
    BASE = `http://127.0.0.1:${localServer.address().port}/widgets/open-hands-202.html`;
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
        window.__handsStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            window.__handsStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
      });

      const page = await ctx.newPage();
      const errors = [];
      const consoleErrors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const loc = msg.location ? (msg.location().url || '') : '';
          if (!msg.text().includes('favicon.ico') && !loc.includes('favicon.ico')) {
            consoleErrors.push(`${msg.text()} (${loc})`);
          }
        }
      });
      page.on('response', r => {
        if (r.status() >= 400 && !r.url().includes('favicon.ico')) {
          httpErrors.push(`${r.status()} ${r.url()}`);
        }
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
        await page.waitForTimeout(dur ? dur + 460 : 100);

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

        const vis = await page.evaluate(() => {
          const op = id => Number(getComputedStyle(document.getElementById(id)).opacity);
          return {
            god: op('hand-god'),
            cupped: op('hand-you-cupped'),
            fist: op('hand-you-fist'),
            giving: op('hand-you-giving'),
            other: op('hand-other'),
            objs: ['obj-time', 'obj-talents', 'obj-treasure'].map(op),
            lbls: ['lbl-time', 'lbl-talents', 'lbl-treasure'].map(op),
            frameOuter: op('frame-outer'),
            frameOffset: Number(document.getElementById('frame-outer').style.strokeDashoffset || 0)
          };
        });

        if (s === 0) {
          check(`${tag}: step 0 nothing drawn`, vis.god === 0 && vis.cupped === 0 && vis.fist === 0 && vis.giving === 0 && vis.other === 0);
        } else if (s === 1) {
          check(`${tag}: step 1 God hand drawn`, vis.god === 1 && vis.cupped === 0);
        } else if (s === 2) {
          check(`${tag}: step 2 cupped hand + 3 objects + 3 labels`,
            vis.god === 1 && vis.cupped === 1 && vis.fist === 0 && vis.objs.every(v => v === 1) && vis.lbls.every(v => v === 1));
        } else if (s === 3) {
          check(`${tag}: step 3 closed fist + objects hidden + labels faded`,
            vis.fist === 1 && vis.cupped === 0 && vis.giving === 0 && vis.objs.every(v => v === 0) && vis.lbls.every(v => v === 0));
        } else if (s === 4) {
          check(`${tag}: step 4 open hand + other hand + all 3 objects + labels`,
            vis.giving === 1 && vis.fist === 0 && vis.other === 1 && vis.objs.every(v => v === 1) && vis.lbls.every(v => v === 1) && vis.frameOuter === 0);
        } else if (s === 5) {
          check(`${tag}: step 5 whole picture + double hairline frame`,
            vis.god === 1 && vis.giving === 1 && vis.other === 1 && vis.objs.every(v => v === 1) && vis.lbls.every(v => v === 1) && vis.frameOuter === 1 && vis.frameOffset === 0);
        }

        if (SCREENSHOT_DIR && tag === '390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Back from step 5 -> step 4 hides frame instantly and keeps open hand + 3 objects
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Back from step 5 restores step 4 instantly`,
        await page.locator('#widget').getAttribute('data-step') === '4' &&
        await page.locator('#widget').getAttribute('data-step-dur') === '0' &&
        await page.evaluate(() => Number(getComputedStyle(document.getElementById('frame-outer')).opacity) === 0 && Number(getComputedStyle(document.getElementById('hand-other')).opacity) === 1));

      // Back from step 4 -> step 3 restores closed fist instantly
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Back from step 4 restores step 3 closed fist instantly`,
        await page.locator('#widget').getAttribute('data-step') === '3' &&
        await page.evaluate(() => Number(getComputedStyle(document.getElementById('hand-you-fist')).opacity) === 1 && Number(getComputedStyle(document.getElementById('hand-other')).opacity) === 0));

      // Keyboard Space on final dot reaches step 5
      await page.locator('.step-dot').last().focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(80);
      check(`${tag}: Space on final dot reaches step 5`,
        await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '5');

      // Start Over returns to step 0
      await page.locator('#next-btn').click();
      await page.waitForTimeout(80);
      check(`${tag}: Start Over returns to step 0`,
        await page.locator('#widget').getAttribute('data-step') === '0' &&
        await page.locator('#prev-btn').isDisabled());

      // Zero idle DOM mutations & zero localStorage writes
      await page.waitForTimeout(140);
      await page.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(450);
      check(`${tag}: zero idle DOM mutations`, await page.evaluate(() => window.__idleMut) === 0);
      check(`${tag}: zero localStorage writes`, await page.evaluate(() => window.__handsStorageWrites) === 0);
      check(`${tag}: zero page, console, or HTTP errors (${[...errors, ...consoleErrors, ...httpErrors].join('; ')})`,
        errors.length === 0 && consoleErrors.length === 0 && httpErrors.length === 0);

      console.log(`PASS ${tag}: card=${Math.round(cardHeight)}px widget=${Math.round(widgetHeight)}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  if (localServer) localServer.close();
  console.log(`${passed} 202-07 Open Hands widget checks passed.`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
