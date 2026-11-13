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
                if (sessionStorage.getItem('a11y-seeded')) return;
                localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-1': 'SYN-existing-note', 'check-101-John-1': true, 'notes-unknown': 'SYN-keep-unknown' }));
                sessionStorage.setItem('a11y-seeded', 'yes');
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(BASE + '#101-1');
            await page.waitForSelector('#session-1.active');
            await page.waitForTimeout(500);
            check(width + ': all 21 chapter toggles are native named buttons', await page.locator('.chapter-card-header').evaluateAll(headers => headers.length === 21 && headers.every(el => {
                if (el.tagName !== 'BUTTON' || el.type !== 'button' || !el.id) return false;
                const badge = el.querySelector('.chapter-status-pill');
                const toggle = el.querySelector('.chapter-action-pill');
                return el.closest('.chapter-card--v2') &&
                    el.textContent.includes('Bible Reading') && el.textContent.includes('John') &&
                    badge && badge.getAttribute('aria-hidden') === 'true' &&
                    toggle && toggle.getAttribute('aria-hidden') === 'true';
            })));
            check(width + ': every collapsed toggle controls one hidden chapter', await page.locator('.chapter-card-header').evaluateAll(headers => headers.every(el => {
                const body = document.getElementById(el.getAttribute('aria-controls'));
                return el.getAttribute('aria-expanded') === 'false' && body && body.hidden && body.closest('.chapter-card') === el.closest('.chapter-card');
            })));
            check(width + ': all 21 note fields have explicit unique labels', await page.locator('.chapter-notes-textarea').evaluateAll(notes => notes.length === 21 && new Set(notes.map(el => el.id)).size === 21 && notes.every(el =>
                el.labels.length === 1 && el.labels[0].htmlFor === el.id && el.labels[0].textContent.startsWith('Notes from John '))));
            const header = page.getByRole('button', { name: 'Bible Reading John 1', exact: true });
            const note = page.getByRole('textbox', { name: 'Notes from John 1', exact: true });
            const body = page.locator('#body-101-John-1');
            await header.focus();
            await page.keyboard.press('Tab');
            check(width + ': Tab skips collapsed reading checkbox and reaches notes', await note.evaluate(el => document.activeElement === el));
            await page.keyboard.press('Shift+Tab');
            await page.waitForFunction(() => document.getElementById('chapter-header-101-John-1').getBoundingClientRect().top >= document.querySelector('.lesson-topbar').getBoundingClientRect().bottom);
            check(width + ': Shift-Tab returns to chapter button with visible focus', await header.evaluate(el => document.activeElement === el && el.matches(':focus-visible') && getComputedStyle(el).outlineStyle !== 'none'));
            check(width + ': focused header is not covered by sticky lesson bar', await header.evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.lesson-topbar').getBoundingClientRect().bottom));
            await page.keyboard.press('Enter');
            await page.locator('#esv-101-John-1 h2').waitFor();
            check(width + ': Enter opens one chapter and updates accessibility state', await header.getAttribute('aria-expanded') === 'true' && await body.evaluate(el => !el.hidden && el.classList.contains('open')));
            check(width + ': opening retains keyboard focus and saved completion', await header.evaluate(el => document.activeElement === el) && await page.isChecked('#reading-check-101-John-1'));
            await page.keyboard.press('Tab');
            check(width + ': Tab reaches the named keyboard-scrollable chapter', await page.getByRole('region', { name: 'John 1', exact: true }).evaluate(el => document.activeElement === el && el.tabIndex === 0));
            await page.keyboard.press('ArrowDown');
            await page.waitForFunction(() => document.getElementById('esv-101-John-1').scrollTop > 0);
            check(width + ': arrow key scrolls the chapter text', await page.locator('#esv-101-John-1').evaluate(el => el.scrollTop > 0));
            await page.keyboard.press('Tab');
            check(width + ': Tab reaches visible chapter reading check', await page.locator('#reading-check-101-John-1').evaluate(el => document.activeElement === el));
            await page.keyboard.press('Space');
            check(width + ': Space updates reading check with its original key', !await page.isChecked('#reading-check-101-John-1') && await page.evaluate(() => JSON.parse(localStorage.getItem('foundationsReadingData'))['check-101-John-1'] === false));
            await header.focus();
            await page.keyboard.press('Space');
            check(width + ': Space collapses with synchronized hidden and expanded states', await header.getAttribute('aria-expanded') === 'false' && await body.evaluate(el => el.hidden && !el.classList.contains('open')));
            await page.keyboard.press('Space');
            check(width + ': Space reopens the same chapter', await header.getAttribute('aria-expanded') === 'true' && await body.isVisible());
            await page.locator('label[for="reading-notes-101-John-1"]').click();
            check(width + ': clicking visible notes label focuses its field', await note.evaluate(el => document.activeElement === el));
            await note.fill('SYN-accessible-notes\nsecond line');
            await header.focus();
            if (width === 390 && process.env.GT_SCREENSHOT) {
                await page.keyboard.press('Tab');
                await page.keyboard.press('Shift+Tab');
                await page.waitForTimeout(200);
                await page.screenshot({ path: process.env.GT_SCREENSHOT });
            }
            check(width + ': header and notes stay within viewport', await header.evaluate(el => {
                const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth;
            }) && await note.evaluate(el => el.getBoundingClientRect().right <= innerWidth));
            await page.reload();
            await page.waitForSelector('#session-1.active');
            check(width + ': reload preserves notes, unchecked state and unknown data', await note.inputValue() === 'SYN-accessible-notes\nsecond line' && !await page.isChecked('#reading-check-101-John-1') && await page.evaluate(() => JSON.parse(localStorage.getItem('foundationsReadingData'))['notes-unknown'] === 'SYN-keep-unknown'));
            check(width + ': reload starts collapsed without losing data', await header.getAttribute('aria-expanded') === 'false' && await body.evaluate(el => el.hidden));
            check(width + ': no duplicate IDs, errors or horizontal overflow', errors.length === 0 && await page.evaluate(() => {
                const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
                return new Set(ids).size === ids.length && document.documentElement.scrollWidth <= innerWidth + 1;
            }));
            await context.close();
        }
        console.log(passed + ' accessibility browser checks passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
