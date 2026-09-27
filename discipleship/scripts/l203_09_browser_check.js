#!/usr/bin/env node
/**
 * L-203-09 browser check. The Church Planting, Missions, and Ministry Partners
 * lesson renders, its Your Mission Map widget loads, answers survive navigation and reload, and the
 * page fits phone and laptop widths. Synthetic answers only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20309_BASE_URL || 'http://127.0.0.1:8765/index.html';
var IDS = ['203-09-story', '203-09-city', '203-09-plant', '203-09-nations', '203-09-key', '203-09-step', '203-09-prayer'];
var failed = 0;
var passed = 0;

function assert(name, condition, detail) {
    if (condition) {
        passed += 1;
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

(async function () {
    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    var errors = [];
    for (var width of [375, 390, 1280]) {
        var page = await browser.newPage({ viewport: { width: width, height: 844 } });
        page.on('pageerror', function (err) { errors.push(String(err)); });
        await page.goto(BASE + '#203-9', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#question-203-203-09-story', { timeout: 20000 });
        await page.locator('iframe[src*="mission-map"]').scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        var info = await page.evaluate(function (ids) {
            var frame = document.querySelector('iframe[src*="mission-map"]');
            var doc = frame && frame.contentDocument;
            return {
                present: ids.map(function (id) { return !!document.getElementById('question-203-' + id); }),
                parable: document.body.textContent.indexOf('The Tentmakers') !== -1,
                widgetLoaded: !!(doc && doc.querySelector('#tri') && doc.querySelector('[data-control="begin"]')),
                widgetTitle: doc ? doc.title : '',
                widgetFits: !!frame && frame.getBoundingClientRect().width <= window.innerWidth,
                scrollWidth: document.documentElement.scrollWidth,
                viewport: window.innerWidth
            };
        }, IDS);
        assert(width + ': all seven 203-09 questions render', info.present.every(Boolean), JSON.stringify(info.present));
        assert(width + ': Priscilla and Aquila story renders', info.parable);
        assert(width + ': Your Mission Map widget loads within page width', info.widgetLoaded && info.widgetTitle === 'Your Mission Map' && info.widgetFits);
        assert(width + ': page does not scroll sideways', info.scrollWidth <= info.viewport, info.scrollWidth + ' > ' + info.viewport);

        if (width === 390) {
            await page.fill('#question-203-203-09-city', 'SYN city answer\nsecond line');
            await page.fill('#question-203-203-09-step', 'SYN step');
            await page.goto(BASE + '#203-8', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(500);
            await page.goto(BASE + '#203-9', { waitUntil: 'domcontentloaded' });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#question-203-203-09-city', { timeout: 20000 });
            assert('203-09 answers survive navigation and reload',
                (await page.inputValue('#question-203-203-09-city')) === 'SYN city answer\nsecond line' &&
                (await page.inputValue('#question-203-203-09-step')) === 'SYN step');
        }
        await page.close();
    }
    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-09 browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
