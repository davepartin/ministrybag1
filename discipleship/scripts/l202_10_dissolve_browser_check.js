#!/usr/bin/env node
'use strict';
// Both 202-10 dissolves: existing Last Supper and approved 4:3 bread/cup art.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.SUPPER_BASE_URL||'http://127.0.0.1:8825/index.html';
let checks=0;const ck=(label,ok)=>{assert.ok(ok,label);checks++;};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,motion]of [[375,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
  const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  try{
   await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   p.on('response',r=>{if(r.url().includes('/images/')&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   const response=await p.goto(base+'#202-10',{waitUntil:'domcontentloaded'});ck('lesson HTTP 200',response.status()===200);
   const lesson=p.locator('#session-10.active');await lesson.locator('iframe[src*="baptism-picture.html"]').waitFor();
   const roots=lesson.locator('[data-parable-dissolve]');ck('exactly two image dissolves',await roots.count()===2);
   ck('placeholder iframe removed',await lesson.locator('iframe[src*="two-ordinances.html"]').count()===0);
   for(let i=0;i<2;i++){
    const root=roots.nth(i);await root.scrollIntoViewIfNeeded();
    await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
    const describe=()=>root.evaluate(el=>{
     const bw=el.querySelector('.parable-img-bw'),color=el.querySelector('.parable-img-color');
     const a=bw.getBoundingClientRect(),b=color.getBoundingClientRect(),r=el.getBoundingClientRect();
     const wrap=el.closest('.block-image');
     return {opacity:Number(getComputedStyle(bw).opacity),box:{x:r.x,y:r.y,width:r.width,height:r.height},aligned:Math.abs(a.x-b.x)<=1&&Math.abs(a.y-b.y)<=1&&Math.abs(a.width-b.width)<=1&&Math.abs(a.height-b.height)<=1,bwLoaded:bw.complete&&bw.naturalWidth>0,colorLoaded:color.complete&&color.naturalWidth>0,srcs:[bw.currentSrc,color.currentSrc],ratio:a.width/a.height,framed:el.classList.contains('block-image-dissolve-framed'),joined:wrap.classList.contains('block-image-touch-next'),nextText:wrap.nextElementSibling?.textContent||''};
    });
    const first=await describe();ck('both layers loaded',first.bwLoaded&&first.colorLoaded);ck('pixel-aligned layers',first.aligned);ck('framed and touchNext',first.framed&&first.joined);
    if(i===1){ck('bread/cup sources',first.srcs.every(s=>s.includes('202-10-bread-cup-')));ck('4:3 image ratio',Math.abs(first.ratio-4/3)<0.01);ck('joins Lord Supper teaching',first.nextText.includes('If baptism is the doorway'));}
    else ck('opening Last Supper retained',first.srcs.every(s=>s.includes('last-supper-')));
    const seen=[];
    for(const progress of [0,0.5,1]){
     await root.evaluate((el,progress)=>{const top=document.querySelector('.lesson-topbar')?.getBoundingClientRect().bottom||0;const h=Math.max(innerHeight-top,1);const start=top+h*.4;const range=h*.62;scrollBy({top:el.getBoundingClientRect().top-(start-progress*range),behavior:'instant'});},progress);
     await p.waitForTimeout(120);
     const s=await describe();seen.push(s.opacity);
     ck('aligned throughout scroll',s.aligned);
     ck('no image layout shift',Math.abs(s.box.width-first.box.width)<=1&&Math.abs(s.box.height-first.box.height)<=1);
    }
    if(motion==='reduce')ck('reduced motion uses static color',seen.every(v=>v<=0.01));
    else {ck('B&W fades monotonically',seen[0]>=seen[1]&&seen[1]>=seen[2]);ck('B&W visible initially',seen[0]>.5);ck('color fully revealed at end',seen[2]<=.01);}
   }
   ck('zero page overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));ck('no page/image HTTP errors',errors.length===0);
   console.log('PASS 202-10 dissolves '+width+'/'+motion);
  }finally{await ctx.close();}
 }
 console.log(checks+' Lord Supper dissolve checks passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
