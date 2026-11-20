#!/usr/bin/env node
'use strict';
// Only synthetic answers in isolated browser contexts.
const {chromium}=require('playwright');
const data=require('../data/203-10.json');
const assert=require('node:assert/strict');
const BASE=process.env.MARKS_LESSON_BASE_URL||'http://127.0.0.1:8854/discipleship/index.html';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.GT_CHROMIUM_PATH?{executablePath:process.env.GT_CHROMIUM_PATH}:{})});let checks=0;
 const ck=(ok,msg)=>{assert(ok,msg);checks++;};
 for(const [width,motion] of [[375,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  await context.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
  const seed={__gtSharedKeyMigrationV1:true};for(const q of data.blocks.filter(b=>b.type==='question'))seed['question-203-'+q.id]='SYN marks '+q.id;
  seed['question-203-203-10-next']='SYN earlier invitation';
  await context.addInitScript(seed=>{if(window!==top||sessionStorage.getItem('SYN-MARKS'))return;localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('SYN-MARKS','1');},seed);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const response=await page.goto(BASE+'#203-10',{waitUntil:'domcontentloaded'});ck(response.status()===200,'lesson HTTP200');
  const lesson=page.locator('#session-10.active'),iframe=lesson.locator('iframe[src*="marks-of-genuine-love.html"]');await iframe.waitFor();
  ck(await lesson.locator('iframe').count()===1,'one approved interactive passage');
  ck(await iframe.getAttribute('title')==='Marks of a True Christian','accessible iframe title');
  const frame=await (await iframe.elementHandle()).contentFrame();await frame.waitForSelector('#next-btn');await page.waitForTimeout(200);
  const verses=await frame.locator('.passage-text sup').allTextContents();ck(verses.join(',')===Array.from({length:13},(_,i)=>String(i+9)).join(','),'all13 verses visible');
  ck(await lesson.locator('.block-verse').filter({hasText:'Romans 12:9-21'}).count()===0,'static passage replaced without duplication');
  await iframe.evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-70));
  const start=await iframe.evaluate(el=>({h:el.getBoundingClientRect().height,y:scrollY}));
  const card=await frame.locator('#widget').evaluate(el=>el.style.getPropertyValue('--card-h'));
  for(let step=1;step<=5;step++){
   await frame.locator('#next-btn').evaluate(el=>el.click());await page.waitForTimeout(100);
   ck(await frame.locator('#widget').getAttribute('data-step')===String(step),'step'+step+' navigation');
   ck(await frame.locator('#widget').evaluate(el=>el.style.getPropertyValue('--card-h'))===card,'step'+step+' stable teaching card');
   const end=await iframe.evaluate(el=>({h:el.getBoundingClientRect().height,y:scrollY}));
   ck(Math.abs(end.h-start.h)<2&&Math.abs(end.y-start.y)<2,'step'+step+' no iframe resize or scroll jump');
  }
  ck(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'widget has no horizontal overflow');
  ck(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'lesson has no horizontal overflow');
  for(const q of data.blocks.filter(b=>b.type==='question'))ck(await lesson.locator('#question-203-'+q.id).inputValue()===seed['question-203-'+q.id],q.id+' answer preserved');
  await page.reload({waitUntil:'domcontentloaded'});await lesson.locator('#question-203-203-10-invite').waitFor();
  ck(await lesson.locator('#question-203-203-10-invite').inputValue()===seed['question-203-203-10-invite'],'answer survives reload');
  ck(await page.evaluate(()=>JSON.parse(localStorage.getItem('christianFoundationsResponses'))['question-203-203-10-next'])==='SYN earlier invitation','retired answer preserved');
  await page.locator('#email-lesson-btn').click();const exported=await page.locator('#export-preview-text').innerText();
  ck(exported.includes('SYN earlier invitation')&&exported.includes('SYN marks 203-10-invite'),'active/retired answers export');
  ck(errors.length===0,'no page exceptions: '+errors.join('; '));console.log('PASS',width,motion);await context.close();
 }
 await browser.close();console.log(checks+' embedded Marks checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
