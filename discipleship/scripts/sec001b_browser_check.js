#!/usr/bin/env node
/**
 * SEC-001b browser check. The 101 Gospel of John reading cards show bundled
 * World English Bible text, never call the ESV API, keep saved reading checks
 * and notes, and show a clear message if the bundled file cannot load.
 * Synthetic data only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.SEC001B_BASE_URL || 'http://127.0.0.1:8765/index.html';
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

async function openCard(page, chId) {
    await page.waitForSelector('#card-' + chId + ' .chapter-card-header', { timeout: 15000 });
    await page.click('#card-' + chId + ' .chapter-card-header');
    await page.waitForFunction(function (id) {
        var el = document.getElementById('esv-' + id);
        return el && !el.querySelector('.esv-loading');
    }, chId, { timeout: 15000 });
    return page.evaluate(function (id) {
        var el = document.getElementById('esv-' + id);
        var nums = Array.prototype.map.call(el.querySelectorAll('.verse-num'), function (n) { return Number(n.textContent); });
        return {
            title: el.querySelector('h2') ? el.querySelector('h2').textContent : '',
            verseNums: nums,
            text: el.textContent,
            attribution: el.querySelector('.bible-attribution') ? el.querySelector('.bible-attribution').textContent : '',
            audio: !!document.getElementById('audio-' + id),
            pageWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth
        };
    }, chId);
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var externalBible = [];
    var pageErrors = [];

    for (var width of [375, 390, 1280]) {
        var context = await browser.newContext({ viewport: { width: width, height: 844 } });
        var page = await context.newPage();
        page.on('request', function (req) { if (/esv\.org/i.test(req.url())) externalBible.push(req.url()); });
        page.on('pageerror', function (err) { pageErrors.push(String(err)); });

        await page.goto(BASE + '#101-1', { waitUntil: 'domcontentloaded' });
        var john1 = await openCard(page, '101-John-1');
        assert(width + ': John 1 card shows its title', john1.title === 'John 1', john1.title);
        assert(width + ': John 1 shows verses 1 to 51', john1.verseNums.length === 51 && john1.verseNums[50] === 51, john1.verseNums.length);
        assert(width + ': John 1 starts with the WEB wording', john1.text.indexOf('In the beginning was the Word') !== -1);
        assert(width + ': WEB attribution is shown', /World English Bible \(WEB\), public domain/.test(john1.attribution), john1.attribution);
        assert(width + ': no audio player remains', !john1.audio);
        assert(width + ': page does not scroll sideways', john1.pageWidth <= john1.viewport, john1.pageWidth + ' > ' + john1.viewport);

        if (width === 390) {
            var john3 = await openCard(page, '101-John-3');
            assert('John 3:16 shows WEB text', john3.text.indexOf('For God so loved the world, that he gave his only born Son') !== -1);

            await page.check('#reading-check-101-John-1');
            await page.fill('#reading-notes-101-John-1', 'SYN note: light & <darkness>\nsecond line');
            await page.waitForTimeout(400);
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#reading-check-101-John-1', { timeout: 15000 });
            var kept = await page.evaluate(function () {
                return {
                    checked: document.getElementById('reading-check-101-John-1').checked,
                    notes: document.getElementById('reading-notes-101-John-1').value
                };
            });
            assert('reading check survives reload', kept.checked === true);
            assert('reading notes survive reload unchanged', kept.notes === 'SYN note: light & <darkness>\nsecond line', JSON.stringify(kept.notes));
        }
        await context.close();
    }

    var failContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    var failPage = await failContext.newPage();
    await failPage.route('**/data/bible/john-web.json*', function (route) { route.abort(); });
    await failPage.goto(BASE + '#101-2', { waitUntil: 'domcontentloaded' });
    var failed4 = await openCard(failPage, '101-John-4');
    assert('a failed text load shows a clear message', /Could not load text/.test(failed4.text), failed4.text.slice(0, 80));
    await failContext.close();

    assert('no request was made to esv.org', externalBible.length === 0, externalBible.slice(0, 2).join(', '));
    assert('no page exceptions', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));

    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' SEC-001b browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
