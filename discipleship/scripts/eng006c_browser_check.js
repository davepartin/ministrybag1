#!/usr/bin/env node
/**
 * ENG-006c browser check. Synthetic data only.
 * Exercises confirmed restore from an actual downloaded backup, including
 * safety download, conflict choices, stale confirmation, cancel, reload and
 * failed-load guards. Does not print downloaded contents, credentials or
 * real learner answers.
 */
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var { chromium } = require('playwright');
var downloadHelper = require('./backup-download.js');

var BASE = process.env.ENG006C_BASE_URL || 'http://127.0.0.1:8765/index.html';
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
        if (localStorage.getItem('__gtSkipSeed') === '1') return;
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
    var filePath = path.join(os.tmpdir(), name || ('gt-eng006c-' + Date.now() + '.json'));
    fs.writeFileSync(filePath, text);
    return filePath;
}

function controlFits(box, viewport) {
    return !!box && box.width > 0 && box.height >= 40 &&
        box.left >= -1 && box.right <= viewport.width + 2 &&
        box.top >= -1 && box.bottom <= viewport.height + 2;
}

async function controlBox(page, selector) {
    return page.evaluate(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return null;
        var r = el.getBoundingClientRect();
        return {
            width: r.width,
            height: r.height,
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom
        };
    }, selector);
}

async function learnerState(page) {
    return page.evaluate(function () {
        return {
            answers: localStorage.getItem('christianFoundationsResponses'),
            completion: localStorage.getItem('foundationsCompletionData'),
            reading: localStorage.getItem('foundationsReadingData'),
            memoryKey: responses['question-101-5-key'],
            writable: {
                answers: responseStorageWritable,
                completion: completionStorageWritable,
                reading: readingStorageWritable
            },
            loadReason: {
                answers: responseLoadReason,
                completion: completionLoadReason,
                reading: readingLoadReason
            },
            migration: responses.__gtSharedKeyMigrationV1 === true,
            unknown: responses['legacy-freeform-key'],
            ambiguous: responses.__gtAmbiguousSharedAnswers &&
                responses.__gtAmbiguousSharedAnswers.items &&
                responses.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer']
                ? responses.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status
                : null,
            completeFlag: completionData['complete-101-5'],
            readingNote: readingData['notes-101-John-13']
        };
    });
}

function sameState(before, after) {
    return JSON.stringify(before) === JSON.stringify(after);
}

async function chooseBackupFile(page, filePath, buttonSelector) {
    await page.evaluate(function () {
        window.__gtLastBackupPreview = null;
        window.__gtLastBackupRestore = null;
    });
    var chooserPromise = page.waitForEvent('filechooser');
    await page.locator(buttonSelector || '#lesson-preview-backup').click();
    var chooser = await chooserPromise;
    await chooser.setFiles(filePath);
    await page.waitForFunction(function () {
        return !!window.__gtLastBackupPreview;
    }, null, { timeout: 10000 });
}

async function overlayView(page) {
    return page.evaluate(function () {
        var overlay = document.getElementById('backup-preview-overlay');
        var restoreBtn = document.getElementById('backup-preview-restore');
        var safetyBtn = document.getElementById('backup-preview-safety');
        var ack = document.getElementById('backup-preview-safety-ack');
        var note = document.getElementById('backup-preview-note');
        var status = document.getElementById('backup-preview-restore-status');
        var body = document.getElementById('backup-preview-body');
        var checked = Array.from(document.querySelectorAll('#backup-preview-body input[type="radio"]:checked'))
            .map(function (el) { return el.value; });
        return {
            open: !!(overlay && overlay.classList.contains('open')),
            title: document.getElementById('backup-preview-title')
                ? document.getElementById('backup-preview-title').textContent
                : '',
            restoreHidden: !restoreBtn || restoreBtn.hidden,
            restoreDisabled: !restoreBtn || restoreBtn.disabled,
            restoreText: restoreBtn ? restoreBtn.textContent : '',
            safetyHidden: !safetyBtn || safetyBtn.hidden,
            ackPresent: !!ack,
            ackChecked: !!(ack && ack.checked),
            note: note ? note.textContent : '',
            status: status ? status.textContent : '',
            body: body ? body.textContent : '',
            checkedChoices: checked,
            session: window.__gtRestoreSession || null,
            preview: window.__gtLastBackupPreview || null,
            restore: window.__gtLastBackupRestore || null,
            focus: document.activeElement ? document.activeElement.id : '',
            bannerState: document.getElementById('save-status-banner')
                ? document.getElementById('save-status-banner').getAttribute('data-state')
                : null,
            bannerHidden: !!(document.getElementById('save-status-banner') &&
                document.getElementById('save-status-banner').hidden)
        };
    });
}

async function chooseAll(page, value) {
    var radios = page.locator('#backup-preview-body input[type="radio"][value="' + value + '"]');
    var count = await radios.count();
    for (var i = 0; i < count; i++) {
        await radios.nth(i).check();
    }
    return count;
}

(async function () {
    var browser = await launchBrowser();
    var temps = [];
    try {
        var context = await browser.newContext({ acceptDownloads: true });
        await context.addInitScript(seedAllStores());
        var page = await context.newPage();
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#lesson-preview-backup', { timeout: 20000 });

        var source = await downloadFile(page, '#lesson-download-backup');
        assert('actual download is a version 1 backup', source.filename === 'growing-together-backup.json' &&
            source.json.kind === 'growing-together-backup' && source.json.formatVersion === 1);
        var sourcePath = writeTempBackup(source.text, 'gt-eng006c-source.json');
        temps.push(sourcePath);

        await page.fill('#question-101-5-key', 'SYN-device-after-download');
        var beforePreview = await learnerState(page);
        await chooseBackupFile(page, sourcePath, '#lesson-preview-backup');
        var preview = await overlayView(page);
        assert('complete backup opens review-and-confirm restore', preview.open === true &&
            preview.title.indexOf('confirm restore') !== -1);
        assert('Restore is present and disabled before choices and safety', preview.restoreHidden === false &&
            preview.restoreDisabled === true && preview.restoreText.indexOf('Restore') !== -1);
        assert('no radio choice is preselected', preview.checkedChoices.length === 0);
        assert('confirmation wording requires an explicit choice', preview.body.indexOf('nothing preselected') !== -1 &&
            preview.body.indexOf('Keep the current device value') !== -1 &&
            preview.body.indexOf('Use the backup value') !== -1);
        assert('safety acknowledgement does not claim the file was saved', preview.body.indexOf('cannot prove the file was saved') !== -1);
        assert('close receives focus when the restore review opens', preview.focus === 'backup-preview-close');
        assert('preview still does not write on open', preview.preview && preview.preview.unchanged === true);
        assert('device still has the post-download edit', beforePreview.memoryKey === 'SYN-device-after-download');

        for (var width of [375, 390, 1280]) {
            await page.setViewportSize({ width: width, height: width === 1280 ? 800 : 812 });
            var viewport = page.viewportSize();
            var restoreBox = await controlBox(page, '#backup-preview-restore');
            var safetyBox = await controlBox(page, '#backup-preview-safety');
            var closeBox = await controlBox(page, '#backup-preview-close');
            var ackBox = await controlBox(page, '#backup-preview-safety-ack-label');
            assert(width + 'px Restore control fits the viewport', controlFits(restoreBox, viewport));
            assert(width + 'px safety download control fits the viewport', controlFits(safetyBox, viewport));
            assert(width + 'px Close control fits the viewport', controlFits(closeBox, viewport));
            assert(width + 'px acknowledgement label is visible', !!ackBox && ackBox.height >= 40);
        }
        await page.setViewportSize({ width: 390, height: 844 });

        await page.locator('#backup-preview-close').focus();
        await page.keyboard.press('Tab');
        var afterTab = await page.evaluate(function () {
            return document.activeElement ? (document.activeElement.id || document.activeElement.type || document.activeElement.tagName) : '';
        });
        assert('Tab moves from Close into restore review controls', afterTab !== 'backup-preview-close');

        await page.keyboard.press('Escape');
        var afterCancel = await learnerState(page);
        assert('cancel leaves original memory, storage and guards unchanged', sameState(beforePreview, afterCancel));
        assert('cancel closes the overlay', (await overlayView(page)).open === false);

        await chooseBackupFile(page, sourcePath, '#lesson-preview-backup');
        var conflictCount = await chooseAll(page, 'use-backup');
        assert('every conflict can be set to use-backup', conflictCount >= 1);
        var afterChoices = await overlayView(page);
        assert('Restore stays disabled until the safety download is acknowledged', afterChoices.restoreDisabled === true);

        var safetyStarted = page.waitForEvent('download');
        await page.locator('#backup-preview-safety').click();
        var safety = await readDownload(await safetyStarted);
        var safetyJson = JSON.parse(safety.text);
        var safetyPath = writeTempBackup(safety.text, 'gt-eng006c-safety.json');
        temps.push(safetyPath);
        assert('safety download is a versioned backup with a distinct filename', safety.filename === 'growing-together-backup-before-restore.json' &&
            safetyJson.kind === 'growing-together-backup');
        assert('safety file includes current in-memory edits', safetyJson.stores.answers.data['question-101-5-key'] === 'SYN-device-after-download');
        assert('safety status does not claim the browser saved the file', (await overlayView(page)).status.indexOf('cannot prove') !== -1);
        assert('Restore stays disabled after safety download until acknowledgement', (await overlayView(page)).restoreDisabled === true);

        await page.locator('#backup-preview-safety-ack').check();
        assert('Restore enables after choices, safety download and acknowledgement', (await overlayView(page)).restoreDisabled === false);

        await page.evaluate(function () {
            var el = document.getElementById('question-101-5-key');
            if (!el) return;
            el.value = 'SYN-edit-during-confirm';
            saveResponse(el);
        });
        await page.waitForFunction(function () {
            return window.__gtRestoreSession && window.__gtRestoreSession.stale === true;
        }, null, { timeout: 5000 });
        var staleView = await overlayView(page);
        var staleState = await learnerState(page);
        assert('an answer edit makes confirmation stale and disables Restore', staleView.restoreDisabled === true &&
            staleView.status.indexOf('out of date') !== -1);
        assert('stale confirmation does not write storage', JSON.parse(staleState.answers)['question-101-5-key'] === 'SYN-edit-during-confirm');
        assert('stale confirmation leaves write guards unchanged', staleState.writable.answers === true);

        await page.locator('#backup-preview-close').click();
        await page.fill('#question-101-5-key', 'SYN-device-after-download');
        await chooseBackupFile(page, sourcePath, '#lesson-preview-backup');
        await chooseAll(page, 'use-backup');
        var safety2 = page.waitForEvent('download');
        await page.locator('#backup-preview-safety').click();
        await safety2;
        await page.locator('#backup-preview-safety-ack').check();
        var beforeRestore = await learnerState(page);
        await page.locator('#backup-preview-restore').click();
        await page.waitForFunction(function () {
            return window.__gtLastBackupRestore && window.__gtLastBackupRestore.ok === true;
        }, null, { timeout: 10000 });
        var restoredView = await overlayView(page);
        var restoredState = await learnerState(page);
        assert('confirmed restore reports success counts without a green banner', restoredView.restore &&
            restoredView.restore.ok === true &&
            restoredView.status.indexOf('Restored') !== -1 &&
            restoredView.bannerHidden === true);
        assert('restored multiline backup value replaced the device conflict', restoredState.memoryKey === 'SYN-line-one\nSYN-line-two');
        assert('unicode prayer survived restore', JSON.parse(restoredState.answers)['question-101-5-prayer'].indexOf('\u00e9') !== -1);
        assert('ambiguous answers stay unassigned after restore', restoredState.ambiguous === 'ambiguous');
        assert('save banner was not switched to a persistent saved state', restoredView.bannerState !== 'saved' &&
            restoredView.restore.saveBannerState !== 'saved');
        assert('restore changed storage bytes', restoredState.answers !== beforeRestore.answers);

        await page.evaluate(function () { localStorage.setItem('__gtSkipSeed', '1'); });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#lesson-preview-backup', { timeout: 20000 });
        var reloaded = await learnerState(page);
        assert('reload after restore keeps the restored conflict value', reloaded.memoryKey === 'SYN-line-one\nSYN-line-two');
        assert('reload keeps completion and reading from persisted bytes', reloaded.completeFlag === true &&
            reloaded.readingNote === 'SYN-reading-note');
        assert('reload keeps unassigned ambiguity', reloaded.ambiguous === 'ambiguous');

        var emptyFalse = downloadHelper.backupText(downloadHelper.buildBackupEnvelope({
            exportedAt: '2026-09-16T00:00:00.000Z',
            stores: {
                answers: {
                    loadState: 'ok',
                    writable: true,
                    data: {
                        'question-101-5-key': '',
                        'question-101-5-prayer': 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16',
                        'legacy-freeform-key': 'SYN-unknown-keep',
                        '__gtSharedKeyMigrationV1': true
                    }
                },
                completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': false } },
                reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': '', 'check-101-John-13': false } }
            }
        }));
        var emptyPath = writeTempBackup(emptyFalse, 'gt-eng006c-empty-false.json');
        temps.push(emptyPath);
        await chooseBackupFile(page, emptyPath, '#lesson-preview-backup');
        await chooseAll(page, 'use-backup');
        var safety3 = page.waitForEvent('download');
        await page.locator('#backup-preview-safety').click();
        await safety3;
        await page.locator('#backup-preview-safety-ack').check();
        await page.locator('#backup-preview-restore').click();
        await page.waitForFunction(function () {
            return window.__gtLastBackupRestore && window.__gtLastBackupRestore.ok === true &&
                window.__gtLastBackupRestore.counts &&
                window.__gtLastBackupRestore.counts.conflicts >= 0;
        }, null, { timeout: 10000 });
        var emptyState = await learnerState(page);
        assert('empty string restores as empty, not missing', emptyState.memoryKey === '');
        assert('false completion is restored', emptyState.completeFlag === false);
        assert('unknown key is kept as a stored key', emptyState.unknown === 'SYN-unknown-keep');
        assert('empty reading note and false check restore', emptyState.readingNote === '' &&
            JSON.parse(emptyState.reading)['check-101-John-13'] === false);

        await page.locator('#backup-preview-close').click();
        await chooseBackupFile(page, emptyPath, '#lesson-preview-backup');
        await chooseAll(page, 'keep-device');
        var safetyRepeat = page.waitForEvent('download');
        await page.locator('#backup-preview-safety').click();
        await safetyRepeat;
        await page.locator('#backup-preview-safety-ack').check();
        await page.locator('#backup-preview-restore').click();
        await page.waitForFunction(function () {
            return window.__gtLastBackupRestore && window.__gtLastBackupRestore.ok === true;
        }, null, { timeout: 10000 });
        assert('repeated restore succeeds from the lesson preview control', (await overlayView(page)).restore.ok === true);

        var partial = downloadHelper.backupText(downloadHelper.buildBackupEnvelope({
            exportedAt: '2026-09-16T00:00:00.000Z',
            stores: {
                answers: {
                    loadState: 'malformed',
                    writable: false,
                    originalRaw: '{"SYN-broken":',
                    data: { 'question-101-5-key': 'SYN-partial-source' }
                },
                completion: { loadState: 'ok', writable: true, data: {} },
                reading: { loadState: 'ok', writable: true, data: {} }
            }
        }));
        var partialPath = writeTempBackup(partial, 'gt-eng006c-partial.json');
        temps.push(partialPath);
        await page.locator('#backup-preview-close').click();
        await chooseBackupFile(page, partialPath, '#lesson-preview-backup');
        var partialView = await overlayView(page);
        assert('partial source stays preview-only', partialView.restoreHidden === true || partialView.restoreDisabled === true);
        assert('partial source does not enable Restore', !partialView.session || partialView.session.confirmable === false ||
            partialView.restoreDisabled === true);

        await context.close();

        var guardContext = await browser.newContext({ acceptDownloads: true });
        await guardContext.addInitScript(function () {
            if (window.top !== window) return;
            localStorage.setItem('christianFoundationsResponses', '{"SYN-malformed":');
            localStorage.setItem('foundationsCompletionData', JSON.stringify({ 'complete-101-5': true }));
            localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-13': 'SYN-reading-note' }));
        });
        var guardPage = await guardContext.newPage();
        await guardPage.setViewportSize({ width: 390, height: 844 });
        await guardPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
        await guardPage.waitForSelector('#lesson-preview-backup', { timeout: 20000 });
        var beforeGuard = await learnerState(guardPage);
        assert('failed-load guard is active before restore', beforeGuard.writable.answers === false &&
            beforeGuard.loadReason.answers === 'malformed');
        await chooseBackupFile(guardPage, sourcePath, '#lesson-preview-backup');
        await chooseAll(guardPage, 'use-backup');
        await guardPage.locator('#backup-preview-close').click();
        var afterGuardCancel = await learnerState(guardPage);
        assert('cancel leaves the failed-load guard and original raw unchanged', afterGuardCancel.writable.answers === false &&
            afterGuardCancel.loadReason.answers === 'malformed' &&
            afterGuardCancel.answers === beforeGuard.answers);

        await chooseBackupFile(guardPage, sourcePath, '#lesson-preview-backup');
        await chooseAll(guardPage, 'use-backup');
        var guardSafety = guardPage.waitForEvent('download');
        await guardPage.locator('#backup-preview-safety').click();
        var guardSafetyFile = JSON.parse((await readDownload(await guardSafety)).text);
        assert('safety download includes captured original raw evidence', guardSafetyFile.stores.answers.originalRaw === '{"SYN-malformed":');
        await guardPage.locator('#backup-preview-safety-ack').check();
        await guardPage.locator('#backup-preview-restore').click();
        await guardPage.waitForFunction(function () {
            return window.__gtLastBackupRestore && window.__gtLastBackupRestore.ok === true;
        }, null, { timeout: 10000 });
        var afterGuardRestore = await learnerState(guardPage);
        assert('failed-load guard clears only after the confirmed replacement verifies', afterGuardRestore.writable.answers === true &&
            afterGuardRestore.loadReason.answers == null);
        assert('malformed original bytes were replaced by the confirmed backup', afterGuardRestore.memoryKey === 'SYN-line-one\nSYN-line-two');
        await guardContext.close();
    } catch (err) {
        failed += 1;
        console.error('FAIL: browser check threw | ' + (err && err.stack ? err.stack : err));
    } finally {
        temps.forEach(function (filePath) {
            try { fs.unlinkSync(filePath); } catch (e) { /* ignore temp cleanup */ }
        });
        await browser.close();
    }

    if (failed) {
        console.error('ENG-006c browser checks failed: ' + failed);
        process.exit(1);
    }
    console.log('ENG-006c browser checks passed');
}());
