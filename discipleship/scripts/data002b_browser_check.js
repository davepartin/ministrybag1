#!/usr/bin/env node
/**
 * DATA-002b browser check: sign-in with Google and with email and password,
 * password reset, sign-out, and staying signed in after reload. Runs against
 * the local Firebase Authentication emulator, never the real project, with
 * synthetic accounts only. Also checks that sign-in stays hidden without the
 * emulator flag (as on ministrybag.com) and that answers still save locally.
 *
 * Run from discipleship/ with the static server on 127.0.0.1:8765:
 *   firebase emulators:exec --only auth,firestore "node scripts/data002b_browser_check.js"
 */
'use strict';

var { chromium } = require('playwright');

var ORIGIN = process.env.DATA002B_BASE_URL || 'http://127.0.0.1:8765';
var WITH_AUTH = ORIGIN + '/index.html?auth=emulator';
var WITHOUT_AUTH = ORIGIN + '/index.html';
var EMULATOR = 'http://127.0.0.1:9099';
var PROJECT = 'growing-together-discipleship';
var EMAIL = 'learner.' + Date.now() + '@example.com';
var PASSWORD = 'synthetic-pass-123';
var SHOTS = process.env.DATA002B_SHOTS || '';

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

async function text(page, selector) {
    return (await page.locator(selector).textContent()) || '';
}

async function visible(page, selector) {
    return page.locator(selector).isVisible();
}

async function waitForHome(page) {
    await page.waitForSelector('#home-account:not([hidden])', { timeout: 20000 });
}

async function waitSignedIn(page) {
    await page.waitForSelector('#home-account-signout:not([hidden])', { timeout: 10000 });
}

async function waitSignedOut(page) {
    await page.waitForSelector('#home-account-signin:not([hidden])', { timeout: 10000 });
}

async function openDialog(page) {
    await page.click('#home-account-signin');
    await page.waitForSelector('#account-overlay.open');
}

async function statusText(page) {
    await page.waitForSelector('#account-status:not([hidden])', { timeout: 10000 });
    return text(page, '#account-status');
}

(async function () {
    var reset = await fetch(EMULATOR + '/emulator/v1/projects/' + PROJECT + '/accounts', { method: 'DELETE' });
    assert('the Authentication emulator is running', reset.ok, 'start it with firebase emulators:exec --only auth');

    var browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    var errors = [];

    // Without the flag, as on ministrybag.com: no sign-in, no Firebase download.
    var plain = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var firebaseRequests = 0;
    plain.on('request', function (req) { if (req.url().indexOf('gstatic.com/firebasejs') !== -1) firebaseRequests += 1; });
    plain.on('pageerror', function (err) { errors.push(String(err)); });
    await plain.goto(WITHOUT_AUTH, { waitUntil: 'load' });
    await plain.waitForTimeout(800);
    assert('sign-in is hidden without the emulator flag', !(await visible(plain, '#home-account')));
    assert('Firebase is not downloaded without the flag', firebaseRequests === 0, firebaseRequests + ' requests');
    await plain.close();

    var context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    var page = await context.newPage();
    page.on('pageerror', function (err) { errors.push(String(err)); });
    await page.goto(WITH_AUTH, { waitUntil: 'load' });
    await waitForHome(page);
    await waitSignedOut(page);
    assert('signed out: Sign in shows and Sign out is hidden',
        (await visible(page, '#home-account-signin')) && !(await visible(page, '#home-account-signout')));
    assert('home invites sign-in to keep answers on every device',
        (await text(page, '#home-account')).indexOf('Sign in to keep your answers on all your devices') !== -1);
    if (SHOTS) await page.screenshot({ path: SHOTS + '/home-signed-out-390.png', fullPage: true });

    // Dialog: focus, Escape, and focus returning to the button.
    await openDialog(page);
    assert('the dialog opens with the email field focused',
        await page.evaluate(function () { return document.activeElement.id === 'account-email'; }));
    assert('the dialog is titled Sign in', (await text(page, '#account-title')) === 'Sign in');
    if (SHOTS) await page.screenshot({ path: SHOTS + '/dialog-sign-in-390.png' });
    await page.keyboard.press('Escape');
    assert('Escape closes the dialog', !(await visible(page, '#account-overlay')));
    assert('focus returns to Sign in',
        await page.evaluate(function () { return document.activeElement.id === 'home-account-signin'; }));

    // Empty fields.
    await openDialog(page);
    await page.click('#account-submit');
    assert('an empty email asks for one', (await statusText(page)).indexOf('Type your email') !== -1);

    // Create an account.
    await page.click('#account-switch');
    assert('the switch changes the title to Create an account', (await text(page, '#account-title')) === 'Create an account');
    assert('Forgot password hides while creating an account', !(await visible(page, '#account-forgot')));
    assert('the password field asks for a new password',
        (await page.getAttribute('#account-password', 'autocomplete')) === 'new-password');
    await page.fill('#account-email', EMAIL);
    await page.fill('#account-password', '123');
    await page.click('#account-submit');
    assert('a short password names the 6-character minimum', (await statusText(page)).indexOf('6 characters') !== -1);
    await page.fill('#account-password', PASSWORD);
    await page.click('#account-submit');
    await waitSignedIn(page);
    assert('creating an account signs in and closes the dialog', !(await visible(page, '#account-overlay')));
    assert('home shows who is signed in', (await text(page, '#home-account-status')) === 'Signed in as ' + EMAIL);
    await page.waitForFunction(function () {
        return document.getElementById('home-account-scope').textContent.indexOf('save to your account') !== -1;
    }, null, { timeout: 10000 });
    assert('home says answers save to the account once connected', true);
    if (SHOTS) await page.screenshot({ path: SHOTS + '/home-signed-in-390.png', fullPage: true });

    // Stays signed in after reload.
    await page.reload({ waitUntil: 'load' });
    await waitForHome(page);
    await waitSignedIn(page);
    assert('still signed in after reload', (await text(page, '#home-account-status')) === 'Signed in as ' + EMAIL);

    // Sign out.
    await page.click('#home-account-signout');
    await waitSignedOut(page);
    assert('Sign out returns to Sign in', !(await visible(page, '#home-account-status')));

    // Creating the same account again.
    await openDialog(page);
    await page.click('#account-switch');
    await page.fill('#account-email', EMAIL);
    await page.fill('#account-password', PASSWORD);
    await page.click('#account-submit');
    assert('an email already in use says to sign in instead', (await statusText(page)).indexOf('already uses that email') !== -1);
    await page.click('#account-switch');

    // Wrong password, then the right one.
    await page.fill('#account-password', 'not-the-password');
    await page.click('#account-submit');
    assert('a wrong password says they do not match', (await statusText(page)).indexOf('do not match') !== -1);
    await page.fill('#account-password', PASSWORD);
    await page.click('#account-submit');
    await waitSignedIn(page);
    assert('the right password signs in', (await text(page, '#home-account-status')) === 'Signed in as ' + EMAIL);
    await page.click('#home-account-signout');
    await waitSignedOut(page);

    // Forgot password.
    await openDialog(page);
    await page.fill('#account-email', '');
    await page.click('#account-forgot');
    assert('Forgot password with no email asks for one', (await statusText(page)).indexOf('Type your email above') !== -1);
    await page.fill('#account-email', EMAIL);
    await page.click('#account-forgot');
    await page.waitForFunction(function () {
        return document.getElementById('account-status').dataset.kind === 'info';
    }, null, { timeout: 10000 });
    assert('Forgot password confirms without saying whether the account exists',
        (await text(page, '#account-status')).indexOf('If an account uses that email') !== -1);
    if (SHOTS) await page.screenshot({ path: SHOTS + '/dialog-reset-390.png' });
    var codes = await (await fetch(EMULATOR + '/emulator/v1/projects/' + PROJECT + '/oobCodes')).json();
    assert('a password reset email was sent',
        (codes.oobCodes || []).some(function (c) { return c.email === EMAIL && c.requestType === 'PASSWORD_RESET'; }));
    await page.click('#account-cancel');

    // Google, through the emulator's stand-in account chooser.
    await openDialog(page);
    var popupPromise = page.waitForEvent('popup');
    await page.click('#account-google');
    var popup = await popupPromise;
    try {
        await popup.waitForLoadState('load');
        // The emulator's chooser sometimes ignores a click made before its
        // script is ready, so click again until the account form shows.
        for (var tries = 0; tries < 5; tries += 1) {
            await popup.getByText('Add new account').click();
            try {
                await popup.locator('#email-input').waitFor({ state: 'visible', timeout: 2000 });
                break;
            } catch (notYet) {}
        }
        await popup.locator('#email-input').fill('google.learner@example.com');
        await popup.locator('#display-name-input').fill('Google Learner');
        await popup.getByText('Sign in with Google.com').click();
        await waitSignedIn(page);
        assert('Google sign-in signs in and closes the dialog',
            !(await visible(page, '#account-overlay')) &&
                (await text(page, '#home-account-status')) === 'Signed in as google.learner@example.com');
    } catch (err) {
        assert('Google sign-in signs in and closes the dialog', false, String(err).split('\n')[0]);
    }

    // Answers still save on the device and survive sign-in.
    await page.goto(WITH_AUTH + '#203-8', { waitUntil: 'load' });
    await page.waitForSelector('#question-203-203-08-invested', { timeout: 20000 });
    await page.fill('#question-203-203-08-invested', 'Synthetic answer for DATA-002b');
    await page.waitForTimeout(1500);
    var stored = await page.evaluate(function () { return localStorage.getItem('christianFoundationsResponses') || ''; });
    assert('answers still save in this browser too while signed in', stored.indexOf('Synthetic answer for DATA-002b') !== -1);

    assert('no page errors', errors.length === 0, errors.join(' | '));

    await browser.close();
    console.log('\n' + passed + ' passed, ' + failed + ' failed');
    process.exit(failed ? 1 : 0);
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
