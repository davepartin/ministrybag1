#!/usr/bin/env node
/**
 * DATA-002d browser check: answers follow a signed-in person between
 * devices. Two separate browsers stand in for a laptop and a phone. Runs
 * against the local Auth and Firestore emulators with synthetic accounts and
 * answers only, never the real project.
 *
 * Run from discipleship/ with the static server on 127.0.0.1:8765
 * (the Firestore emulator needs Java):
 *   firebase emulators:exec --only auth,firestore "node scripts/data002d_browser_check.js"
 */
'use strict';

var { chromium } = require('playwright');

var ORIGIN = process.env.DATA002D_BASE_URL || 'http://127.0.0.1:8765';
var HOME = ORIGIN + '/index.html?auth=emulator';
var LESSON = HOME + '#201-1';
var PROJECT = 'growing-together-discipleship';
var AUTH = 'http://127.0.0.1:9099';
var FIRESTORE = 'http://127.0.0.1:8080';
var Q1 = '#question-201-201-01-1';
var Q2 = '#question-201-201-01-2';
var EMAIL_A = 'laptop.phone.' + Date.now() + '@example.com';
var EMAIL_B = 'second.person.' + Date.now() + '@example.com';
var PASSWORD = 'synthetic-pass-123';
var WAIT = { timeout: 20000 };

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

async function openDevice(browser, width, errors) {
    var context = await browser.newContext({ viewport: { width: width, height: 844 } });
    var page = await context.newPage();
    page.on('pageerror', function (err) { errors.push(String(err)); });
    return page;
}

async function goHome(page) {
    await page.goto(HOME, { waitUntil: 'load' });
    await page.waitForSelector('#home-account:not([hidden])', WAIT);
}

async function goLesson(page) {
    await page.goto(LESSON, { waitUntil: 'load' });
    await page.waitForSelector(Q1, WAIT);
}

async function signIn(page, email, create) {
    await goHome(page);
    await page.waitForSelector('#home-account-signin:not([hidden])', WAIT);
    await page.click('#home-account-signin');
    if (create) await page.click('#account-switch');
    await page.fill('#account-email', email);
    await page.fill('#account-password', PASSWORD);
    await page.click('#account-submit');
    await page.waitForSelector('#home-account-signout:not([hidden])', WAIT);
}

async function signOut(page) {
    await goHome(page);
    await page.waitForSelector('#home-account-signout:not([hidden])', WAIT);
    await page.click('#home-account-signout');
    await page.waitForSelector('#home-account-signin:not([hidden])', WAIT);
}

async function waitForScope(page, words) {
    await page.waitForFunction(function (w) {
        var el = document.getElementById('home-account-scope');
        return el && el.textContent.indexOf(w) !== -1;
    }, words, WAIT);
}

async function waitForValue(page, selector, value) {
    try {
        await page.waitForFunction(function (args) {
            var el = document.querySelector(args[0]);
            return el && el.value === args[1];
        }, [selector, value], WAIT);
        return true;
    } catch (err) {
        return false;
    }
}

async function storedAnswer(page, key) {
    return page.evaluate(function (k) {
        var data = JSON.parse(localStorage.getItem('christianFoundationsResponses') || '{}');
        return data[k];
    }, key);
}

// Reads the account copy directly, the way the emulator lets an admin do.
async function accountAnswers(uid) {
    var res = await fetch(FIRESTORE + '/v1/projects/' + PROJECT + '/databases/(default)/documents/users/' +
        uid + '/stores/answers', { headers: { Authorization: 'Bearer owner' } });
    if (res.status !== 200) return {};
    var body = await res.json();
    var fields = (body.fields && body.fields.entries && body.fields.entries.mapValue.fields) || {};
    var out = {};
    Object.keys(fields).forEach(function (key) {
        var v = fields[key].mapValue.fields.v;
        out[key] = v.stringValue !== undefined ? v.stringValue : v;
    });
    return out;
}

async function uidFor(email) {
    var res = await fetch(AUTH + '/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=emulator-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: PASSWORD, returnSecureToken: true })
    });
    return (await res.json()).localId;
}

(async function () {
    await fetch(AUTH + '/emulator/v1/projects/' + PROJECT + '/accounts', { method: 'DELETE' });
    await fetch(FIRESTORE + '/emulator/v1/projects/' + PROJECT + '/databases/(default)/documents', { method: 'DELETE' });

    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    var errors = [];
    var laptop = await openDevice(browser, 1280, errors);
    var phone = await openDevice(browser, 390, errors);

    // Signed out, the home screen invites sign-in.
    await goHome(laptop);
    await waitForScope(laptop, 'Sign in to keep your answers');
    assert('signed out, home invites sign-in to keep answers everywhere', true);

    // Dave's case: an answer typed on the laptop before signing in.
    await goLesson(laptop);
    await laptop.fill(Q1, 'Laptop answer typed before sign-in');
    await laptop.waitForTimeout(500);
    await signIn(laptop, EMAIL_A, true);
    await waitForScope(laptop, 'save to your account');
    assert('signed in, home says answers save to the account', true);
    var uidA = await uidFor(EMAIL_A);
    await laptop.waitForTimeout(3000);
    var account = await accountAnswers(uidA);
    assert('the laptop answer moved into the account on first sign-in',
        account['question-201-201-01-1'] === 'Laptop answer typed before sign-in', JSON.stringify(account));

    // The phone signs in and sees it.
    await signIn(phone, EMAIL_A, false);
    await goLesson(phone);
    assert('the phone shows the laptop answer after signing in',
        await waitForValue(phone, Q1, 'Laptop answer typed before sign-in'));
    assert('the phone also saved it on the phone',
        (await storedAnswer(phone, 'question-201-201-01-1')) === 'Laptop answer typed before sign-in');

    // Live: an answer typed on the phone shows on the open laptop page.
    await goLesson(laptop);
    await phone.fill(Q2, 'Phone answer');
    assert('a phone answer shows on the open laptop page without reloading',
        await waitForValue(laptop, Q2, 'Phone answer'));

    // The most recent edit wins, even with the cursor still in the field.
    await laptop.fill(Q1, 'Laptop edit, newest');
    assert('a newer laptop edit reaches the phone', await waitForValue(phone, Q1, 'Laptop edit, newest'));
    await phone.waitForTimeout(5500);
    await phone.fill(Q1, 'Phone edit, newest');
    assert('a newer phone edit reaches the laptop', await waitForValue(laptop, Q1, 'Phone edit, newest'));

    // Typing is not interrupted by an arriving edit.
    await phone.click(Q2);
    await phone.keyboard.type(' still typing');
    await laptop.fill(Q2, 'Laptop changed this meanwhile');
    await laptop.locator(Q2).blur();
    await phone.waitForTimeout(4000);
    assert('an arriving edit does not overwrite what is being typed',
        (await phone.inputValue(Q2)) === 'Phone answer still typing');
    assert('the text being typed then wins on the other device too',
        await waitForValue(laptop, Q2, 'Phone answer still typing'));

    // Edits while offline catch up on the next visit.
    await phone.context().setOffline(true);
    await phone.fill(Q1, 'Edited on the phone while offline');
    await phone.waitForTimeout(2500);
    await phone.context().setOffline(false);
    await phone.reload({ waitUntil: 'load' });
    await phone.waitForSelector(Q1, WAIT);
    assert('an offline phone edit reaches the laptop once back online',
        await waitForValue(laptop, Q1, 'Edited on the phone while offline'));

    // Signing out keeps the answers on that device.
    await signOut(phone);
    await goLesson(phone);
    assert('after sign-out, the phone still shows its answers',
        (await phone.inputValue(Q1)) === 'Edited on the phone while offline');

    // A second person signs in on the same phone: they see their own (empty) answers.
    await signIn(phone, EMAIL_B, true);
    await goLesson(phone);
    assert('a different account on the phone does not see the first person\'s answers',
        await waitForValue(phone, Q1, ''));
    var uidB = await uidFor(EMAIL_B);
    await phone.waitForTimeout(2500);
    var accountB = await accountAnswers(uidB);
    assert('the first person\'s answers did not go into the second account',
        Object.keys(accountB).length === 0, JSON.stringify(accountB));
    var kept = await phone.evaluate(function () {
        return JSON.parse(localStorage.getItem('growingTogetherSyncSwitchBackup') || '{}');
    });
    assert('the phone kept a copy before switching accounts',
        kept.stores && kept.stores.answers && kept.stores.answers['question-201-201-01-1'] === 'Edited on the phone while offline');

    // The first person comes back on the phone: their answers return.
    await signOut(phone);
    await signIn(phone, EMAIL_A, false);
    await goLesson(phone);
    assert('the first person sees their answers again after signing back in',
        await waitForValue(phone, Q1, 'Edited on the phone while offline'));

    // Lesson check marks sync too.
    await laptop.evaluate(function () {
        var cb = document.getElementById('session-complete-201-1');
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    var synced = false;
    try {
        await phone.waitForFunction(function () {
            var data = JSON.parse(localStorage.getItem('foundationsCompletionData') || '{}');
            return data['complete-201-1'] === true;
        }, null, WAIT);
        synced = true;
    } catch (err) {}
    assert('a lesson check mark on the laptop reaches the phone', synced);

    assert('no page errors', errors.length === 0, errors.join(' | '));

    await browser.close();
    console.log('\n' + passed + ' passed, ' + failed + ' failed');
    process.exit(failed ? 1 : 0);
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
