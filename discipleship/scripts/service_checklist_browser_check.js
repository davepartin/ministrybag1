#!/usr/bin/env node
// Isolated synthetic answers only; run against a local server or exact PR preview.
'use strict';
const assert = require('assert/strict');
const { chromium } = require('playwright');
const data = require('../data/101-05.json');
const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8811/index.html';
const key = 'checklist-101-service-interests';
const qkey = 'question-101-5-hand';
let checks = 0;
function ck(label, ok) { checks++; assert.ok(ok, label); }
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium', headless: true });
  try {
    for (const width of [375, 390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      try {
        await context.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
        await context.addInitScript(({ key, qkey }) => {
          if (!sessionStorage.getItem('service-seeded')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify({ [key]: [11, 14, 15, 18, 19], [qkey]: 'SYN-potluck-answer', 'question-202-unrelated': 'SYN-other-course' }));
            sessionStorage.setItem('service-seeded', 'yes');
          }
        }, { key, qkey });
        const page = await context.newPage(), errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + '#101-5');
        const lesson = page.locator('#session-5'), checklist = lesson.locator('#' + key);
        await checklist.waitFor();
        const visible = checklist.locator('.checklist-tile:visible');
        ck(width + ' 25 visible choices', await visible.count() === 25);
        const labels = await visible.allTextContents();
        for (const label of ['Teaching', 'Discipleship Group', 'Cleaning Team', 'Community Service Team', 'Lawn Team', 'Hospitality', "Other", "Men's Ministry", "Women's Ministry"]) ck(width + ' includes ' + label, labels.includes(label));
        ck(width + ' removed choices not visible', !labels.some(s => /First Impressions|Financial Giving|Bible Study|Men's \/ Women's Ministry/.test(s)));
        ck(width + ' old choices retain reserved DOM positions', await checklist.locator('.checklist-tile').count() === 29);
        for (const i of [11, 14, 18, 19]) ck(width + ' retired selected but hidden ' + i, await checklist.locator('[data-index="' + i + '"]').evaluate(e => e.hidden && e.classList.contains('selected') && getComputedStyle(e).display === 'none'));
        ck(width + ' old index 15 still Outreach', await checklist.locator('[data-index="15"]').evaluate(e => e.textContent === 'Outreach Events' && e.classList.contains('selected')));
        ck(width + ' new Teaching not inherited from old combined choice', !await checklist.locator('[data-index="20"]').evaluate(e => e.classList.contains('selected')));
        ck(width + ' question answer restored', await lesson.locator('#' + qkey).inputValue() === 'SYN-potluck-answer');
        ck(width + ' teaching precedes question then checklist', await lesson.evaluate((el, qkey) => {
          const heading = [...el.querySelectorAll('h2,h3,h4')].find(e => e.textContent.includes('The Potluck, Not the Restaurant'));
          const q = el.querySelector('#' + qkey), grid = el.querySelector('#checklist-101-service-interests');
          const following = (a,b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
          const middle = document.createRange(); middle.setStartAfter(heading); middle.setEndBefore(q);
          return following(heading,q) && following(q,grid) && middle.toString().includes('At a potluck, everyone brings something') && middle.toString().includes('1 Corinthians 12:27');
        }, qkey));
        for (const i of [20, 21, 22, 27, 28]) await checklist.locator('[data-index="' + i + '"]').click();
        await page.reload(); await checklist.waitFor();
        ck(width + ' exact old and new indexes survive reload', await page.evaluate(key => JSON.stringify(JSON.parse(localStorage.getItem('christianFoundationsResponses'))[key]), key) === '[11,14,15,18,19,20,21,22,27,28]');
        for (const i of [20, 21, 22, 27, 28]) ck(width + ' new choice restored ' + i, await checklist.locator('[data-index="' + i + '"]').evaluate(e => e.classList.contains('selected')));
        const other = checklist.locator('[data-index="26"]');
        await other.focus(); await page.keyboard.press('Space');
        ck(width + ' Space selects native Other button', await other.getAttribute('aria-pressed') === 'true');
        await page.keyboard.press('Enter');
        ck(width + ' Enter deselects native Other button', await other.getAttribute('aria-pressed') === 'false');
        await lesson.locator('#' + qkey).fill('SYN-potluck-edited');
        await page.locator('#email-lesson-btn').click();
        const outgoing = await page.locator('#export-preview-text').textContent();
        for (const label of ["Men's / Women's Ministry (earlier selection)", "Men's Ministry, Women's Ministry", 'Teaching / Bible Study (earlier selection)', 'First Impressions (earlier selection)', 'Financial Giving (earlier selection)', 'Outreach Events', 'Teaching, Discipleship Group, Cleaning Team', 'SYN-potluck-edited']) ck(width + ' Email retains ' + label, outgoing.includes(label));
        ck(width + ' Email excludes other course', !outgoing.includes('SYN-other-course'));
        await page.keyboard.press('Escape');
        await page.goto(base + '#101-2');
        await page.locator('#session-2 iframe[src*="romans-road3.html"]').waitFor();
        ck(width + ' Gold 101-02 still renders', await page.locator('#session-2 .question-textarea').count() > 0);
        ck(width + ' no script errors', errors.length === 0);
        ck(width + ' page fits', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        console.log('PASS service checklist ' + width);
      } finally { await context.close(); }
    }
    console.log(checks + ' service checklist checks passed across 3 cases');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
