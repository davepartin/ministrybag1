#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const V=require('../tools/heart52/data/verses.json'),L=require('../tools/heart52/learning.js'),S=require('../tools/heart52/storage.js');
const BASE=process.env.HEART52_BASE_URL||'http://127.0.0.1:8854/discipleship',URL=BASE.replace(/\/$/,'')+'/tools/heart52/';
let passed=0;const ck=(v,m)=>{assert.ok(v,m);passed++;};
(async()=>{const browser=await chromium.launch({executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true});try{
 for(const [w,h,motion] of [[320,667,'no-preference'],[375,667,'no-preference'],[390,844,'no-preference'],[648,900,'no-preference'],[1280,900,'no-preference'],[390,844,'reduce']]){
 const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:motion,timezoneId:'America/Chicago'});try{
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(URL,{waitUntil:'networkidle'});await p.locator('#today-view').waitFor({state:'visible'});
 const current=await p.evaluate(()=>Heart52Learning.calendarWeek()),source=V[current-1];
 ck(await p.locator('#card-front-reference').textContent()===source.reference,'fresh visitor starts at current calendar week');
 ck(await p.evaluate(k=>localStorage.getItem(k),S.KEY)===null,'opening is a read-only operation');
 ck(await p.locator('#memory-card').getAttribute('aria-pressed')==='false','card starts concealed');
 ck(await p.locator('#card-back').getAttribute('aria-hidden')==='true'&&await p.locator('#card-back').evaluate(e=>e.inert),'concealed text is excluded from assistive view');
 ck(!(await p.locator('#memory-card').getAttribute('aria-label')).includes(source.text),'answer does not leak into the front accessible name');
 ck(await p.locator('#card-hint').textContent()===source.theme,'topic hint');
 const card=await p.locator('#memory-card').boundingBox();ck(card.y>=0&&card.y+card.height<=h-12,'whole opening card fits the phone/laptop viewport '+w);
 await p.locator('#memory-card').focus();await p.keyboard.press('Space');ck(await p.locator('#memory-card').getAttribute('aria-pressed')==='true','keyboard reveals card');
 ck(await p.locator('#card-verse').textContent()===source.text,'exact original passage on reverse');
 ck(await p.locator('#card-front').getAttribute('aria-hidden')==='true'&&!(await p.locator('#card-back').evaluate(e=>e.inert)),'reverse alone is accessible');
 if(process.env.HEART52_CARD_SHOTS&&w===390&&motion==='no-preference'){fs.mkdirSync(process.env.HEART52_CARD_SHOTS,{recursive:true});await p.waitForTimeout(650);await p.screenshot({path:process.env.HEART52_CARD_SHOTS+'/verse-phone.png'});}
 await p.locator('#memory-card').click();ck(await p.locator('#memory-card').getAttribute('aria-pressed')==='false','card can be concealed again');
 await p.locator('#hint-choice').selectOption('words');ck(await p.locator('#card-hint').textContent()===L.tokens(source.text).slice(0,2).map(t=>t.text).join(' ')+'…','first two original words hint');
 await p.reload({waitUntil:'networkidle'});ck(await p.locator('#hint-choice').inputValue()==='words','hint choice survives reload');ck(await p.locator('#card-front-reference').textContent()===source.reference,'fresh week position retained after saving preference');
 await p.locator('#nav-all').click();ck(await p.locator('.reference-text').count()===52,'all52 back-to-back reference view');
 for(let i=0;i<52;i++)ck(await p.locator('.reference-text').nth(i).textContent()===V[i].text,'reference selection retains original '+i);
 await p.locator('#search').fill('Romans 3:23');ck(await p.locator('.reference-text').count()===1,'reference filtering');await p.locator('.verse-link').click();
 await p.waitForFunction(()=>document.getElementById('card-front-reference').textContent==='Romans 3:23');ck(await p.locator('#memory-card').getAttribute('aria-pressed')==='false','collection opens a fresh concealed card');
 await p.locator('#deck-next').click();await p.waitForFunction(()=>document.getElementById('card-front-reference').textContent==='Romans 6:23');await p.reload({waitUntil:'networkidle'});ck(await p.locator('#card-front-reference').textContent()==='Romans 6:23','resume chooses last selected card');
 await p.locator('#open-settings').click();await p.locator('#start-choice').selectOption('calendar');await p.goto(URL,{waitUntil:'networkidle'});ck(await p.locator('#card-front-reference').textContent()===source.reference,'weekly startup preference');
 await p.locator('#nav-year').click();ck(await p.locator('.calendar-week').count()===52,'52-week calendar');ck(await p.locator('.calendar-week[aria-current=date]').count()===1,'one current week');
 await p.locator('#calendar-year').selectOption(String(new Date().getFullYear()-1));ck(await p.locator('.calendar-week[aria-current=date]').count()===0,'past year has no false today');await p.locator('#calendar-today').click();ck(await p.locator('.calendar-week[aria-current=date]').count()===1,'current year shortcut');
 await p.locator('.calendar-week').last().click();await p.waitForFunction(()=>document.getElementById('card-front-reference').textContent=== 'Revelation 3:20');ck(await p.locator('#deck-next').isDisabled(),'stable last card');
 // Longest passage must grow naturally without a tiny-font or clipped-text compromise.
 const longest=V.reduce((a,b)=>a.text.length>b.text.length?a:b);await p.goto(URL+'#card-'+longest.week);await p.locator('#memory-card').click();await p.waitForTimeout(motion==='reduce'?0:600);
 ck(await p.locator('#card-verse').textContent()===longest.text,'longest passage retains all words');ck(await p.locator('#card-verse').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=24),'verse stays large');
 ck(await p.locator('#card-back').evaluate(e=>e.scrollHeight<=e.clientHeight+2),'long verse has no internal clipping');ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
 if(process.env.HEART52_CARD_SHOTS&&w===1280){await p.goto(URL);await p.locator('#memory-card').click();await p.waitForTimeout(650);await p.screenshot({path:process.env.HEART52_CARD_SHOTS+'/verse-laptop.png'});await p.locator('#nav-year').click();await p.screenshot({path:process.env.HEART52_CARD_SHOTS+'/year-laptop.png'});}
 ck(errors.length===0,'no page or console errors '+errors.join(';'));console.log('PASS cards',w,motion);
 }finally{await ctx.close();}}
}finally{await browser.close();}console.log(passed+' Heart52 card, reference, calendar and startup checks passed.');})().catch(e=>{console.error(e);process.exit(1);});
