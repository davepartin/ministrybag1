#!/usr/bin/env node
'use strict';
// Approved Nicodemus lamp dissolve, current answers and the retired 4-6 response.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const base=process.env.LAMP_BASE_URL||'http://127.0.0.1:8827/index.html';
const lesson=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/101-04.json'),'utf8'));
const questions=[...lesson.blocks.filter(b=>b.type==='question'),...(lesson.retiredQuestions||[])];
const seed=Object.fromEntries(questions.map(q=>['question-101-'+q.id,'SYN-lamp-'+q.id]));
seed['question-202-unrelated']='SYN-lamp-other-course';
let checks=0;function ck(label,value){assert.ok(value,label);checks++;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,motion]of [[375,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
  const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  try{
   await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
   await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('lamp-seeded')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('lamp-seeded','1');}},seed);
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   p.on('response',r=>{if((r.url().includes('/images/')||r.url().includes('read-discover-respond'))&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   const response=await p.goto(base+'#101-4',{waitUntil:'domcontentloaded'});ck('lesson HTTP 200',response.status()===200);
   const section=p.locator('#session-4.active');await section.locator('iframe[src*="read-discover-respond.html"]').waitFor();
   ck('one existing approved widget',await section.locator('iframe').count()===1);
   const root=section.locator('[data-parable-dissolve]');ck('one story dissolve',await root.count()===1);
   await root.scrollIntoViewIfNeeded();await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
   const describe=()=>root.evaluate(el=>{
    const bw=el.querySelector('.parable-img-bw'),color=el.querySelector('.parable-img-color');
    const a=bw.getBoundingClientRect(),b=color.getBoundingClientRect(),r=el.getBoundingClientRect(),wrap=el.closest('.block-image');
    return {opacity:Number(getComputedStyle(bw).opacity),width:r.width,height:r.height,aligned:Math.abs(a.x-b.x)<=1&&Math.abs(a.y-b.y)<=1&&Math.abs(a.width-b.width)<=1&&Math.abs(a.height-b.height)<=1,loaded:bw.complete&&bw.naturalWidth>0&&color.complete&&color.naturalWidth>0,srcs:[bw.currentSrc,color.currentSrc],ratio:a.width/a.height,framed:el.classList.contains('block-image-dissolve-framed'),joined:wrap.classList.contains('block-image-touch-next'),nextText:wrap.nextElementSibling?.textContent||''};
   });
   const first=await describe();ck('both layers loaded',first.loaded);ck('aligned layers',first.aligned);
   ck('approved Nicodemus WebP delivery',first.srcs.every(s=>s.includes('/images/optimized/101-04-nicodemus-')&&new URL(s).pathname.endsWith('.webp')));
   ck('16:9 composition preserved',Math.abs(first.ratio-16/9)<.01);ck('touchNext joins the story',first.joined);
   ck('immediately before Questions in the Night',first.nextText.includes('Questions in the Night'));
   const seen=[];
   for(const progress of [0,.5,1]){
    await root.evaluate((el,progress)=>{const top=document.querySelector('.lesson-topbar')?.getBoundingClientRect().bottom||0;const h=Math.max(innerHeight-top,1);scrollBy({top:el.getBoundingClientRect().top-(top+h*.4-progress*h*.62),behavior:'instant'});},progress);
    await p.waitForTimeout(150);const state=await describe();seen.push(state.opacity);
    ck('aligned throughout scroll',state.aligned);ck('no image layout shift',Math.abs(state.width-first.width)<=1&&Math.abs(state.height-first.height)<=1);
   }
   if(motion==='reduce')ck('reduced motion shows static lighter layer',seen.every(v=>v<=.01));
   else {ck('dark layer fades monotonically',seen[0]>=seen[1]&&seen[1]>=seen[2]);ck('dark layer visible at start',seen[0]>.5);ck('lighter layer fully revealed',seen[2]<=.01);}
   ck('all eight current questions present',await section.locator('textarea[data-question]').count()===8);
   ck('retired 4-6 not shown',await section.locator('#question-101-4-6').count()===0);
   ck('no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.reload();await section.locator('iframe').waitFor();
   ck('all current and retired stored answers survive reload',await p.evaluate(seed=>{const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>saved[k]===v);},seed));
   await p.locator('#email-lesson-btn').click();const email=await p.locator('#export-preview-text').textContent();
   ck('Email retains every current and retired answer',questions.every(q=>email.includes(seed['question-101-'+q.id])));
   ck('Email excludes another course',!email.includes('SYN-lamp-other-course'));
   ck('zero page/image/widget errors',errors.length===0);
   console.log('PASS 101-04 lamp '+width+'/'+motion);
  }finally{await ctx.close();}
 }
 console.log(checks+' Nicodemus lamp dissolve checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
