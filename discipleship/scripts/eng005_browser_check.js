#!/usr/bin/env node
/**
 * ENG-005 browser check. Synthetic answers only.
 * Confirms truthful Saving/Saved/Could not save feedback, in-memory retention,
 * failed-load guard, retry/copy/download, and phone/laptop/keyboard status.
 * Does not read real learner answers or credentials.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG005_BASE_URL || 'http://127.0.0.1:8765/index.html';
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

function bannerState(page) {
    return page.evaluate(function () {
        var banner = document.getElementById('save-status-banner');
        var label = document.getElementById('save-status-label');
        var detail = document.getElementById('save-status-detail');
        var retry = document.getElementById('save-status-retry');
        var copy = document.getElementById('save-status-copy');
        var download = document.getElementById('save-status-download');
        var original = document.getElementById('save-status-download-original');
        var actions = document.getElementById('save-status-actions');
        return {
            hidden: banner ? banner.hidden : true,
            state: banner ? banner.getAttribute('data-state') : '',
            store: banner ? banner.getAttribute('data-store') : '',
            label: label ? label.textContent : '',
            detail: detail ? detail.textContent : '',
            actionsHidden: actions ? actions.hidden : true,
            retryHidden: retry ? retry.hidden : true,
            copyHidden: copy ? copy.hidden : true,
            downloadHidden: download ? download.hidden : true,
            originalHidden: original ? original.hidden : true,
            focus: document.activeElement ? document.activeElement.id : '',
            writable: window.responseStorageWritable
        };
    });
}

function installWriteHooks() {
    return function () {
        if (window !== window.top) return;
        var original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
            if (window.__gtQuotaFail && (
                key === 'christianFoundationsResponses' ||
                key === 'foundationsCompletionData' ||
                key === 'foundationsReadingData'
            )) {
                var err = new Error('quota');
                err.name = 'QuotaExceededError';
                throw err;
            }
            return original.call(this, key, value);
        };
    };
}

(async function () {
    var browser = await launchBrowser();

    // --- Valid write, Saved after write, reload, navigation, questions ---
    var context = await browser.newContext();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await context.addInitScript(installWriteHooks());
    var page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-101-5-key', { timeout: 20000 });

    var beforeType = await bannerState(page);
    assert('valid load does not claim Saved before a write', beforeType.label !== 'Saved');

    await page.fill('#question-101-5-key', 'SYN-101-5-key');
    var afterQuestion = await bannerState(page);
    assert('question save label is Saved after a successful write', afterQuestion.label === 'Saved');
    assert('question save names lesson answers only', afterQuestion.detail.indexOf('Lesson answers') !== -1);
    assert('typing keeps focus in the question field', afterQuestion.focus === 'question-101-5-key');
    assert('successful save hides recovery actions', afterQuestion.actionsHidden === true);

    var storedAfterQuestion = await page.evaluate(function () {
        return JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}')['question-101-5-key'];
    });
    assert('successful question write reached storage', storedAfterQuestion === 'SYN-101-5-key');

    await page.click('#checklist-101-service-interests .checklist-tile');
    var afterChecklist = await page.evaluate(function () {
        var stored = JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}');
        return {
            label: document.getElementById('save-status-label').textContent,
            selected: stored['checklist-101-service-interests']
        };
    });
    assert('checklist save label is Saved', afterChecklist.label === 'Saved');
    assert('checklist write stored a selected index', Array.isArray(afterChecklist.selected) && afterChecklist.selected.length === 1);

    var afterCommitment = await page.evaluate(function () {
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.value = 'Yes';
        saveCommitment(radio);
        var stored = JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}');
        return {
            label: document.getElementById('save-status-label').textContent,
            value: stored['commitment-101'],
            memory: responses['commitment-101']
        };
    });
    assert('commitment save label is Saved', afterCommitment.label === 'Saved');
    assert('commitment write stored Yes', afterCommitment.value === 'Yes' && afterCommitment.memory === 'Yes');

    await page.fill('#reading-notes-101-John-13', 'SYN-reading-note');
    var afterReading = await page.evaluate(function () {
        return {
            label: document.getElementById('save-status-label').textContent,
            detail: document.getElementById('save-status-detail').textContent,
            stored: JSON.parse(localStorage.getItem('foundationsReadingData') || '{}')['notes-101-John-13'],
            focus: document.activeElement ? document.activeElement.id : ''
        };
    });
    assert('reading-note save label is Saved', afterReading.label === 'Saved');
    assert('reading-note detail names reading notes', afterReading.detail.indexOf('Reading notes') !== -1);
    assert('reading-note write reached storage', afterReading.stored === 'SYN-reading-note');
    assert('reading-note typing keeps focus', afterReading.focus === 'reading-notes-101-John-13');

    await page.click('#session-complete-101-5');
    var afterComplete = await page.evaluate(function () {
        return {
            label: document.getElementById('save-status-label').textContent,
            detail: document.getElementById('save-status-detail').textContent,
            stored: JSON.parse(localStorage.getItem('foundationsCompletionData') || '{}')['complete-101-5']
        };
    });
    assert('completion save label is Saved', afterComplete.label === 'Saved');
    assert('completion detail names lesson completion', afterComplete.detail.indexOf('Lesson completion') !== -1);
    assert('completion write reached storage', afterComplete.stored === true);

    var phoneLayout = await page.evaluate(function () {
        var banner = document.getElementById('save-status-banner');
        var label = document.getElementById('save-status-label');
        var b = banner.getBoundingClientRect();
        return {
            visible: banner.hidden === false && b.width > 0 && b.height > 0,
            width: b.width,
            labelSize: parseFloat(window.getComputedStyle(label).fontSize),
            viewport: window.innerWidth
        };
    });
    assert('phone 390 status banner is visible', phoneLayout.visible && phoneLayout.viewport === 390);
    assert('phone status label is readable', phoneLayout.labelSize >= 13);

    await page.goto(BASE + '#101-1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-101-1-1', { timeout: 20000 });
    await page.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-101-5-key', { timeout: 20000 });
    var afterNav = await page.evaluate(function () {
        return {
            question: document.getElementById('question-101-5-key').value,
            reading: document.getElementById('reading-notes-101-John-13').value,
            complete: document.getElementById('session-complete-101-5').checked
        };
    });
    assert('navigation keeps the synthetic question', afterNav.question === 'SYN-101-5-key');
    assert('navigation keeps the synthetic reading note', afterNav.reading === 'SYN-reading-note');
    assert('navigation keeps the completion check', afterNav.complete === true);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-101-5-key', { timeout: 20000 });
    var afterReload = await page.evaluate(function () {
        return {
            question: document.getElementById('question-101-5-key').value,
            label: document.getElementById('save-status-label').textContent
        };
    });
    assert('reload keeps the synthetic question', afterReload.question === 'SYN-101-5-key');
    assert('reload does not invent Saved without a new write', afterReload.label !== 'Saved');

    // Memory assignment alone is not Saved.
    var memoryOnly = await page.evaluate(function () {
        responses['question-101-5-devos'] = 'SYN-memory-only';
        return document.getElementById('save-status-label').textContent;
    });
    assert('in-memory assignment without persist is not Saved', memoryOnly !== 'Saved');

    // --- Quota failure, then safe retry ---
    await page.evaluate(function () { window.__gtQuotaFail = true; });
    await page.fill('#question-101-5-key', 'SYN-101-5-quota');
    var afterQuota = await bannerState(page);
    var quotaMemory = await page.evaluate(function () {
        return {
            memory: responses['question-101-5-key'],
            stored: JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}')['question-101-5-key']
        };
    });
    assert('quota failure label is Could not save', afterQuota.label === 'Could not save');
    assert('quota failure keeps the edited answer in memory', quotaMemory.memory === 'SYN-101-5-quota');
    assert('quota failure does not overwrite stored answers with the new edit', quotaMemory.stored !== 'SYN-101-5-quota');
    assert('quota failure shows retry and copy', afterQuota.retryHidden === false && afterQuota.copyHidden === false);
    assert('quota detail warns that edits could be lost', afterQuota.detail.indexOf('reload') !== -1);

    var quotaPhoneActions = await page.evaluate(function () {
        var retry = document.getElementById('save-status-retry').getBoundingClientRect();
        var copy = document.getElementById('save-status-copy').getBoundingClientRect();
        return {
            retryOnScreen: retry.bottom <= window.innerHeight + 1 && retry.width > 0,
            copyOnScreen: copy.bottom <= window.innerHeight + 1 && copy.width > 0
        };
    });
    assert('phone retry stays on screen', quotaPhoneActions.retryOnScreen);
    assert('phone copy stays on screen', quotaPhoneActions.copyOnScreen);

    await page.evaluate(function () { window.__gtQuotaFail = false; });
    await page.click('#save-status-retry');
    var afterRetry = await page.evaluate(function () {
        return {
            label: document.getElementById('save-status-label').textContent,
            stored: JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}')['question-101-5-key']
        };
    });
    assert('retry after quota shows Saved', afterRetry.label === 'Saved');
    assert('retry after quota writes the in-memory edit', afterRetry.stored === 'SYN-101-5-quota');

    await page.evaluate(function () { window.__gtQuotaFail = true; });
    await page.fill('#question-101-5-key', 'SYN-copy-me');
    await page.click('#save-status-copy');
    // Copy is asynchronous. Verify the delivered clipboard text, not a marker
    // that used to be set before the clipboard operation could succeed.
    await page.waitForFunction(async function () {
        try { return (await navigator.clipboard.readText()).indexOf('SYN-copy-me') !== -1; }
        catch (err) { return false; }
    });
    var copied = await page.evaluate(function () { return navigator.clipboard.readText(); });
    assert('copy recovery includes the in-memory edit', copied.indexOf('SYN-copy-me') !== -1);
    assert('copy recovery is not a versioned backup claim', copied.indexOf('ENG-006') !== -1);
    await page.click('#save-status-download');
    var downloaded = await page.evaluate(function () { return window.__gtLastRecoveryDownload || {}; });
    assert('download recovery uses an answers filename', downloaded.filename === 'growing-together-answers-recovery.json');
    assert('download recovery includes the in-memory edit', String(downloaded.text || '').indexOf('SYN-copy-me') !== -1);

    // Keyboard: recovery buttons are real controls and can take focus without a trap.
    await page.focus('#save-status-retry');
    var retryFocused = await page.evaluate(function () {
        return document.activeElement && document.activeElement.id === 'save-status-retry';
    });
    await page.keyboard.press('Tab');
    var afterTab = await page.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert('retry button is keyboard focusable', retryFocused === true);
    assert('Tab from retry moves to another recovery control', afterTab === 'save-status-copy' || afterTab === 'save-status-download');

    await context.close();

    // --- Laptop layout ---
    var laptop = await browser.newContext();
    await laptop.addInitScript(installWriteHooks());
    var laptopPage = await laptop.newPage();
    await laptopPage.setViewportSize({ width: 1280, height: 800 });
    await laptopPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await laptopPage.waitForSelector('#question-101-5-key', { timeout: 20000 });
    await laptopPage.fill('#question-101-5-key', 'SYN-laptop');
    var laptopSaved = await bannerState(laptopPage);
    assert('laptop 1280 Saved status is visible', laptopSaved.label === 'Saved' && laptopSaved.hidden === false);
    await laptopPage.evaluate(function () { window.__gtQuotaFail = true; });
    await laptopPage.fill('#question-101-5-key', 'SYN-laptop-fail');
    var laptopFail = await laptopPage.evaluate(function () {
        var banner = document.getElementById('save-status-banner').getBoundingClientRect();
        var retry = document.getElementById('save-status-retry').getBoundingClientRect();
        return {
            label: document.getElementById('save-status-label').textContent,
            bannerW: banner.width,
            retryOnScreen: retry.bottom <= window.innerHeight + 1
        };
    });
    assert('laptop Could not save is visible', laptopFail.label === 'Could not save' && laptopFail.bannerW >= 600);
    assert('laptop retry stays on screen', laptopFail.retryOnScreen);
    await laptop.close();

    // --- Malformed / non-object loads preserve raw and keep edits in memory ---
    async function failedLoadCase(name, raw, expectOriginalDownload) {
        var ctx = await browser.newContext();
        await ctx.addInitScript(function (seed) {
            localStorage.setItem('christianFoundationsResponses', seed.raw);
            window.syntheticRaw = seed.raw;
        }, { raw: raw });
        var p = await ctx.newPage();
        await p.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
        await p.waitForSelector('#question-101-5-key', { timeout: 20000 });
        var onLoad = await p.evaluate(function () {
            return {
                label: document.getElementById('save-status-label').textContent,
                detail: document.getElementById('save-status-detail').textContent,
                raw: localStorage.getItem('christianFoundationsResponses'),
                writable: responseStorageWritable,
                originalHidden: document.getElementById('save-status-download-original').hidden
            };
        });
        assert(name + ': startup is Could not save', onLoad.label === 'Could not save');
        assert(name + ': original stored copy is unchanged', onLoad.raw === raw);
        assert(name + ': writes stay blocked', onLoad.writable === false);
        assert(name + ': explains in-memory risk', onLoad.detail.indexOf('could be lost if you reload') !== -1);
        if (expectOriginalDownload) {
            assert(name + ': original download is offered', onLoad.originalHidden === false);
        }

        await p.fill('#question-101-5-key', 'SYN-' + name);
        var afterEdit = await p.evaluate(function () {
            return {
                memory: responses['question-101-5-key'],
                raw: localStorage.getItem('christianFoundationsResponses'),
                label: document.getElementById('save-status-label').textContent,
                field: document.getElementById('question-101-5-key').value,
                focus: document.activeElement ? document.activeElement.id : ''
            };
        });
        assert(name + ': edit stays in memory', afterEdit.memory === 'SYN-' + name && afterEdit.field === 'SYN-' + name);
        assert(name + ': edit does not overwrite original storage', afterEdit.raw === raw);
        assert(name + ': later write is still Could not save', afterEdit.label === 'Could not save');
        assert(name + ': typing is not interrupted', afterEdit.focus === 'question-101-5-key');

        await p.click('#save-status-retry');
        var afterFailedRetry = await p.evaluate(function () {
            return {
                raw: localStorage.getItem('christianFoundationsResponses'),
                label: document.getElementById('save-status-label').textContent,
                memory: responses['question-101-5-key']
            };
        });
        assert(name + ': retry still refuses to overwrite the original copy', afterFailedRetry.raw === raw);
        assert(name + ': retry keeps Could not save', afterFailedRetry.label === 'Could not save');
        assert(name + ': retry keeps the in-memory edit', afterFailedRetry.memory === 'SYN-' + name);

        if (expectOriginalDownload) {
            await p.click('#save-status-download-original');
            var originalDl = await p.evaluate(function () { return window.__gtLastRecoveryDownload || {}; });
            assert(name + ': original download is the raw bytes', originalDl.text === raw);
        }
        await ctx.close();
    }

    await failedLoadCase('malformed', '{"SYN-broken":', true);
    await failedLoadCase('non-object', '["SYN-array"]', true);

    // --- Failed read, then later writes stay blocked ---
    var readCtx = await browser.newContext();
    await readCtx.addInitScript(function () {
        if (window !== window.top) return;
        var original = Storage.prototype.getItem;
        window.syntheticReadFails = true;
        Storage.prototype.getItem = function (key) {
            if (key === 'christianFoundationsResponses' && window.syntheticReadFails) {
                throw new Error('Synthetic read failure');
            }
            return original.call(this, key);
        };
        localStorage.setItem('christianFoundationsResponses', '{"SYN-keep":"original"}');
        window.syntheticRaw = '{"SYN-keep":"original"}';
    });
    var readPage = await readCtx.newPage();
    await readPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await readPage.waitForSelector('#question-101-5-key', { timeout: 20000 });
    var failedRead = await readPage.evaluate(function () {
        window.syntheticReadFails = false;
        responses['SYN-new'] = 'in-memory edit';
        var rejected = persistResponses() === false;
        persistResponses();
        return {
            rejected: rejected,
            raw: localStorage.getItem('christianFoundationsResponses'),
            memory: responses['SYN-new'],
            label: document.getElementById('save-status-label').textContent
        };
    });
    assert('failed read then later write is rejected', failedRead.rejected === true);
    assert('failed read then later write keeps the original copy', failedRead.raw === '{"SYN-keep":"original"}');
    assert('failed read then later write keeps in-memory edits', failedRead.memory === 'in-memory edit');
    assert('failed read then later write stays Could not save', failedRead.label === 'Could not save');
    await readCtx.close();

    // --- Blocked getter ---
    var blockedCtx = await browser.newContext();
    var blockedPage = await blockedCtx.newPage();
    await blockedPage.goto(BASE + '#101-5', { waitUntil: 'domcontentloaded' });
    await blockedPage.waitForSelector('#question-101-5-key', { timeout: 20000 });
    var blocked = await blockedPage.evaluate(function () {
        responses['SYN-blocked'] = 'in-memory blocked';
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get: function () { throw new Error('Synthetic getter failure'); }
        });
        var rejected = persistResponses() === false;
        return {
            rejected: rejected,
            memory: responses['SYN-blocked'],
            label: document.getElementById('save-status-label').textContent,
            detail: document.getElementById('save-status-detail').textContent
        };
    });
    assert('blocked getter persist reports failure', blocked.rejected === true);
    assert('blocked getter keeps the in-memory edit', blocked.memory === 'in-memory blocked');
    assert('blocked getter is Could not save', blocked.label === 'Could not save');
    assert('blocked getter explains blocked storage', blocked.detail.indexOf('blocked') !== -1);
    await blockedCtx.close();

    await browser.close();

    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nAll ENG-005 browser checks passed.');
})().catch(function (err) {
    console.error(err.message);
    process.exit(1);
});
