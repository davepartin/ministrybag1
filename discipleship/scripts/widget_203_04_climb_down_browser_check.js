#!/usr/bin/env node
/**
 * 203-04 Climb Down to Lift Others Up browser verification (standalone + embedded #203-04).
 * Uses an in-process static server by default, or pass CLIMB_BASE_URL and CLIMB_LESSON_URL
 * to verify a live Firebase Hosting preview directly.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const exporter = require('./lesson-export.js');

const ROOT = path.resolve(__dirname, '..');
const WIDGET_FILE = path.join(ROOT, 'widgets', 'climb-down-lift-up.html');
const LESSON_FILE = path.join(ROOT, 'data', '203-04.json');
const SCREENSHOT_DIR = process.env.CLIMB_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED_HEADINGS = [
  'Climb Down to Lift Others Up',
  "1. The World's Way",
  '2. Jesus Came Down First',
  '3. Greatness Turns Over',
  '4. Climb Down to Lift Others Up',
  '5. A Life That Builds Others Up'
];

const JOBS = [
  { width: 375, height: 812, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'no-preference' },
  { width: 1280, height: 800, reducedMotion: 'no-preference' },
  { width: 390, height: 844, reducedMotion: 'reduce' }
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function startStaticServer(rootDir) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (reqPath === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
      }
      const rel = reqPath.replace(/^\/+/, '') || 'index.html';
      const target = path.resolve(rootDir, rel);
      if (!target.startsWith(rootDir) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      const ext = path.extname(target).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(target).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const sourceText = fs.readFileSync(WIDGET_FILE, 'utf8');
  if (sourceText.includes('\u2014')) {
    throw new Error('FAIL: Em dash found in widgets/climb-down-lift-up.html');
  }
  const visibleHtml = sourceText
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
  for (const forbidden of ['tap', 'click', 'widget', 'diagram']) {
    if (new RegExp(`\\b${forbidden}\\b`, 'i').test(visibleHtml)) {
      throw new Error(`FAIL: Forbidden visible word "${forbidden}" found in HTML copy`);
    }
  }

  const lessonData = JSON.parse(fs.readFileSync(LESSON_FILE, 'utf8'));
  const activeQuestions = lessonData.blocks.filter(b => b.type === 'question');
  const retiredQuestions = lessonData.retiredQuestions || [];

  let localServer = null;
  let WIDGET_URL = process.env.CLIMB_BASE_URL || '';
  let LESSON_URL = process.env.CLIMB_LESSON_URL || '';
  if (!WIDGET_URL || !LESSON_URL) {
    localServer = await startStaticServer(ROOT);
    const origin = `http://127.0.0.1:${localServer.address().port}`;
    if (!WIDGET_URL) WIDGET_URL = `${origin}/widgets/climb-down-lift-up.html`;
    if (!LESSON_URL) LESSON_URL = `${origin}/index.html#203-04`;
  }

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : { channel: 'chrome' })
  });

  let passed = 0;
  function check(label, cond) {
    if (!cond) throw new Error('FAIL: ' + label);
    passed += 1;
  }

  // Verify lesson-export includes active + retired 203-04 synthetic answers cleanly
  const exportSeed = {};
  activeQuestions.forEach((q, i) => { exportSeed[`question-203-${q.id}`] = `SYN-203-04-active-${i}`; });
  retiredQuestions.forEach((q, i) => { exportSeed[`question-203-${q.id}`] = `SYN-203-04-retired-${i}`; });
  const exportBuilt = exporter.buildExport({
    scope: 'lesson',
    courseId: '203',
    courseTitle: 'Growing Out',
    currentLessonNum: 4,
    lessons: [{ num: 4, data: lessonData, metaTitle: lessonData.title }],
    responses: exportSeed
  });
  activeQuestions.forEach((q, i) => {
    check(`export includes active ${q.id}`, exportBuilt.body.includes(`SYN-203-04-active-${i}`));
  });
  retiredQuestions.forEach((q, i) => {
    check(`export includes retired ${q.id}`, exportBuilt.body.includes(`SYN-203-04-retired-${i}`));
  });

  // 1. STANDALONE CHECKS
  for (const job of JOBS) {
    const tag = `standalone/${job.width}/${job.reducedMotion}`;
    const ctx = await browser.newContext({
      viewport: { width: job.width, height: job.height },
      reducedMotion: job.reducedMotion
    });
    try {
      await ctx.addInitScript(() => {
        window.__climbStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            window.__climbStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
      });

      const page = await ctx.newPage();
      const errors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const loc = (msg.location && msg.location().url) || '';
          if (!msg.text().includes('favicon.ico') && !loc.includes('favicon.ico')) {
            errors.push(`console.error: ${msg.text()}`);
          }
        }
      });
      page.on('response', r => {
        if (r.status() >= 400 && !r.url().includes('favicon.ico')) {
          httpErrors.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.goto(WIDGET_URL, { waitUntil: 'networkidle' });
      await page.locator('#next-btn').waitFor();
      await page.waitForTimeout(100);

      // Header conformance
      const hdr = await page.evaluate(() => {
        const h = document.querySelector('.title-bar');
        const t = h.querySelector('h1');
        const b = h.querySelector('.course-tag');
        const hr = h.getBoundingClientRect();
        const tr = t.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return {
          title: t.textContent.trim(),
          badge: b.textContent.trim(),
          bg: getComputedStyle(h).backgroundColor,
          color: getComputedStyle(t).color,
          font: getComputedStyle(t).fontSize,
          badgeColor: getComputedStyle(b).color,
          gap: br.left - tr.right,
          height: hr.height
        };
      });
      check(`${tag}: approved dark header title & badge`, hdr.title === 'Climb Down to Lift Others Up' && hdr.badge === '203-04');
      check(`${tag}: approved dark header colors/type`,
        hdr.bg === 'rgb(44, 36, 22)' && hdr.color === 'rgb(250, 248, 243)' &&
        hdr.font === '17px' && hdr.badgeColor === 'rgb(229, 222, 201)');
      check(`${tag}: compact header layout (${Math.round(hdr.height)}px, gap=${Math.round(hdr.gap)}px)`,
        hdr.gap >= 7 && hdr.height >= 32 && hdr.height <= 60);

      const cardHeight = await page.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const widgetHeight = await page.locator('#widget').evaluate(e => e.getBoundingClientRect().height);
      const cardVar = await page.locator('#widget').evaluate(e => e.style.getPropertyValue('--card-h'));
      const stepCount = await page.locator('.step-dot').count();
      check(`${tag}: six step dots present`, stepCount === 6);

      const sizesOk = await page.evaluate(() => {
        const navOk = Array.from(document.querySelectorAll('.nav-btn')).every(b => b.getBoundingClientRect().height >= 44);
        const dotOk = Array.from(document.querySelectorAll('.step-dot')).every(b => {
          const r = b.getBoundingClientRect();
          return r.width >= 28 && r.height >= 28;
        });
        return navOk && dotOk;
      });
      check(`${tag}: buttons >= 44px and dots >= 28x28`, sizesOk);

      if (job.width === 390) {
        check(`${tag}: total widget height <= 560px (${Math.round(widgetHeight)}px)`, widgetHeight <= 560);
      }

      // Opening cue visible on Step 0
      check(`${tag}: opening cue text matches`,
        (await page.locator('#opening-cue').innerText()).trim() === 'What does greatness look like?');
      check(`${tag}: opening cue visible on step 0`,
        await page.locator('#opening-cue').evaluate(e => getComputedStyle(e).opacity === '1' && e.getAttribute('aria-hidden') === 'false'));

      if (SCREENSHOT_DIR && tag === 'standalone/390/no-preference') {
        await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, 'step-0.png') });
      }

      // Rapid double-tap during opening cue fade should not skip Step 1
      const fadeCheck = await page.evaluate(() => {
        const cue = document.getElementById('opening-cue');
        document.getElementById('next-btn').click();
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.getElementById('next-btn').click();
        }
        return {
          immediateStep: document.querySelector('.step-dot.active').getAttribute('data-step'),
          duration: getComputedStyle(cue).transitionDuration
        };
      });
      if (job.reducedMotion === 'no-preference') {
        check(`${tag}: drawing waits for 0.32s cue fade`, fadeCheck.immediateStep === '0' && fadeCheck.duration === '0.32s');
        await page.waitForTimeout(420);
      } else {
        check(`${tag}: reduced motion advances immediately past opening cue`, fadeCheck.immediateStep === '1');
      }

      // Walk through steps 1..5
      for (let s = 1; s < stepCount; s++) {
        if (s > 1) {
          await page.locator('#next-btn').click();
        }
        const dur = Number(await page.locator('#widget').getAttribute('data-step-dur')) || 0;
        if (job.reducedMotion === 'reduce') {
          check(`${tag}: reduced motion instant step ${s}`,
            dur === 0 && await page.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
        }
        await page.waitForTimeout(job.reducedMotion === 'reduce' ? 60 : Math.max(220, dur + 360));

        check(`${tag}: active dot step ${s}`,
          await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: heading matches step ${s}`,
          await page.locator('#card-heading').textContent() === EXPECTED_HEADINGS[s]);
        check(`${tag}: opening cue hidden step ${s}`,
          await page.locator('#opening-cue').evaluate(e => Number(getComputedStyle(e).opacity) === 0 && e.getAttribute('aria-hidden') === 'true'));
        check(`${tag}: constant --card-h step ${s}`,
          await page.locator('#widget').evaluate(e => e.style.getPropertyValue('--card-h')) === cardVar);
        check(`${tag}: constant card height step ${s}`,
          await page.locator('#card-content').evaluate((e, h) => Math.abs(e.getBoundingClientRect().height - h) <= 1, cardHeight));
        check(`${tag}: card content fits step ${s}`,
          await page.locator('#card-content').evaluate(e => e.scrollHeight <= e.clientHeight + 1));
        check(`${tag}: zero horizontal overflow step ${s}`,
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

        // Verify visible card copy contains none of the forbidden words
        const cardText = await page.locator('#card-content').innerText();
        for (const forbidden of ['tap', 'click', 'widget', 'diagram']) {
          check(`${tag}: no "${forbidden}" in step ${s} copy`, !new RegExp(`\\b${forbidden}\\b`, 'i').test(cardText));
        }

        const svgState = await page.evaluate(() => ({
          flipped: document.getElementById('flip-group').classList.contains('is-flipped'),
          crossVis: document.getElementById('cross-anchor').classList.contains('is-visible'),
          stemVis: document.getElementById('anchor-stem').classList.contains('is-visible'),
          jesusTopVis: document.getElementById('jesus-top-meet').classList.contains('is-visible'),
          pullArmVis: document.getElementById('hero-arm-pull').classList.contains('is-visible'),
          liftArmVis: document.getElementById('hero-arm-lift').classList.contains('is-visible'),
          heroPos: document.getElementById('hero-group').getAttribute('transform'),
          peerCount: document.querySelectorAll('#peers-layer .peer-group').length,
          ghostVis: document.getElementById('low-ghost').classList.contains('is-visible'),
          linksVis: Array.from(document.querySelectorAll('#kingdom-links .is-visible')).length,
          frameVis: document.getElementById('finish-frame').classList.contains('is-visible'),
          loop: window.CLIMB_DOWN_LOOP.state()
        }));

        check(`${tag}: 4-3-2-1 pyramid has 9 peers + 1 hero (10 circles total)`, svgState.peerCount === 9);
        check(`${tag}: flip state correct on step ${s}`, svgState.flipped === (s >= 3));
        check(`${tag}: pull-down arm visible on step 1`, svgState.pullArmVis === (s === 1));
        check(`${tag}: lift-up arms visible on steps 3-5`, svgState.liftArmVis === (s >= 3));
        check(`${tag}: Jesus meets You at top on step 2`, svgState.jesusTopVis === (s === 2));
        check(`${tag}: hero slot position on step ${s}`,
          svgState.heroPos === (s <= 2 ? 'translate(272.0,46.0)' : (s === 3 ? 'translate(300.0,96.0)' : 'translate(300.0,196.0)')));
        check(`${tag}: cross anchor visible on step ${s}`, svgState.crossVis === (s >= 2));
        check(`${tag}: anchor stem visible on step ${s}`, svgState.stemVis === (s >= 4));
        check(`${tag}: step 4 climb-down ghost visible iff step 4`, svgState.ghostVis === (s === 4));
        check(`${tag}: step 5 shows all 8 links + frame`,
          svgState.linksVis === (s === 5 ? 8 : 0) && svgState.frameVis === (s === 5));

        if (s === 5) {
          if (job.reducedMotion === 'reduce') {
            check(`${tag}: step 5 loop stopped under reduced motion`,
              !svgState.loop.active && svgState.loop.loopState === 'stopped');
          } else {
            check(`${tag}: step 5 loop active and running on screen`,
              svgState.loop.active && !svgState.loop.paused && svgState.loop.loopState === 'running');
          }
        }

        if (SCREENSHOT_DIR && tag === 'standalone/390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Zero idle DOM mutations on Step 5 (even while CSS loop pulses!)
      await page.waitForTimeout(160);
      await page.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(450);
      check(`${tag}: zero idle DOM mutations on step 5`, await page.evaluate(() => window.__idleMut) === 0);

      // Back restores step 4 instantly
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Back restores step 4 instantly`,
        await page.locator('#widget').getAttribute('data-step') === '4' &&
        await page.locator('#widget').getAttribute('data-step-dur') === '0');

      // Jump to step 5 then Start Over restores step 0 & opening cue
      await page.locator('.step-dot[data-step="5"]').click();
      await page.waitForTimeout(60);
      await page.locator('#next-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Start Over restores step 0 and opening cue`,
        await page.locator('#widget').getAttribute('data-step') === '0' &&
        await page.locator('#prev-btn').isDisabled() &&
        await page.locator('#opening-cue').getAttribute('aria-hidden') === 'false');

      // Canceling pending opening fade via dot 0 keeps step 0 cleanly
      if (job.reducedMotion === 'no-preference') {
        await page.locator('#next-btn').click();
        await page.locator('.step-dot[data-step="0"]').click();
        await page.waitForTimeout(400);
        check(`${tag}: return to start cancels pending cue fade`,
          await page.locator('#widget').getAttribute('data-step') === '0' &&
          await page.locator('#opening-cue').getAttribute('aria-hidden') === 'false');
      }

      check(`${tag}: zero localStorage writes`, await page.evaluate(() => window.__climbStorageWrites) === 0);
      check(`${tag}: zero page/console/HTTP errors`, errors.length === 0 && httpErrors.length === 0);
      console.log(`PASS ${tag}: card=${Math.round(cardHeight)}px widget=${Math.round(widgetHeight)}px header=${Math.round(hdr.height)}px`);
    } finally {
      await ctx.close();
    }
  }

  // 2. EMBEDDED #203-04 LESSON CHECKS
  for (const job of JOBS) {
    const tag = `embedded/${job.width}/${job.reducedMotion}`;
    const seed = Object.assign({}, exportSeed, { 'question-101-1-1': 'SYN-other-course-intact' });
    const ctx = await browser.newContext({
      viewport: { width: job.width, height: 844 },
      reducedMotion: job.reducedMotion
    });
    try {
      await ctx.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
      await ctx.addInitScript(s => {
        window.__embedWidgetStorageWrites = 0;
        for (const m of ['setItem', 'removeItem', 'clear']) {
          const orig = Storage.prototype[m];
          Storage.prototype[m] = function (...args) {
            if (window !== window.top) window.__embedWidgetStorageWrites += 1;
            return orig.apply(this, args);
          };
        }
        if (window === window.top && !sessionStorage.getItem('climb-seeded')) {
          localStorage.setItem('christianFoundationsResponses', JSON.stringify(s));
          sessionStorage.setItem('climb-seeded', '1');
        }
      }, seed);

      const page = await ctx.newPage();
      const errors = [];
      const httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => {
        if (r.status() >= 400 && !r.url().includes('favicon.ico')) {
          httpErrors.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.goto(LESSON_URL, { waitUntil: 'networkidle' });
      const lesson = page.locator('#session-4.active');
      await lesson.waitFor();

      const iframeEl = lesson.locator('iframe[src*="widgets/climb-down-lift-up.html"]');
      await iframeEl.waitFor();
      check(`${tag}: single climb-down widget embedded in 203-04`, await iframeEl.count() === 1);
      check(`${tag}: iframe title attribute set`, (await iframeEl.getAttribute('title')) === 'Climb Down to Lift Others Up');

      // Existing lesson structure & questions preserved
      check(`${tag}: original 7 active questions preserved`,
        await lesson.locator('.question-textarea').count() === activeQuestions.length);
      check(`${tag}: "What Is in Your Hands?" box preserved`,
        await lesson.locator('.block-box .box-title').filter({ hasText: 'What Is in Your Hands?' }).count() === 1);

      for (const q of activeQuestions) {
        const key = `question-203-${q.id}`;
        check(`${tag}: restores synthetic answer ${key}`,
          await lesson.locator(`#${key}`).inputValue() === seed[key]);
      }

      const frame = await (await iframeEl.elementHandle()).contentFrame();
      await frame.locator('#next-btn').waitFor();
      await page.waitForTimeout(240);

      // Bring widget cleanly into view below sticky bar
      await iframeEl.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 96, behavior: 'instant' }));
      await page.waitForTimeout(120);

      const before = await iframeEl.evaluate(el => ({
        h: el.getBoundingClientRect().height,
        y: window.scrollY
      }));
      const savedBefore = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));

      // Step 0 -> 5 embedded
      for (let s = 1; s < EXPECTED_HEADINGS.length; s++) {
        await frame.locator('#next-btn').click();
        if (s === 1 && job.reducedMotion === 'no-preference') {
          await page.waitForTimeout(420);
        }
        const dur = Number(await frame.locator('#widget').getAttribute('data-step-dur')) || 0;
        await page.waitForTimeout(job.reducedMotion === 'reduce' ? 70 : Math.max(220, dur + 360));
      }

      const after = await iframeEl.evaluate(el => ({
        h: el.getBoundingClientRect().height,
        y: window.scrollY
      }));
      check(`${tag}: iframe height stable (${Math.round(before.h)} -> ${Math.round(after.h)})`,
        Math.abs(after.h - before.h) < 2);
      check(`${tag}: zero lesson scroll jump (${Math.round(before.y)} -> ${Math.round(after.y)})`,
        Math.abs(after.y - before.y) < 2);
      check(`${tag}: host and iframe zero horizontal overflow`,
        (await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)) &&
        (await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)));

      if (SCREENSHOT_DIR && tag === 'embedded/390/no-preference') {
        await iframeEl.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 96, behavior: 'instant' }));
        await page.waitForTimeout(100);
        await iframeEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'embedded-390-step-5.png') });
      }

      // Offscreen pause check on Step 5
      if (job.reducedMotion === 'no-preference') {
        const onState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 5 loop running while onscreen`, onState.active && !onState.paused);

        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(250);
        const offState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 5 loop pauses when scrolled offscreen`, offState.active && offState.paused);

        await iframeEl.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 96, behavior: 'instant' }));
        await page.waitForTimeout(250);
        const backState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 5 loop resumes when scrolled back onscreen`, backState.active && !backState.paused);
      }

      // Idle iframe style mutation check
      await iframeEl.evaluate(el => {
        window.__iframeStyleWrites = 0;
        new MutationObserver(ms => { window.__iframeStyleWrites += ms.length; })
          .observe(el, { attributes: true, attributeFilter: ['style'] });
      });
      await page.waitForTimeout(350);
      check(`${tag}: zero idle iframe height writes`, await page.evaluate(() => window.__iframeStyleWrites) === 0);
      check(`${tag}: widget never writes localStorage`,
        (await frame.evaluate(() => window.__embedWidgetStorageWrites)) === 0 &&
        (await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'))) === savedBefore);

      // Answer edit & reload preservation on 390/no-preference
      if (job.width === 390 && job.reducedMotion === 'no-preference') {
        const firstKey = `question-203-${activeQuestions[0].id}`;
        await lesson.locator(`#${firstKey}`).fill('SYN-203-04-edited-after-widget');
        await page.reload({ waitUntil: 'networkidle' });
        await lesson.waitFor();
        check(`${tag}: edited answer survives reload`,
          await lesson.locator(`#${firstKey}`).inputValue() === 'SYN-203-04-edited-after-widget');
        const reloadedStore = await page.evaluate(() => JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}'));
        check(`${tag}: retired 203-04-3 answer survives reload`,
          reloadedStore['question-203-203-04-3'] === 'SYN-203-04-retired-0');
        check(`${tag}: other-course 101-1-1 answer survives reload`,
          reloadedStore['question-101-1-1'] === 'SYN-other-course-intact');
      }

      check(`${tag}: zero embedded page/HTTP errors`, errors.length === 0 && httpErrors.length === 0);
      console.log(`PASS ${tag}: iframe=${Math.round(after.h)}px`);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  if (localServer) localServer.close();
  console.log(`${passed} 203-04 Climb Down to Lift Others Up checks passed.`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
