#!/usr/bin/env node
// Isolated contexts and synthetic answers only. Supports local, preview and live URLs.
'use strict';
const assert = require('assert/strict');
const { chromium } = require('playwright');
const lessonData = require('../data/101-06.json');
const base = process.env.BLESS_BASE_URL || 'http://127.0.0.1:8810/index.html';
const questions = lessonData.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-101-' + q.id, 'SYN-bless-' + i]));
seed['question-202-unrelated'] = 'SYN-bless-other-course';
const reading = { 'notes-101-John-16': 'SYN-bless-reading-note', '101-John-16': true };
let checks = 0;
function ck(label, ok) { checks++; assert.ok(ok, label); }
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium' });
 try {
  for (const width of [375, 390, 1280]) for (const motion of ['no-preference', 'reduce']) {
   const tag = width + '/' + motion;
   const ctx = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
   try {
    await ctx.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await ctx.addInitScript(({ seed, reading }) => {
     window.__blessWrites = 0;
     for (const method of ['setItem', 'removeItem', 'clear']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function (...args) {
       if (location.pathname.includes('bless-intro.html')) window.__blessWrites++;
       return original.apply(this, args);
      };
     }
     if (window === window.top && !sessionStorage.getItem('bless-seeded')) {
      localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
      localStorage.setItem('foundationsReadingData', JSON.stringify(reading));
      sessionStorage.setItem('bless-seeded', 'yes');
     }
    }, { seed, reading });
    const page = await ctx.newPage(), errors = [], consoleErrors = [], assetErrors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('response', r => { if (/bless-intro|101-06.json/.test(r.url()) && r.status() >= 400) assetErrors.push(r.url()); });
    await page.goto(base + '#101-6');
    const lesson = page.locator('#session-6');
    const frameEl = lesson.locator('iframe[src*="widgets/bless-intro.html"]');
    await frameEl.waitFor();
    const frame = await (await frameEl.elementHandle()).contentFrame();
    await frame.locator('.nav-btn.primary').waitFor();
    await page.waitForTimeout(250);
    ck(tag + ' one widget in approved position', await frameEl.count() === 1 && await frameEl.evaluate(e => {
     const block = e.closest('.block-widget');
     return block.previousElementSibling.textContent.endsWith('Tap through below for a first taste.') && block.nextElementSibling.textContent.includes('6.2 -');
    }));
    ck(tag + ' approved title and tag', await frame.locator('h1').textContent() === 'BLESS Rhythms' && await frame.locator('.course-tag').textContent() === '101-06');
    ck(tag + ' question count', await lesson.locator('.question-textarea').count() === questions.length);
    for (const q of questions) { const key = 'question-101-' + q.id; ck(tag + ' restore ' + key, await lesson.locator('#' + key).inputValue() === seed[key]); }
    ck(tag + ' no em dashes', !/\u2014/.test(await lesson.textContent()) && !/\u2014/.test(await frame.locator('body').textContent()));
    const card = frame.locator('.verse-card-content');
    const height = await card.evaluate(e => e.clientHeight);
    const stored = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
    ck(tag + ' seven dots and five pentagons', await frame.locator('.step-dot').count() === 7 && await frame.locator('.pent-node').count() === 5);
    for (let step = 0; step <= 6; step++) {
     if (step) await frame.locator('.nav-btn.primary').click();
     await page.waitForTimeout(motion === 'reduce' ? 30 : 360);
     ck(tag + ' step ' + step, await frame.locator('#widget').getAttribute('data-step') === String(step));
     ck(tag + ' active named dot ' + step, await frame.locator('.step-dot').nth(step).getAttribute('aria-pressed') === 'true' && !!await frame.locator('.step-dot').nth(step).getAttribute('aria-label'));
     ck(tag + ' card stable and fits ' + step, await card.evaluate((e,h) => e.clientHeight === h && e.scrollHeight <= e.clientHeight + 1, height));
     ck(tag + ' no horizontal overflow ' + step, await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
     ck(tag + ' iframe full height ' + step, await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)) - 1);
     if (motion === 'reduce') ck(tag + ' reduced motion instant ' + step, await frame.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
    }
    await frame.locator('.nav-btn').first().click();
    ck(tag + ' Back', await frame.locator('#widget').getAttribute('data-step') === '5');
    for (let i = 0; i < 5; i++) {
     const pent = frame.locator('.pent-node').nth(i);
     // Click the central pentagon polygon, not the SVG group's extended label bounds.
     await pent.locator('polygon').first().click();
     ck(tag + ' pentagon tap ' + i, await frame.locator('#widget').getAttribute('data-step') === String(i+1) && await pent.getAttribute('aria-pressed') === 'true');
     await frame.locator('.step-dot').first().click();
     await pent.focus(); await page.keyboard.press(i % 2 ? 'Space' : 'Enter');
     ck(tag + ' pentagon keyboard ' + i, await frame.locator('#widget').getAttribute('data-step') === String(i+1));
    }
    await frame.locator('.step-dot').last().focus(); await page.keyboard.press('Space');
    ck(tag + ' keyboard dot', await frame.locator('#widget').getAttribute('data-step') === '6');
    await frame.locator('.nav-btn.primary').click();
    ck(tag + ' Start Over', await frame.locator('#widget').getAttribute('data-step') === '0' && await frame.locator('.nav-btn').first().isDisabled());
    await frame.locator('.nav-btn.primary').focus(); await page.keyboard.press('ArrowRight');
    ck(tag + ' ArrowRight', await frame.locator('#widget').getAttribute('data-step') === '1');
    await page.keyboard.press('ArrowLeft');
    ck(tag + ' ArrowLeft', await frame.locator('#widget').getAttribute('data-step') === '0');
    await page.waitForTimeout(400);
    await frame.evaluate(() => { window.__blessMutations=0; new MutationObserver(ms => window.__blessMutations += ms.length).observe(document.getElementById('widget'), {attributes:true,childList:true,characterData:true,subtree:true}); });
    await frameEl.evaluate(e => { window.__blessHeightWrites=0; new MutationObserver(ms => window.__blessHeightWrites += ms.length).observe(e,{attributes:true,attributeFilter:['style']}); });
    await page.waitForTimeout(400);
    ck(tag + ' idle stable', await frame.evaluate(() => __blessMutations) === 0 && await page.evaluate(() => __blessHeightWrites) === 0);
    await page.setViewportSize({width,height:740}); await page.waitForTimeout(200);
    ck(tag + ' height-only resize stable', await frame.evaluate(() => __blessMutations) === 0 && await page.evaluate(() => __blessHeightWrites) === 0);
    ck(tag + ' widget never writes answers', await frame.evaluate(() => __blessWrites) === 0 && await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === stored);
    const key = 'question-101-' + questions[0].id;
    await lesson.locator('#' + key).fill('SYN-bless-edited');
    await page.reload(); await lesson.locator('#' + key).waitFor();
    ck(tag + ' edit survives reload', await lesson.locator('#' + key).inputValue() === 'SYN-bless-edited');
    ck(tag + ' other saved answers untouched', await page.evaluate(({seed,key}) => {const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v]) => saved[k] === (k === key ? 'SYN-bless-edited' : v));},{seed,key}));
    ck(tag + ' reading data untouched', await page.evaluate(() => localStorage.getItem('foundationsReadingData')) === JSON.stringify(reading));
    await page.locator('#email-lesson-btn').click();
    const outgoing = await page.locator('#export-preview-text').textContent();
    ck(tag + ' Email all current answers and notes', outgoing.includes('SYN-bless-edited') && outgoing.includes(reading['notes-101-John-16']) && questions.slice(1).every(q => outgoing.includes(seed['question-101-' + q.id])));
    ck(tag + ' Email excludes other course', !outgoing.includes('SYN-bless-other-course'));
    ck(tag + ' zero page errors', errors.length === 0);
    ck(tag + ' zero console errors', consoleErrors.length === 0);
    ck(tag + ' zero widget/lesson HTTP errors', assetErrors.length === 0);
    console.log('PASS BLESS ' + tag + ' card=' + height);
   } finally { await ctx.close(); }
  }
  console.log(checks + ' BLESS checks passed across 6 viewport/motion cases');
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
