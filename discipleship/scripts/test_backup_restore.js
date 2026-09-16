#!/usr/bin/env node
/**
 * ENG-006c synthetic confirmed-restore checks.
 * Uses only synthetic strings. Never print real learner answers or credentials.
 * Temporary in-memory storage and helper-built files only.
 */
'use strict';

var download = require('./backup-download.js');
var preview = require('./backup-preview.js');
var restore = require('./backup-restore.js');

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

function sampleBackupStores(overrides) {
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
                'legacy-freeform-key': 'SYN-unknown-keep',
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

function envelopeFrom(stores, extra) {
    return download.buildBackupEnvelope(Object.assign({
        exportedAt: '2026-09-16T00:00:00.000Z',
        stores: stores
    }, extra || {}));
}

function textOf(env) {
    return download.backupText(env);
}

function deviceFrom(stores, extraByStore) {
    extraByStore = extraByStore || {};
    var current = { stores: {} };
    ['answers', 'completion', 'reading'].forEach(function (id) {
        var store = stores[id] || {};
        var extra = extraByStore[id] || {};
        var data = JSON.parse(JSON.stringify(store.data || {}));
        current.stores[id] = Object.assign({
            loadState: store.loadState || 'ok',
            writable: store.writable !== false,
            includesUnsavedEdits: store.includesUnsavedEdits === true,
            data: data,
            originalRaw: store.originalRaw || null,
            persistedRaw: extra.persistedRaw !== undefined
                ? extra.persistedRaw
                : JSON.stringify(data)
        }, extra);
    });
    return current;
}

function makeStorage(map, hooks) {
    hooks = hooks || {};
    var data = {};
    Object.keys(map || {}).forEach(function (key) {
        data[key] = map[key];
    });
    return {
        getItem: function (key) {
            if (hooks.getThrow && hooks.getThrow[key]) {
                throw new Error(hooks.getThrow[key]);
            }
            return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
        },
        setItem: function (key, value) {
            if (hooks.setThrow && hooks.setThrow[key]) {
                var kind = hooks.setThrow[key];
                var err = new Error(kind === 'quota' ? 'The quota has been exceeded' : String(kind));
                if (kind === 'quota') {
                    err.name = 'QuotaExceededError';
                }
                throw err;
            }
            if (hooks.corrupt && hooks.corrupt[key]) {
                data[key] = '{"corrupted":true}';
                return;
            }
            data[key] = String(value);
        },
        removeItem: function (key) {
            if (hooks.removeThrow && hooks.removeThrow[key]) {
                throw new Error(hooks.removeThrow[key]);
            }
            delete data[key];
        },
        _data: data
    };
}

function storageFromDevice(current) {
    var map = {};
    ['answers', 'completion', 'reading'].forEach(function (id) {
        var store = current.stores[id];
        map[restore.STORE_KEYS[id]] = store.persistedRaw;
    });
    return makeStorage(map);
}

function applyOpts(sourceText, current, choices, extra) {
    extra = extra || {};
    var safety = extra.safetyEnvelope || download.buildBackupEnvelope(current);
    return Object.assign({
        sourceText: sourceText,
        filename: extra.filename || 'growing-together-backup.json',
        currentDevice: current,
        choices: choices || {},
        fingerprint: extra.fingerprint || restore.confirmationFingerprint({
            sourceText: sourceText,
            filename: extra.filename || 'growing-together-backup.json',
            currentDevice: current
        }),
        safetyDownloaded: extra.safetyDownloaded !== false,
        safetyAcknowledged: extra.safetyAcknowledged !== false,
        safetyEnvelope: safety,
        storage: extra.storage || storageFromDevice(current)
    }, extra);
}

var backupStores = sampleBackupStores();
var backupEnv = envelopeFrom(backupStores);
var backupText = textOf(backupEnv);

assert('restore helper exists', typeof restore.applyConfirmedRestore === 'function');
assert('safety filename is versioned and distinct', restore.safetyBackupFilename() === 'growing-together-backup-before-restore.json');
assert('safety status does not claim the file was saved', restore.safetyStatusText(backupEnv).indexOf('cannot prove the file was saved') !== -1);

var emptyDeviceStores = {
    answers: { loadState: 'ok', writable: true, data: { '__gtSharedKeyMigrationV1': true } },
    completion: { loadState: 'ok', writable: true, data: {} },
    reading: { loadState: 'ok', writable: true, data: {} }
};
var emptyDevice = deviceFrom(emptyDeviceStores);
var emptyPrepared = restore.prepareConfirmation(backupText, {
    name: 'growing-together-backup.json',
    size: backupText.length
}, emptyDevice);
assert('complete version 1 file can reach confirmation', emptyPrepared.ok === true && emptyPrepared.confirmable === true);
assert('empty destination has no learner conflicts', emptyPrepared.conflicts.length === 0);

var added = restore.applyConfirmedRestore(applyOpts(backupText, emptyDevice, {}));
assert('backup-only restore writes all three stores', added.ok === true && added.code === 'restored');
assert('restored count includes known, unknown, false-capable keys', added.counts.restored === 8, JSON.stringify(added.counts));
assert('kept count is zero when destination had no learner keys', added.counts.kept === 0);
assert('conflict count is zero when none exist', added.counts.conflicts === 0);
assert('multiline value is restored', added.stores.answers['question-101-5-key'] === 'SYN-line-one\nSYN-line-two');
assert('unicode value is restored', added.stores.answers['question-101-5-prayer'].indexOf('\u00e9') !== -1 &&
    added.stores.answers['question-101-5-prayer'].indexOf('\u03c0') !== -1);
assert('unknown key is preserved as a stored key', added.stores.answers['legacy-freeform-key'] === 'SYN-unknown-keep');
assert('ambiguous metadata stays unassigned', added.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');
assert('false-capable completion true is restored', added.stores.completion['complete-101-5'] === true);
assert('reading note and check are restored', added.stores.reading['notes-101-John-13'] === 'SYN-reading-note' &&
    added.stores.reading['check-101-John-13'] === true);
assert('success text reports exact counts', added.message.indexOf('Restored 8 items from the backup') !== -1 &&
    added.message.indexOf('kept 0 items') !== -1 && added.message.indexOf('settled 0 differences') !== -1);

var reloadStorage = makeStorage({
    christianFoundationsResponses: added.serialized.answers,
    foundationsCompletionData: added.serialized.completion,
    foundationsReadingData: added.serialized.reading
});
var rereadAnswers = JSON.parse(reloadStorage.getItem('christianFoundationsResponses'));
var rereadCompletion = JSON.parse(reloadStorage.getItem('foundationsCompletionData'));
var rereadReading = JSON.parse(reloadStorage.getItem('foundationsReadingData'));
assert('reload from persisted bytes keeps multiline and unicode', rereadAnswers['question-101-5-key'] === 'SYN-line-one\nSYN-line-two' &&
    rereadAnswers['question-101-5-prayer'] === backupStores.answers.data['question-101-5-prayer']);
assert('reload keeps unknown key and ambiguity', rereadAnswers['legacy-freeform-key'] === 'SYN-unknown-keep' &&
    rereadAnswers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');
assert('reload keeps completion and reading', rereadCompletion['complete-101-5'] === true &&
    rereadReading['check-101-John-13'] === true);

var emptyFalseStores = sampleBackupStores({
    answers: {
        loadState: 'ok',
        writable: true,
        data: {
            'question-101-5-key': '',
            'checklist-101-service-interests': [],
            '__gtSharedKeyMigrationV1': true
        }
    },
    completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': false } },
    reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': '', 'check-101-John-13': false } }
});
var emptyFalseText = textOf(envelopeFrom(emptyFalseStores));
var emptyFalse = restore.applyConfirmedRestore(applyOpts(emptyFalseText, emptyDevice, {}));
assert('empty string, empty array and false values restore', emptyFalse.ok === true &&
    emptyFalse.stores.answers['question-101-5-key'] === '' &&
    Array.isArray(emptyFalse.stores.answers['checklist-101-service-interests']) &&
    emptyFalse.stores.answers['checklist-101-service-interests'].length === 0 &&
    emptyFalse.stores.completion['complete-101-5'] === false &&
    emptyFalse.stores.reading['notes-101-John-13'] === '' &&
    emptyFalse.stores.reading['check-101-John-13'] === false);

var deviceConflictStores = {
    answers: {
        loadState: 'ok',
        writable: true,
        data: {
            'question-101-5-key': 'SYN-device-keep',
            'question-101-only-device': 'SYN-stay-on-device',
            'question-101-5-prayer': 'SYN-unicode-cafe-\u00e9-\u03c0-\u4e16',
            '__gtSharedKeyMigrationV1': true,
            '__gtAmbiguousSharedAnswers': {
                version: 1,
                items: {
                    'question-202-201-09-prayer': {
                        value: 'SYN-device-ambiguous',
                        candidateLessons: ['202-05', '202-09'],
                        status: 'ambiguous'
                    }
                }
            }
        }
    },
    completion: { loadState: 'ok', writable: true, data: { 'complete-101-5': false, 'complete-101-6': true } },
    reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': 'SYN-device-note' } }
};
var conflictDevice = deviceFrom(deviceConflictStores);
var preparedConflicts = restore.prepareConfirmation(backupText, {
    name: 'growing-together-backup.json',
    size: backupText.length
}, conflictDevice);
var conflictIds = preparedConflicts.conflicts.map(function (item) { return item.id; });
assert('conflicts include learner disagreements and differing ambiguity', conflictIds.indexOf('answers:question-101-5-key') !== -1 &&
    conflictIds.indexOf('completion:complete-101-5') !== -1 &&
    conflictIds.indexOf('reading:notes-101-John-13') !== -1 &&
    conflictIds.indexOf('ambiguous:question-202-201-09-prayer') !== -1);
assert('matching unicode prayer is not a conflict', conflictIds.indexOf('answers:question-101-5-prayer') === -1);
assert('no choice is preselected by the helper', preparedConflicts.conflicts.every(function (item) {
    return item.choice == null;
}));

var noChoices = restore.applyConfirmedRestore(applyOpts(backupText, conflictDevice, {}));
assert('restore refuses when conflicts have no choice', noChoices.ok === false && noChoices.code === 'incomplete-choices' && noChoices.unchanged === true);

var keepAll = {};
preparedConflicts.conflicts.forEach(function (item) { keepAll[item.id] = 'keep-device'; });
var keepResult = restore.applyConfirmedRestore(applyOpts(backupText, conflictDevice, keepAll));
assert('keep-device leaves conflicting device values', keepResult.ok === true &&
    keepResult.stores.answers['question-101-5-key'] === 'SYN-device-keep' &&
    keepResult.stores.completion['complete-101-5'] === false &&
    keepResult.stores.reading['notes-101-John-13'] === 'SYN-device-note');
assert('keep-device still adds backup-only keys', keepResult.stores.answers['legacy-freeform-key'] === 'SYN-unknown-keep' &&
    keepResult.stores.reading['check-101-John-13'] === true);
assert('device-only keys stay', keepResult.stores.answers['question-101-only-device'] === 'SYN-stay-on-device' &&
    keepResult.stores.completion['complete-101-6'] === true);
assert('keep-device keeps device ambiguity unassigned', keepResult.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].value === 'SYN-device-ambiguous' &&
    keepResult.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');
assert('keep-device counts restored, kept and conflicts', keepResult.counts.conflicts === 4 &&
    keepResult.counts.keepDevice === 4 && keepResult.counts.useBackup === 0);

var useAll = {};
preparedConflicts.conflicts.forEach(function (item) { useAll[item.id] = 'use-backup'; });
var useResult = restore.applyConfirmedRestore(applyOpts(backupText, conflictDevice, useAll));
assert('use-backup installs backup conflict values', useResult.ok === true &&
    useResult.stores.answers['question-101-5-key'] === 'SYN-line-one\nSYN-line-two' &&
    useResult.stores.completion['complete-101-5'] === true &&
    useResult.stores.reading['notes-101-John-13'] === 'SYN-reading-note');
assert('use-backup still keeps device-only keys', useResult.stores.answers['question-101-only-device'] === 'SYN-stay-on-device' &&
    useResult.stores.completion['complete-101-6'] === true);
assert('use-backup keeps backup ambiguity unassigned', useResult.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].value === 'SYN-ambiguous-legacy' &&
    useResult.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');

var mixed = {
    'answers:question-101-5-key': 'keep-device',
    'completion:complete-101-5': 'use-backup',
    'reading:notes-101-John-13': 'keep-device',
    'ambiguous:question-202-201-09-prayer': 'use-backup'
};
var mixedResult = restore.applyConfirmedRestore(applyOpts(backupText, conflictDevice, mixed));
assert('mixed choices apply per conflict', mixedResult.ok === true &&
    mixedResult.stores.answers['question-101-5-key'] === 'SYN-device-keep' &&
    mixedResult.stores.completion['complete-101-5'] === true &&
    mixedResult.stores.reading['notes-101-John-13'] === 'SYN-device-note' &&
    mixedResult.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].value === 'SYN-ambiguous-legacy');
assert('mixed counts include both keep and use-backup', mixedResult.counts.keepDevice === 2 && mixedResult.counts.useBackup === 2);

var partialSourceStores = sampleBackupStores({
    answers: {
        loadState: 'malformed',
        writable: false,
        includesUnsavedEdits: true,
        originalRaw: '{"SYN-broken":',
        data: { 'question-101-5-key': 'SYN-partial-source' }
    }
});
var partialSourceText = textOf(envelopeFrom(partialSourceStores));
var partialPrepared = restore.prepareConfirmation(partialSourceText, {
    name: 'growing-together-backup.json',
    size: partialSourceText.length
}, emptyDevice);
assert('partial source stays preview-only', partialPrepared.ok === true && partialPrepared.confirmable === false);
var partialApply = restore.applyConfirmedRestore(applyOpts(partialSourceText, emptyDevice, {}));
assert('partial source cannot write', partialApply.ok === false && partialApply.code === 'partial-source' && partialApply.unchanged === true);

var guardedDestStores = {
    answers: {
        loadState: 'malformed',
        writable: false,
        includesUnsavedEdits: true,
        originalRaw: '{"SYN-original-answers":',
        data: { 'question-101-5-key': 'SYN-unsaved-after-failed-load' }
    },
    completion: { loadState: 'unavailable', writable: false, originalRaw: null, data: {} },
    reading: { loadState: 'ok', writable: true, data: { 'notes-101-John-13': 'SYN-device-note' } }
};
var guardedDevice = deviceFrom(guardedDestStores, {
    answers: { persistedRaw: '{"SYN-original-answers":' },
    completion: { persistedRaw: null }
});
var guardedPrepared = restore.prepareConfirmation(backupText, {
    name: 'growing-together-backup.json',
    size: backupText.length
}, guardedDevice);
assert('complete source may confirm against a partial destination', guardedPrepared.confirmable === true);
var guardedChoices = {};
guardedPrepared.conflicts.forEach(function (item) { guardedChoices[item.id] = 'use-backup'; });
var guardedSafety = download.buildBackupEnvelope(guardedDevice);
assert('safety envelope captures original raw evidence', guardedSafety.stores.answers.originalRaw === '{"SYN-original-answers":');
assert('safety envelope includes unsaved in-memory edits', guardedSafety.stores.answers.data['question-101-5-key'] === 'SYN-unsaved-after-failed-load');
var guardedOk = restore.applyConfirmedRestore(applyOpts(backupText, guardedDevice, guardedChoices, {
    safetyEnvelope: guardedSafety
}));
assert('confirmed replacement of a failed-load destination verifies', guardedOk.ok === true);
assert('recovered guards list the replaced stores', guardedOk.recoveredGuards.indexOf('answers') !== -1 &&
    guardedOk.recoveredGuards.indexOf('completion') !== -1);
assert('failed-load in-memory edit is replaced only after explicit use-backup', guardedOk.stores.answers['question-101-5-key'] === 'SYN-line-one\nSYN-line-two');

var missingEvidence = restore.applyConfirmedRestore(applyOpts(backupText, guardedDevice, guardedChoices, {
    safetyEnvelope: download.buildBackupEnvelope(emptyDevice)
}));
assert('missing original raw evidence blocks restore', missingEvidence.ok === false &&
    missingEvidence.code === 'missing-guard-evidence' && missingEvidence.unchanged === true);

var noSafety = restore.applyConfirmedRestore(applyOpts(backupText, emptyDevice, {}, { safetyDownloaded: false }));
assert('restore stays disabled until safety download is triggered', noSafety.code === 'safety-not-downloaded' && noSafety.unchanged === true);
var noAck = restore.applyConfirmedRestore(applyOpts(backupText, emptyDevice, {}, { safetyAcknowledged: false }));
assert('restore stays disabled until the learner acknowledges the safety file', noAck.code === 'safety-not-acknowledged' && noAck.unchanged === true);

function staleCase(mutator, label) {
    var current = deviceFrom(deviceConflictStores);
    var fingerprint = restore.confirmationFingerprint({
        sourceText: backupText,
        filename: 'growing-together-backup.json',
        currentDevice: current
    });
    mutator(current);
    var result = restore.applyConfirmedRestore(applyOpts(backupText, current, keepAll, { fingerprint: fingerprint }));
    assert(label, result.ok === false && result.code === 'stale-confirmation' && result.unchanged === true);
}

staleCase(function (current) {
    current.stores.answers.data['question-101-5-key'] = 'SYN-edited-after-preview';
}, 'answer edit makes confirmation stale');
staleCase(function (current) {
    current.stores.answers.persistedRaw = JSON.stringify({ changed: true });
}, 'storage raw change makes confirmation stale');
staleCase(function (current) {
    current.stores.answers.loadState = 'malformed';
    current.stores.answers.writable = false;
}, 'guard or load-reason change makes confirmation stale');
staleCase(function (current) {
    current.stores.completion.writable = false;
}, 'write-guard change makes confirmation stale');

var navFingerprint = restore.confirmationFingerprint({
    sourceText: backupText,
    filename: 'growing-together-backup.json',
    currentDevice: conflictDevice
});
var otherFile = textOf(envelopeFrom(emptyFalseStores));
var newPreview = restore.prepareConfirmation(otherFile, {
    name: 'growing-together-backup.json',
    size: otherFile.length
}, conflictDevice);
assert('a new preview file changes the confirmation fingerprint', newPreview.fingerprint !== navFingerprint);

var cancelStorage = storageFromDevice(conflictDevice);
var beforeCancel = {
    answers: cancelStorage.getItem('christianFoundationsResponses'),
    completion: cancelStorage.getItem('foundationsCompletionData'),
    reading: cancelStorage.getItem('foundationsReadingData')
};
assert('cancel path never calls apply, so storage bytes stay', beforeCancel.answers.indexOf('SYN-device-keep') !== -1);
assert('helper leaves storage untouched when not applied', cancelStorage.getItem('christianFoundationsResponses') === beforeCancel.answers);

['answers', 'completion', 'reading'].forEach(function (storeId) {
    var current = deviceFrom(emptyDeviceStores);
    var storage = storageFromDevice(current);
    var hooks = { setThrow: {} };
    hooks.setThrow[restore.STORE_KEYS[storeId]] = 'quota';
    storage = makeStorage({
        christianFoundationsResponses: current.stores.answers.persistedRaw,
        foundationsCompletionData: current.stores.completion.persistedRaw,
        foundationsReadingData: current.stores.reading.persistedRaw
    }, hooks);
    var quotaResult = restore.applyConfirmedRestore(applyOpts(backupText, current, {}, { storage: storage }));
    assert('quota on ' + storeId + ' rolls back and does not report success', quotaResult.ok === false &&
        quotaResult.code === 'write-failed' && quotaResult.unchanged === true &&
        quotaResult.writeError === 'quota' && quotaResult.failedStore === storeId);
    assert('quota on ' + storeId + ' leaves original answers bytes', storage.getItem('christianFoundationsResponses') === current.stores.answers.persistedRaw);
    assert('quota on ' + storeId + ' leaves original completion bytes', storage.getItem('foundationsCompletionData') === current.stores.completion.persistedRaw);
    assert('quota on ' + storeId + ' leaves original reading bytes', storage.getItem('foundationsReadingData') === current.stores.reading.persistedRaw);
});

['answers', 'completion', 'reading'].forEach(function (storeId) {
    var current = deviceFrom(emptyDeviceStores);
    var storage = makeStorage({
        christianFoundationsResponses: current.stores.answers.persistedRaw,
        foundationsCompletionData: current.stores.completion.persistedRaw,
        foundationsReadingData: current.stores.reading.persistedRaw
    }, { setThrow: (function () {
        var throws = {};
        throws[restore.STORE_KEYS[storeId]] = 'unavailable';
        return throws;
    }()) });
    var blocked = restore.applyConfirmedRestore(applyOpts(backupText, current, {}, { storage: storage }));
    assert('unavailable write on ' + storeId + ' does not succeed', blocked.ok === false &&
        blocked.code === 'write-failed' && blocked.writeError === 'unavailable' && blocked.unchanged === true);
});

var rollbackCurrent = deviceFrom(emptyDeviceStores);
var rollbackStorage = makeStorage({
    christianFoundationsResponses: rollbackCurrent.stores.answers.persistedRaw,
    foundationsCompletionData: rollbackCurrent.stores.completion.persistedRaw,
    foundationsReadingData: rollbackCurrent.stores.reading.persistedRaw
}, {
    setThrow: { foundationsCompletionData: 'quota' }
});
var rolled = restore.applyConfirmedRestore(applyOpts(backupText, rollbackCurrent, {}, { storage: rollbackStorage }));
assert('rollback succeeds after a later store fails', rolled.ok === false && rolled.unchanged === true &&
    rolled.rolledBack.answers === true);
assert('rolled-back answers match the pre-write snapshot', rollbackStorage.getItem('christianFoundationsResponses') === rollbackCurrent.stores.answers.persistedRaw);

var failRollbackCurrent = deviceFrom(emptyDeviceStores);
var failRollbackStorage = makeStorage({
    christianFoundationsResponses: failRollbackCurrent.stores.answers.persistedRaw,
    foundationsCompletionData: failRollbackCurrent.stores.completion.persistedRaw,
    foundationsReadingData: failRollbackCurrent.stores.reading.persistedRaw
}, {
    setThrow: { foundationsCompletionData: 'quota' }
});
var originalSet = failRollbackStorage.setItem;
var setCount = 0;
failRollbackStorage.setItem = function (key, value) {
    setCount += 1;
    if (key === 'christianFoundationsResponses' && setCount > 1) {
        var err = new Error('blocked rollback');
        throw err;
    }
    return originalSet.call(failRollbackStorage, key, value);
};
var rollbackFailed = restore.applyConfirmedRestore(applyOpts(backupText, failRollbackCurrent, {}, {
    storage: failRollbackStorage
}));
assert('incomplete rollback never reports success', rollbackFailed.ok === false && rollbackFailed.code === 'rollback-failed');
assert('incomplete rollback offers the pre-restore recovery download', rollbackFailed.offerSafetyDownload === true);
assert('incomplete rollback leaves visible per-store errors', !!rollbackFailed.storeErrors.answers &&
    rollbackFailed.storeErrors.answers.indexOf('rollback-failed') !== -1);
assert('incomplete rollback does not claim unchanged success', rollbackFailed.unchanged === false);

var snapshotFail = restore.applyConfirmedRestore(applyOpts(backupText, emptyDevice, {}, {
    storage: makeStorage({}, { getThrow: { christianFoundationsResponses: 'unavailable' } })
}));
assert('unavailable snapshot refuses to start writes', snapshotFail.code === 'snapshot-failed' && snapshotFail.unchanged === true);

var firstPass = restore.applyConfirmedRestore(applyOpts(backupText, emptyDevice, {}));
var restoredDevice = deviceFrom({
    answers: { loadState: 'ok', writable: true, data: firstPass.stores.answers },
    completion: { loadState: 'ok', writable: true, data: firstPass.stores.completion },
    reading: { loadState: 'ok', writable: true, data: firstPass.stores.reading }
});
var secondPass = restore.applyConfirmedRestore(applyOpts(backupText, restoredDevice, {}));
assert('repeated restore of the same complete file succeeds', secondPass.ok === true);
assert('repeated restore keeps matching values and reports zero conflicts', secondPass.counts.conflicts === 0 &&
    secondPass.counts.matching >= 1);
assert('repeated restore preserves unknown and ambiguous data', secondPass.stores.answers['legacy-freeform-key'] === 'SYN-unknown-keep' &&
    secondPass.stores.answers.__gtAmbiguousSharedAnswers.items['question-202-201-09-prayer'].status === 'ambiguous');

var roundTripDevice = deviceFrom(backupStores);
var downloaded = textOf(download.buildBackupEnvelope(roundTripDevice));
var roundTrip = restore.applyConfirmedRestore(applyOpts(downloaded, emptyDevice, {}, {
    filename: 'growing-together-backup.json'
}));
assert('actual helper-built source file restores', roundTrip.ok === true);
assert('download to restore to reload keeps checklist numbers', JSON.parse(roundTrip.serialized.answers)['checklist-101-service-interests'][1] === 2);
var safetyBuilt = download.buildBackupEnvelope(conflictDevice);
assert('actual helper-built safety file is a version 1 backup', safetyBuilt.kind === 'growing-together-backup' &&
    safetyBuilt.formatVersion === 1);
assert('safety file includes current in-memory device values', safetyBuilt.stores.answers.data['question-101-5-key'] === 'SYN-device-keep');
assert('restore helper does not treat a safety file as already applied', restore.canConfirmPreview(preview.buildPreview(
    preview.parseAndValidate(textOf(safetyBuilt), { name: restore.safetyBackupFilename(), size: textOf(safetyBuilt).length }),
    emptyDevice
)) === true);

var rejected = restore.prepareConfirmation('{not-json', {
    name: 'growing-together-backup.json',
    size: '{not-json'.length
}, emptyDevice);
assert('malformed JSON never reaches confirmation', rejected.ok === false && rejected.unchanged === true);

var ready = restore.restoreReady({
    confirmable: true,
    stale: false,
    conflicts: preparedConflicts.conflicts,
    choices: mixed,
    safetyDownloaded: true,
    safetyAcknowledged: true
});
assert('restoreReady enables Restore only after choices, safety download and acknowledgement', ready.restoreEnabled === true);
assert('restoreReady stays off when a choice is missing', restore.restoreReady({
    confirmable: true,
    conflicts: preparedConflicts.conflicts,
    choices: {},
    safetyDownloaded: true,
    safetyAcknowledged: true
}).restoreEnabled === false);
assert('restoreReady stays off when confirmation is stale', restore.restoreReady({
    confirmable: true,
    stale: true,
    conflicts: [],
    choices: {},
    safetyDownloaded: true,
    safetyAcknowledged: true
}).restoreEnabled === false);
assert('restoreReady stays off for partial source', restore.restoreReady({
    confirmable: false,
    conflicts: [],
    choices: {},
    safetyDownloaded: true,
    safetyAcknowledged: true
}).reason === 'preview-only');


// Coordinator review: a write that lands but fails verification must be rolled back too.
(function () {
    var device = deviceFrom({
        answers: { data: { 'question-101-5-key': 'SYN-device-original' } },
        completion: { data: { 'complete-101-1': true } },
        reading: { data: { 'notes-101-John-1': 'SYN-device-note' } }
    });
    var map = {};
    ['answers', 'completion', 'reading'].forEach(function (id) {
        map[restore.STORE_KEYS[id]] = device.stores[id].persistedRaw;
    });
    var corruptHook = {};
    corruptHook[restore.STORE_KEYS.completion] = true;
    var storage = makeStorage(map, { corrupt: corruptHook });
    var originalSet = storage.setItem;
    storage.setItem = function (key, value) {
        originalSet.call(storage, key, value);
        if (key === restore.STORE_KEYS.completion) {
            corruptHook[restore.STORE_KEYS.completion] = false;
        }
    };
    var result = restore.applyConfirmedRestore(applyOpts(backupText, device,
        { 'answers:question-101-5-key': restore.CHOICE_KEEP }, { storage: storage }));
    assert('verify failure after a landed write is reported as write-failed', result.ok === false && result.code === 'write-failed' &&
        result.failedStore === 'completion', result.code);
    assert('verify failure rolls back the earlier answers store', storage._data[restore.STORE_KEYS.answers] === map[restore.STORE_KEYS.answers]);
    assert('verify failure rolls back the failed completion store itself', storage._data[restore.STORE_KEYS.completion] === map[restore.STORE_KEYS.completion],
        storage._data[restore.STORE_KEYS.completion]);
    assert('reading store untouched after verify failure', storage._data[restore.STORE_KEYS.reading] === map[restore.STORE_KEYS.reading]);
    assert('verify failure rollback is marked for the failed store', result.rolledBack && result.rolledBack.completion === true);

    var alwaysCorrupt = {};
    alwaysCorrupt[restore.STORE_KEYS.completion] = true;
    var badStorage = makeStorage(map, { corrupt: alwaysCorrupt });
    var stuck = restore.applyConfirmedRestore(applyOpts(backupText, device,
        { 'answers:question-101-5-key': restore.CHOICE_KEEP }, { storage: badStorage }));
    assert('a store that cannot be put back reports rollback-failed, never unchanged', stuck.ok === false &&
        stuck.code === 'rollback-failed' && stuck.unchanged === false && stuck.offerSafetyDownload === true &&
        stuck.rollbackFailed && !!stuck.rollbackFailed.completion, stuck.code);

    var missing = applyOpts(backupText, device, { 'answers:question-101-5-key': restore.CHOICE_KEEP }, { storage: makeStorage(map) });
    delete missing.fingerprint;
    var noFingerprint = restore.applyConfirmedRestore(missing);
    assert('restore without a confirmation fingerprint is refused as stale', noFingerprint.ok === false && noFingerprint.code === 'stale-confirmation',
        noFingerprint.code);
}());

if (failed) {
    console.error('ENG-006c restore checks failed: ' + failed + ' failed, ' + passed + ' passed');
    process.exit(1);
}
console.log('ENG-006c restore checks passed: ' + passed);
