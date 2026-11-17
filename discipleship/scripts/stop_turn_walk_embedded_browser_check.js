#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const storage=require('./answer-storage.js');
const data=require('../data/101-07.json');
const other=require('../data/101-06.json').blocks.find(b=>b.type==='question');
const base=process.env.STW_LESSON_BASE_URL||'http://127.0.0.1:8823/index.html';
const questions=data.blocks.filter(b=>b.type==='question');
const retired=data.retiredQuestions||[];
const seed={[storage.MIGRATION_FLAG]:true};
for(const [i,q]of questions.entries())seed['question-101-'+q.id]='SYN-stw-'+i;
for(const [i,q]of retired.entries())seed['question-101-'+q.id]='SYN-stw-retired-'+i;
const foreignKey='question-101-'+other.id;seed[foreignKey]='SYN-stw-other-lesson';
let checks=0;const ck=(label,ok)=>{assert.ok(ok,label);checks++;};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
  for(const [width,height,motion]of [[375,667,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]){
   const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('stw-seeded')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('stw-seeded','yes');}},seed);
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.url().includes('/widgets/')&&r.status()>=400)errors.push(r.status()+' '+r.url());});
    const response=await page.goto(base+'#101-7',{waitUntil:'domcontentloaded'});ck('lesson HTTP 200',response.status()===200);
    const lesson=page.locator('#session-7.active');const frameEl=lesson.locator('iframe[src*="stop-turn-walk.html"]');await frameEl.waitFor();
    const frame=await (await frameEl.elementHandle()).contentFrame();await frame.locator('[data-control="begin"]').waitFor();await page.waitForTimeout(250);
    ck('iframe title',await frameEl.getAttribute('title')==='Repentance is 180 Degrees');
    ck('approved four-frame story retained',await lesson.locator('[data-parable-sequence] .parable-sequence-frame').count()===4);
    const cardH=await frame.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--card-h'));
    ck('positive measured card height',parseFloat(cardH)>0);
    // Keep controls visible while the iframe top sits beneath the app header.
    // Real pointer events avoid Playwright auto-scroll hiding jumps.
    await frameEl.evaluate(el=>{const rect=el.getBoundingClientRect();const end=Math.min(innerHeight-20,rect.height+35);scrollBy({top:rect.bottom-end,behavior:'instant'});});
    await page.waitForTimeout(150);
    async function activate(control,title){
     const button=frame.locator(control);const box=await button.boundingBox();assert.ok(box);
     const before=await page.evaluate(()=>scrollY);
     await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
     await page.waitForTimeout(140);
     ck(title+' immediate zero scroll jump',Math.abs((await page.evaluate(()=>scrollY))-before)<=1);
     ck(title+' rendered',(await frame.locator('.verse-card-title').textContent()).trim()===title);
     await page.waitForTimeout(motion==='reduce'?60:850);
     ck(title+' settled zero scroll jump',Math.abs((await page.evaluate(()=>scrollY))-before)<=1);
     ck(title+' stable --card-h',await frame.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--card-h'))===cardH);
     ck(title+' iframe includes navigation',await frame.locator('.nav-bar').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2));
    }
    await activate('[data-control="begin"]','Stop');
    await activate('[data-control="next"]','Turn');
    await activate('[data-control="next"]','Walk');
    await activate('[data-control="back"]','Turn');
    await activate('.step-dot:last-child','Walk');
    await activate('[data-control="restart"]','Which Way Are You Going?');
    ck('page fits',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    ck('iframe fits',await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const q of questions)ck('current answer retained '+q.id,await lesson.locator('#question-101-'+q.id).inputValue()===seed['question-101-'+q.id]);
    ck('all stored answers untouched',await page.evaluate(seed=>{const saved=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>saved[k]===v);},seed));
    const editKey='question-101-7-1';await lesson.locator('#'+editKey).fill('SYN-stw-edited');await lesson.locator('#'+editKey).blur();
    await page.reload();await lesson.locator('#'+editKey).waitFor();ck('active answer edit survives reload',await lesson.locator('#'+editKey).inputValue()==='SYN-stw-edited');
    await page.goto(base+'#101-6',{waitUntil:'domcontentloaded'});await page.locator('#session-6.active #'+foreignKey).waitFor();ck('other lesson answer retained',await page.locator('#session-6.active #'+foreignKey).inputValue()===seed[foreignKey]);
    await page.goto(base+'#101-7',{waitUntil:'domcontentloaded'});await lesson.locator('#'+editKey).waitFor();ck('active answer edit survives revisit',await lesson.locator('#'+editKey).inputValue()==='SYN-stw-edited');
    await page.locator('#email-lesson-btn').click();const email=await page.locator('#export-preview-text').textContent();
    ck('Email includes every lesson answer',questions.every(q=>email.includes(q.id==='7-1'?'SYN-stw-edited':seed['question-101-'+q.id])));
    for(const q of retired)ck('Earlier saved response retained '+q.id,email.includes(q.text)&&email.includes(seed['question-101-'+q.id]));
    ck('Email excludes other lesson',!email.includes(seed[foreignKey]));ck('no page/widget HTTP errors',errors.length===0);
    console.log('PASS embedded 101-07 '+width+'/'+motion+' card-h='+cardH.trim());
   }finally{await ctx.close();}
  }
  console.log(checks+' embedded Stop Turn Walk checks passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
