#!/usr/bin/env node
'use strict';
// Integration coverage supplements, without modifying, Dave's approved test.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const storage=require('./answer-storage.js');
const data=require('../data/202-10.json');
const other=require('../data/202-09.json').blocks.find(b=>b.type==='question');
const questions=data.blocks.filter(b=>b.type==='question');
const base=(process.env.BAPTISM_BASE_URL||'http://127.0.0.1:8822').replace(/\/$/,'');
let checks=0;
const ck=(label,ok)=>{assert.ok(ok,label);checks++;};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
  for(const [width,motion]of [[375,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
   const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
   try{
    await ctx.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const response=await p.goto(base+'/widgets/baptism-picture.html',{waitUntil:'domcontentloaded'});
    ck('direct HTTP 200',response.status()===200);
    await p.locator('#btn-next').waitFor();await p.evaluate(()=>document.fonts.ready);
    const h0=await p.locator('.verse-card').evaluate(el=>el.getBoundingClientRect().height);
    ck('direct title/tag',(await p.locator('.title-bar h1').textContent()).trim()==='Baptism'&&(await p.locator('.course-tag').textContent()).trim()==='202-10');
    for(const title of ['Crucified with Christ','Buried with Him','Raised with Christ','Old Has Gone, New Has Come']){
     await p.locator('#btn-next').focus();await p.locator('#btn-next').press('Enter');
     ck('direct keyboard '+title,(await p.locator('.verse-card-title').textContent()).includes(title));
     ck('direct stable card '+title,Math.abs(await p.locator('.verse-card').evaluate(el=>el.getBoundingClientRect().height)-h0)<=1);
     ck('direct fitting navigation '+title,await p.locator('#btn-next').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+1));
    }
    await p.locator('#btn-back').click();ck('direct Back',(await p.locator('.verse-card-title').textContent()).includes('Raised with Christ'));
    await p.locator('.step-dot').first().focus();await p.locator('.step-dot').first().press('Space');
    ck('direct dot keyboard returns intro',(await p.locator('.verse-card-title').textContent()).includes('Identifying with Jesus'));
    await p.locator('.step-dot').last().click();await p.locator('#btn-next').click();
    ck('direct restart',(await p.locator('.verse-card-title').textContent()).includes('Identifying with Jesus'));
    ck('direct zero overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    ck('direct no console/page errors: '+errors.join(' | '),errors.length===0);
    console.log('PASS direct Baptism '+width+'/'+motion);
   }finally{await ctx.close();}
  }
  for(const [width,motion]of [[390,'no-preference'],[1280,'reduce']]){
   const seed={[storage.MIGRATION_FLAG]:true};
   for(const [i,q]of questions.entries())seed['question-202-'+q.id]='SYN-baptism-integration-'+i;
   const foreignKey='question-202-'+other.id;seed[foreignKey]='SYN-baptism-other-lesson';
   const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('baptism-integration-seed')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('baptism-integration-seed','yes');}},seed);
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    const response=await p.goto(base+'/index.html#202-10',{waitUntil:'domcontentloaded'});
    ck('embedded lesson HTTP 200',response.status()===200);
    const lesson=p.locator('#session-10.active');const frameEl=lesson.locator('iframe[src*="baptism-picture.html"]');await frameEl.waitFor();
    const frame=await (await frameEl.elementHandle()).contentFrame();await frame.locator('#btn-next').waitFor();
    ck('fallback title Baptism',await frameEl.getAttribute('title')==='Baptism');
    const companion=lesson.locator('iframe[src*="two-ordinances.html"]');ck('placeholder two-ordinances widget removed from the lesson',await companion.count()===0);
    for(const q of questions)ck('restored '+q.id,await lesson.locator('#question-202-'+q.id).inputValue()===seed['question-202-'+q.id]);
    await frame.locator('#btn-next').click();await frame.locator('.step-dot').last().click();await frame.locator('#btn-next').click();
    ck('embedded page fits',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    ck('all widget use preserves answer store',await p.evaluate(seed=>{const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>saved[k]===v);},seed));
    const key='question-202-'+questions[0].id;await lesson.locator('#'+key).fill('SYN-baptism-edited');await lesson.locator('#'+key).blur();
    await p.reload();await lesson.locator('#'+key).waitFor();ck('edit survives reload',await lesson.locator('#'+key).inputValue()==='SYN-baptism-edited');
    await p.goto(base+'/index.html#202-9',{waitUntil:'domcontentloaded'});await p.locator('#session-9.active #'+foreignKey).waitFor();
    ck('other lesson response retained',await p.locator('#session-9.active #'+foreignKey).inputValue()===seed[foreignKey]);
    await p.goto(base+'/index.html#202-10',{waitUntil:'domcontentloaded'});await lesson.locator('#'+key).waitFor();
    ck('edit survives lesson revisit',await lesson.locator('#'+key).inputValue()==='SYN-baptism-edited');
    await p.locator('#email-lesson-btn').click();const email=await p.locator('#export-preview-text').textContent();
    ck('Email includes all current responses',email.includes('SYN-baptism-edited')&&questions.slice(1).every(q=>email.includes(seed['question-202-'+q.id])));
    ck('Email excludes other lesson',!email.includes(seed[foreignKey]));ck('no page exceptions',errors.length===0);
    console.log('PASS embedded Baptism '+width+'/'+motion);
   }finally{await ctx.close();}
  }
  console.log(checks+' Baptism integration checks passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
