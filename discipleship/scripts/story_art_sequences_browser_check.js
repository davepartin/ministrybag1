#!/usr/bin/env node
/**
 * Browser verification for all four new story-art scroll sequences:
 * 101-07, 201-05, 203-02, and 203-07.
 * Verifies responsive frame loading, monotonic scroll cross-fade,
 * final frame visibility, touchNext card attachment without layout shift,
 * prefers-reduced-motion fallback, and preserved saved-answer IDs
 * across 375px, 390px, and 1280px viewports.
 */
'use strict';

var { chromium } = require('playwright');
var assets = require('./lesson-image-assets.js');

var BASE = process.env.GT_STORY_SEQ_BASE_URL || 'http://127.0.0.1:8765/index.html';

var LESSONS = [
    {
        hash: '#101-7',
        sessionSel: '#session-7.active',
        series: '101',
        parableTitle: 'The Shepherd Who Comes Looking',
        expectedW: 1280,
        expectedH: 720,
        frames: [
            'images/101-07-story-seq-1.jpg',
            'images/101-07-story-seq-2.jpg',
            'images/101-07-story-seq-3.jpg',
            'images/101-07-story-seq-4.jpg'
        ],
        stops: [0, 0.18, 0.34, 0.5],
        samples: [0, 0.09, 0.18, 0.26, 0.34, 0.42, 0.5, 0.55, 0.7],
        questionIds: ['7-1', '7-3', '7-hand', '7-6', '7-key', '7-step', '7-devos', '7-prayer']
    },
    {
        hash: '#201-5',
        sessionSel: '#session-5.active',
        series: '201',
        parableTitle: 'The Longest Song',
        expectedW: 1280,
        expectedH: 720,
        frames: [
            'images/201-05-story-seq-1.jpg',
            'images/201-05-story-seq-2.jpg'
        ],
        stops: [0, 0.4],
        samples: [0, 0.15, 0.28, 0.4, 0.48, 0.65],
        questionIds: ['201-05-found', '201-05-2', '201-05-3', '201-05-key', '201-05-step', '201-05-prayer']
    },
    {
        hash: '#203-2',
        sessionSel: '#session-2.active',
        series: '203',
        parableTitle: 'A Prayer Before the Answer',
        expectedW: 1280,
        expectedH: 720,
        frames: [
            'images/203-02-story-seq-1.jpg',
            'images/203-02-story-seq-2.jpg',
            'images/203-02-story-seq-3.jpg'
        ],
        stops: [0, 0.25, 0.45],
        samples: [0, 0.12, 0.25, 0.35, 0.45, 0.52, 0.68],
        questionIds: ['203-02-story', '203-02-1', '203-02-rhythm', '203-02-7', '203-02-key', '203-02-step', '203-02-prayer']
    },
    {
        hash: '#203-7',
        sessionSel: '#session-7.active',
        series: '203',
        parableTitle: 'Jesus Sends the 72',
        expectedW: 1203,
        expectedH: 675,
        frames: [
            'images/203-07-story-seq-1.jpg',
            'images/203-07-story-seq-2.jpg',
            'images/203-07-story-seq-3.jpg',
            'images/203-07-story-seq-4.jpg'
        ],
        stops: [0, 0.18, 0.34, 0.5],
        samples: [0, 0.09, 0.18, 0.26, 0.34, 0.42, 0.5, 0.55, 0.7],
        questionIds: ['203-07-1', '203-07-2', '203-07-3', '203-07-hand', '203-07-key', '203-07-step', '203-07-prayer']
    }
];

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

function srcMatches(src, expected) {
    return typeof src === 'string' && assets[expected] && assets[expected].variants.some(function (variant) {
        return src.indexOf(variant.src) !== -1;
    });
}

async function waitForSequence(page, cfg) {
    await page.waitForSelector(cfg.sessionSel + ' [data-parable-sequence]', { timeout: 20000 });
    await page.waitForFunction(function (args) {
        var root = document.querySelector(args.sessionSel + ' [data-parable-sequence]');
        if (!root) return false;
        var frames = Array.prototype.slice.call(root.querySelectorAll('.parable-sequence-frame'));
        return frames.length === args.count && frames.every(function (img) {
            return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        });
    }, { sessionSel: cfg.sessionSel, count: cfg.frames.length }, { timeout: 20000 });
}

async function setSequenceProgress(page, cfg, targetProgress) {
    await page.evaluate(function (args) {
        var el = document.querySelector(args.sessionSel + ' [data-parable-sequence]');
        var topbar = document.querySelector('.lesson-topbar');
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        var contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
        var visibleHeight = Math.max(viewportHeight - contentTop, 1);
        var fadeStartY = contentTop + (visibleHeight * 0.40);
        var fadeEndY = contentTop + (visibleHeight * -0.22);
        var fadeRange = Math.max(fadeStartY - fadeEndY, 1);
        var rect = el.getBoundingClientRect();
        window.scrollBy({ top: rect.top - (fadeStartY - args.progress * fadeRange), behavior: 'instant' });
    }, { sessionSel: cfg.sessionSel, progress: targetProgress });
    await page.waitForTimeout(80);
}

async function readSequenceState(page, cfg) {
    return page.evaluate(function (args) {
        var session = document.querySelector(args.sessionSel);
        var el = session && session.querySelector('[data-parable-sequence]');
        var frames = el ? Array.prototype.slice.call(el.querySelectorAll('.parable-sequence-frame')) : [];
        var imageWrap = el ? el.closest('.block-image') : null;
        var parable = imageWrap && imageWrap.nextElementSibling && imageWrap.nextElementSibling.classList.contains('block-parable')
            ? imageWrap.nextElementSibling : null;
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
            nextIsParable: !!parable,
            parableTitle: parable ? (parable.querySelector('.block-parable-title, h2, h3') || parable).textContent : '',
            frames: frameBoxes,
            dominant: dominant,
            wrapHeight: wrapBox ? wrapBox.height : 0,
            wrapTop: wrapBox ? wrapBox.top : null,
            wrapBottom: wrapBox ? wrapBox.bottom : null,
            contentTop: contentTop,
            viewportHeight: viewportHeight,
            parableTop: parableBox ? parableBox.top : null,
            questions: args.questionIds.map(function (id) {
                return !!document.getElementById('question-' + args.series + '-' + id);
            }),
            scrollWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
        };
    }, { sessionSel: cfg.sessionSel, series: cfg.series, questionIds: cfg.questionIds });
}

(async function () {
    var browser = await chromium.launch({
        headless: true,
        channel: process.env.GT_BROWSER_CHANNEL || 'chrome'
    });
    var errors = [];

    for (var cfg of LESSONS) {
        var lastStop = cfg.stops[cfg.stops.length - 1];
        var lastIdx = cfg.frames.length - 1;

        for (var width of [375, 390, 1280]) {
            var page = await browser.newPage({ viewport: { width: width, height: width === 1280 ? 800 : 844 } });
            page.on('pageerror', function (err) { errors.push(cfg.hash + '@' + width + ': ' + String(err)); });
            await page.goto(BASE + cfg.hash, { waitUntil: 'domcontentloaded' });
            await waitForSequence(page, cfg);

            var rest = await readSequenceState(page, cfg);
            var tag = cfg.hash + ' ' + width + 'px: ';
            assert(tag + 'expected frame count renders', rest.frameCount === cfg.frames.length, String(rest.frameCount));
            assert(tag + 'stops match', rest.stops === cfg.stops.join(','), rest.stops);
            assert(tag + 'touchNext joins parable card', rest.touchNext && rest.nextIsParable);
            assert(tag + 'parable title matches', rest.parableTitle.indexOf(cfg.parableTitle) !== -1, rest.parableTitle);
            assert(tag + 'saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
            assert(tag + 'no horizontal overflow', rest.overflowX === false, rest.scrollWidth + ' > ' + rest.viewport);
            cfg.frames.forEach(function (expected, idx) {
                assert(tag + 'frame ' + (idx + 1) + ' delivery copy loads', rest.frames[idx] && srcMatches(rest.frames[idx].src, expected));
            });
            var sizesMatch = rest.frames.every(function (frame) {
                return frame.originalWidth === cfg.expectedW && frame.originalHeight === cfg.expectedH &&
                    Math.abs(frame.naturalWidth / frame.naturalHeight - cfg.expectedW / cfg.expectedH) < 0.015;
            });
            assert(tag + 'reserved dimensions match aspect', sizesMatch);

            var heightAtStart = rest.wrapHeight;
            var order = [];
            var overlapShift = false;
            var lastStopVisible = false;
            for (var i = 0; i < cfg.samples.length; i++) {
                await setSequenceProgress(page, cfg, cfg.samples[i]);
                var sample = await readSequenceState(page, cfg);
                order.push({
                    progress: cfg.samples[i],
                    dominant: sample.dominant,
                    opacities: sample.frames.map(function (f) { return Number(f.opacity.toFixed(3)); })
                });
                if (Math.abs(sample.wrapHeight - heightAtStart) > 1.5) overlapShift = true;
                if (sample.parableTop !== null && sample.wrapBottom !== null &&
                    (sample.parableTop + 1 < sample.wrapBottom || sample.parableTop - sample.wrapBottom > 2)) {
                    overlapShift = true;
                }
                var firstBox = sample.frames[0];
                var stackedOk = sample.frames.slice(1).every(function (f) {
                    return Math.abs(f.left - firstBox.left) < 1.5 &&
                        Math.abs(f.width - firstBox.width) < 1.5 &&
                        Math.abs(f.height - firstBox.height) < 1.5;
                });
                if (!stackedOk) overlapShift = true;
                if (cfg.samples[i] === lastStop) {
                    lastStopVisible = sample.wrapBottom !== null &&
                        sample.wrapBottom > sample.contentTop + 40 &&
                        sample.wrapTop !== null &&
                        sample.wrapTop < sample.viewportHeight;
                }
            }
            var monotonic = true;
            for (var j = 1; j < order.length; j++) {
                if (order[j].dominant < order[j - 1].dominant) monotonic = false;
            }
            var used = {};
            order.forEach(function (row) { used[row.dominant] = true; });
            var atLastStop = order.find(function (row) { return row.progress === lastStop; });
            assert(tag + 'frames advance monotonically', monotonic, JSON.stringify(order));
            assert(tag + 'all frames become dominant', Object.keys(used).length === cfg.frames.length, JSON.stringify(order));
            assert(tag + 'last frame reaches >=0.85 opacity at final stop', atLastStop && atLastStop.opacities[lastIdx] >= 0.85, JSON.stringify(atLastStop));
            assert(tag + 'last frame stays on screen at final stop', lastStopVisible);
            assert(tag + 'no layout shift or overlap', overlapShift === false && heightAtStart > 100);
            await page.close();
        }

        var reduced = await browser.newPage({
            reducedMotion: 'reduce',
            viewport: { width: 390, height: 844 }
        });
        reduced.on('pageerror', function (err) { errors.push(cfg.hash + '@reduced: ' + String(err)); });
        await reduced.goto(BASE + cfg.hash, { waitUntil: 'domcontentloaded' });
        await waitForSequence(reduced, cfg);
        var reducedState = await readSequenceState(reduced, cfg);
        assert(cfg.hash + ' reduced motion: final frame shown statically',
            reducedState.frames[lastIdx] && reducedState.frames[lastIdx].opacity >= 0.95 &&
            reducedState.frames.slice(0, lastIdx).every(function (f) { return f.opacity <= 0.05; }));
        assert(cfg.hash + ' reduced motion: touchNext intact', reducedState.touchNext && reducedState.nextIsParable);
        await reduced.close();
    }

    assert('no page exceptions', errors.length === 0, errors.slice(0, 3).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' story-art sequence browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
