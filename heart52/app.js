/* Generated from discipleship/tools/heart52/app.js. Edit that source and run node discipleship/scripts/build_heart52.js. */
(function(){
'use strict';
const L=Heart52Learning,$=id=>document.getElementById(id);
const MODES=['read','practice','recall'],INTERVALS=[1,3,7,14];
let verses=[],week=0,mode='read',focusAfter=null,reviewQueue=[],reviewing=false;
let hideLevel=0,hideOrder=[],revealed=new Set(),recallText='',scored=false,grade=null,revealedAnswer=false,rated=false;
let audio=null,rate=1,loop=false,deviceVoice=false,mediaGeneration=0;
const persistence=Heart52Storage.create({notify:status=>{
 $('save-status').textContent=status.kind==='error'?'Changes not saved':'Saved on this device';
 $('storage-notice').hidden=status.kind!=='error';$('storage-notice').setAttribute('role','alert');
 $('storage-notice').textContent=status.kind==='error'?'This browser could not save your changes. They may be lost when you leave this page.':'';
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
let deckWeek=0,flipped=false,activeDeck='all';
const CATEGORY_NAMES={new:'Not started',learning:'Learning',memorized:'Memorized'};
function deckMembers(){return verses.filter(v=>activeDeck==='all'||L.learningStatus(entry(v.week))===activeDeck);}
function cardAddress(number){return activeDeck==='all'?'#card-'+number:'#deck-'+activeDeck+'/'+number;}
function renderCategories(){
 for(const key of L.LEARNING_STATES){const count=verses.filter(v=>L.learningStatus(entry(v.week))===key).length,link=$('deck-'+key+'-link');link.querySelector('span').textContent=count;link.setAttribute('aria-label',CATEGORY_NAMES[key]+', '+count+' verses');if(activeDeck===key)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
 const state=L.learningStatus(entry(deckWeek));for(const input of document.querySelectorAll('[data-learning-status]')){input.checked=Boolean(deckMembers().length)&&input.dataset.learningStatus===state;input.disabled=!deckMembers().length;}
 $('card-category').setAttribute('aria-label',deckMembers().length?'Learning category for '+verses[deckWeek-1].reference:'Choose a learning deck');
}
function setLearningStatus(state){
 if(!L.LEARNING_STATES.includes(state)||!deckMembers().length)return;const selected=deckWeek,wasFlipped=flipped;
 if(L.learningStatus(entry(selected))===state&&entry(selected).learningStatus===state)return;
 progress.verses[selected]={...entry(selected),learningStatus:state};const saved=save();renderHome(false,true);
 if(deckWeek===selected&&!$('deck-content').hidden)setCardFace(wasFlipped);
 $('category-message').hidden=false;$('category-message').textContent=verses[selected-1].reference+' marked '+CATEGORY_NAMES[state]+'.'+(saved?'':' This change could not be saved on this device.');
}
function settings(){const s=progress.heart52Settings;return {start:s?.start==='calendar'?'calendar':'resume',hint:s?.hint==='words'?'words':'topic'};}
function changeSettings(key,value){progress.heart52Settings={...progress.heart52Settings,...settings(),[key]:value};save();}
function setCardFace(reveal){
 flipped=reveal;const verse=verses[deckWeek-1];$('memory-card').setAttribute('aria-pressed',String(reveal));
 $('card-front').setAttribute('aria-hidden',String(reveal));$('card-front').inert=reveal;
 $('card-back').setAttribute('aria-hidden',String(!reveal));$('card-back').inert=!reveal;
 $('memory-card').setAttribute('aria-label',reveal?verse.text+' '+verse.reference+'. Turn card back.':'Reveal '+verse.reference+'. '+$('card-hint').textContent);
}
function renderCard(){
 const v=verses[deckWeek-1],s=settings(),current=L.calendarWeek(),range=L.calendarRange(deckWeek),fmt=d=>d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
 $('card-hint').textContent=s.hint==='words'?L.tokens(v.text).slice(0,2).map(t=>t.text).join(' ')+'…':v.theme;
 $('card-front-reference').textContent=v.reference;$('card-back-reference').textContent=v.reference;$('card-verse').textContent=v.text;$('card-theme').textContent=v.theme;
 $('deck-position').textContent='VERSE '+String(deckWeek).padStart(2,'0')+' / 52';$('hint-choice').value=s.hint;$('start-choice').value=s.start;
 const members=deckMembers(),position=members.findIndex(v=>v.week===deckWeek);
 $('continue-link').href='#week-'+deckWeek;$('deck-previous').disabled=position<=0;$('deck-next').disabled=position===members.length-1;
 if(activeDeck!=='all')$('deck-position').textContent=CATEGORY_NAMES[activeDeck]+' · '+(position+1)+' OF '+members.length;
 renderCategories();
 $('opening-label').textContent=deckWeek===current?'YOUR VERSE FOR THIS WEEK':'ONE PASSAGE. CARRIED WITH YOU.';
 $('opening-note').textContent=deckWeek===current?fmt(range.start)+' – '+fmt(range.end)+'. Read it. Recall it. Return to it.':'Pick up here, or choose this week’s verse. Your pace is welcome.';
 $('this-week').textContent=deckWeek===current?'This week · '+current:'This week’s verse';setCardFace(false);
}
function showDeck(number){location.hash=cardAddress(number);}
function moveDeck(direction){const members=deckMembers(),i=members.findIndex(v=>v.week===deckWeek),next=members[i+direction];if(next)showDeck(next.week);}
function renderCalendar(){
 const year=Number($('calendar-year').value),now=new Date(),current=L.calendarWeek(now),fmt=d=>d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
 $('calendar-grid').replaceChildren();$('calendar-note').textContent=year===now.getFullYear()?'This is week '+current+'. A little each week adds up.':'Your 52 passages for '+year+'. No deadlines, just a path.';
 for(const v of verses){
  const r=L.calendarRange(v.week,year),link=element('a','calendar-week');link.href='#card-'+v.week;link.setAttribute('aria-label','Week '+v.week+', '+fmt(r.start)+' to '+fmt(r.end)+': '+v.reference);
  if(year===now.getFullYear()&&v.week===current)link.setAttribute('aria-current','date');if(entry(v.week).attempts>0)link.classList.add('is-practiced');if(v.week===deckWeek)link.classList.add('is-selected');
  link.append(element('span','calendar-number',String(v.week).padStart(2,'0')),element('span','calendar-date',fmt(r.start)));$('calendar-grid').append(link);
 }
}
function renderHome(initial,keepPosition=false){
 const hash=location.hash,card=hash.match(/^#card-([1-9][0-9]?)$/),filtered=hash.match(/^#deck-(new|learning|memorized)(?:\/([1-9][0-9]?))?$/);
 activeDeck=filtered?filtered[1]:'all';const members=deckMembers(),explicit=Number(filtered?.[2]||card?.[1]||0),before=progress.currentWeek;
 if(explicit&&members.some(v=>v.week===explicit))deckWeek=explicit;
 if(!deckWeek)deckWeek=settings().start==='calendar'||!persistence.hasProgress()?L.calendarWeek():progress.currentWeek;
 if(members.length&&!members.some(v=>v.week===deckWeek))deckWeek=members[0].week;
 if(members.length){progress.currentWeek=deckWeek;if(!initial&&before!==deckWeek)save();}
 const view=hash==='#all'?'all':hash==='#year'?'year':'today';
 for(const name of ['today','all','year']){$(name+'-view').hidden=name!==view;const nav=$('nav-'+name);if(name===view)nav.setAttribute('aria-current','page');else nav.removeAttribute('aria-current');}
 $('deck-content').hidden=!members.length;$('deck-empty').hidden=Boolean(members.length);$('category-message').hidden=true;
 if(!members.length){$('empty-deck-title').textContent='No '+CATEGORY_NAMES[activeDeck].toLowerCase()+' verses yet.';$('empty-deck-help').textContent='Choose any verse and mark it '+CATEGORY_NAMES[activeDeck]+'. It will appear in this deck.';}
 message('');renderLibrary();if(members.length)renderCard();else renderCategories();if(view==='year')renderCalendar();
 if(!initial&&!keepPosition){window.scrollTo({top:0,behavior:'instant'});if(focusAfter){const target=$(focusAfter);focusAfter=null;target?.focus({preventScroll:true});}}
}
function route(initial=false){
 stopMedia();const match=location.hash.match(/^#week-([0-9]{1,2})(?:\/(read|listen|practice|play|review|recall))?$/);
 const next=match?Number(match[1]):0;
 if(!next||next>52){week=0;reviewQueue=[];reviewing=false;$('library-view').hidden=false;$('passage-view').hidden=true;renderHome(initial);document.title='Heart52 | Growing Together';
  return;
 }
 if(next!==week){resetPractice();if(!initial)window.scrollTo({top:0,behavior:'instant'});}
 week=next;deckWeek=next;mode=({listen:'read',play:'practice',review:'recall'})[match[2]]||match[2]||'read';
 if(progress.currentWeek!==week){progress.currentWeek=week;if(!initial)save();}
 $('library-view').hidden=true;$('passage-view').hidden=false;
 const verse=verses[week-1];$('back-library').href=cardAddress(week);$('passage-number').textContent='Passage '+week+' of 52';$('passage-theme').textContent=verse.theme;$('passage-heading').textContent=verse.reference;
 $('previous-passage').disabled=week===1;$('next-passage').disabled=week===52;
 for(const button of document.querySelectorAll('[data-mode]')){const active=button.dataset.mode===mode;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
 $('workspace').setAttribute('aria-labelledby','tab-'+mode);document.title=verse.reference+' | Heart52';
 ({read:renderRead,practice:renderPractice,recall:renderRecall})[mode]();
 if(focusAfter){const target=$(focusAfter);focusAfter=null;if(target){target.tabIndex=target.tagName==='BUTTON'?target.tabIndex:-1;target.focus({preventScroll:true});}}
}
function renderLibrary(){renderList();}
function renderList(){
 const query=$('search').value.toLocaleLowerCase().trim(),theme=$('theme-filter').value,category=$('status-filter').value;
 const found=verses.filter(v=>(category==='all'||L.learningStatus(entry(v.week))===category)&&(!theme||v.theme===theme)&&(!query||[v.week,v.reference,v.theme,v.text].join(' ').toLocaleLowerCase().includes(query)));
 $('verse-list').replaceChildren();$('filter-count').textContent=found.length+' passage'+(found.length===1?'':'s')+' shown';
 for(const v of found){
  const article=element('article','reference-entry'),heading=element('div','reference-heading'),link=element('a','verse-link');link.href=category==='all'?'#card-'+v.week:'#deck-'+category+'/'+v.week;
  link.append(element('span','week','VERSE '+String(v.week).padStart(2,'0')),element('h3','',v.reference));heading.append(link,element('span','topic-label',v.theme+' · '+CATEGORY_NAMES[L.learningStatus(entry(v.week))]));
  const quote=element('p','reference-text',v.text),practice=element('a','reference-practice','Practice this verse →');practice.href='#week-'+v.week;
  article.append(heading,quote,practice);$('verse-list').append(article);
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
function bindStatic(){
 $('memory-card').onclick=()=>setCardFace(!flipped);
 $('memory-card').onkeydown=e=>{if(e.key==='ArrowRight'){e.preventDefault();moveDeck(1);}else if(e.key==='ArrowLeft'){e.preventDefault();moveDeck(-1);}};
 $('deck-previous').onclick=()=>moveDeck(-1);$('deck-next').onclick=()=>moveDeck(1);
 for(const input of document.querySelectorAll('[data-learning-status]'))input.onchange=()=>{if(input.checked)setLearningStatus(input.dataset.learningStatus);};
 $('status-filter').onchange=renderList;
 $('hint-choice').onchange=e=>{changeSettings('hint',e.target.value);renderCard();};$('start-choice').onchange=e=>{changeSettings('start',e.target.value);};
 $('this-week').onclick=()=>{activeDeck='all';showDeck(L.calendarWeek());};
 $('open-settings').onclick=()=>{$('opening-settings').open=!$('opening-settings').open;if($('opening-settings').open){$('opening-settings').scrollIntoView({block:'center',behavior:'instant'});$('start-choice').focus({preventScroll:true});}};
 $('calendar-year').onchange=renderCalendar;$('calendar-today').onclick=()=>{$('calendar-year').value=String(new Date().getFullYear());renderCalendar();const current=$('calendar-grid').querySelector('[aria-current=date]');current?.scrollIntoView({block:'center',behavior:'instant'});current?.focus({preventScroll:true});};

 $('search').oninput=renderList;$('theme-filter').onchange=renderList;$('week-jump').onchange=e=>{const n=Number(e.target.value);if(n){reviewing=false;resetPractice();routeHash(n,'read','passage-heading');}e.target.value='';};
 $('previous-passage').onclick=()=>{reviewing=false;routeHash(week-1,'read','passage-heading');};$('next-passage').onclick=()=>{reviewing=false;routeHash(week+1,'read','passage-heading');};
 for(const button of document.querySelectorAll('[data-mode]')){
  button.onclick=()=>routeHash(week,button.dataset.mode,'tab-'+button.dataset.mode);
  button.onkeydown=e=>{const i=MODES.indexOf(mode),n=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:-1;if(n>=0){e.preventDefault();routeHash(week,MODES[n],'tab-'+MODES[n]);}};
 }
 window.addEventListener('hashchange',()=>{if(verses.length)route(false);});window.addEventListener('pagehide',stopMedia);
 $('retry-load').onclick=()=>location.reload();
}
async function init(){
 bindStatic();
 try{
  const response=await fetch('data/verses.json');if(!response.ok)throw Error('Library unavailable');const list=await response.json();
  if(!Array.isArray(list)||list.length!==52||new Set(list.map(v=>v.reference)).size!==52||list.some((v,i)=>v.week!==i+1||typeof v.reference!=='string'||!v.reference.trim()||typeof v.theme!=='string'||!v.theme.trim()||typeof v.text!=='string'||!v.text.trim()||v.translation!=='ESV'||v.audio!=='assets/audio/week-'+String(i+1).padStart(2,'0')+'.mp3'))throw Error('Invalid collection');
  verses=list;
  const year=new Date().getFullYear();for(const y of [year-1,year,year+1]){const o=element('option','',String(y));o.value=String(y);$('calendar-year').append(o);}$('calendar-year').value=String(year);
  for(const theme of [...new Set(verses.map(v=>v.theme))].sort()){const option=element('option','',theme);option.value=theme;$('theme-filter').append(option);}
  for(const v of verses){const option=element('option','',v.week+' · '+v.reference);option.value=String(v.week);$('week-jump').append(option);}
  $('boot').hidden=true;route(true);
 }catch(_){$('boot').hidden=true;$('load-error').hidden=false;}
}
init();
})();
