#!/usr/bin/env node
'use strict';
// Synthetic, isolated frame integration checks; no account or real learner data.
const assert = require('assert/strict');
const {chromium} = require('playwright');
const data = require('../data/202-08.json');
const base = process.env.TRIANGLE_BASE_URL || 'http://127.0.0.1:8813/index.html';
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q,i) => ['question-202-' + q.id, 'SYN-triangle-' + i]));
seed['question-101-unrelated'] = 'SYN-triangle-other-course';
let checks = 0;
function ck(label,ok){checks++;assert.ok(ok,label);}
(async()=>{
 const browser = await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium'});
 try {
  for(const width of [375,390,1280]) for(const motion of ['no-preference','reduce']) {
   const tag=width+'/'+motion,ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
   try {
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(seed=>{if(window===window.top&&!sessionStorage.getItem('tri-seeded')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('tri-seeded','yes');}},seed);
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'#202-8',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('#session-8'),host=lesson.locator('iframe[src*="covenant-triangle.html"]');
    await host.waitFor();const frame=await(await host.elementHandle()).contentFrame();
    await frame.locator('[data-control="begin"]').waitFor();await page.waitForTimeout(250);
    const h=await frame.locator('.verse-card-content').evaluate(e=>e.clientHeight);
    const stored=await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'));
    async function inspect(label){
     await page.waitForTimeout(motion==='reduce'?50:300);
     ck(tag+' '+label+' same fitting card',await frame.locator('.verse-card-content').evaluate((e,h)=>e.clientHeight===h&&e.scrollHeight<=e.clientHeight+1,h));
     ck(tag+' '+label+' full iframe',await host.evaluate(e=>e.clientHeight)>=await frame.evaluate(()=>Math.max(document.body.scrollHeight,document.documentElement.scrollHeight))-1);
     ck(tag+' '+label+' no overflow',await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    await inspect('intro');
    await frame.locator('[data-control="overview"]').click();await inspect('overview');
    await frame.locator('[data-control="return"]').click();
    ck(tag+' overview returns to intro',await frame.locator('[data-control="begin"]').count()===1);
    await frame.locator('[data-control="begin"]').click();
    for(let i=0;i<4;i++){
     await inspect('step '+i);
     ck(tag+' active named dot '+i,await frame.locator('.step-dot').nth(i+1).getAttribute('aria-pressed')==='true'&&!!await frame.locator('.step-dot').nth(i+1).getAttribute('aria-label'));
     if(i<3)await frame.locator('[data-control="next"]').click();
    }
    await frame.locator('[data-control="back"]').click();
    ck(tag+' Back',await frame.locator('.step-dot').nth(3).getAttribute('aria-pressed')==='true');
    await frame.locator('.step-dot').nth(2).focus();await page.keyboard.press('Space');
    ck(tag+' keyboard dot',await frame.locator('.step-dot').nth(2).getAttribute('aria-pressed')==='true');
    await frame.locator('.step-dot').last().click();
    await frame.locator('[data-control="restart"]').click();
    ck(tag+' Start Over',await frame.locator('[data-control="begin"]').count()===1);
    if(motion==='reduce')ck(tag+' reduced-motion transitions',await frame.locator('#link-a').evaluate(e=>getComputedStyle(e).transitionDuration==='0s'));
    // Normal movement lasts 800ms; measure idle only after it finishes.
    await page.waitForTimeout(motion==='reduce'?100:1200);
    await frame.evaluate(()=>{window.__triMutations=0;new MutationObserver(ms=>window.__triMutations+=ms.length).observe(document.getElementById('widget'),{subtree:true,childList:true,attributes:true,characterData:true});});
    await page.waitForTimeout(350);
    ck(tag+' no idle mutations',await frame.evaluate(()=>__triMutations)===0);
    await page.setViewportSize({width,height:740});await page.waitForTimeout(200);
    ck(tag+' ignores toolbar height changes',await frame.evaluate(()=>__triMutations)===0);
    ck(tag+' widget leaves all saved answers intact',await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'))===stored);
    for(const q of questions){const key='question-202-'+q.id;ck(tag+' restores '+key,await lesson.locator('#'+key).inputValue()===seed[key]);}
    const key='question-202-'+questions[0].id;
    await lesson.locator('#'+key).fill('SYN-triangle-edited');await page.reload({waitUntil:'domcontentloaded'});await lesson.locator('#'+key).waitFor();
    ck(tag+' edit survives reload',await lesson.locator('#'+key).inputValue()==='SYN-triangle-edited');
    await page.locator('#email-lesson-btn').click();const outgoing=await page.locator('#export-preview-text').textContent();
    ck(tag+' Email current answers only',outgoing.includes('SYN-triangle-edited')&&questions.slice(1).every(q=>outgoing.includes(seed['question-202-'+q.id]))&&!outgoing.includes('SYN-triangle-other-course'));
    ck(tag+' no page errors',errors.length===0);
    console.log('PASS triangle frame '+tag+' card='+h);
   }finally{await ctx.close();}
  }
  console.log(checks+' triangle frame checks passed across 6 cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
