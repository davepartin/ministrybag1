#!/usr/bin/env node
/**
 * UX-001b browser check. Synthetic navigation only.
 * Grace widget Restart, Show whole diagram, keyboard, layout and iframe resize.
 * Does not read learner answers or credentials.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.UX001B_BASE_URL || process.env.GT_BASE_URL || 'http://127.0.0.1:8765/index.html';
var failed = 0;

var VIEWPORTS = [
    { name: 'phone-375', width: 375, height: 812 },
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'laptop-1280', width: 1280, height: 800 }
];

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

function widgetFrame(page) {
    return page.frameLocator('#session-8.active iframe.gt-widget-frame').first();
}

async function waitWidget(page) {
    await page.waitForSelector('#session-8.active iframe.gt-widget-frame', { timeout: 20000 });
    await page.waitForFunction(function () {
        var root = document.getElementById('session-8');
        var frame = root && root.querySelector('iframe.gt-widget-frame');
        if (!frame || frame.clientHeight < 50) return false;
        try {
            var doc = frame.contentDocument;
            return !!(doc && doc.body && doc.body.childElementCount > 0);
        } catch (err) {
            return false;
        }
    }, null, { timeout: 20000 });
}

async function openLesson(page) {
    await page.goto(BASE + '#201-8', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#session-8.active', { timeout: 20000 });
    await waitWidget(page);
}

async function iframeHeight(page) {
    return page.locator('#session-8.active iframe.gt-widget-frame').first().evaluate(function (el) {
        return {
            style: parseInt(el.style.height || '0', 10),
            client: el.clientHeight,
            content: el.contentDocument && el.contentDocument.body ? el.contentDocument.body.scrollHeight : 0
        };
    });
}

async function overflowX(page) {
    return page.evaluate(function () {
        var doc = document.documentElement;
        return Math.max(doc.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    });
}

async function overviewLabels(page) {
    return page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var doc = iframe && iframe.contentDocument;
        if (!doc) return { labels: [], clipped: true, height: 0 };
        var ir = iframe.getBoundingClientRect();
        var boxes = Array.prototype.slice.call(doc.querySelectorAll('.grace-box'));
        var labels = boxes.map(function (box) {
            var lbl = box.querySelector('.box-label');
            var desc = box.querySelector('.box-desc');
            var r = (lbl || box).getBoundingClientRect();
            var top = ir.top + r.top;
            var bottom = ir.top + r.bottom;
            return {
                name: lbl ? (lbl.textContent || '').trim() : '',
                desc: desc ? (desc.innerText || '').replace(/\s+/g, ' ').trim() : '',
                inIframe: r.top + 1 >= 0 && r.bottom - 1 <= iframe.clientHeight &&
                    r.left + 1 >= 0 && r.right - 1 <= iframe.clientWidth,
                inViewport: top >= 0 && bottom <= window.innerHeight
            };
        });
        return {
            labels: labels,
            height: iframe.clientHeight,
            hasReturn: !!doc.querySelector('[data-control="return"]'),
            hasOverview: !!doc.querySelector('[data-control="overview"]'),
            hasBegin: !!doc.querySelector('[data-control="begin"]')
        };
    });
}

async function cardTitle(page) {
    return page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var doc = iframe && iframe.contentDocument;
        var title = doc && doc.querySelector('.verse-card-title');
        return title ? (title.innerText || '').replace(/\s+/g, ' ').trim() : '';
    });
}

async function controlNames(page) {
    return page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var doc = iframe && iframe.contentDocument;
        if (!doc) return [];
        return Array.prototype.slice.call(doc.querySelectorAll('button')).map(function (btn) {
            return (btn.textContent || '').replace(/\s+/g, ' ').trim();
        });
    });
}

async function setBanner(page, state) {
    await page.evaluate(function (mode) {
        var banner = document.getElementById('save-status-banner');
        if (!banner) return;
        if (mode === 'hidden') {
            banner.hidden = true;
            banner.setAttribute('data-state', 'idle');
            document.documentElement.style.setProperty('--save-status-height', '0px');
            return;
        }
        banner.hidden = false;
        banner.setAttribute('data-state', mode);
        var label = document.getElementById('save-status-label');
        var detail = document.getElementById('save-status-detail');
        if (label) label.textContent = mode === 'error' ? 'SYN-could-not-save' : 'SYN-saved';
        if (detail) detail.textContent = 'SYN-test-banner-only';
        document.documentElement.style.setProperty('--save-status-height', banner.getBoundingClientRect().height + 'px');
    }, state);
}

async function walkToLast(frame) {
    var begin = frame.getByRole('button', { name: /^begin/i });
    if (await begin.count() && await begin.first().isVisible()) {
        await begin.click();
        await new Promise(function (resolve) { setTimeout(resolve, 120); });
    }
    for (var i = 0; i < 8; i++) {
        var restart = frame.getByRole('button', { name: /restart/i });
        if (await restart.count() && await restart.first().isVisible()) {
            return;
        }
        var next = frame.getByRole('button', { name: /^next/i });
        if (!(await next.count()) || !(await next.first().isVisible())) {
            return;
        }
        await next.click();
        await new Promise(function (resolve) { setTimeout(resolve, 120); });
    }
}

async function activeControl(page) {
    return page.evaluate(function () {
        var doc = document.querySelector('#session-8.active iframe.gt-widget-frame').contentDocument;
        return doc.activeElement && doc.activeElement.getAttribute('data-control');
    });
}

async function checkAlignedOverview(page, prefix) {
    // Ordinary outer scroll is allowed. Check actual occlusion, not just iframe bounds.
    await page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var header = document.querySelector('.lesson-topbar');
        var banner = document.getElementById('save-status-banner');
        var floor = Math.max(header.getBoundingClientRect().bottom,
            banner && !banner.hidden ? banner.getBoundingClientRect().bottom : 0) + 8;
        window.scrollBy(0, iframe.getBoundingClientRect().top - floor);
    });
    await page.waitForTimeout(150);
    var fit = await page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var ir = iframe.getBoundingClientRect(), doc = iframe.contentDocument;
        var header = document.querySelector('.lesson-topbar').getBoundingClientRect();
        var banner = document.getElementById('save-status-banner');
        var floor = Math.max(header.bottom, banner && !banner.hidden ? banner.getBoundingClientRect().bottom : 0);
        var selector = '.grace-box, .box-label, .box-desc, .arrow-group, .overview-caption, .overview-panel button';
        var clipped = Array.from(doc.querySelectorAll(selector)).filter(function (el) {
            var r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.top < -1 || r.bottom > iframe.clientHeight + 1 ||
                r.left < -1 || r.right > iframe.clientWidth + 1 ||
                ir.top + r.top < floor || ir.top + r.bottom > innerHeight);
        }).map(function (el) { return el.className.baseVal || el.className; });
        return { clipped: clipped, arrows: doc.querySelectorAll('.arrow-group.visible').length,
            height: iframe.clientHeight, floor: floor };
    });
    assert(prefix + 'whole diagram, definitions, arrows and controls fit below header after outer scroll',
        fit.clipped.length === 0 && fit.arrows === 4, JSON.stringify(fit));
    if (process.env.UX001B_SCREENSHOTS === '1') {
        await page.screenshot({ path: '/tmp/ux001b-' + prefix.trim().replace(/[^a-z0-9]+/gi, '-') + '.png' });
    }
}

async function checkViewport(browser, vp) {
    var context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    var page = await context.newPage();
    var prefix = vp.name + ' ';

    await openLesson(page);
    var frame = widgetFrame(page);
    assert(prefix + 'no outer overflow on load', (await overflowX(page)) <= 1, String(await overflowX(page)));

    var introNames = await controlNames(page);
    assert(prefix + 'intro has Begin', introNames.some(function (n) { return /^begin/i.test(n); }), JSON.stringify(introNames));
    assert(prefix + 'intro has Show whole diagram', introNames.some(function (n) { return /show whole diagram/i.test(n); }), JSON.stringify(introNames));

    var introH = await iframeHeight(page);

    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(350);
    assert(prefix + 'opening overview focuses Return', await activeControl(page) === 'return');
    var fromIntro = await overviewLabels(page);
    var names = fromIntro.labels.map(function (l) { return l.name; }).sort();
    assert(
        prefix + 'overview from intro shows four names',
        names.join(',') === 'Grace,Justified,Mercy,Righteous',
        JSON.stringify(names)
    );
    var missingDesc = fromIntro.labels.filter(function (l) { return !l.desc; });
    assert(prefix + 'overview keeps existing definitions', missingDesc.length === 0, JSON.stringify(fromIntro.labels));
    var clipped = fromIntro.labels.filter(function (l) { return !l.inIframe; });
    assert(prefix + 'overview labels stay inside iframe', clipped.length === 0, JSON.stringify(clipped));
    assert(prefix + 'overview has Return to steps', fromIntro.hasReturn, JSON.stringify(fromIntro));
    assert(prefix + 'overview does not show Begin', !fromIntro.hasBegin, JSON.stringify(fromIntro));
    var overviewH = await iframeHeight(page);
    assert(
        prefix + 'overview iframe is compact',
        overviewH.style > 50 && overviewH.style <= 560,
        JSON.stringify(overviewH)
    );
    assert(
        prefix + 'overview is shorter than or equal to intro-plus-tour card budget',
        overviewH.style <= Math.max(introH.style, 560),
        JSON.stringify({ intro: introH, overview: overviewH })
    );
    console.log(prefix + 'overview height ' + overviewH.style + 'px; labels in viewport: ' +
        fromIntro.labels.filter(function (l) { return l.inViewport; }).length + '/4');

    await frame.getByRole('button', { name: /return to steps/i }).click();
    await page.waitForTimeout(250);
    var afterReturnIntro = await controlNames(page);
    assert(
        prefix + 'return from intro overview restores Begin',
        afterReturnIntro.some(function (n) { return /^begin/i.test(n); }),
        JSON.stringify(afterReturnIntro)
    );

    await frame.getByRole('button', { name: /^begin/i }).click();
    await page.waitForTimeout(150);
    await frame.getByRole('button', { name: /^next/i }).click();
    await page.waitForTimeout(150);
    var midTitle = await cardTitle(page);
    assert(prefix + 'mid-tour is Justified', /justified/i.test(midTitle), midTitle);

    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(250);
    await frame.getByRole('button', { name: /return to steps/i }).click();
    await page.waitForTimeout(250);
    assert(prefix + 'return to Justified focuses Next', await activeControl(page) === 'next');
    var restoredTitle = await cardTitle(page);
    assert(prefix + 'return preserves Justified step', /justified/i.test(restoredTitle), restoredTitle);

    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(200);
    await frame.getByRole('button', { name: /return to steps/i }).click();
    await page.waitForTimeout(200);
    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(200);
    var switchNames = await controlNames(page);
    assert(prefix + 'repeated switch stays in overview', switchNames.some(function (n) { return /return to steps/i.test(n); }), JSON.stringify(switchNames));
    await frame.getByRole('button', { name: /return to steps/i }).click();
    await page.waitForTimeout(200);
    assert(prefix + 'repeated switch restores Justified', /justified/i.test(await cardTitle(page)), await cardTitle(page));

    var guidedH = await iframeHeight(page);
    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(350);
    var shrunk = await iframeHeight(page);
    assert(
        prefix + 'iframe shrinks for overview',
        shrunk.style > 50 && shrunk.style < guidedH.style,
        JSON.stringify({ guided: guidedH, overview: shrunk })
    );
    await frame.getByRole('button', { name: /return to steps/i }).click();
    await page.waitForTimeout(350);
    var grown = await iframeHeight(page);
    assert(
        prefix + 'iframe grows after return to steps',
        grown.style >= shrunk.style,
        JSON.stringify({ overview: shrunk, returned: grown })
    );

    await walkToLast(frame);
    await page.waitForTimeout(150);
    var lastNames = await controlNames(page);
    assert(prefix + 'final step has Restart', lastNames.some(function (n) { return /restart/i.test(n); }), JSON.stringify(lastNames));
    await frame.getByRole('button', { name: /restart/i }).click();
    await page.waitForTimeout(250);
    assert(prefix + 'Restart focuses Begin', await activeControl(page) === 'begin');
    var afterRestart = await controlNames(page);
    assert(
        prefix + 'Restart returns to Begin',
        afterRestart.some(function (n) { return /^begin/i.test(n); }) &&
            !afterRestart.some(function (n) { return /^next/i.test(n); }),
        JSON.stringify(afterRestart)
    );

    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(200);
    await frame.getByRole('button', { name: /restart/i }).click();
    await page.waitForTimeout(250);
    var overviewRestart = await controlNames(page);
    assert(
        prefix + 'Restart from overview returns to Begin',
        overviewRestart.some(function (n) { return /^begin/i.test(n); }),
        JSON.stringify(overviewRestart)
    );

    await frame.getByRole('button', { name: /^begin/i }).click();
    await page.waitForTimeout(150);
    await frame.getByRole('button', { name: /^next/i }).click();
    await page.waitForTimeout(150);
    await frame.getByRole('button', { name: /back/i }).click();
    await page.waitForTimeout(150);
    assert(prefix + 'Back from step 1 stays in guided steps', /mercy/i.test(await cardTitle(page)), await cardTitle(page));
    await frame.getByRole('button', { name: /back/i }).click();
    await page.waitForTimeout(150);
    var backIntro = await controlNames(page);
    assert(prefix + 'Back from Mercy returns to Begin', backIntro.some(function (n) { return /^begin/i.test(n); }), JSON.stringify(backIntro));

    var begin = frame.getByRole('button', { name: /^begin/i });
    await begin.focus();
    await begin.press('Tab');
    var focusedOverview = await page.evaluate(function () {
        var iframe = document.querySelector('#session-8.active iframe.gt-widget-frame');
        var active = iframe.contentDocument.activeElement;
        return active ? (active.textContent || '').replace(/\s+/g, ' ').trim() : '';
    });
    assert(prefix + 'Tab from Begin reaches Show whole diagram', /show whole diagram/i.test(focusedOverview), focusedOverview);
    await frame.getByRole('button', { name: /show whole diagram/i }).press('Enter');
    await page.waitForTimeout(250);
    var kbOverview = await controlNames(page);
    assert(prefix + 'keyboard Enter opens overview', kbOverview.some(function (n) { return /return to steps/i.test(n); }), JSON.stringify(kbOverview));
    await frame.getByRole('button', { name: /return to steps/i }).press('Enter');
    await page.waitForTimeout(250);
    var kbReturn = await controlNames(page);
    assert(prefix + 'keyboard Enter returns to Begin', kbReturn.some(function (n) { return /^begin/i.test(n); }), JSON.stringify(kbReturn));

    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await page.waitForTimeout(250);
    await checkAlignedOverview(page, prefix + 'normal ');
    var normalFit = await overviewLabels(page);
    var inViewNormal = normalFit.labels.filter(function (l) { return l.inViewport; }).length;
    await setBanner(page, 'error');
    await page.waitForTimeout(150);
    await checkAlignedOverview(page, prefix + 'save-error ');
    var errorFit = await overviewLabels(page);
    var inViewError = errorFit.labels.filter(function (l) { return l.inViewport; }).length;
    console.log(prefix + 'overview labels in viewport: normal ' + inViewNormal + '/4, save-error banner ' + inViewError + '/4');
    assert(prefix + 'overview labels remain inside iframe with save-error banner', errorFit.labels.every(function (l) { return l.inIframe; }), JSON.stringify(errorFit.labels));
    await setBanner(page, 'hidden');

    var mercy = frame.getByRole('button', { name: /Mercy.*PUNISHMENT/i });
    assert(prefix + 'overview tile exposes teaching in native button name',
        await mercy.count() === 1 && await mercy.evaluate(function (el) { return el.tagName === 'BUTTON'; }));
    await mercy.focus();
    await mercy.press('Space');
    assert(prefix + 'Space on overview Mercy opens Mercy and focuses Next',
        /mercy/i.test(await cardTitle(page)) && await activeControl(page) === 'next');
    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await frame.getByRole('button', { name: /Grace.*GIFT/i }).press('Enter');
    assert(prefix + 'Enter on overview Grace opens Grace and focuses Next',
        /grace/i.test(await cardTitle(page)) && await activeControl(page) === 'next');
    await frame.getByRole('button', { name: /^next/i }).click();
    await frame.getByRole('button', { name: /show whole diagram/i }).click();
    await frame.getByRole('button', { name: /return to steps/i }).click();
    assert(prefix + 'return preserves final cycle step and focuses Restart',
        await activeControl(page) === 'restart' && /Give Grace, Show Mercy, & Forgive/i.test(await cardTitle(page)));


    assert(prefix + 'no outer overflow after interactions', (await overflowX(page)) <= 1, String(await overflowX(page)));

    await context.close();
}

(async function () {
    var browser = await launchBrowser();
    for (var i = 0; i < VIEWPORTS.length; i++) {
        await checkViewport(browser, VIEWPORTS[i]);
    }
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' UX-001b browser check(s) failed.');
        process.exit(1);
    }
    console.log('\nBrowser UX-001b checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
