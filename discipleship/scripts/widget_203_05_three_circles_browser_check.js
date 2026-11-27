const { chromium } = require('playwright');
// 203-05 3 Circles: every step fits without inner overflow, the drawing stays inside its frame, the ABCs live on the card (not over the drawing), and the card height is stable. Serve discipleship/ on 8765 or pass a base URL.
const BASE = process.argv[2] || 'http://127.0.0.1:8765';
(async () => {
  const b = await chromium.launch({ ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : {}) }); let ok=0, fail=0;
  const ck=(l,c)=>{ c?ok++:fail++; if(!c) console.log('FAIL',l); };
  for (const w of [375, 390, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 } }); const errs=[]; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/index.html#203-5', { waitUntil: 'networkidle' });
    const ifr = p.locator('#session-5.active iframe[src*="three-circles"]'); await ifr.waitFor();
    const f = await (await ifr.elementHandle()).contentFrame();
    const heights=[];
    for (let i=0;i<8;i++){ const btn=f.locator('button:has-text("Begin"), button:has-text("Next")').first(); if (await btn.count()) await btn.click(); await p.waitForTimeout(450);
      const m = await f.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight, sw: document.documentElement.scrollWidth, iw: innerWidth, card: (document.querySelector('.verse-card')||{}).offsetHeight }));
      heights.push(m.card); ck(w+' step'+i+' no inner overflow', m.sh <= m.ih + 2 && m.sw <= m.iw + 1); }
    const svgOk = await f.evaluate(() => { const s=document.getElementById('scene'); const vb=s.viewBox.baseVal; return [...s.querySelectorAll('path,text')].every(e=>{ try{const bb=e.getBBox(); return bb.x>=-20 && bb.x+bb.width<=vb.width+6;}catch(_){return true;} }); });
    ck(w+' drawing inside frame', svgOk);
    ck(w+' text no ABC overlay', !(await f.evaluate(()=>document.getElementById('scene').textContent)).includes("ABC's"));
    ck(w+' card text has ABCs', (await f.locator('body').innerText()).includes('Admit your sin'));
    ck(w+' card height stable', new Set(heights.filter(Boolean)).size <= 1);
    ck(w+' page fits', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    ck(w+' errors', errs.length===0);
    await p.close();
  }
  await b.close(); console.log(ok+' passed, '+fail+' failed'); process.exitCode = fail?1:0;
})();
