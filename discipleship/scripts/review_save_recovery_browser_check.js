#!/usr/bin/env node
// REV-003: fresh synthetic stores, real clipboard/download evidence.
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8765/index.html';
let passed = 0;
function check(name, ok) { assert.ok(ok, name); console.log('PASS: ' + name); passed++; }
async function downloadText(page, selector) {
    const [download] = await Promise.all([page.waitForEvent('download'), page.click(selector)]);
    assert.equal(await download.failure(), null);
    const chunks = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
}
(async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || undefined });
    try {
        const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await context.addInitScript(() => {
            if (window !== window.top) return;
            localStorage.setItem('foundationsReadingData', 'SYN-original-reading');
            localStorage.setItem('foundationsCompletionData', 'SYN-original-completion');
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(BASE + '#101-5');
        await page.locator('#question-101-5-key').waitFor();
        check('both failed loads are available for recovery', await page.locator('#save-status-store option').count() === 2);
        await page.fill('#question-101-5-key', 'SYN-saved-answer');
        check('answer success does not hide earlier failures', await page.locator('#save-status-label').textContent() === 'Could not save');
        await page.selectOption('#save-status-store', 'reading');
        await page.evaluate(() => { readingData['notes-SYN'] = 'SYN-reading-edit'; persistReading(); persistResponses(); });
        check('answer autosave path keeps the selected failed store recoverable', await page.locator('#save-status-banner').getAttribute('data-store') === 'reading');
        const memory = JSON.parse(await downloadText(page, '#save-status-download'));
        check('actual recovery download contains the selected in-memory edit', memory.store === 'reading' && memory.data['notes-SYN'] === 'SYN-reading-edit');
        check('actual original download preserves malformed bytes', await downloadText(page, '#save-status-download-original') === 'SYN-original-reading');

        await page.evaluate(() => {
            window.syntheticWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
            window.syntheticExec = document.execCommand.bind(document);
            navigator.clipboard.writeText = async () => { throw new Error('Synthetic clipboard denial'); };
            document.execCommand = () => false;
        });
        await page.click('#save-status-copy');
        await page.getByText('Could not copy. Use Download', { exact: false }).waitFor();
        check('clipboard denial is visible, with a download alternative', await page.locator('#save-recovery-message').isVisible());
        check('failed copy does not claim a successful copy', await page.evaluate(() => window.__gtLastRecoveryCopy === undefined));
        check('copy fallback restores keyboard focus', await page.locator('#save-status-copy').evaluate(el => el === document.activeElement));
        await page.evaluate(() => { document.execCommand = window.syntheticExec; });
        await page.click('#save-status-copy');
        await page.getByText('Copied this recovery snapshot.', { exact: false }).waitFor();
        const fallback = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
        check('denied clipboard API falls back to a real browser copy', fallback.data['notes-SYN'] === 'SYN-reading-edit');
        await page.evaluate(() => { navigator.clipboard.writeText = window.syntheticWriteText; });
        await page.click('#save-status-copy');
        const clipboard = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
        check('normal clipboard copy contains the selected store', clipboard.store === 'reading');
        await page.selectOption('#save-status-store', 'completion');
        check('switching recovery target clears stale copy feedback', await page.locator('#save-recovery-message').isHidden());
        check('second original copy is independently downloadable', await downloadText(page, '#save-status-download-original') === 'SYN-original-completion');

        for (const width of [375, 390, 1280]) {
            await page.setViewportSize({ width, height: 812 });
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.waitForTimeout(200);
            await page.waitForFunction(() => {
                const height = document.getElementById('save-status-banner').offsetHeight;
                return parseFloat(document.documentElement.style.getPropertyValue('--save-status-height')) === height;
            });
            const visible = await page.locator('#save-status-actions').evaluate(el => {
                const r = el.getBoundingClientRect();
                return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight;
            });
            check(width + ': recovery actions and sticky offset fit the viewport', visible);
            if (width !== 390) await page.screenshot({ path: '/tmp/gt-save-review-' + width + '.png' });
        }
        check('no page exceptions during recovery controls', errors.length === 0);
        await context.close();

        const retryContext = await browser.newContext();
        const retryPage = await retryContext.newPage();
        await retryPage.goto(BASE + '#101-5');
        await retryPage.locator('#question-101-5-key').waitFor();
        await retryPage.evaluate(() => {
            const original = Storage.prototype.setItem;
            window.syntheticBlockedKeys = new Set(['foundationsReadingData', 'foundationsCompletionData']);
            Storage.prototype.setItem = function (key, value) {
                if (window.syntheticBlockedKeys.has(key)) throw new DOMException('Synthetic quota', 'QuotaExceededError');
                return original.call(this, key, value);
            };
            completionData['complete-SYN'] = true;
            readingData['notes-SYN'] = 'SYN-retry';
            persistCompletion(); persistReading(); persistResponses();
        });
        check('simultaneous write failures survive unrelated success', await retryPage.locator('#save-status-store option').count() === 2);
        await retryPage.selectOption('#save-status-store', 'completion');
        await retryPage.evaluate(() => window.syntheticBlockedKeys.delete('foundationsCompletionData'));
        await retryPage.click('#save-status-retry');
        check('retrying one store leaves the other error visible', await retryPage.locator('#save-status-label').textContent() === 'Could not save' && await retryPage.locator('#save-status-banner').getAttribute('data-store') === 'reading');
        await retryPage.evaluate(() => window.syntheticBlockedKeys.clear());
        await retryPage.click('#save-status-retry');
        check('Saved appears after the final failed store succeeds', await retryPage.locator('#save-status-label').textContent() === 'Saved' && await retryPage.locator('#save-status-actions').isHidden());
        check('both retries reached storage with intact edits', await retryPage.evaluate(() => JSON.parse(localStorage.getItem('foundationsCompletionData'))['complete-SYN'] === true && JSON.parse(localStorage.getItem('foundationsReadingData'))['notes-SYN'] === 'SYN-retry'));
        await retryContext.close();
        console.log(passed + ' review recovery browser checks passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
