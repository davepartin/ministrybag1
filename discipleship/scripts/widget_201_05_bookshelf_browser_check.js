'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const EXPECTED_HEADINGS = [
  'One Library, One Story',
  'The Law',
  'History',
  'Poetry and Wisdom',
  'Major Prophets',
  'Minor Prophets',
  'The Gospels',
  'Acts',
  "Paul's Letters",
  'Other Letters',
  'Revelation'
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
          : ext === '.css' ? 'text/css; charset=utf-8'
          : 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        res.end(buf);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}/widgets/bible-bookshelf2.html` });
    });
  });
}

async function readState(page) {
  return page.evaluate(() => {
    const widget = document.getElementById('widget');
    const card = document.getElementById('card-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const clusters = Array.from(document.querySelectorAll('.shelf-cluster'));
    const clusterRects = clusters.map((c) => {
      const r = c.getBoundingClientRect();
      return {
        step: c.getAttribute('data-step-index'),
        w: r.width,
        h: r.height,
        pressed: c.getAttribute('aria-pressed')
      };
    });
    const chips = Array.from(document.querySelectorAll('#book-chips .book-chip')).map((n) => n.textContent.trim());
    return {
      step: Number(widget.getAttribute('data-step')),
      heading: document.getElementById('card-heading').textContent.trim(),
      badge: document.getElementById('card-badge').textContent.trim(),
      text: document.getElementById('card-text').textContent.trim(),
      stepCount: document.getElementById('step-count').textContent.trim(),
      chips,
      svgTitle: document.getElementById('svg-title').textContent.trim(),
      svgDesc: document.getElementById('svg-desc').textContent.trim(),
      prevDisabled: prevBtn.disabled,
      nextText: nextBtn.textContent.trim(),
      prevHeight: prevBtn.getBoundingClientRect().height,
      nextHeight: nextBtn.getBoundingClientRect().height,
      cardHeight: Math.round(card.getBoundingClientRect().height),
      cardVar: card.style.getPropertyValue('--card-h'),
      widgetHeight: Math.round(widget.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      clusterRects
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
  const initial = await readState(page);
  assert.equal(initial.step, 0);
  assert.equal(initial.heading, EXPECTED_HEADINGS[0]);
  assert.equal(initial.prevDisabled, true);
  assert.equal(initial.overflowX, false, `horizontal overflow at ${width}x${height}`);
  assert.ok(initial.prevHeight >= 44, `prev button height ${initial.prevHeight} < 44`);
  assert.ok(initial.nextHeight >= 44, `next button height ${initial.nextHeight} < 44`);
  assert.equal(initial.clusterRects.length, 10);
  for (const cr of initial.clusterRects) {
    assert.ok(cr.w >= 44 && cr.h >= 44, `cluster ${cr.step} hitbox too small: ${cr.w}x${cr.h}`);
    assert.equal(cr.pressed, 'false');
  }

  const cardHeights = new Set([initial.cardHeight]);
  const svgTitles = new Set([initial.svgTitle]);
  let totalShelfBooks = 0;

  // Step 1 through 10 via Next button
  for (let i = 1; i <= 10; i += 1) {
    await page.click('#next-btn');
    await page.waitForTimeout(reducedMotion ? 20 : 60);
    const st = await readState(page);
    assert.equal(st.step, i);
    assert.equal(st.heading, EXPECTED_HEADINGS[i]);
    assert.equal(st.prevDisabled, false);
    assert.equal(st.overflowX, false, `horizontal overflow at step ${i} (${width}x${height})`);
    assert.equal(st.clusterRects.filter((c) => c.pressed === 'true').length, 1);
    assert.equal(st.clusterRects[i - 1].pressed, 'true');
    cardHeights.add(st.cardHeight);
    svgTitles.add(st.svgTitle);
    assert.ok(st.svgDesc.length > 10, `empty svg desc at step ${i}`);
    totalShelfBooks += st.chips.length;
  }

  assert.equal(totalShelfBooks, 66, `expected 66 total book chips across 10 shelves, got ${totalShelfBooks}`);
  assert.equal(cardHeights.size, 1, `card height jumped across steps at ${width}x${height}: ${[...cardHeights].join(', ')}`);
  assert.equal(svgTitles.size, 11, `expected 11 unique svg titles, got ${svgTitles.size}`);

  // Clicking "All Shelves" at step 10 returns cleanly to step 0
  await page.click('#next-btn');
  await page.waitForTimeout(20);
  const looped = await readState(page);
  assert.equal(looped.step, 0);
  assert.equal(looped.heading, EXPECTED_HEADINGS[0]);

  // Direct shelf selection (Paul's Letters = step 8)
  await page.click('.shelf-cluster[data-step-index="8"]');
  await page.waitForTimeout(20);
  const paul = await readState(page);
  assert.equal(paul.step, 8);
  assert.equal(paul.heading, "Paul's Letters");
  assert.equal(paul.chips.length, 13);

  // Back button and keyboard ArrowLeft / ArrowRight navigation
  await page.click('#prev-btn');
  await page.waitForTimeout(20);
  assert.equal((await readState(page)).step, 7);

  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(20);
  assert.equal((await readState(page)).step, 8);

  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(20);
  assert.equal((await readState(page)).step, 7);

  // Height-only resize must not change cardVar (same-width resize rule from widget.md)
  const beforeResizeVar = (await readState(page)).cardVar;
  await page.setViewportSize({ width, height: height + 120 });
  await page.waitForTimeout(60);
  const afterResizeVar = (await readState(page)).cardVar;
  assert.equal(afterResizeVar, beforeResizeVar, `height-only resize changed --card-h: ${beforeResizeVar} -> ${afterResizeVar}`);

  // Idle DOM check (500ms settle -> zero idle mutations)
  const mutCount = await page.evaluate(() => new Promise((resolve) => {
    let count = 0;
    const obs = new MutationObserver((records) => { count += records.length; });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    setTimeout(() => {
      obs.disconnect();
      resolve(count);
    }, 500);
  }));
  assert.equal(mutCount, 0, `expected 0 idle DOM mutations, got ${mutCount}`);

  assert.deepEqual(errors, [], `unexpected runtime errors at ${width}x${height}: ${errors.join('; ')}`);
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
    console.log('PASS: bible-bookshelf2.html verified at 375x812, 390x844, 1280x800, and prefers-reduced-motion.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();
