#!/usr/bin/env node
/**
 * 202-07 Two Small Coins story-image browser check.
 * Confirms the four scroll frames load, advance in order as the
 * coins fall, keep touchNext on the parable card, honor reduced
 * motion, and do not shift the page at phone and laptop widths.
 * Synthetic navigation only.
 */
'use strict';

var { chromium } = require('playwright');
var assets = require('./lesson-image-assets.js');

var BASE = process.env.L20207_STORY_BASE_URL || 'http://127.0.0.1:8765/index.html';
var FRAMES = [
    'images/202-07-two-coins-seq-1.jpg',
    'images/202-07-two-coins-seq-2.jpg',
    'images/202-07-two-coins-seq-3.jpg',
    'images/202-07-two-coins-seq-4.jpg'
];
var QUESTION_IDS = [
    '202-07-1',
    '202-07-2',
    '202-07-3',
    '202-07-4',
    '202-07-key',
    '202-07-step',
    '202-07-prayer'
];
var STOPS = [0, 0.18, 0.34, 0.5];
var LAST_STOP = STOPS[STOPS.length - 1];
var AFTER_LAST = 0.55;
var SAMPLE_PROGRESS = [0, 0.09, 0.18, 0.26, 0.34, 0.42, 0.5, 0.55, 0.7];
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

async function waitForSequence(page) {
    await page.waitForSelector('#session-7.active [data-parable-sequence]', { timeout: 20000 });
    await page.waitForFunction(function () {
        var root = document.querySelector('#session-7.active [data-parable-sequence]');
        if (!root) return false;
        var frames = Array.prototype.slice.call(root.querySelectorAll('.parable-sequence-frame'));
        return frames.length === 4 && frames.every(function (img) {
            return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        });
    }, { timeout: 20000 });
}

async function setSequenceProgress(page, targetProgress) {
    await page.evaluate(function (progress) {
        var el = document.querySelector('#session-7.active [data-parable-sequence]');
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

async function readSequenceState(page) {
    return page.evaluate(function (questionIds) {
        var session = document.querySelector('#session-7.active');
        var el = session && session.querySelector('[data-parable-sequence]');
        var frames = el ? Array.prototype.slice.call(el.querySelectorAll('.parable-sequence-frame')) : [];
        var parable = session && session.querySelector('.block-parable');
        var imageWrap = session && session.querySelector('.block-image');
        var topbar = document.querySelector('.lesson-topbar');
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        var contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
        var frameBoxes = frames.map(function (img) {
            var r = img.getBoundingClientRect();
            return {
                src: img.getAttribute('src') || '',
                alt: img.getAttribute('alt') || '',
                opacity: Number(img.style.opacity === '' ? window.getComputedStyle(img).opacity : img.style.opacity),
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                originalWidth: Number(img.getAttribute('width')),
                originalHeight: Number(img.getAttribute('height')),
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height
            };
        });
        var wrapBox = imageWrap ? imageWrap.getBoundingClientRect() : null;
        var parableBox = parable ? parable.getBoundingClientRect() : null;
        var dominant = 0;
        frameBoxes.forEach(function (frame, idx) {
            if (frame.opacity >= frameBoxes[dominant].opacity) dominant = idx;
        });
        var nextIsParable = !!(imageWrap && imageWrap.nextElementSibling &&
            imageWrap.nextElementSibling.classList.contains('block-parable'));
        var parableImgs = parable ? Array.from(parable.querySelectorAll('img')) : [];
        return {
            frameCount: frames.length,
            stops: el ? el.getAttribute('data-sequence-stops') : '',
            touchNext: !!(imageWrap && imageWrap.classList.contains('block-image-touch-next')),
            nextIsParable: nextIsParable,
            hasBwPair: !!(session && session.querySelector('.parable-img-bw, .parable-img-color')),
            parableHasImg: parableImgs.length > 0,
            parableTitle: parable ? (parable.querySelector('.block-parable-title, h2, h3') || parable).textContent : '',
            frames: frameBoxes,
            dominant: dominant,
            wrapHeight: wrapBox ? wrapBox.height : 0,
            wrapWidth: wrapBox ? wrapBox.width : 0,
            wrapTop: wrapBox ? wrapBox.top : null,
            wrapBottom: wrapBox ? wrapBox.bottom : null,
            contentTop: contentTop,
            viewportHeight: viewportHeight,
            parableTop: parableBox ? parableBox.top : null,
            questions: questionIds.map(function (id) {
                return !!document.getElementById('question-202-' + id);
            }),
            scrollWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
        };
    }, QUESTION_IDS);
}

function srcMatches(src, expected) {
    return typeof src === 'string' && assets[expected] && assets[expected].variants.some(function (variant) {
        return src.indexOf(variant.src) !== -1;
    });
}

(async function () {
    var browser = await chromium.launch({
        headless: true,
        channel: process.env.GT_BROWSER_CHANNEL || 'chrome'
    });
    var errors = [];
    var lastFrameNotes = [];

    for (var width of [375, 390, 1280]) {
        var page = await browser.newPage({ viewport: { width: width, height: width === 1280 ? 800 : 844 } });
        page.on('pageerror', function (err) { errors.push(width + ': ' + String(err)); });
        await page.goto(BASE + '#202-7', { waitUntil: 'domcontentloaded' });
        await waitForSequence(page);

        var rest = await readSequenceState(page);
        assert(width + ': four sequence frames render', rest.frameCount === 4, String(rest.frameCount));
        assert(width + ': sequence stops are 0,0.18,0.34,0.5', rest.stops === STOPS.join(','), rest.stops);
        assert(width + ': image keeps touchNext', rest.touchNext);
        assert(width + ': parable card follows the image', rest.nextIsParable);
        assert(width + ': old bw/color pair is not rendered', rest.hasBwPair === false);
        assert(
            width + ': parable title is Two Small Coins',
            rest.parableTitle && rest.parableTitle.indexOf('Two Small Coins') !== -1,
            rest.parableTitle
        );
        assert(
            width + ': parable does not contain a nested story image',
            rest.parableHasImg === false
        );
        FRAMES.forEach(function (expected, idx) {
            assert(
                width + ': frame ' + (idx + 1) + ' delivery copy matches ' + expected,
                rest.frames[idx] && srcMatches(rest.frames[idx].src, expected),
                rest.frames[idx] && rest.frames[idx].src
            );
        });
        var alt = rest.frames[0] && rest.frames[0].alt || '';
        assert(
            width + ': first frame alt names the widow, Jesus, and the offering chest',
            alt.indexOf('poor widow') !== -1 &&
                alt.indexOf('two small coins') !== -1 &&
                alt.indexOf('temple offering chest') !== -1 &&
                alt.indexOf('Jesus and His disciples') !== -1 &&
                alt.indexOf('watch from the steps') !== -1 &&
                alt.indexOf('rich men carry heavy bags of money') !== -1,
            alt
        );
        var sizesMatch = rest.frames.every(function (frame) {
            return frame.originalWidth === 1280 && frame.originalHeight === 720 &&
                Math.abs(frame.naturalWidth / frame.naturalHeight - 1280 / 720) < 0.01;
        });
        assert(width + ': all frames reserve 1280x720 with matching proportions', sizesMatch, JSON.stringify(rest.frames.map(function (f) {
            return [f.naturalWidth, f.naturalHeight, f.originalWidth, f.originalHeight];
        })));
        assert(width + ': all seven saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
        assert(width + ': page does not scroll sideways', rest.overflowX === false, rest.scrollWidth + ' > ' + rest.viewport);

        var heightAtStart = rest.wrapHeight;
        var order = [];
        var overlapShift = false;
        var lastStopVisible = false;
        var lastStopNote = '';
        for (var i = 0; i < SAMPLE_PROGRESS.length; i++) {
            await setSequenceProgress(page, SAMPLE_PROGRESS[i]);
            var sample = await readSequenceState(page);
            order.push({
                progress: SAMPLE_PROGRESS[i],
                dominant: sample.dominant,
                opacities: sample.frames.map(function (f) { return Number(f.opacity.toFixed(3)); })
            });
            if (Math.abs(sample.wrapHeight - heightAtStart) > 1.5) overlapShift = true;
            if (sample.parableTop !== null && sample.wrapBottom !== null && sample.parableTop + 1 < sample.wrapBottom) {
                overlapShift = true;
            }
            if (sample.parableTop !== null && sample.wrapBottom !== null) {
                var gap = sample.parableTop - sample.wrapBottom;
                if (gap > 2) overlapShift = true;
            }
            var firstBox = sample.frames[0];
            var stackedOk = sample.frames.slice(1).every(function (frame) {
                return Math.abs(frame.left - firstBox.left) < 1.5 &&
                    Math.abs(frame.width - firstBox.width) < 1.5 &&
                    Math.abs(frame.height - firstBox.height) < 1.5;
            });
            if (!stackedOk) overlapShift = true;
            if (SAMPLE_PROGRESS[i] === LAST_STOP) {
                var stillOnScreen = sample.wrapBottom !== null &&
                    sample.wrapBottom > sample.contentTop + 40 &&
                    sample.wrapTop !== null &&
                    sample.wrapTop < sample.viewportHeight;
                lastStopVisible = stillOnScreen;
                lastStopNote = 'wrapTop=' + sample.wrapTop +
                    ' wrapBottom=' + sample.wrapBottom +
                    ' contentTop=' + sample.contentTop +
                    ' viewportHeight=' + sample.viewportHeight;
            }
        }
        if (width === 390) {
            console.log('390 sequence samples: ' + JSON.stringify(order));
        }
        var atLastStop = order.find(function (row) { return row.progress === LAST_STOP; });
        var afterLastStop = order.find(function (row) { return row.progress === AFTER_LAST; });
        lastFrameNotes.push(
            width + '@' + LAST_STOP + ' opacities=' + JSON.stringify(atLastStop && atLastStop.opacities) +
            ' @' + AFTER_LAST + ' dominant=' + (afterLastStop && afterLastStop.dominant) +
            ' wrapHeight=' + heightAtStart +
            ' ' + lastStopNote
        );
        var monotonic = true;
        for (var j = 1; j < order.length; j++) {
            if (order[j].dominant < order[j - 1].dominant) monotonic = false;
        }
        var used = {};
        order.forEach(function (row) { used[row.dominant] = true; });
        var lastFrameInAtStop = atLastStop && atLastStop.opacities && atLastStop.opacities[3] >= 0.85;
        assert(width + ': frames advance in order as you scroll', monotonic, JSON.stringify(order));
        assert(width + ': all four frames become dominant', Object.keys(used).length === 4, JSON.stringify(order));
        assert(width + ': last frame is nearly opaque at stop ' + LAST_STOP, lastFrameInAtStop, JSON.stringify(atLastStop));
        assert(width + ': last frame is exclusive just after stop ' + LAST_STOP, afterLastStop && afterLastStop.dominant === 3, JSON.stringify(afterLastStop));
        assert(width + ': last frame is still on screen at the final stop', lastStopVisible, lastStopNote);
        assert(width + ': sequence does not shift or overlap surrounding content', overlapShift === false && heightAtStart > 100);

        await page.close();
    }

    var reduced = await browser.newPage({
        reducedMotion: 'reduce',
        viewport: { width: 390, height: 844 }
    });
    reduced.on('pageerror', function (err) { errors.push('reduced: ' + String(err)); });
    await reduced.goto(BASE + '#202-7', { waitUntil: 'domcontentloaded' });
    await waitForSequence(reduced);
    var reducedState = await readSequenceState(reduced);
    assert('reduced motion: four sequence frames render', reducedState.frameCount === 4, String(reducedState.frameCount));
    assert(
        'reduced motion: last frame is shown without scrolling',
        reducedState.frames[3] && reducedState.frames[3].opacity >= 0.95 &&
            reducedState.frames.slice(0, 3).every(function (frame) { return frame.opacity <= 0.05; }),
        JSON.stringify(reducedState.frames.map(function (f) { return Number(f.opacity.toFixed(3)); }))
    );
    assert(
        'reduced motion: last frame src is seq-4',
        reducedState.frames[3] && srcMatches(reducedState.frames[3].src, 'images/202-07-two-coins-seq-4.jpg'),
        reducedState.frames[3] && reducedState.frames[3].src
    );
    assert('reduced motion: touchNext joins the parable', reducedState.touchNext && reducedState.nextIsParable);
    assert('reduced motion: page does not scroll sideways', reducedState.overflowX === false,
        reducedState.scrollWidth + ' > ' + reducedState.viewport);
    await reduced.close();

    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    console.log('Last-frame timing: ' + lastFrameNotes.join('; '));
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-202-07 story-image browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
