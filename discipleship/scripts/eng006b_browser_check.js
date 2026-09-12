#!/usr/bin/env node
/**
 * ENG-006b browser check. Synthetic data only.
 * Exercises the actual file input and a current downloaded backup.
 * Does not print downloaded contents, credentials or real learner answers.
 * Does not write restore/apply data.
 */
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var { chromium } = require('playwright');
var downloadHelper = require('./backup-download.js');

var BASE = process.env.ENG006B_BASE_URL || 'http://127.0.0.1:8765/index.html';
var failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

function launchBrowser() {
    var channel = process.env.GT_BROWSER_CHANNEL;
    if (channel) {
        return chromium.launch({ headless: true, channel: channel });
    }
    return chromium.launch({ headless: true });
}

function seedAllStores() {
    return function () {
        if (window.top !== window) return;
        localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            'question-101-5-key': 'SYN-line-one\nSYN-line-two',
            'question-101-5-prayer': 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16',
            'checklist-101-service-interests': [0],
            'commitment-101': 'Yes',
            '__gtSharedKeyMigrationV1': true,
            '__gtAmbiguousSharedAnswers': {
                version: 1,
                items: {
                    'question-202-201-09-prayer': {
                        value: 'SYN-ambiguous-legacy',
                        candidateLessons: ['202-05', '202-09'],
                        status: 'ambiguous',
                        note: 'Shared before unique IDs. Lesson unknown. Not copied into either lesson.'
                    }
                }
            }
        }));
        localStorage.setItem('foundationsCompletionData', JSON.stringify({
            'complete-101-5': true
        }));
        localStorage.setItem('foundationsReadingData', JSON.stringify({
            'notes-101-John-13': 'SYN-reading-note',
            'check-101-John-13': true
        }));
    };
}

async function readDownload(download) {
    var failure = await download.failure();
    if (failure) {
        throw new Error(failure);
    }
    var chunks = [];
    var stream = await download.createReadStream();
    if (!stream) {
        throw new Error('download stream was empty');
    }
    for await (var chunk of stream) {
        chunks.push(chunk);
    }
    return {
        filename: download.suggestedFilename(),
        text: Buffer.concat(chunks).toString('utf8')
    };
}

async function downloadFile(page, selector) {
    var started = page.waitForEvent('download');
    await page.locator(selector).click();
    var raw = await readDownload(await started);
    return {
        filename: raw.filename,
        text: raw.text,
        json: JSON.parse(raw.text)
    };
}

function writeTempBackup(text, name) {
    var filePath = path.join(os.tmpdir(), name || ('gt-eng006b-' + Date.now() + '.json'));
    fs.writeFileSync(filePath, text);
    return filePath;
}

function controlFits(box, viewport) {
    return !!box && box.width > 0 && box.height >= 40 &&
        box.left >= 0 && box.right <= viewport.width + 1 &&
        box.top >= 0 && box.bottom <= viewport.height + 1;
}

async function learnerState(page) {
    return page.evaluate(function () {
        return {
            answers: localStorage.getItem('christianFoundationsResponses'),
            completion: localStorage.getItem('foundationsCompletionData'),
            reading: localStorage.getItem('foundationsReadingData'),
            memoryKey: responses['question-101-5-key'],
            writable: responseStorageWritable,
            loadReason: responseLoadReason,
            migration: responses.__gtSharedKeyMigrationV1 === true,
            completeFlag: completionData['complete-101-5'],
            readingNote: readingData['notes-101-John-13']
        };
    });
}

function sameState(before, after) {
    return JSON.stringify(before) === JSON.stringify(after);
}

async function setBackupFile(page, filePath, buttonSelector) {
    await page.evaluate(function () { window.__gtLastBackupPreview = null; });
    if (buttonSelector) {
        var chooserPromise = page.waitForEvent('filechooser');
        await page.locator(buttonSelector).click();
        var chooser = await chooserPromise;
        await chooser.setFiles(filePath);
    } else {
        await page.locator('#backup-preview-file').setInputFiles(filePath);
    }
    await page.waitForFunction(function () {
        return !!window.__gtLastBackupPreview;
    }, null, { timeout: 10000 });
}

(async function () {
    var browser = await launchBrowser();
    var temps = [];

    var context = await browser.newContext({ acceptDownloads: true });
    await context.addInitScript(seedAllStores());
    var page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#lesson-preview-backup', { timeout: 20000 });

    var beforeDownload = await learnerState(page);
    var file = await downloadFile(page, '#lesson-download-backup');
    assert('actual download is the versioned backup', file.filename === 'growing-together-backup.json' &&
        file.json.kind === 'growing-together-backup');
    var downloadedPath = writeTempBackup(file.text, 'gt-eng006b-downloaded.json');
    temps.push(downloadedPath);

    await page.fill('#question-101-5-key', 'SYN-device-after-download');
    var beforePreview = await learnerState(page);
    await page.locator('#lesson-preview-backup').focus();
    var previewFocus = await page.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert('lesson preview control is keyboard focusable', previewFocus === 'lesson-preview-backup');
    await setBackupFile(page, downloadedPath, '#lesson-preview-backup');

    var firstPreview = await page.evaluate(function () {
        var overlay = document.getElementById('backup-preview-overlay');
        var body = document.getElementById('backup-preview-body');
        return {
            open: overlay.classList.contains('open'),
            title: document.getElementById('backup-preview-title').textContent,
            filename: document.getElementById('backup-preview-file-name').textContent,
            body: body.textContent,
            note: document.getElementById('backup-preview-note').textContent,
            focus: document.activeElement ? document.activeElement.id : '',
            restoreButtons: Array.from(document.querySelectorAll('button')).filter(function (btn) {
                return /restore|apply backup/i.test(btn.textContent || '');
            }).length,
            debug: window.__gtLastBackupPreview
        };
    });
    assert('preview opens from actual downloaded file', firstPreview.open === true);
    assert('preview names the selected file', firstPreview.filename.indexOf('gt-eng006b-downloaded.json') !== -1);
    assert('preview reports a conflict after the later device edit', firstPreview.debug.summary.conflictKeys.indexOf('answers:question-101-5-key') !== -1);
    assert('preview keeps derived counts from the downloaded file', firstPreview.debug.summary.counts.answers.questions === 2 &&
        firstPreview.debug.summary.counts.completion.flags === 1 &&
        firstPreview.debug.summary.counts.reading.notes === 1);
    assert('preview shows retained ambiguity', firstPreview.body.indexOf('candidate lessons 202-05, 202-09') !== -1 &&
        firstPreview.body.indexOf('Not assigned automatically') !== -1);
    assert('preview explains restore is not available', firstPreview.note.indexOf('not available yet') !== -1);
    assert('no working restore button is present', firstPreview.restoreButtons === 0);
    assert('close receives focus when preview opens', firstPreview.focus === 'backup-preview-close');
    assert('preview debug says learner state was unchanged', firstPreview.debug.unchanged === true);
    var afterPreview = await learnerState(page);
    assert('actual-file preview leaves storage and memory unchanged', sameState(beforePreview, afterPreview));
    assert('device still has the post-download edit', afterPreview.memoryKey === 'SYN-device-after-download');

    await page.keyboard.press('Escape');
    var afterClose = await page.evaluate(function () {
        return {
            open: document.getElementById('backup-preview-overlay').classList.contains('open'),
            focus: document.activeElement ? document.activeElement.id : ''
        };
    });
    assert('Escape closes the preview', afterClose.open === false);
    var afterCancel = await learnerState(page);
    assert('cancel leaves learner data and guards unchanged', sameState(beforePreview, afterCancel));

    await setBackupFile(page, downloadedPath);
    var repeated = await page.evaluate(function () {
        return {
            open: document.getElementById('backup-preview-overlay').classList.contains('open'),
            unchanged: window.__gtLastBackupPreview.unchanged,
            conflicts: window.__gtLastBackupPreview.summary.conflictKeys
        };
    });
    assert('repeated selection opens preview again', repeated.open === true);
    assert('repeated selection still does not write', repeated.unchanged === true);
    assert('repeated selection still reports the same conflict', repeated.conflicts.indexOf('answers:question-101-5-key') !== -1);
    await page.locator('#backup-preview-close').click();
    assert('close button hides the overlay', await page.evaluate(function () {
        return !document.getElementById('backup-preview-overlay').classList.contains('open');
    }));

    var htmlEnv = downloadHelper.buildBackupEnvelope({
        exportedAt: '2026-09-12T00:00:00.000Z',
        stores: {
            answers: {
                loadState: 'ok',
                writable: true,
                data: {
                    'question-101-5-key': '<img src=x onerror="alert(1)">SYN-html',
                    'legacy-freeform-key': 'SYN-unknown-keep',
                    '__gtAmbiguousSharedAnswers': {
                        version: 1,
                        items: {
                            'question-202-201-09-prayer': {
                                value: '<script>alert(1)</script>SYN-amb',
                                candidateLessons: ['202-05', '202-09'],
                                status: 'ambiguous'
                            }
                        }
                    }
                }
            },
            completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': false } },
            reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': '', 'check-101-John-13': false } }
        }
    });
    var htmlPath = writeTempBackup(downloadHelper.backupText(htmlEnv), 'gt-eng006b-html.json');
    temps.push(htmlPath);
    await setBackupFile(page, htmlPath);
    var htmlView = await page.evaluate(function () {
        var body = document.getElementById('backup-preview-body');
        return {
            text: body.textContent,
            imgCount: body.querySelectorAll('img, script').length,
            unknown: window.__gtLastBackupPreview.summary.unknownKeys,
            falseFlags: window.__gtLastBackupPreview.summary.counts.completion.flags === 1 &&
                window.__gtLastBackupPreview.summary.counts.reading.notes === 1,
            unchanged: window.__gtLastBackupPreview.unchanged
        };
    });
    assert('HTML strings render as text, not markup', htmlView.imgCount === 0 &&
        htmlView.text.indexOf('<img src=x onerror="alert(1)">SYN-html') !== -1);
    assert('unknown keys remain visible', htmlView.unknown.indexOf('answers:legacy-freeform-key') !== -1);
    assert('false and empty values survive preview', htmlView.falseFlags === true);
    assert('HTML preview does not write storage', htmlView.unchanged === true);
    await page.keyboard.press('Escape');

    var partialEnv = downloadHelper.buildBackupEnvelope({
        exportedAt: '2026-09-12T00:00:00.000Z',
        stores: {
            answers: {
                loadState: 'malformed',
                writable: false,
                includesUnsavedEdits: true,
                originalRaw: '{"SYN-broken":',
                data: { 'question-101-5-key': 'SYN-unsaved-after-failed-load' }
            },
            completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': true } },
            reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': 'SYN-reading-note' } }
        }
    });
    var partialPath = writeTempBackup(downloadHelper.backupText(partialEnv), 'gt-eng006b-partial.json');
    temps.push(partialPath);
    await setBackupFile(page, partialPath);
    var partialView = await page.evaluate(function () {
        return {
            body: document.getElementById('backup-preview-body').textContent,
            complete: window.__gtLastBackupPreview.summary.complete,
            original: window.__gtLastBackupPreview.summary.originalRawStores,
            unchanged: window.__gtLastBackupPreview.unchanged
        };
    });
    assert('partial file is not treated as complete', partialView.complete === false);
    assert('partial preview keeps originalRaw as evidence', partialView.original.indexOf('answers') !== -1 &&
        partialView.body.indexOf('originalRaw bytes') !== -1);
    assert('partial preview does not claim inaccessible recovery', partialView.body.indexOf('unreadable') !== -1);
    assert('partial preview does not write', partialView.unchanged === true);
    await page.keyboard.press('Escape');

    var badFiles = [
        { name: 'gt-eng006b-malformed.json', text: '{not-json', expect: 'malformed-json' },
        { name: 'growing-together-answers-recovery.json', text: JSON.stringify({
            kind: 'growing-together-in-memory-recovery',
            store: 'answers',
            data: { 'question-101-5-key': 'SYN-recovery' }
        }), expect: 'recovery-snapshot' },
        { name: 'copy.json', text: JSON.stringify({ 'question-101-5-key': 'SYN-raw' }), expect: 'original-copy' },
        { name: 'notes.txt', text: 'hello', expect: 'unsupported-type' },
        { name: 'growing-together-backup.json', text: JSON.stringify({
            kind: 'growing-together-backup',
            formatVersion: 2,
            stores: { answers: { loadState: 'ok', data: {} }, completion: { loadState: 'ok', data: {} }, reading: { loadState: 'ok', data: {} } }
        }), expect: 'unsupported-version' },
        { name: 'growing-together-backup.json', text: JSON.stringify({
            kind: 'growing-together-backup',
            formatVersion: 1,
            stores: {
                answers: { loadState: 'ok', data: { 'question-101-5-key': 9 } },
                completion: { loadState: 'ok', data: {} },
                reading: { loadState: 'ok', data: {} }
            }
        }), expect: 'invalid-type' }
    ];
    var protoText = downloadHelper.backupText(htmlEnv).replace(
        '"question-101-5-key":',
        '"__proto__":{"polluted":true},"question-101-5-key":'
    );
    badFiles.push({ name: 'growing-together-backup.json', text: protoText, expect: 'dangerous-key' });
    for (var i = 0; i < badFiles.length; i++) {
        var bad = badFiles[i];
        var badPath = writeTempBackup(bad.text, 'gt-eng006b-bad-' + i + '-' + bad.name);
        temps.push(badPath);
        var beforeBad = await learnerState(page);
        await setBackupFile(page, badPath);
        var badView = await page.evaluate(function () {
            return {
                open: document.getElementById('backup-preview-overlay').classList.contains('open'),
                code: window.__gtLastBackupPreview.code,
                body: document.getElementById('backup-preview-body').textContent,
                unchanged: window.__gtLastBackupPreview.unchanged
            };
        });
        assert('invalid file ' + bad.expect + ' is rejected', badView.code === bad.expect);
        assert('invalid file ' + bad.expect + ' still opens a readable error preview', badView.open === true && badView.body.length > 0);
        assert('invalid file ' + bad.expect + ' does not write', badView.unchanged === true && sameState(beforeBad, await learnerState(page)));
        await page.keyboard.press('Escape');
    }

    var oversizedPath = path.join(os.tmpdir(), 'gt-eng006b-oversized.json');
    fs.writeFileSync(oversizedPath, Buffer.alloc(1048577, 0x7b));
    temps.push(oversizedPath);
    var beforeOver = await learnerState(page);
    await setBackupFile(page, oversizedPath);
    var overView = await page.evaluate(function () {
        return {
            code: window.__gtLastBackupPreview.code,
            message: window.__gtLastBackupPreview.message,
            unchanged: window.__gtLastBackupPreview.unchanged
        };
    });
    assert('oversized file is rejected before parse', overView.code === 'oversized');
    assert('oversized message says the file was not read or parsed', overView.message.indexOf('was not read or parsed') !== -1);
    assert('oversized file does not write', overView.unchanged === true && sameState(beforeOver, await learnerState(page)));
    await page.keyboard.press('Escape');

    await page.locator('#lesson-preview-backup').focus();
    await setBackupFile(page, downloadedPath);
    await page.keyboard.press('Tab');
    var tabTarget = await page.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert('Tab moves into the preview body or stays in the dialog', tabTarget === 'backup-preview-body' || tabTarget === 'backup-preview-close');
    await page.keyboard.press('Escape');

    for (var w = 0; w < [375, 390, 1280].length; w++) {
        var width = [375, 390, 1280][w];
        await page.setViewportSize({ width: width, height: width === 1280 ? 800 : 812 });
        await page.waitForTimeout(120);
        await page.locator('#lesson-preview-backup').scrollIntoViewIfNeeded();
        var layout = await page.evaluate(function () {
            var btn = document.getElementById('lesson-preview-backup').getBoundingClientRect();
            var download = document.getElementById('lesson-download-backup').getBoundingClientRect();
            var email = document.getElementById('email-lesson-btn').getBoundingClientRect();
            return {
                preview: btn,
                download: download,
                email: email,
                viewport: { width: window.innerWidth, height: window.innerHeight }
            };
        });
        assert(width + ': preview control fits the viewport', controlFits(layout.preview, layout.viewport));
        assert(width + ': download control still fits', controlFits(layout.download, layout.viewport));
        assert(width + ': email lesson control still fits', controlFits(layout.email, layout.viewport));
    }

    await page.locator('#email-lesson-btn').click();
    var exportOpen = await page.evaluate(function () {
        return document.getElementById('export-preview-overlay').classList.contains('open');
    });
    assert('scoped export preview still opens', exportOpen === true);
    await page.keyboard.press('Escape');
    await context.close();

    var homeCtx = await browser.newContext({ acceptDownloads: true });
    var homePage = await homeCtx.newPage();
    await homePage.setViewportSize({ width: 390, height: 844 });
    await homePage.goto(BASE, { waitUntil: 'domcontentloaded' });
    await homePage.waitForSelector('#home-preview-backup', { timeout: 20000 });
    var emptyFile = await downloadFile(homePage, '#home-download-backup');
    var emptyPath = writeTempBackup(emptyFile.text, 'gt-eng006b-empty.json');
    temps.push(emptyPath);
    await setBackupFile(homePage, emptyPath);
    var emptyView = await homePage.evaluate(function () {
        return {
            open: document.getElementById('backup-preview-overlay').classList.contains('open'),
            complete: window.__gtLastBackupPreview.summary.complete,
            emptyValid: document.getElementById('backup-preview-body').textContent.indexOf('All three stores are complete') !== -1,
            unchanged: window.__gtLastBackupPreview.unchanged
        };
    });
    assert('home preview accepts an empty valid downloaded backup', emptyView.open === true && emptyView.complete === true);
    assert('empty valid preview is not treated as a failed load', emptyView.emptyValid === true);
    assert('home preview does not write empty storage', emptyView.unchanged === true);
    await homePage.keyboard.press('Escape');
    await homeCtx.close();

    var failCtx = await browser.newContext({ acceptDownloads: true });
    await failCtx.addInitScript(function () {
        if (window.top !== window) return;
        localStorage.setItem('christianFoundationsResponses', '{"SYN-broken":');
        localStorage.setItem('foundationsCompletionData', JSON.stringify({ 'complete-101-5': true }));
        localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-13': 'SYN-reading-keep' }));
    });
    var failPage = await failCtx.newPage();
    await failPage.setViewportSize({ width: 375, height: 812 });
    await failPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await failPage.waitForSelector('#question-101-5-key', { timeout: 20000 });
    await failPage.fill('#question-101-5-key', 'SYN-unsaved-after-failed-load');
    var failBefore = await failPage.evaluate(function () {
        return {
            raw: localStorage.getItem('christianFoundationsResponses'),
            writable: responseStorageWritable,
            label: document.getElementById('save-status-label').textContent,
            memory: responses['question-101-5-key']
        };
    });
    await setBackupFile(failPage, downloadedPath);
    var failAfter = await failPage.evaluate(function () {
        return {
            raw: localStorage.getItem('christianFoundationsResponses'),
            writable: responseStorageWritable,
            label: document.getElementById('save-status-label').textContent,
            memory: responses['question-101-5-key'],
            unchanged: window.__gtLastBackupPreview.unchanged,
            originalHidden: document.getElementById('save-status-download-original').hidden,
            backupHidden: document.getElementById('save-status-download-backup').hidden
        };
    });
    assert('failed-load preview leaves original storage in place', failAfter.raw === '{"SYN-broken":' && failAfter.raw === failBefore.raw);
    assert('failed-load preview leaves the write guard in place', failAfter.writable === false && failAfter.label === 'Could not save');
    assert('failed-load preview keeps in-memory edits', failAfter.memory === 'SYN-unsaved-after-failed-load');
    assert('failed-load recovery controls remain', failAfter.originalHidden === false && failAfter.backupHidden === false);
    await failPage.keyboard.press('Escape');
    await failCtx.close();

    await browser.close();
    temps.forEach(function (tempPath) {
        try { fs.unlinkSync(tempPath); } catch (err) { /* temp cleanup only */ }
    });

    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nAll ENG-006b browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
