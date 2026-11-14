'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const EXPECTED_HEADINGS = [
  'Start with Your Blank Paper',
  '1. Low: Moved to a New Town',
  '2. High: Summer Camp',
  '3. Low: Family Hardship',
  '4. High: Became a Christian',
  '5. Low: Loss of Grandma',
  '6. High: Growing with God Today'
];

function startServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqPath = (req.url || '/').split('?')[0];
      const rel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
      const fullPath = path.resolve(rootDir, rel);
      if (!fullPath.startsWith(rootDir + path.sep) && fullPath !== rootDir) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(fullPath, (err, buf) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(fullPath).toLowerCase();
        const type = ext === '.html' ? 'text/html; charset=utf-8'
          : ext === '.js' ? 'text/javascript; charset=utf-8'
          : ext === '.json' ? 'application/json; charset=utf-8'
          : 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        res.end(buf);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}/widgets/peaks-and-valleys.html` });
    });
  });
}

async function readState(page) {
  return page.evaluate(() => {
    const widget = document.getElementById('widget');
    const card = document.getElementById('card-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const visibleDots = document.querySelectorAll('.node-group.is-visible').length;
    const segs = Array.from(document.querySelectorAll('.seg-line'));
    const drawnSegs = segs.filter((s) => Number.parseFloat(s.style.strokeDashoffset || '999') < 1).length;
    return {
      step: Number(widget.getAttribute('data-step')),
      heading: document.getElementById('card-heading').textContent.trim(),
      hasCardBadge: document.querySelectorAll('.card-badge').length > 0,
      quote: document.getElementById('card-quote').textContent.trim(),
      note: document.getElementById('card-note').textContent.trim(),
      stepCount: document.getElementById('step-count').textContent.trim(),
      svgTitle: document.getElementById('pv-svg-title').textContent.trim(),
      svgDesc: document.getElementById('pv-svg-desc').textContent.trim(),
      ghostCurves: document.querySelectorAll('.curve-ghost').length,
      visibleDots,
      drawnSegs,
      totalSegs: segs.length,
      prevDisabled: prevBtn.disabled,
      prevHeight: prevBtn.getBoundingClientRect().height,
      nextHeight: nextBtn.getBoundingClientRect().height,
      cardHeight: Math.round(card.getBoundingClientRect().height),
      cardVar: card.style.getPropertyValue('--card-h') || getComputedStyle(card).minHeight,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
}

async function testViewport(browser, url, width, height, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });

  await page.goto(url, { waitUntil: 'load' });
  const init = await readState(page);
  assert.equal(init.step, 0);
  assert.equal(init.heading, EXPECTED_HEADINGS[0]);
  assert.equal(init.hasCardBadge, false, 'slide counter pill must be absent');
  assert.equal(init.ghostCurves, 0, 'ghost dotted preview curve must not exist');
  assert.equal(init.visibleDots, 0, 'step 0 must start with blank paper (0 dots)');
  assert.equal(init.drawnSegs, 0, 'step 0 must have 0 segments drawn');
  assert.equal(init.totalSegs, 5, '5 segments connect 6 dots');
  assert.equal(init.prevDisabled, true);
  assert.equal(init.overflowX, false, `horizontal overflow at ${width}x${height}`);
  assert.ok(init.prevHeight >= 44 && init.nextHeight >= 44, 'nav buttons must be >= 44px');

  const cardHeights = new Set([init.cardHeight]);
  const svgDescs = new Set([init.svgDesc]);

  // Step 1..6: each click adds 1 dot and draws connecting segment for dots 2..6
  for (let i = 1; i <= 6; i += 1) {
    await page.click('#next-btn');
    await page.waitForTimeout(reducedMotion ? 30 : 600);
    const st = await readState(page);
    assert.equal(st.step, i);
    assert.equal(st.heading, EXPECTED_HEADINGS[i]);
    assert.equal(st.visibleDots, i, `step ${i} must show ${i} dot(s)`);
    assert.equal(st.drawnSegs, i - 1, `step ${i} must have ${i - 1} connected segment(s)`);
    assert.equal(st.overflowX, false);
    cardHeights.add(st.cardHeight);
    svgDescs.add(st.svgDesc);
  }

  assert.equal(cardHeights.size, 1, `card height jumped at ${width}x${height}: ${[...cardHeights].join(', ')}`);
  assert.equal(svgDescs.size, 7, 'each step should update svg desc');

  // Direct dot click & keyboard selection
  await page.click('.node-group[data-node="dot4"]');
  await page.waitForTimeout(20);
  const selected = await readState(page);
  assert.equal(selected.heading, EXPECTED_HEADINGS[4]);

  // ArrowLeft and Back
  await page.click('#prev-btn');
  await page.waitForTimeout(20);
  assert.equal((await readState(page)).step, 5);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(reducedMotion ? 30 : 600);
  assert.equal((await readState(page)).step, 6);

  // Height-only resize preserves --card-h
  const varBefore = await page.evaluate(() => document.documentElement.style.getPropertyValue('--card-h'));
  await page.setViewportSize({ width, height: height + 100 });
  await page.waitForTimeout(60);
  const varAfter = await page.evaluate(() => document.documentElement.style.getPropertyValue('--card-h'));
  assert.equal(varAfter, varBefore, 'height-only resize changed --card-h');

  // Idle DOM check
  const mutCount = await page.evaluate(() => new Promise((resolve) => {
    let count = 0;
    const obs = new MutationObserver((records) => { count += records.length; });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    setTimeout(() => { obs.disconnect(); resolve(count); }, 500);
  }));
  assert.equal(mutCount, 0, `expected 0 idle DOM mutations, got ${mutCount}`);
  assert.deepEqual(errors, [], `unexpected runtime errors: ${errors.join('; ')}`);

  await context.close();
}

(async () => {
  const rootDir = path.resolve(__dirname, '..');
  const { server, url } = await startServer(rootDir);
  let browser;
  try {
    browser = await chromium.launch();
    await testViewport(browser, url, 375, 812, false);
    await testViewport(browser, url, 390, 844, false);
    await testViewport(browser, url, 1280, 800, false);
    await testViewport(browser, url, 390, 844, true);
    console.log('PASS: peaks-and-valleys.html verified at 375x812, 390x844, 1280x800, and prefers-reduced-motion.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();
