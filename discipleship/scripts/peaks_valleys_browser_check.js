#!/usr/bin/env node
// Serve discipleship/; optionally select Firebase with GT_BASE_URL.
// Isolated contexts, synthetic answers, no account or real learner data.
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const data = require('../data/101-01.json');
const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8802/index.html';
const shots = process.env.GT_SCREENSHOT_DIR;
if (shots) fs.mkdirSync(shots, { recursive: true });
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-101-' + q.id, 'SYN-peaks-' + i]));
seed['question-202-201-09-1'] = 'SYN-peaks-other-course';
let checks = 0;
function ck(label, value) { checks++; assert.ok(value, label); }
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) });
  try {
    for (const width of [375, 390, 1280]) for (const motion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
      const tag = width + '/' + motion;
      try {
        await context.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
        await context.addInitScript(seed => {
          window.__pvStorageWrites = 0;
          for (const name of ['setItem', 'removeItem', 'clear']) {
            const original = Storage.prototype[name];
            Storage.prototype[name] = function (...args) {
              if (location.pathname.includes('peaks-and-valleys.html')) window.__pvStorageWrites++;
              return original.apply(this, args);
            };
          }
          if (window === window.top && !sessionStorage.getItem('pv-seed')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
            sessionStorage.setItem('pv-seed', '1');
          }
        }, seed);
        const page = await context.newPage(), errors = [], assetErrors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.url().includes('peaks-and-valleys.html') && r.status() >= 400) assetErrors.push(r.status()); });
        await page.goto(base + '#101-1');
        const lesson = page.locator('#session-1');
        const frameEl = lesson.locator('iframe[src*="widgets/peaks-and-valleys.html"]');
        await frameEl.waitFor();
        const frame = await (await frameEl.elementHandle()).contentFrame();
        await frame.locator('#next-btn').waitFor();
        await page.waitForTimeout(250);
        ck(tag + ' replaces static example only', await frameEl.count() === 1 && await lesson.locator('img[src*="201.01-peaks-and-valleys.png"]').count() === 0);
        ck(tag + ' all question fields', await lesson.locator('.question-textarea').count() === questions.length);
        for (const [key, value] of Object.entries(seed).filter(([k]) => k.startsWith('question-101-'))) ck(tag + ' restores ' + key, await lesson.locator('#' + key).inputValue() === value);
        ck(tag + ' all prose renders', await lesson.evaluate((el, data) => {
          const norm = s => s.replace(/\s+/g, ' ').trim();
          return data.blocks.filter(b => ['text', 'parable', 'verse'].includes(b.type)).every(b => {
            const div = document.createElement('div'); div.innerHTML = b.text;
            return norm(el.textContent).includes(norm(div.textContent));
          });
        }, data));
        const cardH = await frame.locator('#card-content').evaluate(e => e.clientHeight);
        const storage = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
        for (let step = 0; step <= 6; step++) {
          if (step) await frame.locator('#next-btn').click();
          if (motion === 'reduce') ck(tag + ' reduced motion instant ' + step, await frame.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
          await page.waitForTimeout(motion === 'reduce' ? 40 : 650);
          ck(tag + ' active step ' + step, await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(step));
          ck(tag + ' stable fitting card ' + step, await frame.locator('#card-content').evaluate((e, h) => e.clientHeight === h && e.scrollHeight <= e.clientHeight + 1, cardH));
          ck(tag + ' fitting page/frame ' + step, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          ck(tag + ' full host height ' + step, await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
          ck(tag + ' named native step controls ' + step, await frame.locator('.step-dot').evaluateAll(es => es.length === 7 && es.every(e => e.tagName === 'BUTTON' && e.getAttribute('aria-label'))));
          ck(tag + ' one point per step ' + step, await frame.locator('.node-group.is-visible').count() === step);
          ck(tag + ' nodes only focusable when visible ' + step, await frame.locator('.node-group').evaluateAll(es => es.every(e => e.getAttribute('tabindex') === (e.classList.contains('is-visible') ? '0' : '-1') && e.getAttribute('aria-hidden') === (e.classList.contains('is-visible') ? 'false' : 'true'))));
          if (shots && width === 390 && motion === 'no-preference' && [0, 3, 6].includes(step)) {
            await frameEl.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 100, behavior: 'instant' }));
            await frameEl.screenshot({ path: path.join(shots, 'peaks-390-step' + step + '.png') });
          }
        }
        ck(tag + ' accessible interactive drawing', await frame.locator('.pv-svg').getAttribute('role') === 'group' && (await frame.locator('#pv-svg-desc').textContent()).length > 0);
        await frameEl.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 120, behavior: 'instant' }));
        const nodes = frame.locator('.node-group');
        for (let i = 0; i < await nodes.count(); i++) {
          const node = nodes.nth(i), label = await node.getAttribute('aria-label');
          // The SVG group bounds include its offset text labels; tap the actual
          // point hit circle rather than empty space between point and label.
          await node.locator('circle').first().click();
          ck(tag + ' point opens ' + i, await frame.locator('#card-heading').textContent() === label && await node.getAttribute('aria-pressed') === 'true');
          ck(tag + ' point card fits ' + i, await frame.locator('#card-content').evaluate((e, h) => e.clientHeight === h && e.scrollHeight <= e.clientHeight + 1, cardH));
          await node.focus();
          await page.keyboard.press('Enter');
          ck(tag + ' Enter deselects point ' + i, await node.getAttribute('aria-pressed') === 'false' && await frame.locator('#card-heading').textContent() === '6. High: Growing with God Today');
          await page.keyboard.press('Space');
          ck(tag + ' Space selects point ' + i, await node.getAttribute('aria-pressed') === 'true' && await frame.locator('#card-heading').textContent() === label);
        }
        await frame.locator('#prev-btn').click();
        ck(tag + ' Back instantly restores step', await frame.locator('#widget').evaluate(e => e.classList.contains('is-instant')) && await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '5');
        await frame.locator('.step-dot').last().focus();
        await page.keyboard.press('Space');
        await page.waitForTimeout(motion === 'reduce' ? 40 : 650);
        await frame.locator('#next-btn').focus(); await page.keyboard.press('Enter');
        ck(tag + ' keyboard Start Over', await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === '0' && await frame.locator('#prev-btn').isDisabled());
        await page.waitForTimeout(500);
        await frame.evaluate(() => { window.__pvMutations = 0; new MutationObserver(ms => window.__pvMutations += ms.length).observe(document.getElementById('widget'), { subtree: true, childList: true, attributes: true, characterData: true }); });
        await frameEl.evaluate(e => { window.__pvHeightWrites = 0; new MutationObserver(ms => window.__pvHeightWrites += ms.length).observe(e, { attributes: true, attributeFilter: ['style'] }); });
        await page.waitForTimeout(600);
        ck(tag + ' no idle mutations or resize loop', await frame.evaluate(() => __pvMutations) === 0 && await page.evaluate(() => __pvHeightWrites) === 0);
        await page.setViewportSize({ width, height: 740 }); await page.waitForTimeout(250);
        ck(tag + ' height-only resize stable', await frame.evaluate(() => __pvMutations) === 0 && await page.evaluate(() => __pvHeightWrites) === 0);
        ck(tag + ' widget never writes answers', await frame.evaluate(() => __pvStorageWrites) === 0 && await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === storage);
        const key = 'question-101-' + questions[0].id;
        await lesson.locator('#' + key).fill('SYN-peaks-edited'); await page.reload(); await lesson.waitFor();
        ck(tag + ' edit survives reload', await lesson.locator('#' + key).inputValue() === 'SYN-peaks-edited');
        ck(tag + ' other answers survive', await page.evaluate(({ seed, key }) => { const saved = JSON.parse(localStorage.getItem('christianFoundationsResponses')); return Object.entries(seed).every(([k, v]) => k === key || saved[k] === v); }, { seed, key }));
        await page.locator('#email-lesson-btn').click();
        const outgoing = await page.locator('#export-preview-text').textContent();
        ck(tag + ' Email includes all lesson answers', outgoing.includes('SYN-peaks-edited') && questions.slice(1).every((q, i) => outgoing.includes('SYN-peaks-' + (i + 1))));
        ck(tag + ' Email excludes other course', !outgoing.includes('SYN-peaks-other-course'));
        ck(tag + ' no page or widget HTTP errors', errors.length === 0 && assetErrors.length === 0);
        console.log('PASS ' + tag + ' card=' + cardH);
      } finally { await context.close(); }
    }
    console.log(checks + ' Peaks and Valleys checks passed across 6 cases');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
