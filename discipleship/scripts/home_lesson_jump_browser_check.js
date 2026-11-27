#!/usr/bin/env node
// Home page lesson jump check: choosing any lesson from a course card (or the full course list)
// must open that lesson, even when lesson files load slowly. Serve discipleship/ on 8765 or pass a base URL.
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://127.0.0.1:8765';
(async () => {
  const b = await chromium.launch({ ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) }); let ok=0, fail=0;
  const ck=(l,c)=>{ c?ok++:fail++; if(!c) console.log('FAIL',l); };
  for (const delay of [0, 900]) {
    for (const [series, num] of [['202',6],['203',4],['201',9],['101',3]]) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
      const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
      if (delay) await p.route(/\/data\/\d{3}-\d{2}\.json/, async r => { await new Promise(res => setTimeout(res, delay)); r.continue(); });
      await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
      await p.waitForFunction(() => typeof toggleCourseDropdown === 'function');
      await p.evaluate(s => toggleCourseDropdown(s), series);
      const btn = p.locator(`#level-dropdown-${series} .level-dropdown-lesson`).nth(num-1); await btn.waitFor();
      await btn.click();
      await p.waitForSelector(`#session-${num}.active`, { timeout: 15000 }).catch(()=>{});
      await p.waitForTimeout(delay + 600);
      const active = await p.evaluate(() => { const a=document.querySelector('.session.active'); return a ? a.id : null; });
      ck(`delay ${delay} ${series} lesson ${num} opens (got ${active}, hash ${await p.evaluate(()=>location.hash)})`, active === `session-${num}`);
      ck(`delay ${delay} ${series} no errors`, errs.length === 0);
      await ctx.close();
    }
  }
  // Full course list (tree view) path, with a slow network
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
    await p.route(/\/data\/\d{3}-\d{2}\.json/, async r => { await new Promise(res => setTimeout(res, 900)); r.continue(); });
    await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => typeof openTree === 'function');
    await p.evaluate(() => openTree());
    const row = p.locator('.tree-lesson-row[onclick*="openTreeLesson(\'202\', 7)"]'); await row.waitFor();
    await row.click();
    await p.waitForSelector('#session-7.active', { timeout: 15000 }).catch(()=>{});
    await p.waitForTimeout(1500);
    const active = await p.evaluate(() => { const a=document.querySelector('.session.active'); return a ? a.id : null; });
    ck('tree view 202 lesson 7 opens (got ' + active + ')', active === 'session-7');
    ck('tree view no errors', errs.length === 0);
    await ctx.close();
  }
  await b.close(); console.log(ok+' passed, '+fail+' failed'); process.exitCode = fail?1:0;
})();
