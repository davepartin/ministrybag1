#!/usr/bin/env node
'use strict';
// Real bottom-button navigation, including completed and revisited lessons.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const storage = require('./answer-storage.js');
const base = process.env.NAV_BASE_URL || 'http://127.0.0.1:8820/index.html';
const answers = {[storage.MIGRATION_FLAG]:true};
const completion = {};
for (const file of fs.readdirSync(path.join(__dirname,'../data')).filter(f=>/^\d{3}-\d{2}\.json$/.test(f))) {
 const [course,number]=file.replace('.json','').split('-');
 const data=require('../data/'+file);
 for (const q of [...data.blocks.filter(b=>b.type==='question'),...(data.retiredQuestions||[])]) answers['question-'+course+'-'+q.id]='SYN-nav-'+course+'-'+q.id;
 completion['complete-'+course+'-'+Number(number)]=true;
}
const readings={'check-101-John-1':true,'notes-101-John-1':'SYN-existing-reading-note'};
let passed=0;
function ck(label,ok){assert.ok(ok,label);passed++;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,motion]of [[375,'no-preference'],[390,'no-preference'],[1280,'no-preference'],[390,'reduce']]){
  const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  try{
   await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
   await ctx.addInitScript(({answers,completion,readings})=>{
    if(window===window.top&&!sessionStorage.getItem('nav-seeded')){
     localStorage.setItem('christianFoundationsResponses',JSON.stringify(answers));
     localStorage.setItem('foundationsCompletionData',JSON.stringify(completion));
     localStorage.setItem('foundationsReadingData',JSON.stringify(readings));
     sessionStorage.setItem('nav-seeded','yes');
    }
   },{answers,completion,readings});
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   const tag=width+'/'+motion;
   async function atTop(hash){
    await p.waitForFunction(hash=>location.hash===hash,hash);
    await p.locator('.session.active .session-title').waitFor();
    ck(tag+' '+hash+' immediately starts at top',await p.evaluate(()=>scrollY<=1));
    ck(tag+' '+hash+' heading receives focus',await p.locator('.session.active .session-title').evaluate(el=>document.activeElement===el));
    await p.waitForTimeout(180);
    ck(tag+' '+hash+' stays at top after layout',await p.evaluate(()=>scrollY<=1));
    ck(tag+' '+hash+' page fits',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
   async function bottomNext(hash,label,keyboard=false){
    if(label)ck(tag+' destination label '+label,(await p.locator('#next-btn').innerText())===label);
    await p.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    ck(tag+' leaving long lesson bottom',await p.evaluate(()=>scrollY>100));
    if(keyboard){await p.locator('#next-btn').focus();await p.locator('#next-btn').press('Enter');}
    else await p.locator('#next-btn').click();
    if(hash)await atTop(hash);
   }
   await p.goto(base+'#101-1',{waitUntil:'domcontentloaded'});
   await p.locator('#session-1.active .question-textarea').first().waitFor();
   const editKey='question-101-'+require('../data/101-01.json').blocks.find(b=>b.type==='question').id;
   await p.locator('#'+editKey).fill('SYN-nav-edited');await p.locator('#'+editKey).blur();
   // First click would fail on the old smooth-scroll implementation.
   await bottomNext('#101-2',null,true);
   ck(tag+' ordinary label',(await p.locator('#next-btn').innerText())==='Next lesson \u203A');
   await p.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
   await p.locator('#prev-btn').click();await atTop('#101-1');
   ck(tag+' edited answer survives previous',await p.locator('#'+editKey).inputValue()==='SYN-nav-edited');
   await bottomNext('#101-2','Next lesson \u203A');
   for(const [course,count,nextLabel,nextHash]of [
    ['101',7,'Go to 201 Growing Deep','#201-1'],
    ['201',10,'Go to 202 Growing Up','#202-1'],
    ['202',10,'Go to 203 Growing Out','#203-1'],
    ['203',10,'Back to courses',null]
   ]){
    const start=course==='101'?2:1;
    for(let num=start;num<count;num++)await bottomNext('#'+course+'-'+(num+1),'Next lesson \u203A');
    await bottomNext(nextHash,nextLabel);
    if(nextHash){
     await p.waitForTimeout(700);
     ck(tag+' course boundary remains at top',await p.evaluate(()=>scrollY<=1));
    }
   }
   await p.waitForFunction(()=>!location.hash&&document.querySelector('#home-view:not(.hidden)'));
   ck(tag+' final published course returns home at top',await p.evaluate(()=>scrollY<=1));
   ck(tag+' coming-soon course not auto-opened',await p.evaluate(()=>!document.querySelector('#lesson-view.active')));
   await p.goto(base+'#101-1',{waitUntil:'domcontentloaded'});await p.locator('#'+editKey).waitFor();
   ck(tag+' edited answer survives course changes and reload',await p.locator('#'+editKey).inputValue()==='SYN-nav-edited');
   ck(tag+' John completion restored',await p.locator('#reading-check-101-John-1').isChecked());
   ck(tag+' John notes restored',await p.locator('#reading-notes-101-John-1').inputValue()==='SYN-existing-reading-note');
   const state=await p.evaluate(()=>({answers:JSON.parse(localStorage.getItem('christianFoundationsResponses')),completion:JSON.parse(localStorage.getItem('foundationsCompletionData')),readings:JSON.parse(localStorage.getItem('foundationsReadingData'))}));
   ck(tag+' every current/retired answer preserved',Object.entries(answers).every(([k,v])=>state.answers[k]===(k===editKey?'SYN-nav-edited':v)));
   ck(tag+' completed lessons unchanged',JSON.stringify(state.completion)===JSON.stringify(completion));
   ck(tag+' reading notes/completion unchanged',JSON.stringify(state.readings)===JSON.stringify(readings));
   ck(tag+' no page exceptions',errors.length===0);
   console.log('PASS navigation '+tag);
  }finally{await ctx.close();}
 }
 console.log(passed+' lesson navigation checks passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
