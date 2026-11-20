#!/usr/bin/env node
'use strict';
// Isolated contexts: opening cues, interrupted/repeated taps, layout and host phone boundaries.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8854/discipleship/index.html';
(async () => {
 const browser = await chromium.launch({headless:true,...(process.env.GT_CHROMIUM_PATH?{executablePath:process.env.GT_CHROMIUM_PATH}:{})});
 let checks=0;function check(ok,label){assert(ok,label);checks++;}
 for(const width of [375,390,1280]) for(const motion of ['no-preference','reduce']) for(const [course,file,cue,phrase] of [
 ['201','great-command-v5-201.html','.stage-intro','Love begins with God.'],
 ['203','great-commission-203.html','.opening-cue','His love keeps moving outward.']]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(BASE+'#'+course+'-1',{waitUntil:'domcontentloaded'});
  const iframe=page.locator('#session-1.active iframe[src*="'+file+'"]');await iframe.waitFor();
  const frame=await (await iframe.elementHandle()).contentFrame();await frame.waitForSelector(cue);await page.waitForTimeout(200);
  await iframe.evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-70));
  const before=await iframe.evaluate(el=>{const s=getComputedStyle(el.parentElement,'::after');return {h:el.getBoundingClientRect().height,y:scrollY,border:s.borderLeftWidth,content:s.content,pointer:s.pointerEvents,pw:el.parentElement.getBoundingClientRect().width,w:el.getBoundingClientRect().width};});
  check(Math.abs(before.pw-before.w)<1,'boundary consumes no content width');
  check(width<560?before.border==='1px'&&before.pointer==='none':before.content==='none','phone-only boundary does not intercept input');
  check((await frame.locator(cue).innerText()).trim()===phrase,'meaningful opening phrase');
  check(await frame.locator(cue).evaluate(el=>getComputedStyle(el).opacity==='1'),'opening visible');
  const cardHeight=await frame.locator('#widget').evaluate(el=>el.style.getPropertyValue('--card-h'));
  await frame.evaluate(()=>{document.querySelector('#next-btn').click();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('#next-btn').click();});
  if(motion==='no-preference'){
   check(await frame.locator('.step-dot.active').getAttribute('data-step')==='0','drawing waits for cue fade');
   await page.waitForTimeout(100);const opacity=await frame.locator(cue).evaluate(el=>Number(getComputedStyle(el).opacity));
   check(opacity>0&&opacity<1,'cue fades smoothly');
  } else check(await frame.locator('.step-dot.active').getAttribute('data-step')==='1','reduced motion advances immediately');
  await page.waitForTimeout(500);
  check(await frame.locator(cue).getAttribute('aria-hidden')==='true','started cue hidden from accessibility tree');
  check(await frame.locator(cue).evaluate(el=>Number(getComputedStyle(el).opacity)===0),'cue fully gone');
  check(await frame.locator('.step-dot.active').getAttribute('data-step')==='1','rapid taps during fade do not skip steps');
  check(await frame.locator('#widget').evaluate(el=>el.style.getPropertyValue('--card-h'))===cardHeight,'reserved card height stable');
  const after=await iframe.evaluate(el=>({h:el.getBoundingClientRect().height,y:scrollY}));
  check(Math.abs(after.h-before.h)<2,'iframe height stable');check(Math.abs(after.y-before.y)<2,'no lesson scroll jump');
  await frame.locator('.step-dot[data-step="0"]').evaluate(el=>el.click());
  check(await frame.locator(cue).getAttribute('aria-hidden')==='false','returning to start restores cue');
  if(motion==='no-preference'){
   await frame.locator('#next-btn').evaluate(el=>el.click());await frame.locator('.step-dot[data-step="0"]').evaluate(el=>el.click());await page.waitForTimeout(400);
   check(await frame.locator('.step-dot.active').getAttribute('data-step')==='0','return to start cancels pending fade');
  }
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'host has no horizontal overflow');
  check(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'widget has no horizontal overflow');
  check(errors.length===0,'no page exceptions: '+errors.join('; '));console.log('PASS',course,width,motion);await context.close();
 }
 await browser.close();console.log(checks+' opening-cue browser checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
