#!/usr/bin/env node
// About-page navigation and privacy checks. Uses synthetic stores, never live accounts.
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chromium = require('playwright').chromium;
var BASE = process.env.UX006_BASE_URL || 'http://127.0.0.1:8874/index.html';
var SHOTS = process.env.UX006_SCREENSHOTS;
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
    console.log('PASS: ' + name);
}

async function stores(page) {
    return page.evaluate(function () {
        return ['christianFoundationsResponses', 'foundationsCompletionData', 'foundationsReadingData']
            .map(function (key) { return localStorage.getItem(key); });
    });
}

async function isolatedContext(browser, width) {
    var context = await browser.newContext({ viewport: { width: width, height: 844 } });
    await context.route('**/scripts/account.js', function (route) {
        return route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    await context.addInitScript(function () {
        if (localStorage.getItem('christianFoundationsResponses')) return;
        localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            '__gtSharedKeyMigrationV1': true,
            'question-201-201-08-1': 'SYN-original-answer'
        }));
        localStorage.setItem('foundationsCompletionData', JSON.stringify({ 'complete-201-8': true }));
        localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-1': 'SYN-note' }));
    });
    return context;
}

async function onlyView(page, name) {
    return page.evaluate(function (expected) {
        return ['home', 'tree', 'lesson', 'about'].filter(function (view) {
            return getComputedStyle(document.getElementById(view + '-view')).display !== 'none';
        }).join(',') === expected;
    }, name);
}

(async function () {
    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
        for (var width of [375, 390, 1280]) {
            var context = await isolatedContext(browser, width);
            var page = await context.newPage();
            var photos = [];
            var errors = [];
            page.on('request', function (request) { if (request.url().includes('/images/dave-partin.webp')) photos.push(request.url()); });
            page.on('pageerror', function (error) { errors.push(error.message); });
            await page.goto(BASE);
            await page.waitForSelector('#home-about-link');
            var original = await stores(page);
            check(width + ': About is linked from the bottom of home only',
                await page.locator('#home-view footer #home-about-link').count() === 1 &&
                await page.locator('#lesson-view #home-about-link').count() === 0);
            check(width + ': portrait stays deferred on home', photos.length === 0 &&
                await page.locator('#about-portrait').getAttribute('src') === null);
            await page.locator('#home-about-link').focus();
            await page.keyboard.press('Enter');
            await page.waitForSelector('#about-view.active');
            await page.locator('#about-portrait').evaluate(function (img) { return img.decode(); });
            check(width + ': About opens by keyboard at a shareable URL', page.url().endsWith('#about') && await onlyView(page, 'about'));
            check(width + ': heading receives keyboard focus', await page.evaluate(function () { return document.activeElement.id === 'about-heading'; }));
            check(width + ': actual portrait loads with reserved square dimensions', await page.locator('#about-portrait').evaluate(function (img) {
                return img.naturalWidth === 480 && img.naturalHeight === 480 && img.width === img.height;
            }));
            var copy = await page.locator('#about-view').innerText();
            check(width + ': bio identifies author, local church and ministry background',
                ['Dave Partin', '30 years', 'Overland Park, Kansas', 'Neighborhood Church', 'Send Network', 'Cru', 'Young Life']
                    .every(function (phrase) { return copy.includes(phrase); }));
            check(width + ': purpose, free access and personal ownership are clear', copy.includes('worship our wonderful Jesus') &&
                copy.includes('Growing Together is free') && copy.includes('not an official publication'));
            check(width + ': church link is verified and opens safely',
                await page.locator('#about-view a[target="_blank"]').getAttribute('href') === 'https://neighborhoodchurchop.com/about' &&
                (await page.locator('#about-view a[target="_blank"]').getAttribute('rel')).includes('noopener'));
            check(width + ': no personal inbox, payment ask or form placeholder', !copy.includes('davepartin@gmail.com') &&
                !/donat|100 users|tax.deduct|subscribe/i.test(copy) && await page.locator('#about-view form').count() === 0);
            check(width + ': full Scripture acknowledgment is in About, with one short line kept on lessons',
                await page.locator('#about-view .esv-footnote').count() === 1 && await page.locator('#home-view .esv-footnote').count() === 0 &&
                await page.locator('#lesson-view .lesson-esv-footnote').count() === 1);
            await page.click('#about-acknowledgments summary');
            check(width + ': acknowledgment opens accessibly and retains ESV/WEB text', await page.locator('.esv-footnote').isVisible() &&
                (await page.locator('.esv-footnote').innerText()).includes('World English Bible'));
            check(width + ': text stays within the viewport', await page.evaluate(function () {
                return document.documentElement.scrollWidth <= innerWidth + 1;
            }));
            if (SHOTS) {
                await page.evaluate(function () { scrollTo({ top: 0, behavior: 'instant' }); });
                await page.screenshot({ path: path.join(SHOTS, 'about-top-' + width + '.png') });
                await page.screenshot({ path: path.join(SHOTS, 'about-full-' + width + '.png'), fullPage: true });
            }
            await page.evaluate(function () { document.documentElement.style.fontSize = '32px'; });
            check(width + ': 200 percent text size has no horizontal overflow', await page.evaluate(function () {
                return document.documentElement.scrollWidth <= innerWidth + 1;
            }));
            await page.evaluate(function () { document.documentElement.style.fontSize = ''; });
            await page.waitForFunction(function () { return !_suppressHashNav; });
            await page.goBack();
            await page.waitForFunction(function () { return !document.getElementById('home-view').classList.contains('hidden'); });
            check(width + ': browser Back restores home without another view', await onlyView(page, 'home'));
            await page.goForward();
            await page.waitForSelector('#about-view.active');
            check(width + ': browser Forward restores About without reloading portrait', await onlyView(page, 'about') && photos.length === 1);
            await page.click('#about-return-link');
            check(width + ': return link restores focus to the home About control', await onlyView(page, 'home') &&
                await page.locator('#home-about-link').evaluate(function (el) { return document.activeElement === el; }));
            check(width + ': About navigation leaves all three stores unchanged', JSON.stringify(await stores(page)) === JSON.stringify(original));
            await page.waitForFunction(function () { return !_suppressHashNav; });
            await page.goto(BASE + '#about');
            await page.waitForSelector('#about-view.active');
            await page.reload();
            await page.waitForSelector('#about-view.active');
            check(width + ': direct About URL and refresh retain all stores', await onlyView(page, 'about') &&
                JSON.stringify(await stores(page)) === JSON.stringify(original));
            check(width + ': no page errors', errors.length === 0);
            await context.close();
        }

        var context = await isolatedContext(browser, 390);
        var page = await context.newPage();
        await page.addInitScript(function () {
            var original = Storage.prototype.setItem;
            Storage.prototype.setItem = function (key, value) {
                if (key === 'christianFoundationsResponses' && String(value).includes('SYN-unsaved')) {
                    throw new DOMException('Synthetic quota failure', 'QuotaExceededError');
                }
                return original.call(this, key, value);
            };
        });
        await page.goto(BASE + '#201-8');
        await page.waitForSelector('#session-8.active');
        await page.fill('#question-201-201-08-1', 'SYN-unsaved-answer');
        await page.waitForSelector('#save-status-banner:not([hidden])');
        var disk = await stores(page);
        await page.click('.back-btn');
        await page.click('#home-about-link');
        check('unsaved answer and recovery remain available while reading About', await onlyView(page, 'about') &&
            await page.locator('#save-status-download-backup').isVisible() && await page.evaluate(function () {
                return responses['question-201-201-08-1'] === 'SYN-unsaved-answer';
            }));
        await page.waitForFunction(function () { return !_suppressHashNav; });
        await page.goBack();
        await page.waitForFunction(function () { return !document.getElementById('home-view').classList.contains('hidden'); });
        await page.goBack();
        await page.waitForSelector('#lesson-view.active #session-8.active');
        check('browser Back returns to the same lesson and unsaved text', await onlyView(page, 'lesson') &&
            await page.locator('#question-201-201-08-1').inputValue() === 'SYN-unsaved-answer');
        check('About did not replace saved data after a write failure', JSON.stringify(await stores(page)) === JSON.stringify(disk));
        await page.evaluate(function () { openAbout(); });
        await page.waitForFunction(function () { return !_suppressHashNav; });
        await page.evaluate(function () { location.hash = 'tree'; });
        await page.waitForSelector('#tree-view.active');
        check('About-to-tree routing hides all other views', await onlyView(page, 'tree'));
        await context.close();
    } finally {
        await browser.close();
    }
    console.log(passed + ' UX-006 browser checks passed.');
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
