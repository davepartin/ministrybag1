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

let currentStep = 0;
let saveTimer;

function hasSavedAnswers() {
  return FIELD_IDS.some((id) => Boolean(localStorage.getItem(`${STORAGE_PREFIX}${id}`)?.trim()));
}

function savedStep() {
  const value = Number.parseInt(localStorage.getItem(STEP_KEY), 10);
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
    const value = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (value !== null) input.value = value;
  });
  currentStep = savedStep();
  updateWelcomeState();
}

function showSavedStatus() {
  window.clearTimeout(saveTimer);
  elements.saveStatus.classList.add("is-saving");
  elements.saveStatus.querySelector("span:last-child").textContent = "Saving…";

  saveTimer = window.setTimeout(() => {
    elements.saveStatus.classList.remove("is-saving");
    elements.saveStatus.querySelector("span:last-child").textContent = "Saved on this device";
  }, 450);
}

function saveField(event) {
  const { id, value } = event.target;
  localStorage.setItem(`${STORAGE_PREFIX}${id}`, value);
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
  const { focus = false } = options;
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
  localStorage.setItem(STEP_KEY, String(currentStep));

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
    ["LOOKING BACK — HIGH", fieldValue("highPoint") || EMPTY_LABELS.highPoint],
    ["LOOKING BACK — LOW", fieldValue("lowPoint") || EMPTY_LABELS.lowPoint],
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
    `WEEKLY CONNECTION TIME — ${date}`,
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
  const subject = encodeURIComponent(`Weekly Connection Time — ${date}`);
  const body = encodeURIComponent(buildPlainTextSummary());
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function clearAnswers(options = {}) {
  const { returnHome = true } = options;
  const confirmed = window.confirm("Clear every answer from this weekly check-in? This cannot be undone.");
  if (!confirmed) return;

  FIELD_IDS.forEach((id) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    document.getElementById(id).value = "";
  });
  localStorage.removeItem(STEP_KEY);
  currentStep = 0;
  updateWelcomeState();

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

  localStorage.setItem(`${STORAGE_PREFIX}${input.id}`, input.value);
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
renderStep();
