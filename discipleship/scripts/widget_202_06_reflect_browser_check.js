#!/usr/bin/env node
/**
 * 202-06 Reflect His Glory standalone widget browser verification.
 * Serve discipleship/ locally and pass REFLECT_BASE_URL
 * (default http://127.0.0.1:8774/widgets/reflect-glory-202.html).
 * Pass REFLECT_SCREENSHOT_DIR to save 390x844 screenshots of every step.
 */
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_PATH = path.join(ROOT, 'widgets', 'reflect-glory-202.html');
const BASE_URL = process.env.REFLECT_BASE_URL || 'http://127.0.0.1:8774/widgets/reflect-glory-202.html';
const SCREENSHOT_DIR = process.env.REFLECT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'Reflect His Glory',
  'Look at Me',
  'The Light Runs Out',
  'Turn to the Light',
  'Made to Reflect',
  'Joy That Lasts'
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

  // Static source hygiene checks
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

        // Title bar & chrome checks
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

        check(`${tag}: title bar reads Reflect His Glory`, chrome.title === 'Reflect His Glory');
        check(`${tag}: lesson tag reads 202-06`, chrome.courseTag === '202-06');
        check(`${tag}: six step dots present`, chrome.dotCount === 6);
        check(`${tag}: all step dots >= 28x28`, chrome.dotsMinSize);
        check(`${tag}: all nav buttons >= 44px tall`, chrome.btnsMinHeight);
        check(`${tag}: card has aria-live polite`, chrome.ariaLive === 'polite');
        if (job.width === 390) {
          check(`${tag}: widget height <= 560px at 390px wide (actual ${chrome.widgetHeight.toFixed(1)}px)`, chrome.widgetHeight <= 560.5);
        }

        const baseCardH = chrome.cardHeight;

        for (let s = 0; s < 6; s++) {
          if (s > 0) await page.locator('#next-btn').click();
          const dur = Number(await page.locator('#scene-root').getAttribute('data-step-dur')) || 0;
          if (job.reducedMotion === 'reduce') {
            const isInstant = await page.locator('#scene-root').evaluate(el => el.classList.contains('is-instant'));
            check(`${tag}: reduced motion snaps instantly on step ${s}`, dur === 0 && isInstant);
          } else if (dur > 0) {
            await page.waitForTimeout(dur + 180);
          } else {
            await page.waitForTimeout(120);
          }

          const state = await page.evaluate(stepIdx => {
            const root = document.getElementById('scene-root');
            const card = document.getElementById('card-content');
            const heading = document.querySelector('.card-heading').textContent.trim();
            const cardText = card.textContent;
            const desc = document.getElementById('glory-svg-desc').textContent.trim();
            const activeDot = document.querySelector('.step-dot[aria-pressed="true"]');
            const rayInOffset = Number(document.getElementById('ray-sun-to-mirror').style.strokeDashoffset);
            const rayOutOffset = Number(document.getElementById('ray-mirror-to-people').style.strokeDashoffset);
            const visiblePoses = Array.from(document.querySelectorAll('.fig-pose.is-visible')).length;
            const sunVis = document.getElementById('layer-sun').classList.contains('is-visible');
            const mirrorVis = document.getElementById('layer-mirror').classList.contains('is-visible');
            const frameVis = document.getElementById('layer-climax-frame').classList.contains('is-visible');
            const mirrorLine = document.getElementById('mirror-surface');
            const mDx = Number(mirrorLine.getAttribute('x2')) - Number(mirrorLine.getAttribute('x1'));
            const mDy = Number(mirrorLine.getAttribute('y2')) - Number(mirrorLine.getAttribute('y1'));
            return {
              dataStep: root.getAttribute('data-step'),
              activeDotStep: activeDot ? activeDot.getAttribute('data-step') : '',
              heading,
              cardText,
              desc,
              cardH: card.getBoundingClientRect().height,
              cardScrollH: card.scrollHeight,
              cardClientH: card.clientHeight,
              widgetH: root.getBoundingClientRect().height,
              docScrollW: document.documentElement.scrollWidth,
              winW: window.innerWidth,
              visiblePoses,
              sunVis,
              mirrorVis,
              frameVis,
              rayInOffset,
              rayOutOffset,
              mirrorAngleDeg: Math.round(Math.atan2(mDy, mDx) * 180 / Math.PI),
              storageWrites: window.__storageWrites
            };
          }, s);

          check(`${tag}: step ${s} active state matches`, state.dataStep === String(s) && state.activeDotStep === String(s));
          check(`${tag}: step ${s} heading matches`, state.heading === EXPECTED_HEADINGS[s]);
          check(`${tag}: step ${s} no forbidden copy words`, !/\b(tap|click|widget|diagram)\b/i.test(state.cardText));
          check(`${tag}: step ${s} no em dashes in card`, !state.cardText.includes('\u2014'));
          check(`${tag}: step ${s} SVG desc non-empty`, state.desc.length > 10);
          check(`${tag}: step ${s} constant card height (${state.cardH.toFixed(1)} vs ${baseCardH.toFixed(1)})`, Math.abs(state.cardH - baseCardH) <= 1.5);
          check(`${tag}: step ${s} card content fits without clipping`, state.cardScrollH <= state.cardClientH + 1);
          check(`${tag}: step ${s} zero horizontal overflow (${state.docScrollW}/${state.winW})`, state.docScrollW <= state.winW + 1);
          check(`${tag}: step ${s} zero localStorage writes`, state.storageWrites === 0);

          if (s === 0) {
            check(`${tag}: step 0 draws nothing`, state.visiblePoses === 0 && !state.sunVis && !state.mirrorVis);
          } else if (s === 1 || s === 2) {
            check(`${tag}: step ${s} draws four figures without sun`, state.visiblePoses === 4 && !state.sunVis && !state.mirrorVis);
          } else if (s === 3) {
            check(`${tag}: step 3 draws sun and four figures`, state.visiblePoses === 4 && state.sunVis && !state.mirrorVis);
          } else if (s === 4) {
            check(`${tag}: step 4 draws 45-degree mirror and completed reflected rays`,
              state.visiblePoses === 4 && state.sunVis && state.mirrorVis && state.mirrorAngleDeg === 45 &&
              state.rayInOffset <= 0.1 && state.rayOutOffset <= 0.1);
          } else if (s === 5) {
            check(`${tag}: step 5 draws climax frame and all elements`,
              state.visiblePoses === 4 && state.sunVis && state.mirrorVis && state.frameVis &&
              state.rayInOffset <= 0.1 && state.rayOutOffset <= 0.1);
          }

          if (SCREENSHOT_DIR && job.width === 390 && job.reducedMotion === 'no-preference') {
            await page.locator('#scene-root').screenshot({
              path: path.join(SCREENSHOT_DIR, `reflect-step-${s}.png`)
            });
          }
        }

        // Back button restores prior state instantly (step 5 -> step 4 -> step 3)
        await page.locator('#prev-btn').click();
        await page.waitForTimeout(80);
        const afterBack4 = await page.evaluate(() => ({
          step: document.getElementById('scene-root').getAttribute('data-step'),
          instant: document.getElementById('scene-root').classList.contains('is-instant'),
          frameVis: document.getElementById('layer-climax-frame').classList.contains('is-visible'),
          mirrorVis: document.getElementById('layer-mirror').classList.contains('is-visible'),
          rayOutOffset: Number(document.getElementById('ray-mirror-to-people').style.strokeDashoffset)
        }));
        check(`${tag}: Back from 5 restores step 4 instantly`,
          afterBack4.step === '4' && afterBack4.instant && !afterBack4.frameVis && afterBack4.mirrorVis && afterBack4.rayOutOffset <= 0.1);

        await page.locator('#prev-btn').click();
        await page.waitForTimeout(80);
        const afterBack3 = await page.evaluate(() => ({
          step: document.getElementById('scene-root').getAttribute('data-step'),
          mirrorVis: document.getElementById('layer-mirror').classList.contains('is-visible'),
          sunVis: document.getElementById('layer-sun').classList.contains('is-visible')
        }));
        check(`${tag}: Back from 4 restores step 3 cleanly`,
          afterBack3.step === '3' && !afterBack3.mirrorVis && afterBack3.sunVis);

        // Start Over resets cleanly from step 5 to step 0
        await page.locator('.step-dot[data-step="5"]').click();
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

  console.log(`PASS: ${passed} checks passed for Reflect His Glory (375, 390, 1280, reduced motion).`);
})();
