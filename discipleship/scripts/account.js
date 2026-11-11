/**
 * Growing Together sign-in (DATA-002b) and answer sync (DATA-002d).
 *
 * Sign-in: Google, and email and password with password reset, through
 * Firebase Authentication.
 *
 * Sync: while someone is signed in, answers, lesson check marks and reading
 * notes also save to their own Firestore documents
 * (users/{uid}/stores/{storeId}), and edits from their other devices arrive
 * as they happen. The browser copy stays the first place everything saves.
 * scripts/answer-sync.js decides what moves; firestore.rules (DATA-002c)
 * keeps each person's documents private to them.
 *
 * The Firebase web config below is public by design: it only names the project.
 * People's data is protected by the Firestore rules and by the authorized
 * domains in Authentication, not by hiding this config.
 */
const helpers = window.GrowingTogetherAccountHelpers;
const mode = helpers ? helpers.modeFor(location.hostname, location.search) : null;

const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/13.1.0/';

const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCDQThSVqvMIItDpzZxTanKlV16s6YwmmE',
    authDomain: 'growing-together-discipleship.firebaseapp.com',
    projectId: 'growing-together-discipleship',
    storageBucket: 'growing-together-discipleship.firebasestorage.app',
    messagingSenderId: '1081223639793',
    appId: '1:1081223639793:web:1b336388cab43d9067af50'
};

const EMULATOR_URL = 'http://127.0.0.1:9099';
const FIRESTORE_EMULATOR = { host: '127.0.0.1', port: 8080 };

// Typing saves on every keystroke, so pushes wait for a short pause.
const PUSH_DELAY_MS = 1500;

const SCOPE_TEXT = {
    signedOut: 'Sign in to keep your answers on all your devices.',
    connecting: 'Connecting to your account.',
    synced: 'Your answers save to your account and show on every device where you sign in.',
    deviceOnly: 'Your answers save on this device.',
    problem: 'Could not reach your account just now. Your answers are still saved on this device.'
};

const sync = window.GrowingTogetherAnswerSync;
const appHost = window.GrowingTogetherApp;

const el = (id) => document.getElementById(id);

const home = {
    wrap: el('home-account'),
    status: el('home-account-status'),
    signIn: el('home-account-signin'),
    signOut: el('home-account-signout'),
    scope: el('home-account-scope')
};

const dialog = {
    overlay: el('account-overlay'),
    box: el('account-dialog'),
    title: el('account-title'),
    google: el('account-google'),
    googleText: el('account-google-text'),
    form: el('account-form'),
    email: el('account-email'),
    password: el('account-password'),
    forgot: el('account-forgot'),
    status: el('account-status'),
    cancel: el('account-cancel'),
    submit: el('account-submit'),
    switchMode: el('account-switch')
};

let auth = null;
let api = null;
let creating = false;
let busy = false;
let lastFocus = null;

let fs = null;
let db = null;
let syncUid = null;
let unsubscribers = [];
let pending = {};
let pushTimer = null;

if (mode && home.wrap && dialog.overlay) {
    start().catch((error) => {
        console.warn('Sign-in could not start.', error);
        showHomeStatus('Sign-in is not available right now.');
    });
}

async function start() {
    const [appModule, authModule, firestoreModule] = await Promise.all([
        import(FIREBASE_SDK + 'firebase-app.js'),
        import(FIREBASE_SDK + 'firebase-auth.js'),
        import(FIREBASE_SDK + 'firebase-firestore.js')
    ]);
    api = authModule;
    fs = firestoreModule;
    const app = appModule.initializeApp(FIREBASE_CONFIG);
    auth = api.getAuth(app);
    db = fs.getFirestore(app);
    if (mode === 'emulator') {
        api.connectAuthEmulator(auth, EMULATOR_URL, { disableWarnings: true });
        fs.connectFirestoreEmulator(db, FIRESTORE_EMULATOR.host, FIRESTORE_EMULATOR.port);
    }
    wireUp();
    home.wrap.hidden = false;
    api.onAuthStateChanged(auth, renderSignedIn);
}

function wireUp() {
    home.signIn.addEventListener('click', openDialog);
    home.signOut.addEventListener('click', onSignOut);
    dialog.cancel.addEventListener('click', closeDialog);
    dialog.google.addEventListener('click', onGoogle);
    dialog.forgot.addEventListener('click', onForgot);
    dialog.switchMode.addEventListener('click', () => setCreating(!creating));
    dialog.form.addEventListener('submit', (event) => {
        event.preventDefault();
        onSubmit();
    });
    dialog.overlay.addEventListener('click', (event) => {
        if (event.target === dialog.overlay) closeDialog();
    });
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('pagehide', flushPushes);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushPushes();
    });
}

function renderSignedIn(user) {
    if (user) {
        const who = user.email || user.displayName || 'your account';
        showHomeStatus('Signed in as ' + who);
        home.signIn.hidden = true;
        home.signOut.hidden = false;
        startSync(user.uid);
    } else {
        stopSync();
        showHomeStatus('');
        showScope(SCOPE_TEXT.signedOut);
        home.signIn.hidden = false;
        home.signOut.hidden = true;
    }
}

function showScope(text) {
    if (home.scope) home.scope.textContent = text;
}

function canSync() {
    return !!(fs && db && sync && appHost && appHost.syncTracker);
}

function storeRef(uid, storeId) {
    return fs.doc(db, 'users', uid, 'stores', storeId);
}

function startSync(uid) {
    stopSync();
    if (!canSync()) {
        showScope(SCOPE_TEXT.deviceOnly);
        return;
    }
    const tracker = appHost.syncTracker;
    const storeIds = sync.STORE_IDS.filter((id) => appHost.storeWritable(id));
    if (!storeIds.length) {
        showScope(SCOPE_TEXT.deviceOnly);
        return;
    }
    showScope(SCOPE_TEXT.connecting);
    // A device that last synced with someone else shows this account's
    // answers instead, after keeping a copy of what was here.
    const firstMode = sync.modeForAccount(tracker.lastUid(), uid);
    if (firstMode === 'replace') keepCopyBeforeSwitch(tracker.lastUid());
    syncUid = uid;
    tracker.onLocalChange(queuePush);
    const seen = new Set();
    storeIds.forEach((storeId) => {
        let first = true;
        const unsubscribe = fs.onSnapshot(storeRef(uid, storeId), (snap) => {
            if (syncUid !== uid) return;
            const data = snap.exists() ? snap.data() : {};
            const plan = sync.reconcile(
                appHost.storeMemory(storeId),
                tracker.times(storeId),
                data.entries,
                first ? firstMode : 'merge'
            );
            first = false;
            if (Object.keys(plan.toLocal).length || plan.removeLocal.length) {
                appHost.applySyncedValues(storeId, plan.toLocal, plan.removeLocal);
            }
            if (Object.keys(plan.toRemote).length) queuePush(storeId, plan.toRemote);
            seen.add(storeId);
            if (seen.size === storeIds.length) {
                tracker.setLastUid(uid);
                showScope(SCOPE_TEXT.synced);
            }
        }, onSyncProblem);
        unsubscribers.push(unsubscribe);
    });
}

function stopSync() {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
    if (appHost && appHost.syncTracker) appHost.syncTracker.onLocalChange(null);
    clearTimeout(pushTimer);
    pending = {};
    syncUid = null;
}

function queuePush(storeId, entries) {
    if (!syncUid) return;
    pending[storeId] = Object.assign(pending[storeId] || {}, entries);
    clearTimeout(pushTimer);
    pushTimer = setTimeout(flushPushes, PUSH_DELAY_MS);
}

function flushPushes() {
    clearTimeout(pushTimer);
    if (!syncUid) return Promise.resolve();
    const uid = syncUid;
    const batch = pending;
    pending = {};
    return Promise.all(Object.keys(batch).map((storeId) =>
        fs.setDoc(storeRef(uid, storeId), {
            entries: batch[storeId],
            updatedAt: fs.serverTimestamp()
        }, { merge: true }).catch(onSyncProblem)
    ));
}

function onSyncProblem(error) {
    console.warn('Answer sync problem.', error && error.code);
    showScope(SCOPE_TEXT.problem);
}

function keepCopyBeforeSwitch(fromUid) {
    try {
        const stores = {};
        sync.STORE_IDS.forEach((id) => { stores[id] = appHost.storeMemory(id); });
        localStorage.setItem(sync.SWITCH_BACKUP_KEY, JSON.stringify({
            savedAt: new Date().toISOString(),
            fromAccount: fromUid,
            stores: stores
        }));
    } catch (error) {
        console.warn('Could not keep a copy before switching accounts.', error);
    }
}

function showHomeStatus(text) {
    home.status.textContent = text;
    home.status.hidden = !text;
}

function isOpen() {
    return !dialog.overlay.hidden;
}

function openDialog() {
    lastFocus = document.activeElement;
    setCreating(false);
    dialog.password.value = '';
    showStatus('');
    dialog.overlay.hidden = false;
    dialog.overlay.classList.add('open');
    document.body.classList.add('account-open');
    dialog.email.focus();
}

function closeDialog() {
    dialog.overlay.classList.remove('open');
    dialog.overlay.hidden = true;
    document.body.classList.remove('account-open');
    dialog.password.value = '';
    showStatus('');
    if (lastFocus && typeof lastFocus.focus === 'function' && !lastFocus.hidden) {
        lastFocus.focus();
    } else if (!home.signOut.hidden) {
        home.signOut.focus();
    }
    lastFocus = null;
}

function setCreating(value) {
    creating = value;
    dialog.title.textContent = creating ? 'Create an account' : 'Sign in';
    dialog.submit.textContent = creating ? 'Create account' : 'Sign in';
    dialog.googleText.textContent = creating ? 'Sign up with Google' : 'Sign in with Google';
    dialog.switchMode.textContent = creating
        ? 'Already have an account? Sign in'
        : 'New here? Create an account';
    dialog.password.autocomplete = creating ? 'new-password' : 'current-password';
    dialog.forgot.hidden = creating;
    showStatus('');
}

function showStatus(text, kind) {
    dialog.status.textContent = text;
    dialog.status.hidden = !text;
    dialog.status.dataset.kind = kind || 'error';
}

function setBusy(value) {
    busy = value;
    [dialog.google, dialog.submit, dialog.forgot, dialog.switchMode].forEach((button) => {
        button.disabled = value;
    });
}

async function run(task) {
    if (busy) return;
    setBusy(true);
    try {
        await task();
    } catch (error) {
        showStatus(helpers.messageFor(error && error.code));
    } finally {
        setBusy(false);
    }
}

function onSubmit() {
    const email = dialog.email.value.trim();
    const password = dialog.password.value;
    if (!email) return showStatus(helpers.messageFor('auth/missing-email'));
    if (!password) return showStatus(helpers.messageFor('auth/missing-password'));
    run(async () => {
        if (creating) {
            await api.createUserWithEmailAndPassword(auth, email, password);
        } else {
            await api.signInWithEmailAndPassword(auth, email, password);
        }
        closeDialog();
    });
}

function onGoogle() {
    run(async () => {
        const provider = new api.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await api.signInWithPopup(auth, provider);
        closeDialog();
    });
}

function onForgot() {
    const email = dialog.email.value.trim();
    if (!email) {
        showStatus('Type your email above, then tap Forgot password again.');
        dialog.email.focus();
        return;
    }
    run(async () => {
        await api.sendPasswordResetEmail(auth, email);
        showStatus('If an account uses that email, a link to reset the password is on its way. Check your inbox.', 'info');
    });
}

async function onSignOut() {
    try {
        await flushPushes();
        stopSync();
        await api.signOut(auth);
        home.signIn.focus();
    } catch (error) {
        showHomeStatus(helpers.messageFor(error && error.code));
    }
}

function focusables() {
    return Array.from(dialog.box.querySelectorAll('button, input'))
        .filter((node) => !node.disabled && !node.hidden && node.offsetParent !== null);
}

function onKeydown(event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
    }
    if (event.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
}
