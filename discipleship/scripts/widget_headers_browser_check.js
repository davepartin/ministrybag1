#!/usr/bin/env node
// Embedded header regression for PR220. Serve discipleship/ first.
// GT_BASE_URL selects an exact preview; GT_CHROMIUM_PATH selects local Chromium.
'use strict';
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8804/index.html';
const screenshots = process.env.GT_SCREENSHOT_DIR;
if (screenshots) fs.mkdirSync(screenshots, { recursive: true });
const entries = [
  ...['201', '202', '203'].map(c => ({ course: c, n: 1, file: 'great-command-v5-' + c + '.html', title: 'The Greatest Commandment' })),
  ...[['cross-the-road', 'Cross the Road'], ['cornerstone', 'Building From the Cornerstone'], ['one-another', 'One Another'], ['five-gardeners', 'Five Farmers, One Field'], ['trust-the-artist', 'Trust the Creator'], ['mirror-angles', "Reflecting God's Worth"], ['stewardship-three-ts', 'Time, Talents, Treasure'], ['covenant-triangle', 'The Closer to God Triangle'], ['starting-gun', 'RUN from Sin'], ['two-ordinances', 'The Doorway and the Table']].map(([f, title], i) => ({ course: '202', n: i + 1, file: f + '.html', title }))
];
const jobs = entries.flatMap(entry => [375, 390, 1280].flatMap(width => ['no-preference', 'reduce'].map(motion => ({ ...entry, width, motion }))));
let checks = 0;
function ck(label, value) { checks++; assert.ok(value, label); }
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) });
  const failures = [];
  async function run(job) {
    const { course, n, file, title, width, motion } = job;
    const lessonTag = course + '-' + String(n).padStart(2, '0'), tag = file + '/' + width + '/' + motion;
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/' + lessonTag + '.json')));
    const questions = data.blocks.filter(b => b.type === 'question');
    const seed = Object.fromEntries(questions.map((q, i) => ['question-' + course + '-' + q.id, 'SYN-headers-' + i]));
    seed['question-101-1-1'] = 'SYN-headers-other-course';
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
    try {
      await context.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
      await context.addInitScript(seed => {
        window.__headerStorageWrites = 0;
        for (const name of ['setItem', 'removeItem', 'clear']) {
          const original = Storage.prototype[name];
          Storage.prototype[name] = function (...args) { if (window !== window.top) window.__headerStorageWrites++; return original.apply(this, args); };
        }
        if (window === window.top && !sessionStorage.getItem('header-seeded')) {
          localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed)); sessionStorage.setItem('header-seeded', '1');
        }
      }, seed);
      const page = await context.newPage(), errors = [], httpErrors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.url().includes('/widgets/') && r.status() >= 400) httpErrors.push(r.status() + ' ' + r.url()); });
      await page.goto(base + '#' + course + '-' + n);
      const lesson = page.locator('#session-' + n), frameEl = lesson.locator('iframe[src*="widgets/' + file + '"]');
      await frameEl.waitFor();
      const frame = await (await frameEl.elementHandle()).contentFrame();
      await frame.locator('.title-bar h1').waitFor(); await page.waitForTimeout(200);
      ck(tag + ' correct single embed', await frameEl.count() === 1);
      ck(tag + ' original question fields', await lesson.locator('.question-textarea').count() === questions.length);
      for (const [key, value] of Object.entries(seed).filter(([k]) => k !== 'question-101-1-1')) ck(tag + ' restores ' + key, await lesson.locator('#' + key).inputValue() === value);
      const saved = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));
      let states = 0;
      async function inspect() {
        states++;
        const s = await frame.evaluate(() => {
          const h = document.querySelector('.title-bar'), t = h.querySelector('h1'), b = h.querySelector('.course-tag');
          const hr = h.getBoundingClientRect(), tr = t.getBoundingClientRect(), br = b.getBoundingClientRect();
          return { title: t.textContent.trim(), badge: b.textContent.trim(), bg: getComputedStyle(h).backgroundColor, color: getComputedStyle(t).color, font: getComputedStyle(t).fontSize, badgeColor: getComputedStyle(b).color, gap: br.left - tr.right, height: hr.height, left: tr.left - hr.left, right: hr.right - br.right, fit: document.documentElement.scrollWidth <= innerWidth + 1, contentHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) };
        });
        ck(tag + ' title/tag state ' + states, s.title === title && s.badge === lessonTag);
        ck(tag + ' approved colors/type state ' + states, s.bg === 'rgb(44, 36, 22)' && s.color === 'rgb(250, 248, 243)' && s.font === '17px' && s.badgeColor === 'rgb(229, 222, 201)');
        ck(tag + ' left/right layout state ' + states, s.gap >= 7 && s.left >= 10 && s.right >= 10 && s.height >= 34 && s.height <= 60);
        ck(tag + ' page/frame width state ' + states, s.fit && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        ck(tag + ' host includes content state ' + states, await frameEl.evaluate(e => e.clientHeight) >= s.contentHeight - 1);
      }
      async function tap(locator) {
        await locator.click();
        const duration = file.startsWith('great-command-v5-') ? Number(await frame.locator('#widget').getAttribute('data-step-dur')) || 0 : 0;
        await page.waitForTimeout(motion === 'reduce' ? 40 : Math.max(250, duration + 350));
        await inspect();
      }
      await inspect();
      if (file === 'one-another.html') {
        const cards = frame.locator('.ocard'); for (let i = 0; i < await cards.count(); i++) await tap(cards.nth(i));
        await tap(frame.locator('[data-control="pick"]')); await tap(frame.locator('[data-control="clear"]'));
      } else if (file === 'mirror-angles.html') {
        const angles = frame.locator('.angle-btn'); for (let i = 0; i < await angles.count(); i++) await tap(angles.nth(i));
        ck(tag + ' mirror final angle', await frame.locator('#app').evaluate(e => e.classList.contains('is-45')));
      } else if (file === 'stewardship-three-ts.html') {
        const tabs = frame.locator('.step-tab'); for (let i = 0; i < await tabs.count(); i++) await tap(tabs.nth(i));
        ck(tag + ' whole picture reached', await frame.locator('#widget').evaluate(e => e.classList.contains('is-whole')));
      } else if (file === 'two-ordinances.html') {
        const facets = frame.locator('.facet'); for (let i = 0; i < await facets.count(); i++) { await tap(facets.nth(i)); ck(tag + ' facet active ' + i, await facets.nth(i).getAttribute('aria-pressed') === 'true'); }
      } else {
        let finished = false;
        for (let i = 0; i < 16; i++) {
          // Use the navigation control, not a named step dot such as
          // "Start: Love Begins With God", which also contains "Begin".
          const next = frame.locator('button.begin-btn, .nav-btn.primary').first();
          ck(tag + ' navigation available ' + i, await next.count() > 0);
          const name = await next.textContent();
          if (/Restart|Start Over/.test(name)) { finished = true; break; }
          await tap(next);
          if (file === 'starting-gun.html' && await frame.locator('[data-control="run"]').count()) await tap(frame.locator('[data-control="run"]'));
        }
        ck(tag + ' final teaching state reached', finished);
      }
      await page.waitForTimeout(1800); await inspect();
      if (screenshots && width === 390 && motion === 'no-preference') {
        // Keep the lesson's sticky toolbar clear of the widget header.
        await frameEl.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 100, behavior: 'instant' }));
        await frameEl.screenshot({ path: path.join(screenshots, file.replace('.html', '') + '-390.png') });
      }
      await frameEl.evaluate(e => { window.__headerHeightWrites = 0; new MutationObserver(ms => window.__headerHeightWrites += ms.length).observe(e, { attributes: true, attributeFilter: ['style'] }); });
      await page.waitForTimeout(350);
      ck(tag + ' idle iframe stable', await page.evaluate(() => __headerHeightWrites) === 0);
      ck(tag + ' widget never writes answers', await frame.evaluate(() => __headerStorageWrites) === 0 && await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === saved);
      if (width === 390 && motion === 'no-preference') {
        const key = 'question-' + course + '-' + questions[0].id;
        await lesson.locator('#' + key).fill('SYN-headers-edited'); await page.reload(); await lesson.waitFor();
        ck(tag + ' answer edit survives reload', await lesson.locator('#' + key).inputValue() === 'SYN-headers-edited');
        ck(tag + ' other-course answer preserved', await page.evaluate(() => JSON.parse(localStorage.getItem('christianFoundationsResponses'))['question-101-1-1']) === 'SYN-headers-other-course');
      }
      ck(tag + ' no page/widget HTTP errors', errors.length === 0 && httpErrors.length === 0);
      console.log('PASS ' + tag + ' states=' + states);
    } finally { await context.close(); }
  }
  try {
    let cursor = 0;
    await Promise.all([0, 1, 2].map(async () => { while (cursor < jobs.length) { const job = jobs[cursor++]; try { await run(job); } catch (e) { failures.push(job.file + '/' + job.width + '/' + job.motion + ': ' + e.stack); console.error('FAIL ' + failures[failures.length - 1]); } } }));
    if (failures.length) throw Error(failures.join('\n'));
    console.log(checks + ' widget header checks passed across ' + jobs.length + ' embedded cases');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
