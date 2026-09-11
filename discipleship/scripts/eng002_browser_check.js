#!/usr/bin/env node
/**
 * ENG-002 browser check. Confirms 202-10 and 203-04 teaching images load.
 * Synthetic navigation only. Does not read or write learner answers.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG002_BASE_URL || 'http://127.0.0.1:8765/index.html';
var failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

async function checkLessonPair(page, hash, sessionId, expected, label) {
    await page.goto(BASE + hash, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(sessionId + '.active', { timeout: 15000 });
    await page.waitForSelector(sessionId + ' .parable-img-color', { timeout: 15000 });
    await page.waitForFunction(function (sid) {
        var root = document.querySelector(sid);
        var color = root && root.querySelector('.parable-img-color');
        var bw = root && root.querySelector('.parable-img-bw');
        return color && bw && color.complete && bw.complete && color.naturalWidth > 0 && bw.naturalWidth > 0;
    }, sessionId, { timeout: 15000 });
    var info = await page.evaluate(function (sid) {
        var root = document.querySelector(sid);
        var color = root ? root.querySelector('.parable-img-color') : null;
        var bw = root ? root.querySelector('.parable-img-bw') : null;
        return {
            colorSrc: color ? color.getAttribute('src') : null,
            bwSrc: bw ? bw.getAttribute('src') : null,
            colorW: color ? color.naturalWidth : 0,
            colorH: color ? color.naturalHeight : 0,
            bwW: bw ? bw.naturalWidth : 0,
            bwH: bw ? bw.naturalHeight : 0,
            colorComplete: color ? color.complete : false,
            bwComplete: bw ? bw.complete : false
        };
    }, sessionId);
    assert(label + ' color src points at expected file', info.colorSrc && info.colorSrc.indexOf(expected.color) !== -1, info.colorSrc);
    assert(label + ' B&W src points at expected file', info.bwSrc && info.bwSrc.indexOf(expected.bw) !== -1, info.bwSrc);
    assert(label + ' color image loaded', info.colorComplete && info.colorW > 0, JSON.stringify(info));
    assert(label + ' B&W image loaded', info.bwComplete && info.bwW > 0, JSON.stringify(info));
    return info;
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await browser.newPage();

    await page.setViewportSize({ width: 390, height: 844 });
    var supper = await checkLessonPair(page, '#202-10', '#session-10', {
        color: 'images/last-supper-color.jpg',
        bw: 'images/last-supper-bw.jpg'
    }, '202-10 phone');

    var feet = await checkLessonPair(page, '#203-4', '#session-4', {
        color: 'images/jesus-washing-feet-color.png',
        bw: 'images/jesus-washing-feet-bw.png'
    }, '203-04 phone');

    await page.setViewportSize({ width: 1280, height: 800 });
    await checkLessonPair(page, '#202-10', '#session-10', {
        color: 'images/last-supper-color.jpg',
        bw: 'images/last-supper-bw.jpg'
    }, '202-10 laptop');

    assert('202-10 pair shares one composition size', supper.colorW === supper.bwW && supper.colorH === supper.bwH);
    assert('203-04 pair shares one composition size', feet.colorW === feet.bwW && feet.colorH === feet.bwH);

    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nBrowser ENG-002 checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
