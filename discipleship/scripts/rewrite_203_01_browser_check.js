#!/usr/bin/env node
'use strict';
// Isolated synthetic answers, including original retired prompts. No real accounts.
const assert = require('assert/strict');
const {chromium} = require('playwright');
const data = require('../data/203-01.json');
const nextData = require('../data/203-02.json');
const storage = require('./answer-storage.js');
const base = process.env.REWRITE20301_BASE_URL || 'http://127.0.0.1:8816/index.html';
const active = data.blocks.filter(b=>b.type==='question'), retired=data.retiredQuestions||[];
const foreignKey = 'question-203-' + nextData.blocks.find(b=>b.type==='question').id;
const seed = {[storage.MIGRATION_FLAG]:true,[foreignKey]:'SYN-next-lesson-private'};
for(const [i,q]of active.entries())seed['question-203-'+q.id]='SYN-current-'+i;
for(const [i,q]of retired.entries())seed['question-203-'+q.id]='SYN-earlier-'+i;
let checks=0;
function ck(label,ok){checks++;assert.ok(ok,label);}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
  for(const width of [375,390,1280])for(const motion of ['no-preference','reduce']){
   const tag=width+'/'+motion,ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion,acceptDownloads:true});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('rewrite-seeded')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('rewrite-seeded','yes');}},seed);
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'#203-1',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('#session-1');await lesson.locator('.question-textarea').first().waitFor();
    ck(tag+' seven active fields',await lesson.locator('.question-textarea').count()===7&&active.length===7);
    for(const q of active){const key='question-203-'+q.id;ck(tag+' restored '+q.id,await lesson.locator('#'+key).inputValue()===seed[key]);}
    for(const q of retired)ck(tag+' retired field absent '+q.id,await lesson.locator('#question-203-'+q.id).count()===0);
    ck(tag+' approved text renders',await lesson.evaluate((el,data)=>{
     const norm=s=>s.replace(/\s+/g,' ').trim();return data.blocks.filter(b=>['text','verse','parable'].includes(b.type)).every(b=>{const d=document.createElement('div');d.innerHTML=b.text;return norm(el.textContent).includes(norm(d.textContent));});
    },data));
    ck(tag+' both current widgets',await lesson.locator('iframe').count()===2);
    const before=await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'));
    const crossHost=lesson.locator('iframe[src*="great-command-v5-203.html"]');
    await crossHost.scrollIntoViewIfNeeded();const cross=await(await crossHost.elementHandle()).contentFrame();await cross.locator('#next-btn').waitFor();
    await cross.locator('#next-btn').focus();await page.keyboard.press('Enter');await page.waitForTimeout(motion==='reduce'?50:700);
    ck(tag+' cross begins by keyboard',await cross.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step')==='1');
    const mapHost=lesson.locator('iframe[src*="personal-ministry-map.html"]');
    await mapHost.scrollIntoViewIfNeeded();const map=await(await mapHost.elementHandle()).contentFrame();await map.locator('[data-control="begin"]').waitFor();
    await map.locator('[data-control="overview"]').click();ck(tag+' whole map',await map.locator('[data-control="return"]').count()===1);await map.locator('[data-control="return"]').click();
    await map.locator('[data-control="begin"]').focus();await page.keyboard.press('Space');
    let ended=false;
    for(let i=0;i<10;i++){
     await page.waitForTimeout(250);
     ck(tag+' map frame fits '+i,await mapHost.evaluate(e=>e.clientHeight)>=await map.evaluate(()=>Math.max(document.body.scrollHeight,document.documentElement.scrollHeight))-1);
     ck(tag+' map/page width fits '+i,await map.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     if(await map.locator('[data-control="restart"]').count()){ended=true;await map.locator('[data-control="restart"]').click();break;}
     await map.locator('[data-control="next"]').click();
    }
    ck(tag+' map completes and restarts',ended&&await map.locator('[data-control="begin"]').count()===1);
    ck(tag+' widgets preserve all answers',await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'))===before);
    const editKey='question-203-'+active[0].id;
    await lesson.locator('#'+editKey).fill('SYN-edited-current');await page.reload({waitUntil:'domcontentloaded'});await lesson.locator('#'+editKey).waitFor();
    ck(tag+' edited answer survives reload',await lesson.locator('#'+editKey).inputValue()==='SYN-edited-current');
    await page.goto(base+'#203-2',{waitUntil:'domcontentloaded'});await page.locator('#session-2 #'+foreignKey).waitFor();
    ck(tag+' next lesson answer retained',await page.locator('#session-2 #'+foreignKey).inputValue()===seed[foreignKey]);
    await page.goto(base+'#203-1',{waitUntil:'domcontentloaded'});await lesson.locator('#'+editKey).waitFor();
    await page.locator('#email-lesson-btn').click();const outgoing=await page.locator('#export-preview-text').textContent();
    ck(tag+' Email current answers',outgoing.includes('SYN-edited-current')&&active.slice(1).every(q=>outgoing.includes(seed['question-203-'+q.id])));
    ck(tag+' earlier saved responses section',outgoing.includes('Earlier saved responses'));
    for(const q of retired)ck(tag+' Email original retired prompt/answer '+q.id,outgoing.includes(q.text)&&outgoing.includes(seed['question-203-'+q.id]));
    ck(tag+' Email excludes next lesson',!outgoing.includes(seed[foreignKey]));
    ck(tag+' every earlier answer still stored',await page.evaluate(({seed,retired})=>{const v=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return retired.every(q=>v['question-203-'+q.id]===seed['question-203-'+q.id]);},{seed,retired}));
    await page.keyboard.press('Escape');await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('#home-backup-tools summary').click();
    const started=page.waitForEvent('download');await page.locator('#home-download-backup').click();const dl=await started;assert.equal(await dl.failure(),null);
    const chunks=[];for await(const chunk of await dl.createReadStream())chunks.push(chunk);const backup=JSON.parse(Buffer.concat(chunks).toString()).stores.answers.data;
    ck(tag+' backup current, retired and next-lesson data',backup[editKey]==='SYN-edited-current'&&backup[foreignKey]===seed[foreignKey]&&retired.every(q=>backup['question-203-'+q.id]===seed['question-203-'+q.id]));
    ck(tag+' no page exceptions',errors.length===0);
    console.log('PASS rewrite '+tag);
   }finally{await ctx.close();}
  }
  console.log(checks+' approved 203-01 integration checks passed across 6 cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
