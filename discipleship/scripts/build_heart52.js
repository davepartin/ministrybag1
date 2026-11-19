#!/usr/bin/env node
'use strict';
// Maintain one Heart52 source while retaining MinistryBag's original address.
const fs=require('node:fs'),path=require('node:path');
const source=path.resolve(__dirname,'../tools/heart52'),target=path.resolve(__dirname,'../../heart52');
const files=['focus-modality.js','index.html','styles.css','learning.js','storage.js','app.js','data/verses.json','heart52logo1.svg','ministrybagsatchel1.svg',...Array.from({length:52},(_,i)=>'assets/audio/week-'+String(i+1).padStart(2,'0')+'.mp3')];
const focusSource=fs.readFileSync(path.join(__dirname,'focus-modality.js'));
const check=process.argv.includes('--check');
if(check){if(!fs.existsSync(path.join(source,'focus-modality.js'))||!fs.readFileSync(path.join(source,'focus-modality.js')).equals(focusSource))throw Error('Shared focus helper is stale in heart52');}else fs.writeFileSync(path.join(source,'focus-modality.js'),focusSource);
for(const file of files){
 let data=fs.readFileSync(file==='focus-modality.js'?path.join(__dirname,file):path.join(source,file));
 if(file==='index.html')data=Buffer.from(data.toString('utf8').replaceAll('href="../../index.html"','href="https://growingtogetherdiscipleship.com/index.html"').replaceAll('href="../../index.html#201-5"','href="https://growingtogetherdiscipleship.com/index.html#201-5"').replaceAll('href="../../index.html#101-4"','href="https://growingtogetherdiscipleship.com/index.html#101-4"').replaceAll('href="../"','href="https://growingtogetherdiscipleship.com/tools/"'));
 const marker=file==='focus-modality.js'?'/* Generated from discipleship/scripts/focus-modality.js. Run node discipleship/scripts/build_heart52.js. */\n':file.endsWith('.html')?'<!-- Generated from discipleship/tools/heart52/index.html. Edit that source and run node discipleship/scripts/build_heart52.js. -->\n':/[.](js|css)$/.test(file)?'/* Generated from discipleship/tools/heart52/'+file+'. Edit that source and run node discipleship/scripts/build_heart52.js. */\n':'';
 const output=Buffer.concat([Buffer.from(marker),data]),destination=path.join(target,file);
 if(check){if(!fs.existsSync(destination)||!fs.readFileSync(destination).equals(output))throw Error('Heart52 mirror is stale: '+file);}
 else{fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,output);}
}
console.log(check?'Heart52 source and legacy deliveries match.':'Built the MinistryBag Heart52 delivery.');
