#!/usr/bin/env node
'use strict';
// One authored companion app; keep the existing MinistryBag address on its own origin.
const fs=require('node:fs'),path=require('node:path');
const source=path.resolve(__dirname,'../tools/daily-prayers');
const target=path.resolve(__dirname,'../../dailyprayers');
const check=process.argv.includes('--check');
if(!check) fs.mkdirSync(target,{recursive:true});
for(const file of ['index.html','app.css','app.js']){
 const marker=file.endsWith('.html')?'<!-- Generated from discipleship/tools/daily-prayers/index.html. Edit that source, then run node discipleship/scripts/build_daily_prayers.js. -->\n':'/* Generated from discipleship/tools/daily-prayers/'+file+'. Edit that source, then run node discipleship/scripts/build_daily_prayers.js. */\n';
 const content=marker+fs.readFileSync(path.join(source,file),'utf8');
 if(check){if(!fs.existsSync(path.join(target,file))||fs.readFileSync(path.join(target,file),'utf8')!==content)throw new Error('Daily Prayers mirror is stale: '+file);}
 else fs.writeFileSync(path.join(target,file),content);
}
console.log(check?'Daily Prayers mirrors match their single source.':'Built the MinistryBag Daily Prayers mirror.');
