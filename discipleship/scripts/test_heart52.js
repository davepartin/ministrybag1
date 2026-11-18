#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('../tools/heart52/learning.js'),S=require('../tools/heart52/storage.js');
let passed=0;const ck=(v,label)=>{assert.ok(v,label);passed++;};
const verses=require('../tools/heart52/data/verses.json'),original=require('./fixtures/heart52-original.json');
ck(verses.length===52&&new Set(verses.map(v=>v.reference)).size===52,'52 unique selections');
for(const [i,v]of verses.entries()){
 assert.deepEqual({reference:v.reference,theme:v.theme,text:v.text},original[i]);passed++;
 ck(v.week===i+1&&v.translation==='ESV','stable passage identity '+v.week);
 ck(L.compareRecall(v.text,v.text.toUpperCase().replace(/[.,;:!?]/g,'')).accuracy===100,'fair punctuation/case for '+v.week);
 const chunks=L.phraseChunks(v.text);ck(chunks.length<=8&&chunks.join(' ')===v.text.replace(/\s+/g,' ').trim(),'all words retained in phrase game '+v.week);
 const audio=path.join(__dirname,'../tools/heart52',v.audio);ck(fs.statSync(audio).size>1000&&fs.readFileSync(audio).equals(fs.readFileSync(path.join(__dirname,'../../heart52-v2',v.audio))),'existing narration retained '+v.week);
}
ck(L.compareRecall('God is love.','God is love and more words').accuracy<100,'extra words are not perfect recall');
ck(L.compareRecall('God is love.','God love is').accuracy<100,'order matters');
ck(L.compareRecall('God is love.','').accuracy===0,'blank input is not success');
ck(L.compareRecall("God's word is true.",'GOD’S WORD IS TRUE').accuracy===100,'apostrophe typography is ignored');
ck(L.compareRecall('the the word','the word').missed.length===1,'repeated words remain distinct');
const highlighted=L.compareRecall('God is love.','God is good.');ck(highlighted.missed.length===1&&highlighted.tokens[highlighted.missed[0]].text==='love','feedback targets the missed canonical word');
const now=new Date(2026,2,7,23,50);ck(L.reviewDay(1,now)==='2026-03-08','next calendar day across DST');ck(L.reviewDay(4,now)==='2026-03-21','two-week interval');
ck(L.isDue({attempts:1,nextReview:'2026-03-07'},now),'due today');ck(!L.isDue({attempts:1,nextReview:'2026-03-08'},now),'not prematurely due');ck(!L.isDue({attempts:0,nextReview:null},now),'unpracticed is not a missed review');
ck(L.shuffled([1,2,3],()=>0).sort().join(',')==='1,2,3','shuffle keeps every item');
const progress={version:1,currentWeek:2,verses:{'2':{attempts:1,accuracy:80,confidence:2,lastPracticed:'2026-03-01T12:00:00Z',nextReview:'2026-03-04'}},futureMetadata:{note:'SYN keep this'}};
ck(L.validateProgress(progress).futureMetadata.note==='SYN keep this','unknown metadata survives validation');
for(const invalid of [{...progress,currentWeek:53},{...progress,version:8},{...progress,verses:{'2':{...progress.verses[2],accuracy:NaN}}},{...progress,verses:{'2':{...progress.verses[2],nextReview:'2026-02-31'}}}]){assert.throws(()=>L.validateProgress(invalid));passed++;}
function memory(seed={}){const map=new Map(Object.entries(seed));return{map,getItem:key=>map.has(key)?map.get(key):null,setItem:(key,value)=>{map.set(key,String(value));},removeItem:key=>map.delete(key)};}
const foreign={lordsPrayerApp:'SYN other app',christianFoundationsResponses:'SYN other lesson'};
let backing=memory({...foreign,[S.KEY]:JSON.stringify(progress)}),api=S.create({getStorage:()=>backing});
const before=JSON.stringify([...backing.map]);ck(api.load().currentWeek===2,'saved position opens');ck(JSON.stringify([...backing.map])===before,'opening does not write existing data');
ck(api.save({...progress,currentWeek:3}),'save succeeds');ck(JSON.parse(backing.getItem(S.KEY)).currentWeek===3,'position persists');
const old=backing.getItem(S.KEY);ck(api.replace({...progress,currentWeek:4}),'explicit restore succeeds');ck(backing.getItem(S.RECOVERY)===old,'recovery keeps the previous raw record');
ck(api.replace(L.freshProgress(),{reset:true}),'reset succeeds');ck(backing.getItem(S.RECOVERY)===null&&JSON.parse(backing.getItem(S.KEY)).currentWeek===1,'reset clears own recovery and retains a fresh own record');
for(const [key,value]of Object.entries(foreign))ck(backing.getItem(key)===value,'foreign store stays intact '+key);
const legacy={...progress,version:2,streak:9,lastVisit:'2026-02-01'};backing=memory({...foreign,[S.LEGACY]:JSON.stringify(legacy)});api=S.create({getStorage:()=>backing});const migrated=api.load();ck(migrated.version===1&&migrated.verses[2].attempts===1,'legacy v2 progress is available');ck(backing.getItem(S.KEY)===null&&backing.getItem(S.LEGACY)===JSON.stringify(legacy),'legacy is not overwritten on open');
ck(api.save(migrated),'continuing can save in the new namespace');ck(backing.getItem(S.LEGACY)===JSON.stringify(legacy),'legacy raw progress remains untouched');
backing=memory({[S.KEY]:'{broken',...foreign});api=S.create({getStorage:()=>backing});api.load();ck(api.raw()==='{broken','malformed data is recoverable');ck(!api.save(L.freshProgress())&&backing.getItem(S.KEY)==='{broken','malformed data cannot be silently overwritten');
ck(api.replace(progress),'confirmed replacement can recover malformed storage');ck(backing.getItem(S.RECOVERY)==='{broken','malformed original is retained during replacement');
const statuses=[];api=S.create({getStorage:()=>{throw Error('blocked');},notify:s=>statuses.push(s)});api.load();ck(!api.save(progress)&&statuses.at(-1).kind==='error','blocked reads stay usable but unsaved');
backing=memory({[S.KEY]:JSON.stringify(progress),...foreign});api=S.create({getStorage:()=>backing});api.load();const originalWrite=backing.setItem,oldSnapshot=JSON.stringify([...backing.map].sort());backing.setItem=(key,value)=>{if(key===S.KEY&&String(value).includes('SYN fail'))throw Error('quota');originalWrite(key,value);};ck(!api.replace({...progress,futureMetadata:{note:'SYN fail'}}),'partial restore failure is reported');ck(JSON.stringify([...backing.map].sort())===oldSnapshot,'failed restore rolls back data and recovery');
console.log(passed+' Heart52 content, learning and storage checks passed.');
