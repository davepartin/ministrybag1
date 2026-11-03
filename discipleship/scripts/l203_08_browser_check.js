#!/usr/bin/env node
/**
 * L-203-08 browser check. How to Disciple Others renders, the SPACES
 * tables widget starts on Make Space, walks Study / Practice /
 * Appropriate Challenge / Encourage / Send, and spells SPACES, answers survive navigation
 * and reload, and the page fits phone and laptop widths. Synthetic
 * answers only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20308_BASE_URL || 'http://127.0.0.1:8765/index.html';
var IDS = ['203-08-invested', '203-08-spoke', '203-08-who', '203-08-start', '203-08-key', '203-08-step', '203-08-prayer'];
var SLIDE_TITLES = [
    'Making Space',
    'Study',
    'Practice',
    'Appropriate Challenge',
    'Encourage',
    'Send',
    'Two Become Four',
    'A Room Full of Tables'
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
        var page = await browser.newPage({ viewport: { width: width, height: 844 } });
        page.on('pageerror', function (err) { errors.push(String(err)); });
        await page.goto(BASE + '#203-8', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#question-203-203-08-invested', { timeout: 20000 });
        await page.locator('iframe[src*="spaces-tables"]').scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        var info = await page.evaluate(function (ids) {
            var frame = document.querySelector('iframe[src*="spaces-tables"]');
            var doc = frame && frame.contentDocument;
            var bodyText = document.body.textContent;
            var foot = doc && doc.querySelector('.foot') ? doc.querySelector('.foot').textContent : '';
            var widgetText = doc ? doc.body.textContent : '';
            return {
                present: ids.map(function (id) { return !!document.getElementById('question-203-' + id); }),
                parable: bodyText.indexOf('Four Generations') !== -1,
                spacesLine: bodyText.indexOf('Study, Practice, Appropriate Challenge, Encourage, Send') !== -1,
                review: bodyText.indexOf('Lesson 8 Review') !== -1,
                closing: bodyText.indexOf('Closing Reflections') !== -1,
                sendHeading: bodyText.indexOf('Send') !== -1,
                staleAcronym: /\bSPACE\b/.test(bodyText.replace(/SPACES/g, '')),
                staleWheel: /wheel/i.test(bodyText) && bodyText.indexOf('The Wheel') !== -1,
                staleLoop: foot.indexOf('loop') !== -1 || widgetText.indexOf('Cycle Continues') !== -1,
                widgetLoaded: !!(doc && doc.querySelector('#next') && doc.querySelector('#title')),
                widgetTitle: doc ? doc.title : '',
                firstSlide: doc && doc.getElementById('title') ? doc.getElementById('title').textContent : '',
                footer: foot,
                widgetFits: !!frame && frame.getBoundingClientRect().width <= window.innerWidth,
                iframeOverflowX: !!(doc && doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1),
                scrollWidth: document.documentElement.scrollWidth,
                viewport: window.innerWidth
            };
        }, IDS);
        assert(width + ': all seven 203-08 questions render', info.present.every(Boolean), JSON.stringify(info.present));
        assert(width + ': Four Generations parable renders', info.parable);
        assert(width + ': SPACES line, Send, Review, and closing render', info.spacesLine && info.sendHeading && info.review && info.closing);
        assert(width + ': stale SPACE-only / Wheel wording is gone', info.staleAcronym === false && info.staleWheel === false, JSON.stringify({ staleAcronym: info.staleAcronym, staleWheel: info.staleWheel }));
        assert(width + ': SPACES widget loads within page width', info.widgetLoaded && info.widgetTitle === 'Make Space' && info.widgetFits);
        assert(width + ': widget opens on Making Space', info.firstSlide === 'Making Space', info.firstSlide);
        assert(width + ': widget has no footer line and is not a loop', info.footer === '' && info.staleLoop === false, info.footer);
        assert(width + ': page does not scroll sideways', info.scrollWidth <= info.viewport, info.scrollWidth + ' > ' + info.viewport);
        assert(width + ': widget does not scroll sideways', info.iframeOverflowX === false);

        if (width === 390) {
            var iframe = page.frameLocator('iframe[src*="spaces-tables"]');
            var seen = [];
            for (var i = 0; i < SLIDE_TITLES.length; i++) {
                var title = await iframe.locator('#title').textContent();
                seen.push(title);
                if (i < SLIDE_TITLES.length - 1) {
                    await iframe.locator('#next').click();
                    await page.waitForTimeout(150);
                    if (i === 4) {
                        var letters = await iframe.locator('.letter.on').count();
                        assert('390: SPACES is fully spelled on Send', letters === 6, String(letters));
                    }
                }
            }
            assert('390: SPACES storyboard titles stay in order', JSON.stringify(seen) === JSON.stringify(SLIDE_TITLES), JSON.stringify(seen));
            var sendIndex = seen.indexOf('Send');
            var encourageIndex = seen.indexOf('Encourage');
            assert('390: Send comes after Encourage', sendIndex === encourageIndex + 1, JSON.stringify({ encourageIndex: encourageIndex, sendIndex: sendIndex }));
            var nextLabel = await iframe.locator('#next').textContent();
            assert('390: last frame offers See it again', nextLabel.indexOf('See it again') !== -1, nextLabel);
            await iframe.locator('#next').click();
            await page.waitForTimeout(200);
            var restarted = await iframe.locator('#title').textContent();
            assert('390: See it again returns to Making Space', restarted === 'Making Space', restarted);

            await page.fill('#question-203-203-08-spoke', 'SYN SPACES plan\nsecond line');
            await page.fill('#question-203-203-08-step', 'SYN step');
            await page.goto(BASE + '#203-7', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(500);
            await page.goto(BASE + '#203-8', { waitUntil: 'domcontentloaded' });
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#question-203-203-08-spoke', { timeout: 20000 });
            assert('203-08 answers survive navigation and reload',
                (await page.inputValue('#question-203-203-08-spoke')) === 'SYN SPACES plan\nsecond line' &&
                (await page.inputValue('#question-203-203-08-step')) === 'SYN step');
        }
        await page.close();
    }
    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-08 browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
