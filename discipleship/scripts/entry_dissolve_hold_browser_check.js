#!/usr/bin/env node
'use strict';
// Entry reveal contract: initial B&W, 20% hold, centered completion, reverse and resize.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.ENTRY_HOLD_BASE_URL||'http://127.0.0.1:8831/index.html';
let checks=0;function ck(label,ok){assert.ok(ok,label);checks++;}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.GT_CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 for(const [width,height,motion]of [[375,667,'no-preference'],[390,844,'no-preference'],[1280,800,'no-preference'],[390,844,'reduce']]){
  for(const lesson of [3,4,5,6]){
   const ctx=await browser.newContext({viewport:{width,height},reducedMotion:motion});
   try{
    await ctx.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
    const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().includes('/images/')&&r.status()>=400)errors.push(r.status()+' '+r.url());});
    const response=await p.goto(base+'#101-'+lesson,{waitUntil:'domcontentloaded'});ck('HTTP 200',response.status()===200);
    const root=p.locator('#session-'+lesson+'.active [data-dissolve-on-entry]');await root.waitFor();await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await p.waitForTimeout(150);
    const measure=()=>root.evaluate(el=>{
     const r=el.getBoundingClientRect(),header=document.querySelector('.lesson-topbar')?.getBoundingClientRect().bottom||0,h=Math.max(innerHeight-header,1),docTop=r.top+scrollY,start=Math.max(0,docTop-(header+h*.9)),end=docTop-(header+Math.max((h-r.height)/2,0));
     return {scroll:scrollY,opacity:Number(getComputedStyle(el.querySelector('.parable-img-bw')).opacity),start,end,range:end-start,top:r.top,bottom:r.bottom,header,viewport:innerHeight,height:r.height,width:r.width};
    });
    const scroll=async y=>{await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(120);return measure();};
    const initial=await measure();ck('lesson opens at scroll zero',initial.scroll===0);ck('positive visible reveal travel',initial.range>1);
    ck('initial image is monochrome or static reduced-motion color',motion==='reduce'?initial.opacity<=.001:initial.opacity>=.999);
    for(const fraction of [.1,.2]){
     const s=await scroll(Math.floor(initial.start+initial.range*fraction));ck('B&W holds through '+fraction+' of travel',motion==='reduce'?s.opacity<=.001:s.opacity>=.999);
    }
    const middle=await scroll(initial.start+initial.range*.6);ck('reveal progresses after the hold',motion==='reduce'?middle.opacity<=.001:middle.opacity>.25&&middle.opacity<.75);
    const complete=await scroll(Math.ceil(initial.end));ck('full color at centered endpoint',complete.opacity<=.001);ck('entire image visible below fixed header',complete.top>=complete.header-1&&complete.bottom<=complete.viewport+1);ck('no image size shift',Math.abs(complete.width-initial.width)<=1&&Math.abs(complete.height-initial.height)<=1);
    const reverse=await scroll(0);ck('returning to top restores B&W',motion==='reduce'?reverse.opacity<=.001:reverse.opacity>=.999);
    if(width===390&&motion==='no-preference'){
     await p.setViewportSize({width,height:568});await p.waitForTimeout(150);const resized=await measure();ck('resize at top keeps B&W',resized.opacity>=.999);const done=await scroll(Math.ceil(resized.end));ck('shorter viewport still completes fully visible',done.opacity<=.001&&done.top>=done.header-1&&done.bottom<=done.viewport+1);
    }
    ck('no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));ck('no page/image errors',errors.length===0);
    console.log('PASS entry hold 101-0'+lesson+' '+width+'x'+height+'/'+motion);
   }finally{await ctx.close();}
  }
 }
 console.log(checks+' entry dissolve hold checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
