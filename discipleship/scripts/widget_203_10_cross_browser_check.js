#!/usr/bin/env node
'use strict';
// 203-10 series finale: the Greatest Commandment cross (great-command-v5.js, version 203-10)
// with the Welcome Home loop on the last step, its place at the end of the 203-10 lesson, and a guard that
// the 201, 202 and 203 versions of the same cross are unchanged. Synthetic navigation only.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const BASE = process.env.CROSS_20310_BASE_URL || 'http://127.0.0.1:8835/';
const engine = fs.readFileSync(path.join(ROOT, 'widgets/great-command-v5.js'), 'utf8');
const wrapper = fs.readFileSync(path.join(ROOT, 'widgets/great-command-v5-203-10.html'), 'utf8');
const lesson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/203-10.json'), 'utf8'));
const HEADINGS = ['The Greatest Commandment', 'Love Comes Down, Goes Up, and Reaches Out', 'Welcome Home'];

let checks = 0;
function ck(label, ok, detail) {
  checks++;
  assert.ok(ok, label + (detail !== undefined ? ' | ' + detail : ''));
}

async function read(page) {
  return page.evaluate(() => {
    const w = document.getElementById('widget');
    const card = document.getElementById('card-content');
    const loop = window.GC_WELCOME_LOOP ? window.GC_WELCOME_LOOP.state() : null;
    const contour = document.querySelector('.cross-contour');
    return {
      tag: document.querySelector('.course-tag').textContent,
      heading: document.getElementById('card-heading').textContent,
      count: document.getElementById('step-count').textContent,
      next: document.getElementById('next-btn').textContent,
      cardH: Math.round(card.getBoundingClientRect().height),
      widgetH: Math.round(w.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      loop,
      canvases: document.querySelectorAll('canvas.welcome-loop').length,
      contourDrawn: contour ? contour.style.strokeDashoffset === '0' : false,
      dots: document.querySelectorAll('.step-dot').length
    };
  });
}

(async () => {
  ck('no em dashes in the cross engine or wrapper', !/—/.test(engine) && !/—/.test(wrapper));
  ck('wrapper asks for version 203-10', /GREAT_COMMAND_VERSION = '203-10'/.test(wrapper));
  ck('203-10 has exactly one widget, the cross finale', lesson.blocks.filter(b => b.type === 'widget').length === 1 &&
    lesson.blocks.some(b => b.type === 'widget' && b.src === 'widgets/great-command-v5-203-10.html' && b.anchor === 'diagram'));
  ck('Romans 12:9-21 is back as Scripture', lesson.blocks.some(b => b.type === 'verse' && b.reference === 'Romans 12:9-21' &&
    b.text.startsWith('Let love be genuine.') && b.text.endsWith('overcome evil with good.')));
  const iMark = lesson.blocks.findIndex(b => b.type === 'verse' && b.reference === 'Mark 12:30-31');
  ck('cross follows Mark 12:30-31', lesson.blocks[iMark + 1].type === 'widget');
  ck('contents has Story, Study and Diagram', JSON.stringify(lesson.contents.map(c => c.label)) === '["Story","Study","Diagram"]' &&
    lesson.contents[2].anchor === 'diagram');

  const browser = await chromium.launch({ headless: true, executablePath: process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium' });
  try {
    for (const width of [320, 375, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(BASE + 'widgets/great-command-v5-203-10.html', { waitUntil: 'load' });
      await page.waitForTimeout(400);
      let s = await read(page);
      ck(width + ': header tag reads 203-10', s.tag === '203-10', s.tag);
      ck(width + ': three step dots', s.dots === 3);
      ck(width + ': one loop canvas, idle at start', s.canvases === 1 && s.loop && !s.loop.wanted && !s.loop.running);
      const cardH = s.cardH, widgetH = s.widgetH;
      for (let i = 1; i <= 2; i++) {
        await page.click('#next-btn');
        s = await read(page);
        ck(width + ': step ' + i + ' heading', s.heading === HEADINGS[i], s.heading);
        ck(width + ': step ' + i + ' card height steady', s.cardH === cardH, s.cardH + ' vs ' + cardH);
        ck(width + ': step ' + i + ' widget height steady', s.widgetH === widgetH, s.widgetH + ' vs ' + widgetH);
        ck(width + ': step ' + i + ' no sideways scroll', !s.overflowX);
        if (i === 1) {
          // One click: all four beams sweep together, and the crimson outline waits until they finish.
          await page.waitForTimeout(1500);
          const mid = await page.evaluate(() => ({
            sweeping: document.querySelectorAll('.sweep-arrow.is-active').length,
            contourOffset: Number(document.querySelector('.cross-contour').style.strokeDashoffset),
            contourLen: Number(document.querySelector('.cross-contour').dataset.len)
          }));
          ck(width + ': one click sweeps all four beams at once', mid.sweeping === 4, JSON.stringify(mid));
          ck(width + ': the outline waits for the beams', mid.contourOffset === mid.contourLen, JSON.stringify(mid));
          await page.waitForTimeout(8000);
          s = await read(page);
          ck(width + ': then the crimson outline traces the cross', s.contourDrawn);
        } else {
          await page.waitForTimeout(1500);
        }
      }
      s = await read(page);
      ck(width + ': finale keeps the crimson cross', s.contourDrawn);
      ck(width + ': loop starts with church members and a crowd of seven', s.loop.running && s.loop.members === 4 && s.loop.crowd === 7,
        JSON.stringify(s.loop));
      const long = await page.evaluate(() => {
        const L = window.GC_WELCOME_LOOP;
        const seen = { crowdMin: 99, crowdMax: 0, membersMax: 0 };
        for (let k = 0; k < 120; k++) {
          L.advance(1);
          const st = L.state();
          seen.crowdMin = Math.min(seen.crowdMin, st.crowd);
          seen.crowdMax = Math.max(seen.crowdMax, st.crowd);
          seen.membersMax = Math.max(seen.membersMax, st.members);
        }
        return Object.assign(seen, L.state());
      });
      ck(width + ': two minutes of loop: missions keep going', long.missions >= 18, JSON.stringify(long));
      ck(width + ': the crowd keeps filling back up', long.crowdMin >= 4 && long.crowdMax === 7, JSON.stringify(long));
      ck(width + ': the family arm never overflows', long.membersMax <= 8, JSON.stringify(long));
      ck(width + ': last step offers Start Over', /Start Over/.test(s.next) && s.count === 'Step 2 of 2');
      if (width === 390) {
        const muts = await page.evaluate(() => new Promise(res => {
          let n = 0;
          const mo = new MutationObserver(l => { n += l.length; });
          mo.observe(document.body, { subtree: true, childList: true, attributes: true });
          setTimeout(() => { mo.disconnect(); res(n); }, 1500);
        }));
        ck('390: the loop changes nothing in the page while it runs', muts === 0, muts);
      }
      await page.click('#prev-btn');
      s = await read(page);
      ck(width + ': Back to step 1 stops the loop', s.heading === HEADINGS[1] && !s.loop.running && !s.loop.wanted && s.contourDrawn);
      await page.click('.step-dot[data-step="0"]');
      s = await read(page);
      ck(width + ': dot back to the start lands at once with no loop', s.heading === HEADINGS[0] && !s.loop.wanted && !s.contourDrawn);
      await page.click('.step-dot[data-step="2"]');
      await page.waitForTimeout(9500);
      s = await read(page);
      ck(width + ': dot jump forward to the finale starts the loop again', s.loop.running && s.contourDrawn, JSON.stringify([s.loop, s.contourDrawn, s.heading]));
      ck(width + ': no page errors', errors.length === 0, errors.join(' | '));
      await page.close();
    }

    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const rp = await ctx.newPage();
    await rp.goto(BASE + 'widgets/great-command-v5-203-10.html', { waitUntil: 'load' });
    for (let i = 0; i < 2; i++) await rp.click('#next-btn');
    await rp.waitForTimeout(1000);
    const rs = await read(rp);
    ck('reduced motion: finale shows a still picture, no loop', rs.loop.wanted && !rs.loop.running && rs.loop.seconds === 0 && rs.contourDrawn,
      JSON.stringify(rs.loop));
    await ctx.close();

    for (const [v, dots, tag] of [['201', 6, '201-01'], ['202', 5, '202-01'], ['203', 5, '203-01']]) {
      const vp = await browser.newPage({ viewport: { width: 390, height: 900 } });
      await vp.goto(BASE + 'widgets/great-command-v5-' + v + '.html', { waitUntil: 'load' });
      await vp.waitForTimeout(300);
      const vs = await read(vp);
      ck(v + ' version unchanged: ' + dots + ' dots, tag ' + tag + ', no loop canvas', vs.dots === dots && vs.tag === tag && vs.canvases === 0 && !vs.loop,
        JSON.stringify([vs.dots, vs.tag, vs.canvases]));
      await vp.close();
    }

    const lp = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const lerrors = [];
    lp.on('pageerror', e => lerrors.push(e.message));
    await lp.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await lp.goto(BASE + 'index.html#203-10', { waitUntil: 'domcontentloaded' });
    const frame = lp.locator('#session-10.active iframe[src*="great-command-v5-203-10.html"]');
    await frame.waitFor({ timeout: 20000 });
    await frame.scrollIntoViewIfNeeded();
    await lp.waitForTimeout(1500);
    const emb = await lp.evaluate(() => {
      const s = document.querySelector('#session-10.active');
      const f = s.querySelector('iframe[src*="great-command-v5-203-10.html"]');
      return {
        frames: s.querySelectorAll('iframe').length,
        frameH: f.getBoundingClientRect().height,
        contentH: f.contentDocument.documentElement.scrollHeight,
        anchor: f.parentElement.getAttribute('data-jump'),
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    ck('lesson: one widget frame in 203-10', emb.frames === 1, emb.frames);
    ck('lesson: iframe shows the whole cross widget', emb.frameH + 1 >= emb.contentH, emb.frameH + ' vs ' + emb.contentH);
    ck('lesson: cross is the Diagram jump target', emb.anchor === 'diagram');
    ck('lesson: no sideways scroll', !emb.overflow);
    const writes = await lp.evaluate(() => new Promise(res => {
      const f = document.querySelector('#session-10.active iframe[src*="great-command-v5-203-10.html"]');
      let n = 0;
      const mo = new MutationObserver(l => { n += l.length; });
      mo.observe(f, { attributes: true, attributeFilter: ['style'] });
      setTimeout(() => { mo.disconnect(); res(n); }, 1500);
    }));
    ck('lesson: frame stays still while idle', writes === 0, writes);
    const inner = await (await frame.elementHandle()).contentFrame();
    for (let i = 0; i < 2; i++) await inner.click('#next-btn');
    await lp.waitForTimeout(1200);
    ck('lesson: loop runs on the last step', await inner.evaluate(() => window.GC_WELCOME_LOOP.state().running));
    const loopWrites = await lp.evaluate(() => new Promise(res => {
      const f = document.querySelector('#session-10.active iframe[src*="great-command-v5-203-10.html"]');
      let n = 0;
      const mo = new MutationObserver(l => { n += l.length; });
      mo.observe(f, { attributes: true, attributeFilter: ['style'] });
      setTimeout(() => { mo.disconnect(); res(n); }, 2000);
    }));
    ck('lesson: frame never re-measures while the loop runs', loopWrites === 0, loopWrites);
    await lp.evaluate(() => window.scrollTo(0, 0));
    await lp.waitForTimeout(1200);
    ck('lesson: loop pauses when scrolled out of view', !(await inner.evaluate(() => window.GC_WELCOME_LOOP.state().running)));
    await frame.scrollIntoViewIfNeeded();
    await lp.waitForTimeout(1200);
    ck('lesson: loop resumes when scrolled back', await inner.evaluate(() => window.GC_WELCOME_LOOP.state().running));
    ck('lesson: no page errors', lerrors.length === 0, lerrors.join(' | '));
    await lp.close();
  } finally {
    await browser.close();
  }
  console.log(checks + ' 203-10 cross finale checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
