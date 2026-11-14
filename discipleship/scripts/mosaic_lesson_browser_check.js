#!/usr/bin/env node
// Serve discipleship/ first. GT_BASE_URL may select an exact Firebase preview.
// All answers are synthetic and confined to isolated browser contexts.
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const data = require('../data/202-05.json');
const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8801/index.html';
const shots = process.env.GT_SCREENSHOT_DIR;
if (shots) fs.mkdirSync(shots, { recursive: true });
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-202-' + q.id, 'SYN-mosaic-' + i]));
const retired = data.retiredQuestions || [];
const retiredKeys = retired.map(q => 'question-202-' + q.id);
for (const key of retiredKeys) seed[key] = 'SYN-mosaic-retired-' + key;
seed['question-201-201-01-1'] = 'SYN-other-course';
let checks = 0;
function ck(label, value) { checks++; assert.ok(value, label); }
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) });
  try {
    for (const width of [375, 390, 1280]) for (const motion of ['no-preference', 'reduce']) {
      const tag = width + '/' + motion;
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
      try {
        await context.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
        await context.addInitScript(seed => {
          window.__mosaicWrites = 0;
          for (const method of ['setItem', 'removeItem', 'clear']) {
            const original = Storage.prototype[method];
            Storage.prototype[method] = function (...args) {
              if (location.pathname.includes('trust-the-artist.html')) window.__mosaicWrites++;
              return original.apply(this, args);
            };
          }
          if (window === window.top && !sessionStorage.getItem('mosaic-seeded')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
            sessionStorage.setItem('mosaic-seeded', '1');
          }
        }, seed);
        const page = await context.newPage(), errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + '#202-5');
        const lesson = page.locator('#session-5');
        const frameEl = lesson.locator('iframe[src*="widgets/trust-the-artist.html"]');
        await frameEl.waitFor();
        const frame = await (await frameEl.elementHandle()).contentFrame();
        await frame.locator('#next-btn').waitFor();
        await page.waitForTimeout(300);
        ck(tag + ' single mosaic replacing valley embed', await frameEl.count() === 1 && await lesson.locator('iframe[src*="valley-road.html"]').count() === 0);
        ck(tag + ' immediately after cross and before care', await frameEl.evaluate(el => {
          const block = el.closest('.block-widget');
          return block.previousElementSibling.textContent.startsWith('The clearest proof is the cross.') && block.nextElementSibling.textContent.startsWith('A word of care.');
        }));
        ck(tag + ' all original fields', await lesson.locator('.question-textarea').count() === questions.length);
        for (const [key, value] of Object.entries(seed).filter(([k]) => k.startsWith('question-202-') && !retiredKeys.includes(k))) {
          ck(tag + ' restores ' + key, await lesson.locator('#' + key).inputValue() === value);
        }
        for (const key of retiredKeys) ck(tag + ' retired field absent but saved answer retained', await lesson.locator('#' + key).count() === 0 && await page.evaluate(key => JSON.parse(localStorage.getItem('christianFoundationsResponses'))[key], key) === seed[key]);
        const cardH = await frame.locator('#card-content').evaluate(e => e.clientHeight);
        const storage = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
        for (let step = 0; step <= 5; step++) {
          if (step) await frame.locator('#next-btn').click();
          await page.waitForTimeout(motion === 'reduce' ? 40 : step === 4 ? 1950 : 1050);
          ck(tag + ' state ' + step, await frame.locator('#widget').getAttribute('data-step') === String(step));
          ck(tag + ' card fits ' + step, await frame.locator('#card-content').evaluate((e, h) => e.clientHeight === h && e.scrollHeight <= e.clientHeight + 1, cardH));
          ck(tag + ' page/frame width fits ' + step, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          ck(tag + ' host includes controls ' + step, await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
          if (shots && width === 390 && motion === 'no-preference' && [0, 3, 5].includes(step)) {
            await frameEl.screenshot({ path: path.join(shots, 'mosaic-390-step' + step + '.png') });
          }
        }
        await frame.locator('#prev-btn').click();
        ck(tag + ' Back', await frame.locator('#widget').getAttribute('data-step') === '4');
        await frame.locator('.step-dot-btn').last().focus();
        await page.keyboard.press('Space');
        ck(tag + ' keyboard selects final', await frame.locator('#widget').getAttribute('data-step') === '5');
        await frame.locator('#next-btn').focus();
        await page.keyboard.press('Enter');
        ck(tag + ' keyboard Start Over', await frame.locator('#widget').getAttribute('data-step') === '0' && await frame.locator('#prev-btn').isDisabled());
        await page.waitForTimeout(250);
        await frameEl.evaluate(e => { window.__heightWrites = 0; new MutationObserver(ms => window.__heightWrites += ms.length).observe(e, { attributes: true, attributeFilter: ['style'] }); });
        await page.waitForTimeout(600);
        ck(tag + ' no idle resizing loop', await page.evaluate(() => __heightWrites) === 0);
        ck(tag + ' widget leaves saved answers untouched', await frame.evaluate(() => __mosaicWrites) === 0 && await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === storage);
        const key = 'question-202-' + questions[0].id;
        await lesson.locator('#' + key).fill('SYN-mosaic-edited');
        await page.reload();
        await lesson.waitFor();
        ck(tag + ' edit survives reload', await lesson.locator('#' + key).inputValue() === 'SYN-mosaic-edited');
        ck(tag + ' other saved answers survive', await page.evaluate(({ seed, key }) => {
          const saved = JSON.parse(localStorage.getItem('christianFoundationsResponses'));
          return Object.entries(seed).every(([k, v]) => k === key || saved[k] === v);
        }, { seed, key }));
        await page.locator('#email-lesson-btn').click();
        const outgoing = await page.locator('#export-preview-text').textContent();
        ck(tag + ' Email includes edited and previous answers', outgoing.includes('SYN-mosaic-edited') && questions.slice(1).every((q, i) => outgoing.includes('SYN-mosaic-' + (i + 1))));
        ck(tag + ' Email excludes other course', !outgoing.includes('SYN-other-course'));
        for (const key of retiredKeys) ck(tag + ' Email preserves earlier response', outgoing.includes('Earlier saved responses') && outgoing.includes(seed[key]) && retired.some(q => outgoing.includes(q.text)));
        ck(tag + ' no page errors', errors.length === 0);
        console.log('PASS ' + tag);
      } finally { await context.close(); }
    }
    console.log(checks + ' mosaic lesson integration checks passed across 6 cases');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
