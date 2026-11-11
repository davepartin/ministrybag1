/**
 * Growing Together sign-in for DATA-002b: Google, and email and password with
 * password reset, through Firebase Authentication.
 *
 * Sign-in only. Answers still save in this browser, and nothing here reads or
 * writes them; private per-person answers come in DATA-002c and 002d.
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

const el = (id) => document.getElementById(id);

const home = {
    wrap: el('home-account'),
    status: el('home-account-status'),
    signIn: el('home-account-signin'),
    signOut: el('home-account-signout')
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

if (mode && home.wrap && dialog.overlay) {
    start().catch((error) => {
        console.warn('Sign-in could not start.', error);
        showHomeStatus('Sign-in is not available right now.');
    });
}

async function start() {
    const [appModule, authModule] = await Promise.all([
        import(FIREBASE_SDK + 'firebase-app.js'),
        import(FIREBASE_SDK + 'firebase-auth.js')
    ]);
    api = authModule;
    const app = appModule.initializeApp(FIREBASE_CONFIG);
    auth = api.getAuth(app);
    if (mode === 'emulator') {
        api.connectAuthEmulator(auth, EMULATOR_URL, { disableWarnings: true });
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
}

function renderSignedIn(user) {
    if (user) {
        const who = user.email || user.displayName || 'your account';
        showHomeStatus('Signed in as ' + who);
        home.signIn.hidden = true;
        home.signOut.hidden = false;
    } else {
        showHomeStatus('');
        home.signIn.hidden = false;
        home.signOut.hidden = true;
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
