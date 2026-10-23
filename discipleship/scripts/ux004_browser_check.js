#!/usr/bin/env node
/**
 * UX-004 browser check. The backup preview and restore review use plain
 * language: lesson and question names instead of raw keys, no "stores" or
 * "version 1" wording, and correct count grammar. Synthetic data only;
 * downloads go to a temporary folder and are deleted.
 */
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var { chromium } = require('playwright');

var BASE = process.env.UX004_BASE_URL || 'http://127.0.0.1:8765/index.html';
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
    var browser = await chromium.launch({ headless: true });
    var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gt-ux004-'));
    try {
        for (var width of [390, 1280]) {
            var context = await browser.newContext({ acceptDownloads: true, viewport: { width: width, height: 844 } });
            var page = await context.newPage();
            await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('#question-101-5-3', { timeout: 20000 });
            await page.fill('#question-101-5-3', 'SYN backup answer');
            await page.waitForTimeout(300);

            var downloadPromise = page.waitForEvent('download');
            await page.click('#lesson-download-backup');
            var download = await downloadPromise;
            var filePath = path.join(tempDir, 'syn-' + width + '.json');
            await download.saveAs(filePath);

            await page.fill('#question-101-5-3', 'SYN device answer');
            await page.waitForTimeout(300);
            var chooserPromise = page.waitForEvent('filechooser');
            await page.click('#lesson-preview-backup');
            var chooser = await chooserPromise;
            await chooser.setFiles(filePath);
            await page.waitForFunction(function () { return !!window.__gtLastBackupPreview; }, null, { timeout: 15000 });

            var view = await page.evaluate(function () {
                var body = document.getElementById('backup-preview-body');
                var legends = Array.prototype.map.call(body.querySelectorAll('legend'), function (el) { return el.textContent; });
                var overlay = document.querySelector('#backup-preview-overlay');
                return {
                    text: body.textContent,
                    note: document.getElementById('backup-preview-note').textContent,
                    legends: legends,
                    scrollWidth: document.documentElement.scrollWidth,
                    viewport: window.innerWidth,
                    open: !!(overlay && overlay.classList.contains('open'))
                };
            });
            var all = view.text + ' ' + view.note;
            assert(width + ': restore review opens', view.open);
            assert(width + ': difference is named by lesson and question',
                view.legends.some(function (l) { return l.indexOf('Starting in Discipleship 5: The Church. Question: 5.3 - ') === 0; }),
                JSON.stringify(view.legends));
            assert(width + ': no raw answer keys are shown', !/question-101-|answers:question|complete-101-/.test(all));
            assert(width + ': no "stores" or "version 1" wording', !/\bstores?\b/i.test(all) && all.indexOf('version 1') === -1);
            assert(width + ': count grammar is correct', /Answers: 1 question, /.test(view.text), (view.text.match(/Answers:[^.]*\./) || [''])[0]);
            assert(width + ': explicit choice wording kept', all.indexOf('nothing preselected') !== -1 &&
                all.indexOf('Keep the current device value') !== -1 && all.indexOf('Use the backup value') !== -1);
            assert(width + ': both answers are shown as text', view.text.indexOf('SYN backup answer') !== -1 && view.text.indexOf('SYN device answer') !== -1);
            assert(width + ': page does not scroll sideways', view.scrollWidth <= view.viewport, view.scrollWidth + ' > ' + view.viewport);
            await context.close();
        }
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
        await browser.close();
    }
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' UX-004 browser checks passed.');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
