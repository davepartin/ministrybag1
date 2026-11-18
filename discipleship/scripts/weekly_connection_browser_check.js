#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const BASE=process.env.WEEKLY_BASE_URL||'http://127.0.0.1:8853/discipleship';
const paths=[BASE.replace(/\/$/,'')+'/tools/weekly-connection-time/'];
if(process.env.WEEKLY_LEGACY_URL)paths.push(process.env.WEEKLY_LEGACY_URL);
const IDS=['connectionTime','affirmation','highPoint','lowPoint','dreams','service','dateNight','prayer','growth','bibleVerse','customQuestion','customAnswer'];
const seeded=Object.fromEntries(IDS.map(id=>['connection_time_'+id,'SYN legacy '+id+' <b>literal</b>']));
Object.assign(seeded,{connection_time_current_step:'3',connection_time_future:'SYN preserve unknown data',lordsPrayerApp:'SYN foreign prayer',christianFoundationsResponses:'SYN foreign lesson'});
let checks=0;const ck=(value,label)=>{assert.ok(value,label);checks++;};
async function snapshot(page){return page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));}
async function upload(page,value){await page.locator('#copyFile').setInputFiles({name:'synthetic-check-in.json',mimeType:'application/json',buffer:Buffer.from(typeof value==='string'?value:JSON.stringify(value))});}
async function download(page,id){const [file]=await Promise.all([page.waitForEvent('download'),page.locator(id).click()]);return JSON.parse(fs.readFileSync(await file.path(),'utf8'));}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try {
 for(const address of paths) for(const [width,height,motion] of [[375,667,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]) {
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion});
  try {
   await ctx.addInitScript(seed=>{
    if(!localStorage.getItem('SYN-weekly-seeded')){for(const [key,value]of Object.entries(seed))localStorage.setItem(key,value);localStorage.setItem('SYN-weekly-seeded','1');}
    Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}});
    window.print=()=>{window.__printed=true;};
   },seeded);
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await p.goto(address,{waitUntil:'networkidle'});
   ck(await p.locator('#startButtonText').textContent()==='Continue our check-in','legacy answers are recognized');
   for(const id of IDS)ck(await p.locator('#'+id).inputValue()===seeded['connection_time_'+id],'legacy field intact '+id);
   const initial=await snapshot(p);for(const [key,value]of Object.entries(seeded))ck(initial[key]===value,'opening preserves raw key '+key);
   const geometry=await p.locator('main').boundingBox();ck(geometry.width<=640&&geometry.width<=width,'shared 640px width');
   ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'welcome has no overflow');
   ck(await p.locator('.ministry-link img').evaluate(e=>e.complete&&e.naturalWidth>0),'MinistryBag logo loads');
   ck(await p.locator('#saveStatus span:last-child').isVisible(),'save status is readable on phones');
   ck(await p.locator('#copy-tools summary').evaluate(el=>{
    const rgb=text=>text.match(/[0-9.]+/g).slice(0,3).map(Number);
    const lum=c=>c.map(n=>n/255).map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[0.2126,0.7152,0.0722][i],0);
    let bg=el;while(bg&&getComputedStyle(bg).backgroundColor==='rgba(0, 0, 0, 0)')bg=bg.parentElement;
    const a=lum(rgb(getComputedStyle(el).color)),b=lum(rgb(getComputedStyle(bg||document.body).backgroundColor));
    return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=4.5;
   }),'backup heading has readable contrast');
   await p.locator('#startButton').click();ck((await p.locator('#stepCounter').textContent()).includes('4 of 7'),'saved step resumes');
   for(let i=0;i<3;i++)await p.locator('#previousButton').click();
   await p.locator('#connectionTime').fill('SYN Sunday evening');
   await p.locator('#nextButton').click();await p.locator('#affirmation').fill('<img src=x onerror=alert(1)> SYN encouragement');
   for(let i=1;i<7;i++){
    ck(await p.locator(`[data-step="${i}"]`).isVisible(),'step visible '+i);
    ck(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'step has no overflow '+i);
    await p.locator('#nextButton').click();
   }
   ck(await p.locator('#summaryScreen').isVisible(),'seven-step summary opens');
   ck(await p.locator('#summary-affirmation').textContent()==='<img src=x onerror=alert(1)> SYN encouragement'&&await p.locator('#summary-affirmation img').count()===0,'summary is literal text');
   await p.locator('#copyButton').click();ck((await p.evaluate(()=>window.__copied)).includes('SYN Sunday evening'),'copy summary');
   const mail=await p.locator('#emailButton').evaluate(el=>{el.addEventListener('click',e=>e.preventDefault(),{once:true});el.click();return el.href;});
   ck(mail.startsWith('mailto:')&&decodeURIComponent(mail).includes('SYN Sunday evening'),'email summary');
   await p.locator('#printButton').click();ck(await p.evaluate(()=>window.__printed),'print summary');
   await p.locator('#copy-tools summary').click();
   const copy=await download(p,'#saveCopy');ck(copy.app==='growing-together.weekly-connection-time'&&copy.answers.connectionTime==='SYN Sunday evening','portable copy contains current answers');
   const before=await snapshot(p);
   await upload(p,'bad json');await p.waitForFunction(()=>document.getElementById('copyStatus').textContent.includes('not a valid'));
   ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'malformed copy cannot replace data');
   const replacement={...copy,step:2,answers:Object.fromEntries(IDS.map(id=>[id,'SYN restored '+id]))};
   await upload(p,replacement);await p.locator('#restoreDialog').waitFor({state:'visible'});await p.locator('#cancelRestore').click();
   ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'cancel restore is inert');
   await upload(p,replacement);await p.locator('#confirmRestore').click();
   for(const id of IDS)ck(await p.locator('#'+id).inputValue()===replacement.answers[id],'restore field '+id);
   const previous=await download(p,'#previousCopy');ck(previous.answers.connectionTime===copy.answers.connectionTime,'recovery copy retains prior check-in');
   await p.reload({waitUntil:'networkidle'});
   ck(await p.locator('#connectionTime').inputValue()==='SYN restored connectionTime','restored answers survive reload');
   ck(await p.evaluate(()=>localStorage.getItem('lordsPrayerApp'))===seeded.lordsPrayerApp&&await p.evaluate(()=>localStorage.getItem('christianFoundationsResponses'))===seeded.christianFoundationsResponses,'other apps and lessons untouched');
   if(process.env.WEEKLY_SCREENSHOTS&&address===paths[0]&&width===390&&motion==='no-preference'){
    fs.mkdirSync(process.env.WEEKLY_SCREENSHOTS,{recursive:true});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:process.env.WEEKLY_SCREENSHOTS+'/welcome.png'});await p.locator('#startButton').click();await p.waitForTimeout(350);await p.screenshot({path:process.env.WEEKLY_SCREENSHOTS+'/conversation.png'});
   }
   await p.reload({waitUntil:'networkidle'});
   p.once('dialog',d=>d.dismiss());await p.locator('#clearSavedWelcome').click();
   ck(await p.locator('#connectionTime').inputValue()==='SYN restored connectionTime','cancel clear preserves check-in');
   p.once('dialog',d=>d.accept());await p.locator('#clearSavedWelcome').click();
   ck(await p.evaluate(ids=>ids.every(id=>localStorage.getItem('connection_time_'+id)===null),IDS),'confirmed clear removes own fields');
   ck(await p.evaluate(()=>localStorage.getItem('connection_time_restore_recovery_v1')===null),'clear removes own recovery copy');
   ck(await p.evaluate(()=>localStorage.getItem('connection_time_future'))===seeded.connection_time_future,'unknown keys preserved');
   ck(errors.length===0,'no console/page errors: '+errors.join(';'));
   console.log('PASS',new URL(address).pathname,width,motion);
  }finally{await ctx.close();}
 }
 // Actual blocked-storage and partial-write behavior, with synthetic values only.
 for(const mode of ['blocked','quota','restore-rollback']){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  try{
   await ctx.addInitScript(({seed,mode})=>{
    for(const [key,value]of Object.entries(seed))localStorage.setItem(key,value);
    const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
    Storage.prototype.getItem=function(key){if(mode==='blocked')throw new DOMException('blocked','SecurityError');return get.call(this,key);};
    Storage.prototype.setItem=function(key,value){if(window.__failWrites||(mode==='restore-rollback'&&key==='connection_time_service'&&String(value).startsWith('SYN fail')))throw new DOMException('full','QuotaExceededError');return set.call(this,key,value);};
   },{seed:seeded,mode});
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(paths[0],{waitUntil:'networkidle'});
   if(mode==='restore-rollback'){
    await p.locator('#copy-tools summary').click();const before=await snapshot(p);
    await upload(p,{app:'growing-together.weekly-connection-time',version:1,step:0,answers:Object.fromEntries(IDS.map(id=>[id,'SYN fail '+id]))});await p.locator('#confirmRestore').click();
    ck(JSON.stringify(await snapshot(p))===JSON.stringify(before),'partial restore failure rolls back all prior keys');ck(await p.locator('#saveError').isVisible(),'restore failure is reported');
   }else{
    await p.locator('#startButton').click();if(mode==='quota')await p.evaluate(()=>window.__failWrites=true);
    if(mode==='quota')for(let i=0;i<3;i++)await p.locator('#previousButton').click();
    await p.locator('#connectionTime').fill('SYN unsaved current rhythm');await p.waitForTimeout(500);
    ck(await p.locator('#saveError').isVisible()&&(await p.locator('#saveStatus').textContent()).includes('Not saved'),'storage failure is truthful '+mode);
    await p.locator('#copy-tools summary').click();const copy=await download(p,'#saveCopy');ck(copy.answers.connectionTime==='SYN unsaved current rhythm','unsaved work can be exported '+mode);
    if(mode==='quota'){await p.evaluate(()=>window.__failWrites=false);await p.locator('#connectionTime').fill('SYN retry saved');await p.waitForTimeout(500);ck(await p.evaluate(()=>localStorage.getItem('connection_time_connectionTime'))==='SYN retry saved','save retries after transient failure');}
   }
   ck(errors.length===0,'no page error on storage failure');console.log('PASS storage',mode);
  }finally{await ctx.close();}
 }
 }finally{await browser.close();}
 console.log(checks+' Weekly Connection Time browser checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
