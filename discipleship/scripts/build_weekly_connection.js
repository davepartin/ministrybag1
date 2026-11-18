#!/usr/bin/env node
'use strict';
// One authored app, with the established MinistryBag delivery kept on its origin.
const fs = require('node:fs'), path = require('node:path');
const source = path.resolve(__dirname, '../tools/weekly-connection-time');
const target = path.resolve(__dirname, '../../weeklyconnectiontime');
const check = process.argv.includes('--check');
if (!check) fs.mkdirSync(target, {recursive:true});
for (const file of ['index.html','styles.css','app.js','weeklyconnectiontimelogo.png','ministrybagsatchel1.svg','og.png']) {
 let original = fs.readFileSync(path.join(source,file));
 if (file.endsWith('.html')) original = Buffer.from(original.toString('utf8').replace('href="../../index.html"','href="https://growingtogetherdiscipleship.com/index.html"').replace('href="../../index.html#202-8"','href="https://growingtogetherdiscipleship.com/index.html#202-8"').replace('href="../"','href="https://growingtogetherdiscipleship.com/tools/"'));
 const marker = file.endsWith('.html') ? '<!-- Generated from discipleship/tools/weekly-connection-time/index.html. Edit that source, then run node discipleship/scripts/build_weekly_connection.js. -->\n' : /[.](js|css)$/.test(file) ? '/* Generated from discipleship/tools/weekly-connection-time/'+file+'. Edit the source, then run node discipleship/scripts/build_weekly_connection.js. */\n' : '';
 const content = Buffer.concat([Buffer.from(marker), original]);
 if (check) {
  if (!fs.existsSync(path.join(target,file)) || !fs.readFileSync(path.join(target,file)).equals(content)) throw new Error('Weekly Connection Time mirror is stale: '+file);
 } else fs.writeFileSync(path.join(target,file),content);
}
console.log(check ? 'Weekly Connection Time mirrors match their single source.' : 'Built the MinistryBag Weekly Connection Time mirror.');
