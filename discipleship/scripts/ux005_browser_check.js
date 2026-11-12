#!/usr/bin/env node
// Synthetic footer, email, home backup/restore and save-failure recovery checks.
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chromium = require('playwright').chromium;
var BASE = process.env.UX005_BASE_URL || 'http://127.0.0.1:8873/index.html';
var SHOTS = process.env.UX005_SCREENSHOTS;
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
    console.log('PASS: ' + name);
}

async function download(page, selector) {
    var started = page.waitForEvent('download');
    await page.locator(selector).click();
    var file = await started;
    var chunks = [];
    for await (var chunk of await file.createReadStream()) chunks.push(chunk);
    return { name: file.suggestedFilename(), text: Buffer.concat(chunks).toString('utf8') };
}

async function isolatedPage(browser, width) {
    var context = await browser.newContext({ viewport: { width: width, height: 844 }, acceptDownloads: true });
    await context.route('**/scripts/account.js', function (route) {
        return route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    await context.addInitScript(function () {
        localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            '__gtSharedKeyMigrationV1': true,
            'question-201-201-08-1': 'SYN-mercy',
            'question-201-201-08-prayer': 'SYN-prayer',
            'question-201-201-07-prayer': 'SYN-private-other-lesson',
            'question-202-202-09-prayer': 'SYN-private-other-course'
        }));
        localStorage.setItem('foundationsCompletionData', JSON.stringify({ 'complete-101-1': true }));
        localStorage.setItem('foundationsReadingData', JSON.stringify({ 'notes-101-John-1': 'SYN-chapter-note' }));
    });
    return { context: context, page: await context.newPage() };
}

(async function () {
    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
        for (var width of [375, 390, 1280]) {
            var setup = await isolatedPage(browser, width);
            var page = setup.page;
            var errors = [];
            page.on('pageerror', function (error) { errors.push(error.message); });
            await page.goto(BASE + '#201-8');
            await page.waitForSelector('#session-8.active');
            await page.locator('#bottom-nav').scrollIntoViewIfNeeded();
            check(width + ': only two lesson utility controls', await page.locator('#export-section button').count() === 2);
            check(width + ': Email is compact and named exactly', (await page.locator('#email-lesson-btn').innerText()) === 'Email' &&
                (await page.locator('#email-lesson-btn').boundingBox()).width < 100);
            check(width + ': blank PDF is a disabled whole-course placeholder', await page.locator('#course-pdf-btn').isDisabled() &&
                (await page.locator('#course-pdf-btn').getAttribute('aria-label')).includes('201 Growing Deep Course, coming soon') &&
                await page.locator('#course-pdf-btn').getAttribute('onclick') === null);
            check(width + ': no backup counts or restore instructions in lessons, one short ESV line',
                await page.locator('#lesson-view .export-hint, #lesson-view .backup-download-scope, #lesson-view #lesson-download-backup').count() === 0 &&
                await page.locator('#lesson-view .lesson-esv-footnote').count() === 1);
            var controls = await page.locator('#bottom-nav').boundingBox();
            check(width + ': utility controls and lesson navigation fit on screen', controls.width <= width &&
                await page.locator('#prev-btn').isVisible() && await page.locator('#next-btn').isVisible());
            await page.evaluate(function () { document.documentElement.style.fontSize = '32px'; });
            check(width + ': utility labels fit at 200 percent text size', await page.locator('#export-section').evaluate(function (el) {
                return Array.from(el.querySelectorAll('button')).every(function (button) {
                    var box = button.getBoundingClientRect();
                    return box.left >= 0 && box.right <= innerWidth && button.scrollWidth <= button.clientWidth;
                });
            }));
            await page.evaluate(function () { document.documentElement.style.fontSize = ''; });
            if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'footer-' + width + '.png') });

            await page.locator('#email-lesson-btn').focus();
            await page.keyboard.press('Enter');
            await page.waitForSelector('#export-preview-overlay.open');
            var body = await page.locator('#export-preview-text').textContent();
            check(width + ': email contains course, lesson title and the lesson description as summary',
                body.startsWith('201 Growing Deep Course\n\nLesson 8: The Grace and Mercy Cycle\n\n') &&
                body.indexOf('Four words explain what God did for you at the cross') > -1);
            check(width + ': email labels answers with number plus short question, and plain closing labels',
                /^8\.1 [A-Z].*\nSYN-mercy/m.test(body) && body.includes('Prayer request\nSYN-prayer') &&
                !body.includes('8.1 -') && !body.includes('8.6\n'));
            check(width + ': email excludes every other lesson and internal identifiers', !body.includes('SYN-private') &&
                !body.includes('question-201-') && !body.includes('__gt'));
            check(width + ': email opens preview without opening or sending mail', await page.evaluate(function () {
                return !window.__gtLastMailtoHref;
            }));
            if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'email-' + width + '.png') });
            await page.keyboard.press('Escape');
            check(width + ': closing preview returns keyboard focus to Email', await page.locator('#email-lesson-btn').evaluate(function (el) {
                return document.activeElement === el;
            }));
            await page.locator('#question-201-201-08-1').fill('SYN-live\nwith & symbols');
            await page.click('#email-lesson-btn');
            check(width + ': email uses the latest typed answer', (await page.locator('#export-preview-text').textContent()).includes('SYN-live\nwith & symbols'));
            await page.keyboard.press('Escape');

            for (var course of ['101', '202', '203']) {
                await page.evaluate(async function (id) { await openSeries(id); }, course);
                check(width + ': ' + course + ' PDF stays a course-specific placeholder',
                    (await page.locator('#course-pdf-btn').getAttribute('aria-label')).includes(course + ' '));
                check(width + ': ' + course + ' has no duplicate footer', await page.locator('#export-section').count() === 1);
            }
            await page.fill('#question-203-203-01-key', 'SYN-before-backup');
            await page.click('.back-btn');
            check(width + ': home links to the About page, not a lesson acknowledgment', await page.locator('#home-about-link').isVisible() &&
                await page.locator('.esv-footnote').count() === 1);
            await page.click('#home-about-link');
            await page.locator('#about-acknowledgments summary').click();
            var acknowledgment = (await page.locator('.esv-footnote').textContent()).replace(/\s+/g, ' ');
            check(width + ': ESV and WEB acknowledgment text is preserved', acknowledgment.includes('Used by permission. All rights reserved.') &&
                acknowledgment.includes('World English Bible, which is in the public domain.'));
            check(width + ': private Gmail is not published on the page', !(await page.locator('body').textContent()).includes('davepartin@gmail.com') &&
                await page.locator('a[href*="davepartin@gmail.com"]').count() === 0);
            await page.click('#about-back-btn');
            await page.locator('#home-backup-tools summary').click();
            var file = await download(page, '#home-download-backup');
            var envelope = JSON.parse(file.text);
            check(width + ': home download preserves answers, completion and reading notes', envelope.kind === 'growing-together-backup' &&
                envelope.stores.answers.data['question-201-201-08-1'] === 'SYN-live\nwith & symbols' &&
                envelope.stores.completion.data['complete-101-1'] === true &&
                envelope.stores.reading.data['notes-101-John-1'] === 'SYN-chapter-note');

            // Restore from the actual home download, with conflict choice and safety file.
            await page.evaluate(function () {
                var el = document.getElementById('question-203-203-01-key');
                el.value = 'SYN-after-backup';
                saveResponse(el);
            });
            var chooserStarted = page.waitForEvent('filechooser');
            await page.click('#home-preview-backup');
            await (await chooserStarted).setFiles({ name: file.name, mimeType: 'application/json', buffer: Buffer.from(file.text) });
            await page.waitForSelector('#backup-preview-overlay.open');
            check(width + ': restore has no preselected conflicts and is initially disabled',
                await page.locator('#backup-preview-body input[type="radio"]:checked').count() === 0 &&
                await page.locator('#backup-preview-restore').isDisabled());
            var choices = page.locator('#backup-preview-body input[value="use-backup"]');
            check(width + ': home restore detects the changed answer', await choices.count() === 1);
            for (var i = 0; i < await choices.count(); i += 1) await choices.nth(i).check();
            var safety = await download(page, '#backup-preview-safety');
            check(width + ': safety backup preserves the edit before restore',
                JSON.parse(safety.text).stores.answers.data['question-203-203-01-key'] === 'SYN-after-backup');
            await page.locator('#backup-preview-safety-ack').check();
            await page.click('#backup-preview-restore');
            await page.waitForFunction(function () { return window.__gtLastBackupRestore && window.__gtLastBackupRestore.ok; });
            check(width + ': confirmed home restore preserves all three stores', await page.evaluate(function () {
                return JSON.parse(localStorage.getItem('christianFoundationsResponses'))['question-201-201-08-1'] === 'SYN-live\nwith & symbols' &&
                    JSON.parse(localStorage.getItem('christianFoundationsResponses'))['question-203-203-01-key'] === 'SYN-before-backup' &&
                    JSON.parse(localStorage.getItem('foundationsReadingData'))['notes-101-John-1'] === 'SYN-chapter-note' &&
                    JSON.parse(localStorage.getItem('foundationsCompletionData'))['complete-101-1'] === true;
            }));
            await page.click('#backup-preview-close');
            check(width + ': no horizontal overflow or page errors', errors.length === 0 && await page.evaluate(function () {
                return document.documentElement.scrollWidth <= innerWidth + 1;
            }));
            if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'home-' + width + '.png'), fullPage: true });
            await setup.context.close();
        }

        var failure = await isolatedPage(browser, 390);
        await failure.page.addInitScript(function () {
            var original = Storage.prototype.setItem;
            Storage.prototype.setItem = function (key, value) {
                if (key === 'christianFoundationsResponses' && String(value).includes('SYN-quota')) {
                    throw new DOMException('Synthetic quota error', 'QuotaExceededError');
                }
                return original.call(this, key, value);
            };
        });
        await failure.page.goto(BASE + '#201-8');
        await failure.page.waitForSelector('#session-8.active');
        await failure.page.fill('#question-201-201-08-1', 'SYN-quota-unsaved');
        await failure.page.waitForSelector('#save-status-banner:not([hidden])');
        check('save-failure recovery remains visible without footer backup buttons',
            await failure.page.locator('#save-status-download-backup').isVisible());
        var recovery = await download(failure.page, '#save-status-download-backup');
        check('save-failure download preserves the unsaved answer',
            JSON.parse(recovery.text).stores.answers.data['question-201-201-08-1'] === 'SYN-quota-unsaved');
        await failure.page.click('#email-lesson-btn');
        check('email also preserves an answer that could not save',
            (await failure.page.locator('#export-preview-text').textContent()).includes('8.1\nSYN-quota-unsaved'));
        await failure.context.close();
    } finally {
        await browser.close();
    }
    console.log(passed + ' UX-005 browser checks passed.');
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
