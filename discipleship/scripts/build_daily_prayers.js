#!/usr/bin/env node
'use strict';
// One authored companion app; keep the existing MinistryBag address on its own origin.
const fs=require('node:fs'),path=require('node:path');
const source=path.resolve(__dirname,'../tools/daily-prayers');
const target=path.resolve(__dirname,'../../dailyprayers');
const focusSource=fs.readFileSync(path.join(__dirname,'focus-modality.js'));
const check=process.argv.includes('--check');
if(!check) fs.mkdirSync(target,{recursive:true});
if(check){if(!fs.existsSync(path.join(source,'focus-modality.js'))||!fs.readFileSync(path.join(source,'focus-modality.js')).equals(focusSource))throw Error('Shared focus helper is stale in daily-prayers');}else fs.writeFileSync(path.join(source,'focus-modality.js'),focusSource);
for(const file of ['focus-modality.js','index.html','app.css','app.js','ministrybagsatchel1.svg']){
 const marker=file==='focus-modality.js'?'/* Generated from discipleship/scripts/focus-modality.js. Run node discipleship/scripts/build_daily_prayers.js. */\n':file.endsWith('.html')?'<!-- Generated from discipleship/tools/daily-prayers/index.html. Edit that source, then run node discipleship/scripts/build_daily_prayers.js. -->\n':'/* Generated from discipleship/tools/daily-prayers/'+file+'. Edit that source, then run node discipleship/scripts/build_daily_prayers.js. */\n';
 const content=(file.endsWith('.svg')?'':marker)+fs.readFileSync(file==='focus-modality.js'?path.join(__dirname,file):path.join(source,file),'utf8');
 if(check){if(!fs.existsSync(path.join(target,file))||fs.readFileSync(path.join(target,file),'utf8')!==content)throw new Error('Daily Prayers mirror is stale: '+file);}
 else fs.writeFileSync(path.join(target,file),content);
}
console.log(check?'Daily Prayers mirrors match their single source.':'Built the MinistryBag Daily Prayers mirror.');
