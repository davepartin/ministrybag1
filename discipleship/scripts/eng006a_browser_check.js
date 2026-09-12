#!/usr/bin/env node
/**
 * ENG-006a browser check. Synthetic data only.
 * Validates the actual downloaded backup file, not a debug marker.
 * Does not print downloaded contents, credentials or real learner answers.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG006A_BASE_URL || 'http://127.0.0.1:8765/index.html';
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

async function downloadRaw(page, selector) {
    var started = page.waitForEvent('download');
    await page.locator(selector).click();
    return readDownload(await started);
}

function controlFits(box, viewport) {
    return !!box && box.width > 0 && box.height >= 40 &&
        box.left >= 0 && box.right <= viewport.width + 1 &&
        box.top >= 0 && box.bottom <= viewport.height + 1;
}

(async function () {
    var browser = await launchBrowser();

    // --- Full synthetic backup from the lesson control. Read the file. ---
    var context = await browser.newContext({ acceptDownloads: true });
    await context.addInitScript(seedAllStores());
    var page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#lesson-download-backup', { timeout: 20000 });

    var before = await page.evaluate(function () {
        return {
            answers: localStorage.getItem('christianFoundationsResponses'),
            completion: localStorage.getItem('foundationsCompletionData'),
            reading: localStorage.getItem('foundationsReadingData'),
            writable: responseStorageWritable
        };
    });
    var file = await downloadFile(page, '#lesson-download-backup');
    var env = file.json;
    assert('lesson backup filename is the versioned name', file.filename === 'growing-together-backup.json');
    assert('downloaded file is the versioned envelope', env.kind === 'growing-together-backup' && env.formatVersion === 1);
    assert('downloaded file is complete for readable stores', env.complete === true);
    assert('downloaded file includes all three stores', !!env.stores.answers && !!env.stores.completion && !!env.stores.reading);
    assert('downloaded file keeps multiline answers', env.stores.answers.data['question-101-5-key'] === 'SYN-line-one\nSYN-line-two');
    assert('downloaded file keeps Unicode answers', env.stores.answers.data['question-101-5-prayer'] === 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16');
    assert('downloaded file keeps checklist selections', Array.isArray(env.stores.answers.data['checklist-101-service-interests']));
    assert('downloaded file keeps commitments', env.stores.answers.data['commitment-101'] === 'Yes');
    assert('downloaded file keeps completion flags', env.stores.completion.data['complete-101-5'] === true);
    assert('downloaded file keeps reading notes', env.stores.reading.data['notes-101-John-13'] === 'SYN-reading-note');
    assert('downloaded file keeps reading flags', env.stores.reading.data['check-101-John-13'] === true);
    assert('downloaded file retains ambiguity metadata', env.ambiguousAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');
    assert('downloaded file does not auto-assign ambiguity', env.ambiguousAnswers.note.indexOf('Not assigned automatically') !== -1);
    assert('downloaded file reports honest counts', env.counts.answers.questions === 2 && env.counts.completion.flags === 1 && env.counts.reading.notes === 1);
    var after = await page.evaluate(function () {
        return {
            answers: localStorage.getItem('christianFoundationsResponses'),
            completion: localStorage.getItem('foundationsCompletionData'),
            reading: localStorage.getItem('foundationsReadingData')
        };
    });
    assert('lesson backup does not write answers storage', after.answers === before.answers);
    assert('lesson backup does not write completion storage', after.completion === before.completion);
    assert('lesson backup does not write reading storage', after.reading === before.reading);
    var lessonStatus = await page.locator('#backup-download-status').textContent();
    assert('lesson backup status says local and not restore', lessonStatus.indexOf('local backup') !== -1 && lessonStatus.indexOf('Restore is not available yet') !== -1);
    await page.locator('#email-lesson-btn').waitFor();
    assert('email lesson control remains after backup', await page.locator('#email-lesson-btn').isVisible());

    await page.locator('#lesson-download-backup').focus();
    var lessonFocus = await page.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert('lesson backup control is keyboard focusable', lessonFocus === 'lesson-download-backup');
    var keyboardStarted = page.waitForEvent('download');
    await page.keyboard.press('Enter');
    var keyed = await readDownload(await keyboardStarted);
    assert('keyboard Enter downloads the versioned backup file', keyed.filename === 'growing-together-backup.json');
    assert('keyboard download is a real backup envelope', JSON.parse(keyed.text).kind === 'growing-together-backup');
    await context.close();

    // --- Empty valid data from the home control. ---
    var emptyCtx = await browser.newContext({ acceptDownloads: true });
    var emptyPage = await emptyCtx.newPage();
    await emptyPage.setViewportSize({ width: 390, height: 844 });
    await emptyPage.goto(BASE, { waitUntil: 'domcontentloaded' });
    await emptyPage.waitForSelector('#home-download-backup', { timeout: 20000 });
    var emptyFile = await downloadFile(emptyPage, '#home-download-backup');
    assert('home backup filename is the versioned name', emptyFile.filename === 'growing-together-backup.json');
    assert('empty valid backup is complete', emptyFile.json.complete === true);
    assert('empty valid answers are labeled emptyValid', emptyFile.json.stores.answers.emptyValid === true);
    assert('empty valid completion is labeled emptyValid', emptyFile.json.stores.completion.emptyValid === true);
    assert('empty valid reading is labeled emptyValid', emptyFile.json.stores.reading.emptyValid === true);
    assert('empty valid is not marked unsaved', emptyFile.json.includesUnsavedEdits === false);
    assert('empty valid counts are zero', emptyFile.json.counts.answers.keys === 0 && emptyFile.json.counts.reading.notes === 0);
    await emptyCtx.close();

    // --- Failed-load answers plus unsaved edit: partial file, original kept. ---
    var failCtx = await browser.newContext({ acceptDownloads: true });
    await failCtx.addInitScript(function () {
        localStorage.setItem('christianFoundationsResponses', '{"SYN-broken":');
        localStorage.setItem('foundationsCompletionData', JSON.stringify({ 'complete-101-5': true }));
        localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-13': 'SYN-reading-keep' }));
    });
    var failPage = await failCtx.newPage();
    await failPage.setViewportSize({ width: 375, height: 812 });
    await failPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await failPage.waitForSelector('#question-101-5-key', { timeout: 20000 });
    var failOnLoad = await failPage.evaluate(function () {
        return {
            label: document.getElementById('save-status-label').textContent,
            raw: localStorage.getItem('christianFoundationsResponses'),
            writable: responseStorageWritable,
            selector: !document.getElementById('save-status-store-label').hidden,
            backupHidden: document.getElementById('save-status-download-backup').hidden,
            originalHidden: document.getElementById('save-status-download-original').hidden
        };
    });
    assert('failed load still shows Could not save', failOnLoad.label === 'Could not save');
    assert('failed load still blocks writes', failOnLoad.writable === false);
    assert('failed load still offers original copy', failOnLoad.originalHidden === false);
    assert('failed load offers the versioned backup', failOnLoad.backupHidden === false);
    await failPage.fill('#question-101-5-key', 'SYN-unsaved-after-failed-load');
    var failFile = await downloadFile(failPage, '#save-status-download-backup');
    assert('recovery backup is the versioned envelope', failFile.json.kind === 'growing-together-backup');
    assert('failed-load backup is partial', failFile.json.complete === false && failFile.json.stores.answers.complete === false);
    assert('failed-load backup includes the unsaved edit', failFile.json.stores.answers.data['question-101-5-key'] === 'SYN-unsaved-after-failed-load');
    assert('failed-load backup retains original raw', failFile.json.stores.answers.originalRaw === '{"SYN-broken":');
    assert('failed-load backup does not invent unread keys as data', !failFile.json.stores.answers.data['SYN-broken']);
    assert('readable completion remains complete in a partial file', failFile.json.stores.completion.complete === true && failFile.json.stores.completion.data['complete-101-5'] === true);
    assert('readable reading remains complete in a partial file', failFile.json.stores.reading.data['notes-101-John-13'] === 'SYN-reading-keep');
    var failAfter = await failPage.evaluate(function () {
        return {
            raw: localStorage.getItem('christianFoundationsResponses'),
            label: document.getElementById('save-status-label').textContent,
            memory: responses['question-101-5-key']
        };
    });
    assert('failed-load backup does not replace original storage', failAfter.raw === '{"SYN-broken":');
    assert('failed-load backup leaves the guard in place', failAfter.label === 'Could not save');
    assert('failed-load backup keeps in-memory edits', failAfter.memory === 'SYN-unsaved-after-failed-load');

    var originalFile = await downloadRaw(failPage, '#save-status-download-original');
    assert('original recovery copy remains independently downloadable', originalFile.filename.indexOf('original') !== -1);
    assert('original recovery copy is the unreadable raw bytes', originalFile.text === '{"SYN-broken":');

    await failPage.locator('#save-status-retry').focus();
    var afterTab = await failPage.evaluate(async function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    await failPage.keyboard.press('Tab');
    var tabTarget = await failPage.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert('retry remains keyboard focusable during backup recovery', afterTab === 'save-status-retry');
    assert('Tab still moves among recovery controls', [
        'save-status-copy',
        'save-status-download',
        'save-status-download-original',
        'save-status-download-backup'
    ].indexOf(tabTarget) !== -1);

    for (var i = 0; i < [375, 390, 1280].length; i++) {
        var width = [375, 390, 1280][i];
        await failPage.setViewportSize({ width: width, height: 812 });
        await failPage.waitForTimeout(150);
        var layout = await failPage.evaluate(function () {
            var backup = document.getElementById('save-status-download-backup').getBoundingClientRect();
            var original = document.getElementById('save-status-download-original').getBoundingClientRect();
            var selector = document.getElementById('save-status-store');
            return {
                backup: backup,
                original: original,
                selectorHidden: selector ? document.getElementById('save-status-store-label').hidden : true,
                viewport: { width: window.innerWidth, height: window.innerHeight }
            };
        });
        assert(width + ': recovery backup control fits the viewport', controlFits(layout.backup, layout.viewport));
        assert(width + ': original copy control remains available', controlFits(layout.original, layout.viewport));
    }
    await failCtx.close();

    // --- Laptop lesson backup control. ---
    var laptop = await browser.newContext({ acceptDownloads: true });
    await laptop.addInitScript(seedAllStores());
    var laptopPage = await laptop.newPage();
    await laptopPage.setViewportSize({ width: 1280, height: 800 });
    await laptopPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await laptopPage.waitForSelector('#lesson-download-backup', { timeout: 20000 });
    var laptopLayout = await laptopPage.evaluate(function () {
        var btn = document.getElementById('lesson-download-backup').getBoundingClientRect();
        return {
            visible: btn.width > 0 && btn.height >= 40,
            right: btn.right,
            viewport: window.innerWidth
        };
    });
    assert('laptop backup control is visible', laptopLayout.visible === true && laptopLayout.viewport === 1280);
    var laptopFile = await downloadFile(laptopPage, '#lesson-download-backup');
    assert('laptop download is the same versioned file', laptopFile.json.kind === 'growing-together-backup' && laptopFile.json.complete === true);
    await laptop.close();

    await browser.close();

    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nAll ENG-006a browser checks passed.');
})().catch(function (err) {
    console.error(err.message);
    process.exit(1);
});
