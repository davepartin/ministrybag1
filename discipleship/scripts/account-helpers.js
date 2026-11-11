/**
 * Growing Together sign-in helpers for DATA-002b.
 * Works in the browser (global GrowingTogetherAccountHelpers) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * modeFor decides where sign-in appears. It runs only on the Firebase-hosted
 * addresses, so ministrybag.com/discipleship stays as it is until DATA-002d.
 * On localhost it runs only with ?auth=emulator, against the local emulator.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherAccountHelpers = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var PROJECT_ID = 'growing-together-discipleship';

    var LIVE_HOSTS = [
        'growingtogetherdiscipleship.com',
        'www.growingtogetherdiscipleship.com'
    ];

    // The project's own web.app and firebaseapp.com addresses, including
    // preview channels such as growing-together-discipleship--name-abc123.web.app.
    var FIREBASE_HOST = /^growing-together-discipleship(--[a-z0-9-]+)?\.(web\.app|firebaseapp\.com)$/;

    var LOCAL_HOSTS = ['localhost', '127.0.0.1'];

    function modeFor(hostname, search) {
        var host = String(hostname || '').toLowerCase();
        if (LIVE_HOSTS.indexOf(host) !== -1) return 'live';
        if (FIREBASE_HOST.test(host)) return 'live';
        if (LOCAL_HOSTS.indexOf(host) !== -1) {
            var params = new URLSearchParams(search || '');
            if (params.get('auth') === 'emulator') return 'emulator';
        }
        return null;
    }

    var MESSAGES = {
        'auth/invalid-credential': 'That email and password do not match. Try again, or tap Forgot password.',
        'auth/wrong-password': 'That email and password do not match. Try again, or tap Forgot password.',
        'auth/user-not-found': 'That email and password do not match. Try again, or tap Forgot password.',
        'auth/invalid-email': 'Check the email address and try again.',
        'auth/missing-email': 'Type your email address.',
        'auth/missing-password': 'Type your password.',
        'auth/weak-password': 'Choose a password with at least 6 characters.',
        'auth/password-does-not-meet-requirements': 'Choose a password with at least 6 characters.',
        'auth/email-already-in-use': 'An account already uses that email. Sign in instead, or tap Forgot password.',
        'auth/account-exists-with-different-credential': 'An account already uses that email. Sign in with your email and password instead.',
        'auth/user-disabled': 'This account has been turned off. Contact Growing Together for help.',
        'auth/too-many-requests': 'Too many tries. Wait a few minutes and try again.',
        'auth/network-request-failed': 'Could not reach the sign-in service. Check your connection and try again.',
        'auth/popup-blocked': 'Your browser blocked the Google window. Allow pop-ups for this site and try again.',
        'auth/popup-closed-by-user': 'The Google window was closed before sign-in finished.',
        'auth/cancelled-popup-request': 'The Google window was closed before sign-in finished.',
        'auth/unauthorized-domain': 'Sign-in is not available at this address yet.',
        'auth/operation-not-allowed': 'This way of signing in is not turned on yet.'
    };

    var FALLBACK = 'Something went wrong with sign-in. Try again in a moment.';

    function messageFor(code) {
        return MESSAGES[code] || FALLBACK;
    }

    return {
        PROJECT_ID: PROJECT_ID,
        modeFor: modeFor,
        messageFor: messageFor,
        FALLBACK: FALLBACK
    };
}));
