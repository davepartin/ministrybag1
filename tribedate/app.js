(function () {
  "use strict";

  const CALENDAR_CODE = "tribe";
  const TABLE_NAME = "tribe_availability";
  const LOCAL_STORAGE_KEY = "tribe-availability-v1";
  const SESSION_PERSON_KEY = "tribe-active-person";

  const PEOPLE = [
    { name: "Dave", initials: "D", color: "#1f5c4a" },
    { name: "Chris", initials: "Ch", color: "#b8892f" },
    { name: "Curtis", initials: "Cu", color: "#bd4c38" },
    { name: "Brian", initials: "B", color: "#466b8f" },
    { name: "Silas", initials: "S", color: "#6f8b54" },
    { name: "Joel", initials: "J", color: "#694f8f" }
  ];

  const els = {
    loginScreen: document.getElementById("loginScreen"),
    appScreen: document.getElementById("appScreen"),
    loginForm: document.getElementById("loginForm"),
    calendarCode: document.getElementById("calendarCode"),
    personOptions: document.getElementById("personOptions"),
    loginError: document.getElementById("loginError"),
    calendarBoard: document.getElementById("calendarBoard"),
    syncStatus: document.getElementById("syncStatus"),
    activePerson: document.getElementById("activePerson"),
    refreshButton: document.getElementById("refreshButton"),
    switchButton: document.getElementById("switchButton"),
    bestCount: document.getElementById("bestCount"),
    myCount: document.getElementById("myCount"),
    selectedDayLabel: document.getElementById("selectedDayLabel"),
    detailDate: document.getElementById("detailDate"),
    detailCount: document.getElementById("detailCount"),
    detailPeople: document.getElementById("detailPeople"),
    detailToggle: document.getElementById("detailToggle"),
    bestDates: document.getElementById("bestDates"),
    toast: document.getElementById("toast")
  };

  const state = {
    activePerson: "",
    selectedDate: dateToKey(new Date()),
    availability: {},
    months: getVisibleMonths(),
    supabaseClient: null,
    realtimeChannel: null,
    syncMode: "local",
    isLoading: false,
    refreshTimer: null
  };

  init();

  function init() {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    renderPersonPicker();
    wireEvents();
    setupStorageSync();
    prepareSupabase();

    const rememberedPerson = sessionStorage.getItem(SESSION_PERSON_KEY);
    if (isKnownPerson(rememberedPerson)) {
      state.activePerson = rememberedPerson;
      enterCalendar();
    }
  }

  function renderPersonPicker() {
    els.personOptions.innerHTML = "";

    PEOPLE.forEach((person) => {
      const label = document.createElement("label");
      label.className = "person-option";
      label.style.setProperty("--person-color", person.color);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "person";
      input.value = person.name;

      const avatar = document.createElement("span");
      avatar.className = "person-avatar";
      avatar.textContent = person.initials;

      const name = document.createElement("span");
      name.textContent = person.name;

      label.append(input, avatar, name);
      els.personOptions.append(label);
    });
  }

  function wireEvents() {
    els.loginForm.addEventListener("submit", handleLogin);
    els.refreshButton.addEventListener("click", () => loadAvailability({ silent: false }));
    els.switchButton.addEventListener("click", switchPerson);
    els.detailToggle.addEventListener("click", () => toggleAvailability(state.selectedDate));
  }

  function handleLogin(event) {
    event.preventDefault();
    const code = els.calendarCode.value.trim().toLowerCase();
    const selectedPerson = new FormData(els.loginForm).get("person");

    if (code !== CALENDAR_CODE) {
      showLoginError("Calendar code does not match.");
      return;
    }

    if (!isKnownPerson(selectedPerson)) {
      showLoginError("Choose one of the six names.");
      return;
    }

    state.activePerson = selectedPerson;
    sessionStorage.setItem(SESSION_PERSON_KEY, selectedPerson);
    showLoginError("");
    enterCalendar();
  }

  function enterCalendar() {
    els.loginScreen.hidden = true;
    els.appScreen.hidden = false;
    els.activePerson.textContent = state.activePerson;
    state.selectedDate = pickInitialSelectedDate();
    renderAll();
    resetScroll();
    loadAvailability({ silent: true });
    subscribeToChanges();
    startRefreshTimer();
  }

  function switchPerson() {
    sessionStorage.removeItem(SESSION_PERSON_KEY);
    state.activePerson = "";
    stopRefreshTimer();

    if (state.realtimeChannel && state.supabaseClient) {
      state.supabaseClient.removeChannel(state.realtimeChannel);
      state.realtimeChannel = null;
    }

    els.appScreen.hidden = true;
    els.loginScreen.hidden = false;
    resetScroll();
    els.calendarCode.value = "";
    els.calendarCode.focus();
  }

  function prepareSupabase() {
    const config = window.TRIBE_CONFIG || {};
    const hasUrl = typeof config.supabaseUrl === "string" && config.supabaseUrl.startsWith("https://");
    const hasKey = typeof config.supabaseAnonKey === "string" && config.supabaseAnonKey.length > 20;
    const hasLibrary = Boolean(window.supabase && window.supabase.createClient);

    if (hasUrl && hasKey && hasLibrary) {
      state.supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      state.syncMode = "supabase";
      return;
    }

    state.syncMode = "local";
  }

  async function loadAvailability(options) {
    const silent = Boolean(options && options.silent);
    state.isLoading = true;
    updateSyncStatus(silent ? "Syncing" : "Refreshing");

    try {
      if (state.syncMode === "supabase") {
        await loadFromSupabase();
      } else {
        loadFromLocalStorage();
      }

      renderAll();
      updateSyncStatus();
    } catch (error) {
      updateSyncStatus("Offline");
      showToast(error.message || "Could not refresh calendar.");
    } finally {
      state.isLoading = false;
    }
  }

  async function loadFromSupabase() {
    const range = getCalendarRange();
    const { data, error } = await state.supabaseClient
      .from(TABLE_NAME)
      .select("game_date, person")
      .eq("calendar_code", CALENDAR_CODE)
      .gte("game_date", range.start)
      .lte("game_date", range.end);

    if (error) {
      throw error;
    }

    state.availability = rowsToAvailability(data || []);
  }

  function loadFromLocalStorage() {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      state.availability = {};
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      state.availability = sanitizeAvailability(parsed);
    } catch (_error) {
      state.availability = {};
    }
  }

  async function toggleAvailability(dateKey) {
    if (!state.activePerson || !dateKey) {
      return;
    }

    const before = cloneAvailability(state.availability);
    const people = getPeopleForDate(dateKey);
    const isAvailable = people.includes(state.activePerson);

    if (isAvailable) {
      state.availability[dateKey] = people.filter((name) => name !== state.activePerson);
    } else {
      state.availability[dateKey] = [...people, state.activePerson];
    }

    state.availability = sanitizeAvailability(state.availability);
    state.selectedDate = dateKey;
    renderAll();

    try {
      if (state.syncMode === "supabase") {
        await saveToggleToSupabase(dateKey, !isAvailable);
        await loadAvailability({ silent: true });
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.availability));
        updateSyncStatus();
      }
    } catch (error) {
      state.availability = before;
      renderAll();
      showToast(error.message || "Could not save that day.");
      updateSyncStatus("Save failed");
    }
  }

  async function saveToggleToSupabase(dateKey, shouldAdd) {
    if (shouldAdd) {
      const { error } = await state.supabaseClient.from(TABLE_NAME).insert({
        calendar_code: CALENDAR_CODE,
        game_date: dateKey,
        person: state.activePerson
      });

      if (error && error.code !== "23505") {
        throw error;
      }
      return;
    }

    const { error } = await state.supabaseClient
      .from(TABLE_NAME)
      .delete()
      .eq("calendar_code", CALENDAR_CODE)
      .eq("game_date", dateKey)
      .eq("person", state.activePerson);

    if (error) {
      throw error;
    }
  }

  function renderAll() {
    els.activePerson.textContent = state.activePerson || "Player";
    renderCalendar();
    renderSummary();
    renderDetail();
    renderBestDates();
    updateSyncStatus();
  }

  function renderCalendar() {
    els.calendarBoard.innerHTML = "";

    state.months.forEach((monthDate) => {
      const month = document.createElement("section");
      month.className = "month";

      const heading = document.createElement("div");
      heading.className = "month-heading";

      const title = document.createElement("h2");
      title.textContent = monthDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      });

      const total = document.createElement("span");
      total.className = "month-total";
      total.textContent = monthTotal(monthDate) + " picks";

      heading.append(title, total);

      const grid = document.createElement("div");
      grid.className = "calendar-grid";
      grid.setAttribute("role", "grid");
      grid.setAttribute("aria-label", title.textContent);

      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
        const weekday = document.createElement("div");
        weekday.className = "weekday";
        weekday.textContent = day;
        grid.append(weekday);
      });

      const year = monthDate.getFullYear();
      const monthIndex = monthDate.getMonth();
      const firstWeekday = new Date(year, monthIndex, 1).getDay();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      for (let index = 0; index < firstWeekday; index += 1) {
        const blank = document.createElement("div");
        blank.className = "blank-day";
        grid.append(blank);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, monthIndex, day);
        const key = dateToKey(date);
        grid.append(createDayButton(date, key));
      }

      month.append(heading, grid);
      els.calendarBoard.append(month);
    });
  }

  function createDayButton(date, key) {
    const people = getPeopleForDate(key);
    const count = people.length;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.date = key;
    button.className = [
      "day-tile",
      "count-" + count,
      key === state.selectedDate ? "is-selected" : "",
      key === dateToKey(new Date()) ? "is-today" : "",
      people.includes(state.activePerson) ? "is-mine" : ""
    ].filter(Boolean).join(" ");
    button.setAttribute("aria-pressed", people.includes(state.activePerson) ? "true" : "false");
    button.setAttribute("aria-label", buildDayLabel(date, people));
    button.addEventListener("click", () => toggleAvailability(key));

    const popover = createAvailabilityPopover(key, people);
    button.setAttribute("aria-describedby", popover.id);

    const dateNumber = document.createElement("span");
    dateNumber.className = "date-number";
    dateNumber.textContent = String(date.getDate());

    const countNumber = document.createElement("strong");
    countNumber.className = "availability-number";
    countNumber.textContent = String(count);
    countNumber.dataset.zero = count === 0 ? "true" : "false";

    const chips = document.createElement("span");
    chips.className = "chip-row";
    people.forEach((name) => chips.append(createPersonChip(name)));

    button.append(dateNumber, countNumber, chips, popover);
    return button;
  }

  function createAvailabilityPopover(dateKey, people) {
    const popover = document.createElement("span");
    popover.className = "availability-popover";
    popover.id = "availability-popover-" + dateKey;
    popover.setAttribute("role", "tooltip");

    const title = document.createElement("span");
    title.className = "popover-title";
    title.textContent = people.length ? "Available" : "No one available";

    const names = document.createElement("span");
    names.className = "popover-names";
    names.textContent = people.length ? people.join(", ") : "Click to add yourself.";

    popover.append(title, names);
    return popover;
  }

  function renderSummary() {
    const topCount = getVisibleDateKeys()
      .map((key) => getPeopleForDate(key).length)
      .reduce((max, count) => Math.max(max, count), 0);
    const myCount = getVisibleDateKeys()
      .filter((key) => getPeopleForDate(key).includes(state.activePerson))
      .length;

    els.bestCount.textContent = String(topCount);
    els.myCount.textContent = String(myCount);
    els.bestCount.dataset.zero = topCount === 0 ? "true" : "false";
    els.myCount.dataset.zero = myCount === 0 ? "true" : "false";
    els.selectedDayLabel.textContent = formatShortDate(state.selectedDate);
  }

  function renderDetail() {
    const people = getPeopleForDate(state.selectedDate);
    const isAvailable = people.includes(state.activePerson);

    els.detailDate.textContent = formatLongDate(state.selectedDate);
    els.detailCount.textContent = String(people.length);
    els.detailCount.dataset.zero = people.length === 0 ? "true" : "false";
    els.detailToggle.textContent = isAvailable ? "Remove My Availability" : "Mark Available";
    els.detailToggle.classList.toggle("danger", isAvailable);

    els.detailPeople.innerHTML = "";
    if (!people.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No one yet.";
      els.detailPeople.append(empty);
      return;
    }

    people.forEach((name) => {
      const person = getPerson(name);
      const row = document.createElement("div");
      row.className = "attendee-row";
      row.style.setProperty("--person-color", person.color);

      const avatar = document.createElement("span");
      avatar.className = "person-avatar small";
      avatar.textContent = person.initials;

      const label = document.createElement("span");
      label.textContent = person.name;

      row.append(avatar, label);
      els.detailPeople.append(row);
    });
  }

  function renderBestDates() {
    els.bestDates.innerHTML = "";

    const best = getVisibleDateKeys()
      .map((key) => ({ key, people: getPeopleForDate(key) }))
      .filter((item) => item.people.length > 0)
      .sort((a, b) => {
        if (b.people.length !== a.people.length) {
          return b.people.length - a.people.length;
        }
        return a.key.localeCompare(b.key);
      })
      .slice(0, 6);

    if (!best.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No dates picked yet.";
      els.bestDates.append(empty);
      return;
    }

    best.forEach((item) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "best-date";
      row.addEventListener("click", () => {
        state.selectedDate = item.key;
        renderAll();
      });

      const label = document.createElement("span");
      label.textContent = formatMediumDate(item.key);

      const count = document.createElement("strong");
      count.textContent = String(item.people.length);

      row.append(label, count);
      els.bestDates.append(row);
    });
  }

  function updateSyncStatus(override) {
    if (override) {
      els.syncStatus.textContent = override;
      els.syncStatus.dataset.mode = "working";
      return;
    }

    if (state.syncMode === "supabase") {
      els.syncStatus.textContent = "Synced";
      els.syncStatus.dataset.mode = "supabase";
    } else {
      els.syncStatus.textContent = "Local Test";
      els.syncStatus.dataset.mode = "local";
    }
  }

  function createPersonChip(name) {
    const person = getPerson(name);
    const chip = document.createElement("span");
    chip.className = "person-chip";
    chip.style.setProperty("--person-color", person.color);
    chip.title = person.name;
    chip.textContent = person.initials;
    return chip;
  }

  function getPeopleForDate(dateKey) {
    return sanitizePeople(state.availability[dateKey] || []);
  }

  function rowsToAvailability(rows) {
    return sanitizeAvailability(
      rows.reduce((acc, row) => {
        if (!acc[row.game_date]) {
          acc[row.game_date] = [];
        }
        acc[row.game_date].push(row.person);
        return acc;
      }, {})
    );
  }

  function sanitizeAvailability(value) {
    const clean = {};

    if (!value || typeof value !== "object") {
      return clean;
    }

    Object.keys(value).forEach((dateKey) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return;
      }

      const people = sanitizePeople(value[dateKey]);
      if (people.length) {
        clean[dateKey] = people;
      }
    });

    return clean;
  }

  function sanitizePeople(value) {
    const seen = new Set();
    const names = Array.isArray(value) ? value : [];

    names.forEach((name) => {
      if (isKnownPerson(name)) {
        seen.add(name);
      }
    });

    return PEOPLE.map((person) => person.name).filter((name) => seen.has(name));
  }

  function cloneAvailability(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function monthTotal(monthDate) {
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    let total = 0;

    for (let day = 1; day <= daysInMonth; day += 1) {
      total += getPeopleForDate(dateToKey(new Date(year, monthIndex, day))).length;
    }

    return total;
  }

  function getVisibleDateKeys() {
    const keys = [];

    state.months.forEach((monthDate) => {
      const year = monthDate.getFullYear();
      const monthIndex = monthDate.getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day += 1) {
        keys.push(dateToKey(new Date(year, monthIndex, day)));
      }
    });

    return keys;
  }

  function getCalendarRange() {
    const startMonth = state.months[0];
    const endMonth = state.months[state.months.length - 1];
    const endDate = new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);

    return {
      start: dateToKey(startMonth),
      end: dateToKey(endDate)
    };
  }

  function getVisibleMonths() {
    const today = new Date();
    const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return Array.from({ length: 4 }, (_unused, index) => (
      new Date(firstMonth.getFullYear(), firstMonth.getMonth() + index, 1)
    ));
  }

  function pickInitialSelectedDate() {
    const todayKey = dateToKey(new Date());
    const keys = getVisibleDateKeys();
    return keys.includes(todayKey) ? todayKey : keys[0];
  }

  function setupStorageSync() {
    window.addEventListener("storage", (event) => {
      if (event.key === LOCAL_STORAGE_KEY && state.syncMode === "local" && !els.appScreen.hidden) {
        loadAvailability({ silent: true });
      }
    });
  }

  function subscribeToChanges() {
    if (state.syncMode !== "supabase" || state.realtimeChannel) {
      return;
    }

    state.realtimeChannel = state.supabaseClient
      .channel("tribe-availability")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLE_NAME,
          filter: "calendar_code=eq." + CALENDAR_CODE
        },
        () => loadAvailability({ silent: true })
      )
      .subscribe();
  }

  function startRefreshTimer() {
    stopRefreshTimer();
    if (state.syncMode === "supabase") {
      state.refreshTimer = window.setInterval(() => loadAvailability({ silent: true }), 30000);
    }
  }

  function stopRefreshTimer() {
    if (state.refreshTimer) {
      window.clearInterval(state.refreshTimer);
      state.refreshTimer = null;
    }
  }

  function showLoginError(message) {
    els.loginError.textContent = message;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 3600);
  }

  function resetScroll() {
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
  }

  function buildDayLabel(date, people) {
    const names = people.length ? people.join(", ") : "no one";
    return formatLongDate(dateToKey(date)) + ": " + people.length + " available, " + names;
  }

  function formatLongDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function formatMediumDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  function formatShortDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  }

  function dateToKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function parseDateKey(dateKey) {
    const parts = dateKey.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function getPerson(name) {
    return PEOPLE.find((person) => person.name === name) || PEOPLE[0];
  }

  function isKnownPerson(name) {
    return PEOPLE.some((person) => person.name === name);
  }
})();
