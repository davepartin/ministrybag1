const STORAGE_PREFIX = "connection_time_";
const STEP_KEY = `${STORAGE_PREFIX}current_step`;
const FIELD_IDS = [
  "connectionTime",
  "affirmation",
  "highPoint",
  "lowPoint",
  "dreams",
  "service",
  "dateNight",
  "prayer",
  "growth",
  "bibleVerse",
  "customQuestion",
  "customAnswer"
];

const STEP_NAMES = [
  "Set your rhythm",
  "Celebrate",
  "Look back",
  "Look ahead",
  "Serve",
  "Pray and grow",
  "Your question"
];

const EMPTY_LABELS = {
  connectionTime: "Not set yet",
  affirmation: "Nothing written yet",
  highPoint: "Nothing written yet",
  lowPoint: "Nothing written yet",
  dreams: "Nothing written yet",
  service: "Nothing written yet",
  dateNight: "Not planned yet",
  prayer: "No prayer request written",
  growth: "No growth area written",
  bibleVerse: "No verse selected"
};

const elements = {
  welcome: document.getElementById("welcomeScreen"),
  conversation: document.getElementById("conversationScreen"),
  summary: document.getElementById("summaryScreen"),
  startButton: document.getElementById("startButton"),
  startButtonText: document.getElementById("startButtonText"),
  clearSavedWelcome: document.getElementById("clearSavedWelcome"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  nextButtonText: document.querySelector("#nextButton span:first-child"),
  stepCounter: document.getElementById("stepCounter"),
  mobileStepName: document.getElementById("mobileStepName"),
  progressBar: document.getElementById("progressBar"),
  stepPanels: [...document.querySelectorAll("[data-step]")],
  stepNavItems: [...document.querySelectorAll("[data-step-nav]")],
  resetButton: document.getElementById("resetButton"),
  saveStatus: document.getElementById("saveStatus"),
  summaryDate: document.getElementById("summaryDate"),
  summaryCustom: document.getElementById("summaryCustom"),
  copyButton: document.getElementById("copyButton"),
  emailButton: document.getElementById("emailButton"),
  printButton: document.getElementById("printButton"),
  editButton: document.getElementById("editButton"),
  finishButton: document.getElementById("finishButton")
};


// Storage stays on the current origin. Failed reads never authorize overwriting it.
let storageReadFailed = false;
const pendingWrites = new Map();
const RECOVERY_KEY = "connection_time_restore_recovery_v1";
function storageError() {
  const message = storageReadFailed ? "Saved answers could not be opened in this browser. Changes stay on this page; save a copy before leaving." : "This browser could not save your latest changes. They remain on this page. Save a copy before leaving.";
  const error = document.getElementById("saveError");
  error.textContent = message; error.hidden = false;
  document.querySelector("#saveStatus span:last-child").textContent = "Not saved";
}
function readStored(key) {
  try { return localStorage.getItem(key); }
  catch (_) { storageReadFailed = true; storageError(); return null; }
}
function writeStored(key, value) {
  pendingWrites.set(key, String(value));
  if (storageReadFailed) { storageError(); return false; }
  try {
    for (const [name, text] of pendingWrites) { localStorage.setItem(name, text); pendingWrites.delete(name); }
    document.getElementById("saveError").hidden = true;
    return true;
  } catch (_) { storageError(); return false; }
}
function removeStored(key) {
  if (storageReadFailed) { storageError(); return false; }
  try { localStorage.removeItem(key); return true; }
  catch (_) { storageError(); return false; }
}

let currentStep = 0;
let saveTimer;

function hasSavedAnswers() {
  return FIELD_IDS.some((id) => Boolean(readStored(`${STORAGE_PREFIX}${id}`)?.trim()));
}

function savedStep() {
  const value = Number.parseInt(readStored(STEP_KEY), 10);
  return Number.isInteger(value) && value >= 0 && value < STEP_NAMES.length ? value : 0;
}

function fieldValue(id) {
  return document.getElementById(id).value.trim();
}

function updateWelcomeState() {
  const hasAnswers = hasSavedAnswers();
  elements.startButtonText.textContent = hasAnswers ? "Continue our check-in" : "Start our check-in";
  elements.clearSavedWelcome.hidden = !hasAnswers;
}

function loadAnswers() {
  FIELD_IDS.forEach((id) => {
    const input = document.getElementById(id);
    const value = readStored(`${STORAGE_PREFIX}${id}`);
    if (value !== null) input.value = value;
  });
  currentStep = savedStep();
  updateWelcomeState();
}

function showSavedStatus() {
  if (storageReadFailed || pendingWrites.size) { storageError(); return; }
  window.clearTimeout(saveTimer);
  elements.saveStatus.classList.add("is-saving");
  elements.saveStatus.querySelector("span:last-child").textContent = "Saving…";

  saveTimer = window.setTimeout(() => {
    if (storageReadFailed || pendingWrites.size) { storageError(); return; }
    elements.saveStatus.classList.remove("is-saving");
    elements.saveStatus.querySelector("span:last-child").textContent = "Saved on this device";
  }, 450);
}

function saveField(event) {
  const { id, value } = event.target;
  writeStored(`${STORAGE_PREFIX}${id}`, value);
  showSavedStatus();
  updateWelcomeState();
}

function showOnly(screen) {
  elements.welcome.hidden = screen !== "welcome";
  elements.conversation.hidden = screen !== "conversation";
  elements.summary.hidden = screen !== "summary";
  document.body.classList.remove("no-scroll");
  window.scrollTo(0, 0);
}

function renderStep(options = {}) {
  const { focus = false, persist = true } = options;
  elements.stepPanels.forEach((panel, index) => {
    panel.hidden = index !== currentStep;
  });

  elements.stepNavItems.forEach((item, index) => {
    item.classList.toggle("is-active", index === currentStep);
    item.classList.toggle("is-complete", index < currentStep);
    const button = item.querySelector("button");
    button.setAttribute("aria-current", index === currentStep ? "step" : "false");
  });

  elements.previousButton.disabled = currentStep === 0;
  elements.nextButtonText.textContent = currentStep === STEP_NAMES.length - 1 ? "Review our check-in" : "Continue";
  elements.stepCounter.textContent = `Part ${currentStep + 1} of ${STEP_NAMES.length}`;
  elements.mobileStepName.textContent = STEP_NAMES[currentStep];
  elements.progressBar.style.width = `${((currentStep + 1) / STEP_NAMES.length) * 100}%`;
  if (persist) writeStored(STEP_KEY, String(currentStep));

  if (focus) {
    const heading = elements.stepPanels[currentStep].querySelector("h2");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  window.scrollTo(0, 0);
}

function startConversation() {
  currentStep = savedStep();
  showOnly("conversation");
  renderStep();
}

function changeStep(direction) {
  if (direction > 0 && currentStep === STEP_NAMES.length - 1) {
    renderSummary();
    showOnly("summary");
    return;
  }

  currentStep = Math.max(0, Math.min(STEP_NAMES.length - 1, currentStep + direction));
  renderStep({ focus: true });
}

function jumpToStep(index) {
  currentStep = index;
  renderStep({ focus: true });
}

function setSummaryValue(id, value, fallback) {
  const target = document.getElementById(`summary-${id}`);
  target.textContent = value || fallback;
  target.classList.toggle("is-empty", !value);
}

function renderSummary() {
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  elements.summaryDate.textContent = date;

  Object.entries(EMPTY_LABELS).forEach(([id, fallback]) => {
    setSummaryValue(id, fieldValue(id), fallback);
  });

  const customQuestion = fieldValue("customQuestion");
  const customAnswer = fieldValue("customAnswer");
  elements.summaryCustom.hidden = !customQuestion && !customAnswer;
  document.getElementById("summary-customQuestion").textContent = customQuestion || "Our question";
  setSummaryValue("customAnswer", customAnswer, "Nothing written yet");
}

function buildPlainTextSummary() {
  const date = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  const sections = [
    ["OUR REGULAR RHYTHM", fieldValue("connectionTime") || EMPTY_LABELS.connectionTime],
    ["AFFIRMATION", fieldValue("affirmation") || EMPTY_LABELS.affirmation],
    ["LOOKING BACK  -  HIGH", fieldValue("highPoint") || EMPTY_LABELS.highPoint],
    ["LOOKING BACK  -  LOW", fieldValue("lowPoint") || EMPTY_LABELS.lowPoint],
    ["DREAMS AND GOALS", fieldValue("dreams") || EMPTY_LABELS.dreams],
    ["HOW I CAN SERVE", fieldValue("service") || EMPTY_LABELS.service],
    ["NEXT DATE NIGHT", fieldValue("dateNight") || EMPTY_LABELS.dateNight],
    ["PRAYER REQUEST", fieldValue("prayer") || EMPTY_LABELS.prayer],
    ["PERSONAL GROWTH", fieldValue("growth") || EMPTY_LABELS.growth],
    ["OUR MARRIAGE BIBLE VERSE", fieldValue("bibleVerse") || EMPTY_LABELS.bibleVerse]
  ];

  if (fieldValue("customQuestion") || fieldValue("customAnswer")) {
    sections.push([
      fieldValue("customQuestion").toUpperCase() || "OUR QUESTION",
      fieldValue("customAnswer") || "Nothing written yet"
    ]);
  }

  return [
    `WEEKLY CONNECTION TIME  -  ${date}`,
    "",
    ...sections.flatMap(([title, value]) => [title, value, ""])
  ].join("\n").trim();
}

async function copySummary() {
  const original = elements.copyButton.innerHTML;

  try {
    await navigator.clipboard.writeText(buildPlainTextSummary());
    elements.copyButton.textContent = "Copied!";
  } catch (error) {
    window.prompt("Copy your summary:", buildPlainTextSummary());
  }

  window.setTimeout(() => {
    elements.copyButton.innerHTML = original;
  }, 1600);
}

function emailSummary() {
  const date = new Intl.DateTimeFormat(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric"
  }).format(new Date());
  const subject = encodeURIComponent(`Weekly Connection Time  -  ${date}`);
  const body = encodeURIComponent(buildPlainTextSummary());
  elements.emailButton.href = `mailto:?subject=${subject}&body=${body}`;
}

function clearAnswers(options = {}) {
  const { returnHome = true } = options;
  if (!window.confirm("Clear every answer from this weekly check-in? This cannot be undone.")) return;
  if (!persistTransaction(Object.fromEntries(FIELD_IDS.map(id => [id, null])), null, false)) return;
  FIELD_IDS.forEach(id => { document.getElementById(id).value = ""; });
  currentStep = 0;
  updateWelcomeState();
  showSavedStatus();
  document.getElementById("previousCopy").hidden = true;
  if (returnHome) showOnly("welcome");
}

function applyPrompt(event) {
  const button = event.target.closest("[data-prompt-target]");
  if (!button) return;

  const input = document.getElementById(button.dataset.promptTarget);
  const prompt = button.dataset.prompt;

  if (!input.value.trim()) {
    input.value = prompt;
  } else if (!input.value.endsWith(" ")) {
    input.value += ` ${prompt}`;
  } else {
    input.value += prompt;
  }

  writeStored(`${STORAGE_PREFIX}${input.id}`, input.value);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  showSavedStatus();
}

FIELD_IDS.forEach((id) => {
  document.getElementById(id).addEventListener("input", saveField);
});

elements.startButton.addEventListener("click", startConversation);
elements.clearSavedWelcome.addEventListener("click", () => clearAnswers());
elements.previousButton.addEventListener("click", () => changeStep(-1));
elements.nextButton.addEventListener("click", () => changeStep(1));
elements.resetButton.addEventListener("click", () => clearAnswers());
elements.stepNavItems.forEach((item, index) => {
  item.querySelector("button").addEventListener("click", () => jumpToStep(index));
});
document.querySelectorAll(".prompt-chips").forEach((group) => {
  group.addEventListener("click", applyPrompt);
});
elements.copyButton.addEventListener("click", copySummary);
elements.emailButton.addEventListener("click", emailSummary);
elements.printButton.addEventListener("click", () => window.print());
elements.editButton.addEventListener("click", () => {
  showOnly("conversation");
  renderStep();
});
elements.finishButton.addEventListener("click", () => clearAnswers());

loadAnswers();
renderStep({ persist: false });


// Keep the canonical app on Growing Together; retain the established MinistryBag route.
const canonicalApp = /\/tools\/weekly-connection-time(?:\/|$)/.test(location.pathname);
if (canonicalApp) {
  document.getElementById("growing-home").href = "../../index.html";
  document.getElementById("lesson-link").href = "../../index.html#202-8";
  document.getElementById("growing-apps-link").href = "../";
  document.getElementById("migration-note").hidden = false;
}
function portableCopy() {
  return { app: "growing-together.weekly-connection-time", version: 1, step: currentStep,
    answers: Object.fromEntries(FIELD_IDS.map(id => [id, document.getElementById(id).value])) };
}
function downloadCopy(value, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function validateCopy(value) {
  if (!value || value.app !== "growing-together.weekly-connection-time" || value.version !== 1 || !Number.isInteger(value.step) || value.step < 0 || value.step >= STEP_NAMES.length || !value.answers || typeof value.answers !== "object" || Array.isArray(value.answers) || FIELD_IDS.some(id => typeof value.answers[id] !== "string") || Object.keys(value.answers).some(id => !FIELD_IDS.includes(id))) throw new Error("Choose a Weekly Connection Time copy saved by this app.");
  return value;
}
function persistTransaction(answers, step, recovery) {
  if (storageReadFailed) { storageError(); return false; }
  const keys = FIELD_IDS.map(id => STORAGE_PREFIX + id).concat(STEP_KEY, RECOVERY_KEY);
  const before = new Map(); let writing = false;
  try {
    keys.forEach(key => before.set(key, localStorage.getItem(key)));
    writing = true;
    if (recovery) localStorage.setItem(RECOVERY_KEY, JSON.stringify(portableCopy()));
    else if (step === null) localStorage.removeItem(RECOVERY_KEY);
    FIELD_IDS.forEach(id => {
      if (answers[id] === null) localStorage.removeItem(STORAGE_PREFIX + id);
      else localStorage.setItem(STORAGE_PREFIX + id, answers[id]);
    });
    if (step === null) localStorage.removeItem(STEP_KEY);
    else localStorage.setItem(STEP_KEY, String(step));
    pendingWrites.clear(); document.getElementById("saveError").hidden = true;
    return true;
  } catch (_) {
    if (writing) for (const [key, value] of before) {
      try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch (_) { /* Keep the current screen available for a portable copy. */ }
    }
    storageError(); return false;
  }
}
const previousCopy = document.getElementById("previousCopy");
previousCopy.hidden = !readStored(RECOVERY_KEY);
previousCopy.addEventListener("click", () => {
  try { downloadCopy(validateCopy(JSON.parse(readStored(RECOVERY_KEY))), "weekly-connection-previous.json"); }
  catch (_) { document.getElementById("copyStatus").textContent = "No readable recovery copy is available."; }
});
document.getElementById("saveCopy").addEventListener("click", () => downloadCopy(portableCopy(), "weekly-connection-time.json"));
document.getElementById("restoreCopy").addEventListener("click", () => document.getElementById("copyFile").click());
let pendingCopy = null;
const restoreDialog = document.getElementById("restoreDialog");
document.getElementById("copyFile").addEventListener("change", async event => {
  const file = event.target.files[0]; event.target.value = ""; if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error("Choose a copy smaller than 2 MB.");
    pendingCopy = validateCopy(JSON.parse(await file.text()));
    restoreDialog.showModal();
  } catch (_) { pendingCopy = null; document.getElementById("copyStatus").textContent = "That file is not a valid Weekly Connection Time copy. Your answers have not changed."; }
});
function cancelRestore() { pendingCopy = null; restoreDialog.close(); }
document.getElementById("cancelRestore").addEventListener("click", cancelRestore);
restoreDialog.addEventListener("cancel", () => { pendingCopy = null; });
document.getElementById("confirmRestore").addEventListener("click", () => {
  if (!pendingCopy) return;
  if (!persistTransaction(pendingCopy.answers, pendingCopy.step, true)) { cancelRestore(); return; }
  const copy = pendingCopy; cancelRestore();
  FIELD_IDS.forEach(id => { document.getElementById(id).value = copy.answers[id]; });
  currentStep = copy.step; updateWelcomeState(); showOnly("welcome"); showSavedStatus();
  previousCopy.hidden = false;
  document.getElementById("copyStatus").textContent = "Check-in restored. Your previous check-in is available as a recovery copy.";
});
document.getElementById("connectionForm").addEventListener("submit", event => event.preventDefault());
