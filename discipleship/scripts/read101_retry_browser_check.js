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
            let requests = 0;
            let release;
            const pending = new Promise(resolve => { release = resolve; });
            await context.route('**/data/bible/john-web.json?*', async route => {
                requests++;
                if (requests === 1) return route.fulfill({ status: 503, body: 'Synthetic temporary failure' });
                if (requests === 2) { await pending; return route.abort('internetdisconnected'); }
                return route.continue();
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(BASE + '#101-1');
            await page.waitForSelector('#session-1.active');
            await page.fill('#reading-notes-101-John-1', 'SYN-keep-this-note');
            const header = page.locator('#card-101-John-1 .chapter-card-header');
            await header.click();
            const retry = page.locator('#esv-101-John-1 .chapter-retry');
            await retry.waitFor({ state: 'visible' });
            check(width + ': failed download offers native Retry', requests === 1 && await retry.evaluate(el => el.tagName === 'BUTTON' && el.type === 'button' && el.textContent === 'Retry'));
            await page.check('#reading-check-101-John-1');
            await header.click();
            await header.click();
            check(width + ': reopening preserves error recovery', await retry.isVisible() && requests === 1);
            await retry.focus();
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => document.getElementById('esv-101-John-1').getAttribute('aria-busy') === 'true');
            check(width + ': retry has visible loading and disabled control', await retry.isDisabled() && (await page.locator('#esv-101-John-1 [role=status]').textContent()).includes('Loading John 1'));
            // Even programmatic duplicate events must not start parallel requests.
            await retry.evaluate(el => { el.dispatchEvent(new MouseEvent('click')); el.dispatchEvent(new MouseEvent('click')); });
            await page.locator('#card-101-John-2 .chapter-card-header').click();
            await page.waitForFunction(() => document.getElementById('esv-101-John-2').getAttribute('aria-busy') === 'true');
            check(width + ': chapters share one pending book request', requests === 2);
            release();
            await page.waitForFunction(() => !document.getElementById('esv-101-John-1').hasAttribute('aria-busy'));
            check(width + ': another network failure re-enables Retry', await retry.isEnabled() && await page.locator('#esv-101-John-2 .chapter-retry').isVisible());
            if (width === 390 && process.env.GT_SCREENSHOT) {
                await retry.scrollIntoViewIfNeeded();
                await page.screenshot({ path: process.env.GT_SCREENSHOT });
            }
            await retry.focus();
            await page.keyboard.press('Enter');
            await page.locator('#esv-101-John-1 h2').waitFor();
            check(width + ': retry succeeds without navigation or reload', requests === 3 && page.url().endsWith('#101-1') && (await page.locator('#esv-101-John-1').textContent()).includes('In the beginning was the Word'));
            check(width + ': WEB attribution retained', (await page.locator('#esv-101-John-1 .bible-attribution').textContent()).includes('World English Bible (WEB), public domain'));
            check(width + ': retry keyboard focus goes to loaded text', await page.locator('#esv-101-John-1').evaluate(el => document.activeElement === el));
            await page.locator('#esv-101-John-2 .chapter-retry').click();
            await page.locator('#esv-101-John-2 h2').waitFor();
            await header.click();
            await header.click();
            check(width + ': other chapters and reopening reuse successful cache', requests === 3 && await page.locator('#esv-101-John-2 h2').textContent() === 'John 2');
            check(width + ': notes and reading checks survive every attempt', await page.inputValue('#reading-notes-101-John-1') === 'SYN-keep-this-note' && await page.isChecked('#reading-check-101-John-1') && await page.evaluate(() => {
                const data = JSON.parse(localStorage.getItem('foundationsReadingData'));
                return data['notes-101-John-1'] === 'SYN-keep-this-note' && data['check-101-John-1'] === true;
            }));
            check(width + ': no page errors or horizontal overflow', errors.length === 0 && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await context.close();
        }
        console.log(passed + ' retry browser checks passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
