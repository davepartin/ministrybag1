#!/usr/bin/env node
/**
 * ENG-003 browser check. Synthetic navigation only.
 * Confirms iframe titles, observer safety, step controls, back/restart,
 * viewport changes, and course-switch cleanup. Does not read learner answers.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG003_BASE_URL || 'http://127.0.0.1:8765/index.html';
var failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

function isObserverError(text) {
    if (!text) return false;
    return /MutationObserver/i.test(text) ||
        /parameter 1 is not of type 'Node'/i.test(text) ||
        /Failed to execute 'observe'/i.test(text);
}

function attachErrorCollectors(page, bucket) {
    page.on('pageerror', function (err) {
        bucket.push(String(err && err.message ? err.message : err));
    });
    page.on('console', function (msg) {
        if (msg.type() === 'error') bucket.push(msg.text());
    });
}

async function waitForActiveWidget(page, sessionId) {
    await page.waitForSelector(sessionId + '.active iframe.gt-widget-frame', { timeout: 20000 });
    await page.waitForFunction(function (sid) {
        var root = document.querySelector(sid);
        var frame = root && root.querySelector('iframe.gt-widget-frame');
        if (!frame) return false;
        try {
            var doc = frame.contentDocument;
            return !!(doc && doc.body && doc.body.childElementCount > 0);
        } catch (err) {
            return false;
        }
    }, sessionId, { timeout: 20000 });
}

function widgetFrame(page, sessionId) {
    return page.frameLocator(sessionId + '.active iframe.gt-widget-frame').first();
}

async function primaryControl(frame) {
    var restart = frame.getByRole('button', { name: /restart|start over/i });
    if (await restart.count()) return restart.first();
    var begin = frame.getByRole('button', { name: /^begin/i });
    if (await begin.count()) return begin.first();
    return frame.getByRole('button', { name: /^next/i }).first();
}

async function backControl(frame) {
    return frame.getByRole('button', { name: /^back/i }).first();
}

async function controlReachable(page, sessionId, frame, label) {
    var iframeBox = await page.locator(sessionId + '.active iframe.gt-widget-frame').first().boundingBox();
    var btn = await primaryControl(frame);
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    var box = await btn.boundingBox();
    var ok = !!(iframeBox && box && box.width > 8 && box.height > 8 &&
        box.y + 4 >= iframeBox.y &&
        box.y + box.height - 4 <= iframeBox.y + iframeBox.height &&
        box.x + 4 >= iframeBox.x &&
        box.x + box.width - 4 <= iframeBox.x + iframeBox.width);
    assert(label + ' primary control is inside the iframe', ok, JSON.stringify({ iframeBox: iframeBox, box: box }));
    return btn;
}

async function walkSteppedWidget(page, hash, sessionId, label, nextClicks) {
    await page.goto(BASE + hash, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(sessionId + '.active', { timeout: 20000 });
    await waitForActiveWidget(page, sessionId);
    var frame = widgetFrame(page, sessionId);
    var iframe = page.locator(sessionId + '.active iframe.gt-widget-frame').first();
    var title = await iframe.getAttribute('title');
    assert(label + ' iframe has a meaningful title', !!(title && title.trim() && title.trim() !== 'iframe'), title);

    var startHeight = await iframe.evaluate(function (el) {
        return parseInt(el.style.height || '0', 10);
    });
    assert(label + ' iframe has a usable height', startHeight > 50, String(startHeight));

    var btn = await controlReachable(page, sessionId, frame, label + ' start');
    var firstLabel = ((await btn.innerText()) || '').replace(/\s+/g, ' ').trim();
    await btn.click();
    await page.waitForTimeout(250);

    for (var i = 0; i < nextClicks; i++) {
        btn = await controlReachable(page, sessionId, frame, label + ' step ' + (i + 1));
        await btn.click();
        await page.waitForTimeout(200);
    }

    var restart = frame.getByRole('button', { name: /restart|start over/i }).first();
    await restart.waitFor({ state: 'visible', timeout: 8000 });
    await controlReachable(page, sessionId, frame, label + ' restart');
    await restart.click();
    await page.waitForTimeout(250);
    var afterRestart = await primaryControl(frame);
    var afterText = ((await afterRestart.innerText()) || '').replace(/\s+/g, ' ').trim();
    assert(
        label + ' restart returns a beginning control',
        /begin|next/i.test(afterText),
        afterText
    );

    if (/begin/i.test(firstLabel) || /begin/i.test(afterText)) {
        await afterRestart.click();
        await page.waitForTimeout(200);
    }
    var back = await backControl(frame);
    if (await back.count()) {
        var disabled = await back.isDisabled();
        if (disabled) {
            var nextAgain = await primaryControl(frame);
            await nextAgain.click();
            await page.waitForTimeout(200);
            back = await backControl(frame);
        }
        await back.click();
        await page.waitForTimeout(200);
        await controlReachable(page, sessionId, frame, label + ' after back');
    }

    var laterHeight = await iframe.evaluate(function (el) {
        return parseInt(el.style.height || '0', 10);
    });
    assert(label + ' iframe still has a usable height after steps', laterHeight > 50, String(laterHeight));
}

async function checkCourseTitles(page, hash, sessionPrefix, expectedMin, label) {
    await page.goto(BASE + hash, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(sessionPrefix, { timeout: 20000 });
    await page.waitForFunction(function () {
        return document.querySelectorAll('iframe.gt-widget-frame').length > 0;
    }, null, { timeout: 20000 });
    await page.waitForTimeout(800);
    var info = await page.evaluate(function () {
        var frames = Array.prototype.slice.call(document.querySelectorAll('iframe.gt-widget-frame'));
        return frames.map(function (frame) {
            return {
                id: frame.id,
                title: frame.getAttribute('title') || '',
                height: parseInt(frame.style.height || '0', 10)
            };
        });
    });
    assert(label + ' rendered at least ' + expectedMin + ' widget iframe(s)', info.length >= expectedMin, String(info.length));
    var untitled = info.filter(function (item) {
        return !item.title.trim();
    });
    assert(label + ' every iframe has a title', untitled.length === 0, JSON.stringify(untitled));
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await browser.newPage();
    var errors = [];
    attachErrorCollectors(page, errors);

    await page.setViewportSize({ width: 390, height: 844 });
    await walkSteppedWidget(page, '#201-1', '#session-1', '201-01 phone', 4);
    await walkSteppedWidget(page, '#201-8', '#session-8', '201-08 phone', 5);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE + '#201-8', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-8.active', { timeout: 20000 });
    await waitForActiveWidget(page, '#session-8');
    await controlReachable(page, '#session-8', widgetFrame(page, '#session-8'), '201-08 375px');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE + '#201-1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-1.active', { timeout: 20000 });
    await waitForActiveWidget(page, '#session-1');
    await controlReachable(page, '#session-1', widgetFrame(page, '#session-1'), '201-01 laptop');

    await checkCourseTitles(page, '#101-2', '#session-2.active', 1, '101');
    await waitForActiveWidget(page, '#session-2');
    await controlReachable(page, '#session-2', widgetFrame(page, '#session-2'), '101-02');

    await checkCourseTitles(page, '#202-10', '#session-10.active', 1, '202-10');
    await page.waitForSelector('#session-10.active iframe.gt-widget-frame', { timeout: 20000 });
    var ordinancesTitle = await page.locator('#session-10.active iframe.gt-widget-frame').getAttribute('title');
    assert(
        '202-10 iframe title names the ordinances widget',
        /doorway|table|ordinance/i.test(ordinancesTitle || ''),
        ordinancesTitle
    );

    await checkCourseTitles(page, '#203-7', '#session-7.active', 1, '203-07');
    await waitForActiveWidget(page, '#session-7');
    await controlReachable(page, '#session-7', widgetFrame(page, '#session-7'), '203-07');

    await page.goto(BASE + '#201-8', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-8.active', { timeout: 20000 });
    await waitForActiveWidget(page, '#session-8');
    await controlReachable(page, '#session-8', widgetFrame(page, '#session-8'), '201-08 after course switch');

    var observerErrors = errors.filter(isObserverError);
    assert('no MutationObserver exceptions in browser logs', observerErrors.length === 0, observerErrors.join(' | '));

    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nBrowser ENG-003 checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
