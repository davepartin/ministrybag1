#!/usr/bin/env node
'use strict';
// Bounded regression for PR #244: seven existing widgets, unchanged lesson data.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const storage = require('./answer-storage.js');
const base = (process.env.TAP_BEGIN_BASE_URL || 'http://127.0.0.1:8818').replace(/\/$/, '');
const specs = [
 ['covenant-triangle.html','202-08','Two people, one faithful God.'],
 ['cross-the-road.html',null,'Who counts as my neighbor?'],
 ['guide-spirit2.html','201-03','Each stop shows one steady work of the Holy Spirit in the life of a believer.'],
 ['mission-map.html','203-09','Where does God want you on mission, and who is with you?'],
 ['oia-method.html','201-07','Three questions, asked in order.'],
 ['personal-ministry-map.html',null,'Who has God already placed around you?'],
 ['three-spaces.html','203-06','Where does your week actually happen?']
];
let checks=0,cases=0;
const ck=(label,ok)=>{assert.ok(ok,label);checks++;};
const forbidden=/tap\s+begin|begin the walk/i;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
  for(const [width,height,motion] of [[375,812,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]){
   for(const [file,lessonId,hook] of specs){
    const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion});
    try{
     await ctx.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
     const p=await ctx.newPage(),errors=[];
     p.on('pageerror',e=>errors.push(e.message));
     p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
     const response=await p.goto(base+'/widgets/'+file,{waitUntil:'domcontentloaded'});
     ck(file+' HTTP 200',response.status()===200);
     await p.getByRole('button',{name:/^begin/i}).waitFor();
     const intro=await p.locator('body').innerText();
     ck(file+' question/meaning hook retained',intro.includes(hook));
     ck(file+' redundant instruction absent',!forbidden.test(intro));
     await p.getByRole('button',{name:/^begin/i}).focus();
     await p.getByRole('button',{name:/^begin/i}).press('Enter');
     ck(file+' Begin advances',!(await p.getByRole('button',{name:/^begin/i}).count()));
     await p.getByRole('button',{name:/back/i}).first().click();
     ck(file+' Back returns to intro',(await p.locator('body').innerText()).includes(hook));
     await p.getByRole('button',{name:/^begin/i}).click();
     let n=0;
     while(await p.getByRole('button',{name:/^next/i}).count()){
      assert.ok(n++<15,'bounded step walk');
      await p.getByRole('button',{name:/^next/i}).click();
      ck(file+' step '+n+' fits horizontally',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     }
     await p.getByRole('button',{name:/restart|start over/i}).first().click();
     ck(file+' restart restores clean intro',(await p.locator('body').innerText()).includes(hook)&&!forbidden.test(await p.locator('body').innerText()));
     ck(file+' intro fits horizontally',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     ck(file+' no console/page errors: '+errors.join(' | '),errors.length===0);
     cases++;console.log('PASS direct '+file+' '+width+'/'+motion);
    }finally{await ctx.close();}
   }
  }
  // Each active embedding: current answers, real edit/reload and iframe geometry.
  // cross-the-road and personal-ministry-map remain on disk; their lesson embeds were retired
  // (202-01 in PR #202, 203-01 in the 2026-11-18 rewrite).
  for(const [file,lessonId,hook] of specs.filter(s=>s[1])){
   const data=require('../data/'+lessonId+'.json'),course=lessonId.slice(0,3),session=Number(lessonId.slice(4));
   const questions=data.blocks.filter(b=>b.type==='question');
   const retired=data.retiredQuestions||[];
   const seed={[storage.MIGRATION_FLAG]:true};
   [...questions,...retired].forEach((q,i)=>{seed['question-'+course+'-'+q.id]='SYN-tap-'+lessonId+'-'+i;});
   const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('tap-seed')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('tap-seed','yes');}},seed);
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(base+'/index.html#'+course+'-'+session,{waitUntil:'domcontentloaded'});
    const lesson=p.locator('#session-'+session+'.active');
    const iframe=lesson.locator('iframe[src*="'+file+'"]');await iframe.waitFor();
    const frame=await (await iframe.elementHandle()).contentFrame();
    await frame.getByRole('button',{name:/^begin/i}).waitFor();
    ck(lessonId+' embedded clean hook',(await frame.locator('body').innerText()).includes(hook)&&!forbidden.test(await frame.locator('body').innerText()));
    await frame.getByRole('button',{name:/^begin/i}).click();
    const next=frame.getByRole('button',{name:/^next/i});await next.waitFor();
    ck(lessonId+' embedded navigation fits',await next.evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2));
    ck(lessonId+' no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const q of questions)ck(lessonId+' restored '+q.id,await lesson.locator('#question-'+course+'-'+q.id).inputValue()===seed['question-'+course+'-'+q.id]);
    const key='question-'+course+'-'+questions[0].id;
    await lesson.locator('#'+key).fill('SYN-tap-edited-'+lessonId);await lesson.locator('#'+key).blur();
    await p.reload();await lesson.locator('#'+key).waitFor();
    ck(lessonId+' edited answer survives reload',await lesson.locator('#'+key).inputValue()==='SYN-tap-edited-'+lessonId);
    ck(lessonId+' other and retired answers intact',await p.evaluate(({seed,key})=>{const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>k===key||saved[k]===v);},{seed,key}));
    ck(lessonId+' no page exceptions',errors.length===0);
    cases++;console.log('PASS embedded '+lessonId);
   }finally{await ctx.close();}
  }
  console.log(checks+' checks passed across '+cases+' direct/embedded widget cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
