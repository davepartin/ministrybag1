#!/usr/bin/env node
/**
 * 203-06 Faithful in Babylon story-image browser check.
 * Confirms the B&W-to-color dissolve loads both layers, fades on
 * scroll, keeps touchNext on the parable card, and does not shift
 * the page at phone and laptop widths. Synthetic navigation only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20306_STORY_BASE_URL || 'http://127.0.0.1:8765/index.html';
var QUESTION_IDS = [
    '203-06-story',
    '203-06-space',
    '203-06-faithful',
    '203-06-people',
    '203-06-key',
    '203-06-step',
    '203-06-prayer'
];
var SAMPLE_PROGRESS = [0, 0.2, 0.4, 0.6, 0.8, 1];
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

async function waitForDissolve(page) {
    await page.waitForSelector('#session-6.active [data-parable-dissolve]', { timeout: 20000 });
    await page.waitForFunction(function () {
        var root = document.querySelector('#session-6.active [data-parable-dissolve]');
        if (!root) return false;
        var color = root.querySelector('.parable-img-color');
        var bw = root.querySelector('.parable-img-bw');
        return color && bw &&
            color.complete && color.naturalWidth > 0 && color.naturalHeight > 0 &&
            bw.complete && bw.naturalWidth > 0 && bw.naturalHeight > 0;
    }, { timeout: 20000 });
}

async function setDissolveProgress(page, targetProgress) {
    await page.evaluate(function (progress) {
        var el = document.querySelector('#session-6.active [data-parable-dissolve]');
        var topbar = document.querySelector('.lesson-topbar');
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        var contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
        var visibleHeight = Math.max(viewportHeight - contentTop, 1);
        var fadeStartY = contentTop + (visibleHeight * 0.40);
        var fadeEndY = contentTop + (visibleHeight * -0.22);
        var fadeRange = Math.max(fadeStartY - fadeEndY, 1);
        var rect = el.getBoundingClientRect();
        var desiredTop = fadeStartY - progress * fadeRange;
        window.scrollBy({ top: rect.top - desiredTop, behavior: 'instant' });
    }, targetProgress);
    await page.waitForTimeout(80);
}

async function readDissolveState(page) {
    return page.evaluate(function (questionIds) {
        var session = document.querySelector('#session-6.active');
        var el = session && session.querySelector('[data-parable-dissolve]');
        var color = el && el.querySelector('.parable-img-color');
        var bw = el && el.querySelector('.parable-img-bw');
        var parable = session && session.querySelector('.block-parable');
        var imageWrap = session && session.querySelector('.block-image');
        var topbar = document.querySelector('.lesson-topbar');
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        var contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
        function box(img) {
            if (!img) return null;
            var r = img.getBoundingClientRect();
            var opacityRaw = img.style.opacity === '' ? window.getComputedStyle(img).opacity : img.style.opacity;
            return {
                src: img.getAttribute('src') || img.getAttribute('data-lesson-src') || '',
                currentSrc: img.currentSrc || '',
                alt: img.getAttribute('alt') || '',
                opacity: Number(opacityRaw),
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                widthAttr: img.getAttribute('width') || '',
                heightAttr: img.getAttribute('height') || '',
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height
            };
        }
        var wrapBox = imageWrap ? imageWrap.getBoundingClientRect() : null;
        var parableBox = parable ? parable.getBoundingClientRect() : null;
        var nextIsParable = !!(imageWrap && imageWrap.nextElementSibling &&
            imageWrap.nextElementSibling.classList.contains('block-parable'));
        return {
            hasDissolve: !!el,
            framed: !!(el && el.classList.contains('block-image-dissolve-framed')),
            touchNext: !!(imageWrap && imageWrap.classList.contains('block-image-touch-next')),
            nextIsParable: nextIsParable,
            color: box(color),
            bw: box(bw),
            wrapHeight: wrapBox ? wrapBox.height : 0,
            wrapWidth: wrapBox ? wrapBox.width : 0,
            wrapTop: wrapBox ? wrapBox.top : null,
            wrapBottom: wrapBox ? wrapBox.bottom : null,
            contentTop: contentTop,
            viewportHeight: viewportHeight,
            parableTop: parableBox ? parableBox.top : null,
            parableTitle: parable ? (parable.querySelector('.block-parable-title, h2, h3') || parable).textContent : '',
            questions: questionIds.map(function (id) {
                return !!document.getElementById('question-203-' + id);
            }),
            scrollWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
        };
    }, QUESTION_IDS);
}

function srcMatches(src, expected) {
    return typeof src === 'string' && src.indexOf(expected) !== -1;
}

(async function () {
    var browser = await chromium.launch({
        headless: true,
        channel: process.env.GT_BROWSER_CHANNEL || 'chrome'
    });
    var errors = [];
    var fadeNotes = [];

    for (var width of [375, 390, 1280]) {
        var page = await browser.newPage({ viewport: { width: width, height: width === 1280 ? 800 : 844 } });
        page.on('pageerror', function (err) { errors.push(width + ': ' + String(err)); });
        await page.goto(BASE + '#203-6', { waitUntil: 'domcontentloaded' });
        await waitForDissolve(page);

        var rest = await readDissolveState(page);
        assert(width + ': dissolve root renders', rest.hasDissolve);
        assert(width + ': image keeps touchNext', rest.touchNext);
        assert(width + ': parable card follows the image', rest.nextIsParable);
        assert(width + ': art is not framed', rest.framed === false);
        assert(
            width + ': color layer src is the Daniel window color art',
            rest.color && (srcMatches(rest.color.src, '203-06-daniel-window-color') ||
                srcMatches(rest.color.currentSrc, '203-06-daniel-window-color')),
            rest.color && (rest.color.src + ' | ' + rest.color.currentSrc)
        );
        assert(
            width + ': bw layer src is the Daniel window charcoal art',
            rest.bw && (srcMatches(rest.bw.src, '203-06-daniel-window-bw') ||
                srcMatches(rest.bw.currentSrc, '203-06-daniel-window-bw')),
            rest.bw && (rest.bw.src + ' | ' + rest.bw.currentSrc)
        );
        var alt = rest.color && rest.color.alt || '';
        assert(
            width + ': color alt names Daniel at the window',
            alt.indexOf('Daniel kneeling in prayer') !== -1 &&
                alt.indexOf('open window toward Jerusalem') !== -1 &&
                alt.indexOf('officials watch') !== -1,
            alt
        );
        assert(
            width + ': both layers load with reserved 1248x832 size',
            rest.color && rest.bw &&
                rest.color.widthAttr === '1248' && rest.color.heightAttr === '832' &&
                rest.bw.widthAttr === '1248' && rest.bw.heightAttr === '832' &&
                rest.color.naturalWidth > 0 && rest.bw.naturalWidth > 0 &&
                rest.color.naturalWidth === rest.bw.naturalWidth &&
                rest.color.naturalHeight === rest.bw.naturalHeight &&
                Math.abs((rest.color.naturalWidth / rest.color.naturalHeight) - (1248 / 832)) < 0.02,
            JSON.stringify({
                color: rest.color && [rest.color.naturalWidth, rest.color.naturalHeight, rest.color.widthAttr, rest.color.heightAttr, rest.color.currentSrc],
                bw: rest.bw && [rest.bw.naturalWidth, rest.bw.naturalHeight, rest.bw.widthAttr, rest.bw.heightAttr, rest.bw.currentSrc]
            })
        );
        assert(width + ': all seven saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
        assert(width + ': page does not scroll sideways', rest.overflowX === false, rest.scrollWidth + ' > ' + rest.viewport);

        var heightAtStart = rest.wrapHeight;
        var order = [];
        var overlapShift = false;
        for (var i = 0; i < SAMPLE_PROGRESS.length; i++) {
            await setDissolveProgress(page, SAMPLE_PROGRESS[i]);
            var sample = await readDissolveState(page);
            order.push({
                progress: SAMPLE_PROGRESS[i],
                bwOpacity: sample.bw ? Number(sample.bw.opacity.toFixed(3)) : null,
                colorHeight: sample.color ? sample.color.height : null
            });
            if (Math.abs(sample.wrapHeight - heightAtStart) > 1.5) overlapShift = true;
            if (sample.parableTop !== null && sample.wrapBottom !== null && sample.parableTop + 1 < sample.wrapBottom) {
                overlapShift = true;
            }
            if (sample.color && sample.bw) {
                var stackedOk = Math.abs(sample.bw.left - sample.color.left) < 1.5 &&
                    Math.abs(sample.bw.width - sample.color.width) < 1.5 &&
                    Math.abs(sample.bw.height - sample.color.height) < 1.5;
                if (!stackedOk) overlapShift = true;
            }
            if (sample.parableTop !== null && sample.wrapBottom !== null) {
                var gap = sample.parableTop - sample.wrapBottom;
                if (gap > 2) overlapShift = true;
            }
        }
        if (width === 390) {
            console.log('390 dissolve samples: ' + JSON.stringify(order));
        }
        var atStart = order.find(function (row) { return row.progress === 0; });
        var atEnd = order.find(function (row) { return row.progress === 1; });
        fadeNotes.push(
            width + ' startBw=' + (atStart && atStart.bwOpacity) +
            ' endBw=' + (atEnd && atEnd.bwOpacity) +
            ' wrapHeight=' + heightAtStart
        );
        var fading = true;
        for (var j = 1; j < order.length; j++) {
            if (order[j].bwOpacity > order[j - 1].bwOpacity + 0.02) fading = false;
        }
        var dropped = atStart && atEnd && atEnd.bwOpacity < atStart.bwOpacity - 0.5;
        assert(width + ': both layers load at progress 0', atStart && atStart.bwOpacity >= 0.95, JSON.stringify(atStart));
        assert(width + ': black-and-white layer fades toward color on scroll', fading && dropped, JSON.stringify(order));
        assert(width + ': color layer is visible at the end of the fade', atEnd && atEnd.bwOpacity <= 0.05, JSON.stringify(atEnd));
        assert(width + ': touchNext joins the parable card without layout shift', overlapShift === false && heightAtStart > 100);

        await page.close();
    }

    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    console.log('Dissolve timing: ' + fadeNotes.join('; '));
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-06 story-image browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
