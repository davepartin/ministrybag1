#!/usr/bin/env node
'use strict';
/**
 * 203-01 Great Commission Studio Wash widget verification.
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
  // Static protection assertions
  const lessonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', '203-01.json'), 'utf8'));
  const widgetHtml = fs.readFileSync(path.join(ROOT, 'widgets', 'great-commission.html'), 'utf8');
  assert('original great-command-v5-203.html preserved on disk', fs.existsSync(path.join(ROOT, 'widgets', 'great-command-v5-203.html')));
  assert('original 203-01-love-moves-out.png preserved on disk', fs.existsSync(path.join(ROOT, 'images', '203-01-love-moves-out.png')));
  assert('great-commission.html has zero Unicode em dashes', !widgetHtml.includes('\u2014'));
  assert('great-commission.html never references localStorage', !/localStorage/i.test(widgetHtml));
  assert('203-01.json contents diagram label updated', lessonData.contents.some((c) => c.anchor === 'diagram' && c.title === 'The Great Commission'));

  const activeQuestions = lessonData.blocks.filter((b) => b.type === 'question');
  const retiredQuestions = lessonData.retiredQuestions || [];
  const seed = { gt_answers_v2_migrated: true };
  activeQuestions.forEach((q, idx) => { seed['question-203-' + q.id] = 'SYN-203-01-' + idx; });
  retiredQuestions.forEach((q, idx) => { seed['question-203-' + q.id] = 'SYN-retired-' + idx; });

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

    await page.goto(baseUrl + '/widgets/great-commission.html', { waitUntil: 'networkidle' });
    await page.locator('#widget').waitFor({ state: 'visible' });

    const direct0 = await page.evaluate(() => ({
      h1: document.querySelector('.title-bar h1').textContent.trim(),
      tag: document.querySelector('.course-tag').textContent.trim(),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      cardH: document.getElementById('card-content').getBoundingClientRect().height,
      dots: document.querySelectorAll('.step-dot').length,
      text: document.body.innerText
    }));
    assert('direct ' + width + 'px header & 6 dots', direct0.h1 === 'The Great Commission' && direct0.tag === '203-01' && direct0.dots === 6);
    assert('direct ' + width + 'px no overflow & no Tap Begin', !direct0.overflow && !/tap begin/i.test(direct0.text));

    // Walk to step 6 and verify globe state
    for (let i = 0; i < 5; i++) {
      await page.locator('#next-btn').click();
    }
    await page.waitForTimeout(520);
    const directFinal = await page.evaluate(() => ({
      heading: document.getElementById('card-heading').textContent.trim(),
      isGlobe: document.getElementById('gc-svg').classList.contains('is-globe'),
      continentsOpacity: Number(getComputedStyle(document.getElementById('gc-continents')).opacity),
      cardH: document.getElementById('card-content').getBoundingClientRect().height,
      nextText: document.getElementById('next-btn').textContent.trim()
    }));
    assert('direct ' + width + 'px reaches globe reveal with stable card',
      /All Nations\. Never Alone\./.test(directFinal.heading) && directFinal.isGlobe && directFinal.continentsOpacity > 0.9 && Math.abs(directFinal.cardH - direct0.cardH) < 2 && /Start Over/.test(directFinal.nextText),
      JSON.stringify(directFinal));
    assert('direct ' + width + 'px zero errors', errs.length === 0, errs.join('; '));
    await context.close();
  }

  // 2. Embedded in #203-1 across all 6 width/motion combinations
  for (const cfg of cases) {
    const context = await browser.newContext({ viewport: cfg.viewport, reducedMotion: cfg.reducedMotion });
    await context.route('**/scripts/account.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await context.addInitScript((s) => {
      window.__gcStorageWrites = 0;
      ['setItem', 'removeItem', 'clear'].forEach((m) => {
        const orig = Storage.prototype[m];
        Storage.prototype[m] = function () {
          if (location.pathname.indexOf('great-commission') !== -1) window.__gcStorageWrites += 1;
          return orig.apply(this, arguments);
        };
      });
      if (window === window.top && !sessionStorage.getItem('gc-seeded')) {
        localStorage.setItem('christianFoundationsResponses', JSON.stringify(s));
        sessionStorage.setItem('gc-seeded', '1');
      }
    }, seed);

    const page = await context.newPage();
    const errs = [];
    const httpErrs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('response', (r) => {
      if (r.url().includes('great-commission') && r.status() >= 400) httpErrs.push(r.status() + ' ' + r.url());
    });

    await page.goto(baseUrl + '/index.html#203-1', { waitUntil: 'networkidle' });
    const lesson = page.locator('#session-1.active');
    await lesson.waitFor({ state: 'visible', timeout: 20000 });

    const frameEl = lesson.locator('iframe.gt-widget-frame[src*="great-commission.html"]');
    await frameEl.waitFor({ state: 'visible', timeout: 20000 });

    assert(cfg.name + ' embeds only great-commission widget (old widget & static circles embed removed)',
      (await lesson.locator('iframe').count()) === 1 &&
      (await frameEl.count()) === 1 &&
      (await lesson.locator('img[src*="203-01-love-moves-out"]').count()) === 0);
    assert(cfg.name + ' iframe title is "The Great Commission"', (await frameEl.getAttribute('title')) === 'The Great Commission');
    assert(cfg.name + ' preserves 7 active answers, course logo, and roof-drop sequence',
      (await lesson.locator('.question-textarea').count()) === 7 &&
      (await lesson.locator('#question-203-203-01-one').inputValue()) === seed['question-203-203-01-one'] &&
      (await lesson.locator('img[src*="203-3circle-logo"]').count()) >= 1 &&
      (await lesson.locator('[data-image-sequence], .story-sequence-stage, img[src*="203-01-roof-drop"]').count()) >= 1);

    const frame = page.frameLocator('#session-1.active iframe.gt-widget-frame[src*="great-commission.html"]');
    await frame.locator('#widget').waitFor({ state: 'visible' });
    await frame.locator('#gt-focus-modality').waitFor({ state: 'attached', timeout: 10000 });

    const initialStorage = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
    const cardH0 = await frame.locator('#card-content').evaluate((el) => el.getBoundingClientRect().height);
    const waitStep = cfg.reducedMotion === 'reduce' ? 50 : 520;

    // Step through all 6 steps and check each milestone
    const expectedHeadings = [
      '1. Loved First: Growing Deep',
      '2. Love Beside You: Growing Up',
      '3. Go and Make Disciples: Growing Out',
      '4. Help Them Follow Jesus',
      '5. Beyond Your Familiar Circle',
      '6. All Nations. Never Alone.'
    ];

    let allStepsOk = true;
    for (let s = 0; s < 6; s++) {
      if (s > 0) {
        await frame.locator('#next-btn').click();
        await page.waitForTimeout(waitStep);
      }
      const snap = await frame.locator('body').evaluate(() => {
        const svg = document.getElementById('gc-svg');
        return {
          heading: document.getElementById('card-heading').textContent.trim(),
          count: document.getElementById('step-count').textContent.trim(),
          cardH: document.getElementById('card-content').getBoundingClientRect().height,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          midOn: document.getElementById('gc-mid-ring').classList.contains('is-on'),
          outerOn: document.getElementById('gc-outer-ring').classList.contains('is-on'),
          actionOn: document.getElementById('gc-action-pill').classList.contains('is-on'),
          beyondOn: document.getElementById('gc-beyond-paths').classList.contains('is-on'),
          isGlobe: svg.classList.contains('is-globe'),
          continentsOp: Number(getComputedStyle(document.getElementById('gc-continents')).opacity),
          desc: document.getElementById('gc-svg-desc').textContent.trim(),
          nextH: document.getElementById('next-btn').getBoundingClientRect().height
        };
      });
      const stepMatch = snap.heading === expectedHeadings[s] &&
        snap.count === ('Step ' + (s + 1) + ' of 6') &&
        Math.abs(snap.cardH - cardH0) < 2 &&
        !snap.overflow &&
        snap.desc.length > 0 &&
        snap.nextH >= 44 &&
        (s < 1 || snap.midOn) &&
        (s < 2 || snap.outerOn) &&
        (s < 3 || snap.actionOn) &&
        (s < 4 || snap.beyondOn) &&
        (s < 5 ? !snap.isGlobe : (snap.isGlobe && snap.continentsOp > 0.9));
      if (!stepMatch) {
        allStepsOk = false;
        assert(cfg.name + ' step ' + (s + 1) + ' state', false, JSON.stringify(snap));
      }
    }
    assert(cfg.name + ' all 6 steps reveal circles, actions, ripples, and globe with locked card height', allStepsOk);

    // Back, keyboard dot selection, Start Over, and focus modality
    await frame.locator('#prev-btn').click();
    await page.waitForTimeout(waitStep);
    assert(cfg.name + ' Back returns to Step 5',
      (await frame.locator('#step-count').textContent()).trim() === 'Step 5 of 6');

    const lastDot = frame.locator('.step-dot').nth(5);
    await lastDot.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitStep);
    const kbdOutline = await lastDot.evaluate((el) => getComputedStyle(el).outlineColor);
    assert(cfg.name + ' keyboard dot selects Step 6 with focus-modality ring',
      (await frame.locator('#step-count').textContent()).trim() === 'Step 6 of 6' && /42,\s*111,\s*158/.test(kbdOutline),
      kbdOutline);

    await frame.locator('#next-btn').click();
    await page.waitForTimeout(waitStep);
    const ptrOutline = await frame.locator('#next-btn').evaluate((el) => getComputedStyle(el).outlineStyle);
    assert(cfg.name + ' Start Over resets to Step 1 and pointer click stays quiet',
      (await frame.locator('#step-count').textContent()).trim() === 'Step 1 of 6' &&
      (await frame.locator('#prev-btn').isDisabled()) &&
      ptrOutline === 'none',
      'outline=' + ptrOutline);

    // Parent iframe height & height-only resize stability
    await page.waitForTimeout(150);
    const iframeFits = await frameEl.evaluate((el) => el.clientHeight) >=
      (await frame.locator('body').evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))) - 2;
    assert(cfg.name + ' iframe height covers full widget without clipping', iframeFits);

    await page.setViewportSize({ width: cfg.viewport.width, height: cfg.viewport.height - 80 });
    await page.waitForTimeout(250);
    const cardHAfterHeightResize = await frame.locator('#card-content').evaluate((el) => el.getBoundingClientRect().height);
    assert(cfg.name + ' height-only resize keeps card height stable', Math.abs(cardHAfterHeightResize - cardH0) < 2);

    assert(cfg.name + ' widget writes zero storage & preserves saved answers',
      (await frame.locator('body').evaluate(() => window.__gcStorageWrites)) === 0 &&
      (await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'))) === initialStorage);

    assert(cfg.name + ' zero page/console/HTTP errors', errs.length === 0 && httpErrs.length === 0, errs.concat(httpErrs).join('; '));
    await context.close();
  }

  await browser.close();
  srv.close();
  console.log('\nTotal: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
