#!/usr/bin/env node
// Synthetic, signed-out image delivery checks. No account or learner data access.
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chromium = require('playwright').chromium;
var BASE = process.env.PERF001A_BASE_URL || 'http://127.0.0.1:8872/index.html';
var SCREENSHOTS = process.env.PERF001A_SCREENSHOTS;
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
    console.log('PASS: ' + name);
}

async function waitForImages(page, selector) {
    await page.waitForFunction(function (sel) {
        return Array.from(document.querySelectorAll(sel)).every(function (img) {
            return img.complete && img.naturalWidth > 0;
        });
    }, selector);
}

(async function () {
    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        if (SCREENSHOTS) fs.mkdirSync(SCREENSHOTS, { recursive: true });
        for (var width of [375, 390, 1280]) {
            var context = await browser.newContext({ viewport: { width: width, height: 844 } });
            var page = await context.newPage();
            var errors = [];
            page.on('pageerror', function (error) { errors.push(error.message); });
            // Preview hosting enables sign-in; image checks must never initialize a live account.
            await page.route('**/scripts/account.js', function (route) {
                return route.fulfill({ contentType: 'text/javascript', body: '' });
            });
            await page.goto(BASE + '#101-1');
            await page.waitForSelector('#session-1.active');
            await page.waitForFunction(function () {
                var img = document.querySelector('#session-1 img');
                return img && img.complete && img.naturalWidth > 0;
            });
            await page.waitForTimeout(700);
            var cold = await page.evaluate(function () {
                var resources = performance.getEntriesByType('resource').filter(function (r) {
                    return r.name.startsWith(location.origin);
                });
                return {
                    bytes: resources.reduce(function (n, r) { return n + r.encodedBodySize; }, 0),
                    imageBytes: resources.filter(function (r) { return r.initiatorType === 'img'; })
                        .reduce(function (n, r) { return n + r.encodedBodySize; }, 0),
                    images: resources.filter(function (r) { return r.initiatorType === 'img'; }).map(function (r) { return r.name; }),
                    hiddenSources: document.querySelectorAll('.session:not(.active) img[src]').length,
                    pending: document.querySelectorAll('.session:not(.active) img[data-lesson-src]').length
                };
            });
            console.log('Cold load ' + width + 'px: ' + JSON.stringify(cold));
            check(width + ': no hidden lesson image sources or requests', cold.hiddenSources === 0 && cold.pending > 0 &&
                !cold.images.some(function (src) { return /aspen|woman-well|bless-logo|starting-logo/.test(src); }));
            check(width + ': first-load response bodies stay below 750 KB', cold.bytes > 0 && cold.bytes < 750000);
            check(width + ': delivered lesson images are compressed', cold.images.every(function (src) { return src.includes('.webp'); }));

            for (var lesson = 1; lesson <= 7; lesson += 1) {
                await page.evaluate(function (num) { showSession(num); }, lesson);
                var imgs = page.locator('#session-' + lesson + ' img');
                for (var idx = 0; idx < await imgs.count(); idx += 1) {
                    await imgs.nth(idx).scrollIntoViewIfNeeded();
                    await imgs.nth(idx).evaluate(function (img) { return img.decode(); });
                }
                // Printing promotes any remaining offscreen pictures, without opening other lessons.
                await page.evaluate(async function () {
                    await GrowingTogetherLessonImages.preparePrint(document.querySelector('.session.active'));
                });
                await waitForImages(page, '#session-' + lesson + ' img');
                check(width + ': lesson ' + lesson + ' images load after navigation',
                    await page.locator('#session-' + lesson + ' img[data-lesson-src]').count() === 0);
                check(width + ': lesson ' + lesson + ' fits viewport', await page.evaluate(function () {
                    return document.documentElement.scrollWidth <= window.innerWidth + 1;
                }));
            }

            await page.evaluate(function () { showSession(5); document.documentElement.style.scrollBehavior = 'auto'; });
            var dissolve = page.locator('#session-5 [data-parable-dissolve]');
            await dissolve.scrollIntoViewIfNeeded();
            var before = await dissolve.boundingBox();
            if (SCREENSHOTS) await dissolve.screenshot({ path: path.join(SCREENSHOTS, 'aspen-' + width + '.png') });
            await page.evaluate(function () {
                var el = document.querySelector('#session-5 [data-parable-dissolve]');
                window.scrollBy(0, el.getBoundingClientRect().top + el.getBoundingClientRect().height);
            });
            await page.waitForTimeout(100);
            var after = await dissolve.boundingBox();
            check(width + ': reveal preserves its image dimensions', Math.abs(before.height - after.height) < 1 && before.height > 100);
            check(width + ': reveal still reaches the color image', await page.locator('#session-5 .parable-img-bw').evaluate(function (img) {
                return Number(img.style.opacity) < 0.05;
            }));
            check(width + ': no script errors', errors.length === 0);
            await context.close();
        }

        var printPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await printPage.route('**/scripts/account.js', function (route) { return route.fulfill({ contentType: 'text/javascript', body: '' }); });
        await printPage.goto(BASE + '#101-6');
        await printPage.waitForSelector('#session-6.active');
        var printState = await printPage.evaluate(async function () {
            var captured;
            window.print = function () {
                captured = {
                    allImagesReady: Array.from(document.querySelectorAll('.session.active img')).every(function (img) {
                        return img.complete && img.naturalWidth > 0;
                    }),
                    hiddenImagesDeferred: document.querySelectorAll('#session-5 img[src]').length === 0,
                    printing: document.body.classList.contains('printing')
                };
            };
            await printLesson();
            return captured;
        });
        check('direct-link Save PDF waits for every current-lesson image', printState.allImagesReady && printState.printing);
        check('Save PDF leaves other lessons deferred', printState.hiddenImagesDeferred);
        await printPage.emulateMedia({ media: 'print' });
        if (SCREENSHOTS) await printPage.pdf({ path: path.join(SCREENSHOTS, '101-06-image-print.pdf'), printBackground: true });
        await printPage.close();

        var reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
        await reduced.route('**/scripts/account.js', function (route) { return route.fulfill({ contentType: 'text/javascript', body: '' }); });
        await reduced.goto(BASE + '#101-5');
        await reduced.waitForSelector('#session-5.active');
        await reduced.locator('#session-5 [data-parable-dissolve]').scrollIntoViewIfNeeded();
        await waitForImages(reduced, '#session-5 [data-parable-dissolve] img');
        check('high-density phone loads the larger responsive image', await reduced.locator('#session-5 .parable-img-color').evaluate(function (img) {
            return img.currentSrc.includes('-1280.webp');
        }));
        check('reduced motion still shows the color illustration', await reduced.locator('#session-5 .parable-img-bw').evaluate(function (img) {
            return getComputedStyle(img).opacity === '0';
        }));
        await reduced.close();
    } finally {
        await browser.close();
    }
    console.log(passed + ' image delivery browser checks passed.');
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
