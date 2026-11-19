#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const BASE=process.env.WEEKLY_LAYOUT_URL||'http://127.0.0.1:8853/discipleship/tools/weekly-connection-time/';
let checks=0;function ck(value,label){assert.ok(value,label);checks++;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,height,density,motion]of [[375,667,1,'no-preference'],[390,844,1,'no-preference'],[648,900,2,'no-preference'],[1280,900,1,'no-preference'],[1440,900,1,'no-preference'],[1280,900,1,'reduce']]){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:density,reducedMotion:motion});
  try{
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await p.goto(BASE,{waitUntil:'networkidle'});await p.locator('#startButton').click();
   const minInset=width<=640?16:24;
   for(let step=0;step<7;step++){
    await p.waitForTimeout(motion==='reduce'?20:300);
    const geometry=await p.evaluate(step=>{
     const card=document.querySelector('.step-stage').getBoundingClientRect();
     const panel=document.querySelector(`[data-step="${step}"]`),heading=panel.querySelector('.step-heading').getBoundingClientRect();
     const fields=[...panel.querySelectorAll('input,textarea')].map(e=>e.getBoundingClientRect());
     return {left:heading.left-card.left,right:card.right-heading.right,center:Math.abs((card.left+card.right)/2-innerWidth/2),width:card.width,fieldInsets:fields.map(r=>Math.min(r.left-card.left,card.right-r.right)),overflow:document.documentElement.scrollWidth>innerWidth+1};
    },step);
    ck(geometry.left>=minInset&&geometry.right>=minInset,`${width}: step ${step} has comfortable panel insets`);
    ck(geometry.center<1&&geometry.width<=640,`${width}: step ${step} card stays centered and bounded`);
    ck(geometry.fieldInsets.length>0&&geometry.fieldInsets.every(n=>n>=minInset),`${width}: step ${step} fields stay inside padded card`);
    ck(!geometry.overflow,`${width}: step ${step} no horizontal overflow`);
    if(step===1&&process.env.WEEKLY_LAYOUT_SHOTS&&motion==='no-preference'&&[648,1280].includes(width)){
     fs.mkdirSync(process.env.WEEKLY_LAYOUT_SHOTS,{recursive:true});await p.evaluate(()=>scrollTo(0,0));
     await p.screenshot({path:process.env.WEEKLY_LAYOUT_SHOTS+`/celebrate-${width}-${density}x.png`,fullPage:false});
    }
    if(step<6){
     if(width===648&&step===0){await p.locator('#nextButton').focus();await p.keyboard.press('Enter');}
     else await p.locator('#nextButton').click();
    }
   }
   if(width<=640){
    const link=p.locator('#growing-apps-link');await link.scrollIntoViewIfNeeded();
    const a=await link.boundingBox(),nav=await p.locator('.step-actions').boundingBox();
    ck(a.y+a.height<nav.y,`${width}: footer link is clear of fixed phone controls`);
   }else{
    ck(await p.locator('.step-actions').evaluate(e=>getComputedStyle(e).position!=='fixed'),`${width}: laptop controls stay in card flow`);
   }
   ck(errors.length===0,`${width}: no console/page errors`);console.log('PASS layout',width,density+'x',motion);
  }finally{await ctx.close();}
 }
 }finally{await browser.close();}
 console.log(checks+' Weekly Connection Time layout checks passed.');
})().catch(e=>{console.error(e);process.exit(1);});
