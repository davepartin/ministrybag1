#!/usr/bin/env node
'use strict';
const assert = require('assert');
const { chromium } = require('playwright');
const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8881/index.html';
let passed = 0;
function check(name, value) { assert.ok(value, name); passed++; console.log('PASS: ' + name); }

(async function () {
    const browser = await chromium.launch({ headless: true, channel: 'chrome' });
    try {
        for (const width of [375, 390, 1280]) {
            const context = await browser.newContext({ viewport: { width, height: 844 } });
            await context.route('**/scripts/account.js', route => route.fulfill({ contentType: 'text/javascript', body: '' }));
            await context.addInitScript(() => {
                if (sessionStorage.getItem('read101-seeded')) return;
                localStorage.setItem('foundationsReadingData', JSON.stringify({
                    'notes-101-John-1': 'SYN-saved-one', 'notes-101-John-2': 'SYN-saved-two',
                    'notes-101-John-4': 'SYN-private-next', 'notes-202-John-1': 'SYN-private-course'
                }));
                sessionStorage.setItem('read101-seeded', 'yes');
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(BASE + '#101-1');
            await page.waitForSelector('#session-1.active');
            check(width + ': saved notes restored', await page.inputValue('#reading-notes-101-John-1') === 'SYN-saved-one');
            // No input event: test edits that have not reached either save path.
            await page.locator('#reading-notes-101-John-1').evaluate(el => { el.value = 'SYN-live-one\n<not markup> & "quoted"'; });
            await page.locator('#reading-notes-101-John-2').evaluate(el => { el.value = ''; });
            await page.fill('#reading-notes-101-John-3', 'SYN-typed-three');
            await page.click('#email-lesson-btn');
            await page.waitForSelector('#export-preview-overlay.open');
            let body = await page.locator('#export-preview-text').textContent();
            check(width + ': latest live notes exported literally', body.includes('John 1\nSYN-live-one\n<not markup> & "quoted"') && body.includes('John 3\nSYN-typed-three'));
            check(width + ': cleared and other lesson notes excluded', !body.includes('SYN-saved-two') && !body.includes('SYN-private') && !body.includes('John 2\n'));
            check(width + ': course/title/summary/answers preserved', body.startsWith('101 ') && body.includes('Course\n\nLesson 1:') && /1\.1 .+\n/.test(body) && body.indexOf('Reading Notes') > body.indexOf('Prayer request'));
            check(width + ': preview does not launch mail or interpret user HTML', await page.evaluate(() => !window.__gtLastMailtoHref) && await page.locator('#export-preview-text not-markup').count() === 0);
            check(width + ': email preview fits viewport', await page.locator('#export-preview-text').evaluate(el => el.getBoundingClientRect().right <= innerWidth && el.scrollWidth <= el.clientWidth + 1));
            if (width === 390 && process.env.GT_SCREENSHOT) await page.screenshot({ path: process.env.GT_SCREENSHOT });
            await page.keyboard.press('Escape');
            check(width + ': PDF stays disabled', await page.locator('#course-pdf-btn').isDisabled());
            await page.goto(BASE + '#101-2');
            await page.waitForSelector('#session-2.active');
            await page.click('#email-lesson-btn');
            body = await page.locator('#export-preview-text').textContent();
            check(width + ': switching lessons exports only new assigned chapters', body.includes('John 4\nSYN-private-next') && !body.includes('SYN-live-one') && !body.includes('SYN-typed-three') && !body.includes('SYN-private-course'));
            await page.keyboard.press('Escape');
            await page.goto(BASE + '#201-1');
            await page.waitForSelector('#session-1.active');
            await page.click('#email-lesson-btn');
            body = await page.locator('#export-preview-text').textContent();
            check(width + ': nonreading lesson has no reading export', !body.includes('Reading Notes') && !body.includes('SYN-'));
            check(width + ': no page errors or horizontal overflow', errors.length === 0 && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await page.keyboard.press('Escape');
            await page.goto(BASE + '#101-1');
            await page.waitForSelector('#session-1.active');
            await page.evaluate(() => {
                const original = Storage.prototype.setItem;
                Storage.prototype.setItem = function (key, value) {
                    if (key === 'foundationsReadingData') throw new DOMException('Synthetic quota', 'QuotaExceededError');
                    return original.call(this, key, value);
                };
            });
            await page.fill('#reading-notes-101-John-1', 'SYN-quota-unsaved');
            await page.click('#email-lesson-btn');
            check(width + ': failed save still exports current in-memory notes', (await page.locator('#export-preview-text').textContent()).includes('John 1\nSYN-quota-unsaved'));
            check(width + ': failed save preserves previously persisted notes', await page.evaluate(() => JSON.parse(localStorage.getItem('foundationsReadingData'))['notes-101-John-1'] === 'SYN-saved-one'));
            await context.close();
        }
        console.log(passed + ' browser checks passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
