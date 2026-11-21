#!/usr/bin/env node
'use strict';
/**
 * 203-03 Front Yard Life Studio Wash widget verification.
 * Checks direct and embedded views across 375px, 390px, and 1280px in both
 * normal and prefers-reduced-motion: reduce modes using synthetic data only.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

let passed = 0;
let failed = 0;

function assert(name, cond, detail) {
  if (cond) {
    passed += 1;
    console.log('PASS: ' + name);
  } else {
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' -> ' + detail : ''));
  }
}

function createServer() {
  return http.createServer((req, res) => {
    const clean = (req.url || '/').split('?')[0];
    const rel = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT, rel);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

(async () => {
  const lessonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', '203-03.json'), 'utf8'));
  const widgetHtml = fs.readFileSync(path.join(ROOT, 'widgets', 'front-yard-life.html'), 'utf8');
  assert('front-yard-life.html has zero Unicode em dashes', !widgetHtml.includes('\u2014'));
  assert('front-yard-life.html never references localStorage', !/localStorage/i.test(widgetHtml));
  assert('203-03.json preserves The Open Table and Listen boxes',
    lessonData.blocks.some((b) => b.type === 'box' && b.title === 'The Open Table') &&
    lessonData.blocks.some((b) => b.type === 'box' && b.title === 'Ask, Ask Again, Remember'));

  const activeQuestions = lessonData.blocks.filter((b) => b.type === 'question');
  const seed = { gt_answers_v2_migrated: true };
  activeQuestions.forEach((q, idx) => { seed['question-203-' + q.id] = 'SYN-203-03-' + idx; });

  const srv = createServer();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const baseUrl = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ headless: true });

  const cases = [
    { name: '375/no-preference', viewport: { width: 375, height: 812 }, reducedMotion: 'no-preference' },
    { name: '390/no-preference', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
    { name: '1280/no-preference', viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' },
    { name: '375/reduce', viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' },
    { name: '390/reduce', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' },
    { name: '1280/reduce', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }
  ];

  // 1. Direct standalone checks across 375, 390, 1280
  for (const width of [375, 390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));

    await page.goto(baseUrl + '/widgets/front-yard-life.html', { waitUntil: 'networkidle' });
    await page.locator('#widget').waitFor({ state: 'visible' });

    const direct0 = await page.evaluate(() => ({
      h1: document.querySelector('.title-bar h1').textContent.trim(),
      tag: document.querySelector('.course-tag').textContent.trim(),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      cardH: document.getElementById('card-content').getBoundingClientRect().height,
      dots: document.querySelectorAll('.step-dot').length,
      text: document.body.innerText
    }));
    assert('direct ' + width + 'px header & 6 dots', direct0.h1 === 'Front Yard Life' && direct0.tag === '203-03' && direct0.dots === 6);
    assert('direct ' + width + 'px no overflow & no Tap Begin', !direct0.overflow && !/tap begin/i.test(direct0.text));

    for (let i = 0; i < 5; i++) {
      await page.locator('#next-btn').click();
    }
    await page.waitForTimeout(550);
    const directFinal = await page.evaluate(() => ({
      heading: document.getElementById('card-heading').textContent.trim(),
      isOpen: document.getElementById('fy-svg').classList.contains('is-open'),
      finishOn: document.getElementById('finish-night-sky').classList.contains('is-on') &&
        document.getElementById('finish-night-ambient').classList.contains('is-on') &&
        document.getElementById('porch-night-beam').classList.contains('is-on') &&
        document.getElementById('porch-bulb-lit').classList.contains('is-on'),
      porchDelay: getComputedStyle(document.getElementById('porch-night-beam')).transitionDelay,
      porchDur: getComputedStyle(document.getElementById('porch-night-beam')).transitionDuration,
      cardH: document.getElementById('card-content').getBoundingClientRect().height,
      nextText: document.getElementById('next-btn').textContent.trim()
    }));
    assert('direct ' + width + 'px reaches Front Yard Life finish with stable card & 1.5s delayed porch light',
      /5\. Front Yard Life/.test(directFinal.heading) &&
      directFinal.isOpen &&
      directFinal.finishOn &&
      directFinal.porchDelay === '0.95s' &&
      directFinal.porchDur === '1.5s' &&
      Math.abs(directFinal.cardH - direct0.cardH) < 2 &&
      /Start Over/.test(directFinal.nextText),
      JSON.stringify(directFinal));
    assert('direct ' + width + 'px zero errors', errs.length === 0, errs.join('; '));
    await context.close();
  }

  // 2. Embedded in #203-3 across all 6 width/motion cases
  for (const cfg of cases) {
    const context = await browser.newContext({ viewport: cfg.viewport, reducedMotion: cfg.reducedMotion });
    await context.route('**/scripts/account.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await context.addInitScript((s) => {
      window.__fyStorageWrites = 0;
      ['setItem', 'removeItem', 'clear'].forEach((m) => {
        const orig = Storage.prototype[m];
        Storage.prototype[m] = function () {
          if (location.pathname.indexOf('front-yard-life') !== -1) window.__fyStorageWrites += 1;
          return orig.apply(this, arguments);
        };
      });
      if (window === window.top && !sessionStorage.getItem('fy-seeded')) {
        localStorage.setItem('christianFoundationsResponses', JSON.stringify(s));
        sessionStorage.setItem('fy-seeded', '1');
      }
    }, seed);

    const page = await context.newPage();
    const errs = [];
    const httpErrs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('response', (r) => {
      if (r.url().includes('front-yard-life') && r.status() >= 400) httpErrs.push(r.status() + ' ' + r.url());
    });

    await page.goto(baseUrl + '/index.html#203-3', { waitUntil: 'networkidle' });
    const lesson = page.locator('#session-3.active');
    await lesson.waitFor({ state: 'visible', timeout: 20000 });

    const frameEl = lesson.locator('iframe.gt-widget-frame[src*="front-yard-life.html"]');
    await frameEl.waitFor({ state: 'visible', timeout: 20000 });

    assert(cfg.name + ' embeds Front Yard Life widget right alongside lesson boxes',
      (await frameEl.count()) === 1 && (await frameEl.getAttribute('title')) === 'Front Yard Life');
    assert(cfg.name + ' preserves 7 active answers and Emmaus sequence',
      (await lesson.locator('.question-textarea').count()) === 7 &&
      (await lesson.locator('#question-203-203-03-heard').inputValue()) === seed['question-203-203-03-heard'] &&
      (await lesson.locator('img[src*="emmaus-bread-seq"]').count()) >= 1);

    const frame = page.frameLocator('#session-3.active iframe.gt-widget-frame[src*="front-yard-life.html"]');
    await frame.locator('#widget').waitFor({ state: 'visible' });
    await frame.locator('#gt-focus-modality').waitFor({ state: 'attached', timeout: 10000 });

    const initialStorage = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
    const cardH0 = await frame.locator('#card-content').evaluate((el) => el.getBoundingClientRect().height);
    const waitStep = cfg.reducedMotion === 'reduce' ? 50 : 520;

    const expectedHeadings = [
      'Backyard Life',
      '1. Carry Your Chairs Out Front',
      '2. Open Up',
      '3. People Pop By',
      '4. Pull Up a Chair',
      '5. Front Yard Life'
    ];

    let allOk = true;
    for (let s = 0; s < 6; s++) {
      if (s > 0) {
        await frame.locator('#next-btn').click();
        await page.waitForTimeout(waitStep);
      }
      const snap = await frame.locator('body').evaluate(() => {
        const svg = document.getElementById('fy-svg');
        return {
          heading: document.getElementById('card-heading').textContent.trim(),
          subnote: document.getElementById('card-subnote').textContent.trim(),
          cardH: document.getElementById('card-content').getBoundingClientRect().height,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          isMoved: svg.classList.contains('is-moved'),
          isOpen: svg.classList.contains('is-open'),
          frontSetup: document.getElementById('front-setup').classList.contains('is-on'),
          popBy: document.getElementById('neighbors-pop-by').classList.contains('is-on'),
          seated: document.getElementById('pull-up-chair').classList.contains('is-on'),
          finish: document.getElementById('finish-night-sky').classList.contains('is-on') &&
            document.getElementById('finish-night-ambient').classList.contains('is-on') &&
            document.getElementById('porch-night-beam').classList.contains('is-on') &&
            document.getElementById('porch-bulb-lit').classList.contains('is-on'),
          porchOpacity: parseFloat(getComputedStyle(document.getElementById('porch-night-beam')).opacity),
          nextH: document.getElementById('next-btn').getBoundingClientRect().height
        };
      });
      const ok = snap.heading === expectedHeadings[s] &&
        Math.abs(snap.cardH - cardH0) < 2 &&
        !snap.overflow &&
        snap.nextH >= 44 &&
        (s === 0 ? !snap.isMoved : (snap.isMoved && snap.frontSetup)) &&
        (s < 2 ? !snap.isOpen : snap.isOpen) &&
        (s !== 2 || /No porch\?/.test(snap.subnote)) &&
        (s < 3 ? !snap.popBy : snap.popBy) &&
        (s < 4 ? !snap.seated : snap.seated) &&
        (s < 5 ? (!snap.finish && snap.porchOpacity === 0) : snap.finish);
      if (!ok) {
        allOk = false;
        assert(cfg.name + ' step ' + s + ' state', false, JSON.stringify(snap));
      }
    }
    assert(cfg.name + ' all 6 steps animate cleanly with renter note & locked card height', allOk);

    await frame.locator('#prev-btn').click();
    await page.waitForTimeout(waitStep);
    assert(cfg.name + ' Back returns to Step 4', (await frame.locator('#step-count').textContent()).trim() === 'Step 4 of 5');

    const lastDot = frame.locator('.step-dot').nth(5);
    await lastDot.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitStep);
    const kbdOutline = await lastDot.evaluate((el) => getComputedStyle(el).outlineColor);
    assert(cfg.name + ' keyboard dot selects finish with focus-modality ring',
      (await frame.locator('#step-count').textContent()).trim() === 'Step 5 of 5' && /42,\s*111,\s*158/.test(kbdOutline),
      kbdOutline);

    await frame.locator('#next-btn').click();
    await page.waitForTimeout(waitStep);
    const ptrOutline = await frame.locator('#next-btn').evaluate((el) => getComputedStyle(el).outlineStyle);
    assert(cfg.name + ' Start Over resets to Start and pointer click stays quiet',
      (await frame.locator('#step-count').textContent()).trim() === 'Start' &&
      (await frame.locator('#prev-btn').isDisabled()) &&
      ptrOutline === 'none',
      'outline=' + ptrOutline);

    await page.waitForTimeout(150);
    const iframeFits = await frameEl.evaluate((el) => el.clientHeight) >=
      (await frame.locator('body').evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))) - 2;
    assert(cfg.name + ' iframe height covers full widget', iframeFits);

    await page.setViewportSize({ width: cfg.viewport.width, height: cfg.viewport.height - 80 });
    await page.waitForTimeout(250);
    const cardHAfterHeightResize = await frame.locator('#card-content').evaluate((el) => el.getBoundingClientRect().height);
    assert(cfg.name + ' height-only resize keeps card height stable', Math.abs(cardHAfterHeightResize - cardH0) < 2);

    assert(cfg.name + ' widget writes zero storage & preserves saved answers',
      (await frame.locator('body').evaluate(() => window.__fyStorageWrites)) === 0 &&
      (await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'))) === initialStorage);

    assert(cfg.name + ' zero page/console/HTTP errors', errs.length === 0 && httpErrs.length === 0, errs.concat(httpErrs).join('; '));
    await context.close();
  }

  await browser.close();
  srv.close();
  console.log('\nTotal: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
