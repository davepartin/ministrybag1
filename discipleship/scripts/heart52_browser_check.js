#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const verses=require('../tools/heart52/data/verses.json'),S=require('../tools/heart52/storage.js');
const BASE=process.env.HEART52_BASE_URL||'http://127.0.0.1:8854/discipleship';
const paths=[BASE.replace(/\/$/,'')+'/tools/heart52/'];if(process.env.HEART52_LEGACY_URL)paths.push(process.env.HEART52_LEGACY_URL);
const initial={version:1,currentWeek:1,verses:{'2':{attempts:2,accuracy:80,confidence:1,lastPracticed:'2020-01-01T12:00:00Z',nextReview:'2020-01-02'},'3':{attempts:1,accuracy:90,confidence:2,lastPracticed:'2020-01-01T12:00:00Z',nextReview:'2020-01-03'}},futureMetadata:{note:'SYN preserve metadata'}};
const foreign={lordsPrayerApp:'SYN foreign prayer',connection_time_affirmation:'SYN foreign marriage answer',christianFoundationsResponses:'SYN foreign lesson', [S.LEGACY]:'SYN preserve older app key'};
let checks=0;function ck(value,label){assert.ok(value,label);checks++;}
async function data(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),S.KEY);}
async function snapshot(page){return page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));}
async function upload(page,value){await page.locator('#copy-file').setInputFiles({name:'synthetic-heart52.json',mimeType:'application/json',buffer:Buffer.from(typeof value==='string'?value:JSON.stringify(value))});}
async function confirmCopy(page,value){await upload(page,value);await page.locator('#restore-dialog').waitFor({state:'visible'});await page.locator('#confirm-restore').click();await page.locator('#restore-dialog').waitFor({state:'hidden'});}
async function getDownload(page,id,json=true){const [file]=await Promise.all([page.waitForEvent('download'),page.locator(id).click()]);const text=fs.readFileSync(await file.path(),'utf8');return json?JSON.parse(text):text;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const address of paths)for(const [width,height,density,motion]of [[320,667,1,'no-preference'],[375,667,1,'no-preference'],[390,844,1,'no-preference'],[648,900,2,'no-preference'],[1280,900,1,'no-preference'],[390,844,1,'reduce']]){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:density,reducedMotion:motion,timezoneId:'America/Chicago'});
  try{
   await ctx.addInitScript(({progress,foreign})=>{
    if(!sessionStorage.getItem('SYN-heart52-seeded')){localStorage.setItem('heart52-progress-v1',JSON.stringify(progress));for(const [key,value]of Object.entries(foreign))localStorage.setItem(key,value);sessionStorage.setItem('SYN-heart52-seeded','1');}
    const AudioClass=window.Audio;window.Audio=function(...args){const audio=new AudioClass(...args);window.__lastAudio=audio;return audio;};
   },{progress:initial,foreign});
   const p=await ctx.newPage(),errors=[],audioRequests=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('request',r=>{if(r.url().endsWith('.mp3'))audioRequests.push(r.url());});
   await p.goto(address,{waitUntil:'networkidle'});await p.locator('#library-view').waitFor({state:'visible'});
   ck(await p.locator('.verse-link').count()===52,'all52 choices');ck(await p.evaluate(key=>localStorage.getItem(key),S.KEY)===JSON.stringify(initial),'opening does not rewrite saved progress');
   ck(await p.locator('main').evaluate(e=>e.getBoundingClientRect().width<=640),'shared bounded page width');
   ck(await p.locator('.heart-logo').evaluate(e=>e.complete&&e.naturalWidth>0),'original Heart52 logo loads');
   await p.locator('#search').fill('John 3:16');ck(await p.locator('.verse-link').count()===1,'reference search');await p.locator('#search').fill('zzzz-no-passage');ck(await p.locator('.verse-link').count()===0,'empty filter result');await p.locator('#search').fill('');
   await p.locator('#theme-filter').selectOption("God's Word");ck(await p.locator('.verse-link').count()===verses.filter(v=>v.theme==="God's Word").length,'theme filter');await p.locator('#theme-filter').selectOption('');
   if(process.env.HEART52_SHOTS&&address===paths[0]&&width===1280){fs.mkdirSync(process.env.HEART52_SHOTS,{recursive:true});await p.screenshot({path:process.env.HEART52_SHOTS+'/library-laptop.png'});}
   await p.locator('#continue-link').click();await p.locator('#verse-text').waitFor();ck(await p.locator('#verse-text').textContent()===verses[0].text,'read exact original quotation');
   ck(audioRequests.length===0,'recordings are not preloaded');
   if(address===paths[0]&&width===390&&motion==='no-preference'){
    await p.locator('#audio-toggle').click();await p.waitForFunction(()=>document.getElementById('audio-status').textContent==='Playing the passage.');
    ck(audioRequests.length>0&&audioRequests.every(u=>u.includes('week-01.mp3')),'only chosen narration is fetched');
    await p.locator('#audio-rate').selectOption('0.75');await p.locator('#loop-audio').check();ck(await p.evaluate(()=>window.__lastAudio.playbackRate===0.75&&window.__lastAudio.loop),'speed and loop controls');
   }
   await p.locator('#begin-practice').click();await p.locator('#practice-text').waitFor();ck(await p.locator('#practice-text').textContent()===verses[0].text,'full practice keeps exact punctuation');
   if(audioRequests.length)ck(await p.evaluate(()=>window.__lastAudio.paused&&!window.__lastAudio.getAttribute('src')),'leaving listening stops media');
   await p.locator('#hide-more').click();ck(await p.locator('.word-hint').count()>0,'words can be hidden');await p.locator('.word-hint').first().click();ck(await p.locator('.word-hint[aria-pressed=true]').count()===1,'word hint reveals one word');
   await p.locator('#hint-level').selectOption('3');ck(await p.locator('.word-hint').count()>5,'first-letter practice');await p.locator('#hint-level').selectOption('4');ck(await p.locator('#hide-more').isDisabled(),'full concealment has a stable limit');
   await p.locator('details.game summary').click();const chunks=await p.locator('[data-chunk]').count();
   await p.locator('[data-chunk="1"]').click();await p.locator('[data-chunk="0"]').click();await p.locator('#check-order').click();ck((await p.locator('#order-feedback').textContent()).includes('Not quite'),'wrong phrase order gets feedback');await p.locator('#undo-phrase').click();await p.locator('#undo-phrase').click();
   for(let n=0;n<chunks;n++)await p.locator(`[data-chunk="${n}"]`).click();await p.locator('#check-order').click();ck((await p.locator('#order-feedback').textContent()).includes('in order'),'phrase reconstruction works');ck(!(await data(p)).verses[1],'games do not invent recall scores');
   await p.locator('#begin-recall').click();await p.locator('#recall-input').waitFor();ck(!(await p.locator('#answer-panel').isVisible())&&!(await p.locator('#workspace').innerText()).includes(verses[0].text),'recall keeps the answer hidden');
   await p.locator('#check-recall').click();ck(!(await data(p)).verses[1],'empty recall is not a practice success');
   await p.locator('#recall-input').fill('I have hidden your word in my heart');await p.locator('#check-recall').click();ck((await data(p)).verses[1].accuracy<100&&await p.locator('#answer-text mark').count()>0,'missed words are highlighted');ck(await p.locator('#answer-text').textContent()===verses[0].text,'feedback retains exact verse');
   ck(await p.locator('#check-recall').isDisabled()&&(await data(p)).verses[1].attempts===1,'one grade per attempt');
   await p.locator('#try-again').click();ck(!(await p.locator('#answer-panel').isVisible()),'retry hides the answer');await p.locator('#recall-input').fill(verses[0].text.toUpperCase().replace(/[.,]/g,''));await p.locator('#check-recall').click();ck((await data(p)).verses[1].accuracy===100&&(await data(p)).verses[1].attempts===2,'fresh recall and fair case/punctuation scoring');
   await p.locator('[data-confidence="4"]').click();const saved=await data(p);ck(saved.verses[1].confidence===4&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(saved.verses[1].nextReview),'self-assessed review scheduled');
   const day=await p.evaluate(()=>[new Date().getFullYear(),new Date().getMonth(),new Date().getDate()]);ck((Date.parse(saved.verses[1].nextReview+'T00:00:00Z')-Date.UTC(...day))/86400000===14,'two-week interval uses local calendar');
   await p.locator('#tab-read').click();await p.locator('#tab-read').focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.getElementById('tab-practice').getAttribute('aria-selected')==='true');ck(await p.locator('#tab-practice').evaluate(e=>e===document.activeElement),'keyboard tabs work');
   await p.locator('#begin-recall').click();ck(!(await p.locator('#answer-panel').isVisible()),'new recall from practice starts concealed');
   await p.locator('#back-library').click();await p.locator('#start-review').click();await p.waitForFunction(()=>document.getElementById('passage-heading').textContent==='John 3:16');ck(!(await p.locator('#answer-panel').isVisible()),'due review does not show its answer');
   await p.locator('#reveal-answer').click();await p.locator('[data-confidence="1"]').click();ck((await data(p)).verses[2].accuracy===null&&(await data(p)).verses[2].attempts===3,'spoken recall is not a fabricated typed score');
   await p.locator('#next-review').click();await p.waitForFunction(()=>document.getElementById('passage-heading').textContent==='Romans 3:23');await p.locator('#reveal-answer').click();await p.locator('[data-confidence="2"]').click();await p.locator('#finish-review').click();await p.locator('#library-view').waitFor({state:'visible'});
   if(address===paths[0]&&width===390&&motion==='no-preference'){
    for(const v of verses){await p.evaluate(number=>{location.hash='week-'+number;},v.week);await p.waitForFunction(reference=>document.getElementById('passage-heading').textContent===reference,v.reference);ck(await p.locator('#verse-text').textContent()===v.text,'render original passage '+v.week);ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'passage fits '+v.week);}
    ck(await p.locator('#next-passage').isDisabled(),'passage52 is a stable endpoint');await p.locator('#back-library').click();
   }
   await p.locator('#copies summary').click();const copy=await getDownload(p,'#save-copy');ck(copy.app==='growing-together.heart52'&&copy.progress.futureMetadata.note==='SYN preserve metadata','portable progress and metadata');
   const before=await snapshot(p);await upload(p,'broken json');await p.waitForFunction(()=>document.getElementById('copy-status').textContent.includes('not a valid'));ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'invalid import is inert');
   const replacement={...copy,progress:{...copy.progress,currentWeek:52,futureMetadata:{note:'SYN restored metadata'}}};await upload(p,replacement);await p.locator('#restore-dialog').waitFor({state:'visible'});await p.locator('#cancel-restore').click();ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'cancel import is inert');
   await confirmCopy(p,replacement);ck((await data(p)).currentWeek===52,'confirmed copy restores position');const recovery=await getDownload(p,'#previous-copy');ck(recovery.app==='growing-together.heart52'&&recovery.progress.futureMetadata.note==='SYN preserve metadata','recovery is a portable restorable copy');await confirmCopy(p,recovery);ck((await data(p)).futureMetadata.note==='SYN preserve metadata','recovery round trip');
   await p.reload({waitUntil:'networkidle'});ck((await data(p)).verses[1].attempts===2,'progress survives reload');
   await p.locator('#copies summary').click();p.once('dialog',d=>d.dismiss());await p.locator('#reset-progress').click();ck((await data(p)).verses[1].attempts===2,'cancel reset preserves progress');p.once('dialog',d=>d.accept());await p.locator('#reset-progress').click();ck(Object.keys((await data(p)).verses).length===0&&await p.evaluate(key=>localStorage.getItem(key)===null,S.RECOVERY),'reset is scoped');
   for(const [key,value]of Object.entries(foreign))ck(await p.evaluate(key=>localStorage.getItem(key),key)===value,'foreign data retained '+key);
   ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');ck(errors.length===0,'no console/page errors: '+errors.join(';'));
   if(process.env.HEART52_SHOTS&&address===paths[0]&&width===390&&motion==='no-preference'){
    fs.mkdirSync(process.env.HEART52_SHOTS,{recursive:true});await p.evaluate(()=>{location.hash='week-1/practice';scrollTo(0,0);});await p.locator('#hint-level').waitFor();await p.locator('#hint-level').selectOption('2');await p.screenshot({path:process.env.HEART52_SHOTS+'/practice-phone.png'});await p.locator('#begin-recall').click();await p.locator('#recall-input').waitFor();await p.screenshot({path:process.env.HEART52_SHOTS+'/recall-phone.png'});
   }
   console.log('PASS',new URL(address).pathname,width,density+'x',motion);
  }finally{await ctx.close();}
 }
 // Failure and compatibility cases are isolated from all real user data.
 for(const scenario of ['legacy','corrupt','blocked','quota','restore-rollback','library-failure','audio-fallback']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/Chicago'});
  try{
   await ctx.addInitScript(({scenario,progress,key,legacy,foreign})=>{
    for(const [name,value]of Object.entries(foreign))localStorage.setItem(name,value);
    if(scenario==='legacy')localStorage.setItem(legacy,JSON.stringify({...progress,version:2,streak:7}));else localStorage.setItem(key,scenario==='corrupt'?'{malformed':JSON.stringify(progress));
    const get=Storage.prototype.getItem,set=Storage.prototype.setItem;window.__readOriginal=name=>get.call(localStorage,name);
    Storage.prototype.getItem=function(name){if(scenario==='blocked')throw new DOMException('blocked','SecurityError');return get.call(this,name);};
    Storage.prototype.setItem=function(name,value){if(window.__denyWrites||(scenario==='restore-rollback'&&name===key&&String(value).includes('SYN fail')))throw new DOMException('full','QuotaExceededError');return set.call(this,name,value);};
    if(scenario==='audio-fallback')Object.defineProperty(window,'speechSynthesis',{value:{speaking:false,cancel(){window.__cancelled=true;},speak(u){window.__spoken=u.text;}}});
   },{scenario,progress:initial,key:S.KEY,legacy:S.LEGACY,foreign});
   if(scenario==='library-failure')await ctx.route('**/data/verses.json',r=>r.fulfill({contentType:'application/json',body:'[]'}));
   if(scenario==='audio-fallback')await ctx.route('**/assets/audio/*.mp3',r=>r.fulfill({status:404,body:''}));
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(paths[0],{waitUntil:'networkidle'});
   if(scenario==='library-failure'){
    ck(await p.locator('#load-error').isVisible()&&await p.locator('#library-view').isHidden(),'failed library is explained');ck(await p.evaluate(key=>localStorage.getItem(key),S.KEY)===JSON.stringify(initial),'failed load preserves progress');await ctx.unroute('**/data/verses.json');await p.locator('#retry-load').click();await p.locator('#library-view').waitFor({state:'visible'});ck(await p.locator('.verse-link').count()===52,'retry recovers library');
   }else if(scenario==='legacy'){
    ck(await p.evaluate(key=>localStorage.getItem(key),S.KEY)===null,'v2 opening does not create a new record');const raw=await p.evaluate(key=>localStorage.getItem(key),S.LEGACY);await p.locator('#continue-link').click();await p.locator('#tab-recall').click();await p.locator('#reveal-answer').click();await p.locator('[data-confidence="3"]').click();ck((await data(p)).verses[1].attempts===1,'v2 progress continues into new app');ck(await p.evaluate(key=>localStorage.getItem(key),S.LEGACY)===raw,'v2 original remains exact');
   }else if(scenario==='restore-rollback'){
    await p.locator('#copies summary').click();const before=await snapshot(p);await confirmCopy(p,{app:'growing-together.heart52',formatVersion:1,progress:{...initial,futureMetadata:{note:'SYN fail'}}});ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'failed restore rolls back data and recovery');ck(await p.locator('#storage-notice').isVisible(),'restore failure reported');
   }else if(scenario==='audio-fallback'){
    await p.locator('#continue-link').click();await p.locator('#audio-toggle').click();await p.waitForFunction(()=>document.getElementById('audio-toggle').textContent==='Use device voice');ck(!await p.evaluate(()=>Boolean(window.__spoken)),'missing recording does not start speech automatically');await p.locator('#audio-toggle').click();ck(await p.evaluate(()=>window.__spoken)===verses[0].text,'device fallback speaks the original text');
   }else{
    if(scenario==='quota')await p.evaluate(()=>window.__denyWrites=true);
    await p.locator('#continue-link').click();await p.locator('#tab-recall').click();await p.locator('#recall-input').fill(verses[0].text);await p.locator('#check-recall').click();ck(await p.locator('#storage-notice').isVisible()&&(await p.locator('#save-status').textContent()).includes('not saved'),'failure does not claim a save '+scenario);
    await p.locator('#copies summary').click();const copy=await getDownload(p,'#save-copy');ck(copy.progress.verses[1].attempts===1,'unsaved practice can be downloaded '+scenario);
    if(scenario==='blocked')ck(await p.evaluate(key=>window.__readOriginal(key),S.KEY)===JSON.stringify(initial),'blocked reads cannot overwrite unread progress');
    if(scenario==='corrupt')ck(await getDownload(p,'#stored-copy',false)==='{malformed','corrupt stored data remains downloadable exactly');
    if(scenario==='quota'){await p.evaluate(()=>window.__denyWrites=false);await p.locator('[data-confidence="2"]').click();ck((await data(p)).verses[1].attempts===1,'later save keeps unsaved practice');}
   }
   ck(errors.length===0,'no page errors on '+scenario);console.log('PASS compatibility',scenario);
  }finally{await ctx.close();}
 }
 }finally{await browser.close();}
 console.log(checks+' Heart52 browser checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
