#!/usr/bin/env node
// Regression check for 202-10 What Baptism Pictures widget (Studio Wash Edition).
// Serves nothing itself; pass GT_BASE_URL or start python3 -m http.server in discipleship/.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8815/index.html';
const SCREENSHOT_DIR = process.env.GT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let passed = 0;
function ck(label, cond) {
  assert.ok(cond, label);
  passed++;
}

(async () => {
  const launchOpts = { headless: true };
  if (process.env.GT_CHROMIUM_PATH) launchOpts.executablePath = process.env.GT_CHROMIUM_PATH;
  else launchOpts.channel = 'chrome';

  const browser = await chromium.launch(launchOpts);
  try {
    const lessonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../data/202-10.json'), 'utf8')
    );
    const questions = lessonData.blocks.filter(b => b.type === 'question');
    const seed = Object.fromEntries(
      questions.map((q, i) => ['question-202-' + q.id, 'SYN-bap-' + i])
    );

    const cases = [
      { width: 375, motion: 'no-preference' },
      { width: 390, motion: 'no-preference' },
      { width: 1280, motion: 'no-preference' },
      { width: 390, motion: 'reduce' }
    ];

    for (const c of cases) {
      const tag = c.width + '/' + c.motion;
      const context = await browser.newContext({
        viewport: { width: c.width, height: 844 },
        reducedMotion: c.motion
      });

      try {
        await context.route('**/scripts/account.js', r =>
          r.fulfill({ body: '', contentType: 'text/javascript' })
        );
        await context.addInitScript(s => {
          window.__bapStorageWrites = 0;
          for (const name of ['setItem', 'removeItem', 'clear']) {
            const orig = Storage.prototype[name];
            Storage.prototype[name] = function (...args) {
              if (window !== window.top) window.__bapStorageWrites++;
              return orig.apply(this, args);
            };
          }
          if (window === window.top && !sessionStorage.getItem('bap-seeded')) {
            localStorage.setItem('christianFoundationsResponses', JSON.stringify(s));
            sessionStorage.setItem('bap-seeded', '1');
          }
        }, seed);

        const page = await context.newPage();
        const errors = [];
        const httpErrors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => {
          if (r.url().includes('/widgets/') && r.status() >= 400) {
            httpErrors.push(r.status() + ' ' + r.url());
          }
        });

        await page.goto(BASE + '#202-10');
        const lesson = page.locator('#session-10');
        const frameEl = lesson.locator('iframe[src*="widgets/baptism-picture.html"]');
        await frameEl.waitFor();
        const frame = await (await frameEl.elementHandle()).contentFrame();
        await frame.locator('.title-bar h1').waitFor();
        await page.waitForTimeout(250);

        const snap = async name => {
          if (SCREENSHOT_DIR && c.width === 390 && c.motion === 'no-preference') {
            await frameEl.evaluate(e =>
              window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 100, behavior: 'instant' })
            );
            await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'baptism-' + name + '.png') });
          }
        };

        // 1. Studio Wash header + title/tag alignment
        const hdr = await frame.evaluate(() => {
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
        ck(tag + ' header format', hdr.title === 'Baptism' && hdr.courseTag === '202-10');
        ck(
          tag + ' header Studio Wash colors',
          hdr.bg === 'rgb(44, 36, 22)' &&
            hdr.color === 'rgb(250, 248, 243)' &&
            hdr.fontSize === '17px' &&
            hdr.tagColor === 'rgb(229, 222, 201)'
        );

        const dotCount = await frame.locator('.step-dot').count();
        ck(tag + ' 5 clickable step dots', dotCount === 5);

        const cardHeight = () =>
          frame.locator('.verse-card').evaluate(el => Math.round(el.getBoundingClientRect().height));
        const h0 = await cardHeight();
        ck(tag + ' intro card visible', (await frame.locator('.verse-card-title').textContent()).includes('Identifying with Jesus'));
        ck(tag + ' intro fits on phone screen', (await frame.locator('.widget-outer').evaluate(el => el.getBoundingClientRect().height)) <= 640);
        ck(tag + ' black figure color + removed middle line/equals/captions', (await frame.locator('#you-fig circle').getAttribute('fill')) === '#1C1915' && (await frame.locator('#center-divider').count()) === 0 && (await frame.locator('#link-badge').count()) === 0 && (await frame.locator('#cap-left').count()) === 0);
        await snap('0-intro');

        const waitStep = c.motion === 'reduce' ? 60 : 700;

        // Step 1: Death
        await frame.locator('#btn-next').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 1 Death', (await frame.locator('.verse-card-title').textContent()).includes('Crucified with Christ'));
        ck(tag + ' step 1 cross glow and Jesus on cross', (await frame.locator('#cross-glow').getAttribute('opacity')) === '1' && await frame.locator('#jesus-cross').evaluate(el => el.classList.contains('is-on')));
        ck(tag + ' step 1 waist-deep touching pastor', (await frame.locator('#you-fig').getAttribute('transform')).includes('translate(81,215)'));
        await snap('1-death');

        // Step 2: Burial
        await frame.locator('#btn-next').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 2 Burial', (await frame.locator('.verse-card-title').textContent()).includes('Buried with Him'));
        ck(tag + ' step 2 stone rolled over tomb', (await frame.locator('#tomb-stone').getAttribute('transform')).includes('translate(266,139)'));
        ck(tag + ' step 2 bent back under water + ripples', (await frame.locator('#you-fig').getAttribute('transform')).includes('rotate(-65)') && await frame.locator('#water-ripples').evaluate(el => el.classList.contains('is-on')));
        await snap('2-burial');

        // Step 3: Resurrection
        await frame.locator('#btn-next').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step 3 Resurrection', (await frame.locator('.verse-card-title').textContent()).includes('Raised with Christ'));
        ck(tag + ' step 3 stone open + risen white-robed Jesus', (await frame.locator('#tomb-stone').getAttribute('transform')).includes('translate(297,139)') && await frame.locator('#jesus-risen-front').evaluate(el => el.classList.contains('is-on')));
        ck(tag + ' separate Baptism/Jesus headers + compact viewBox + no SVG title tooltip', (await frame.locator('#baptism-svg').getAttribute('viewBox')) === '0 0 380 245' && (await frame.locator('#baptism-svg title').count()) === 0);
        await snap('3-resurrection');

        // Step 4: New Life
        await frame.locator('#btn-next').click();
        await page.waitForTimeout(waitStep);
        const hFinal = await cardHeight();
        ck(tag + ' step 4 New Life', (await frame.locator('.verse-card-title').textContent()).includes('Old Has Gone, New Has Come'));
        ck(tag + ' card height locked across all steps', Math.abs(h0 - hFinal) <= 1);
        ck(tag + ' step 4 black kneeling worshipper + Jesus turned toward man', (await frame.locator('#you-kneel circle').getAttribute('fill')) === '#1C1915' && await frame.locator('#you-kneel').evaluate(el => el.classList.contains('is-on')) && await frame.locator('#jesus-risen-turned').evaluate(el => el.classList.contains('is-on')));
        await snap('4-newlife');

        // Back button + dot jump + Start Over check
        await frame.locator('#btn-back').click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' Back returns to Resurrection', (await frame.locator('.verse-card-title').textContent()).includes('Raised with Christ'));

        await frame.locator('.step-dot').nth(2).click();
        await page.waitForTimeout(waitStep);
        ck(tag + ' step dot jumps to Burial', (await frame.locator('.verse-card-title').textContent()).includes('Buried with Him'));

        await frame.locator('.step-dot').last().click();
        await page.waitForTimeout(waitStep);
        await frame.locator('#btn-next').click();
        await page.waitForTimeout(200);
        ck(tag + ' Start Over resets to Intro', (await frame.locator('.verse-card-title').textContent()).includes('Identifying with Jesus'));

        // The placeholder two-ordinances.html widget was removed from 202-10 at Dave's direction (Nov 16)
        const twoOrdCount = await lesson.locator('iframe[src*="widgets/two-ordinances.html"]').count();
        ck(tag + ' two-ordinances placeholder removed from the lesson', twoOrdCount === 0);

        // Layout fit, existing 202-10 answers preserved, idle stability
        const frameOverflow = await frame.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        ck(tag + ' zero horizontal overflow', !frameOverflow && !pageOverflow);
        ck(tag + ' no localStorage writes from widget', (await frame.evaluate(() => window.__bapStorageWrites)) === 0);
        ck(tag + ' 202-10 answers preserved', await lesson.locator('textarea').first().evaluate((el, exp) => el.value === exp, 'SYN-bap-0'));
        ck(tag + ' SVG accessibility title/desc present', (await frame.locator('#bap-desc').textContent()).trim().length > 10);

        await frameEl.evaluate(el => {
          window.__bapHeightWrites = 0;
          new MutationObserver(ms => {
            window.__bapHeightWrites += ms.length;
          }).observe(el, { attributes: true, attributeFilter: ['style'] });
        });
        await page.waitForTimeout(500);
        ck(tag + ' zero idle iframe mutations', (await page.evaluate(() => window.__bapHeightWrites)) === 0);
        ck(tag + ' zero console/HTTP errors', errors.length === 0 && httpErrors.length === 0);
      } finally {
        await context.close();
      }
    }
    console.log('ALL CHECKS PASSED (' + passed + ' assertions)');
  } finally {
    await browser.close();
  }
})();
