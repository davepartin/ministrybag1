#!/usr/bin/env node
/**
 * ENG-006b synthetic backup validation and preview checks.
 * Uses only synthetic strings. Never print real learner answers or credentials.
 * Does not write learner storage.
 */
'use strict';

var download = require('./backup-download.js');
var preview = require('./backup-preview.js');

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

function sampleStores(overrides) {
    var stores = {
        answers: {
            loadState: 'ok',
            writable: true,
            includesUnsavedEdits: false,
            data: {
                'question-101-5-key': 'SYN-line-one\nSYN-line-two',
                'question-101-5-prayer': 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16',
                'checklist-101-service-interests': [0, 2],
                'commitment-101': 'Yes',
                '__gtSharedKeyMigrationV1': true,
                '__gtAmbiguousSharedAnswers': {
                    version: 1,
                    items: {
                        'question-202-201-09-prayer': {
                            value: 'SYN-ambiguous-legacy',
                            candidateLessons: ['202-05', '202-09'],
                            status: 'ambiguous',
                            note: 'Shared before unique IDs. Lesson unknown. Not copied into either lesson.'
                        }
                    }
                }
            }
        },
        completion: {
            loadState: 'ok',
            writable: true,
            includesUnsavedEdits: false,
            data: { 'complete-101-5': true }
        },
        reading: {
            loadState: 'ok',
            writable: true,
            includesUnsavedEdits: false,
            data: {
                'notes-101-John-13': 'SYN-reading-note',
                'check-101-John-13': true
            }
        }
    };
    overrides = overrides || {};
    Object.keys(overrides).forEach(function (id) {
        stores[id] = Object.assign({}, stores[id], overrides[id]);
        if (overrides[id] && overrides[id].data) {
            stores[id].data = overrides[id].data;
        }
    });
    return stores;
}

function envelope(overrides) {
    return download.buildBackupEnvelope({
        exportedAt: '2026-09-12T00:00:00.000Z',
        stores: sampleStores(overrides)
    });
}

function textOf(env) {
    return download.backupText(env);
}

function meta(name, text) {
    return { name: name || 'growing-together-backup.json', size: text.length };
}

assert('size limit is documented 1 MiB', preview.MAX_BACKUP_BYTES === 1048576);
assert(
    'module exports no restore or write helper',
    typeof preview.restoreBackup !== 'function' &&
        typeof preview.importBackup !== 'function' &&
        typeof preview.writeJsonStore !== 'function' &&
        typeof preview.applyBackup !== 'function'
);

var inspectOk = preview.inspectSelectedFile({
    name: 'growing-together-backup.json',
    size: 128
});
assert('inspect accepts a versioned backup name under the size limit', inspectOk.ok === true);

var inspectOver = preview.inspectSelectedFile({
    name: 'growing-together-backup.json',
    size: preview.MAX_BACKUP_BYTES + 1
});
assert('inspect rejects oversized files before parse', inspectOver.ok === false && inspectOver.code === 'oversized');
assert('oversized message says the file was not read', inspectOver.message.indexOf('was not read or parsed') !== -1);

var inspectEmpty = preview.inspectSelectedFile({
    name: 'growing-together-backup.json',
    size: 0
});
assert('inspect rejects empty files', inspectEmpty.code === 'empty');

var inspectTxt = preview.inspectSelectedFile({
    name: 'notes.txt',
    size: 12
});
assert('inspect rejects non-json names', inspectTxt.code === 'unsupported-type');

var inspectOriginal = preview.inspectSelectedFile({
    name: 'growing-together-original-storage.txt',
    size: 20
});
assert('inspect distinguishes original storage copies', inspectOriginal.code === 'original-copy');

var full = envelope();
var fullText = textOf(full);
var fullPreview = preview.previewFromText(fullText, meta('growing-together-backup.json', fullText), {
    stores: {
        answers: { data: { 'question-101-5-key': 'SYN-device-different', 'question-101-only-device': 'SYN-keep-device' } },
        completion: { data: { 'complete-101-5': true } },
        reading: { data: {} }
    }
});
assert('current downloaded envelope previews successfully', fullPreview.ok === true && fullPreview.applyAvailable === false);
assert('preview keeps multiline answers', fullPreview.stores.answers.counts.questions === 2);
assert('preview reports derived counts not a silent accept of claimed totals', fullPreview.counts.answers.keys === 4);
assert('preview finds an existing-value conflict', fullPreview.conflictKeys.indexOf('answers:question-101-5-key') !== -1);
assert('preview keeps device-only keys as retain', fullPreview.stores.answers.comparison.deviceOnly.indexOf('question-101-only-device') !== -1);
assert('preview keeps backup-only reading keys as add', fullPreview.stores.reading.comparison.backupOnly.indexOf('notes-101-John-13') !== -1);
assert('preview keeps matching completion', fullPreview.stores.completion.comparison.matching.indexOf('complete-101-5') !== -1);
assert('preview shows retained ambiguity without assigning a lesson', fullPreview.ambiguousAnswers.present === true &&
    fullPreview.ambiguousAnswers.items['question-202-201-09-prayer'].status === 'ambiguous' &&
    fullPreview.ambiguousAnswers.items['question-202-201-09-prayer'].candidateLessons[0] === '202-05');
assert('selection semantics mention default keep-device for conflicts', fullPreview.selection.indexOf('default keep the current device value') !== -1);
assert('selection semantics mention unknown keys and unassigned ambiguity', fullPreview.selection.indexOf('Unknown keys stay stored') !== -1 &&
    fullPreview.selection.indexOf('Ambiguous answers stay unassigned') !== -1);
assert('apply note says restore is not available', fullPreview.applyNote.indexOf('not available yet') !== -1);
assert('could-not-restore includes applied restore', fullPreview.couldNotRestore.join(' ').indexOf('Applying a backup is not available yet') !== -1);

var emptyEnv = download.buildBackupEnvelope({
    exportedAt: '2026-09-12T00:00:00.000Z',
    stores: {
        answers: { loadState: 'ok', writable: true, data: {} },
        completion: { loadState: 'ok', writable: true, data: {} },
        reading: { loadState: 'ok', writable: true, data: {} }
    }
});
var emptyText = textOf(emptyEnv);
var emptyPreview = preview.previewFromText(emptyText, meta('growing-together-backup.json', emptyText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('empty valid backup is complete, not a failed load', emptyPreview.ok === true && emptyPreview.complete === true);
assert('empty valid answers stay emptyValid', emptyPreview.stores.answers.emptyValid === true);

var falseEmpty = envelope({
    completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': false } },
    reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': '', 'check-101-John-13': false } },
    answers: {
        loadState: 'ok',
        writable: true,
        data: {
            'question-101-5-key': '',
            'checklist-101-service-interests': []
        }
    }
});
var falseText = textOf(falseEmpty);
var falsePreview = preview.previewFromText(falseText, meta('growing-together-backup.json', falseText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('valid false completion flags are kept', falsePreview.ok === true && falsePreview.counts.completion.flags === 1);
assert('empty strings and empty checklist arrays are kept', falsePreview.ok === true && falsePreview.counts.answers.keys === 2);
assert('false reading checks are kept', falsePreview.counts.reading.checks === 1 && falsePreview.counts.reading.notes === 1);

var malformedJson = preview.previewFromText('{not-json', {
    name: 'growing-together-backup.json',
    size: '{not-json'.length
});
assert('malformed JSON is rejected', malformedJson.code === 'malformed-json');

var oversizedParse = preview.parseAndValidate('{"kind":"growing-together-backup"}', {
    name: 'growing-together-backup.json',
    size: preview.MAX_BACKUP_BYTES + 20
});
assert('parse rejects oversized before JSON.parse when size is declared', oversizedParse.code === 'oversized');

var recovery = {
    kind: 'growing-together-in-memory-recovery',
    store: 'answers',
    data: { 'question-101-5-key': 'SYN-recovery' }
};
var recoveryText = JSON.stringify(recovery);
var recoveryPreview = preview.previewFromText(recoveryText, {
    name: 'growing-together-answers-recovery.json',
    size: recoveryText.length
});
assert('recovery snapshots are distinguished', recoveryPreview.code === 'recovery-snapshot');
assert('recovery message does not call the file a versioned backup', recoveryPreview.message.indexOf('not a versioned') !== -1);

var rawStore = JSON.stringify({
    'question-101-5-key': 'SYN-raw-copy',
    '__gtSharedKeyMigrationV1': true
});
var rawPreview = preview.previewFromText(rawStore, {
    name: 'copy.json',
    size: rawStore.length
});
assert('raw storage JSON is distinguished from versioned backups', rawPreview.code === 'original-copy');

var v2 = JSON.parse(fullText);
v2.formatVersion = 2;
var v2Text = JSON.stringify(v2);
var v2Preview = preview.previewFromText(v2Text, meta('growing-together-backup.json', v2Text));
assert('unsupported versions are rejected', v2Preview.code === 'unsupported-version');

var otherKind = JSON.parse(fullText);
otherKind.kind = 'other-app-backup';
var otherText = JSON.stringify(otherKind);
var otherPreview = preview.previewFromText(otherText, meta('growing-together-backup.json', otherText));
assert('unsupported kinds are rejected', otherPreview.code === 'unsupported-kind');

var badType = JSON.parse(fullText);
badType.stores.answers.data['question-101-5-key'] = 12;
var badTypeText = JSON.stringify(badType);
var badTypePreview = preview.previewFromText(badTypeText, meta('growing-together-backup.json', badTypeText));
assert('invalid question types are rejected', badTypePreview.code === 'invalid-type');

var badComplete = JSON.parse(fullText);
badComplete.stores.completion.data['complete-101-5'] = 'true';
var badCompleteText = JSON.stringify(badComplete);
assert('invalid completion types are rejected', preview.previewFromText(badCompleteText, meta('growing-together-backup.json', badCompleteText)).code === 'invalid-type');

var protoText = fullText.replace('"question-101-5-key":', '"__proto__":{"polluted":true},"constructor":{"prototype":{}},"question-101-5-key":');
var protoPreview = preview.previewFromText(protoText, meta('growing-together-backup.json', protoText));
assert('dangerous prototype keys are rejected', protoPreview.code === 'dangerous-key');

var htmlEnv = envelope({
    answers: {
        loadState: 'ok',
        writable: true,
        data: {
            'question-101-5-key': '<img src=x onerror="alert(1)">SYN-html'
        }
    }
});
var htmlText = textOf(htmlEnv);
var htmlPreview = preview.previewFromText(htmlText, meta('growing-together-backup.json', htmlText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('HTML strings are accepted as text values', htmlPreview.ok === true);
assert('preview builder does not turn HTML into markup helpers', htmlPreview.applyAvailable === false);
assert('preview entries keep the HTML string as text', htmlPreview.stores.answers.entries.some(function (entry) {
    return entry.key === 'question-101-5-key' && entry.value.indexOf('<img src=x onerror="alert(1)">SYN-html') !== -1;
}));

var unknownEnv = envelope({
    answers: {
        loadState: 'ok',
        writable: true,
        data: {
            'question-101-5-key': 'SYN-known',
            'legacy-freeform-key': 'SYN-unknown-keep'
        }
    }
});
var unknownText = textOf(unknownEnv);
var unknownPreview = preview.previewFromText(unknownText, meta('growing-together-backup.json', unknownText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('unknown keys are listed instead of dropped', unknownPreview.unknownKeys.indexOf('answers:legacy-freeform-key') !== -1);
assert('unknown-key selection does not infer a lesson', unknownPreview.selection.indexOf('without a lesson assignment') !== -1);

var claimed = JSON.parse(fullText);
claimed.complete = false;
claimed.counts = { answers: { keys: 99, questions: 99, checklists: 0, commitments: 0, other: 0 }, completion: { keys: 0, flags: 0, other: 0 }, reading: { keys: 0, notes: 0, checks: 0, other: 0 }, ambiguousAnswers: 8 };
claimed.ambiguousAnswers = { present: true, count: 8, items: { 'question-invented': { value: 'no', candidateLessons: ['x'], status: 'ambiguous' } } };
var claimedText = JSON.stringify(claimed);
var claimedPreview = preview.previewFromText(claimedText, meta('growing-together-backup.json', claimedText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('claimed complete is not trusted', claimedPreview.complete === true);
assert('claimed counts are not trusted', claimedPreview.counts.answers.keys === 4 && claimedPreview.counts.ambiguousAnswers === 1);
assert('count and ambiguity mismatches are surfaced', claimedPreview.inconsistencies.length >= 2);
assert('preview still uses validated ambiguous items', claimedPreview.ambiguousAnswers.count === 1 &&
    !claimedPreview.ambiguousAnswers.items['question-invented']);

var partial = envelope({
    answers: {
        loadState: 'malformed',
        writable: false,
        includesUnsavedEdits: true,
        originalRaw: '{"SYN-broken":',
        data: { 'question-101-5-key': 'SYN-unsaved-after-failed-load' }
    }
});
var partialText = textOf(partial);
var partialPreview = preview.previewFromText(partialText, meta('growing-together-backup.json', partialText), {
    stores: { answers: { data: {} }, completion: { data: {} }, reading: { data: {} } }
});
assert('partial backup previews as incomplete', partialPreview.ok === true && partialPreview.complete === false);
assert('partial backup keeps originalRaw as evidence only', partialPreview.originalRawStores.indexOf('answers') !== -1);
assert('partial backup cannot claim to recover inaccessible data', partialPreview.couldNotRestore.join(' ').indexOf('unreadable') !== -1);
assert('partial could-restore is limited to included current-page values', partialPreview.couldRestore.join(' ').indexOf('current-page values included') !== -1);
assert('unsaved store is visible', partialPreview.unsavedStores.indexOf('answers') !== -1);
assert('status text explains preview is read-only', preview.previewStatusText(partialPreview).indexOf('does not change') !== -1);

var assigned = JSON.parse(fullText);
assigned.stores.answers.data.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status = 'assigned-202-05';
var assignedText = JSON.stringify(assigned);
assert('auto-assigned ambiguity is rejected', preview.previewFromText(assignedText, meta('growing-together-backup.json', assignedText)).code === 'invalid-type');

var missingStore = JSON.parse(fullText);
delete missingStore.stores.reading;
var missingText = JSON.stringify(missingStore);
assert('missing stores are rejected', preview.previewFromText(missingText, meta('growing-together-backup.json', missingText)).code === 'invalid-structure');

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
