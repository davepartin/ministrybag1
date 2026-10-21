#!/usr/bin/env node
/**
 * L-203-02 / L-203-03 browser check. The Begin in Prayer and Listen and Eat
 * lessons render with their stories, tools and questions, answers survive
 * navigation and reload, and the pages fit phone and laptop widths.
 * Synthetic answers only. Set GT_SHOT_DIR to save full-page screenshots.
 */
'use strict';

var path = require('path');
var { chromium } = require('playwright');

var BASE = process.env.L20302_BASE_URL || 'http://127.0.0.1:8765/index.html';
var SHOTS = process.env.GT_SHOT_DIR || '';
var LESSONS = [
    {
        hash: '#203-2',
        story: 'A Prayer Before the Answer',
        tool: 'Their Life, Their Heart, My Part',
        ids: ['203-02-story', '203-02-1', '203-02-rhythm', '203-02-7', '203-02-key', '203-02-step', '203-02-prayer'],
        retired: ['203-02-2', '203-02-3', '203-02-4', '203-02-5', '203-02-6', '203-02-devos']
    },
    {
        hash: '#203-3',
        story: 'Stay with Us',
        tool: 'Ask, Ask Again, Remember',
        ids: ['203-03-heard', '203-03-listen', '203-03-2', '203-03-6', '203-03-key', '203-03-step', '203-03-prayer'],
        retired: ['203-03-1', '203-03-3', '203-03-4', '203-03-5', '203-03-devos']
    }
];
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
        for (var lesson of LESSONS) {
            var page = await browser.newPage({ viewport: { width: width, height: 844 } });
            page.on('pageerror', function (err) { errors.push(String(err)); });
            await page.goto(BASE + lesson.hash, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#question-203-' + lesson.ids[0], { timeout: 20000 });
            var info = await page.evaluate(function (l) {
                var text = document.body.textContent;
                var images = Array.prototype.slice.call(document.querySelectorAll('.lesson-content img, img'))
                    .filter(function (img) { return img.offsetParent !== null; });
                return {
                    present: l.ids.map(function (id) { return !!document.getElementById('question-203-' + id); }),
                    retired: l.retired.filter(function (id) { return !!document.getElementById('question-203-' + id); }),
                    story: text.indexOf(l.story) !== -1,
                    tool: text.indexOf(l.tool) !== -1,
                    review: /Lesson \d Review/.test(text),
                    brokenImages: images.filter(function (img) { return img.complete && img.naturalWidth === 0; }).map(function (img) { return img.src; }),
                    scrollWidth: document.documentElement.scrollWidth,
                    viewport: window.innerWidth
                };
            }, lesson);
            var label = width + ' ' + lesson.hash + ': ';
            assert(label + 'all seven questions render', info.present.every(Boolean), JSON.stringify(info.present));
            assert(label + 'retired questions are gone', info.retired.length === 0, info.retired.join(','));
            assert(label + 'story, tool and review render', info.story && info.tool && info.review);
            assert(label + 'no broken images', info.brokenImages.length === 0, info.brokenImages.join(','));
            assert(label + 'page does not scroll sideways', info.scrollWidth <= info.viewport, info.scrollWidth + ' > ' + info.viewport);

            if (SHOTS && (width === 375 || width === 1280)) {
                await page.waitForTimeout(400);
                await page.screenshot({ path: path.join(SHOTS, lesson.hash.slice(1) + '-' + width + '.png'), fullPage: true });
            }

            if (width === 390) {
                var a = '#question-203-' + lesson.ids[1];
                var b = '#question-203-' + lesson.ids[5];
                await page.fill(a, 'SYN answer\nsecond line');
                await page.fill(b, 'SYN step');
                await page.goto(BASE + '#203-1', { waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(500);
                await page.goto(BASE + lesson.hash, { waitUntil: 'domcontentloaded' });
                await page.reload({ waitUntil: 'domcontentloaded' });
                await page.waitForSelector(a, { timeout: 20000 });
                assert(lesson.hash + ' answers survive navigation and reload',
                    (await page.inputValue(a)) === 'SYN answer\nsecond line' &&
                    (await page.inputValue(b)) === 'SYN step');
            }
            await page.close();
        }
    }
    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-02/03 browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
