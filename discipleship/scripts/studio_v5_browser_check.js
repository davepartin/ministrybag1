#!/usr/bin/env node
/**
 * Studio Wash v5 integration regression: all slides, three widths, both motion modes.
 * Serve discipleship/ first, then run from any directory:
 * GT_BASE_URL=http://127.0.0.1:8800/index.html node scripts/studio_v5_browser_check.js
 * Optional GT_CHROMIUM_PATH selects a local Chromium executable; otherwise Chrome.
 * Optional GT_SCREENSHOT_DIR writes the three phone final-state screenshots.
 * Uses isolated browser contexts and synthetic answers only.
 */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const base=process.env.GT_BASE_URL||'http://127.0.0.1:8800/index.html';
const screenshotDir=process.env.GT_SCREENSHOT_DIR;
if(screenshotDir)fs.mkdirSync(screenshotDir,{recursive:true});let checks=0;const failures=[];
function ck(label,value){checks++;assert.ok(value,label)}
const courses=['201','202','203'],expectedFinal={'201':'The Cross Holds It All','202':'Love in Everyday Life','203':'Make Disciples Where You Are'};
const data=Object.fromEntries(courses.map(c=>[c,JSON.parse(fs.readFileSync(path.join(ROOT,'data',c+'-01.json'),'utf8'))]));
const seed=Object.fromEntries(courses.map(c=>['question-'+c+'-'+data[c].blocks.find(b=>b.type==='question').id,'SYN-v5-'+c]));
const jobs=courses.flatMap(course=>[375,390,1280].flatMap(width=>['reduce','no-preference'].map(motion=>({course,width,motion}))));
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.GT_CHROMIUM_PATH?{executablePath:process.env.GT_CHROMIUM_PATH}:{channel:'chrome'})});
async function run({course,width,motion}){const tag=course+'/'+width+'/'+motion;const context=await browser.newContext({viewport:{width,height:844},reducedMotion:motion});try{
 await context.route('**/scripts/account.js',r=>r.fulfill({body:'',contentType:'text/javascript'}));
 await context.addInitScript(seed=>{window.__v5StorageWrites=0;for(const method of['setItem','removeItem','clear']){const old=Storage.prototype[method];Storage.prototype[method]=function(...args){if(location.pathname.includes('great-command-v5'))window.__v5StorageWrites++;return old.apply(this,args)}}if(window===window.top&&!sessionStorage.getItem('v5seed')){localStorage.setItem('christianFoundationsResponses',JSON.stringify(seed));sessionStorage.setItem('v5seed','1')}},seed);
 const page=await context.newPage(),errors=[],httpErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/widgets/great-command-v5')&&r.status()>=400)httpErrors.push(r.status()+' '+r.url())});
 await page.goto(base+'#'+course+'-1');const lesson=page.locator('#session-1');await lesson.waitFor();
 const frameEl=lesson.locator('iframe[src*="great-command-v5-'+course+'.html"]');await frameEl.waitFor();const frame=await(await frameEl.elementHandle()).contentFrame();await frame.locator('#next-btn').waitFor();await page.waitForTimeout(250);
 const num=course==='201'?6:5,key='question-'+course+'-'+data[course].blocks.find(b=>b.type==='question').id;
 ck(tag+' one v5 frame',await frameEl.count()===1);ck(tag+' native named steps',await frame.locator('.step-dot').count()===num&&await frame.locator('.step-dot').evaluateAll(es=>es.every(e=>e.tagName==='BUTTON'&&e.type==='button'&&e.getAttribute('aria-label'))));
 ck(tag+' query version reaches shared engine',await frame.evaluate(()=>{const s=[...document.scripts].find(s=>s.src.includes('great-command-v5.js'));return s&&new URL(s.src).search===location.search&&location.search.includes('v=')}));
 ck(tag+' all question fields unchanged',await lesson.locator('.question-textarea').count()===data[course].blocks.filter(b=>b.type==='question').length);ck(tag+' saved answer restored',await lesson.locator('#'+key).inputValue()==='SYN-v5-'+course);
 const allCopy=data[course].blocks.filter(b=>['text','parable','verse'].includes(b.type)).map(b=>b.text);
 ck(tag+' all existing prose renders',await lesson.evaluate((el,copy)=>{const norm=s=>s.replace(/\s+/g,' ').trim(),actual=norm(el.textContent);return copy.every(s=>{const div=document.createElement('div');div.innerHTML=s;return actual.includes(norm(div.textContent))})},allCopy));
 if(course==='201')ck(tag+' old widget replaced',await lesson.locator('iframe[src*="widgets/great-command.html"]').count()===0);
 else{const retained=course==='202'?'cross-the-road.html':'personal-ministry-map.html';ck(tag+' working tool retained',await lesson.locator('iframe[src*="'+retained+'"]').count()===1);ck(tag+' intro before story',await lesson.evaluate(el=>el.querySelector('iframe[src*="great-command-v5"]').compareDocumentPosition(el.querySelector('.block-parable'))&Node.DOCUMENT_POSITION_FOLLOWING));}
 const cardHeight=await frame.locator('#card-content').evaluate(e=>e.getBoundingClientRect().height);const initialStorage=await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'));
 for(let step=0;step<num;step++){
  if(step>0)await frame.locator('#next-btn').click();const dur=Number(await frame.locator('#widget').getAttribute('data-step-dur'))||0;
  if(motion==='reduce')ck(tag+' reduced motion step '+step,dur===0&&await frame.locator('#widget').evaluate(e=>e.classList.contains('is-instant')));
  if(dur)await page.waitForTimeout(dur+520);
  ck(tag+' active state '+step,await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step')===String(step));
  ck(tag+' stable/fitting card '+step,await frame.locator('#card-content').evaluate((e,h)=>Math.abs(e.getBoundingClientRect().height-h)<=1&&e.scrollHeight<=e.clientHeight+1,cardHeight));
  ck(tag+' frame/page fit '+step,await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  ck(tag+' controls and accessible drawing '+step,await frame.locator('#next-btn').evaluate(e=>e.getBoundingClientRect().height>=44)&&await frame.locator('.cross-svg').getAttribute('role')==='img'&&(await frame.locator('.cross-svg desc').textContent()).trim().length>0);
 }
 ck(tag+' correct final course introduction',await frame.locator('#card-heading').textContent()===expectedFinal[course]);
 await page.waitForTimeout(150);ck(tag+' parent height includes full widget',await frameEl.evaluate(e=>e.clientHeight)>=await frame.evaluate(()=>Math.max(document.body.scrollHeight,document.documentElement.scrollHeight))-1);
 if(screenshotDir&&width===375&&motion==='no-preference'){await frameEl.evaluate(e=>window.scrollTo({top:scrollY+e.getBoundingClientRect().top-100,behavior:'instant'}));await frameEl.screenshot({path:path.join(screenshotDir,'v5-'+course+'-final.png')});}
 await frame.locator('#prev-btn').click();ck(tag+' Back instant',await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step')===String(num-2)&&await frame.locator('#widget').getAttribute('data-step-dur')==='0');
 await frame.locator('.step-dot').last().focus();await page.keyboard.press('Space');let dur=Number(await frame.locator('#widget').getAttribute('data-step-dur'))||0;if(dur)await page.waitForTimeout(dur+520);
 ck(tag+' keyboard final selection',await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step')===String(num-1));
 await frame.locator('#next-btn').click();ck(tag+' Start Over',await frame.locator('.step-dot[aria-pressed="true"]').getAttribute('data-step')==='0'&&await frame.locator('#prev-btn').isDisabled());
 await frame.evaluate(()=>{window.__idleMutations=0;new MutationObserver(ms=>window.__idleMutations+=ms.length).observe(document.getElementById('widget'),{subtree:true,attributes:true,childList:true,characterData:true})});
 await frameEl.evaluate(e=>{window.__frameWrites=0;new MutationObserver(ms=>window.__frameWrites+=ms.length).observe(e,{attributes:true,attributeFilter:['style']})});
 await page.waitForTimeout(550);ck(tag+' idle DOM/height stable',await frame.evaluate(()=>__idleMutations)===0&&await page.evaluate(()=>__frameWrites)===0);
 await page.setViewportSize({width,height:764});await page.waitForTimeout(300);ck(tag+' height-only resize stable',await frame.evaluate(()=>__idleMutations)===0&&await page.evaluate(()=>__frameWrites)===0);
 ck(tag+' widget never writes storage',await frame.evaluate(()=>__v5StorageWrites)===0&&await page.evaluate(()=>localStorage.getItem('christianFoundationsResponses'))===initialStorage);
 await lesson.locator('#'+key).fill('SYN-edited-v5-'+course);await page.reload();await lesson.waitFor();ck(tag+' edit survives reload',await lesson.locator('#'+key).inputValue()==='SYN-edited-v5-'+course);
 ck(tag+' other course answers remain',await page.evaluate(({seed,key})=>{const r=JSON.parse(localStorage.getItem('christianFoundationsResponses'));return Object.entries(seed).every(([k,v])=>k===key||r[k]===v)},{seed,key}));
 ck(tag+' no widget HTTP or page errors',errors.length===0&&httpErrors.length===0);
 console.log('PASS '+tag+' '+num+' states; card '+cardHeight+'px');
 }finally{await context.close()}}
 let cursor=0;await Promise.all([0,1,2].map(async()=>{while(cursor<jobs.length){const j=jobs[cursor++];try{await run(j)}catch(e){failures.push(j.course+'/'+j.width+'/'+j.motion+': '+e.stack);console.error('FAIL '+failures[failures.length-1])}}}));await browser.close();if(failures.length)throw Error(failures.join('\n'));console.log(checks+' Studio Wash integration checks passed across18 cases');
})().catch(e=>{console.error(e);process.exitCode=1});
