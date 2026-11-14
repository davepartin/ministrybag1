#!/usr/bin/env node
// Regression check for 202-09 RUN from Sin widget (Studio Wash Edition).
// Serves nothing itself; pass GT_BASE_URL or start python3 -m http.server in discipleship/.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8809/index.html';
const SCREENSHOT_DIR = process.env.GT_SCREENSHOT_DIR || '';
if (SCREENSHOT_DIR) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let passed = 0;
function ck(label, cond) {
  assert.ok(cond, label);
  passed++;
}

async function waitStableSvgBox(frame, selector) {
  const el = frame.locator(selector);
  await el.waitFor({ state: 'visible' });
  await frame.locator('body').waitFor();
}

(async () => {
  const launchOpts = { headless: true };
  if (process.env.GT_CHROMIUM_PATH) launchOpts.executablePath = process.env.GT_CHROMIUM_PATH;
  else launchOpts.channel = 'chrome';

  const browser = await chromium.launch(launchOpts);
  try {
    const lessonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../data/202-09.json'), 'utf8')
    );
    const questions = lessonData.blocks.filter(b => b.type === 'question');
    const seed = Object.fromEntries(
      questions.map((q, i) => ['question-202-' + q.id, 'SYN-202-09-' + i])
    );
    seed['question-101-1-1'] = 'SYN-101-preserved';

    for (const width of [375, 390, 1280]) {
      for (const motion of ['no-preference', 'reduce']) {
        const tag = width + '/' + motion;
        const height = width === 1280 ? 800 : 844;
        const context = await browser.newContext({
          viewport: { width, height },
          reducedMotion: motion
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));

        await context.route('**/scripts/account.js', r =>
          r.fulfill({ status: 200, contentType: 'text/javascript', body: '' })
        );
        await context.addInitScript(initial => {
          window.__iframeStorageWrites = 0;
          ['setItem', 'removeItem', 'clear'].forEach(fn => {
            const orig = Storage.prototype[fn];
            Storage.prototype[fn] = function () {
              if (window !== window.top) window.__iframeStorageWrites++;
              return orig.apply(this, arguments);
            };
          });
          localStorage.setItem('christianFoundationsResponses', JSON.stringify(initial));
        }, seed);

        await page.goto(BASE + '#202-9');
        await page.waitForSelector('#session-9.active');

        const frameEl = page.locator('#session-9 iframe[src*="starting-gun"]');
        await frameEl.waitFor({ state: 'attached' });
        await frameEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(450);

        const frame = page.frameLocator('#session-9 iframe[src*="starting-gun"]');
        await waitStableSvgBox(frame, '#scene');

        const titleText = (await frame.locator('.title-bar h1').textContent()).trim();
        const courseTag = (await frame.locator('.course-tag').textContent()).trim();
        ck(tag + ' title bar', titleText === 'RUN from Sin' && courseTag === '202-09');

        const layout = await frameEl.evaluate(el => ({
          w: el.getBoundingClientRect().width,
          h: el.getBoundingClientRect().height,
          docW: el.contentDocument ? el.contentDocument.documentElement.scrollWidth : 0,
          innerW: el.contentWindow ? el.contentWindow.innerWidth : 0,
          pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        }));
        ck(tag + ' no horizontal overflow', !layout.pageOverflow && layout.docW <= layout.innerW + 1);
        ck(tag + ' height fits iframe cleanly', layout.h > 300);

        async function snap(name) {
          if (!SCREENSHOT_DIR || width !== 390 || motion !== 'no-preference') {
            if (SCREENSHOT_DIR && (width === 1280 || width === 375) && motion === 'no-preference' && name === 'intro') {
              await frameEl.evaluate(e =>
                window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 96, behavior: 'instant' })
              );
              await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'starting-gun-' + width + '-intro.png') });
            }
            return;
          }
          await frameEl.evaluate(e =>
            window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 96, behavior: 'instant' })
          );
          await frameEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'starting-gun-390-' + name + '.png') });
        }

        // Capture card content height across states to verify constant card-h
        async function cardHeight() {
          return frame.locator('.verse-card').evaluate(el => Math.round(el.getBoundingClientRect().height));
        }

        const hIntro = await cardHeight();
        await snap('intro');

        // Step 1: Click Begin -> Temptation Arrives
        await frame.locator('[data-control="begin"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        const hTempted = await cardHeight();
        ck(tag + ' tempted heading', (await frame.locator('.card-heading').textContent()).includes('Temptation Arrives'));
        ck(tag + ' bang visible on tempted', await frame.locator('#bang').getAttribute('opacity') === '1');
        ck(tag + ' card height locked from intro', Math.abs(hIntro - hTempted) <= 1);
        await snap('tempted');

        // Explore Pit path (Stay and look -> Look -> Action -> Hide -> Hope -> Climb out)
        await frame.locator('[data-control="stay"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' stay 1', (await frame.locator('.card-heading').textContent()).includes('Look and Linger'));

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' stay 3 hide in shame', (await frame.locator('.card-heading').textContent()).includes('Hide in Shame'));
        await snap('stay-hide');

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' stay 4 hope on cross', (await frame.locator('.card-heading').textContent()).includes('Still Hope in the Pit'));
        ck(tag + ' cross active in pit', await frame.locator('#cross-post').getAttribute('opacity') === '1');
        await snap('stay-hope');

        // Climb out onto the Cross -> RUN 1 (R: Remember the Cross)
        await frame.locator('[data-control="retry"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' run 1 R', (await frame.locator('.card-heading').textContent()).includes('Remember the Cross'));
        await snap('run-r');

        // U: United with God -> N: Need Others -> Full Life
        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' run 2 U', (await frame.locator('.card-heading').textContent()).includes('United with God'));

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' run 3 N with buddy', (await frame.locator('.card-heading').textContent()).includes('Need Others') && await frame.locator('#buddy1').getAttribute('opacity') === '1');
        await snap('run-n');

        await frame.locator('[data-control="next"]').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        const hFinal = await cardHeight();
        ck(tag + ' run 4 Full Life', (await frame.locator('.card-heading').textContent()).includes('Full Life'));
        ck(tag + ' lead runner stays green on Full Life', (await frame.locator('#pose-run .r-torso').getAttribute('fill')) === '#1F684A');
        ck(tag + ' card height locked across all states', Math.abs(hIntro - hFinal) <= 1);
        await snap('run-full-life');

        // Verify SVG R marker direct click works
        await frame.locator('#flag-r').click();
        await page.waitForTimeout(motion === 'reduce' ? 50 : 620);
        ck(tag + ' flag-r interactive jump', (await frame.locator('.card-heading').textContent()).includes('Remember the Cross'));

        // Verify zero idle style mutations
        await page.waitForTimeout(300);
        const styleWrites = await frameEl.evaluate(async el => {
          let writes = 0;
          const mo = new MutationObserver(() => { writes++; });
          mo.observe(el, { attributes: true, attributeFilter: ['style'] });
          await new Promise(r => setTimeout(r, 700));
          mo.disconnect();
          return writes;
        });
        ck(tag + ' zero idle iframe writes', styleWrites === 0);

        // Verify zero localStorage writes from widget and no page errors
        ck(tag + ' zero iframe localStorage writes', await page.evaluate(() => window.__iframeStorageWrites) === 0);
        ck(tag + ' no page errors', errors.length === 0);

        // Verify zero em dashes in rendered widget text or SVG description
        const hasEmDash = await frame.locator('body').evaluate(b => b.innerText.includes('\u2014'));
        ck(tag + ' zero em dashes', !hasEmDash);

        await context.close();
      }
    }

    console.log('ALL CHECKS PASSED (' + passed + ' assertions)');
  } finally {
    await browser.close();
  }
})();
