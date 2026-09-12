#!/usr/bin/env node
/**
 * ENG-005 synthetic save-feedback checks.
 * Uses only synthetic strings. Never print real learner answers.
 */
'use strict';

var feedback = require('./save-feedback.js');

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

function memoryStorage(initial) {
    var store = {};
    if (initial !== undefined) {
        store.value = typeof initial === 'string' ? initial : JSON.stringify(initial);
    }
    return {
        getItem: function () {
            return Object.prototype.hasOwnProperty.call(store, 'value') ? store.value : null;
        },
        setItem: function (key, value) {
            store.value = String(value);
        },
        _raw: store
    };
}

assert(
    'status words are the three required labels',
    feedback.STATUS.SAVING === 'Saving' &&
        feedback.STATUS.SAVED === 'Saved' &&
        feedback.STATUS.COULD_NOT_SAVE === 'Could not save'
);

var inputOnly = feedback.statusAfterAttempt({ phase: 'saving' });
assert('an input or timer phase is Saving, not Saved', inputOnly.status === 'Saving' && inputOnly.wrote === false);

var failedWrite = feedback.statusAfterAttempt({ wrote: false, writeError: 'quota' });
assert(
    'a failed write is Could not save, not Saved',
    failedWrite.status === 'Could not save' && failedWrite.reason === 'quota'
);

var guarded = feedback.statusAfterAttempt({
    wrote: false,
    guarded: true,
    loadReason: 'malformed'
});
assert(
    'a failed-load guard is Could not save with the load reason',
    guarded.status === 'Could not save' && guarded.reason === 'malformed'
);

var saved = feedback.statusAfterAttempt({ wrote: true });
assert('Saved is returned only after wrote:true', saved.status === 'Saved' && saved.reason === 'written');

assert(
    'valid object load is writable',
    feedback.isWritableLoad({ available: true, malformed: false, data: { 'question-101-1-1': 'SYN-keep' } }) === true
);
assert(
    'malformed load is not writable',
    feedback.isWritableLoad({ available: true, malformed: true, data: {} }) === false
);
assert(
    'unavailable load is not writable',
    feedback.isWritableLoad({ available: false, malformed: false, data: {} }) === false
);
assert(
    'non-object responses are not writable',
    feedback.isWritableLoad({ available: true, malformed: false, responses: ['nope'] }) === false
);
assert('malformed classify', feedback.classifyLoad({ available: true, malformed: true }) === 'malformed');
assert('unavailable classify', feedback.classifyLoad({ available: false, malformed: false }) === 'unavailable');

var answersFail = feedback.detailFor('answers', 'Could not save', 'malformed');
assert(
    'malformed answers detail keeps the original copy and warns about reload',
    answersFail.indexOf('not replacing them') !== -1 &&
        answersFail.indexOf('could be lost if you reload') !== -1
);

var quotaDetail = feedback.detailFor('answers', 'Could not save', 'quota');
assert(
    'quota detail offers retry or copy and warns about reload',
    quotaDetail.indexOf('out of room') !== -1 &&
        quotaDetail.indexOf('Retry or copy') !== -1 &&
        quotaDetail.indexOf('before you reload') !== -1
);

assert(
    'Saved answers detail names only lesson answers',
    feedback.detailFor('answers', 'Saved', 'written') === 'Lesson answers are stored on this device.'
);
assert(
    'Saved completion detail names only lesson completion',
    feedback.detailFor('completion', 'Saved', 'written') === 'Lesson completion is stored on this device.'
);
assert(
    'Saved reading detail names only reading notes',
    feedback.detailFor('reading', 'Saved', 'written') === 'Reading notes are stored on this device.'
);

var failActions = feedback.actionsFor('Could not save', 'quota', false);
assert(
    'quota failure shows retry, copy, and download',
    failActions.retry && failActions.copy && failActions.download && !failActions.downloadOriginal
);
var malformedActions = feedback.actionsFor('Could not save', 'malformed', true);
assert(
    'malformed failure also offers the original stored copy',
    malformedActions.downloadOriginal === true
);
assert(
    'Saved hides recovery actions',
    feedback.actionsFor('Saved', 'written', true).retry === false &&
        feedback.actionsFor('Saved', 'written', true).downloadOriginal === false
);

var payload = feedback.buildRecoveryPayload('answers', {
    'question-101-1-1': 'SYN-in-memory',
    '__gtSharedKeyMigrationV1': true
});
var text = feedback.recoveryText(payload);
assert('recovery payload marks itself as in-memory only', payload.kind === 'growing-together-in-memory-recovery');
assert('recovery payload keeps the in-memory answer', payload.data['question-101-1-1'] === 'SYN-in-memory');
assert('recovery text is JSON and excludes credentials', text.indexOf('SYN-in-memory') !== -1 && text.indexOf('Token ') === -1);
assert('recovery note defers versioned import to ENG-006', payload.note.indexOf('ENG-006') !== -1);

var damaged = memoryStorage('{"SYN-broken":');
var readDamaged = feedback.readJsonStore(damaged, feedback.STORES.answers.key);
assert('malformed JSON is reported without inventing an object', readDamaged.malformed === true && readDamaged.available === true);
assert('malformed raw bytes stay in the store after read', damaged.getItem() === '{"SYN-broken":');
assert('malformed raw is returned for later recovery', readDamaged.raw === '{"SYN-broken":');

var arrayStore = memoryStorage(['nope']);
var readArray = feedback.readJsonStore(arrayStore, feedback.STORES.answers.key);
assert('non-object JSON is malformed and raw is kept', readArray.malformed === true && arrayStore.getItem() === '["nope"]');

var blockedRead = feedback.readJsonStore({
    getItem: function () { throw new Error('storage blocked'); },
    setItem: function () { throw new Error('storage blocked'); }
}, feedback.STORES.answers.key);
assert('blocked getter read is unavailable and does not throw', blockedRead.available === false);

var writable = memoryStorage({ 'question-101-1-1': 'SYN-old' });
var wrote = feedback.writeJsonStore(writable, feedback.STORES.answers.key, { 'question-101-1-1': 'SYN-new' });
assert('successful write returns true', wrote === true);
assert(
    'successful write stored the new synthetic value',
    JSON.parse(writable.getItem())['question-101-1-1'] === 'SYN-new'
);

var quotaStore = {
    getItem: function () { return '{"ok":true}'; },
    setItem: function () {
        var err = new Error('quota');
        err.name = 'QuotaExceededError';
        throw err;
    }
};
assert('quota write returns false and keeps caller memory untouched', feedback.writeJsonStore(quotaStore, 'k', { a: 1 }) === false);
assert('quota error classifies as quota', feedback.classifyWriteError({ name: 'QuotaExceededError', message: 'x' }) === 'quota');
assert('blocked error classifies as blocked', feedback.classifyWriteError({ message: 'Synthetic getter failure' }) === 'blocked');

var completionKey = feedback.STORES.completion.key;
var readingKey = feedback.STORES.reading.key;
assert('completion store key is foundationsCompletionData', completionKey === 'foundationsCompletionData');
assert('reading store key is foundationsReadingData', readingKey === 'foundationsReadingData');

var completionRead = feedback.readJsonStore(memoryStorage({ 'complete-101-1': true }), completionKey);
assert('completion store reads a synthetic flag', completionRead.data['complete-101-1'] === true && feedback.isWritableLoad(completionRead));

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
