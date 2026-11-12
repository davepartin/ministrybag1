#!/usr/bin/env node
// Synthetic image delivery checks across the four active courses. No real accounts.
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chromium = require('playwright').chromium;
var BASE = process.env.PERF001B_BASE_URL || 'http://127.0.0.1:8878/index.html';
var SCREENSHOTS = process.env.PERF001B_SCREENSHOTS;
var COURSES = { '101': 7, '201': 10, '202': 10, '203': 10 };
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
    console.log('PASS: ' + name);
}

async function signedOutPage(browser, width, extra) {
    var page = await browser.newPage(Object.assign({ viewport: { width: width, height: 844 } }, extra));
    await page.route('**/scripts/account.js', function (route) {
        return route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    return page;
}

async function loadImages(page) {
    // Exercise the existing readiness helper without invoking print or generating a PDF.
    await page.evaluate(async function () {
        await GrowingTogetherLessonImages.preparePrint(document.querySelector('.session.active'));
    });
    await page.waitForFunction(function () {
        return Array.from(document.querySelectorAll('.session.active img')).every(function (img) {
            return img.complete && img.naturalWidth > 0;
        });
    });
}

async function inspect(page) {
    return page.evaluate(function () {
        return Array.from(document.querySelectorAll('.session.active img')).map(function (img) {
            return {
                src: img.currentSrc,
                width: Number(img.getAttribute('width')),
                height: Number(img.getAttribute('height')),
                bounds: { width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height }
            };
        });
    });
}

(async function () {
    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        if (SCREENSHOTS) fs.mkdirSync(SCREENSHOTS, { recursive: true });
        for (var width of [375, 390, 1280]) {
            for (var course of Object.keys(COURSES)) {
                var page = await signedOutPage(browser, width);
                var errors = [];
                var rasterRequests = [];
                page.on('pageerror', function (error) { errors.push(error.message); });
                page.on('request', function (request) {
                    if (new URL(request.url()).pathname.match(/\/images\/.*\.(jpe?g|png)$/i)) {
                        rasterRequests.push(request.url());
                    }
                });
                await page.goto(BASE + '#' + course + '-1', { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('#session-1.active');
                check(width + '/' + course + ': inactive lessons retain deferred sources', await page.evaluate(function () {
                    return document.querySelectorAll('.session:not(.active) img[src]').length === 0 &&
                        document.querySelectorAll('.session:not(.active) img[data-lesson-src]').length > 0;
                }));
                for (var lesson = 1; lesson <= COURSES[course]; lesson += 1) {
                    await page.evaluate(function (num) { showSession(num); }, lesson);
                    await loadImages(page);
                    var state = await inspect(page);
                    var label = width + '/' + course + '-' + lesson;
                    check(label + ': all pictures use optimized WebP delivery', state.length > 0 && state.every(function (img) {
                        return new URL(img.src).pathname.startsWith('/images/optimized/') && img.src.includes('.webp');
                    }));
                    check(label + ': images reserve positive dimensions', state.every(function (img) {
                        return img.width > 0 && img.height > 0 && img.bounds.width > 0 && img.bounds.height > 0;
                    }));
                    check(label + ': viewport has no horizontal overflow', await page.evaluate(function () {
                        return document.documentElement.scrollWidth <= window.innerWidth + 1;
                    }));
                }
                check(width + '/' + course + ': no original JPG or PNG is requested', rasterRequests.length === 0);
                check(width + '/' + course + ': no script errors', errors.length === 0);
                await page.close();
            }
        }

        for (var sample of [
            { hash: '201-3', selector: '[data-parable-dissolve]', type: 'dissolve' },
            { hash: '201-4', selector: '[data-parable-sequence]', type: 'sequence' },
            { hash: '202-9', selector: '[data-parable-dissolve]', type: 'dissolve' },
            { hash: '203-4', selector: '[data-parable-dissolve]', type: 'dissolve' }
        ]) {
            for (var sampleWidth of [390, 1280]) {
                var samplePage = await signedOutPage(browser, sampleWidth);
                await samplePage.goto(BASE + '#' + sample.hash, { waitUntil: 'domcontentloaded' });
                await samplePage.waitForSelector('.session.active ' + sample.selector);
                await loadImages(samplePage);
                var visual = samplePage.locator('.session.active ' + sample.selector);
                await visual.scrollIntoViewIfNeeded();
                if (SCREENSHOTS) await visual.screenshot({ path: path.join(SCREENSHOTS, sample.hash + '-' + sampleWidth + '.png') });
                var initial = await visual.boundingBox();
                await samplePage.evaluate(function (selector) {
                    var el = document.querySelector('.session.active ' + selector);
                    var topbar = document.querySelector('.lesson-topbar');
                    var contentTop = topbar.getBoundingClientRect().bottom;
                    var visibleHeight = window.innerHeight - contentTop;
                    var start = contentTop + visibleHeight * 0.4;
                    var end = contentTop - visibleHeight * 0.22;
                    window.scrollBy({ top: el.getBoundingClientRect().top - (start - (start - end) * 1.05), behavior: 'instant' });
                }, sample.selector);
                await samplePage.waitForTimeout(100);
                check(sample.hash + '/' + sampleWidth + ': reveal reaches final image', await visual.evaluate(function (el) {
                    var bw = el.querySelector('.parable-img-bw');
                    if (bw) return Number(getComputedStyle(bw).opacity) < 0.05;
                    var last = el.querySelector('.parable-sequence-frame:last-child');
                    return Number(getComputedStyle(last).opacity) > 0.95;
                }));
                var final = await visual.boundingBox();
                check(sample.hash + '/' + sampleWidth + ': image box stays the same height', Math.abs(initial.height - final.height) < 1);
                await samplePage.close();
            }
        }

        var reduced = await signedOutPage(browser, 390, { reducedMotion: 'reduce', deviceScaleFactor: 3 });
        await reduced.goto(BASE + '#201-4', { waitUntil: 'domcontentloaded' });
        await reduced.waitForSelector('.session.active [data-parable-sequence]');
        await loadImages(reduced);
        check('3x phone uses the larger responsive copy', await reduced.locator('.session.active .parable-sequence-frame:last-child').evaluate(function (img) {
            return img.currentSrc.includes('-1248.webp');
        }));
        check('reduced motion shows the last frame without scrolling', await reduced.locator('.session.active .parable-sequence-frame:last-child').evaluate(function (img) {
            return Number(getComputedStyle(img).opacity) === 1;
        }));
        await reduced.close();
    } finally {
        await browser.close();
    }
    console.log(passed + ' all-course image delivery browser checks passed.');
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
