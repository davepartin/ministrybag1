#!/usr/bin/env node
// Serve discipleship/ first. GT_BASE_URL selects local or exact hosted preview.
// Isolated contexts and synthetic answers only; account.js is stubbed.
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const data = require('../data/201-05.json');
const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8803/index.html';
const screenshots = process.env.GT_SCREENSHOT_DIR;
if (screenshots) fs.mkdirSync(screenshots, { recursive: true });
const expected = ['One Library, One Story', 'The Law', 'History', 'Poetry and Wisdom', 'Major Prophets', 'Minor Prophets', 'The Gospels', 'Acts', "Paul's Letters", 'Other Letters', 'Revelation'];
const counts = [5, 12, 5, 5, 12, 4, 1, 13, 8, 1];
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-201-' + q.id, 'SYN-bookshelf-' + i]));
seed['question-101-1-1'] = 'SYN-bookshelf-other-course';
let checks = 0;
function ck(label, ok) { checks++; assert.ok(ok, label); }
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) });
  try {
    for (const width of [375, 390, 1280]) for (const motion of ['no-preference', 'reduce']) {
      const tag = width + '/' + motion;
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
      try {
        await context.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
        await context.addInitScript(seed => {
          window.__bookshelfWrites = 0;
          for (const name of ['setItem', 'removeItem', 'clear']) {
            const original = Storage.prototype[name];
            Storage.prototype[name] = function (...args) {
              if (location.pathname.includes('bible-bookshelf2.html')) window.__bookshelfWrites++;
              return original.apply(this, args);
            };
          }
          if (window === window.top && !sessionStorage.getItem('bookshelf-seeded')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
            sessionStorage.setItem('bookshelf-seeded', '1');
          }
        }, seed);
        const page = await context.newPage(), errors = [], assetErrors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.url().includes('bible-bookshelf2.html') && r.status() >= 400) assetErrors.push(r.status()); });
        await page.goto(base + '#201-5');
        const lesson = page.locator('#session-5');
        const frameEl = lesson.locator('iframe[src*="widgets/bible-bookshelf2.html"]');
        await frameEl.waitFor();
        const frame = await (await frameEl.elementHandle()).contentFrame();
        await frame.locator('#next-btn').waitFor();
        await page.waitForTimeout(250);
        ck(tag + ' one new bookshelf replaces old embed', await frameEl.count() === 1 && await lesson.locator('iframe[src*="widgets/bible-bookshelf.html"]').count() === 0);
        ck(tag + ' original question fields', await lesson.locator('.question-textarea').count() === questions.length);
        for (const [key, value] of Object.entries(seed).filter(([k]) => k.startsWith('question-201-'))) ck(tag + ' restores ' + key, await lesson.locator('#' + key).inputValue() === value);
        ck(tag + ' all existing prose renders', await lesson.evaluate((el, data) => {
          const norm = s => s.replace(/\s+/g, ' ').trim();
          return data.blocks.filter(b => ['text', 'parable', 'verse'].includes(b.type)).every(b => {
            const div = document.createElement('div'); div.innerHTML = b.text;
            return norm(el.textContent).includes(norm(div.textContent));
          });
        }, data));
        const cardHeight = await frame.locator('#card-content').evaluate(e => e.clientHeight);
        const initialStorage = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
        const allBooks = [];
        for (let step = 0; step <= 10; step++) {
          if (step) await frame.locator('#next-btn').click();
          await page.waitForTimeout(motion === 'reduce' ? 25 : 280);
          ck(tag + ' state ' + step, await frame.locator('#widget').getAttribute('data-step') === String(step) && await frame.locator('#card-heading').textContent() === expected[step]);
          ck(tag + ' stable fitting card ' + step, await frame.locator('#card-content').evaluate((e, h) => e.clientHeight === h && e.scrollHeight <= e.clientHeight + 1, cardHeight));
          ck(tag + ' page and frame width fit ' + step, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          ck(tag + ' parent includes full widget ' + step, await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
          ck(tag + ' card heading and badge fit ' + step, await frame.locator('.card-top').evaluate(e => [...e.children].every(c => c.getBoundingClientRect().right <= e.getBoundingClientRect().right + 1)));
          if (step) {
            const books = await frame.locator('#book-chips .book-chip').allTextContents();
            ck(tag + ' correct shelf size ' + step, books.length === counts[step - 1]);
            allBooks.push(...books);
          }
          if (screenshots && width === 390 && motion === 'no-preference' && [0, 3, 8, 10].includes(step)) await frameEl.screenshot({ path: path.join(screenshots, 'bookshelf-390-step' + step + '.png') });
        }
        ck(tag + ' canonical 66 unique books in order', allBooks.length === 66 && new Set(allBooks).size === 66 && allBooks[0] === 'Genesis' && allBooks[38] === 'Malachi' && allBooks[39] === 'Matthew' && allBooks[65] === 'Revelation');
        ck(tag + ' accessible shelf buttons exposed', await frame.getByRole('button').count() === 12);
        await frame.locator('#next-btn').click();
        ck(tag + ' All Shelves returns to overview', await frame.locator('#widget').getAttribute('data-step') === '0' && await frame.locator('#prev-btn').isDisabled());
        await frameEl.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 120, behavior: 'instant' }));
        for (let i = 1; i <= 10; i++) {
          const shelf = frame.locator('.shelf-cluster[data-step-index="' + i + '"]');
          await shelf.locator('.focus-ring').click();
          ck(tag + ' direct shelf selection ' + i, await frame.locator('#widget').getAttribute('data-step') === String(i));
          await shelf.focus(); await page.keyboard.press('Enter');
          ck(tag + ' Enter toggles shelf off ' + i, await frame.locator('#widget').getAttribute('data-step') === '0');
          await page.keyboard.press('Space');
          ck(tag + ' Space selects shelf ' + i, await frame.locator('#widget').getAttribute('data-step') === String(i) && await shelf.getAttribute('aria-pressed') === 'true');
        }
        await frame.locator('#prev-btn').click();
        ck(tag + ' Back', await frame.locator('#widget').getAttribute('data-step') === '9');
        await page.keyboard.press('ArrowLeft');
        ck(tag + ' ArrowLeft', await frame.locator('#widget').getAttribute('data-step') === '8');
        await page.keyboard.press('ArrowRight');
        ck(tag + ' ArrowRight', await frame.locator('#widget').getAttribute('data-step') === '9');
        await page.waitForTimeout(350);
        await frame.evaluate(() => { window.__bookshelfMutations = 0; new MutationObserver(ms => window.__bookshelfMutations += ms.length).observe(document.getElementById('widget'), { attributes: true, subtree: true, childList: true, characterData: true }); });
        await frameEl.evaluate(e => { window.__bookshelfHeightWrites = 0; new MutationObserver(ms => window.__bookshelfHeightWrites += ms.length).observe(e, { attributes: true, attributeFilter: ['style'] }); });
        await page.waitForTimeout(600);
        ck(tag + ' no idle DOM or iframe loop', await frame.evaluate(() => __bookshelfMutations) === 0 && await page.evaluate(() => __bookshelfHeightWrites) === 0);
        await page.setViewportSize({ width, height: 740 }); await page.waitForTimeout(250);
        ck(tag + ' height-only resize stable', await frame.evaluate(() => __bookshelfMutations) === 0 && await page.evaluate(() => __bookshelfHeightWrites) === 0);
        ck(tag + ' widget never writes answers', await frame.evaluate(() => __bookshelfWrites) === 0 && await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === initialStorage);
        const key = 'question-201-' + questions[0].id;
        await lesson.locator('#' + key).fill('SYN-bookshelf-edited');
        await page.reload(); await lesson.waitFor();
        ck(tag + ' edited answer survives reload', await lesson.locator('#' + key).inputValue() === 'SYN-bookshelf-edited');
        ck(tag + ' other answers preserved', await page.evaluate(({ seed, key }) => { const saved = JSON.parse(localStorage.getItem('christianFoundationsResponses')); return Object.entries(seed).every(([k, v]) => k === key || saved[k] === v); }, { seed, key }));
        await page.locator('#email-lesson-btn').click();
        const outgoing = await page.locator('#export-preview-text').textContent();
        ck(tag + ' Email includes current and previous answers', outgoing.includes('SYN-bookshelf-edited') && questions.slice(1).every((q, i) => outgoing.includes('SYN-bookshelf-' + (i + 1))));
        ck(tag + ' Email excludes other-course answer', !outgoing.includes('SYN-bookshelf-other-course'));
        ck(tag + ' no page or widget asset errors', errors.length === 0 && assetErrors.length === 0);
        console.log('PASS ' + tag + ' card=' + cardHeight);
      } finally { await context.close(); }
    }
    console.log(checks + ' Bookshelf lesson integration checks passed across 6 cases');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
