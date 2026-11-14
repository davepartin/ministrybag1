#!/usr/bin/env node
/**
 * Browser verification for widgets/trust-the-artist.html (WIDGET-202-05-MOSAIC).
 * Checks 375, 390, and 1280px viewports, all 6 steps and zoom viewBoxes,
 * Back restoration, reduced-motion instant states, idle DOM stability,
 * button touch targets, and zero horizontal overflow or console/page errors.
 */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var { chromium } = require('playwright');

var ROOT = path.resolve(__dirname, '..');
var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

var EXPECTED_HEADINGS = [
  '',
  'The Pain Is Real',
  'You Cannot See It All Yet',
  'God Sees the Whole',
  'The Darkest Piece',
  'Trust the Creator'
];

var EXPECTED_VB_WIDTHS = [60, 124, 178, 440, 440, 440];

var passed = 0;
var failed = 0;

function assert(name, ok, detail) {
  if (ok) {
    passed += 1;
    console.log('PASS: ' + name);
  } else {
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
  }
}

function startLocalServer() {
  return new Promise(function (resolve) {
    var server = http.createServer(function (req, res) {
      var clean = (req.url || '/').split('?')[0];
      var filePath = path.resolve(ROOT, clean.replace(/^\/+/, ''));
      if (!filePath.startsWith(ROOT + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      var ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', function () {
      resolve(server);
    });
  });
}

function parseVBWidth(vb) {
  if (!vb) return 0;
  var parts = vb.trim().split(/\s+/).map(Number);
  return parts.length === 4 ? parts[2] : 0;
}

async function runViewportCheck(browser, url, width, height) {
  var tag = width + 'x' + height;
  var context = await browser.newContext({ viewport: { width: width, height: height } });
  var page = await context.newPage();
  var errors = [];
  page.on('pageerror', function (err) { errors.push(String(err)); });
  page.on('console', function (msg) {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  var cardHeights = [];
  for (var s = 0; s <= 5; s++) {
    if (s > 0) {
      await page.click('#next-btn');
      await page.waitForTimeout(s === 4 ? 1950 : 1050);
    }
    var state = await page.evaluate(function () {
      var svg = document.getElementById('mosaic-svg');
      var widget = document.getElementById('widget');
      var card = document.getElementById('card-content');
      var nextBtn = document.getElementById('next-btn');
      var prevBtn = document.getElementById('prev-btn');
      var shownShards = document.querySelectorAll('.shard-wrap.is-shown').length;
      var totalShards = document.querySelectorAll('.shard-wrap').length;
      var dotMinH = Array.from(document.querySelectorAll('.step-dot-btn')).reduce(function (m, b) {
        return Math.min(m, b.getBoundingClientRect().height);
      }, 999);
      return {
        step: Number(widget.getAttribute('data-step')),
        vb: svg.getAttribute('viewBox'),
        isColor: svg.classList.contains('is-color'),
        isGlow: svg.classList.contains('is-glow'),
        pieceStroke: getComputedStyle(document.querySelector('.piece-poly')).stroke,
        shownShards: shownShards,
        totalShards: totalShards,
        heading: document.getElementById('card-heading').textContent,
        text: document.getElementById('card-text').textContent,
        cardH: Math.round(card.getBoundingClientRect().height),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        nextH: Math.round(nextBtn.getBoundingClientRect().height),
        prevH: Math.round(prevBtn.getBoundingClientRect().height),
        dotMinH: Math.round(dotMinH),
        svgTitle: document.getElementById('svg-title').textContent,
        svgDesc: document.getElementById('svg-desc').textContent
      };
    });

    assert(tag + ' step ' + s + ' active', state.step === s, 'got ' + state.step);
    assert(tag + ' step ' + s + ' shard count in 120-200', state.totalShards >= 120 && state.totalShards <= 200, String(state.totalShards));
    assert(tag + ' step ' + s + ' zoom viewBox width', Math.abs(parseVBWidth(state.vb) - EXPECTED_VB_WIDTHS[s]) < 0.2, state.vb);
    assert(tag + ' step ' + s + ' heading matches', state.heading === EXPECTED_HEADINGS[s], state.heading);
    assert(tag + ' step ' + s + ' no horizontal overflow', !state.overflow);
    assert(tag + ' step ' + s + ' button touch targets >= 44px', state.nextH >= 44 && state.prevH >= 44 && state.dotMinH >= 44,
      [state.prevH, state.nextH, state.dotMinH].join(','));
    assert(tag + ' step ' + s + ' grey before step 4 / color on 4-5', s < 4 ? !state.isColor : state.isColor);
    assert(tag + ' step ' + s + ' glow only on step 5', s < 5 ? !state.isGlow : state.isGlow);
    assert(tag + ' step ' + s + ' piece outline gold on 0-4 / dark lead on 5',
      s < 5 ? state.pieceStroke === 'rgb(201, 154, 46)' : state.pieceStroke === 'rgb(44, 36, 22)',
      state.pieceStroke);
    assert(tag + ' step ' + s + ' accessible title/desc present', state.svgTitle.length > 0 && state.svgDesc.length > 0);
    cardHeights.push(state.cardH);
  }

  var minCard = Math.min.apply(null, cardHeights);
  var maxCard = Math.max.apply(null, cardHeights);
  assert(tag + ' stable card height across steps', minCard === maxCard, cardHeights.join(','));

  // Test Back restores step 4 instantly
  await page.click('#prev-btn');
  await page.waitForTimeout(40);
  var back4 = await page.evaluate(function () {
    var svg = document.getElementById('mosaic-svg');
    return {
      step: Number(document.getElementById('widget').getAttribute('data-step')),
      isColor: svg.classList.contains('is-color'),
      isGlow: svg.classList.contains('is-glow')
    };
  });
  assert(tag + ' Back from 5 restores step 4 instantly', back4.step === 4 && back4.isColor && !back4.isGlow);

  // Back again to step 3 restores grey full window instantly
  await page.click('#prev-btn');
  await page.waitForTimeout(40);
  var back3 = await page.evaluate(function () {
    var svg = document.getElementById('mosaic-svg');
    return {
      step: Number(document.getElementById('widget').getAttribute('data-step')),
      isColor: svg.classList.contains('is-color'),
      vb: svg.getAttribute('viewBox')
    };
  });
  assert(tag + ' Back from 4 restores grey step 3 instantly', back3.step === 3 && !back3.isColor && parseVBWidth(back3.vb) === 440);

  // Idle DOM mutations check + height-only resize check on 390x844
  if (width === 390) {
    await page.evaluate(function () {
      window.__idleMutations = 0;
      var obs = new MutationObserver(function (list) {
        window.__idleMutations += list.length;
      });
      obs.observe(document.body, { childList: true, subtree: true, attributes: true });
      window.__obs = obs;
    });
    await page.waitForTimeout(1500);
    var idleCount = await page.evaluate(function () {
      window.__obs.disconnect();
      return window.__idleMutations;
    });
    assert(tag + ' zero idle DOM mutations', idleCount === 0, 'mutations=' + idleCount);

    var beforeVar = await page.evaluate(function () {
      return getComputedStyle(document.documentElement).getPropertyValue('--card-h');
    });
    await page.setViewportSize({ width: 390, height: 740 });
    await page.waitForTimeout(200);
    var afterVar = await page.evaluate(function () {
      return getComputedStyle(document.documentElement).getPropertyValue('--card-h');
    });
    assert(tag + ' height-only resize preserves --card-h', beforeVar === afterVar, beforeVar + ' -> ' + afterVar);
  }

  assert(tag + ' zero page/console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

async function runReducedMotionCheck(browser, url) {
  var context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce'
  });
  var page = await context.newPage();
  var errors = [];
  page.on('pageerror', function (err) { errors.push(String(err)); });

  await page.goto(url, { waitUntil: 'networkidle' });
  for (var s = 1; s <= 5; s++) {
    await page.click('#next-btn');
    await page.waitForTimeout(30);
    var st = await page.evaluate(function () {
      var svg = document.getElementById('mosaic-svg');
      return {
        step: Number(document.getElementById('widget').getAttribute('data-step')),
        vb: svg.getAttribute('viewBox'),
        isColor: svg.classList.contains('is-color'),
        isGlow: svg.classList.contains('is-glow')
      };
    });
    assert('reduced-motion step ' + s + ' snaps immediately',
      st.step === s &&
      Math.abs(parseVBWidth(st.vb) - EXPECTED_VB_WIDTHS[s]) < 0.2 &&
      (s >= 4 ? st.isColor : !st.isColor) &&
      (s === 5 ? st.isGlow : !st.isGlow),
      JSON.stringify(st));
  }
  assert('reduced-motion zero page errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

(async function () {
  var server = null;
  var url = process.env.TRUST_ARTIST_URL;
  if (!url) {
    server = await startLocalServer();
    url = 'http://127.0.0.1:' + server.address().port + '/widgets/trust-the-artist.html';
  }
  var browser = await chromium.launch();
  try {
    await runViewportCheck(browser, url, 375, 812);
    await runViewportCheck(browser, url, 390, 844);
    await runViewportCheck(browser, url, 1280, 800);
    await runReducedMotionCheck(browser, url);
  } finally {
    await browser.close();
    if (server) server.close();
  }
  console.log('SUMMARY: ' + passed + ' passed, ' + failed + ' failed.');
  process.exit(failed > 0 ? 1 : 0);
})();
