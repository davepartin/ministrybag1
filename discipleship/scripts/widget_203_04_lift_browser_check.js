#!/usr/bin/env node
/**
 * 203-04 Who Can I Lift? whiteboard widget browser verification.
 * Serve discipleship/ locally and pass LIFT_BASE_URL
 * (default http://127.0.0.1:8779/widgets/who-can-i-lift-203.html).
 * Pass LIFT_SCREENSHOT_DIR to save 390x844 screenshots of every step.
 */
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_PATH = path.join(ROOT, 'widgets', 'who-can-i-lift-203.html');
const BASE_URL = process.env.LIFT_BASE_URL || 'http://127.0.0.1:8779/widgets/who-can-i-lift-203.html';
const SCREENSHOT_DIR = process.env.LIFT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'Who Can I Lift?',
  'He Lifted You First',
  'Everyone Wants the Best Seat',
  'Greatness Turned Over',
  'What\'s in Your Hands',
  'Lift Up Jesus',
  'The Last Will Be First'
];

const JOBS = [
  { width: 375, height: 667, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'no-preference' },
  { width: 1280, height: 800, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'reduce' }
];

(async () => {
  let passed = 0;
  function check(name, ok) {
    assert.ok(ok, name);
    passed += 1;
  }

  const html = fs.readFileSync(WIDGET_PATH, 'utf8');
  check('source has zero em dashes (U+2014)', !html.includes('\u2014'));
  check('source has zero en dashes (U+2013)', !html.includes('\u2013'));
  check('source has no localStorage reference', !/\blocalStorage\b/.test(html));
  const externalUrls = (html.match(/https?:\/\/[^\s"'<>)]+/gi) || []).filter(u => u !== 'http://www.w3.org/2000/svg');
  check('source has no external stylesheet, font, image, or script URLs', externalUrls.length === 0);

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {})
  });

  try {
    for (const job of JOBS) {
      const tag = `${job.width}/${job.reducedMotion}`;
      const ctx = await browser.newContext({
        viewport: { width: job.width, height: job.height },
        deviceScaleFactor: job.width === 390 && job.reducedMotion === 'no-preference' ? 2 : 1,
        reducedMotion: job.reducedMotion
      });

      try {
        await ctx.addInitScript(() => {
          window.__storageWrites = 0;
          for (const method of ['setItem', 'removeItem', 'clear']) {
            const orig = Storage.prototype[method];
            Storage.prototype[method] = function (...args) {
              window.__storageWrites += 1;
              return orig.apply(this, args);
            };
          }
        });

        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
        page.on('console', msg => {
          if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
        });

        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.locator('#next-btn').waitFor();
        await page.waitForTimeout(120);

        const chrome = await page.evaluate(() => {
          const h1 = document.querySelector('.title-bar h1');
          const tagEl = document.querySelector('.course-tag');
          const dots = Array.from(document.querySelectorAll('.step-dot'));
          const btns = Array.from(document.querySelectorAll('.nav-btn'));
          const card = document.getElementById('card-content');
          return {
            title: h1 ? h1.textContent.trim() : '',
            courseTag: tagEl ? tagEl.textContent.trim() : '',
            dotCount: dots.length,
            dotsMinSize: dots.every(d => d.getBoundingClientRect().width >= 28 && d.getBoundingClientRect().height >= 28),
            btnsMinHeight: btns.every(b => b.getBoundingClientRect().height >= 44),
            ariaLive: card ? card.getAttribute('aria-live') : '',
            cardHeight: card ? card.getBoundingClientRect().height : 0,
            widgetHeight: document.getElementById('scene-root').getBoundingClientRect().height
          };
        });

        check(`${tag}: title bar reads Who Can I Lift?`, chrome.title === 'Who Can I Lift?');
        check(`${tag}: lesson tag reads 203-04`, chrome.courseTag === '203-04');
        check(`${tag}: seven step dots present (start + 6 steps)`, chrome.dotCount === 7);
        check(`${tag}: all step dots >= 28x28`, chrome.dotsMinSize);
        check(`${tag}: all nav buttons >= 44px tall`, chrome.btnsMinHeight);
        check(`${tag}: card has aria-live polite`, chrome.ariaLive === 'polite');
        if (job.width === 390) {
          check(`${tag}: widget height <= 580px at 390px wide (actual ${chrome.widgetHeight.toFixed(1)}px)`, chrome.widgetHeight <= 580.5);
        }

        const baseCardH = chrome.cardHeight;

        for (let s = 0; s < 7; s++) {
          if (s > 0) await page.locator('#next-btn').click();
          const dur = Number(await page.locator('#scene-root').getAttribute('data-step-dur')) || 0;
          if (job.reducedMotion === 'reduce') {
            const isInstant = await page.locator('#scene-root').evaluate(el => el.classList.contains('is-instant'));
            check(`${tag}: reduced motion snaps instantly on step ${s}`, dur === 0 && isInstant);
          } else if (dur > 0) {
            await page.waitForTimeout(dur + 200);
          } else {
            await page.waitForTimeout(520);
          }

          const state = await page.evaluate(() => {
            const root = document.getElementById('scene-root');
            const card = document.getElementById('card-content');
            const heading = document.querySelector('.card-heading').textContent.trim();
            const cardText = card.textContent;
            const desc = document.getElementById('lift-svg-desc').textContent.trim();
            const activeDot = document.querySelector('.step-dot[aria-pressed="true"]');
            return {
              dataStep: root.getAttribute('data-step'),
              activeDotStep: activeDot ? activeDot.getAttribute('data-step') : '',
              heading,
              cardText,
              desc,
              cardH: card.getBoundingClientRect().height,
              cardScrollH: card.scrollHeight,
              cardClientH: card.clientHeight,
              docScrollW: document.documentElement.scrollWidth,
              winW: window.innerWidth,
              ladderDim: document.getElementById('layer-ladder').classList.contains('is-dim'),
              s1Vis: document.getElementById('layer-step-1').classList.contains('is-visible'),
              climbersVis: document.getElementById('layer-climbers').classList.contains('is-visible'),
              servantPitVis: document.getElementById('layer-servant-pit').classList.contains('is-visible'),
              ropeVis: document.getElementById('layer-rope').classList.contains('is-visible'),
              jesusSkyVis: document.getElementById('layer-jesus-sky').classList.contains('is-visible'),
              beamVis: document.getElementById('layer-finish-beam').classList.contains('is-visible'),
              exaltedTransform: document.getElementById('exalted-figure').getAttribute('transform'),
              storageWrites: window.__storageWrites
            };
          });

          check(`${tag}: step ${s} active state matches`, state.dataStep === String(s) && state.activeDotStep === String(s));
          check(`${tag}: step ${s} heading matches`, state.heading === EXPECTED_HEADINGS[s]);
          check(`${tag}: step ${s} no forbidden copy words`, !/\b(tap|click|widget|diagram)\b/i.test(state.cardText));
          check(`${tag}: step ${s} no em dashes in card`, !state.cardText.includes('\u2014'));
          check(`${tag}: step ${s} SVG desc non-empty`, state.desc.length > 10);
          check(`${tag}: step ${s} constant card height (${state.cardH.toFixed(1)} vs ${baseCardH.toFixed(1)})`, Math.abs(state.cardH - baseCardH) <= 1.5);
          check(`${tag}: step ${s} card content fits without clipping`, state.cardScrollH <= state.cardClientH + 1);
          check(`${tag}: step ${s} zero horizontal overflow (${state.docScrollW}/${state.winW})`, state.docScrollW <= state.winW + 1);
          check(`${tag}: step ${s} zero localStorage writes`, state.storageWrites === 0);

          if (s === 0) check(`${tag}: step 0 ladder and pit base`, !state.s1Vis && !state.climbersVis && !state.beamVis);
          if (s === 1) check(`${tag}: step 1 Jesus lifts you first`, state.s1Vis);
          if (s === 2) check(`${tag}: step 2 climbers push up ladder`, state.climbersVis);
          if (s === 3) check(`${tag}: step 3 servant climbs down into pit`, state.servantPitVis && !state.ropeVis);
          if (s === 4) check(`${tag}: step 4 rope and gift tags visible`, state.servantPitVis && state.ropeVis);
          if (s === 5) check(`${tag}: step 5 lifted onto rock pointing to Jesus`, state.jesusSkyVis && !state.beamVis);
          if (s === 6) check(`${tag}: step 6 light falls on servant and ladder dims`, state.beamVis && state.ladderDim && state.exaltedTransform === 'translate(0, 0)');

          if (SCREENSHOT_DIR && job.width === 390 && job.reducedMotion === 'no-preference') {
            await page.locator('#scene-root').screenshot({
              path: path.join(SCREENSHOT_DIR, `lift-step-${s}.png`)
            });
          }
        }

        // Back restores prior step instantly (6 -> 5 -> 4)
        await page.locator('#prev-btn').click();
        await page.waitForTimeout(80);
        const afterBack5 = await page.evaluate(() => ({
          step: document.getElementById('scene-root').getAttribute('data-step'),
          instant: document.getElementById('scene-root').classList.contains('is-instant'),
          beamVis: document.getElementById('layer-finish-beam').classList.contains('is-visible'),
          jesusVis: document.getElementById('layer-jesus-sky').classList.contains('is-visible')
        }));
        check(`${tag}: Back from 6 restores step 5 instantly`,
          afterBack5.step === '5' && afterBack5.instant && !afterBack5.beamVis && afterBack5.jesusVis);

        // Start Over returns to step 0
        await page.locator('.step-dot[data-step="6"]').click();
        await page.waitForTimeout(80);
        await page.locator('#next-btn').click();
        await page.waitForTimeout(80);
        check(`${tag}: Start Over returns to step 0`,
          await page.locator('#scene-root').getAttribute('data-step') === '0');

        check(`${tag}: zero page or console errors`, errors.length === 0);
      } finally {
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`PASS: ${passed} checks passed for Who Can I Lift? 203-04 (375, 390, 1280, reduced motion).`);
})();
