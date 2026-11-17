#!/usr/bin/env node
'use strict';
// Portable verification for the four approved early-reveal Course 101 story pairs.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const base=process.env.STORY101_BASE_URL||'http://127.0.0.1:8830/index.html';
const cases=[{number:3,title:'Teach Us to Pray',files:['101-03-prayer-bw','101-03-prayer-color']},{number:4,title:'Questions in the Night',files:['101-04-nicodemus-bw','101-04-nicodemus-color']},{number:5,title:'The Aspen Grove',files:['aspen-bw','aspen-color']},{number:6,title:'The Woman at the Well',files:['woman-well-bw','woman-well-color']}];
const seed={};for(const item of cases){item.lesson=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/101-0'+item.number+'.json'),'utf8'));item.questions=[...item.lesson.blocks.filter(b=>b.type==='question'),...(item.lesson.retiredQuestions||[])];for(const q of item.questions)seed['question-101-'+q.id]='SYN-story101-'+item.number+'-'+q.id;}
seed['question-202-unrelated']='SYN-story101-other-course';
let checks=0;function ck(label,ok){assert.ok(ok,label);checks++;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,height,motion]of [[375,667,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]){
  for(const item of cases){
   const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('story101-seeded')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('story101-seeded','1');}},seed);
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().includes('/images/')&&r.status()>=400)errors.push(r.status()+' '+r.url());});
    const response=await p.goto(base+'#101-'+item.number,{waitUntil:'domcontentloaded'});ck('lesson HTTP 200',response.status()===200);
    const section=p.locator('#session-'+item.number+'.active');await section.waitFor();const root=section.locator('[data-parable-dissolve]');ck('one approved story pair',await root.count()===1);
    await root.scrollIntoViewIfNeeded();await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
    const describe=()=>root.evaluate(el=>{
     const bw=el.querySelector('.parable-img-bw'),color=el.querySelector('.parable-img-color'),a=bw.getBoundingClientRect(),b=color.getBoundingClientRect(),r=el.getBoundingClientRect();return {opacity:Number(getComputedStyle(bw).opacity),loaded:bw.complete&&bw.naturalWidth>0&&color.complete&&color.naturalWidth>0,aligned:Math.abs(a.x-b.x)<=1&&Math.abs(a.y-b.y)<=1&&Math.abs(a.width-b.width)<=1&&Math.abs(a.height-b.height)<=1,srcs:[bw.currentSrc,color.currentSrc],width:r.width,height:r.height,top:r.top,bottom:r.bottom,header:document.querySelector('.lesson-topbar')?.getBoundingClientRect().bottom||0,viewport:innerHeight,early:el.hasAttribute('data-dissolve-on-entry'),joined:el.parentElement.classList.contains('block-image-touch-next'),next:el.parentElement.nextElementSibling?.textContent||''};
    });
    const first=await describe();ck('both layers loaded',first.loaded);ck('layers pixel aligned',first.aligned);ck('early reveal enabled',first.early);ck('correct joined story',first.joined&&first.next.includes(item.title));
    ck('expected optimized delivery sources',first.srcs.every((s,i)=>s.includes('/images/optimized/'+item.files[i]+'-')&&new URL(s).pathname.endsWith('.webp')));
    const seen=[];
    for(const progress of [0,.5,1]){
     await root.evaluate((el,progress)=>{const top=document.querySelector('.lesson-topbar')?.getBoundingClientRect().bottom||0,h=Math.max(innerHeight-top,1),r=el.getBoundingClientRect(),start=top+h*.9,end=top+Math.max((h-r.height)/2,0);scrollBy({top:r.top-(start-progress*(start-end)),behavior:'instant'});},progress);
     await p.waitForTimeout(150);const state=await describe();seen.push(state.opacity);ck('alignment maintained during scroll',state.aligned);ck('no image layout shift',Math.abs(state.width-first.width)<=1&&Math.abs(state.height-first.height)<=1);
     if(progress===1){ck('whole picture visible at completion',state.top>=state.header-1&&state.bottom<=state.viewport+1);ck('fully revealed before picture leaves screen',state.opacity<=.01);}
    }
    if(motion==='reduce')ck('reduced motion static final image',seen.every(v=>v<=.01));else ck('monotonic fade',seen[0]>=seen[1]&&seen[1]>=seen[2]);
    for(const q of item.lesson.blocks.filter(b=>b.type==='question'))ck('existing answer restored '+q.id,await section.locator('#question-101-'+q.id).inputValue()===seed['question-101-'+q.id]);
    ck('no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await p.reload({waitUntil:'domcontentloaded'});await section.waitFor();ck('all seeded answers survive reload',await p.evaluate(seed=>{const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>saved[k]===v);},seed));
    await p.locator('#email-lesson-btn').click();const email=await p.locator('#export-preview-text').textContent();ck('Email retains current and retired answers',item.questions.every(q=>email.includes(seed['question-101-'+q.id])));ck('Email excludes another course',!email.includes('SYN-story101-other-course'));ck('zero page/image errors',errors.length===0);
    console.log('PASS 101-0'+item.number+' '+width+'x'+height+'/'+motion);
   }finally{await ctx.close();}
  }
 }
 console.log(checks+' Course 101 story dissolve checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
