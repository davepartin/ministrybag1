#!/usr/bin/env node
/**
 * 203-07 Jesus Sends the 72 story-image browser check.
 * Confirms Dave's original loose sketch shows on the parable card,
 * that no Pattern B dissolve block remains, and that the charcoal
 * pair from #169 is not rendered. Synthetic navigation only.
 */
'use strict';

var { chromium } = require('playwright');

var BASE = process.env.L20307_STORY_BASE_URL || 'http://127.0.0.1:8765/index.html';
var QUESTION_IDS = [
    '203-07-1',
    '203-07-2',
    '203-07-3',
    '203-07-hand',
    '203-07-key',
    '203-07-step',
    '203-07-prayer'
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
    return typeof src === 'string' && src.indexOf(expected) !== -1;
}

async function waitForParableSketch(page) {
    await page.waitForSelector('#session-7.active .block-parable img', { timeout: 20000 });
    await page.waitForFunction(function () {
        var img = document.querySelector('#session-7.active .block-parable img');
        if (!img) return false;
        var src = img.getAttribute('src') || img.getAttribute('data-lesson-src') || img.currentSrc || '';
        return img.complete && img.naturalWidth > 0 && src.indexOf('jesus-sends-72') !== -1;
    }, { timeout: 20000 });
}

async function readSketchState(page) {
    return page.evaluate(function (questionIds) {
        var session = document.querySelector('#session-7.active');
        var parable = session && session.querySelector('.block-parable');
        var parableImg = parable && parable.querySelector('img');
        var dissolve = session && session.querySelector('[data-parable-dissolve]');
        var bw = session && session.querySelector('.parable-img-bw');
        var color = session && session.querySelector('.parable-img-color');
        var imageWrap = session && session.querySelector('.block-image');
        function srcOf(img) {
            if (!img) return '';
            return img.getAttribute('src') || img.getAttribute('data-lesson-src') || img.currentSrc || '';
        }
        var allSrc = session ? Array.from(session.querySelectorAll('img')).map(srcOf) : [];
        var box = null;
        if (parableImg) {
            var r = parableImg.getBoundingClientRect();
            box = {
                src: srcOf(parableImg),
                currentSrc: parableImg.currentSrc || '',
                alt: parableImg.getAttribute('alt') || '',
                naturalWidth: parableImg.naturalWidth,
                naturalHeight: parableImg.naturalHeight,
                widthAttr: parableImg.getAttribute('width') || '',
                heightAttr: parableImg.getAttribute('height') || '',
                width: r.width,
                height: r.height
            };
        }
        return {
            hasSession: !!session,
            hasDissolve: !!dissolve,
            hasBwLayer: !!bw,
            hasColorLayer: !!color,
            hasStandaloneImage: !!imageWrap,
            parableTitle: parable ? (parable.querySelector('.block-parable-title') || parable).textContent : '',
            parableImgCount: parable ? parable.querySelectorAll('img').length : 0,
            sketch: box,
            allSrc: allSrc,
            questions: questionIds.map(function (id) {
                return !!document.getElementById('question-203-' + id);
            }),
            scrollWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
            overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
        };
    }, QUESTION_IDS);
}

function sketchIsOriginal(sample) {
    if (!sample.sketch) return false;
    var src = sample.sketch.src + ' ' + sample.sketch.currentSrc;
    return srcMatches(src, 'jesus-sends-72') &&
        !srcMatches(src, '203-07-sends-72');
}

function sessionHasCharcoalPair(sample) {
    return sample.allSrc.some(function (src) {
        return srcMatches(src, '203-07-sends-72');
    });
}

(async function () {
    var browser = await chromium.launch({
        headless: true,
        channel: process.env.GT_BROWSER_CHANNEL || 'chrome'
    });
    var errors = [];

    for (var width of [375, 390, 1280]) {
        var page = await browser.newPage({ viewport: { width: width, height: width === 1280 ? 800 : 844 } });
        page.on('pageerror', function (err) { errors.push(width + ': ' + String(err)); });
        await page.goto(BASE + '#203-7', { waitUntil: 'domcontentloaded' });
        await waitForParableSketch(page);

        var rest = await readSketchState(page);
        assert(width + ': lesson 7 session is active', rest.hasSession);
        assert(width + ': no dissolve block remains', rest.hasDissolve === false);
        assert(width + ': no black-and-white dissolve layer', rest.hasBwLayer === false);
        assert(width + ': no color dissolve layer', rest.hasColorLayer === false);
        assert(width + ': no standalone image block before the parable', rest.hasStandaloneImage === false);
        assert(
            width + ': parable title is Jesus Sends the 72',
            rest.parableTitle && rest.parableTitle.indexOf('Jesus Sends the 72') !== -1,
            rest.parableTitle
        );
        assert(width + ': parable card shows one image', rest.parableImgCount === 1, String(rest.parableImgCount));
        assert(
            width + ': parable image is the original jesus-sends-72 sketch',
            sketchIsOriginal(rest),
            rest.sketch && (rest.sketch.src + ' | ' + rest.sketch.currentSrc)
        );
        assert(
            width + ': charcoal dissolve files are not rendered',
            sessionHasCharcoalPair(rest) === false,
            JSON.stringify(rest.allSrc)
        );
        assert(
            width + ': alt is Jesus Sends the 72',
            rest.sketch && rest.sketch.alt === 'Jesus Sends the 72',
            rest.sketch && rest.sketch.alt
        );
        assert(
            width + ': original sketch loads with reserved 1203x675 size',
            rest.sketch &&
                rest.sketch.widthAttr === '1203' && rest.sketch.heightAttr === '675' &&
                rest.sketch.naturalWidth > 0 && rest.sketch.naturalHeight > 0 &&
                Math.abs((rest.sketch.naturalWidth / rest.sketch.naturalHeight) - (1203 / 675)) < 0.02,
            rest.sketch && JSON.stringify({
                naturalWidth: rest.sketch.naturalWidth,
                naturalHeight: rest.sketch.naturalHeight,
                widthAttr: rest.sketch.widthAttr,
                heightAttr: rest.sketch.heightAttr,
                display: [rest.sketch.width, rest.sketch.height]
            })
        );
        assert(width + ': sketch is visible on the parable card', rest.sketch && rest.sketch.height > 80);
        assert(width + ': all seven saved-answer IDs render', rest.questions.every(Boolean), JSON.stringify(rest.questions));
        assert(width + ': page does not scroll sideways', rest.overflowX === false, rest.scrollWidth + ' > ' + rest.viewport);
        await page.close();
    }

    var reduced = await browser.newPage({
        reducedMotion: 'reduce',
        viewport: { width: 390, height: 844 }
    });
    reduced.on('pageerror', function (err) { errors.push('reduced: ' + String(err)); });
    await reduced.goto(BASE + '#203-7', { waitUntil: 'domcontentloaded' });
    await waitForParableSketch(reduced);
    var reducedState = await readSketchState(reduced);
    assert('reduced motion: no dissolve block remains', reducedState.hasDissolve === false);
    assert(
        'reduced motion: original sketch still shows on the parable',
        sketchIsOriginal(reducedState) && reducedState.sketch && reducedState.sketch.naturalWidth > 0,
        reducedState.sketch && (reducedState.sketch.src + ' | ' + reducedState.sketch.currentSrc)
    );
    assert(
        'reduced motion: charcoal dissolve files are not rendered',
        sessionHasCharcoalPair(reducedState) === false,
        JSON.stringify(reducedState.allSrc)
    );
    assert('reduced motion: page does not scroll sideways', reducedState.overflowX === false,
        reducedState.scrollWidth + ' > ' + reducedState.viewport);
    await reduced.close();

    assert('no page exceptions', errors.length === 0, errors.slice(0, 2).join(' | '));
    await browser.close();
    if (failed) {
        console.error('\n' + failed + ' browser check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' L-203-07 story-image browser checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
