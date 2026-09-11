#!/usr/bin/env node
/**
 * ENG-004 browser check. Synthetic answers only.
 * Confirms current-lesson default, optional course scope, visible preview,
 * cancel without mail, encoding, and phone/laptop preview layout.
 * Does not read real learner answers or credentials.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.ENG004_BASE_URL || 'http://127.0.0.1:8765/index.html';
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

(async function () {
    var browser = await launchBrowser();
    var context = await browser.newContext();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    var page = await context.newPage();

    await page.addInitScript(function () {
        localStorage.setItem('christianFoundationsResponses', JSON.stringify({
            'question-202-201-09-1': 'SYN-202-05-mid',
            'question-202-202-05-prayer': 'SYN-202-05-prayer',
            'question-202-201-05-prayer': 'SYN-202-06-prayer',
            'question-201-201-01-prayer': 'SYN-201-01-prayer',
            'commitment-202': 'Yes',
            '__gtSharedKeyMigrationV1': true,
            '__gtAmbiguousSharedAnswers': {
                version: 1,
                items: {
                    'question-202-201-09-prayer': {
                        value: 'SYN-ambiguous-legacy-prayer',
                        status: 'ambiguous'
                    }
                }
            }
        }));
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '#202-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-5.active', { timeout: 20000 });
    await page.waitForSelector('#email-lesson-btn', { timeout: 15000 });

    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open', { timeout: 10000 });

    var firstPreview = await page.evaluate(function () {
        return {
            open: document.getElementById('export-preview-overlay').classList.contains('open'),
            title: document.getElementById('export-preview-selected').textContent,
            body: document.getElementById('export-preview-text').textContent,
            lessonChecked: document.getElementById('export-scope-lesson').checked,
            href: window.location.href,
            mailto: window.__gtLastMailtoHref || null,
            focus: document.activeElement ? document.activeElement.id : ''
        };
    });

    assert('preview opens from Email Lesson', firstPreview.open === true);
    assert('default scope is this lesson', firstPreview.lessonChecked === true);
    assert('preview title names the current lesson', /Suffering/i.test(firstPreview.title));
    assert('preview shows the current lesson prayer', firstPreview.body.indexOf('SYN-202-05-prayer') !== -1);
    assert('preview shows the copied-ID mid-lesson answer', firstPreview.body.indexOf('SYN-202-05-mid') !== -1);
    assert('preview hides the other lesson prayer', firstPreview.body.indexOf('SYN-202-06-prayer') === -1);
    assert('preview hides course commitment', firstPreview.body.indexOf('Course Commitment') === -1);
    assert('preview hides recovery metadata', firstPreview.body.indexOf('SYN-ambiguous-legacy-prayer') === -1);
    assert('preview hides migration flag text', firstPreview.body.indexOf('__gtSharedKeyMigrationV1') === -1);
    assert('opening preview does not start a mail draft', firstPreview.mailto === null && firstPreview.href.indexOf('mailto:') === -1);
    assert('cancel control is focused on open', firstPreview.focus === 'export-preview-cancel');

    var phoneLayout = await page.evaluate(function () {
        var overlay = document.getElementById('export-preview-overlay');
        var dialog = document.getElementById('export-preview-dialog');
        var text = document.getElementById('export-preview-text');
        var cancel = document.getElementById('export-preview-cancel');
        var copy = document.getElementById('export-preview-copy');
        var mail = document.getElementById('export-preview-mail');
        var o = overlay.getBoundingClientRect();
        var d = dialog.getBoundingClientRect();
        var t = text.getBoundingClientRect();
        return {
            overlayW: o.width,
            dialogW: d.width,
            dialogH: d.height,
            textH: t.height,
            textReadable: window.getComputedStyle(text).fontSize,
            cancelInView: cancel.getBoundingClientRect().bottom <= window.innerHeight + 1,
            copyInView: copy.getBoundingClientRect().bottom <= window.innerHeight + 1,
            mailInView: mail.getBoundingClientRect().bottom <= window.innerHeight + 1,
            textOverflow: window.getComputedStyle(text).overflowY
        };
    });
    assert('phone preview dialog fits the 390px viewport', phoneLayout.dialogW <= phoneLayout.overlayW && phoneLayout.dialogH <= 844);
    assert('phone outgoing text is readable', parseFloat(phoneLayout.textReadable) >= 14 && phoneLayout.textH >= 100);
    assert('phone cancel stays on screen', phoneLayout.cancelInView);
    assert('phone copy stays on screen', phoneLayout.copyInView);
    assert('phone open-mail stays on screen', phoneLayout.mailInView);

    await page.keyboard.press('Escape');
    var afterEscape = await page.evaluate(function () {
        return {
            open: document.getElementById('export-preview-overlay').classList.contains('open'),
            mailto: window.__gtLastMailtoHref || null,
            href: window.location.href
        };
    });
    assert('Escape closes the preview', afterEscape.open === false);
    assert('Escape does not open mail', afterEscape.mailto === null && afterEscape.href.indexOf('mailto:') === -1);

    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    await page.click('#export-preview-cancel');
    var afterCancel = await page.evaluate(function () {
        return {
            open: document.getElementById('export-preview-overlay').classList.contains('open'),
            mailto: window.__gtLastMailtoHref || null
        };
    });
    assert('Cancel closes without opening mail', afterCancel.open === false && afterCancel.mailto === null);

    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    await page.check('#export-scope-course');
    var coursePreview = await page.evaluate(function () {
        return {
            title: document.getElementById('export-preview-selected').textContent,
            body: document.getElementById('export-preview-text').textContent
        };
    });
    assert('course scope title names the course', /Growing Up/i.test(coursePreview.title));
    assert('course scope shows the other lesson prayer', coursePreview.body.indexOf('SYN-202-06-prayer') !== -1);
    assert('course scope shows course commitment', coursePreview.body.indexOf('Course Commitment') !== -1 && coursePreview.body.indexOf('Yes') !== -1);
    assert('course scope still hides recovery metadata', coursePreview.body.indexOf('SYN-ambiguous-legacy-prayer') === -1);

    await page.click('#export-scope-lesson');
    var backToLesson = await page.evaluate(function () {
        return document.getElementById('export-preview-text').textContent;
    });
    assert('returning to lesson scope removes the other prayer again', backToLesson.indexOf('SYN-202-06-prayer') === -1);

    await page.keyboard.press('Escape');

    await page.goto(BASE + '#202-6', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-6.active', { timeout: 20000 });
    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    var lesson6 = await page.evaluate(function () {
        return document.getElementById('export-preview-text').textContent;
    });
    assert('switching lessons exports the new lesson prayer', lesson6.indexOf('SYN-202-06-prayer') !== -1);
    assert('switching lessons drops the previous lesson prayer', lesson6.indexOf('SYN-202-05-prayer') === -1);
    await page.keyboard.press('Escape');

    await page.goto(BASE + '#201-1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-1.active', { timeout: 20000 });
    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    var lesson201 = await page.evaluate(function () {
        return document.getElementById('export-preview-text').textContent;
    });
    assert('switching courses exports the new course lesson', lesson201.indexOf('SYN-201-01-prayer') !== -1);
    assert('switching courses drops 202 answers', lesson201.indexOf('SYN-202-05-prayer') === -1);
    await page.keyboard.press('Escape');

    await page.goto(BASE + '#202-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#question-202-202-05-prayer', { timeout: 20000 });
    await page.fill('#question-202-202-05-prayer', 'Cafe & tea\n"quoted"\n日本語');
    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    var typed = await page.evaluate(function () {
        return document.getElementById('export-preview-text').textContent;
    });
    assert('typed multiline text appears in the preview', typed.indexOf('Cafe & tea\n"quoted"\n日本語') !== -1);

    await page.click('#export-preview-copy');
    await page.waitForTimeout(300);
    var copied = await page.evaluate(async function () {
        try {
            return await navigator.clipboard.readText();
        } catch (err) {
            return '';
        }
    });
    assert('copy button copies the exact outgoing text', copied.indexOf('Cafe & tea\n"quoted"\n日本語') !== -1);

    await page.evaluate(function () {
        window.__gtLastMailtoHref = null;
        var proto = window.Location.prototype;
        if (!proto.__gtPatched) {
            var desc = Object.getOwnPropertyDescriptor(proto, 'href');
            if (desc && desc.set) {
                Object.defineProperty(proto, 'href', {
                    configurable: true,
                    get: desc.get,
                    set: function (value) {
                        if (String(value).indexOf('mailto:') === 0) {
                            window.__gtLastMailtoHref = String(value);
                            return;
                        }
                        return desc.set.call(this, value);
                    }
                });
                proto.__gtPatched = true;
            }
        }
    });
    await page.click('#export-preview-mail');
    var afterMail = await page.evaluate(function () {
        return {
            open: document.getElementById('export-preview-overlay').classList.contains('open'),
            href: window.__gtLastMailtoHref || ''
        };
    });
    assert('open mail draft closes the preview', afterMail.open === false);
    assert('open mail draft builds an encoded mailto', afterMail.href.indexOf('mailto:?subject=') === 0);
    assert('mailto encodes the ampersand', afterMail.href.indexOf('Cafe%20%26%20tea') !== -1);
    assert('mailto encodes quotes', afterMail.href.indexOf('%22quoted%22') !== -1);
    assert('mailto encodes Unicode', afterMail.href.indexOf(encodeURIComponent('日本語')) !== -1);

    await page.goto(BASE + '#203-1', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-1.active', { timeout: 20000 });
    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    var emptyLesson = await page.evaluate(function () {
        return document.getElementById('export-preview-text').textContent;
    });
    assert('empty responses still show the selected lesson and placeholder', /Lesson 1/i.test(emptyLesson) && emptyLesson.indexOf('[No response]') !== -1);
    assert('empty 203 lesson does not include 202 prayers', emptyLesson.indexOf('SYN-202-05-prayer') === -1);
    await page.keyboard.press('Escape');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE + '#202-5', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-5.active', { timeout: 20000 });
    await page.click('#email-lesson-btn');
    await page.waitForSelector('#export-preview-overlay.open');
    var laptop = await page.evaluate(function () {
        var dialog = document.getElementById('export-preview-dialog');
        var text = document.getElementById('export-preview-text');
        var cancel = document.getElementById('export-preview-cancel');
        var d = dialog.getBoundingClientRect();
        return {
            dialogW: d.width,
            textH: text.getBoundingClientRect().height,
            cancelY: cancel.getBoundingClientRect().top,
            title: document.getElementById('export-preview-selected').textContent,
            body: text.textContent
        };
    });
    assert('laptop preview stays within a readable card', laptop.dialogW >= 400 && laptop.dialogW <= 720);
    assert('laptop outgoing text is tall enough to read', laptop.textH >= 140);
    assert('laptop preview still defaults to the current lesson', /Suffering/i.test(laptop.title) && laptop.body.indexOf('SYN-202-06-prayer') === -1);
    assert('laptop cancel is below the preview text', laptop.cancelY > 200);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    var tabTarget = await page.evaluate(function () {
        return document.activeElement ? document.activeElement.id : '';
    });
    assert(
        'Tab stays inside the preview controls',
        ['export-preview-cancel', 'export-scope-lesson', 'export-scope-course', 'export-preview-text', 'export-preview-copy', 'export-preview-mail'].indexOf(tabTarget) !== -1,
        tabTarget
    );

    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nBrowser ENG-004 checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
