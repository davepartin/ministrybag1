#!/usr/bin/env node
/**
 * ENG-006a synthetic backup-envelope checks.
 * Uses only synthetic strings. Never print real learner answers or credentials.
 * Does not write a downloaded file to disk in this process.
 */
'use strict';

var backup = require('./backup-download.js');

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

assert('kind and version are stable', backup.KIND === 'growing-together-backup' && backup.FORMAT_VERSION === 1);
assert('filename is the versioned backup name', backup.backupFilename() === 'growing-together-backup.json');
assert(
    'module exports no restore or write helper',
    typeof backup.restoreBackup !== 'function' &&
        typeof backup.importBackup !== 'function' &&
        typeof backup.writeJsonStore !== 'function' &&
        typeof backup.applyBackup !== 'function'
);

var full = backup.buildBackupEnvelope({
    exportedAt: '2026-09-12T00:00:00.000Z',
    stores: sampleStores()
});
var fullText = backup.backupText(full);

assert('envelope kind is the versioned backup', full.kind === 'growing-together-backup');
assert('formatVersion is 1', full.formatVersion === 1);
assert('exportedAt is preserved', full.exportedAt === '2026-09-12T00:00:00.000Z');
assert('complete valid stores are complete', full.complete === true);
assert('saved valid stores are not marked unsaved', full.includesUnsavedEdits === false);
assert('scope names all three stores', full.scope.stores.join(',') === 'answers,completion,reading');
assert('answers data keeps the multiline question', full.stores.answers.data['question-101-5-key'] === 'SYN-line-one\nSYN-line-two');
assert('answers data keeps the Unicode question', full.stores.answers.data['question-101-5-prayer'] === 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16');
assert('checklist array is preserved', Array.isArray(full.stores.answers.data['checklist-101-service-interests']) && full.stores.answers.data['checklist-101-service-interests'][1] === 2);
assert('commitment is preserved', full.stores.answers.data['commitment-101'] === 'Yes');
assert('completion flag is preserved', full.stores.completion.data['complete-101-5'] === true);
assert('reading note is preserved', full.stores.reading.data['notes-101-John-13'] === 'SYN-reading-note');
assert('reading check is preserved', full.stores.reading.data['check-101-John-13'] === true);
assert('migration flag stays in answers data', full.stores.answers.data['__gtSharedKeyMigrationV1'] === true);
assert('ambiguity metadata stays in answers data', full.stores.answers.data['__gtAmbiguousSharedAnswers'].items['question-202-201-09-prayer'].value === 'SYN-ambiguous-legacy');
assert('ambiguity is inspectable at the envelope root', full.ambiguousAnswers.present === true && full.ambiguousAnswers.count === 1);
assert('ambiguity is not auto-assigned', full.ambiguousAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');
assert('ambiguity keeps candidate lessons', full.ambiguousAnswers.items['question-202-201-09-prayer'].candidateLessons[0] === '202-05');
assert('counts include questions, checklists and commitments', full.counts.answers.questions === 2 && full.counts.answers.checklists === 1 && full.counts.answers.commitments === 1);
assert('counts exclude internal keys from learner totals', full.counts.answers.keys === 4);
assert('completion and reading counts are honest', full.counts.completion.flags === 1 && full.counts.reading.notes === 1 && full.counts.reading.checks === 1);
assert('ambiguous count is separate', full.counts.ambiguousAnswers === 1);
assert('ok stores do not embed originalRaw', full.stores.answers.originalRaw === null && full.stores.answers.originalRawAvailable === false);
assert('backup text is JSON and keeps Unicode', fullText.indexOf('SYN-unicode-cafe') !== -1 && fullText.indexOf('\u03c0') !== -1);
assert('backup text does not claim restore', full.note.indexOf('restore') !== -1 && full.note.indexOf('ENG-006c') !== -1);
assert('scope text names counts', backup.backupScopeText(full).indexOf('2 questions') !== -1 && backup.backupScopeText(full).indexOf('Retained ambiguous answers: 1') !== -1);

var empty = backup.buildBackupEnvelope({
    exportedAt: '2026-09-12T00:00:00.000Z',
    stores: {
        answers: { loadState: 'ok', writable: true, data: {} },
        completion: { loadState: 'ok', writable: true, data: {} },
        reading: { loadState: 'ok', writable: true, data: {} }
    }
});
assert('empty valid data is complete', empty.complete === true);
assert('empty valid answers are emptyValid', empty.stores.answers.emptyValid === true);
assert('empty valid is not treated as unknown', empty.stores.answers.dataRepresents === 'current-memory-and-known-storage');
assert('empty valid counts are zero', empty.counts.answers.keys === 0 && empty.counts.completion.flags === 0 && empty.counts.reading.notes === 0);
assert('empty valid status does not say partial', backup.backupStatusText(empty).indexOf('partial') === -1);

var malformed = backup.buildBackupEnvelope({
    exportedAt: '2026-09-12T00:00:00.000Z',
    stores: sampleStores({
        answers: {
            loadState: 'malformed',
            writable: false,
            includesUnsavedEdits: true,
            originalRaw: '{"SYN-broken":',
            data: {
                'question-101-5-key': 'SYN-unsaved-after-failed-load'
            }
        }
    })
});
assert('malformed answers make the envelope partial', malformed.complete === false);
assert('malformed answers store is not complete', malformed.stores.answers.complete === false);
assert('malformed answers are not emptyValid', malformed.stores.answers.emptyValid === false);
assert('malformed answers keep in-memory unsaved edits', malformed.stores.answers.data['question-101-5-key'] === 'SYN-unsaved-after-failed-load');
assert('malformed answers retain original raw separately from data', malformed.stores.answers.originalRaw === '{"SYN-broken":');
assert('malformed data object does not invent the unread keys', Object.keys(malformed.stores.answers.data).indexOf('SYN-broken') === -1);
assert('malformed dataRepresents is current memory only', malformed.stores.answers.dataRepresents === 'current-memory-only-storage-unknown-or-unreadable');
assert('malformed envelope reports unsaved edits', malformed.includesUnsavedEdits === true);
assert('other readable stores stay complete on their own', malformed.stores.completion.complete === true && malformed.stores.reading.complete === true);
assert('partial status keeps the original copy', backup.backupStatusText(malformed).indexOf('original recovery copy') !== -1);

var unavailable = backup.buildBackupEnvelope({
    stores: {
        answers: { loadState: 'ok', writable: true, data: {} },
        completion: { loadState: 'ok', writable: true, data: {} },
        reading: { loadState: 'unavailable', writable: false, data: {} }
    }
});
assert('unavailable reading is partial, not a complete empty backup', unavailable.complete === false && unavailable.stores.reading.emptyValid === false);
assert('unavailable reading does not claim known storage', unavailable.stores.reading.dataRepresents === 'current-memory-only-storage-unknown-or-unreadable');
assert('unavailable reading has no original raw unless captured', unavailable.stores.reading.originalRawAvailable === false);

var unsaved = backup.buildBackupEnvelope({
    stores: sampleStores({
        completion: {
            loadState: 'ok',
            writable: true,
            includesUnsavedEdits: true,
            data: { 'complete-101-5': true, 'complete-101-1': true }
        }
    })
});
assert('unsaved flag is visible when a store reports unsaved edits', unsaved.includesUnsavedEdits === true && unsaved.stores.completion.includesUnsavedEdits === true);
assert('unsaved complete store can still be complete', unsaved.complete === true);
assert('scope text mentions unsaved edits', backup.backupScopeText(unsaved).indexOf('unsaved edits') !== -1);

var mutatedSource = {
    'question-101-5-key': 'SYN-before'
};
var built = backup.buildStoreSnapshot('answers', { loadState: 'ok', data: mutatedSource });
mutatedSource['question-101-5-key'] = 'SYN-after';
assert('store snapshot clones memory and does not follow later mutation', built.data['question-101-5-key'] === 'SYN-before');

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
