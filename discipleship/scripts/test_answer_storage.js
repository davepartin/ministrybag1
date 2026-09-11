#!/usr/bin/env node
/**
 * ENG-001 synthetic regression checks for shared-key migration.
 * Uses only synthetic strings. Never print real learner answers.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var storage = require('./answer-storage.js');

var ROOT = path.resolve(__dirname, '..');
var DATA_DIR = path.join(ROOT, 'data');
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
        store[storage.RESPONSES_KEY] = typeof initial === 'string' ? initial : JSON.stringify(initial);
    }
    return {
        getItem: function (key) {
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        setItem: function (key, value) {
            store[key] = String(value);
        },
        _raw: store
    };
}

function unavailableStorage() {
    return {
        getItem: function () {
            throw new Error('storage blocked');
        },
        setItem: function () {
            throw new Error('storage blocked');
        }
    };
}

function readLesson(fileName) {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));
}

function collectAllLessons() {
    return fs.readdirSync(DATA_DIR)
        .filter(function (name) { return name.endsWith('.json'); })
        .map(function (name) {
            return {
                courseId: name.split('-')[0],
                lessonId: name.replace(/\.json$/, ''),
                lesson: readLesson(name)
            };
        });
}

// --- Baseline identity repair in the four scoped lesson files ---
var closingIds = {
    '202-05.json': ['202-05-key', '202-05-devos', '202-05-prayer'],
    '202-09.json': ['202-09-key', '202-09-devos', '202-09-prayer'],
    '203-06.json': ['203-06-key', '203-06-devos', '203-06-prayer'],
    '203-07.json': ['203-07-key', '203-07-devos', '203-07-prayer']
};

Object.keys(closingIds).forEach(function (fileName) {
    var ids = readLesson(fileName).blocks
        .filter(function (b) { return b.type === 'question'; })
        .map(function (b) { return b.id; });
    closingIds[fileName].forEach(function (expected) {
        assert(fileName + ' has ' + expected, ids.indexOf(expected) !== -1);
    });
});

assert(
    '202 pair no longer shares 201-09 closing ids',
    readLesson('202-05.json').blocks.some(function (b) { return b.id === '201-09-key'; }) === false &&
        readLesson('202-09.json').blocks.some(function (b) { return b.id === '201-09-key'; }) === false
);
assert(
    '203-06 no longer uses 203-07 closing ids',
    readLesson('203-06.json').blocks.some(function (b) { return b.id === '203-07-key'; }) === false
);

// --- Independent new answers after migration ---
var first = storage.loadAndMigrateResponses(memoryStorage({
    'question-202-201-09-key': 'SYN-202-shared-key',
    'question-202-201-09-devos': 'SYN-202-shared-devos',
    'question-202-201-09-prayer': 'SYN-202-shared-prayer',
    'question-101-1-key': 'SYN-101-keep',
    'question-201-201-09-key': 'SYN-201-keep',
    'question-202-202-07-key': 'SYN-unrelated-202'
}));

assert('202 old shared keys remain recoverable', first.responses['question-202-201-09-key'] === 'SYN-202-shared-key');
assert(
    '202 shared value is marked ambiguous',
    first.responses[storage.RECOVERY_KEY].items['question-202-201-09-key'].status === 'ambiguous' &&
        first.responses[storage.RECOVERY_KEY].items['question-202-201-09-key'].value === 'SYN-202-shared-key'
);
assert(
    '202 shared value is not copied to 202-05',
    first.responses['question-202-202-05-key'] === undefined
);
assert(
    '202 shared value is not copied to 202-09',
    first.responses['question-202-202-09-key'] === undefined
);
assert('101 key preserved', first.responses['question-101-1-key'] === 'SYN-101-keep');
assert('201-09 established key preserved', first.responses['question-201-201-09-key'] === 'SYN-201-keep');
assert('unrelated 202 response preserved', first.responses['question-202-202-07-key'] === 'SYN-unrelated-202');

first.responses['question-202-202-05-key'] = 'SYN-202-05-new';
first.responses['question-202-202-09-key'] = 'SYN-202-09-new';
var afterNew = storage.migrateSharedQuestionResponses(first.responses);
assert(
    'independent 202-05 and 202-09 answers stay distinct',
    afterNew.responses['question-202-202-05-key'] === 'SYN-202-05-new' &&
        afterNew.responses['question-202-202-09-key'] === 'SYN-202-09-new' &&
        afterNew.alreadyApplied === true &&
        afterNew.changed === false
);

// --- 203 pair: do not attribute the shared live key to 203-07 ---
var third = storage.migrateSharedQuestionResponses({
    'question-203-203-07-key': 'SYN-203-shared-key',
    'question-203-203-07-devos': 'SYN-203-shared-devos',
    'question-203-203-07-prayer': 'SYN-203-shared-prayer'
});
assert(
    '203 shared values are vacated from the live 203-07 keys',
    third.responses['question-203-203-07-key'] === undefined &&
        third.responses['question-203-203-07-devos'] === undefined &&
        third.responses['question-203-203-07-prayer'] === undefined
);
assert(
    '203 shared values are not written to 203-06',
    third.responses['question-203-203-06-key'] === undefined &&
        third.responses['question-203-203-06-devos'] === undefined &&
        third.responses['question-203-203-06-prayer'] === undefined
);
assert(
    '203 shared values remain in ambiguous recovery',
    third.responses[storage.RECOVERY_KEY].items['question-203-203-07-key'].value === 'SYN-203-shared-key' &&
        third.responses[storage.RECOVERY_KEY].items['question-203-203-07-key'].candidateLessons.join(',') === '203-06,203-07'
);

// --- Reload / navigation: persist, read again, keep new answers ---
var navStore = memoryStorage(first.responses);
navStore.setItem(storage.RESPONSES_KEY, JSON.stringify(first.responses));
var reloaded = storage.loadAndMigrateResponses(navStore);
assert(
    'reload keeps independent new answers and 101 values',
    reloaded.alreadyApplied === true &&
        reloaded.responses['question-202-202-05-key'] === 'SYN-202-05-new' &&
        reloaded.responses['question-202-202-09-key'] === 'SYN-202-09-new' &&
        reloaded.responses['question-101-1-key'] === 'SYN-101-keep'
);

// --- Repeated migration is a no-op after the first apply ---
var once = storage.migrateSharedQuestionResponses({
    'question-202-201-09-key': 'SYN-202-shared-key'
});
var twice = storage.migrateSharedQuestionResponses(once.responses);
assert('repeated migration reports already applied', twice.alreadyApplied === true && twice.changed === false);
assert(
    'repeated migration does not duplicate or rewrite recovery',
    twice.responses[storage.RECOVERY_KEY].items['question-202-201-09-key'].value === 'SYN-202-shared-key'
);
once.responses['question-203-203-07-key'] = 'SYN-203-07-after-migration';
var thirdPass = storage.migrateSharedQuestionResponses(once.responses);
assert(
    'post-migration 203-07 answer is not vacated on later runs',
    thirdPass.responses['question-203-203-07-key'] === 'SYN-203-07-after-migration'
);

// --- Existing new values are left in place ---
var existingNew = storage.migrateSharedQuestionResponses({
    'question-202-201-09-key': 'SYN-202-shared-key',
    'question-202-202-05-key': 'SYN-already-202-05',
    'question-203-203-07-key': 'SYN-203-shared-or-07',
    'question-203-203-06-key': 'SYN-already-203-06'
});
assert(
    'existing 202-05 value is not overwritten',
    existingNew.responses['question-202-202-05-key'] === 'SYN-already-202-05'
);
assert(
    'existing 203-06 value is not overwritten',
    existingNew.responses['question-203-203-06-key'] === 'SYN-already-203-06'
);
assert(
    '203-07 live value stays when 203-06 already has new values',
    existingNew.responses['question-203-203-07-key'] === 'SYN-203-shared-or-07'
);
assert(
    'old 202 shared value is still recorded as ambiguous',
    existingNew.responses[storage.RECOVERY_KEY].items['question-202-201-09-key'].value === 'SYN-202-shared-key'
);

// --- Malformed and unavailable storage ---
var malformed = storage.loadAndMigrateResponses(memoryStorage('not-json'));
assert('malformed JSON becomes an empty object', malformed.malformed === true && Object.keys(malformed.responses).filter(function (k) {
    return k !== storage.RECOVERY_KEY && k !== storage.MIGRATION_FLAG;
}).length === 0);

var notObject = storage.loadAndMigrateResponses(memoryStorage(['nope']));
assert('non-object JSON is treated as malformed', notObject.malformed === true);

var blocked = storage.loadAndMigrateResponses(unavailableStorage());
assert(
    'unavailable storage does not throw and yields empty responses',
    blocked.available === false && typeof blocked.responses === 'object'
);

var writeBlocked = {
    getItem: function () { return JSON.stringify({ 'question-101-1-key': 'SYN-101-keep' }); },
    setItem: function () { throw new Error('quota'); }
};
var persistFailed;
try {
    persistFailed = storage.loadAndMigrateResponses(writeBlocked);
} catch (err) {
    persistFailed = null;
}
assert('failed persist does not throw', persistFailed !== null && persistFailed.responses['question-101-1-key'] === 'SYN-101-keep');

// --- All-course runtime uniqueness, including checklist IDs ---
var dupes = storage.findDuplicateRuntimeIds(collectAllLessons());
assert(
    'all-course runtime IDs are unique',
    dupes.length === 0,
    JSON.stringify(dupes)
);

var checklistIds = storage.collectRuntimeIdsFromLesson('101', readLesson('101-05.json'));
assert(
    'checklist runtime IDs are included',
    checklistIds.indexOf('checklist-101-service-interests') !== -1
);

var detectorHits = storage.findDuplicateRuntimeIds([
    {
        courseId: '202',
        lessonId: '202-05',
        lesson: { blocks: [{ type: 'question', id: '201-09-key' }] }
    },
    {
        courseId: '202',
        lessonId: '202-09',
        lesson: { blocks: [{ type: 'question', id: '201-09-key' }] }
    }
]);
assert(
    'uniqueness detector flags the historical 202 shared key',
    detectorHits.length === 1 && detectorHits[0].id === 'question-202-201-09-key'
);

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
