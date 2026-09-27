#!/usr/bin/env node
/**
 * L-203-06 browser check. The Faith at Work and School lesson renders, its
 * Your Three Spaces widget loads, answers survive navigation and reload, and the
 * page fits phone and laptop widths. Synthetic answers only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20306_BASE_URL || 'http://127.0.0.1:8765/index.html';
var IDS = ['203-06-story', '203-06-space', '203-06-faithful', '203-06-people', '203-06-key', '203-06-step', '203-06-prayer'];
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
        await page.goto(BASE + '#203-6', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#question-203-203-06-story', { timeout: 20000 });
        await page.locator('iframe[src*="three-spaces"]').scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        var info = await page.evaluate(function (ids) {
            var frame = document.querySelector('iframe[src*="three-spaces"]');
            var doc = frame && frame.contentDocument;
            return {
                present: ids.map(function (id) { return !!document.getElementById('question-203-' + id); }),
                retired: ['203-06-devos', '203-7-1', '203-07-bless'].some(function (id) { return !!document.getElementById('question-203-' + id); }),
                parable: document.body.textContent.indexOf('Faithful in Babylon') !== -1,
                widgetLoaded: !!(doc && doc.querySelector('#tri') && doc.querySelector('[data-control="begin"]')),
                widgetTitle: doc ? doc.title : '',
                widgetFits: !!frame && frame.getBoundingClientRect().width <= window.innerWidth,
                scrollWidth: document.documentElement.scrollWidth,
                viewport: window.innerWidth
            };
        }, IDS);
        assert(width + ': all seven 203-06 questions render', info.present.every(Boolean), JSON.stringify(info.present));
        assert(width + ': retired 203-06 IDs are not rendered', info.retired === false);
        assert(width + ': Daniel parable renders', info.parable);
        assert(width + ': Your Three Spaces widget loads within page width', info.widgetLoaded && info.widgetTitle === 'Your Three Spaces' && info.widgetFits);
        assert(width + ': page does not scroll sideways', info.scrollWidth <= info.viewport, info.scrollWidth + ' > ' + info.viewport);

        if (width === 390) {
            await page.fill('#question-203-203-06-space', 'SYN 2nd Space answer\nsecond line');
            await page.fill('#question-203-203-06-step', 'SYN step');
            await page.goto(BASE + '#203-5', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(500);
            await page.goto(BASE + '#203-6', { waitUntil: 'domcontentloaded' });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#question-203-203-06-space', { timeout: 20000 });
            assert('203-06 answers survive navigation and reload',
                (await page.inputValue('#question-203-203-06-space')) === 'SYN 2nd Space answer\nsecond line' &&
                (await page.inputValue('#question-203-203-06-step')) === 'SYN step');
        }
        await page.close();
    }
    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-06 browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
