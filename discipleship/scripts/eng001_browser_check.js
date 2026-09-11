#!/usr/bin/env node
/**
 * ENG-001 browser check. Synthetic data only.
 * Requires the local app at http://127.0.0.1:8765/
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG001_BASE_URL || 'http://127.0.0.1:8765/index.html';
var failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

function closingIds(course, lesson) {
    return [
        'question-' + course + '-' + lesson + '-key',
        'question-' + course + '-' + lesson + '-devos',
        'question-' + course + '-' + lesson + '-prayer'
    ];
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await browser.newPage();

    await page.addInitScript(function () {
        if (sessionStorage.getItem('eng001-seeded') === '1') {
            return;
        }
        localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            'question-202-201-09-key': 'SYN-old-202-shared-key',
            'question-202-201-09-devos': 'SYN-old-202-shared-devos',
            'question-202-201-09-prayer': 'SYN-old-202-shared-prayer',
            'question-203-203-07-key': 'SYN-old-203-shared-key',
            'question-203-203-07-devos': 'SYN-old-203-shared-devos',
            'question-203-203-07-prayer': 'SYN-old-203-shared-prayer',
            'question-101-1-key': 'SYN-101-keep'
        }));
        sessionStorage.setItem('eng001-seeded', '1');
    });

    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    var afterLoad = await page.evaluate(function () {
        var raw = localStorage.getItem('christianFoundationsResponses');
        return raw ? JSON.parse(raw) : {};
    });

    assert('migration flag is set after first load', afterLoad.__gtSharedKeyMigrationV1 === true);
    assert('old 202 shared key remains recoverable', afterLoad['question-202-201-09-key'] === 'SYN-old-202-shared-key');
    assert('101 key preserved in browser storage', afterLoad['question-101-1-key'] === 'SYN-101-keep');
    assert(
        '202 shared value is ambiguous, not assigned',
        afterLoad.__gtAmbiguousSharedAnswers &&
            afterLoad.__gtAmbiguousSharedAnswers.items['question-202-201-09-key'].status === 'ambiguous' &&
            afterLoad.__gtAmbiguousSharedAnswers.items['question-202-201-09-key'].value === 'SYN-old-202-shared-key'
    );
    assert('203 shared live keys were vacated', afterLoad['question-203-203-07-key'] === undefined);
    assert(
        '203 shared value remains in recovery',
        afterLoad.__gtAmbiguousSharedAnswers.items['question-203-203-07-key'].value === 'SYN-old-203-shared-key'
    );

    await page.goto(BASE + '#202-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-05-key', { timeout: 15000 });
    var lesson05Values = await page.evaluate(function (ids) {
        return ids.map(function (id) {
            var el = document.getElementById(id);
            return el ? el.value : null;
        });
    }, closingIds('202', '202-05'));
    assert(
        '202-05 closing fields do not show the old shared value',
        lesson05Values.every(function (v) { return v === ''; })
    );

    await page.fill('#question-202-202-05-key', 'SYN-202-05-key');
    await page.fill('#question-202-202-05-devos', 'SYN-202-05-devos');
    await page.fill('#question-202-202-05-prayer', 'SYN-202-05-prayer');

    await page.goto(BASE + '#202-9', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-09-key', { timeout: 15000 });
    var lesson09Before = await page.evaluate(function () {
        return document.getElementById('question-202-202-09-key').value;
    });
    assert('202-09 is empty after 202-05 was filled', lesson09Before === '');

    await page.fill('#question-202-202-09-key', 'SYN-202-09-key');
    await page.fill('#question-202-202-09-devos', 'SYN-202-09-devos');
    await page.fill('#question-202-202-09-prayer', 'SYN-202-09-prayer');

    await page.goto(BASE + '#202-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-05-key', { timeout: 15000 });
    var backTo05 = await page.inputValue('#question-202-202-05-key');
    assert('navigation back to 202-05 keeps its own answer', backTo05 === 'SYN-202-05-key');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-05-key', { timeout: 15000 });
    var reloaded05 = await page.inputValue('#question-202-202-05-key');
    assert('reload keeps 202-05 answer', reloaded05 === 'SYN-202-05-key');

    await page.goto(BASE + '#202-9', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-09-key', { timeout: 15000 });
    var reloaded09 = await page.inputValue('#question-202-202-09-key');
    assert('reload keeps 202-09 answer independent', reloaded09 === 'SYN-202-09-key');

    await page.goto(BASE + '#203-6', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-203-203-06-key', { timeout: 15000 });
    var lesson06 = await page.inputValue('#question-203-203-06-key');
    assert('203-06 does not show the old shared value', lesson06 === '');

    await page.goto(BASE + '#203-7', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-203-203-07-key', { timeout: 15000 });
    var lesson07 = await page.inputValue('#question-203-203-07-key');
    assert('203-07 does not show the old shared value', lesson07 === '');

    await page.fill('#question-203-203-07-key', 'SYN-203-07-new');
    await page.goto(BASE + '#203-6', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-203-203-06-key', { timeout: 15000 });
    assert('203-06 stays empty after a new 203-07 answer', (await page.inputValue('#question-203-203-06-key')) === '');
    await page.goto(BASE + '#203-7', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-203-203-07-key', { timeout: 15000 });
    assert('203-07 keeps its post-migration answer', (await page.inputValue('#question-203-203-07-key')) === 'SYN-203-07-new');

    var finalStore = await page.evaluate(function () {
        return JSON.parse(localStorage.getItem('christianFoundationsResponses'));
    });
    assert('final store still has 101 key', finalStore['question-101-1-key'] === 'SYN-101-keep');
    assert('final store still has ambiguous 202 recovery', finalStore.__gtAmbiguousSharedAnswers.items['question-202-201-09-key'].value === 'SYN-old-202-shared-key');

    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nBrowser ENG-001 checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
