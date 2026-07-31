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

const categoryDescriptions = {
  "Active games": "Run, chase, throw, and move",
  "Circle games": "Easy games that keep everyone together",
  "Creative games": "Unusual ideas with a memorable twist",
  "Icebreakers": "Help students connect and learn names",
  "Indoor games": "Good options for rooms and tight spaces",
  "Messy & food": "Big laughs and a little cleanup",
  "Quick & simple": "Fast setup and easy instructions",
  "Relays": "Team races with simple challenges",
  "Seasonal": "Holiday and seasonal ideas",
  "Silly games": "Low-pressure fun that gets people laughing",
  "Special equipment": "Games built around a unique prop",
  "Stage games": "Great for a few volunteers up front",
  "Team building": "Cooperation, communication, and strategy",
  "Think & guess": "Memory, mystery, and quick thinking",
  "Water games": "Outdoor games made for getting wet"
};

const duplicateRedirects = {
  4: 1,
  123: 122,
  153: 2,
  164: 75
};

const state = {
  games: [],
  search: "",
  category: "all",
  quickFilter: "all",
  favoritesOnly: false
};

const elements = {
  gameGrid: document.getElementById("gameGrid"),
  searchInput: document.getElementById("searchInput"),
  categorySelect: document.getElementById("categorySelect"),
  quickFilters: document.getElementById("quickFilters"),
  favoritesToggle: document.getElementById("favoritesToggle"),
  resultCount: document.getElementById("resultCount"),
  activeFilterSummary: document.getElementById("activeFilterSummary"),
  emptyState: document.getElementById("emptyState"),
  clearFilters: document.getElementById("clearFilters"),
  randomButton: document.getElementById("randomButton"),
  randomButtonHero: document.getElementById("randomButtonHero"),
  gameTotal: document.getElementById("gameTotal"),
  loadingState: document.getElementById("loadingState")
};

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

function gameSummary(rules) {
  const clean = cleanText(rules);
  const firstSentence = clean.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || clean;

  if (firstSentence.length <= 175) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 171).replace(/\s+\S*$/, "")}…`;
}

function browseCategory(game) {
  return categoryMap[game.category] || game.category;
}

function searchableGameText(game) {
  return [
    game.name,
    game.category,
    browseCategory(game),
    game.players,
    game.equipment,
    game.rules
  ]
    .join(" ")
    .toLowerCase();
}

function isNoEquipment(game) {
  return cleanText(game.equipment).toLowerCase() === "none";
}

function matchesQuickFilter(game) {
  const category = browseCategory(game);

  switch (state.quickFilter) {
    case "no-equipment":
      return isNoEquipment(game);
    case "quick":
      return category === "Quick & simple";
    case "active":
      return category === "Active games";
    case "team":
      return category === "Team building";
    case "messy":
      return category === "Messy & food";
    default:
      return true;
  }
}

function filteredGames() {
  const search = state.search.toLowerCase().trim();

  return state.games
    .filter((game) => {
      if (search && !searchableGameText(game).includes(search)) {
        return false;
      }

      if (state.category !== "all" && browseCategory(game) !== state.category) {
        return false;
      }

      if (!matchesQuickFilter(game)) {
        return false;
      }

      if (state.favoritesOnly && !favorites.includes(game.id)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aFavorite = favorites.includes(a.id);
      const bFavorite = favorites.includes(b.id);

      if (aFavorite !== bFavorite) {
        return aFavorite ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
}

function makeMetaPill(label, value, className = "") {
  const item = document.createElement("span");
  item.className = `meta-pill ${className}`.trim();

  const labelSpan = document.createElement("span");
  labelSpan.className = "meta-label";
  labelSpan.textContent = label;

  const valueSpan = document.createElement("span");
  valueSpan.className = "meta-value";
  valueSpan.textContent = value;

  item.append(labelSpan, valueSpan);
  return item;
}

function makeGameCard(game) {
  const card = document.createElement("article");
  const isFavorite = favorites.includes(game.id);
  card.className = `game-card ${isFavorite ? "is-favorite" : ""}`;

  const topRow = document.createElement("div");
  topRow.className = "game-card-top";

  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent = browseCategory(game);
  category.title = categoryDescriptions[browseCategory(game)] || "";

  const favoriteButton = document.createElement("button");
  favoriteButton.className = `favorite-button ${isFavorite ? "is-active" : ""}`;
  favoriteButton.type = "button";
  favoriteButton.textContent = isFavorite ? "★" : "☆";
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.setAttribute(
    "aria-label",
    `${isFavorite ? "Remove" : "Save"} ${game.name} ${isFavorite ? "from" : "to"} favorites`
  );
  favoriteButton.addEventListener("click", () => toggleFavorite(game.id));
  topRow.append(category, favoriteButton);

  const title = document.createElement("h2");
  title.className = "game-card-title";

  const link = document.createElement("a");
  link.href = `detail.html?id=${game.id}`;
  link.textContent = game.name;
  link.addEventListener("click", saveBrowseState);
  title.appendChild(link);

  const summary = document.createElement("p");
  summary.className = "game-card-summary";
  summary.textContent = gameSummary(game.rules);

  const meta = document.createElement("div");
  meta.className = "game-card-meta";
  meta.append(
    makeMetaPill("Players", game.players),
    makeMetaPill("Gear", isNoEquipment(game) ? "None" : game.equipment, isNoEquipment(game) ? "no-gear" : "")
  );

  const footer = document.createElement("div");
  footer.className = "game-card-footer";

  const detailLink = document.createElement("a");
  detailLink.className = "learn-more";
  detailLink.href = `detail.html?id=${game.id}`;
  detailLink.innerHTML = 'How to play <span aria-hidden="true">→</span>';
  detailLink.addEventListener("click", saveBrowseState);
  footer.appendChild(detailLink);

  card.append(topRow, title, summary, meta, footer);
  return card;
}

function toggleFavorite(gameId) {
  const index = favorites.indexOf(gameId);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(gameId);
  }

  localStorage.setItem("youthGroupGameFavorites", JSON.stringify(favorites));
  renderGames();
}

function activeFilterText() {
  const labels = [];

  if (state.search.trim()) {
    labels.push(`matching “${state.search.trim()}”`);
  }

  if (state.category !== "all") {
    labels.push(`in ${state.category}`);
  }

  const quickLabel = {
    "no-equipment": "with no equipment",
    quick: "that are quick and simple",
    active: "that get students moving",
    team: "for team building",
    messy: "that are messy or food-based"
  }[state.quickFilter];

  if (quickLabel) {
    labels.push(quickLabel);
  }

  if (state.favoritesOnly) {
    labels.push("saved as favorites");
  }

  return labels.length ? labels.join(" · ") : "Browse the whole library";
}

function renderGames() {
  const games = filteredGames();
  const fragment = document.createDocumentFragment();

  games.forEach((game) => fragment.appendChild(makeGameCard(game)));
  elements.gameGrid.replaceChildren(fragment);

  elements.resultCount.textContent = `${games.length} ${games.length === 1 ? "game" : "games"}`;
  elements.activeFilterSummary.textContent = activeFilterText();
  elements.emptyState.hidden = games.length !== 0;
  elements.gameGrid.hidden = games.length === 0;
  elements.favoritesToggle.classList.toggle("is-active", state.favoritesOnly);
  elements.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
  elements.favoritesToggle.textContent = state.favoritesOnly ? "★ Showing favorites" : "☆ Favorites";

  document.querySelectorAll("[data-quick-filter]").forEach((button) => {
    const selected = button.dataset.quickFilter === state.quickFilter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  saveBrowseState();
}

function populateCategories() {
  const categories = [...new Set(state.games.map(browseCategory))].sort();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.categorySelect.appendChild(option);
  });
}

function clearAllFilters() {
  state.search = "";
  state.category = "all";
  state.quickFilter = "all";
  state.favoritesOnly = false;
  elements.searchInput.value = "";
  elements.categorySelect.value = "all";
  renderGames();
  elements.searchInput.focus();
}

function chooseRandomGame() {
  const games = filteredGames();

  if (!games.length) {
    elements.emptyState.hidden = false;
    return;
  }

  const game = games[Math.floor(Math.random() * games.length)];
  saveBrowseState();
  window.location.href = `detail.html?id=${game.id}&random=1`;
}

function saveBrowseState() {
  sessionStorage.setItem(
    "youthGroupGamesBrowseState",
    JSON.stringify({
      search: state.search,
      category: state.category,
      quickFilter: state.quickFilter,
      favoritesOnly: state.favoritesOnly,
      scrollY: window.scrollY
    })
  );
}

function restoreBrowseState() {
  try {
    const stored = JSON.parse(sessionStorage.getItem("youthGroupGamesBrowseState") || "{}");
    state.search = typeof stored.search === "string" ? stored.search : "";
    state.category = typeof stored.category === "string" ? stored.category : "all";
    state.quickFilter = typeof stored.quickFilter === "string" ? stored.quickFilter : "all";
    state.favoritesOnly = Boolean(stored.favoritesOnly);
    elements.searchInput.value = state.search;
    elements.categorySelect.value = state.category;
    return Number.isFinite(stored.scrollY) ? stored.scrollY : 0;
  } catch (error) {
    sessionStorage.removeItem("youthGroupGamesBrowseState");
    return 0;
  }
}

function attachEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderGames();
  });

  elements.categorySelect.addEventListener("change", (event) => {
    state.category = event.target.value;
    state.quickFilter = "all";
    renderGames();
  });

  elements.quickFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-filter]");
    if (!button) return;

    state.quickFilter = button.dataset.quickFilter;
    state.category = "all";
    elements.categorySelect.value = "all";
    renderGames();
  });

  elements.favoritesToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    renderGames();
  });

  elements.clearFilters.addEventListener("click", clearAllFilters);
  elements.randomButton.addEventListener("click", chooseRandomGame);
  elements.randomButtonHero.addEventListener("click", chooseRandomGame);
  window.addEventListener("beforeunload", saveBrowseState);
}

async function init() {
  try {
    const response = await fetch("games.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.games = await response.json();
    elements.gameTotal.textContent = String(state.games.length);
    populateCategories();
    attachEvents();
    const restoredScroll = restoreBrowseState();
    renderGames();
    elements.loadingState.hidden = true;

    if (restoredScroll > 0) {
      requestAnimationFrame(() => window.scrollTo(0, restoredScroll));
    }
  } catch (error) {
    elements.loadingState.innerHTML =
      '<strong>The game library could not load.</strong><span>Please refresh the page and try again.</span>';
    elements.loadingState.classList.add("is-error");
  }
}

init();
