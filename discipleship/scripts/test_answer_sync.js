#!/usr/bin/env node
/**
 * DATA-002d answer sync checks: what moves between this device and the
 * account, and which edit wins. Synthetic values only.
 */
'use strict';

var sync = require('./answer-sync.js');

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

function memoryStorage() {
    var store = {};
    return {
        getItem: function (key) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
        setItem: function (key, value) { store[key] = String(value); },
        _raw: store
    };
}

function keys(obj) {
    return Object.keys(obj).sort().join(',');
}

// Keys that are this device's bookkeeping never sync.
assert('normal keys sync', sync.isSyncedKey('question-201-201-01-1'));
assert('"__" keys stay on the device', !sync.isSyncedKey('__gtSharedKeyMigrationV1'));
assert('empty key does not sync', !sync.isSyncedKey(''));
assert('arrays of numbers can sync', sync.isSyncableValue([0, 2]));
assert('arrays inside arrays cannot', !sync.isSyncableValue([[1]]));
assert('undefined cannot', !sync.isSyncableValue(undefined));

// Account mode.
assert('a device that never synced merges', sync.modeForAccount(null, 'a') === 'merge');
assert('the same account merges', sync.modeForAccount('a', 'a') === 'merge');
assert('a different account replaces', sync.modeForAccount('a', 'b') === 'replace');

// First sign-in on a device with answers and an empty account: everything goes up.
var plan = sync.reconcile({ q1: 'laptop answer', __gtFlag: true }, {}, {}, 'merge');
assert('first sign-in uploads existing answers', keys(plan.toRemote) === 'q1' && plan.toRemote.q1.v === 'laptop answer');
assert('untimed answers upload with time 0', plan.toRemote.q1.t === 0);
assert('bookkeeping keys are not uploaded', !('__gtFlag' in plan.toRemote));
assert('nothing comes down from an empty account', keys(plan.toLocal) === '' && plan.removeLocal.length === 0);

// A new device with nothing on it: everything comes down.
plan = sync.reconcile({}, {}, { q1: { v: 'laptop answer', t: 100 }, q2: { v: [1, 3], t: 50 } }, 'merge');
assert('a new device gets every answer', keys(plan.toLocal) === 'q1,q2' && plan.toLocal.q1.v === 'laptop answer');
assert('a new device keeps the account times', plan.toLocal.q1.t === 100);
assert('a new device uploads nothing', keys(plan.toRemote) === '');

// Both sides have the key.
plan = sync.reconcile({ q1: 'phone edit' }, { q1: 200 }, { q1: { v: 'laptop edit', t: 100 } }, 'merge');
assert('a newer edit on this device goes up', plan.toRemote.q1 && plan.toRemote.q1.v === 'phone edit' && keys(plan.toLocal) === '');
plan = sync.reconcile({ q1: 'phone edit' }, { q1: 100 }, { q1: { v: 'laptop edit', t: 200 } }, 'merge');
assert('a newer edit in the account comes down', plan.toLocal.q1 && plan.toLocal.q1.v === 'laptop edit' && keys(plan.toRemote) === '');
plan = sync.reconcile({ q1: 'old device answer' }, {}, { q1: { v: 'account answer', t: 0 } }, 'merge');
assert('an untimed device answer loses a tie to the account', plan.toLocal.q1 && plan.toLocal.q1.v === 'account answer');
plan = sync.reconcile({ q1: 'same' }, { q1: 100 }, { q1: { v: 'same', t: 100 } }, 'merge');
assert('matching values do nothing', keys(plan.toLocal) === '' && keys(plan.toRemote) === '');
plan = sync.reconcile({ q1: 'same' }, {}, { q1: { v: 'same', t: 100 } }, 'merge');
assert('matching values adopt the account time', plan.toLocal.q1 && plan.toLocal.q1.t === 100 && keys(plan.toRemote) === '');
plan = sync.reconcile({ q1: '' }, { q1: 300 }, { q1: { v: 'old text', t: 100 } }, 'merge');
assert('clearing an answer is an edit that goes up', plan.toRemote.q1 && plan.toRemote.q1.v === '');

// Merge never deletes.
plan = sync.reconcile({ q1: 'a' }, { q1: 5 }, { q2: { v: 'b', t: 6 } }, 'merge');
assert('merge keeps keys from both sides', plan.removeLocal.length === 0 && plan.toRemote.q1 && plan.toLocal.q2);

// Different account on this device: show that account's answers instead.
plan = sync.reconcile({ q1: 'first person', q3: 'first person only', __gtFlag: true },
    { q1: 900, q3: 900 }, { q1: { v: 'second person', t: 10 } }, 'replace');
assert('replace takes the account value even when older', plan.toLocal.q1 && plan.toLocal.q1.v === 'second person');
assert('replace removes the other person\'s answers from view', plan.removeLocal.join(',') === 'q3');
assert('replace never uploads this device\'s answers', keys(plan.toRemote) === '');
assert('replace leaves bookkeeping keys alone', plan.removeLocal.indexOf('__gtFlag') === -1);

// Malformed account entries are ignored.
plan = sync.reconcile({}, {}, { bad: 'not an entry', gone: { t: 5 }, __x: { v: 1, t: 1 } }, 'merge');
assert('malformed or private account entries are skipped', keys(plan.toLocal) === '');

// Tracker: stamps local edits, ignores values that came from the account.
var storage = memoryStorage();
var clock = 1000;
var tracker = sync.createTracker(storage, { answers: { q1: 'start' }, completion: {}, reading: {} }, function () { return clock; });
var heard = [];
tracker.onLocalChange(function (storeId, entries) { heard.push([storeId, entries]); });
var changed = tracker.noteSaved('answers', { q1: 'start' });
assert('saving unchanged values reports nothing', keys(changed) === '' && heard.length === 0);
clock = 2000;
changed = tracker.noteSaved('answers', { q1: 'start', q2: 'new', __gtFlag: true });
assert('a new value is stamped with the time', changed.q2 && changed.q2.t === 2000 && keys(changed) === 'q2');
assert('the listener hears local edits', heard.length === 1 && heard[0][0] === 'answers');
assert('edit times persist on the device', JSON.parse(storage.getItem(sync.META_KEY)).times.answers.q2 === 2000);
tracker.acceptRemote('answers', { q3: { v: 'from phone', t: 1500 } }, []);
heard = [];
changed = tracker.noteSaved('answers', { q1: 'start', q2: 'new', q3: 'from phone' });
assert('values from the account are not treated as new edits', keys(changed) === '' && heard.length === 0);
assert('values from the account keep the account time', tracker.times('answers').q3 === 1500);
tracker.acceptRemote('answers', {}, ['q3']);
assert('removed keys lose their time', !('q3' in tracker.times('answers')));
tracker.setLastUid('uid-a');
var reopened = sync.createTracker(storage, { answers: {}, completion: {}, reading: {} });
assert('the last account is remembered after reload', reopened.lastUid() === 'uid-a');
assert('edit times are remembered after reload', reopened.times('answers').q2 === 2000);
assert('an unknown store is ignored', keys(tracker.noteSaved('other', { x: 1 })) === '');

var broken = memoryStorage();
broken.setItem(sync.META_KEY, '{not json');
assert('unreadable bookkeeping starts fresh', sync.createTracker(broken, {}).lastUid() === null);

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
