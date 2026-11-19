#!/usr/bin/env node
/**
 * 203-01 Four Friends and a Roof story-image browser check.
 * Confirms the two roof-drop scroll frames load with a hold on frame 1,
 * a last unique landing frame at 0.8, advance in order, keep touchNext
 * on the parable card, honor reduced motion, and do not shift the page
 * at phone and laptop widths. Synthetic navigation only.
 */
'use strict';

var { chromium } = require('playwright');
var assets = require('./lesson-image-assets.js');

var BASE = process.env.L20301_STORY_BASE_URL || 'http://127.0.0.1:8765/index.html';
var FRAMES = [
    'images/203-01-roof-drop-seq-1.jpg',
    'images/203-01-roof-drop-seq-1.jpg',
    'images/203-01-roof-drop-seq-2.jpg'
];
var QUESTION_IDS = [
    '203-01-one',
    '203-01-helped',
    '203-01-4',
    '203-01-hand',
    '203-01-key',
    '203-01-step',
    '203-01-prayer'
];
var STOPS = [0, 0.16, 0.8];
var LAST_STOP = STOPS[STOPS.length - 1];
var AFTER_LAST = 0.85;
var SAMPLE_PROGRESS = [0, 0.08, 0.16, 0.4, 0.56, 0.8, 0.85];
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
        return frames.length === 3 && frames.every(function (img) {
            return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        });
    }, { timeout: 20000 });
}

async function setSequenceProgress(page, targetProgress) {
    async function nudge() {
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
            window.scrollBy({ top: rect.top - desiredTop, behavior: 'instant' });
        }, targetProgress);
    }
    await nudge();
    await page.waitForTimeout(40);
    await nudge();
    await page.waitForTimeout(80);
}

async function readSequenceState(page) {
    return page.evaluate(function (questionIds) {
        var session = document.querySelector('#session-1.active');
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
        var nextIsParable = !!(imageWrap && imageWrap.nextElementSibling &&
            imageWrap.nextElementSibling.classList.contains('block-parable'));
        var parableImgs = parable ? Array.from(parable.querySelectorAll('img')) : [];
        var dominant = 0;
        frameBoxes.forEach(function (frame, idx) {
            if (frame.opacity >= frameBoxes[dominant].opacity) dominant = idx;
        });
        var staticImages = session ? Array.prototype.slice.call(session.querySelectorAll('.block-image img'))
            .filter(function (img) { return !img.classList.contains('parable-sequence-frame'); })
            .map(function (img) { return img.getAttribute('src') || ''; }) : [];
        return {
            frameCount: frames.length,
            stops: el ? el.getAttribute('data-sequence-stops') : '',
            staticSequence: !!(el && el.classList.contains('parable-dissolve-static')),
            touchNext: !!(imageWrap && imageWrap.classList.contains('block-image-touch-next')),
            nextIsParable: nextIsParable,
            parableHasImg: parableImgs.length > 0,
            hasBwPair: !!(session && session.querySelector('.parable-img-bw, .parable-img-color')),
            frames: frameBoxes,
            dominant: dominant,
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
            staticImages: staticImages,
            storyJump: !!(imageWrap && imageWrap.getAttribute('data-jump') === 'story'),
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
        await page.goto(BASE + '#203-1', { waitUntil: 'domcontentloaded' });
        await waitForSequence(page);

        var rest = await readSequenceState(page);
        assert(width + ': three sequence frames render', rest.frameCount === 3, String(rest.frameCount));
        assert(width + ': sequence stops are 0,0.16,0.8', rest.stops === STOPS.join(','), rest.stops);
        assert(width + ': image keeps touchNext', rest.touchNext);
        assert(width + ': parable card follows the image', rest.nextIsParable);
        assert(
            width + ': parable title is Four Friends and a Roof',
            rest.parableTitle && rest.parableTitle.indexOf('Four Friends and a Roof') !== -1,
            rest.parableTitle
        );
        assert(
            width + ': parable does not contain a nested story image',
            rest.parableHasImg === false
        );
        assert(width + ': old bw/color pair is not rendered', rest.hasBwPair === false);
        assert(width + ': story jump target sits on the sequence', rest.storyJump);
        FRAMES.forEach(function (expected, idx) {
            assert(
                width + ': frame ' + (idx + 1) + ' delivery copy matches ' + expected,
                rest.frames[idx] && srcMatches(rest.frames[idx].src, expected),
                rest.frames[idx] && rest.frames[idx].src
            );
        });
        var alt = rest.frames[0] && rest.frames[0].alt || '';
        assert(
            width + ': first frame alt names the two roof-drop beats',
            alt.indexOf('hole in the roof') !== -1 &&
                alt.indexOf('paralyzed man on a mat') !== -1 &&
                alt.indexOf('high above the floor') !== -1 &&
                alt.indexOf('settling beside Jesus') !== -1 &&
                alt.indexOf('\u2014') === -1,
            alt
        );
        var sizesMatch = rest.frames.every(function (frame) {
            return frame.originalWidth === 1792 && frame.originalHeight === 1008 &&
                Math.abs(frame.naturalWidth / frame.naturalHeight - 1792 / 1008) < 0.01;
        });
        assert(width + ': all frames reserve 1792x1008 with matching proportions', sizesMatch, JSON.stringify(rest.frames.map(function (f) {
            return [f.naturalWidth, f.naturalHeight];
        })));
        assert(width + ': all seven saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
        assert(
            width + ': love-moves-out teaching image stays a separate static copy',
            rest.staticImages.some(function (src) { return src.indexOf('203-01-love-moves-out') !== -1; }),
            JSON.stringify(rest.staticImages)
        );
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
            var firstBox = sample.frames[0];
            var stackedOk = sample.frames.slice(1).every(function (frame) {
                return Math.abs(frame.left - firstBox.left) < 1.5 &&
                    Math.abs(frame.width - firstBox.width) < 1.5 &&
                    Math.abs(frame.height - firstBox.height) < 1.5;
            });
            if (!stackedOk) overlapShift = true;
            if (sample.parableTop !== null && sample.wrapBottom !== null) {
                var gap = sample.parableTop - sample.wrapBottom;
                if (gap > 2) overlapShift = true;
            }
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
        var lastFrameInAtStop = atLastStop && atLastStop.opacities && atLastStop.opacities[2] >= 0.85;
        assert(width + ': frames advance in order as you scroll', monotonic, JSON.stringify(order));
        assert(width + ': all three frames become dominant', Object.keys(used).length === 3, JSON.stringify(order));
        assert(width + ': last frame is nearly opaque at stop ' + LAST_STOP, lastFrameInAtStop, JSON.stringify(atLastStop));
        assert(width + ': last frame is exclusive just after stop ' + LAST_STOP, afterLastStop && afterLastStop.dominant === 2, JSON.stringify(afterLastStop));
        assert(width + ': last frame is still on screen at the final stop', lastStopVisible, lastStopNote);
        assert(width + ': touchNext joins the parable card without layout shift', overlapShift === false && heightAtStart > 100);
        var atHoldEnd = order.find(function (row) { return row.progress === 0.16; });
        var midDissolve = order.find(function (row) { return row.progress === 0.4; });
        var lateDissolve = order.find(function (row) { return row.progress === 0.56; });
        var seq1AtHold = atHoldEnd && atHoldEnd.opacities &&
            (atHoldEnd.opacities[0] >= 0.85 || atHoldEnd.opacities[1] >= 0.85) &&
            atHoldEnd.opacities[2] < 0.15;
        var seq2Mid = midDissolve && midDissolve.opacities && midDissolve.opacities[2];
        var seq2Late = lateDissolve && lateDissolve.opacities && lateDissolve.opacities[2];
        assert(width + ': seq-1 still holds at 0.16 before the last dissolve', seq1AtHold, JSON.stringify(atHoldEnd));
        assert(width + ': last dissolve is underway at 0.4', seq2Mid > 0.15 && seq2Mid < 0.55, JSON.stringify(midDissolve));
        assert(width + ': last dissolve is further along at 0.56', seq2Late > 0.45 && seq2Late < 0.80, JSON.stringify(lateDissolve));
        if (width === 390) {
            assert('390: last dissolve spans 0.16 to 0.8 from seq-1 to seq-2', seq2Mid < seq2Late, 'mid=' + seq2Mid + ' late=' + seq2Late);
        }

        await page.close();
    }

    var reduced = await browser.newPage({
        reducedMotion: 'reduce',
        viewport: { width: 390, height: 844 }
    });
    reduced.on('pageerror', function (err) { errors.push('reduced: ' + String(err)); });
    await reduced.goto(BASE + '#203-1', { waitUntil: 'domcontentloaded' });
    await waitForSequence(reduced);
    var reducedState = await readSequenceState(reduced);
    assert('reduced motion: sequence root renders', reducedState.frameCount === 3, String(reducedState.frameCount));
    assert(
        'reduced motion: last frame shown without scrolling',
        reducedState.staticSequence &&
            reducedState.frames[2] &&
            reducedState.frames[2].opacity >= 0.95 &&
            reducedState.frames.slice(0, 2).every(function (frame) { return frame.opacity <= 0.05; }),
        JSON.stringify({
            staticSequence: reducedState.staticSequence,
            opacities: reducedState.frames.map(function (f) { return Number(f.opacity.toFixed(3)); })
        })
    );
    assert(
        'reduced motion: last frame still loads the roof-drop sequence',
        reducedState.frames[2] && reducedState.frames[2].naturalWidth > 0 &&
            srcMatches(reducedState.frames[2].src, 'images/203-01-roof-drop-seq-2.jpg'),
        reducedState.frames[2] && reducedState.frames[2].src
    );
    assert('reduced motion: old bw/color pair is not rendered', reducedState.hasBwPair === false);
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
    console.log('\n' + passed + ' L-203-01 story-image browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
