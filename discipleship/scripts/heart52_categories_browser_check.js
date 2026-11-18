#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const S=require('../tools/heart52/storage.js'),V=require('../tools/heart52/data/verses.json');
const BASE=(process.env.HEART52_BASE_URL||'http://127.0.0.1:8854/discipleship').replace(/\/$/,'')+'/tools/heart52/';
const entry={attempts:2,accuracy:80,confidence:3,lastPracticed:'2026-11-01T12:00:00Z',nextReview:'2026-12-01',futureField:'SYN preserve'};
const seed={version:1,currentWeek:4,verses:{1:{...entry},2:{...entry,learningStatus:'new'},3:{...entry,learningStatus:'memorized'},5:{...entry,attempts:0,learningStatus:'learning'}},futureMetadata:{note:'SYN untouched'}};
let checks=0;function ck(v,m){assert.ok(v,m);checks++;}
async function record(p){return p.evaluate(k=>JSON.parse(localStorage.getItem(k)),S.KEY);}
async function waitVerse(p,n){await p.waitForFunction(r=>document.getElementById('card-front-reference').textContent===r,V[n-1].reference);}
async function tag(p,state){await p.locator('[data-learning-status="'+state+'"]').click();}
(async()=>{const b=await chromium.launch({executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true});try{
 for(const [width,motion]of [[320,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
 const ctx=await b.newContext({viewport:{width,height:844},reducedMotion:motion});try{
 await ctx.addInitScript(seed=>{if(!sessionStorage.getItem('SYN-category-seed')){localStorage.setItem('heart52-progress-v1',JSON.stringify(seed));localStorage.setItem('lordsPrayerApp','SYN prayer');localStorage.setItem('connection_time_affirmation','SYN marriage');localStorage.setItem('christianFoundationsResponses','SYN answers');sessionStorage.setItem('SYN-category-seed','1');}},seed);
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await p.goto(BASE,{waitUntil:'networkidle'});await waitVerse(p,4);
 ck(await p.evaluate(k=>localStorage.getItem(k),S.KEY)===JSON.stringify(seed),'opening does not rewrite old history');
 ck(await p.locator('#deck-new-link span').textContent()==='49'&&await p.locator('#deck-learning-link span').textContent()==='2'&&await p.locator('#deck-memorized-link span').textContent()==='1','derived and manual deck counts');
 ck(await p.locator('[data-learning-status=new]').getAttribute('aria-pressed')==='true','current category visible');
 ck(await p.locator('#memory-card').evaluate(e=>e.getBoundingClientRect().top)===144,'category controls do not add header space');
 await p.locator('#memory-card').click();await p.locator('#card-category').scrollIntoViewIfNeeded();const scroll=await p.evaluate(()=>scrollY);await tag(p,'learning');
 ck(await p.locator('#memory-card').getAttribute('aria-pressed')==='true','tagging keeps a revealed verse revealed');ck(Math.abs(await p.evaluate(()=>scrollY)-scroll)<3,'tagging does not jump to top');
 let data=await record(p);ck(data.verses[4].learningStatus==='learning'&&data.verses[4].attempts===0&&data.verses[4].nextReview===null,'manual category invents no score or schedule');
 ck(JSON.stringify(data.verses[1])===JSON.stringify(seed.verses[1])&&data.futureMetadata.note==='SYN untouched','old metadata and record untouched');
 await p.locator('#deck-learning-link').click();await waitVerse(p,4);ck((await p.locator('#deck-position').textContent()).includes('2 OF 3'),'filtered deck starts on current member');
 await p.locator('#deck-next').click();await waitVerse(p,5);ck(await p.locator('#deck-next').isDisabled(),'last learning card is bounded');await p.locator('#deck-previous').click();await waitVerse(p,4);await p.locator('#deck-previous').click();await waitVerse(p,1);ck(await p.locator('#deck-previous').isDisabled(),'first learning card is bounded');
 await p.locator('#deck-next').click();await waitVerse(p,4);await tag(p,'memorized');await waitVerse(p,1);ck((await p.locator('#deck-position').textContent()).includes('OF 2'),'moving a verse updates filtered deck');ck(await p.locator('#deck-memorized-link span').textContent()==='2','memorized count updates');
 await p.locator('#deck-memorized-link').click();await waitVerse(p,3);await p.locator('#deck-next').click();await waitVerse(p,4);await p.reload({waitUntil:'networkidle'});await waitVerse(p,4);ck(await p.locator('[data-learning-status=memorized]').getAttribute('aria-pressed')==='true','category and scoped URL survive reload');
 await tag(p,'new');await waitVerse(p,3);await tag(p,'new');ck(await p.locator('#deck-empty').isVisible()&&await p.locator('#memory-card').isHidden(),'last moved verse produces honest empty deck');ck(await p.locator('#deck-memorized-link span').textContent()==='0','empty deck count zero');
 ck(JSON.stringify((await record(p)).verses[3])===JSON.stringify({...seed.verses[3],learningStatus:'new'}),'changing category preserves old attempt metadata');
 await p.locator('#nav-all').click();await p.locator('#status-filter').selectOption('learning');ck(await p.locator('.reference-text').count()===2,'all52 reference view can filter categories');await p.locator('.verse-link').first().click();await waitVerse(p,1);ck(p.url().includes('#deck-learning/1'),'reference link opens scoped deck');
 await p.locator('#this-week').click();ck(!p.url().includes('#deck-'),'weekly shortcut leaves scoped deck');
 await p.locator('#copies summary').click();const [download]=await Promise.all([p.waitForEvent('download'),p.locator('#save-copy').click()]);const copy=JSON.parse(fs.readFileSync(await download.path(),'utf8'));ck(copy.progress.verses[4].learningStatus==='new'&&copy.progress.verses[5].learningStatus==='learning','portable copy carries categories');
 const replacement={...copy,progress:{...copy.progress,currentWeek:4,verses:{...copy.progress.verses,4:{...copy.progress.verses[4],learningStatus:'memorized'}}}};
 await p.locator('#copy-file').setInputFiles({name:'SYN-categories.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await p.locator('#confirm-restore').click();await waitVerse(p,4);ck(await p.locator('[data-learning-status=memorized]').getAttribute('aria-pressed')==='true','restored copy retains category');
 await p.locator('#continue-link').click();await p.locator('#tab-recall').click();await p.locator('#recall-input').fill(V[3].text);await p.locator('#check-recall').click();ck((await record(p)).verses[4].learningStatus==='memorized','a practice score preserves the manual category');await p.locator('#back-library').click();await waitVerse(p,4);ck(await p.locator('[data-learning-status=memorized]').getAttribute('aria-pressed')==='true','return from practice retains visible category');
 const raw=await p.evaluate(k=>localStorage.getItem(k),S.KEY);await p.locator('#copies summary').click();await p.locator('#copy-file').setInputFiles({name:'SYN-invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...replacement,progress:{...replacement.progress,verses:{4:{...replacement.progress.verses[4],learningStatus:'invalid'}}}}))});await p.waitForFunction(()=>document.getElementById('copy-status').textContent.includes('not a valid'));ck(await p.evaluate(k=>localStorage.getItem(k),S.KEY)===raw,'invalid category import is inert');
 if(process.env.HEART52_CATEGORY_SHOTS&&width===390&&motion==='no-preference'){fs.mkdirSync(process.env.HEART52_CATEGORY_SHOTS,{recursive:true});await p.locator('#memory-card').scrollIntoViewIfNeeded();await p.screenshot({path:process.env.HEART52_CATEGORY_SHOTS+'/categories-phone.png'});}
 for(const [key,value]of Object.entries({lordsPrayerApp:'SYN prayer',connection_time_affirmation:'SYN marriage',christianFoundationsResponses:'SYN answers'}))ck(await p.evaluate(k=>localStorage.getItem(k),key)===value,'other data intact '+key);
 ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');ck(errors.length===0,'no page/console errors: '+errors.join(';'));console.log('PASS categories',width,motion);
 }finally{await ctx.close();}}
}finally{await b.close();}console.log(checks+' Heart52 category and scoped-deck checks passed.');})().catch(e=>{console.error(e);process.exitCode=1;});
