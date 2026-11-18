/* Generated from discipleship/tools/heart52/storage.js. Edit that source and run node discipleship/scripts/build_heart52.js. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./learning.js'):root.Heart52Learning);if(typeof module==='object'&&module.exports)module.exports=api;else root.Heart52Storage=api;})(globalThis,function(L){
'use strict';
const KEY='heart52-progress-v1',RECOVERY='heart52-progress-recovery-v1',LEGACY='heart52-v2-progress';
function create({getStorage=()=>globalThis.localStorage,notify=()=>{}}={}){
 let locked=false,badRaw=null,legacyRaw=null;
 const message=(kind,text)=>notify({kind,text,rawAvailable:badRaw!==null});
 function load(){
  try{
   const storage=getStorage(),raw=storage.getItem(KEY);
   if(raw!==null){
    try{const result=L.validateProgress(JSON.parse(raw));message('ready','Progress is saved in this browser on this device.');return result;}
    catch(_){badRaw=raw;locked=true;message('error','Saved progress could not be opened. It has been kept unchanged; download the stored data before replacing it.');return L.freshProgress();}
   }
   legacyRaw=storage.getItem(LEGACY);
   if(legacyRaw!==null){
    try{const result=L.validateProgress(JSON.parse(legacyRaw),true);message('legacy','Your existing Heart52 V2 progress is available. Its original copy stays unchanged.');return result;}
    catch(_){badRaw=legacyRaw;locked=true;message('error','Existing Heart52 progress could not be opened. It has been kept unchanged.');return L.freshProgress();}
   }
   message('ready','Progress saves in this browser on this device.');return L.freshProgress();
  }catch(_){locked=true;message('error','This browser cannot open saved progress. You can still practice and save a portable copy.');return L.freshProgress();}
 }
 function save(progress){
  if(locked){message('error','Progress is only on this page. Save a portable copy before leaving.');return false;}
  try{const checked=L.validateProgress(progress);getStorage().setItem(KEY,JSON.stringify(checked));message('saved','Progress saved on this device.');return true;}
  catch(_){message('error','This browser could not save your latest progress. Keep a portable copy before leaving.');return false;}
 }
 function replace(progress,{reset=false}={}){
  const checked=L.validateProgress(progress);let storage,before,oldRecovery,writing=false;
  try{
   storage=getStorage();before=storage.getItem(KEY);oldRecovery=storage.getItem(RECOVERY);writing=true;
   if(reset)storage.removeItem(RECOVERY);else storage.setItem(RECOVERY,before??legacyRaw??JSON.stringify(L.freshProgress()));
   storage.setItem(KEY,JSON.stringify(checked));locked=false;badRaw=null;message('saved',reset?'Heart52 progress reset in this browser.':'Progress restored. Your previous copy is available below.');return true;
  }catch(_){
   if(writing){try{if(before===null)storage.removeItem(KEY);else storage.setItem(KEY,before);if(oldRecovery===null)storage.removeItem(RECOVERY);else storage.setItem(RECOVERY,oldRecovery);}catch(_){/* Current in-memory progress remains exportable. */}}
   message('error','Progress could not be replaced. Your current screen is still available; save a copy before leaving.');return false;
  }
 }
 function recovery(){try{return getStorage().getItem(RECOVERY);}catch(_){return null;}}
 return {load,save,replace,recovery,hasProgress:()=>{try{return getStorage().getItem(KEY)!==null||legacyRaw!==null;}catch(_){return false;}},raw:()=>badRaw};
}
return {KEY,RECOVERY,LEGACY,create};
});
