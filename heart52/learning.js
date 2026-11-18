/* Generated from discipleship/tools/heart52/learning.js. Edit that source and run node discipleship/scripts/build_heart52.js. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Heart52Learning=api;})(globalThis,function(){
'use strict';
function tokens(text){return [...String(text).matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)].map(m=>({text:m[0],start:m.index,end:m.index+m[0].length,word:m[0].toLocaleLowerCase('en').replace(/['’]/g,'')}));}
function compareRecall(expected,actual){
 const a=tokens(expected),b=tokens(actual),rows=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
 for(let i=0;i<=a.length;i++)rows[i][0]=i;for(let j=0;j<=b.length;j++)rows[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1].word===b[j-1].word?0:1));
 const missed=[];let i=a.length,j=b.length,correct=0,extra=0;
 while(i||j){
  if(i&&j&&a[i-1].word===b[j-1].word&&rows[i][j]===rows[i-1][j-1]){correct++;i--;j--;}
  else if(i&&j&&rows[i][j]===rows[i-1][j-1]+1){missed.push(i-1);i--;j--;}
  else if(i&&rows[i][j]===rows[i-1][j]+1){missed.push(i-1);i--;}
  else{extra++;j--;}
 }
 return {correct,total:a.length,extra,accuracy:Math.max(0,Math.round(100*(1-rows[a.length][b.length]/Math.max(a.length,b.length,1)))),missed:missed.sort((x,y)=>x-y),tokens:a};
}
function shuffled(items,random=Math.random){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function phraseChunks(text){const list=String(text).trim().split(/\s+/),size=Math.max(3,Math.ceil(list.length/8)),chunks=[];for(let i=0;i<list.length;i+=size)chunks.push(list.slice(i,i+size).join(' '));return chunks;}
function localDay(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
function reviewDay(confidence,now=new Date()){
 if(!Number.isInteger(confidence)||confidence<1||confidence>4)throw Error('Choose a review interval.');
 return localDay(new Date(now.getFullYear(),now.getMonth(),now.getDate()+[1,3,7,14][confidence-1],12));
}
function dueDay(value){if(!value)return null;if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value))return value;const date=new Date(value);return Number.isFinite(date.getTime())?localDay(date):null;}
function isDue(entry,now=new Date()){return Boolean(entry&&entry.attempts>0&&(!entry.nextReview||dueDay(entry.nextReview)<=localDay(now)));}
function freshProgress(){return {version:1,currentWeek:1,verses:{}};}
function validDate(value){if(value===null||value===undefined)return true;if(typeof value!=='string')return false;if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)){const d=new Date(value+'T12:00:00');return Number.isFinite(d.getTime())&&localDay(d)===value;}return Number.isFinite(Date.parse(value));}
function validateProgress(value,legacy=false){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==(legacy?2:1)||!Number.isInteger(value.currentWeek)||value.currentWeek<1||value.currentWeek>52||!value.verses||typeof value.verses!=='object'||Array.isArray(value.verses))throw Error('This progress record cannot be opened.');
 for(const [key,e]of Object.entries(value.verses)){
  if(!/^[1-9][0-9]?$/.test(key)||Number(key)>52||!e||typeof e!=='object'||Array.isArray(e)||!Number.isSafeInteger(e.attempts)||e.attempts<0||e.attempts>1000000||!(e.accuracy===null||Number.isFinite(e.accuracy)&&e.accuracy>=0&&e.accuracy<=100)||!Number.isInteger(e.confidence)||e.confidence<0||e.confidence>4||!validDate(e.lastPracticed)||!validDate(e.nextReview))throw Error('This progress record contains an invalid passage.');
 }
 const copy=JSON.parse(JSON.stringify(value));copy.version=1;return copy;
}
// A 52-part local-calendar plan: Jan 1 begins week 1; week 52 includes year-end days.
function calendarWeek(now=new Date()){const day=Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(now.getFullYear(),0,1))/86400000);return Math.min(52,Math.floor(day/7)+1);}
function calendarRange(number,year=new Date().getFullYear()){
 if(!Number.isInteger(number)||number<1||number>52||!Number.isInteger(year)||year<1900||year>2200)throw Error('Choose a valid calendar week.');
 return {start:new Date(year,0,1+(number-1)*7,12),end:number===52?new Date(year,11,31,12):new Date(year,0,number*7,12)};
}
return {calendarWeek,calendarRange,tokens,compareRecall,shuffled,phraseChunks,localDay,reviewDay,dueDay,isDue,freshProgress,validateProgress};
});
