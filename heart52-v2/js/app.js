import { words, normalize, phraseChunks, shuffled, blankIndexes, scoreAnswers, nextReviewDate } from "./game-helpers.js";

const STORAGE_KEY = "heart52-v2-progress";
const defaultStore = { version: 2, currentWeek: 1, streak: 0, lastVisit: null, verses: {} };
let verses = [];
let store = loadStore();
let activeVerse = null;
let activeStep = "read";
let audio = null;
let voice = null;
let reviewQueue = [];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function loadStore() {
  try { return { ...defaultStore, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
  catch { return { ...defaultStore }; }
}
function saveStore() { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }
function progress(week) {
  return store.verses[week] || { attempts: 0, accuracy: 0, confidence: 0, mastery: 0, lastPracticed: null, nextReview: null };
}
function difficultyFor(week = activeVerse?.week) {
  const mastery = progress(week).mastery;
  return mastery >= 75 ? 3 : mastery >= 40 ? 2 : 1;
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}
function todayKey(date = new Date()) { return date.toISOString().slice(0, 10); }
function updateVisit() {
  const today = todayKey(), previous = store.lastVisit;
  if (previous && previous !== today) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    store.streak = previous === todayKey(yesterday) ? store.streak + 1 : 1;
  } else if (!previous) store.streak = 1;
  store.lastVisit = today; saveStore();
}

async function init() {
  updateVisit();
  try {
    const response = await fetch("data/verses.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    verses = await response.json();
    populateThemes(); bindGlobalEvents(); route();
  } catch (error) {
    $("#verse-grid").innerHTML = `<div class="error"><h2>Passages could not load</h2><p>Serve this folder from a local web server and try again.</p><button class="button" id="retry" type="button">Try again</button></div>`;
    $("#retry")?.addEventListener("click", () => location.reload());
    console.error(error);
  }
}

function populateThemes() {
  [...new Set(verses.map(v => v.theme))].sort().forEach(theme => {
    const option = document.createElement("option"); option.value = theme; option.textContent = theme;
    $("#theme-filter").append(option);
  });
}
function bindGlobalEvents() {
  window.addEventListener("hashchange", route);
  $("#search").addEventListener("input", renderGrid);
  $("#theme-filter").addEventListener("change", renderGrid);
  $("#back-button").addEventListener("click", () => history.length > 1 ? history.back() : location.hash = "");
  $("#review-nav").addEventListener("click", startReview);
  $("#due-review").addEventListener("click", startReview);
}

function route() {
  const match = location.hash.match(/^#week-(\d{1,2})(?:\/(\w+))?$/);
  if (match && Number(match[1]) <= 52) showVerse(Number(match[1]), match[2] || "read");
  else showDashboard();
}
function showDashboard() {
  stopMedia(); $("#dashboard").classList.remove("hidden"); $("#verse-view").classList.add("hidden");
  $("#back-button").classList.add("hidden"); document.title = "Heart52 · Scripture Memory";
  const due = verses.filter(v => progress(v.week).attempts && (!progress(v.week).nextReview || new Date(progress(v.week).nextReview) <= new Date())).length;
  $("#due-review").textContent = due ? `Review ${due} due passage${due === 1 ? "" : "s"}` : "Start a mixed review";
  renderStats(); renderContinue(); renderGrid();
}
function renderStats() {
  const entries = Object.values(store.verses);
  const practiced = entries.filter(p => p.attempts).length;
  const mastered = entries.filter(p => p.mastery >= 80).length;
  $("#stats").innerHTML = [
    [practiced, "Practiced"], [mastered, "Mastered"], [store.streak, "Day streak"]
  ].map(([n,label]) => `<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join("");
}
function renderContinue() {
  const week = Math.max(1, Math.min(52, store.currentWeek || 1)), verse = verses[week - 1];
  $("#continue-card").innerHTML = `<div><p class="eyebrow">Continue · Week ${week}</p><h2>${escapeHTML(verse.reference)}</h2>
    <blockquote>“${escapeHTML(verse.text)}”</blockquote><span class="translation">English Standard Version (ESV)</span></div>
    <a class="button light" href="#week-${week}">${progress(week).attempts ? "Keep practicing" : "Start this week"} →</a>`;
}
function renderGrid() {
  if (!verses.length) return;
  const query = normalize($("#search").value), theme = $("#theme-filter").value;
  const filtered = verses.filter(v => (!theme || v.theme === theme) && (!query || normalize(`${v.reference} ${v.theme} ${v.text}`).includes(query)));
  $("#filter-status").textContent = `${filtered.length} passage${filtered.length === 1 ? "" : "s"} shown`;
  $("#verse-grid").setAttribute("aria-busy", "false");
  $("#verse-grid").innerHTML = filtered.length ? filtered.map(v => {
    const p = progress(v.week);
    return `<a class="verse-card" href="#week-${v.week}">
      <span class="week">Week ${v.week}</span><h3>${escapeHTML(v.reference)}</h3>
      <p>${escapeHTML(v.text)}</p><footer><span class="pill">${escapeHTML(v.theme)}</span>
      <span class="progress-ring" aria-label="${p.mastery} percent mastery">${p.mastery}%</span></footer></a>`;
  }).join("") : `<p class="error">No passages match those filters.</p>`;
}
function showVerse(week, step) {
  activeVerse = verses[week - 1]; if (!activeVerse) return showDashboard();
  activeStep = ["read","listen","practice","play","review"].includes(step) ? step : "read";
  store.currentWeek = week; saveStore(); $("#dashboard").classList.add("hidden");
  $("#verse-view").classList.remove("hidden"); $("#back-button").classList.remove("hidden");
  document.title = `${activeVerse.reference} · Heart52`;
  $("#verse-view").innerHTML = `<article class="verse-shell"><header class="verse-hero">
    <p class="eyebrow">Week ${week} · ${escapeHTML(activeVerse.theme)}</p><h1>${escapeHTML(activeVerse.reference)}</h1>
    <blockquote>“${escapeHTML(activeVerse.text)}”</blockquote><span class="translation">English Standard Version (ESV)</span>
  </header><div class="flow-tabs" role="tablist" aria-label="Learning steps">
    ${["read","listen","practice","play","review"].map(s => `<button role="tab" data-step="${s}" aria-selected="${s===activeStep}">${s[0].toUpperCase()+s.slice(1)}</button>`).join("")}
  </div><section id="step-panel" class="panel" role="tabpanel"></section></article>`;
  document.querySelectorAll("[data-step]").forEach(button => button.addEventListener("click", () => {
    location.hash = `week-${week}/${button.dataset.step}`;
  }));
  renderStep(); window.scrollTo({ top:0, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
function renderStep() {
  stopMedia();
  document.querySelectorAll("[data-step]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.step === activeStep)));
  ({ read:renderRead, listen:renderListen, practice:renderPractice, play:renderPlay, review:renderReview })[activeStep]();
}
function renderRead() {
  const sentences = activeVerse.text.match(/[^.!?]+[.!?]+/g) || [activeVerse.text];
  $("#step-panel").innerHTML = `<p class="eyebrow">Step 1</p><h2>Read it slowly</h2>
    <p>Read each thought aloud. Tap a phrase to mark your place.</p>
    <div class="reading-guide">${sentences.map((s,i) => `<button class="hint-word" data-sentence="${i}">${escapeHTML(s.trim())}</button>`).join("")}</div>
    <div class="panel-actions"><button class="button" data-next="listen">Continue to listen →</button></div>`;
  document.querySelectorAll("[data-sentence]").forEach(b => b.addEventListener("click", () => b.classList.toggle("success")));
  bindNext();
}
function renderListen() {
  $("#step-panel").innerHTML = `<p class="eyebrow">Step 2</p><h2>Listen and repeat</h2>
    <div class="audio-player"><audio id="passage-audio" preload="metadata" src="${activeVerse.audio}"></audio>
    <p id="audio-status" class="audio-note">Loading natural narration…</p>
    <div class="audio-actions"><button class="button" id="audio-toggle" type="button">▶ Play</button>
    <button class="button secondary" id="repeat-phrase" type="button">Repeat phrase</button>
    <button class="button secondary" id="repeat-passage" type="button">Repeat passage</button></div>
    <div class="audio-actions speed" aria-label="Playback speed">${[.75,1,1.15].map(rate => `<button class="button small secondary" data-rate="${rate}" aria-pressed="${rate===1}">${rate}×</button>`).join("")}</div>
    <label id="voice-label" class="hidden"><span>Speech voice</span><select id="voice-select"></select></label></div>
    <div class="panel-actions"><button class="button" data-next="practice">Continue to practice →</button></div>`;
  audio = $("#passage-audio");
  audio.addEventListener("canplay", () => $("#audio-status").textContent = "Natural MP3 narration is ready.");
  audio.addEventListener("error", enableSpeechFallback, { once:true });
  audio.addEventListener("ended", () => $("#audio-toggle").textContent = "▶ Play");
  $("#audio-toggle").addEventListener("click", toggleAudio);
  $("#repeat-passage").addEventListener("click", () => playFrom(0));
  $("#repeat-phrase").addEventListener("click", repeatPhrase);
  document.querySelectorAll("[data-rate]").forEach(button => button.addEventListener("click", () => {
    const rate = Number(button.dataset.rate); if (audio) audio.playbackRate = rate;
    document.querySelectorAll("[data-rate]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
  }));
  bindNext();
}
function toggleAudio() {
  if (audio?.dataset.fallback === "true") return speak(activeVerse.text);
  if (audio.paused) audio.play().then(() => $("#audio-toggle").textContent = "❚❚ Pause").catch(enableSpeechFallback);
  else { audio.pause(); $("#audio-toggle").textContent = "▶ Play"; }
}
function playFrom(time) {
  if (audio?.dataset.fallback === "true") return speak(activeVerse.text);
  audio.currentTime = time; audio.play().catch(enableSpeechFallback);
}
function repeatPhrase() {
  if (audio?.dataset.fallback !== "true" && Number.isFinite(audio?.duration)) {
    audio.currentTime = Math.max(0, audio.currentTime - 6); audio.play().catch(enableSpeechFallback); return;
  }
  const phrases = activeVerse.text.split(/[,;.?!]/).filter(x => x.trim().length > 5);
  speak(phrases[Math.floor(Math.random() * phrases.length)].trim());
}
function enableSpeechFallback() {
  if (!audio) return; audio.dataset.fallback = "true"; audio.classList.add("hidden");
  $("#audio-status").textContent = "The MP3 is unavailable. Using your device’s speech voice instead.";
  $("#voice-label").classList.remove("hidden"); loadVoices();
}
function loadVoices() {
  if (!window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
  const select = $("#voice-select"); if (!select) return;
  select.innerHTML = voices.map((v,i) => `<option value="${i}">${escapeHTML(v.name)} (${v.lang})</option>`).join("");
  voice = voices[0]; select.addEventListener("change", () => voice = voices[Number(select.value)]);
  if (!voices.length) window.speechSynthesis.addEventListener("voiceschanged", loadVoices, { once:true });
}
function speak(text) {
  if (!window.speechSynthesis) return toast("Speech playback is unavailable on this device.");
  window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice; utterance.rate = audio?.playbackRate || 1; window.speechSynthesis.speak(utterance);
}
function stopMedia() { if (audio) { audio.pause(); audio = null; } window.speechSynthesis?.cancel(); }
function bindNext() {
  document.querySelector("[data-next]")?.addEventListener("click", e => location.hash = `week-${activeVerse.week}/${e.currentTarget.dataset.next}`);
}
function renderPractice() {
  let level = difficultyFor(); const tokens = words(activeVerse.text);
  $("#step-panel").innerHTML = `<p class="eyebrow">Step 3 · Word Reveal</p><h2>Let the words fade</h2>
    <p>Heart52 starts at challenge ${level} based on your progress. Tap any faded word for a hint.</p><div id="reveal-text" class="practice-text"></div>
    <div class="panel-actions"><button class="button secondary" id="easier">Make easier</button><button class="button" id="harder">Fade more words</button>
    <button class="button secondary" id="show-all">Reveal all</button><button class="button" data-next="play">Continue to games →</button></div>`;
  const draw = () => {
    $("#reveal-text").innerHTML = tokens.map((token,i) => {
      const word = /^[\p{L}\p{N}]/u.test(token), hidden = word && ((i * 7 + activeVerse.week) % 10 < level * 2);
      return hidden ? `<button class="hint-word faded" data-hint="${i}" aria-label="Reveal hidden word">${escapeHTML(token)}</button>` : `${escapeHTML(token)} `;
    }).join("");
    document.querySelectorAll("[data-hint]").forEach(b => b.addEventListener("click", () => b.classList.remove("faded")));
  };
  $("#harder").addEventListener("click", () => { level = Math.min(5,level+1); draw(); });
  $("#easier").addEventListener("click", () => { level = Math.max(0,level-1); draw(); });
  $("#show-all").addEventListener("click", () => { level=0; draw(); }); draw(); bindNext();
}
function renderPlay() {
  const level = difficultyFor();
  $("#step-panel").innerHTML = `<p class="eyebrow">Step 4</p><h2>Choose a memory game</h2>
    <p>Challenge ${level} adapts as your mastery grows. Both games are touch-friendly and award partial credit.</p><div class="choice-row">
    <button class="button" id="phrase-game">Phrase Builder</button><button class="button secondary" id="missing-game">Missing Words</button></div>
    <div id="game-area"></div>`;
  $("#phrase-game").addEventListener("click", renderPhraseBuilder);
  $("#missing-game").addEventListener("click", renderMissingWords);
  renderPhraseBuilder();
}
function renderPhraseBuilder() {
  const chunkSize = [5, 4, 3][difficultyFor() - 1];
  const expected = phraseChunks(activeVerse.text, chunkSize), pool = shuffled(expected.map((text,id) => ({text,id})));
  const chosen = [];
  $("#game-area").innerHTML = `<h3>Build the passage</h3><p>Tap phrase chunks in the correct order.</p>
    <div id="answer-zone" class="chunks answer-zone" aria-label="Your answer"></div>
    <div id="chunk-pool" class="chunks">${pool.map(c => `<button class="chunk" data-id="${c.id}">${escapeHTML(c.text)}</button>`).join("")}</div>
    <div class="panel-actions"><button class="button secondary" id="undo-chunk">Undo</button><button class="button" id="check-chunks">Check order</button></div>
    <p id="game-feedback" class="feedback" aria-live="polite"></p>`;
  const draw = () => {
    $("#answer-zone").innerHTML = chosen.map(id => `<button class="chunk" data-remove="${id}">${escapeHTML(expected[id])}</button>`).join("");
    document.querySelectorAll("[data-id]").forEach(b => b.classList.toggle("used", chosen.includes(Number(b.dataset.id))));
    document.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => { chosen.splice(chosen.indexOf(Number(b.dataset.remove)),1); draw(); }));
  };
  document.querySelectorAll("[data-id]").forEach(b => b.addEventListener("click", () => { const id=Number(b.dataset.id); if(!chosen.includes(id)){chosen.push(id);draw();} }));
  $("#undo-chunk").addEventListener("click", () => { chosen.pop(); draw(); });
  $("#check-chunks").addEventListener("click", () => {
    let correct=0; chosen.forEach((id,i) => { if(id===i) correct++; });
    const accuracy=Math.round(correct/expected.length*100); recordAttempt(accuracy);
    $("#game-feedback").textContent = `${correct} of ${expected.length} phrases in the right place · ${accuracy}%`;
    $("#game-feedback").className = `feedback ${accuracy===100?"success":"warning"}`;
    offerReviewNext();
  });
}
function renderMissingWords() {
  const tokens=words(activeVerse.text), level=difficultyFor();
  const indexes=blankIndexes(activeVerse.text, Math.min(10,Math.max(3,Math.floor(tokens.length/(12-level*2)))));
  const expected=indexes.map(i=>tokens[i]);
  $("#game-area").innerHTML = `<h3>Missing Words</h3><p>Type each missing word. Use a hint when you need one.</p>
    <div class="practice-text">${tokens.map((token,i) => indexes.includes(i)
      ? `<input class="blank" data-blank="${indexes.indexOf(i)}" aria-label="Missing word ${indexes.indexOf(i)+1}" autocomplete="off">`
      : `${escapeHTML(token)} `).join("")}</div>
    <div class="word-bank" aria-label="Word bank">${shuffled(expected.map((word,id)=>({word,id}))).map(item =>
      `<button class="chunk" type="button" data-bank="${item.id}" aria-label="Place ${escapeHTML(item.word)}">${escapeHTML(item.word)}</button>`).join("")}</div>
    <div class="panel-actions"><button class="button secondary" id="hint-blank">Give a hint</button><button class="button" id="check-blanks">Check answers</button></div>
    <p id="game-feedback" class="feedback" aria-live="polite"></p>`;
  document.querySelectorAll("[data-bank]").forEach(button=>button.addEventListener("click",()=>{
    const input=[...document.querySelectorAll("[data-blank]")].find(field=>!field.value);
    if(!input) return toast("All blanks are filled. Check your answers when you are ready.");
    input.value=expected[Number(button.dataset.bank)];button.disabled=true;input.focus();
  }));
  $("#hint-blank").addEventListener("click", () => {
    const empties=[...document.querySelectorAll("[data-blank]")].filter(i=>!i.value);
    const input=empties[0]; if(input){const answer=expected[Number(input.dataset.blank)];input.placeholder=answer[0]+"…";input.focus();}
  });
  $("#check-blanks").addEventListener("click", () => {
    const actual=[...document.querySelectorAll("[data-blank]")].map(i=>i.value), score=scoreAnswers(expected,actual);
    recordAttempt(score.accuracy);
    document.querySelectorAll("[data-blank]").forEach((input,i) => {
      input.setAttribute("aria-invalid", String(normalize(input.value)!==normalize(expected[i])));
      if(!input.value) input.placeholder=expected[i];
    });
    $("#game-feedback").textContent=`${score.correct} of ${score.total} correct · ${score.accuracy}%`;
    $("#game-feedback").className=`feedback ${score.accuracy===100?"success":"warning"}`;
    offerReviewNext();
  });
}
function offerReviewNext() {
  if (!reviewQueue.length) return;
  if (reviewQueue[0]?.week === activeVerse.week) reviewQueue.shift();
  const actions=$("#game-area .panel-actions");
  const next=document.createElement("button");next.className="button";next.textContent=reviewQueue.length?"Next review passage →":"Finish mixed review";
  next.addEventListener("click",()=>{
    if(reviewQueue.length) location.hash=`week-${reviewQueue[0].week}/play`;
    else {toast("Mixed review complete!");location.hash="";}
  });
  actions.append(next);
}
function recordAttempt(accuracy, confidence = null, verse = activeVerse) {
  const old=progress(verse.week), attempts=old.attempts+1;
  const next={...old,attempts,accuracy:Math.round((old.accuracy*(attempts-1)+accuracy)/attempts),lastPracticed:new Date().toISOString()};
  if(confidence){
    next.confidence=confidence; next.mastery=Math.round(Math.min(100,next.accuracy*.65+confidence*8.75));
    next.nextReview=nextReviewDate(confidence);
  } else next.mastery=Math.round(Math.min(100,next.accuracy*.7+next.confidence*7.5));
  store.verses[verse.week]=next; saveStore();
}
function renderReview() {
  const p=progress(activeVerse.week);
  $("#step-panel").innerHTML=`<p class="eyebrow">Step 5</p><h2>How well can you recall it?</h2>
    <p>Choose honestly. Heart52 will schedule your next review in 1, 2, 4, or 8 days.</p>
    <div class="confidence">${["Hard","Shaky","Good","Strong"].map((label,i)=>`<button data-confidence="${i+1}">${label}<br><span class="muted">${[1,2,4,8][i]} day${i?"s":""}</span></button>`).join("")}</div>
    <div class="review-summary"><strong>${p.mastery}% mastery</strong><p class="muted">${p.attempts} practice attempt${p.attempts===1?"":"s"} recorded</p></div>`;
  document.querySelectorAll("[data-confidence]").forEach(button=>button.addEventListener("click",()=>{
    const confidence=Number(button.dataset.confidence);recordAttempt(p.accuracy||60,confidence);
    toast(`Review scheduled in ${[1,2,4,8][confidence-1]} day${confidence===1?"":"s"}.`);
    if(activeVerse.week<52){store.currentWeek=Math.max(store.currentWeek,activeVerse.week+1);saveStore();}
    renderReview();
  }));
}
function startReview() {
  const practiced=verses.filter(v=>progress(v.week).attempts);
  if(!practiced.length){toast("Practice a passage first, then return for review.");return;}
  const now=Date.now(),due=practiced.filter(v=>!progress(v.week).nextReview||new Date(progress(v.week).nextReview).getTime()<=now);
  reviewQueue=shuffled(due.length?due:practiced).slice(0,5);
  const first=reviewQueue[0];toast(`Mixed review: ${reviewQueue.length} passage${reviewQueue.length===1?"":"s"}.`);
  location.hash=`week-${first.week}/play`;
}

init();
