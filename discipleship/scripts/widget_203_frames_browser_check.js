#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE=process.env.GT_BASE_URL||'http://127.0.0.1:8854/discipleship/index.html';
const widgets=['three-circles','three-spaces','armor-of-god','spaces-tables','mission-map'];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.GT_CHROMIUM_PATH?{executablePath:process.env.GT_CHROMIUM_PATH}:{})});let checks=0;
 const ck=(ok,label)=>{assert(ok,label);checks++;};
 for(const [width,motion] of [[320,'reduce'],[375,'reduce'],[390,'reduce'],[1280,'reduce'],[390,'no-preference']])for(const [i,file] of widgets.entries()){
  const lesson=i+5,code='203-'+String(lesson).padStart(2,'0');
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(BASE+'#203-'+lesson,{waitUntil:'domcontentloaded'});
  const iframe=page.locator('#session-'+lesson+'.active iframe[src*="'+file+'.html"]');await iframe.waitFor();
  const frame=await (await iframe.elementHandle()).contentFrame();await frame.waitForSelector('.title-bar .lesson-code');await page.waitForTimeout(150);
  const header=await frame.locator('.title-bar').evaluate(el=>{const h=el.querySelector('h1'),c=el.querySelector('.lesson-code'),r=el.getBoundingClientRect(),hr=h.getBoundingClientRect(),cr=c.getBoundingClientRect();return {code:c.textContent,bg:getComputedStyle(el).backgroundColor,height:r.height,separate:hr.right<=cr.left-8,inside:cr.right<=r.right-8&&hr.left>=r.left+8,overflow:h.scrollWidth>h.clientWidth+1};});
  ck(header.code===code,code+' lesson identity');ck(header.bg==='rgb(44, 36, 22)',code+' dark header');
  ck(header.height<=44,code+' compact header');ck(header.separate&&header.inside&&!header.overflow,code+' title/code fit');
  if(width>=560){const border=await frame.locator(file==='spaces-tables'?'.app':'.widget-outer').evaluate(el=>({radius:getComputedStyle(el).borderTopLeftRadius,border:getComputedStyle(el).borderLeftWidth}));ck(border.radius==='16px'&&border.border==='1px',code+' desktop frame');}
  await iframe.evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-65));
  let states=0,ended=false;
  for(let state=0;state<20;state++){
   await page.waitForTimeout(100);
   const size=await frame.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...document.querySelectorAll('button')].filter(e=>e.getClientRects().length&&!e.disabled&&getComputedStyle(e).visibility!=='hidden').some(e=>e.getBoundingClientRect().bottom>innerHeight+2)}));
   ck(!size.overflow,code+' state'+state+' no horizontal overflow');ck(!size.clipped,code+' state'+state+' controls fit iframe');
   const next=frame.getByRole('button',{name:/^(Begin|Next|.*Restart|.*Start Over|See it again)/i}).first();
   ck(await next.count()>0,code+' state'+state+' has navigation');
   const label=await next.innerText();states++;
   if(/Restart|Start Over|See it again/i.test(label)){ended=true;break;}
   const y=await page.evaluate(()=>scrollY);await next.evaluate(el=>el.click());await page.waitForTimeout(100);
   ck(Math.abs(await page.evaluate(()=>scrollY)-y)<2,code+' state'+state+' no scroll jump');
  }
  ck(ended&&states>=4,code+' all steps reach the ending');ck(errors.length===0,code+' no page exceptions: '+errors.join('; '));
  console.log('PASS',code,width,motion,'states='+states);await context.close();
 }
 await browser.close();console.log(checks+' 203 widget frame checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
