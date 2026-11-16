#!/usr/bin/env node
// Standalone browser check for 101-07 The 180 widget (Studio Wash Edition).
// Lesson files remain untouched until review approval.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const WIDGET_URL =
  process.env.GT_WIDGET_URL || 'http://127.0.0.1:8816/widgets/stop-turn-walk.html';
const SCREENSHOT_DIR = process.env.GT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const EXPECTED = [
  {
    name: 'start',
    title: 'Which Way Are You Facing?',
    verse: '',
    text: 'Every follower of Jesus drifts sometimes. Repentance is a 180-degree turn back to Him.'
  },
  {
    name: 'stop',
    title: 'Stop',
    verse: '"If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness." (1 John 1:9)',
    text: 'Be honest with God that you are headed the wrong way. Name your sin without excuses.'
  },
  {
    name: 'turn',
    title: 'Turn',
    verse: '"you turned to God from idols to serve the living and true God" (1 Thessalonians 1:9)',
    text: 'Turn all the way around, away from your sin and back to Jesus.'
  },
  {
    name: 'walk',
    title: 'Walk',
    verse: '"Repent therefore, and turn back, that your sins may be blotted out, that times of refreshing may come from the presence of the Lord" (Acts 3:19)',
    text: 'Walk forward forgiven, with Jesus, in the new direction. You can make this turn on any day.'
  }
];

let passed = 0;
function ck(label, cond) {
  assert.ok(cond, label);
  passed++;
}

(async () => {
  const htmlSrc = fs.readFileSync(
    path.resolve(__dirname, '../widgets/stop-turn-walk.html'),
    'utf8'
  );
  // Check zero em dashes anywhere in widget source
  ck('source zero em dashes', !htmlSrc.includes('\u2014'));
  // Strip CSS/JS event keywords and verbatim ESV verse strings before checking author text
  const srcWithoutCodeAndVerses = EXPECTED.reduce(
    (s, e) => (e.verse ? s.replace(e.verse, '') : s),
    htmlSrc
  )
    .replace(/-webkit-tap-highlight-color/g, '')
    .replace(/addEventListener\('click'/g, '')
    .replace(/\bonClick\b/g, '');
  ck(
    'source avoids forbidden words outside verbatim quotes',
    !/\b(we|us|our|diagram|tap|click)\b/i.test(srcWithoutCodeAndVerses)
  );
  ck('source omits SVG title hover tooltip', !/<svg[\s\S]*?<title\b/i.test(htmlSrc));

  const launchOpts = { headless: true };
  if (process.env.GT_CHROMIUM_PATH) launchOpts.executablePath = process.env.GT_CHROMIUM_PATH;
  else launchOpts.channel = 'chrome';

  const browser = await chromium.launch(launchOpts);
  try {
    const cases = [
      { width: 375, height: 667, motion: 'no-preference' },
      { width: 390, height: 844, motion: 'no-preference' },
      { width: 1280, height: 800, motion: 'no-preference' },
      { width: 390, height: 844, motion: 'reduce' }
    ];

    for (const c of cases) {
      const tag = c.width + '/' + c.motion;
      const context = await browser.newContext({
        viewport: { width: c.width, height: c.height },
        reducedMotion: c.motion
      });

      try {
        await context.route('**/favicon.ico', r => r.fulfill({ status: 204, body: '' }));
        await context.addInitScript(() => {
          window.__stwStorageWrites = 0;
          for (const name of ['setItem', 'removeItem', 'clear']) {
            const orig = Storage.prototype[name];
            Storage.prototype[name] = function (...args) {
              window.__stwStorageWrites++;
              return orig.apply(this, args);
            };
          }
        });

        const page = await context.newPage();
        const errors = [];
        const consoleErrors = [];
        const httpErrors = [];
        page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => {
          if (r.status() >= 400) httpErrors.push(r.status() + ' ' + r.url());
        });

        await page.goto(WIDGET_URL);
        await page.locator('.title-bar h1').waitFor();
        await page.waitForTimeout(200);

        const snap = async name => {
          if (SCREENSHOT_DIR && c.width === 390 && c.motion === 'no-preference') {
            await page.locator('#widget').screenshot({
              path: path.join(SCREENSHOT_DIR, 'stw-' + name + '.png')
            });
          }
        };

        const hdr = await page.evaluate(() => {
          const h = document.querySelector('.title-bar');
          const t = h.querySelector('h1');
          const tagEl = h.querySelector('.course-tag');
          return {
            title: t.textContent.trim(),
            courseTag: tagEl.textContent.trim(),
            bg: getComputedStyle(h).backgroundColor,
            color: getComputedStyle(t).color,
            fontSize: getComputedStyle(t).fontSize,
            tagColor: getComputedStyle(tagEl).color
          };
        });
        ck(tag + ' header text', hdr.title === 'The 180' && hdr.courseTag === '101-07');
        ck(
          tag + ' header Studio Wash colors',
          hdr.bg === 'rgb(44, 36, 22)' &&
            hdr.color === 'rgb(250, 248, 243)' &&
            hdr.fontSize === '17px' &&
            hdr.tagColor === 'rgb(229, 222, 201)'
        );

        const dotCount = await page.locator('.step-dot').count();
        ck(tag + ' 4 step dots', dotCount === 4);

        const cardHeight = () =>
          page.locator('.verse-card').evaluate(el => Math.round(el.getBoundingClientRect().height));
        const h0 = await cardHeight();

        const checkStep = async (exp, label) => {
          const info = await page.evaluate(() => {
            const card = document.querySelector('.verse-card');
            const title = document.querySelector('.verse-card-title');
            const quote = document.querySelector('.verse-card-quote');
            const text = document.querySelector('.verse-card-text');
            const widget = document.getElementById('widget');
            const svg = document.getElementById('turn-svg');
            const sr = svg.getBoundingClientRect();
            const wr = widget.getBoundingClientRect();
            const dotsOk = [...document.querySelectorAll('.step-dot')].every(d => {
              const r = d.getBoundingClientRect();
              return r.width >= 28 && r.height >= 28;
            });
            const navBtnsOk = [...document.querySelectorAll('.nav-btn')].every(b => {
              const r = b.getBoundingClientRect();
              return r.height >= 44;
            });
            return {
              title: title ? title.textContent.trim() : '',
              quote: quote ? quote.textContent.trim() : '',
              text: text ? text.textContent.trim() : '',
              cardH: card.getBoundingClientRect().height,
              widgetH: wr.height,
              overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
              svgVisible: sr.width > 200 && sr.height > 100,
              dotsOk,
              navBtnsOk
            };
          });
          ck(tag + ' ' + label + ' exact card title', info.title === exp.title);
          ck(tag + ' ' + label + ' exact verse', info.quote === exp.verse);
          ck(tag + ' ' + label + ' exact text', info.text === exp.text);
          ck(tag + ' ' + label + ' locked card height', Math.abs(info.cardH - h0) <= 1);
          ck(tag + ' ' + label + ' no horizontal overflow', !info.overflowX);
          ck(tag + ' ' + label + ' svg rendered', info.svgVisible);
          ck(tag + ' ' + label + ' dot touch targets >= 28px', info.dotsOk);
          ck(tag + ' ' + label + ' nav buttons >= 44px', info.navBtnsOk);
          if (c.width <= 390) {
            ck(tag + ' ' + label + ' compact mobile height <= 590px', info.widgetH <= 590);
          }
        };

        await checkStep(EXPECTED[0], '0-start');
        await snap('0-start');

        const waitStep = c.motion === 'reduce' ? 60 : 880;

        // Single path without dotted road lines
        ck(
          tag + ' single continuous path has no dotted lines',
          await page.locator('#single-path').evaluate(el => !el.outerHTML.includes('stroke-dasharray'))
        );

        // Keyboard Enter on Begin -> Step 1 Stop
        await page.locator('[data-control="begin"]').focus();
        await page.locator('[data-control="begin"]').press('Enter');
        await page.waitForTimeout(waitStep);
        await checkStep(EXPECTED[1], '1-stop');
        await snap('1-stop');

        // Next -> Step 2 Turn
        await page.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        await checkStep(EXPECTED[2], '2-turn');
        ck(
          tag + ' step 2 Turn faces right',
          await page.locator('#traveler').evaluate(el => /scale\(1(?:\.0+)?,\s*1\)/.test(el.getAttribute('transform')))
        );
        await snap('2-turn');

        // Next -> Step 3 Walk
        await page.locator('[data-control="next"]').click();
        await page.waitForTimeout(waitStep);
        await checkStep(EXPECTED[3], '3-walk');
        ck(
          tag + ' step 3 Jesus companion visible',
          await page.locator('#jesus-companion').evaluate(el => el.classList.contains('is-on'))
        );
        await snap('3-walk');

        // Idle DOM mutation check (widget.md: 0 mutations when idle)
        const idleMutations = await page.evaluate(
          () =>
            new Promise(resolve => {
              let count = 0;
              const mo = new MutationObserver(() => { count++; });
              mo.observe(document.body, { childList: true, subtree: true, attributes: true });
              setTimeout(() => { mo.disconnect(); resolve(count); }, 900);
            })
        );
        ck(tag + ' zero DOM mutations while idle', idleMutations === 0);

        // Back navigation to Step 2 and Start Over
        await page.locator('[data-control="back"]').click();
        await page.waitForTimeout(waitStep);
        await checkStep(EXPECTED[2], 'back-to-2-turn');

        await page.locator('.step-dot').nth(3).click();
        await page.waitForTimeout(waitStep);
        await page.locator('[data-control="restart"]').click();
        await page.waitForTimeout(120);
        await checkStep(EXPECTED[0], 'restart-to-0-start');

        // Height-only resize keeps card height intact
        await page.setViewportSize({ width: c.width, height: c.height - 80 });
        await page.waitForTimeout(200);
        ck(tag + ' height-only resize keeps locked card height', Math.abs((await cardHeight()) - h0) <= 1);

        ck(tag + ' zero localStorage writes', (await page.evaluate(() => window.__stwStorageWrites)) === 0);
        ck(tag + ' zero HTTP errors', httpErrors.length === 0);
        ck(tag + ' zero console/page errors: ' + JSON.stringify({ consoleErrors, errors }), consoleErrors.length === 0 && errors.length === 0);
      } finally {
        await context.close();
      }
    }

    console.log('ALL CHECKS PASSED (' + passed + ' assertions)');
  } finally {
    await browser.close();
  }
})();
