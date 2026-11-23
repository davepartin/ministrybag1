#!/usr/bin/env node
/**
 * 203-04 Title or Towel (widgets/climb-down-lift-up.html) browser verification (standalone + embedded #203-04).
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

const EXPECTED_CARDS = [
  {
    heading: 'Title or Towel',
    verse: '"But many who are first will be last, and the last first."',
    ref: 'Mark 10:31',
    note: 'There are two ways to measure greatness.'
  },
  {
    heading: 'Climbing for the Title',
    verse: '"they love the place of honor at feasts and the best seats in the synagogues."',
    ref: 'Matthew 23:6',
    note: 'The world says that to climb the ladder of success, you will have to step on some people on the way up.'
  },
  {
    heading: 'Jesus Served You First',
    verse: '"For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many."',
    ref: 'Mark 10:45',
    note: 'The King took the towel, and the scale turned over.'
  },
  {
    heading: 'Taking Up the Towel',
    verse: '"The greatest among you shall be your servant. Whoever exalts himself will be humbled, and whoever humbles himself will be exalted."',
    ref: 'Matthew 23:11-12',
    note: 'Climbing down to lift others up displays the gospel to the world.'
  },
  {
    heading: 'God Given Title - Faithful Servant',
    verse: '"If anyone serves me, the Father will honor him."',
    ref: 'John 12:26',
    note: 'The world gives its titles to those at the top. God gives His to servants.'
  }
];

const FORBIDDEN_PHRASES = [
  'the way down',
  'going down to someone',
  'get down',
  'pulling others down'
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
  for (const phrase of FORBIDDEN_PHRASES) {
    if (sourceText.toLowerCase().includes(phrase)) {
      throw new Error(`FAIL: Forbidden phrase "${phrase}" found in widgets/climb-down-lift-up.html`);
    }
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

  // Verify 203-04.json wiring: contents Diagram row title, widget title & anchor, and box anchor removal
  const diagramContentEntry = (lessonData.contents || []).find(c => c.anchor === 'diagram');
  check('203-04.json contents Diagram row title is Title or Towel',
    !!diagramContentEntry && diagramContentEntry.label === 'Diagram' && diagramContentEntry.title === 'Title or Towel');
  const widgetBlock = lessonData.blocks.find(b => b.type === 'widget' && b.src === 'widgets/climb-down-lift-up.html');
  check('203-04.json widget block has title Title or Towel and anchor diagram',
    !!widgetBlock && widgetBlock.title === 'Title or Towel' && widgetBlock.anchor === 'diagram');
  const handsBox = lessonData.blocks.find(b => b.type === 'box' && b.title === 'What Is in Your Hands?');
  check('203-04.json What Is in Your Hands? box removed in the streamlined lesson (now one sentence)',
    !handsBox);

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
      check(`${tag}: approved dark header title & badge`, hdr.title === 'Title or Towel' && hdr.badge === '203-04');
      check(`${tag}: approved dark header colors/type`,
        hdr.bg === 'rgb(44, 36, 22)' && hdr.color === 'rgb(250, 248, 243)' &&
        hdr.font === '17px' && hdr.badgeColor === 'rgb(229, 222, 201)');
      check(`${tag}: compact header layout (${Math.round(hdr.height)}px, gap=${Math.round(hdr.gap)}px)`,
        hdr.gap >= 7 && hdr.height >= 32 && hdr.height <= 60);

      const cardHeight = await page.locator('#card-content').evaluate(e => e.getBoundingClientRect().height);
      const widgetHeight = await page.locator('#widget').evaluate(e => e.getBoundingClientRect().height);
      const cardVar = await page.locator('#widget').evaluate(e => e.style.getPropertyValue('--card-h'));
      const stepCount = await page.locator('.step-dot').count();
      check(`${tag}: five step dots present`, stepCount === 5);

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

      // No intro/opening card covering the stage; full pyramid + scale visible at Start (step 0)
      const startState = await page.evaluate(() => ({
        hasOpeningCue: !!document.querySelector('.opening-cue, #opening-cue'),
        specVis: document.getElementById('spectrum-area').classList.contains('is-visible') &&
                 getComputedStyle(document.getElementById('spectrum-area')).opacity === '1',
        peersVis: document.getElementById('peers-layer').classList.contains('is-visible') &&
                  getComputedStyle(document.getElementById('peers-layer')).opacity === '1',
        heroVis: document.getElementById('hero-group').classList.contains('is-visible') &&
                 getComputedStyle(document.getElementById('hero-group')).opacity === '1',
        heroPos: document.getElementById('hero-group').getAttribute('transform'),
        scaleLabel: document.getElementById('spec-mode-label').textContent.trim(),
        flipped: document.getElementById('flip-group').classList.contains('is-flipped'),
        popupVis: document.getElementById('well-done-popup').classList.contains('is-visible')
      }));
      check(`${tag}: no opening card over stage`, !startState.hasOpeningCue);
      check(`${tag}: full pyramid and THE WORLD scale visible at Start`,
        startState.specVis && startState.peersVis && startState.heroVis &&
        startState.heroPos === 'translate(306.0,203.0)' &&
        startState.scaleLabel === 'THE WORLD' && !startState.flipped && !startState.popupVis);

      // Walk through all 5 steps (0..4)
      for (let s = 0; s < stepCount; s++) {
        if (s > 0) {
          await page.locator('#next-btn').click();
          const dur = Number(await page.locator('#widget').getAttribute('data-step-dur')) || 0;
          if (job.reducedMotion === 'reduce') {
            check(`${tag}: reduced motion instant step ${s}`,
              dur === 0 && await page.locator('#widget').evaluate(e => e.classList.contains('is-instant')));
          }
          await page.waitForTimeout(job.reducedMotion === 'reduce' ? 60 : Math.max(220, dur + 360));
        }

        check(`${tag}: active dot step ${s}`,
          await page.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step') === String(s));
        check(`${tag}: heading, ESV verse, ref, and note exact on step ${s}`,
          (await page.locator('#card-heading').textContent()) === EXPECTED_CARDS[s].heading &&
          (await page.locator('#card-verse-text').textContent()) === EXPECTED_CARDS[s].verse &&
          (await page.locator('#card-ref').textContent()) === EXPECTED_CARDS[s].ref &&
          (await page.locator('#card-note').textContent()) === EXPECTED_CARDS[s].note);
        check(`${tag}: no leading number in heading on step ${s}`,
          !/^\d+\./.test(await page.locator('#card-heading').textContent()));
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

        const svgState = await page.evaluate(() => {
          const fills = Array.from(document.querySelectorAll('#peers-layer circle')).map(c => c.getAttribute('fill'));
          const popupText = document.getElementById('well-done-popup').textContent.replace(/\s+/g, ' ').trim();
          return {
            flipped: document.getElementById('flip-group').classList.contains('is-flipped'),
            scaleLabel: document.getElementById('spec-mode-label').textContent.trim(),
            highLabel: document.getElementById('spec-high-txt').textContent.trim(),
            lowLabel: document.getElementById('spec-low-txt').textContent.trim(),
            popupText,
            popupVis: document.getElementById('well-done-popup').classList.contains('is-visible'),
            youGlowVis: document.getElementById('you-glow-layer').classList.contains('is-visible'),
            rowGlowVis: document.getElementById('serving-row-glow').classList.contains('is-visible'),
            heroPos: document.getElementById('hero-group').getAttribute('transform'),
            peerCount: fills.length,
            uniquePeerColors: new Set(fills).size,
            bandVis: document.getElementById('serving-row-band').classList.contains('is-visible'),
            frameVis: document.getElementById('finish-frame').classList.contains('is-visible'),
            nextLabel: document.getElementById('next-btn').textContent.trim(),
            loop: window.CLIMB_DOWN_LOOP.state()
          };
        });

        check(`${tag}: 4-3-2-1 pyramid has 9 peers with 9 distinct colors + 1 hero`,
          svgState.peerCount === 9 && svgState.uniquePeerColors === 9);
        check(`${tag}: scale labels GREATEST and LEAST present`,
          svgState.highLabel === 'GREATEST' &&
          svgState.lowLabel === 'LEAST' &&
          svgState.popupText.includes('"Well done, good and faithful servant."') &&
          svgState.popupText.includes('MATTHEW 25:21'));
        check(`${tag}: scale flip state correct on step ${s}`,
          svgState.flipped === (s >= 2) &&
          svgState.scaleLabel === (s >= 2 ? 'THE KINGDOM' : 'THE WORLD'));
        check(`${tag}: hero slot position on step ${s}`,
          svgState.heroPos === ((s === 1 || s === 2) ? 'translate(276.0,49.0)' : 'translate(306.0,203.0)'));
        check(`${tag}: serving row band + frame visible on steps 3-4`,
          svgState.bandVis === (s >= 3) && svgState.frameVis === (s >= 3));
        check(`${tag}: Well Done pop-up and You glow visible iff step 4`,
          svgState.popupVis === (s === 4) && svgState.youGlowVis === (s === 4) && svgState.rowGlowVis === (s === 4));

        if (s === 4) {
          check(`${tag}: step 4 button reads Start Over`, svgState.nextLabel === 'Start Over');
          if (job.reducedMotion === 'reduce') {
            check(`${tag}: step 4 loop stopped under reduced motion`,
              !svgState.loop.active && svgState.loop.loopState === 'stopped');
          } else {
            check(`${tag}: step 4 loop active and running on screen`,
              svgState.loop.active && !svgState.loop.paused && svgState.loop.loopState === 'running');
          }
        }

        if (SCREENSHOT_DIR && tag === 'standalone/390/no-preference') {
          await page.locator('#widget').screenshot({ path: path.join(SCREENSHOT_DIR, `step-${s}.png`) });
        }
      }

      // Zero idle DOM mutations on Step 4 (even while CSS loop pulses!)
      await page.waitForTimeout(160);
      await page.evaluate(() => {
        window.__idleMut = 0;
        new MutationObserver(ms => { window.__idleMut += ms.length; })
          .observe(document.getElementById('widget'), { subtree: true, attributes: true, childList: true, characterData: true });
      });
      await page.waitForTimeout(450);
      check(`${tag}: zero idle DOM mutations on step 4`, await page.evaluate(() => window.__idleMut) === 0);

      // Back from step 4 restores step 3 instantly and removes the pop-up & glow
      await page.locator('#prev-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Back from step 4 restores step 3 instantly and removes pop-up & glow`,
        await page.locator('#widget').getAttribute('data-step') === '3' &&
        await page.locator('#widget').getAttribute('data-step-dur') === '0' &&
        !(await page.locator('#well-done-popup').evaluate(e => e.classList.contains('is-visible'))) &&
        !(await page.locator('#you-glow-layer').evaluate(e => e.classList.contains('is-visible'))));

      // Jump to step 4 then Start Over restores step 0 with full pyramid visible
      await page.locator('.step-dot[data-step="4"]').click();
      await page.waitForTimeout(60);
      await page.locator('#next-btn').click();
      await page.waitForTimeout(60);
      check(`${tag}: Start Over restores step 0 with pyramid visible`,
        await page.locator('#widget').getAttribute('data-step') === '0' &&
        await page.locator('#prev-btn').isDisabled() &&
        await page.locator('#hero-group').getAttribute('transform') === 'translate(306.0,203.0)');

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
      check(`${tag}: iframe title attribute is Title or Towel`, (await iframeEl.getAttribute('title')) === 'Title or Towel');

      // Verify anchor="diagram" moved to the widget wrapper and not on the box, and contents Diagram row title is Title or Towel
      const anchorOnWidget = await lesson.evaluate(el => {
        const w = el.querySelector('iframe[src*="widgets/climb-down-lift-up.html"]');
        const wHost = w ? w.closest('.block-widget') : null;
        const box = Array.from(el.querySelectorAll('.block-box')).find(b => b.textContent.includes('What Is in Your Hands?'));
        const tocLink = el.querySelector('a.lesson-contents-row[href="#jump-diagram"]');
        return {
          widgetAnchored: !!(wHost && wHost.getAttribute('data-jump') === 'diagram'),
          boxAnchored: !!(box && box.getAttribute('data-jump') === 'diagram'),
          tocText: tocLink ? tocLink.textContent.replace(/\s+/g, ' ').trim() : ''
        };
      });
      check(`${tag}: diagram anchor moved from box to widget block and contents row updated`,
        anchorOnWidget.widgetAnchored && !anchorOnWidget.boxAnchored &&
        anchorOnWidget.tocText.includes('Title or Towel'));

      // Existing lesson structure & questions preserved
      check(`${tag}: all active questions rendered`,
        await lesson.locator('.question-textarea').count() === activeQuestions.length);
      check(`${tag}: "What Is in Your Hands?" box removed (now one sentence)`,
        await lesson.locator('.block-box .box-title').filter({ hasText: 'What Is in Your Hands?' }).count() === 0);

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

      // Step 0 -> 4 embedded
      for (let s = 1; s < EXPECTED_CARDS.length; s++) {
        await frame.locator('#next-btn').click();
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
        await iframeEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'embedded-390-step-4.png') });
      }

      // Offscreen pause check on Step 4
      if (job.reducedMotion === 'no-preference') {
        const onState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 4 loop running while onscreen`, onState.active && !onState.paused);

        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(250);
        const offState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 4 loop pauses when scrolled offscreen`, offState.active && offState.paused);

        await iframeEl.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 96, behavior: 'instant' }));
        await page.waitForTimeout(250);
        const backState = await frame.evaluate(() => window.CLIMB_DOWN_LOOP.state());
        check(`${tag}: step 4 loop resumes when scrolled back onscreen`, backState.active && !backState.paused);
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
  console.log(`${passed} 203-04 Title or Towel checks passed.`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
