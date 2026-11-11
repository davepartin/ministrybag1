#!/usr/bin/env node
/**
 * 201-01 running-father sequence browser check.
 * Confirms the four scroll frames load, advance in order, keep
 * saved-answer IDs, and do not shift the page at phone and laptop
 * widths. Synthetic navigation only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20101_BASE_URL || 'http://127.0.0.1:8765/index.html';
var FRAMES = [
    'images/running-father-seq-1.jpg',
    'images/running-father-seq-2.jpg',
    'images/running-father-seq-3.jpg',
    'images/running-father-seq-4.jpg'
];
var QUESTION_IDS = [
    '201-01-1',
    '201-01-2',
    '201-01-3',
    '201-01-key',
    '201-01-step',
    '201-01-prayer'
];
var STOPS = [0, 0.18, 0.34, 0.5];
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
    await page.waitForSelector('#session-1.active [data-parable-sequence]', { timeout: 20000 });
    await page.waitForFunction(function () {
        var root = document.querySelector('#session-1.active [data-parable-sequence]');
        if (!root) return false;
        var frames = Array.prototype.slice.call(root.querySelectorAll('.parable-sequence-frame'));
        return frames.length === 4 && frames.every(function (img) {
            return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        });
    }, { timeout: 20000 });
}

async function setSequenceProgress(page, targetProgress) {
    await page.evaluate(function (progress) {
        var el = document.querySelector('#session-1.active [data-parable-sequence]');
        var topbar = document.querySelector('.lesson-topbar');
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        var contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
        var visibleHeight = Math.max(viewportHeight - contentTop, 1);
        var fadeStartY = contentTop + (visibleHeight * 0.40);
        var fadeEndY = contentTop + (visibleHeight * -0.22);
        var fadeRange = Math.max(fadeStartY - fadeEndY, 1);
        var rect = el.getBoundingClientRect();
        var desiredTop = fadeStartY - progress * fadeRange;
        window.scrollBy(0, rect.top - desiredTop);
    }, targetProgress);
    await page.waitForTimeout(80);
}

async function readSequenceState(page) {
    return page.evaluate(function (questionIds) {
        var session = document.querySelector('#session-1.active');
        var el = session && session.querySelector('[data-parable-sequence]');
        var frames = el ? Array.prototype.slice.call(el.querySelectorAll('.parable-sequence-frame')) : [];
        var parable = session && session.querySelector('.block-parable');
        var imageWrap = session && session.querySelector('.block-image');
        var frameBoxes = frames.map(function (img) {
            var r = img.getBoundingClientRect();
            return {
                src: img.getAttribute('src') || '',
                alt: img.getAttribute('alt') || '',
                opacity: Number(img.style.opacity === '' ? window.getComputedStyle(img).opacity : img.style.opacity),
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
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
        return {
            frameCount: frames.length,
            stops: el ? el.getAttribute('data-sequence-stops') : '',
            touchNext: !!(imageWrap && imageWrap.classList.contains('block-image-touch-next')),
            hasBwPair: !!(session && session.querySelector('.parable-img-bw, .parable-img-color')),
            frames: frameBoxes,
            dominant: dominant,
            wrapHeight: wrapBox ? wrapBox.height : 0,
            wrapWidth: wrapBox ? wrapBox.width : 0,
            parableTop: parableBox ? parableBox.top : null,
            wrapBottom: wrapBox ? wrapBox.bottom : null,
            questions: questionIds.map(function (id) {
                return !!document.getElementById('question-201-' + id);
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
    var lastFrameNotes = [];

    for (var width of [375, 390, 1280]) {
        var page = await browser.newPage({ viewport: { width: width, height: width === 1280 ? 800 : 844 } });
        page.on('pageerror', function (err) { errors.push(width + ': ' + String(err)); });
        await page.goto(BASE + '#201-1', { waitUntil: 'domcontentloaded' });
        await waitForSequence(page);

        var rest = await readSequenceState(page);
        assert(width + ': four sequence frames render', rest.frameCount === 4, String(rest.frameCount));
        assert(width + ': sequence stops are 0,0.18,0.34,0.5', rest.stops === STOPS.join(','), rest.stops);
        assert(width + ': image keeps touchNext', rest.touchNext);
        assert(width + ': old bw/color pair is not rendered', rest.hasBwPair === false);
        FRAMES.forEach(function (expected, idx) {
            assert(
                width + ': frame ' + (idx + 1) + ' src is ' + expected,
                rest.frames[idx] && srcMatches(rest.frames[idx].src, expected),
                rest.frames[idx] && rest.frames[idx].src
            );
        });
        assert(
            width + ': first frame alt describes the run',
            rest.frames[0] && rest.frames[0].alt.indexOf('father running') !== -1,
            rest.frames[0] && rest.frames[0].alt
        );
        var sizesMatch = rest.frames.every(function (frame) {
            return frame.naturalWidth === 1248 && frame.naturalHeight === 832;
        });
        assert(width + ': all frames are 1248x832', sizesMatch, JSON.stringify(rest.frames.map(function (f) {
            return [f.naturalWidth, f.naturalHeight];
        })));
        assert(width + ': all six saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
        assert(width + ': page does not scroll sideways', rest.overflowX === false, rest.scrollWidth + ' > ' + rest.viewport);

        var heightAtStart = rest.wrapHeight;
        var order = [];
        var overlapShift = false;
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
            var firstBox = sample.frames[0];
            var stackedOk = sample.frames.slice(1).every(function (frame) {
                return Math.abs(frame.left - firstBox.left) < 1.5 &&
                    Math.abs(frame.width - firstBox.width) < 1.5 &&
                    Math.abs(frame.height - firstBox.height) < 1.5;
            });
            if (!stackedOk) overlapShift = true;
        }
        if (width === 390) {
            console.log('390 sequence samples: ' + JSON.stringify(order));
        }
        var atLastStop = order.find(function (row) { return row.progress === 0.5; });
        var afterLastStop = order.find(function (row) { return row.progress === 0.55; });
        lastFrameNotes.push(
            width + '@0.5 opacities=' + JSON.stringify(atLastStop && atLastStop.opacities) +
            ' @0.55 dominant=' + (afterLastStop && afterLastStop.dominant)
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
        assert(width + ': last frame is nearly opaque at stop 0.5', lastFrameInAtStop, JSON.stringify(atLastStop));
        assert(width + ': last frame is exclusive just after stop 0.5', afterLastStop && afterLastStop.dominant === 3, JSON.stringify(afterLastStop));
        assert(width + ': sequence does not shift or overlap surrounding content', overlapShift === false);

        await page.close();
    }

    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    console.log('Last-frame timing: ' + lastFrameNotes.join('; '));
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-201-01 sequence browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
