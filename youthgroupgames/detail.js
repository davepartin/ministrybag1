const categoryMap = {
  "Active/Athletic Games": "Active games",
  "Ball Games": "Active games",
  "Circle Games": "Circle games",
  "Creative Challenges": "Creative games",
  "Drama/Performance Games": "Stage games",
  "Elimination & Tag Games": "Active games",
  "Food-Based Challenges": "Messy & food",
  "Gross/Messy Games": "Messy & food",
  "Guessing/Memory Games": "Think & guess",
  "Memory/Word Games": "Think & guess",
  "Messy/Food Games": "Messy & food",
  "Mixer Games": "Icebreakers",
  "Name Games": "Icebreakers",
  "Quick Line/Row Games": "Quick & simple",
  "Quick Thinking Games": "Quick & simple",
  "Quick/Simple Games": "Quick & simple",
  "Relay Games": "Relays",
  "Seasonal/Holiday Games": "Seasonal",
  "Silly/Fun Games": "Silly games",
  "Special Equipment Games": "Special equipment",
  "Tag Variations": "Active games",
  "Team Building/Cooperation": "Team building",
  "Team Strategy Games": "Team building",
  "Unique Indoor Games": "Indoor games",
  "Unique/Creative Games": "Creative games",
  "Upfront/Performance Games (Small Group)": "Stage games",
  "Water Games": "Water games"
};

const elements = {
  page: document.getElementById("gamePage"),
  loading: document.getElementById("detailLoading"),
  error: document.getElementById("detailError"),
  breadcrumbGame: document.getElementById("breadcrumbGame"),
  category: document.getElementById("gameCategory"),
  title: document.getElementById("gameTitle"),
  summary: document.getElementById("gameSummary"),
  players: document.getElementById("gamePlayers"),
  equipment: document.getElementById("gameEquipment"),
  originalCategory: document.getElementById("gameOriginalCategory"),
  steps: document.getElementById("howToSteps"),
  safetySection: document.getElementById("safetySection"),
  safetyText: document.getElementById("safetyText"),
  favoriteButton: document.getElementById("detailFavorite"),
  copyButton: document.getElementById("copyGameLink"),
  randomNotice: document.getElementById("randomNotice"),
  stickyTitle: document.getElementById("stickyGameTitle")
};

const duplicateRedirects = {
  4: 1,
  123: 122,
  153: 2,
  164: 75
};

let currentGame = null;
let favorites = [
  ...new Set(
    readStoredArray("youthGroupGameFavorites").map((id) => duplicateRedirects[id] || id)
  )
];
localStorage.setItem("youthGroupGameFavorites", JSON.stringify(favorites));

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    localStorage.removeItem(key);
    return [];
  }
}

function cleanText(value) {
  return String(value || "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sentences(value) {
  const clean = cleanText(value);
  const parts = clean.split(/(?<=[.!?])\s+(?=[A-Z0-9"(])/).filter(Boolean);
  return parts.length ? parts : [clean];
}

function gameSummary(rules) {
  const first = sentences(rules)[0];

  if (first.length <= 190) {
    return first;
  }

  return `${first.slice(0, 186).replace(/\s+\S*$/, "")}…`;
}

function browseCategory(game) {
  return categoryMap[game.category] || game.category;
}

function updateFavoriteButton() {
  const saved = favorites.includes(currentGame.id);
  elements.favoriteButton.classList.toggle("is-active", saved);
  elements.favoriteButton.setAttribute("aria-pressed", String(saved));
  elements.favoriteButton.innerHTML = saved
    ? '<span aria-hidden="true">★</span> Saved'
    : '<span aria-hidden="true">☆</span> Save game';
}

function toggleFavorite() {
  if (!currentGame) return;

  const index = favorites.indexOf(currentGame.id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(currentGame.id);
  }

  localStorage.setItem("youthGroupGameFavorites", JSON.stringify(favorites));
  updateFavoriteButton();
}

function buildHowToPlay(game) {
  const stepFragment = document.createDocumentFragment();
  const ruleSentences = sentences(game.rules);

  ruleSentences.forEach((sentence, index) => {
    const item = document.createElement("li");
    item.className = "how-to-step";

    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const text = document.createElement("p");
    text.textContent = sentence;
    item.append(number, text);
    stepFragment.appendChild(item);
  });

  elements.steps.replaceChildren(stepFragment);

  const safetyKeywords =
    /\b(safety|safe|seizure|headache|goggles|spotter|padding|obstacle|allerg|chok|vehicle|car|blindfold|dark room|hot pepper)\b/i;
  const safetySentences = ruleSentences.filter((sentence) => safetyKeywords.test(sentence));

  if (safetySentences.length) {
    elements.safetyText.textContent = safetySentences.join(" ");
    elements.safetySection.hidden = false;
  } else {
    elements.safetySection.hidden = true;
  }
}

function renderGame(game) {
  currentGame = game;
  const category = browseCategory(game);

  document.title = `${game.name} | Youth Group Games`;
  elements.breadcrumbGame.textContent = game.name;
  elements.category.textContent = category;
  elements.title.textContent = game.name;
  elements.stickyTitle.textContent = game.name;
  elements.summary.textContent = gameSummary(game.rules);
  elements.players.textContent = game.players;
  elements.equipment.textContent = cleanText(game.equipment);
  elements.originalCategory.textContent = game.category;
  elements.randomNotice.hidden = !new URLSearchParams(window.location.search).has("random");
  buildHowToPlay(game);
  updateFavoriteButton();
  elements.loading.hidden = true;
  elements.page.hidden = false;
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href.replace(/&random=1$/, ""));
    elements.copyButton.textContent = "Copied!";
    window.setTimeout(() => {
      elements.copyButton.innerHTML = '<span aria-hidden="true">↗</span> Share';
    }, 1600);
  } catch (error) {
    window.prompt("Copy this game link:", window.location.href.replace(/&random=1$/, ""));
  }
}

async function init() {
  const requestedId = Number.parseInt(new URLSearchParams(window.location.search).get("id"), 10);
  const gameId = duplicateRedirects[requestedId] || requestedId;

  if (!Number.isInteger(gameId)) {
    elements.loading.hidden = true;
    elements.error.hidden = false;
    return;
  }

  try {
    const response = await fetch("games.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const games = await response.json();
    const game = games.find((item) => item.id === gameId);

    if (!game) {
      elements.loading.hidden = true;
      elements.error.hidden = false;
      return;
    }

    if (gameId !== requestedId) {
      const updatedUrl = new URL(window.location.href);
      updatedUrl.searchParams.set("id", String(gameId));
      history.replaceState(null, "", updatedUrl);
    }

    renderGame(game);
  } catch (error) {
    elements.loading.hidden = true;
    elements.error.hidden = false;
  }
}

elements.favoriteButton.addEventListener("click", toggleFavorite);
elements.copyButton.addEventListener("click", copyLink);

init();
