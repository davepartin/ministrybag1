/* Generated from discipleship/tools/heart52/app.js. Edit that source and run node discipleship/scripts/build_heart52.js. */
(function(){
'use strict';
const L=Heart52Learning,$=id=>document.getElementById(id);
const MODES=['read','practice','recall'],INTERVALS=[1,3,7,14];
let verses=[],week=0,mode='read',focusAfter=null,reviewQueue=[],reviewing=false;
let hideLevel=0,hideOrder=[],revealed=new Set(),recallText='',scored=false,grade=null,revealedAnswer=false,rated=false;
let audio=null,rate=1,loop=false,deviceVoice=false,mediaGeneration=0;
const persistence=Heart52Storage.create({notify:status=>{
 $('save-status').textContent=status.kind==='error'?'Progress not saved':status.text;
 $('storage-notice').hidden=!['error','legacy'].includes(status.kind);
 $('storage-notice').classList.toggle('quiet',status.kind==='legacy');
 $('storage-notice').setAttribute('role',status.kind==='error'?'alert':'status');
 $('storage-notice').textContent=status.text;$('stored-copy').hidden=!status.rawAvailable;
}});
let progress=persistence.load();
function message(text){$('app-message').textContent=text;$('app-message').hidden=!text;}
function element(tag,classes,text){const node=document.createElement(tag);if(classes)node.className=classes;if(text!==undefined)node.textContent=text;return node;}
function entry(number=week){return progress.verses[number]||{attempts:0,accuracy:null,confidence:0,lastPracticed:null,nextReview:null};}
function dateLabel(value){const day=L.dueDay(value);return day?new Date(day+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}):'Ready for review';}
function save(){return persistence.save(progress);}
function routeHash(number,nextMode='read',focus='workspace-heading'){
 focusAfter=focus;const hash='#week-'+number+(nextMode==='read'?'':'/'+nextMode);
 if(location.hash===hash)route(false);else location.hash=hash;
}
function stopMedia(){mediaGeneration++;if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}window.speechSynthesis?.cancel();deviceVoice=false;}
function resetPractice(){hideLevel=0;hideOrder=[];revealed=new Set();recallText='';scored=false;grade=null;revealedAnswer=false;rated=false;}
function route(initial=false){
 stopMedia();const match=location.hash.match(/^#week-([0-9]{1,2})(?:\/(read|listen|practice|play|review|recall))?$/);
 const next=match?Number(match[1]):0;
 if(!next||next>52){week=0;reviewQueue=[];reviewing=false;$('library-view').hidden=false;$('passage-view').hidden=true;renderLibrary();document.title='Heart52 | Growing Together';
  if(location.hash==='#copies'){$('copies').open=true;requestAnimationFrame(()=>$('copies').scrollIntoView());}return;
 }
 if(next!==week){resetPractice();if(!initial)window.scrollTo({top:0,behavior:'instant'});}
 week=next;mode=({listen:'read',play:'practice',review:'recall'})[match[2]]||match[2]||'read';
 if(progress.currentWeek!==week){progress.currentWeek=week;if(!initial)save();}
 $('library-view').hidden=true;$('passage-view').hidden=false;
 const verse=verses[week-1];$('passage-number').textContent='Passage '+week+' of 52';$('passage-theme').textContent=verse.theme;$('passage-heading').textContent=verse.reference;
 $('previous-passage').disabled=week===1;$('next-passage').disabled=week===52;
 for(const button of document.querySelectorAll('[data-mode]')){const active=button.dataset.mode===mode;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
 $('workspace').setAttribute('aria-labelledby','tab-'+mode);document.title=verse.reference+' | Heart52';
 ({read:renderRead,practice:renderPractice,recall:renderRecall})[mode]();
 if(focusAfter){const target=$(focusAfter);focusAfter=null;if(target){target.tabIndex=target.tagName==='BUTTON'?target.tabIndex:-1;target.focus({preventScroll:true});}}
}
function renderLibrary(){
 const current=verses[Math.max(0,Math.min(51,progress.currentWeek-1))];
 $('continue-reference').textContent=current.reference;$('continue-theme').textContent=current.theme+' · Passage '+current.week;
 $('continue-link').href='#week-'+current.week;
 const practiced=verses.filter(v=>entry(v.week).attempts>0),due=practiced.filter(v=>L.isDue(entry(v.week)));
 $('progress-count').textContent=practiced.length+' of 52 practiced · '+due.length+' ready for review';
 $('start-review').disabled=practiced.length===0;$('start-review').textContent=due.length?'Review '+Math.min(due.length,5)+' due passage'+(Math.min(due.length,5)===1?'':'s'):'Review practiced passages';
 $('review-note').textContent=due.length?'Return to a few familiar passages before learning another.':'Choose a passage below. Your progress will still be here when you come back.';
 renderList();
}
function renderList(){
 const query=$('search').value.toLocaleLowerCase().trim(),theme=$('theme-filter').value;
 const found=verses.filter(v=>(!theme||v.theme===theme)&&(!query||[v.week,v.reference,v.theme,v.text].join(' ').toLocaleLowerCase().includes(query)));
 $('verse-list').replaceChildren();$('filter-count').textContent=found.length+' passage'+(found.length===1?'':'s')+' shown';
 for(const v of found){
  const link=element('a','verse-link');link.href='#week-'+v.week;
  const text=element('div');text.append(element('span','week','PASSAGE '+v.week),element('h3','',v.reference),element('span','theme',v.theme));link.append(text);
  if(L.isDue(entry(v.week)))link.append(element('span','due','Review ready'));else link.append(element('span','muted','→'));
  $('verse-list').append(link);
 }
 if(!found.length)$('verse-list').append(element('p','muted','No passages match yet. Try another word or theme.'));
}
function workspace(html){$('workspace').innerHTML=html;}
function renderRead(){
 workspace('<h2 id="workspace-heading" tabindex="-1">Read it slowly</h2><p class="workspace-intro">Read the passage aloud. Notice a phrase you want to carry with you.</p><blockquote id="verse-text" class="scripture"></blockquote><div class="audio-controls"><div class="actions"><button id="audio-toggle" class="button secondary" type="button">Listen</button><button id="restart-audio" class="button secondary" type="button">Start again</button><label><span class="sr-only">Playback speed</span><select id="audio-rate"><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option></select></label></div><label class="check-label"><input id="loop-audio" type="checkbox">Repeat this passage</label><p id="audio-status" class="audio-status" role="status">Audio plays when you choose Listen.</p></div><div class="actions"><button id="begin-practice" class="button" type="button">Practice this passage →</button></div>');
 $('verse-text').textContent=verses[week-1].text;$('audio-rate').value=String(rate);$('loop-audio').checked=loop;
 $('begin-practice').onclick=()=>routeHash(week,'practice');$('audio-toggle').onclick=toggleAudio;
 $('restart-audio').onclick=()=>{if(audio)audio.currentTime=0;if(audio&&!audio.paused)return;playAudio();};
 $('audio-rate').onchange=e=>{rate=Number(e.target.value);if(audio)audio.playbackRate=rate;};
 $('loop-audio').onchange=e=>{loop=e.target.checked;if(audio)audio.loop=loop;};
}
function audioStatus(text){if($('audio-status'))$('audio-status').textContent=text;}
function speech(){
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){audioStatus('Audio is unavailable here. You can still read and practice.');return;}
 const generation=++mediaGeneration;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(verses[week-1].text);utterance.rate=rate;utterance.lang='en-US';
 utterance.onend=()=>{if(generation!==mediaGeneration)return;if(loop)speech();else if($('audio-toggle'))$('audio-toggle').textContent='Listen';};
 utterance.onerror=()=>{if(generation===mediaGeneration)audioStatus('Your device could not play that voice. You can still read and practice.');};
 try{window.speechSynthesis.speak(utterance);$('audio-toggle').textContent='Pause';audioStatus('Using your device’s speech voice.');}catch(_){audioStatus('Speech is unavailable here. You can still read and practice.');}
}
function speechFallback(){if(!week||mode!=='read')return;deviceVoice=true;if(audio)audio.pause();$('audio-toggle').textContent='Use device voice';audioStatus('The recording could not play. Choose Use device voice to hear it another way.');}
function playAudio(){
 if(deviceVoice){speech();return;}
 if(!audio){
  const generation=mediaGeneration;audio=new Audio();audio.preload='none';audio.src=verses[week-1].audio;
  audio.addEventListener('error',()=>{if(generation===mediaGeneration)speechFallback();});
  audio.addEventListener('ended',()=>{if(generation===mediaGeneration&&$('audio-toggle')){$('audio-toggle').textContent='Listen';audioStatus('Finished. Try reading it aloud.');}});
 }
 audio.playbackRate=rate;audio.loop=loop;audioStatus('Opening the recording…');const generation=mediaGeneration;
 audio.play().then(()=>{if(generation===mediaGeneration&&$('audio-toggle')){$('audio-toggle').textContent='Pause';audioStatus('Playing the passage.');}}).catch(()=>{if(generation===mediaGeneration)speechFallback();});
}
function toggleAudio(){
 if(deviceVoice&&window.speechSynthesis?.speaking){mediaGeneration++;window.speechSynthesis.cancel();$('audio-toggle').textContent='Use device voice';audioStatus('Paused.');return;}
 if(audio&&!audio.paused){audio.pause();$('audio-toggle').textContent='Listen';audioStatus('Paused.');return;}
 playAudio();
}
function renderPractice(){
 workspace('<h2 id="workspace-heading" tabindex="-1">Let the words fade</h2><p class="workspace-intro">Say the verse aloud. Hide more when you are ready, and tap a covered word for a hint.</p><div class="practice-options"><label>How much help?<select id="hint-level"><option value="0">Full passage</option><option value="1">A few words hidden</option><option value="2">Most words hidden</option><option value="3">First letters</option><option value="4">No words</option></select></label><button id="shuffle-hints" class="text-button" type="button">Shuffle the hints</button></div><div id="practice-text" class="scripture" aria-label="Memory practice"></div><div class="actions"><button id="hide-more" class="button secondary" type="button">Hide more words</button><button id="begin-recall" class="button" type="button">Try it from memory →</button></div><details class="game"><summary>Put the passage in order</summary><p>Tap the phrases in their original order. This is practice, so you can undo and try again.</p><div id="chunk-bank" class="chunk-bank"></div><div id="ordered-text" class="ordered-text" aria-live="polite"></div><div class="actions"><button id="undo-phrase" class="button secondary" type="button">Undo last</button><button id="check-order" class="button secondary" type="button">Check the order</button></div><p id="order-feedback" class="feedback" role="status"></p></details>');
 $('hint-level').value=String(hideLevel);$('hint-level').onchange=e=>{hideLevel=Number(e.target.value);revealed.clear();renderHints();};
 $('hide-more').onclick=()=>{hideLevel=Math.min(4,hideLevel+1);revealed.clear();$('hint-level').value=String(hideLevel);renderHints();};
 $('shuffle-hints').onclick=()=>{hideOrder=[];revealed.clear();renderHints();};$('begin-recall').onclick=()=>{recallText='';scored=false;grade=null;revealedAnswer=false;rated=false;routeHash(week,'recall');};
 renderHints();renderPhrases();
}
function renderHints(){
 const text=verses[week-1].text,parts=L.tokens(text);if(hideOrder.length!==parts.length)hideOrder=L.shuffled(parts.map((_,i)=>i));
 const amount=hideLevel===0?0:hideLevel===1?Math.max(1,Math.round(parts.length/3)):hideLevel===2?Math.max(1,Math.round(parts.length*2/3)):parts.length;
 const hidden=new Set(hideOrder.slice(0,amount)),node=$('practice-text');node.replaceChildren();let cursor=0;
 parts.forEach((part,i)=>{
  node.append(document.createTextNode(text.slice(cursor,part.start)));
  if(hidden.has(i)){
   const hint=element('button','word-hint',revealed.has(i)?part.text:hideLevel===3?part.text[0]+'…':'____');hint.type='button';hint.dataset.word=String(i);hint.setAttribute('aria-pressed',String(revealed.has(i)));hint.setAttribute('aria-label',revealed.has(i)?'Word '+(i+1)+': '+part.text:'Reveal word '+(i+1));
   hint.onclick=()=>{revealed.add(i);hint.textContent=part.text;hint.setAttribute('aria-pressed','true');hint.setAttribute('aria-label','Word '+(i+1)+': '+part.text);};node.append(hint);
  }else node.append(document.createTextNode(part.text));cursor=part.end;
 });node.append(document.createTextNode(text.slice(cursor)));$('hide-more').disabled=hideLevel===4;
}
function renderPhrases(){
 const chunks=L.phraseChunks(verses[week-1].text),selected=[],buttons=new Map();$('chunk-bank').replaceChildren();
 for(const id of L.shuffled(chunks.map((_,i)=>i))){const button=element('button','',chunks[id]);button.type='button';button.dataset.chunk=String(id);buttons.set(id,button);button.onclick=()=>{selected.push(id);button.disabled=true;update();};$('chunk-bank').append(button);}
 function update(){$('ordered-text').textContent=selected.map(i=>chunks[i]).join(' ');$('undo-phrase').disabled=!selected.length;$('order-feedback').textContent='';}
 $('undo-phrase').onclick=()=>{if(selected.length)buttons.get(selected.pop()).disabled=false;update();};
 $('check-order').onclick=()=>{const correct=selected.length===chunks.length&&selected.every((id,i)=>id===i);$('order-feedback').textContent=correct?'That is the passage in order. Now try recalling it with fewer clues.':'Not quite yet. You can undo a phrase, or read the passage again.';$('order-feedback').classList.toggle('success',correct);};update();
}
function revealCanonical(result){
 const verse=verses[week-1],container=$('answer-text');container.replaceChildren();
 if(!result){container.textContent=verse.text;return;}
 let cursor=0;const missed=new Set(result.missed);
 result.tokens.forEach((part,i)=>{container.append(document.createTextNode(verse.text.slice(cursor,part.start)));if(missed.has(i))container.append(element('mark','',part.text));else container.append(document.createTextNode(part.text));cursor=part.end;});container.append(document.createTextNode(verse.text.slice(cursor)));
}
function recordAttempt(accuracy){
 const previous=entry();progress.verses[week]={...previous,attempts:previous.attempts+1,accuracy,lastPracticed:new Date().toISOString()};scored=true;save();
}
function renderRecall(){
 workspace('<h2 id="workspace-heading" tabindex="-1">Try it from memory</h2><p class="workspace-intro">Type what you remember, or say it aloud before revealing the verse. The answer stays hidden until you choose.</p><label for="recall-input">The passage, in your own recall<textarea id="recall-input" rows="6" maxlength="12000" autocomplete="off" autocorrect="off" spellcheck="false"></textarea></label><div class="actions"><button id="check-recall" class="button" type="button">Check my recall</button><button id="reveal-answer" class="button secondary" type="button">Reveal the verse</button></div><p id="recall-feedback" class="feedback" role="status"></p><div id="answer-panel" class="answer-panel" hidden><p class="eyebrow">THE PASSAGE</p><blockquote id="answer-text" class="scripture"></blockquote><p id="recall-help" class="workspace-intro"></p><button id="try-again" class="text-button" type="button">Try recalling it again</button><h3>When would you like to review it?</h3><p class="workspace-intro">Choose honestly. This is a reminder, not a grade.</p><div id="review-choices" class="review-choices"></div><p id="review-scheduled" class="feedback" role="status"></p><div class="actions"><button id="next-review" class="button" type="button" hidden>Next review passage →</button><a id="finish-review" class="button secondary" href="#">Back to all passages</a></div></div>');
 $('recall-input').value=recallText;$('recall-input').readOnly=revealedAnswer;$('recall-input').oninput=e=>{recallText=e.target.value;};
 $('check-recall').disabled=scored||revealedAnswer;$('reveal-answer').disabled=revealedAnswer;
 $('check-recall').onclick=()=>{
  if(!L.tokens(recallText).length){$('recall-feedback').textContent='Try a few words first, or reveal the passage after saying it aloud.';return;}
  grade=L.compareRecall(verses[week-1].text,recallText);if(!scored)recordAttempt(grade.accuracy);revealedAnswer=true;showRecallResult();
 };
 $('reveal-answer').onclick=()=>{revealedAnswer=true;showRecallResult();};
 $('try-again').onclick=()=>{recallText='';scored=false;grade=null;revealedAnswer=false;rated=false;renderRecall();$('recall-input').focus();};
 for(let c=1;c<=4;c++){
  const labels=['Again tomorrow','In three days','In one week','In two weeks'];const button=element('button','',labels[c-1]);button.type='button';button.dataset.confidence=String(c);button.setAttribute('aria-pressed','false');
  button.onclick=()=>{
   if(rated)return;if(!scored)recordAttempt(null);const previous=entry();progress.verses[week]={...previous,confidence:c,nextReview:L.reviewDay(c)};rated=true;save();
   for(const choice of $('review-choices').children){choice.disabled=true;choice.setAttribute('aria-pressed',String(choice===button));}
   $('review-scheduled').textContent='Review set for '+dateLabel(progress.verses[week].nextReview)+'.';
   if(reviewing){if(reviewQueue[0]===week)reviewQueue.shift();$('next-review').hidden=!reviewQueue.length;if(!reviewQueue.length)$('finish-review').textContent='Finish this review';}
  };$('review-choices').append(button);
 }
 if(rated){
  for(const choice of $('review-choices').children){choice.disabled=true;choice.setAttribute('aria-pressed',String(Number(choice.dataset.confidence)===entry().confidence));}
  $('review-scheduled').textContent='Review set for '+dateLabel(entry().nextReview)+'.';
  $('next-review').hidden=!(reviewing&&reviewQueue.length);
 }
 $('next-review').onclick=()=>{if(reviewQueue.length){resetPractice();routeHash(reviewQueue[0],'recall');}};
 if(revealedAnswer)showRecallResult();
}
function showRecallResult(){
 $('answer-panel').hidden=false;$('recall-input').readOnly=true;$('check-recall').disabled=true;$('reveal-answer').disabled=true;
 if(grade){$('recall-feedback').textContent='Matched '+grade.correct+' of '+grade.total+' words'+(grade.extra?', with '+grade.extra+' extra.':'.')+' '+grade.accuracy+'% on this try.';$('recall-help').textContent=grade.missed.length?'The highlighted words need another look. Capitalization and punctuation are not graded.':grade.extra?'Watch for extra words. Capitalization and punctuation are not graded.':'The wording is in place. Capitalization and punctuation are not graded.';}
 else{$('recall-feedback').textContent='Compare the passage with what you said aloud.';$('recall-help').textContent='Read it again, then try once more with the answer hidden.';}
 revealCanonical(grade);
}
function startReview(){
 const practiced=verses.filter(v=>entry(v.week).attempts>0),due=practiced.filter(v=>L.isDue(entry(v.week)));
 reviewQueue=(due.length?due:practiced).sort((a,b)=>(L.dueDay(entry(a.week).nextReview)||'').localeCompare(L.dueDay(entry(b.week).nextReview)||'')).slice(0,5).map(v=>v.week);
 if(!reviewQueue.length){message('Choose a passage to practice first. Your review list will grow as you learn.');return;}
 reviewing=true;resetPractice();message('A short review: '+reviewQueue.length+' passage'+(reviewQueue.length===1?'':'s')+'.');routeHash(reviewQueue[0],'recall');
}
function copyData(){return {app:'growing-together.heart52',formatVersion:1,progress:L.validateProgress(progress)};}
function download(value,name,raw=false){const url=URL.createObjectURL(new Blob([raw?value:JSON.stringify(value,null,2)],{type:raw?'text/plain':'application/json'}));const link=element('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
let pendingRestore=null;
function cancelRestore(){pendingRestore=null;$('restore-dialog').close();}
function bindStatic(){
 $('search').oninput=renderList;$('theme-filter').onchange=renderList;$('week-jump').onchange=e=>{const n=Number(e.target.value);if(n){reviewing=false;resetPractice();routeHash(n,'read','passage-heading');}e.target.value='';};
 $('start-review').onclick=startReview;$('previous-passage').onclick=()=>{reviewing=false;routeHash(week-1,'read','passage-heading');};$('next-passage').onclick=()=>{reviewing=false;routeHash(week+1,'read','passage-heading');};
 for(const button of document.querySelectorAll('[data-mode]')){
  button.onclick=()=>routeHash(week,button.dataset.mode,'tab-'+button.dataset.mode);
  button.onkeydown=e=>{const i=MODES.indexOf(mode),n=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:-1;if(n>=0){e.preventDefault();routeHash(week,MODES[n],'tab-'+MODES[n]);}};
 }
 window.addEventListener('hashchange',()=>{if(verses.length)route(false);});window.addEventListener('pagehide',stopMedia);
 $('save-copy').onclick=()=>download(copyData(),'heart52-progress.json');$('restore-copy').onclick=()=>$('copy-file').click();
 $('stored-copy').onclick=()=>{const raw=persistence.raw();if(raw!==null)download(raw,'heart52-stored-data.txt',true);};
 $('previous-copy').hidden=!persistence.recovery();$('previous-copy').onclick=()=>{const raw=persistence.recovery();if(raw===null)return;try{const parsed=JSON.parse(raw),checked=L.validateProgress(parsed,parsed.version===2);download({app:'growing-together.heart52',formatVersion:1,progress:checked},'heart52-previous-progress.json');}catch(_){download(raw,'heart52-previous-data.txt',true);}};
 $('copy-file').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{if(file.size>2*1024*1024)throw Error('Too large');const value=JSON.parse(await file.text());if(value.app!=='growing-together.heart52'||value.formatVersion!==1)throw Error('Wrong app');pendingRestore=L.validateProgress(value.progress);$('restore-dialog').showModal();}
  catch(_){pendingRestore=null;$('copy-status').textContent='That file is not a valid Heart52 copy. Your current progress has not changed.';}
 };
 $('cancel-restore').onclick=cancelRestore;$('restore-dialog').addEventListener('cancel',()=>{pendingRestore=null;});
 $('confirm-restore').onclick=()=>{if(!pendingRestore)return;const next=pendingRestore;if(!persistence.replace(next)){cancelRestore();return;}progress=next;cancelRestore();reviewQueue=[];reviewing=false;resetPractice();$('previous-copy').hidden=false;$('stored-copy').hidden=true;$('copy-status').textContent='Progress restored. Your previous copy is available below.';location.hash='';route(false);};
 $('reset-progress').onclick=()=>{if(!window.confirm('Reset Heart52 progress in this browser? Save a copy first if you want to keep it. Other apps are unchanged.'))return;const next=L.freshProgress();if(!persistence.replace(next,{reset:true}))return;progress=next;resetPractice();reviewQueue=[];reviewing=false;$('previous-copy').hidden=true;$('stored-copy').hidden=true;location.hash='';route(false);};
 $('retry-load').onclick=()=>location.reload();
 $('migration-note').hidden=!/\/tools\/heart52(?:\/|$)/.test(location.pathname);
}
async function init(){
 bindStatic();
 try{
  const response=await fetch('data/verses.json');if(!response.ok)throw Error('Library unavailable');const list=await response.json();
  if(!Array.isArray(list)||list.length!==52||new Set(list.map(v=>v.reference)).size!==52||list.some((v,i)=>v.week!==i+1||typeof v.reference!=='string'||!v.reference.trim()||typeof v.theme!=='string'||!v.theme.trim()||typeof v.text!=='string'||!v.text.trim()||v.translation!=='ESV'||v.audio!=='assets/audio/week-'+String(i+1).padStart(2,'0')+'.mp3'))throw Error('Invalid collection');
  verses=list;
  for(const theme of [...new Set(verses.map(v=>v.theme))].sort()){const option=element('option','',theme);option.value=theme;$('theme-filter').append(option);}
  for(const v of verses){const option=element('option','',v.week+' · '+v.reference);option.value=String(v.week);$('week-jump').append(option);}
  $('boot').hidden=true;route(true);
 }catch(_){$('boot').hidden=true;$('load-error').hidden=false;}
}
init();
})();
