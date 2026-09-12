#!/usr/bin/env node
'use strict';
// REV-005 / ENG-001b. Fresh contexts and synthetic learner data only.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const BASE = process.env.GT_REVIEW_BASE_URL || 'http://127.0.0.1:8767/index.html';
let passed = 0;
function check(name, condition) {
    assert.ok(condition, name);
    passed++;
    console.log('PASS: ' + name);
}
(async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
        await context.addInitScript(() => {
            if (window.top !== window || sessionStorage.getItem('SYN-review-seeded')) return;
            sessionStorage.setItem('SYN-review-seeded', '1');
            localStorage.setItem('christianFoundationsResponses', JSON.stringify({
                'question-202-201-9-1': 'SYN-old-boundary',
                'question-202-202-09-key': 'SYN-old-key-and-step',
                'question-202-202-09-devos': 'SYN-retired-devotions',
                'question-202-202-05-prayer': 'SYN-other-lesson-private'
            }));
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        await page.goto(BASE + '#202-9');
        await page.waitForSelector('#question-202-201-9-1');
        check('legacy boundary displays unchanged', await page.inputValue('#question-202-201-9-1') === 'SYN-old-boundary');
        check('old combined response displays under retained key', await page.inputValue('#question-202-202-09-key') === 'SYN-old-key-and-step');
        check('retired devotions field is absent', await page.locator('#question-202-202-09-devos').count() === 0);
        await page.fill('#question-202-202-09-step', 'SYN-next-step & café\nsecond line');
        check('purity answer reports Saved', await page.locator('#save-status-label').textContent() === 'Saved');
        await page.goto(BASE + '#202-8');
        await page.waitForSelector('#question-202-202-08-step');
        await page.fill('#question-202-202-08-step', 'SYN-marriage-next-step');
        await page.reload();
        check('marriage answer survives reload', await page.inputValue('#question-202-202-08-step') === 'SYN-marriage-next-step');
        await page.goto(BASE + '#202-9');
        await page.waitForSelector('#question-202-202-09-step');
        check('purity answer survives navigation and reload', await page.inputValue('#question-202-202-09-step') === 'SYN-next-step & café\nsecond line');
        check('retired devotions answer remains stored', await page.evaluate(() => JSON.parse(localStorage.getItem('christianFoundationsResponses'))['question-202-202-09-devos']) === 'SYN-retired-devotions');
        await page.click('#email-lesson-btn');
        const preview = await page.locator('#export-preview-text').textContent();
        check('lesson export includes existing boundary and new step', preview.includes('SYN-old-boundary') && preview.includes('SYN-next-step & café'));
        check('lesson export excludes retired and other-lesson answers', !preview.includes('SYN-retired-devotions') && !preview.includes('SYN-other-lesson-private') && !preview.includes('SYN-marriage-next-step'));
        check('opening preview does not open mail', await page.evaluate(() => !window.__gtLastMailtoHref));
        await page.keyboard.press('Escape');
        check('Escape closes preview', !(await page.locator('#export-preview-overlay').getAttribute('class')).includes('open'));
        const before = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
        const started = page.waitForEvent('download');
        await page.click('#lesson-download-backup');
        const download = await started;
        assert.equal(await download.failure(), null);
        const chunks = [];
        for await (const chunk of await download.createReadStream()) chunks.push(chunk);
        const file = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const data = file.stores.answers.data;
        check('actual backup contains retired and new answers independently', data['question-202-202-09-devos'] === 'SYN-retired-devotions' && data['question-202-202-09-step'] === 'SYN-next-step & café\nsecond line' && data['question-202-202-08-step'] === 'SYN-marriage-next-step');
        check('backup does not change browser answers', await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === before);
        for (const width of [375, 390, 1280]) {
            await page.setViewportSize({ width, height: width === 1280 ? 800 : 844 });
            for (const lesson of [8, 9]) {
                await page.goto(BASE + '#202-' + lesson);
                await page.waitForSelector('#session-' + lesson + '.active');
                const selector = '#session-' + lesson + ' img[src*="' + (lesson === 8 ? 'contract-covenant' : 'fight-plan') + '"]';
                const img = page.locator(selector);
                await img.scrollIntoViewIfNeeded();
                await page.waitForTimeout(200);
                const layout = await img.evaluate(el => ({ loaded: el.complete && el.naturalWidth > 0, width: el.getBoundingClientRect().width, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 }));
                check(width + ': lesson ' + lesson + ' diagram loads within page width', layout.loaded && layout.width <= width && !layout.overflow);
                if (process.env.GT_REVIEW_SCREENSHOTS === '1') {
                    await page.screenshot({ path: '/tmp/gt-pr17-' + lesson + '-' + width + '.png' });
                }
            }
        }
        check('lesson journeys have no page exceptions', errors.length === 0);
        await context.close();
    } finally {
        await browser.close();
    }
    console.log(passed + ' lesson browser checks passed.');
})().catch(err => { console.error(err.message); process.exit(1); });
