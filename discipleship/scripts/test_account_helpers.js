#!/usr/bin/env node
/**
 * DATA-002b sign-in helper checks: where sign-in appears, and the words
 * people see when it fails. Uses no real accounts.
 */
'use strict';

var helpers = require('./account-helpers.js');

var failed = 0;
var passed = 0;

function assert(name, condition, detail) {
    if (condition) {
        passed += 1;
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

var live = [
    'growingtogetherdiscipleship.com',
    'www.growingtogetherdiscipleship.com',
    'growing-together-discipleship.web.app',
    'growing-together-discipleship.firebaseapp.com',
    'growing-together-discipleship--data-002b-kxs0omav.web.app',
    'GrowingTogetherDiscipleship.com'
];
live.forEach(function (host) {
    assert('sign-in runs on ' + host, helpers.modeFor(host, '') === 'live');
});

var off = [
    ['ministrybag.com', ''],
    ['www.ministrybag.com', ''],
    ['ministrybag.com', '?auth=emulator'],
    ['davepartin.github.io', ''],
    ['other-project.web.app', ''],
    ['growing-together-discipleship.web.app.example.com', ''],
    ['evilgrowing-together-discipleship.web.app', ''],
    ['localhost', ''],
    ['127.0.0.1', ''],
    ['127.0.0.1', '?auth=live'],
    ['', '']
];
off.forEach(function (pair) {
    assert('sign-in stays off on ' + (pair[0] || '(blank)') + pair[1], helpers.modeFor(pair[0], pair[1]) === null);
});

assert('localhost uses the emulator only when asked', helpers.modeFor('localhost', '?auth=emulator') === 'emulator');
assert('127.0.0.1 uses the emulator only when asked', helpers.modeFor('127.0.0.1', '?x=1&auth=emulator') === 'emulator');

assert(
    'a wrong password does not say whether the email has an account',
    helpers.messageFor('auth/invalid-credential') === helpers.messageFor('auth/user-not-found') &&
        helpers.messageFor('auth/user-not-found') === helpers.messageFor('auth/wrong-password')
);
assert('weak password names the 6-character minimum', /6 characters/.test(helpers.messageFor('auth/weak-password')));
assert('a blocked Google window says to allow pop-ups', /pop-ups/.test(helpers.messageFor('auth/popup-blocked')));
assert('unknown errors get the plain fallback', helpers.messageFor('auth/some-new-code') === helpers.FALLBACK);
assert('a missing code gets the plain fallback', helpers.messageFor(undefined) === helpers.FALLBACK);

var allMessages = Object.keys({
    'auth/invalid-credential': 1, 'auth/invalid-email': 1, 'auth/weak-password': 1,
    'auth/email-already-in-use': 1, 'auth/too-many-requests': 1, 'auth/network-request-failed': 1,
    'auth/popup-blocked': 1, 'auth/popup-closed-by-user': 1
}).map(helpers.messageFor).concat([helpers.FALLBACK]);
assert('no message uses an em dash', allMessages.every(function (m) { return m.indexOf('—') === -1; }));
assert('no message shows a raw error code', allMessages.every(function (m) { return m.indexOf('auth/') === -1; }));

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
