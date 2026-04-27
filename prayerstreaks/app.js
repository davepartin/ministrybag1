const CONFIG = window.PRAYER_STREAK_CONFIG || {};
const SUPABASE_READY =
  Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey) &&
  !String(CONFIG.supabaseUrl).includes("YOUR_SUPABASE_URL") &&
  !String(CONFIG.supabaseUrl).includes("YOUR-PROJECT-REF") &&
  !String(CONFIG.supabaseAnonKey).includes("YOUR_SUPABASE_ANON_KEY") &&
  window.supabase;

const todayKey = () => toDateKey(new Date());
const DAY_MS = 24 * 60 * 60 * 1000;

let supabaseClient = null;
let realtimeChannel = null;
let answerTargetId = null;

const state = {
  mode: SUPABASE_READY ? "cloud" : "demo",
  session: null,
  household: null,
  prayers: [],
  prayerDays: [],
  busy: false,
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindElements();
  bindEvents();
  renderIcons();

  if (state.mode === "cloud") {
    supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      state.session = session;
      void loadAfterAuth();
    });
    const { data } = await supabaseClient.auth.getSession();
    state.session = data.session;
    await loadAfterAuth();
  } else {
    loadDemoState();
    render();
  }
}

function bindElements() {
  [
    "connectionBadge",
    "signOutButton",
    "authView",
    "authForm",
    "emailInput",
    "passwordInput",
    "loginButton",
    "signupButton",
    "authMessage",
    "setupView",
    "createHouseholdForm",
    "householdNameInput",
    "joinHouseholdForm",
    "inviteCodeInput",
    "setupMessage",
    "dashboardView",
    "markPrayedButton",
    "currentStreak",
    "longestStreak",
    "totalPrayerDays",
    "streakStatus",
    "dayStrip",
    "roomTitle",
    "inviteCode",
    "copyInviteButton",
    "roomHelperText",
    "requestForm",
    "requestTitleInput",
    "requestNoteInput",
    "requestCount",
    "requestList",
    "answeredForm",
    "answeredTitleInput",
    "answeredNoteInput",
    "answeredCount",
    "answeredList",
    "answeredDialog",
    "answerDialogForm",
    "answerDialogTitle",
    "answerNoteInput",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.authForm.addEventListener("submit", handleLogin);
  els.signupButton.addEventListener("click", handleSignup);
  els.signOutButton.addEventListener("click", handleSignOut);
  els.createHouseholdForm.addEventListener("submit", handleCreateHousehold);
  els.joinHouseholdForm.addEventListener("submit", handleJoinHousehold);
  els.markPrayedButton.addEventListener("click", handleMarkPrayed);
  els.requestForm.addEventListener("submit", handleAddRequest);
  els.answeredForm.addEventListener("submit", handleAddAnsweredPrayer);
  els.copyInviteButton.addEventListener("click", copyInviteCode);
  els.answerDialogForm.addEventListener("submit", handleConfirmAnswered);

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => els.answeredDialog.close());
  });
}

async function loadAfterAuth() {
  if (!state.session) {
    state.household = null;
    state.prayers = [];
    state.prayerDays = [];
    unsubscribeRealtime();
    render();
    return;
  }

  await loadHousehold();
  if (state.household) {
    await loadDashboardData();
    subscribeRealtime();
  }
  render();
}

async function loadHousehold() {
  setMessage(els.setupMessage, "");
  const { data, error } = await supabaseClient.rpc("get_my_household");
  if (error) {
    setMessage(els.setupMessage, error.message, true);
    return;
  }
  const household = Array.isArray(data) ? data[0] || null : data;
  state.household = household?.id ? household : null;
}

async function loadDashboardData() {
  if (!state.household) return;
  const [prayersResult, daysResult] = await Promise.all([
    supabaseClient
      .from("prayers")
      .select("*")
      .eq("household_id", state.household.id)
      .order("created_at", { ascending: false }),
    supabaseClient
      .from("prayer_days")
      .select("*")
      .eq("household_id", state.household.id)
      .order("day", { ascending: false }),
  ]);

  if (prayersResult.error) {
    setMessage(els.setupMessage, prayersResult.error.message, true);
    return;
  }
  if (daysResult.error) {
    setMessage(els.setupMessage, daysResult.error.message, true);
    return;
  }

  state.prayers = prayersResult.data || [];
  state.prayerDays = daysResult.data || [];
}

function subscribeRealtime() {
  if (!supabaseClient || !state.household || realtimeChannel) return;

  realtimeChannel = supabaseClient
    .channel(`household-${state.household.id}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "prayers", filter: `household_id=eq.${state.household.id}` },
      () => refreshDashboard()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "prayer_days", filter: `household_id=eq.${state.household.id}` },
      () => refreshDashboard()
    )
    .subscribe();
}

function unsubscribeRealtime() {
  if (realtimeChannel && supabaseClient) {
    supabaseClient.removeChannel(realtimeChannel);
  }
  realtimeChannel = null;
}

async function refreshDashboard() {
  await loadDashboardData();
  render();
}

async function handleLogin(event) {
  event.preventDefault();
  if (state.mode !== "cloud") return;
  setBusy(true);
  setMessage(els.authMessage, "Signing in...");
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: els.emailInput.value.trim(),
    password: els.passwordInput.value,
  });
  setBusy(false);
  setMessage(els.authMessage, error ? error.message : "Signed in.", Boolean(error));
}

async function handleSignup() {
  if (state.mode !== "cloud") return;
  setBusy(true);
  setMessage(els.authMessage, "Creating account...");
  const { data, error } = await supabaseClient.auth.signUp({
    email: els.emailInput.value.trim(),
    password: els.passwordInput.value,
  });
  setBusy(false);

  if (error) {
    setMessage(els.authMessage, error.message, true);
    return;
  }

  if (data.session) {
    setMessage(els.authMessage, "Account created.");
  } else {
    setMessage(els.authMessage, "Check your email to confirm your account, then log in.");
  }
}

async function handleSignOut() {
  if (state.mode === "cloud") {
    await supabaseClient.auth.signOut();
  } else {
    localStorage.removeItem("prayer-streaks-demo");
    loadDemoState();
    render();
  }
}

async function handleCreateHousehold(event) {
  event.preventDefault();
  setBusy(true);
  setMessage(els.setupMessage, "Creating your room...");

  if (state.mode === "cloud") {
    const { data, error } = await supabaseClient.rpc("create_household", {
      room_name: els.householdNameInput.value.trim(),
    });
    setBusy(false);
    if (error) {
      setMessage(els.setupMessage, error.message, true);
      return;
    }
    state.household = normalizeHousehold(data);
    await loadHousehold();
    await loadDashboardData();
    subscribeRealtime();
  } else {
    state.household.name = els.householdNameInput.value.trim() || "Our Prayer Room";
    saveDemoState();
    setBusy(false);
  }

  setMessage(els.setupMessage, "");
  render();
}

async function handleJoinHousehold(event) {
  event.preventDefault();
  setBusy(true);
  setMessage(els.setupMessage, "Joining room...");

  const inviteCode = els.inviteCodeInput.value.trim().toUpperCase();
  const { data, error } = await supabaseClient.rpc("join_household_by_code", {
    invite: inviteCode,
  });
  setBusy(false);

  if (error) {
    setMessage(els.setupMessage, error.message, true);
    return;
  }

  state.household = normalizeHousehold(data);
  await loadHousehold();
  await loadDashboardData();
  subscribeRealtime();
  setMessage(els.setupMessage, "");
  render();
}

async function handleMarkPrayed() {
  if (hasPrayedToday()) return;
  setBusy(true);

  if (state.mode === "cloud") {
    const { error } = await supabaseClient.from("prayer_days").insert({
      household_id: state.household.id,
      day: todayKey(),
    });
    setBusy(false);
    if (error && error.code !== "23505") {
      window.alert(error.message);
      return;
    }
    await refreshDashboard();
  } else {
    state.prayerDays.unshift({
      id: crypto.randomUUID(),
      household_id: state.household.id,
      day: todayKey(),
      created_at: new Date().toISOString(),
    });
    state.prayerDays = uniqueByDay(state.prayerDays);
    saveDemoState();
    setBusy(false);
    render();
  }
}

async function handleAddRequest(event) {
  event.preventDefault();
  const title = els.requestTitleInput.value.trim();
  const note = els.requestNoteInput.value.trim();
  if (!title) return;
  setBusy(true);

  if (state.mode === "cloud") {
    const { error } = await supabaseClient.from("prayers").insert({
      household_id: state.household.id,
      title,
      note,
    });
    setBusy(false);
    if (error) {
      window.alert(error.message);
      return;
    }
    await refreshDashboard();
  } else {
    state.prayers.unshift(makePrayer({ title, note }));
    saveDemoState();
    setBusy(false);
    render();
  }

  els.requestForm.reset();
  els.requestTitleInput.focus();
}

async function handleAddAnsweredPrayer(event) {
  event.preventDefault();
  const title = els.answeredTitleInput.value.trim();
  const note = els.answeredNoteInput.value.trim();
  if (!title) return;
  setBusy(true);

  if (state.mode === "cloud") {
    const { error } = await supabaseClient.from("prayers").insert({
      household_id: state.household.id,
      title,
      note,
      answered_note: note,
      answered_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      window.alert(error.message);
      return;
    }
    await refreshDashboard();
  } else {
    state.prayers.unshift(makePrayer({ title, note, answered_note: note, answered_at: new Date().toISOString() }));
    saveDemoState();
    setBusy(false);
    render();
  }

  els.answeredForm.reset();
  els.answeredTitleInput.focus();
}

function openAnswerDialog(id) {
  const prayer = state.prayers.find((item) => item.id === id);
  if (!prayer) return;
  answerTargetId = id;
  els.answerDialogTitle.textContent = prayer.title;
  els.answerNoteInput.value = "";
  els.answeredDialog.showModal();
  renderIcons();
}

async function handleConfirmAnswered(event) {
  event.preventDefault();
  if (!answerTargetId) return;
  const answeredNote = els.answerNoteInput.value.trim();
  setBusy(true);

  if (state.mode === "cloud") {
    const { error } = await supabaseClient
      .from("prayers")
      .update({
        answered_at: new Date().toISOString(),
        answered_note: answeredNote || null,
      })
      .eq("id", answerTargetId)
      .eq("household_id", state.household.id);
    setBusy(false);
    if (error) {
      window.alert(error.message);
      return;
    }
    await refreshDashboard();
  } else {
    state.prayers = state.prayers.map((prayer) =>
      prayer.id === answerTargetId
        ? { ...prayer, answered_at: new Date().toISOString(), answered_note: answeredNote }
        : prayer
    );
    saveDemoState();
    setBusy(false);
    render();
  }

  answerTargetId = null;
  els.answeredDialog.close();
}

async function deletePrayer(id) {
  if (!window.confirm("Delete this prayer?")) return;
  setBusy(true);

  if (state.mode === "cloud") {
    const { error } = await supabaseClient.from("prayers").delete().eq("id", id).eq("household_id", state.household.id);
    setBusy(false);
    if (error) {
      window.alert(error.message);
      return;
    }
    await refreshDashboard();
  } else {
    state.prayers = state.prayers.filter((prayer) => prayer.id !== id);
    saveDemoState();
    setBusy(false);
    render();
  }
}

function render() {
  const loggedIn = state.mode === "demo" || Boolean(state.session);
  const hasHousehold = Boolean(state.household);

  els.authView.classList.toggle("hidden", state.mode === "demo" || loggedIn);
  els.setupView.classList.toggle("hidden", !loggedIn || hasHousehold);
  els.dashboardView.classList.toggle("hidden", !loggedIn || !hasHousehold);
  els.signOutButton.classList.toggle("hidden", !loggedIn);

  renderConnectionBadge();

  if (hasHousehold) {
    renderDashboard();
  }

  setBusy(state.busy);
  renderIcons();
}

function renderConnectionBadge() {
  if (state.mode === "demo") {
    els.connectionBadge.textContent = "Demo mode";
    els.connectionBadge.className = "status-pill demo";
    return;
  }

  if (!state.session) {
    els.connectionBadge.textContent = "Supabase ready";
    els.connectionBadge.className = "status-pill";
    return;
  }

  els.connectionBadge.textContent = state.session.user.email || "Signed in";
  els.connectionBadge.className = "status-pill online";
}

function renderDashboard() {
  const days = state.prayerDays.map((item) => item.day).sort();
  const stats = calculateStreaks(days);
  const requests = state.prayers.filter((prayer) => !prayer.answered_at);
  const answered = state.prayers.filter((prayer) => prayer.answered_at);

  els.roomTitle.textContent = state.household.name || "Our Prayer Room";
  els.inviteCode.textContent = getInviteCode(state.household);
  els.roomHelperText.textContent =
    state.mode === "demo"
      ? "Demo mode saves only in this browser. Connect Supabase to share this room across accounts."
      : "Share this code with your wife after she creates an account.";

  els.currentStreak.textContent = stats.current;
  els.longestStreak.textContent = stats.longest;
  els.totalPrayerDays.textContent = days.length;
  els.markPrayedButton.disabled = state.busy || hasPrayedToday();
  els.markPrayedButton.innerHTML = hasPrayedToday()
    ? '<i data-lucide="check-check"></i> Prayed today'
    : '<i data-lucide="check"></i> We prayed today';

  els.streakStatus.textContent = getStreakStatus(stats.current, days);
  renderDayStrip(days);

  els.requestCount.textContent = String(requests.length);
  els.answeredCount.textContent = String(answered.length);
  renderPrayerList(els.requestList, requests, "request");
  renderPrayerList(els.answeredList, answered, "answered");
}

function renderDayStrip(days) {
  const daySet = new Set(days);
  const today = startOfDay(new Date());
  const fragment = document.createDocumentFragment();

  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(today.getTime() - offset * DAY_MS);
    const key = toDateKey(date);
    const cell = document.createElement("div");
    cell.className = [
      "day-cell",
      daySet.has(key) ? "prayed" : "",
      key === todayKey() ? "today" : "",
    ]
      .filter(Boolean)
      .join(" ");
    cell.innerHTML = `
      <span>${date.toLocaleDateString(undefined, { weekday: "short" })}</span>
      <span class="day-dot" aria-hidden="true"></span>
      <span>${date.getDate()}</span>
    `;
    fragment.appendChild(cell);
  }

  els.dayStrip.replaceChildren(fragment);
}

function renderPrayerList(container, prayers, type) {
  if (!prayers.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent =
      type === "request"
        ? "Add the first prayer request you are carrying together."
        : "Answered prayers you add or move will appear here.";
    container.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  prayers
    .slice()
    .sort((a, b) => new Date(b.answered_at || b.created_at) - new Date(a.answered_at || a.created_at))
    .forEach((prayer) => {
      const card = document.createElement("article");
      card.className = "prayer-card";

      const note = type === "answered" ? prayer.answered_note || prayer.note : prayer.note;
      const metaDate = prayer.answered_at || prayer.created_at;
      const metaLabel = type === "answered" ? "Answered" : "Added";

      card.innerHTML = `
        <header>
          <div>
            <h3>${escapeHtml(prayer.title)}</h3>
            <span class="prayer-meta">${metaLabel} ${formatDate(metaDate)}</span>
          </div>
          <div class="card-actions">
            ${
              type === "request"
                ? `<button class="icon-button" type="button" data-answer="${prayer.id}" aria-label="Mark answered" title="Mark answered"><i data-lucide="check-check"></i></button>`
                : ""
            }
            <button class="icon-button" type="button" data-delete="${prayer.id}" aria-label="Delete prayer" title="Delete prayer"><i data-lucide="trash-2"></i></button>
          </div>
        </header>
        ${note ? `<p>${escapeHtml(note)}</p>` : ""}
      `;
      fragment.appendChild(card);
    });

  container.replaceChildren(fragment);
  container.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => openAnswerDialog(button.dataset.answer));
  });
  container.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deletePrayer(button.dataset.delete));
  });
}

function calculateStreaks(days) {
  const unique = [...new Set(days)].sort();
  const daySet = new Set(unique);
  const today = startOfDay(new Date());
  const currentStart = daySet.has(toDateKey(today))
    ? today
    : daySet.has(toDateKey(new Date(today.getTime() - DAY_MS)))
      ? new Date(today.getTime() - DAY_MS)
      : null;

  let current = 0;
  if (currentStart) {
    for (let date = currentStart; daySet.has(toDateKey(date)); date = new Date(date.getTime() - DAY_MS)) {
      current += 1;
    }
  }

  let longest = 0;
  let run = 0;
  let previous = null;
  unique.forEach((key) => {
    const date = parseDateKey(key);
    if (previous && date.getTime() - previous.getTime() === DAY_MS) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = date;
  });

  return { current, longest };
}

function getStreakStatus(current, days) {
  if (hasPrayedToday()) {
    return current === 1
      ? "You prayed together today. A new streak has begun."
      : `You prayed together today. Your streak is now ${current} days.`;
  }

  const yesterday = toDateKey(new Date(startOfDay(new Date()).getTime() - DAY_MS));
  if (days.includes(yesterday)) {
    return `Your ${current}-day streak is waiting for today's prayer.`;
  }

  return "Mark today after you pray together to begin a new streak.";
}

function hasPrayedToday() {
  return state.prayerDays.some((item) => item.day === todayKey());
}

function loadDemoState() {
  const saved = JSON.parse(localStorage.getItem("prayer-streaks-demo") || "null");
  if (saved) {
    Object.assign(state, saved, { mode: "demo", session: { user: { email: "demo@local" } } });
    return;
  }

  state.session = { user: { email: "demo@local" } };
  state.household = {
    id: "demo-household",
    name: "Our Prayer Room",
    invite_code: "DEMO",
  };
  state.prayerDays = [];
  state.prayers = [
    makePrayer({
      title: "Pray for our daily rhythm together",
      note: "Ask God to help us make this a steady, joyful habit.",
    }),
  ];
  saveDemoState();
}

function saveDemoState() {
  localStorage.setItem(
    "prayer-streaks-demo",
    JSON.stringify({
      household: state.household,
      prayers: state.prayers,
      prayerDays: state.prayerDays,
    })
  );
}

function makePrayer(fields) {
  return {
    id: crypto.randomUUID(),
    household_id: state.household?.id || "demo-household",
    title: fields.title,
    note: fields.note || "",
    answered_note: fields.answered_note || null,
    answered_at: fields.answered_at || null,
    created_at: new Date().toISOString(),
  };
}

function uniqueByDay(days) {
  const seen = new Set();
  return days.filter((item) => {
    if (seen.has(item.day)) return false;
    seen.add(item.day);
    return true;
  });
}

function getInviteCode(household) {
  if (household?.invite_code) return household.invite_code;
  if (state.mode === "demo") return "DEMO";
  if (!household?.id) return "Missing code";
  return household.id.replaceAll("-", "").slice(0, 10).toUpperCase();
}

function normalizeHousehold(data) {
  const household = Array.isArray(data) ? data[0] || null : data;
  return household?.id ? household : null;
}

async function copyInviteCode() {
  const code = els.inviteCode.textContent.trim();
  try {
    await navigator.clipboard.writeText(code);
    els.copyInviteButton.title = "Copied";
  } catch (_error) {
    window.prompt("Invite code", code);
  }
}

function setBusy(isBusy) {
  state.busy = isBusy;
  document.querySelectorAll("button, input, textarea").forEach((control) => {
    const shouldKeepEnabled = control.matches("[data-close-dialog]");
    control.disabled = isBusy && !shouldKeepEnabled;
  });
  if (state.household) {
    els.markPrayedButton.disabled = isBusy || hasPrayedToday();
  }
}

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
