#!/usr/bin/env node
'use strict';
// 203-10 series finale: the Greatest Commandment cross (great-command-v5.js, version 203-10)
// with the Welcome Home last step, its place at the end of the 203-10 lesson, and a guard that
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
const HEADINGS = ['The Greatest Commandment', "God's Love Comes Down", 'Love God With All You Are', 'Love One Another',
  'Love Everyone, Even Enemies', 'The Cross Is Love for Enemies', 'Welcome Home'];
const HOME = [[146, 89.5], [146, 109], [163, 89.5], [163, 109], [180, 89.5], [180, 109]];

let checks = 0;
function ck(label, ok, detail) {
  checks++;
  assert.ok(ok, label + (detail !== undefined ? ' | ' + detail : ''));
}

async function read(page) {
  return page.evaluate(() => {
    const w = document.getElementById('widget');
    const card = document.getElementById('card-content');
    const people = Array.from(document.querySelectorAll('.welcome-person')).map(g => {
      const m = (g.getAttribute('transform') || '').match(/translate\(([-\d.]+),([-\d.]+)\)/);
      return { at: m ? [Number(m[1]), Number(m[2])] : null, stroke: g.querySelector('path').getAttribute('stroke') };
    });
    const overlay = document.querySelector('.welcome-person') ? document.querySelector('.welcome-person').parentNode : null;
    const contour = document.querySelector('.cross-contour');
    return {
      tag: document.querySelector('.course-tag').textContent,
      heading: document.getElementById('card-heading').textContent,
      count: document.getElementById('step-count').textContent,
      next: document.getElementById('next-btn').textContent,
      cardH: Math.round(card.getBoundingClientRect().height),
      widgetH: Math.round(w.getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      people,
      overlayVisible: overlay ? overlay.classList.contains('is-visible') : false,
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
      ck(width + ': seven step dots', s.dots === 7);
      ck(width + ': six welcome figures, hidden at start', s.people.length === 6 && !s.overlayVisible);
      const cardH = s.cardH, widgetH = s.widgetH;
      for (let i = 1; i <= 6; i++) {
        await page.click('#next-btn');
        s = await read(page);
        ck(width + ': step ' + i + ' heading', s.heading === HEADINGS[i], s.heading);
        ck(width + ': step ' + i + ' card height steady', s.cardH === cardH, s.cardH + ' vs ' + cardH);
        ck(width + ': step ' + i + ' widget height steady', s.widgetH === widgetH, s.widgetH + ' vs ' + widgetH);
        ck(width + ': step ' + i + ' no sideways scroll', !s.overflowX);
        await page.waitForTimeout(i === 6 ? 5400 : 3600);
      }
      s = await read(page);
      ck(width + ': finale draws the crimson cross', s.contourDrawn);
      ck(width + ': finale shows the welcome figures', s.overlayVisible);
      ck(width + ': everyone ends in the family arm', s.people.every((p, k) => p.at && p.at[0] === HOME[k][0] && p.at[1] === HOME[k][1]),
        JSON.stringify(s.people.map(p => p.at)));
      ck(width + ': everyone ends blue', s.people.every(p => p.stroke === '#2a5b7c'), JSON.stringify(s.people.map(p => p.stroke)));
      ck(width + ': last step offers Start Over', /Start Over/.test(s.next) && s.count === 'Step 6 of 6');
      if (width === 390) {
        const muts = await page.evaluate(() => new Promise(res => {
          let n = 0;
          const mo = new MutationObserver(l => { n += l.length; });
          mo.observe(document.body, { subtree: true, childList: true, attributes: true });
          setTimeout(() => { mo.disconnect(); res(n); }, 1500);
        }));
        ck('390: stays still once the finale ends', muts === 0, muts);
      }
      await page.click('#prev-btn');
      s = await read(page);
      ck(width + ': Back to step 5 hides the welcome figures', s.heading === HEADINGS[5] && !s.overlayVisible && s.contourDrawn);
      await page.click('.step-dot[data-step="2"]');
      s = await read(page);
      ck(width + ': dot back to step 2 lands at once with no arms', s.heading === HEADINGS[2] && !s.overlayVisible && !s.contourDrawn);
      await page.click('.step-dot[data-step="6"]');
      await page.waitForTimeout(5400);
      s = await read(page);
      ck(width + ': dot jump forward to the finale ends with everyone home', s.people.every((p, k) => p.at[0] === HOME[k][0]) && s.contourDrawn);
      ck(width + ': no page errors', errors.length === 0, errors.join(' | '));
      await page.close();
    }

    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const rp = await ctx.newPage();
    await rp.goto(BASE + 'widgets/great-command-v5-203-10.html', { waitUntil: 'load' });
    for (let i = 0; i < 6; i++) await rp.click('#next-btn');
    const rs = await read(rp);
    ck('reduced motion: finale lands at once', rs.overlayVisible && rs.people.every((p, k) => p.at[0] === HOME[k][0]) && rs.contourDrawn);
    await ctx.close();

    for (const [v, dots, tag] of [['201', 6, '201-01'], ['202', 5, '202-01'], ['203', 5, '203-01']]) {
      const vp = await browser.newPage({ viewport: { width: 390, height: 900 } });
      await vp.goto(BASE + 'widgets/great-command-v5-' + v + '.html', { waitUntil: 'load' });
      await vp.waitForTimeout(300);
      const vs = await read(vp);
      ck(v + ' version unchanged: ' + dots + ' dots, tag ' + tag + ', no welcome figures', vs.dots === dots && vs.tag === tag && vs.people.length === 0,
        JSON.stringify([vs.dots, vs.tag, vs.people.length]));
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
    ck('lesson: no page errors', lerrors.length === 0, lerrors.join(' | '));
    await lp.close();
  } finally {
    await browser.close();
  }
  console.log(checks + ' 203-10 cross finale checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
