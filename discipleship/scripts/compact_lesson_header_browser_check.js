#!/usr/bin/env node
'use strict';
// One-lesson pilot: actual controls, viewport geometry and synthetic saved answers.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const storage = require('./answer-storage.js');
const base = process.env.HEADER_BASE_URL || 'http://127.0.0.1:8851/index.html';
const shot = process.env.HEADER_SCREENSHOT_DIR;
let passed = 0;
function check(label, value) { assert.ok(value, label); passed++; }
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium'});
 try {
  for (const [width,height,motion] of [[320,667,'no-preference'],[375,667,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]) {
   const ctx = await browser.newContext({viewport:{width,height},reducedMotion:motion});
   try {
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    await ctx.addInitScript(flag=>{
     if(window===window.top && !sessionStorage.getItem('header-seeded')) {
      localStorage.setItem('christianFoundationsResponses',JSON.stringify({[flag]:true,'question-202-202-01-1':'SYN-header-answer'}));
      sessionStorage.setItem('header-seeded','yes');
     }
    },storage.MIGRATION_FLAG);
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await page.goto(base+'#202-1',{waitUntil:'networkidle'});
    const bar=page.locator('.lesson-topbar');
    await page.waitForFunction(()=>document.querySelector('.lesson-topbar').classList.contains('is-compact'));
    const compact=await bar.evaluate(e=>e.getBoundingClientRect().height);
    check('header at most 50px',compact<=50);
    check('correct code and title',await page.locator('#compact-lesson-label').innerText()==='202-01 ·\nLoving Your Neighbors');
    check('progress removed from layout',!(await page.locator('.progress-track').isVisible()));
    check('old identity removed from layout',!(await page.locator('.topbar-course-name-row').isVisible()));
    for(const cls of ['.back-btn','.toc-menu-btn']) {
     const box=await bar.locator(cls).boundingBox();check('44px touch target '+cls,box.width>=44 && box.height>=44);
    }
    check('answer restored',await page.locator('#question-202-202-01-1').inputValue()==='SYN-header-answer');
    check('no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    if(width>=375)check('full title fits',await page.locator('.compact-lesson-topic').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    await page.evaluate(()=>scrollTo(0,900));
    check('sticky header stays at top',Math.abs((await bar.boundingBox()).y)<=1);
    await page.locator('#toc-toggle-btn').click();
    check('menu opens',await page.locator('#toc-panel').evaluate(e=>e.classList.contains('open')));
    await page.locator('#toc-item-2').click();
    await page.waitForFunction(()=>location.hash==='#202-2');
    check('other lesson keeps original header',!(await bar.evaluate(e=>e.classList.contains('is-compact'))) && await page.locator('.progress-track').isVisible());
    const original=await bar.evaluate(e=>e.getBoundingClientRect().height);
    check('pilot saves at least 30 percent height',compact<=original*.7);
    await page.locator('#toc-toggle-btn').click();await page.locator('#toc-item-1').click();
    await page.waitForFunction(()=>location.hash==='#202-1');
    check('pilot restored on return',await bar.evaluate(e=>e.classList.contains('is-compact')));
    check('answer survives navigation',await page.locator('#question-202-202-01-1').inputValue()==='SYN-header-answer');
    await page.reload({waitUntil:'networkidle'});
    check('answer survives reload',await page.locator('#question-202-202-01-1').inputValue()==='SYN-header-answer');
    if(shot && width===390 && motion==='no-preference') {
     fs.mkdirSync(shot,{recursive:true});await page.screenshot({path:path.join(shot,'202-01-compact.png')});
    }
    await page.locator('.lesson-topbar .back-btn').focus();await page.keyboard.press('Enter');
    check('back returns home',await page.locator('#home-view').isVisible() && !(await page.locator('#lesson-view').evaluate(e=>e.classList.contains('active'))));
    check('no console/page errors',errors.length===0);
    console.log(`PASS ${width}/${motion}: header ${original}px -> ${compact}px`);
   } finally {await ctx.close();}
  }
 } finally {await browser.close();}
 console.log(`${passed} compact header checks passed.`);
})().catch(e=>{console.error(e);process.exit(1);});
