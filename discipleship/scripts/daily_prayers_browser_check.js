#!/usr/bin/env node
'use strict';
// Synthetic legacy-data preservation and real companion workflows, on both hosted paths.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const fixture = require('./fixtures/daily-prayers-legacy.json');
const base = process.env.BASE_URL || 'http://127.0.0.1:8826/discipleship';
const paths = [base.replace(/\/$/, '') + '/tools/daily-prayers/'];
if (process.env.LEGACY_URL) paths.push(process.env.LEGACY_URL);
const DATA='lordsPrayerApp', PRAYER='lordsPrayerApp_generated';
let checks=0;
function equal(actual, expected, label) { assert.deepEqual(actual,expected,label); checks++; }
function ok(value,label) { assert.ok(value,label); checks++; }
async function downloadJSON(page, button) {
 const [download] = await Promise.all([page.waitForEvent('download'), page.locator(button).click()]);
 return JSON.parse(fs.readFileSync(await download.path(),'utf8'));
}
async function upload(page, value, name='synthetic-prayers.json') {
 await page.locator('#backup-file').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(typeof value==='string'?value:JSON.stringify(value))});
}
(async()=>{
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true});
 try {
 for (const url of paths) {
  for (const width of [375,390,1280]) {
   const context=await browser.newContext({viewport:{width,height:844},reducedMotion:width===390?'reduce':'no-preference',acceptDownloads:true});
   const page=await context.newPage(); const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon.ico'))errors.push(m.text());});
   const data={...fixture.data, futureField:'preserve me',familyMembers:fixture.data.familyMembers.map(p=>({...p,extra:'keep member metadata'}))};
   const raw=JSON.stringify(data); const original='Existing prayer stays exactly as saved.\n\nSYNTHETIC ONLY.';
   await context.addInitScript(({DATA,PRAYER,raw,original})=>{if(!sessionStorage.getItem('seeded')){localStorage.clear();localStorage.setItem(DATA,raw);localStorage.setItem(PRAYER,original);sessionStorage.setItem('seeded','yes');}},{DATA,PRAYER,raw,original});
   const response=await page.goto(url);equal(response.status(),200,'app responds');
   await page.locator('#read-view').waitFor({state:'visible'});
   equal(await page.locator('#prayer-content').textContent(),original,'saved prayer verbatim');
   equal(await page.evaluate(k=>localStorage.getItem(k),DATA),raw,'load never rewrites data');
   equal(await page.evaluate(k=>localStorage.getItem(k),PRAYER),original,'load never rewrites prayer');
   equal(await page.locator('#lords-prayer').textContent(),fixture.lordsDisplay,'original Lord prayer unchanged');
   ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'read has no horizontal overflow');
   await page.locator('#edit-prayers').click();
   equal(await page.evaluate(()=>document.activeElement.id),'edit-heading','editor focus');
   equal(await page.evaluate(()=>scrollY),0,'editor opens at top');
   await page.locator('#read-prayers').click();
   equal(await page.locator('#prayer-content').textContent(),fixture.generated,'generator matches actual legacy output');
   equal(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)).futureField,'preserve me','unknown keys preserved');
   const full=fixture.lordsEmail+'\n\n---\n\nMy Daily Prayers\n\n'+fixture.generated;
   const href=await page.locator('#email-prayers').getAttribute('href');
   equal(new URLSearchParams(href.split('?')[1]).get('body'),full,'email preserves original prayers');
   await page.evaluate(()=>{window.__clipboard='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__clipboard=text;}}});});
   await page.locator('#copy-prayers').click();equal(await page.evaluate(()=>window.__clipboard),full,'copy exact text');
   await page.evaluate(()=>{window.__printed=0;window.print=()=>window.__printed++;});
   await page.locator('#print-prayers').click();equal(await page.evaluate(()=>window.__printed),1,'print available');
   await page.emulateMedia({media:'print'});
   equal(await page.locator('.site-header').isVisible(),false,'print excludes chrome');
   equal(await page.locator('#print-lords').isVisible(),true,'print includes Lord prayer');await page.emulateMedia({media:'screen'});
   await page.locator('#edit-prayers').click();await page.locator('#church-section summary').click();
   await page.locator('#churchCustom').fill('SYN autosaved without blur');
   equal(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)).churchCustom,'SYN autosaved without blur','church autosaves on input');
   await page.reload();await page.locator('#edit-view').waitFor({state:'visible'});
   equal(await page.locator('#churchCustom').inputValue(),'SYN autosaved without blur','draft reopens');
   await page.locator('#family-section summary').click();
   await page.locator('#family-members .remove-person').first().click();
   equal(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)).familyMembers.length,0,'remove explicit');
   await page.locator('#undo-remove').click();
   equal(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)).familyMembers,data.familyMembers,'undo restores full person');
   const malicious='<img src=x onerror="window.__injected=true">';
   await page.locator('#family-name-0').fill(malicious);await page.locator('#read-prayers').click();
   ok((await page.locator('#prayer-content').textContent()).includes(malicious),'names rendered as text');
   equal(await page.locator('#prayer-content img').count(),0,'no name HTML');
   equal(await page.evaluate(()=>window.__injected),undefined,'no injected script');
   await page.locator('#copy-tools summary').click();
   const backup=await downloadJSON(page,'#download-copy');
   equal(backup.format,'ministrybag.daily-prayers','portable format');equal(backup.version,1,'versioned copy');
   equal(backup.data,JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)),'copy contains full draft and metadata');
   equal(backup.generatedPrayer,await page.locator('#prayer-content').textContent(),'copy exact prayer');
   const before=await page.evaluate(({DATA,PRAYER})=>[localStorage.getItem(DATA),localStorage.getItem(PRAYER)],{DATA,PRAYER});
   await upload(page,'not json');await page.waitForFunction(()=>document.getElementById('backup-status').textContent.includes('could not be read'));
   equal(await page.locator('#restore-dialog').isVisible(),false,'invalid copy rejected');
   await upload(page,{...backup,version:99});await page.waitForFunction(()=>document.getElementById('backup-status').textContent.includes('Choose a Daily Prayers'));
   equal(await page.locator('#restore-dialog').isVisible(),false,'unsupported version rejected');
   const imported={...backup,data:{...backup.data,churchCustom:'SYN restored'},generatedPrayer:'SYN restored prayer'};
   await upload(page,imported);await page.locator('#restore-dialog').waitFor({state:'visible'});await page.locator('#cancel-restore').click();
   equal(await page.evaluate(({DATA,PRAYER})=>[localStorage.getItem(DATA),localStorage.getItem(PRAYER)],{DATA,PRAYER}),before,'cancel never replaces data');
   await upload(page,imported);await page.locator('#restore-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');
   equal(await page.evaluate(({DATA,PRAYER})=>[localStorage.getItem(DATA),localStorage.getItem(PRAYER)],{DATA,PRAYER}),before,'Escape never replaces data');
   await upload(page,imported);await page.locator('#restore-dialog').waitFor({state:'visible'});await page.locator('#confirm-restore').click();
   equal(await page.locator('#prayer-content').textContent(),'SYN restored prayer','confirmed restore shown');
   equal(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DATA)).churchCustom,'SYN restored','confirmed restore saved');
   const previous=await downloadJSON(page,'#download-previous');equal(previous.data,JSON.parse(before[0]),'previous data recoverable');equal(previous.generatedPrayer,before[1],'previous prayer recoverable');
   ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'all flows no horizontal overflow');
   equal(errors,[],'no browser errors');await context.close();
  }
  for(const mode of ['fresh','malformed','quota','unreadable','partial','restore-failure']) {
   const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});const page=await context.newPage();
   await context.addInitScript(({mode,DATA,PRAYER,fixture})=>{
    if(mode!=='fresh') {localStorage.setItem(DATA,mode==='malformed'?'{unreadable':JSON.stringify(mode==='partial'?{familyMembers:[{name:'SYN partial'}]}:fixture.data));localStorage.setItem(PRAYER,fixture.generated);}
    const read=Storage.prototype.getItem,write=Storage.prototype.setItem;
    window.__read=key=>read.call(localStorage,key);
    if(mode==='quota') Storage.prototype.setItem=function(key,value){if(key===DATA||key===PRAYER)throw new DOMException('Synthetic quota','QuotaExceededError');return write.call(this,key,value);};
    if(mode==='unreadable') Storage.prototype.getItem=function(key){if(key===DATA||key===PRAYER)throw new DOMException('Synthetic denied','SecurityError');return read.call(this,key);};
   },{mode,DATA,PRAYER,fixture});
   await page.goto(url);
   if(mode==='fresh') {
    await page.locator('#edit-view').waitFor({state:'visible'});await page.locator('#personalCustom').fill('SYN new prayer');await page.locator('#read-prayers').click();
    ok((await page.locator('#prayer-content').textContent()).includes('SYN new prayer'),'fresh prayer works');await page.reload();await page.locator('#read-view').waitFor({state:'visible'});checks++;
   } else if(mode==='malformed') {
    equal(await page.evaluate(()=>document.getElementById('prayer-form').inert),true,'unreadable model protected');
    equal(await page.locator('#prayer-content').textContent(),fixture.generated,'readable prayer still available');
    equal(await page.evaluate(k=>window.__read(k),DATA),'{unreadable','bad raw store never overwritten');
    const copy=await downloadJSON(page,'#download-copy');equal(copy.rawStores.data,'{unreadable','original raw data recoverable');
   } else if(mode==='restore-failure') {
    await page.locator('#copy-tools summary').click();
    const backup={format:'ministrybag.daily-prayers',version:1,data:{...fixture.data,churchCustom:'SYN replacement'},generatedPrayer:'SYN replacement'};
    await page.evaluate(PRAYER=>{const write=Storage.prototype.setItem;let failed=false;Storage.prototype.setItem=function(k,v){if(k===PRAYER&&!failed){failed=true;throw new DOMException('Synthetic failure','QuotaExceededError');}return write.call(this,k,v);};},PRAYER);
    await upload(page,backup);await page.locator('#restore-dialog').waitFor({state:'visible'});await page.locator('#confirm-restore').click();
    equal(await page.evaluate(k=>window.__read(k),DATA),JSON.stringify(fixture.data),'partial restore rolls data back');
    equal(await page.evaluate(k=>window.__read(k),PRAYER),fixture.generated,'partial restore preserves prayer');
    equal(await page.locator('#prayer-content').textContent(),fixture.generated,'partial restore leaves open list unchanged');
    ok((await page.locator('#backup-status').textContent()).includes('could not finish'),'restore failure reported');
    const previous=await downloadJSON(page,'#download-previous');equal(previous.data,fixture.data,'failed restore recovery available');
   } else if(mode==='partial') {
    equal(await page.evaluate(k=>window.__read(k),DATA),JSON.stringify({familyMembers:[{name:'SYN partial'}]}),'older partial data unmodified on open');
    await page.locator('#edit-prayers').click();await page.locator('#read-prayers').click();ok((await page.locator('#prayer-content').textContent()).includes('SYN partial'),'older partial person readable');
   } else {
    if(mode==='quota')await page.locator('#edit-prayers').click();
    await page.locator('#personalCustom').fill('SYN unsaved memory');await page.locator('#read-prayers').click();
    ok(await page.locator('#save-error').isVisible(),'storage failure visible');
    equal(await page.evaluate(k=>window.__read(k),DATA),JSON.stringify(fixture.data),'storage failure never overwrites original');
    const copy=await downloadJSON(page,'#download-copy');equal(copy.data.personalCustom,'SYN unsaved memory','unsaved work downloadable');
    ok((await page.locator('#prayer-content').textContent()).includes('SYN unsaved memory'),'memory prayers still readable');
   }
   await context.close();
  }
 }
 for(const url of paths) {
  const context=await browser.newContext({viewport:{width:320,height:740},reducedMotion:'reduce'});const page=await context.newPage();await page.goto(url);
  await page.locator('#edit-view').waitFor({state:'visible'});
  const first=page.locator('#personal-attrs button').first();await first.focus();await page.keyboard.press('Space');
  equal(await first.getAttribute('aria-pressed'),'true','keyboard attribute toggle');
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320px editor fits');
  ok(await first.evaluate(el=>el.getBoundingClientRect().height>=44),'phone touch target');
  ok(await page.locator('#personalCustom').evaluate(el=>el.labels.length>0),'request has native label');
  await page.locator('#read-prayers').click();ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320px reader fits');
  equal(await page.evaluate(()=>document.activeElement.id),'read-heading','reader focus');
  await context.close();
 }
 console.log('Daily Prayers: '+checks+' assertions passed across '+paths.length+' hosted path(s).');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
