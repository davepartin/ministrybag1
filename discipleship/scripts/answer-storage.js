/**
 * Growing Together answer-storage helpers for ENG-001.
 * Works in the browser (global GrowingTogetherAnswerStorage) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherAnswerStorage = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var RESPONSES_KEY = 'christianFoundationsResponses';
    var RECOVERY_KEY = '__gtAmbiguousSharedAnswers';
    var MIGRATION_FLAG = '__gtSharedKeyMigrationV1';

    /**
     * Old shared runtime keys and the new unique keys that replace them.
     * candidateLessons stay unordered: the stored value might belong to either.
     * vacateOldKey: the old key is also a live identity for one lesson after the
     * repair (203-07), so the shared value must leave that live field.
     */
    var SHARED_QUESTION_GROUPS = [
        {
            course: '202',
            oldJsonIds: ['201-09-key', '201-09-devos', '201-09-prayer'],
            candidateLessons: ['202-05', '202-09'],
            newByLesson: {
                '202-05': ['202-05-key', '202-05-devos', '202-05-prayer'],
                '202-09': ['202-09-key', '202-09-devos', '202-09-prayer']
            },
            vacateOldKey: false
        },
        {
            course: '203',
            oldJsonIds: ['203-07-key', '203-07-devos', '203-07-prayer'],
            candidateLessons: ['203-06', '203-07'],
            newByLesson: {
                '203-06': ['203-06-key', '203-06-devos', '203-06-prayer'],
                '203-07': ['203-07-key', '203-07-devos', '203-07-prayer']
            },
            vacateOldKey: true
        }
    ];

    function questionRuntimeId(course, jsonId) {
        return 'question-' + course + '-' + jsonId;
    }

    function checklistRuntimeId(course, jsonId) {
        return 'checklist-' + course + '-' + jsonId;
    }

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function cloneJson(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function readResponsesFromStorage(storage) {
        if (!storage || typeof storage.getItem !== 'function') {
            return { responses: {}, available: false, malformed: false };
        }
        var raw;
        try {
            raw = storage.getItem(RESPONSES_KEY);
        } catch (err) {
            return { responses: {}, available: false, malformed: false };
        }
        if (raw == null || raw === '') {
            return { responses: {}, available: true, malformed: false };
        }
        try {
            var parsed = JSON.parse(raw);
            if (!isPlainObject(parsed)) {
                return { responses: {}, available: true, malformed: true };
            }
            return { responses: parsed, available: true, malformed: false };
        } catch (err) {
            return { responses: {}, available: true, malformed: true };
        }
    }

    function writeResponsesToStorage(storage, responses) {
        if (!storage || typeof storage.setItem !== 'function') {
            return false;
        }
        try {
            storage.setItem(RESPONSES_KEY, JSON.stringify(responses));
            return true;
        } catch (err) {
            return false;
        }
    }

    function siblingNewKeysHaveValues(store, group) {
        var lessonIds = Object.keys(group.newByLesson);
        for (var i = 0; i < lessonIds.length; i++) {
            var jsonIds = group.newByLesson[lessonIds[i]];
            for (var j = 0; j < jsonIds.length; j++) {
                var runtimeId = questionRuntimeId(group.course, jsonIds[j]);
                if (group.oldJsonIds.indexOf(jsonIds[j]) !== -1) {
                    continue;
                }
                if (hasOwn(store, runtimeId) && store[runtimeId] !== '' && store[runtimeId] != null) {
                    return true;
                }
            }
        }
        return false;
    }

    function recordAmbiguousValue(recovery, oldKey, value, group) {
        if (hasOwn(recovery.items, oldKey)) {
            return false;
        }
        recovery.items[oldKey] = {
            value: value,
            candidateLessons: group.candidateLessons.slice(),
            status: 'ambiguous',
            note: 'Shared before unique IDs. Lesson unknown. Not copied into either lesson.'
        };
        return true;
    }

    /**
     * Copy old shared values into an explicit recovery object. Do not write them
     * into either lesson's new keys. Vacate a live old key only when that key is
     * still a current identity (203-07) and the sibling lesson has no new values
     * that would imply the split already happened.
     */
    function migrateSharedQuestionResponses(inputStore) {
        if (!isPlainObject(inputStore)) {
            return {
                responses: {},
                changed: false,
                alreadyApplied: false,
                malformed: true
            };
        }

        var store = cloneJson(inputStore);
        var alreadyApplied = store[MIGRATION_FLAG] === true;
        if (alreadyApplied) {
            return {
                responses: store,
                changed: false,
                alreadyApplied: true,
                malformed: false
            };
        }

        var changed = false;
        var recovery = isPlainObject(store[RECOVERY_KEY]) ? cloneJson(store[RECOVERY_KEY]) : {};
        if (!isPlainObject(recovery.items)) {
            recovery = {
                version: 1,
                items: isPlainObject(recovery.items) ? recovery.items : {}
            };
        }
        recovery.version = 1;
        if (!isPlainObject(recovery.items)) {
            recovery.items = {};
        }

        for (var g = 0; g < SHARED_QUESTION_GROUPS.length; g++) {
            var group = SHARED_QUESTION_GROUPS[g];
            var siblingHasNew = siblingNewKeysHaveValues(store, group);

            for (var i = 0; i < group.oldJsonIds.length; i++) {
                var oldJsonId = group.oldJsonIds[i];
                var oldKey = questionRuntimeId(group.course, oldJsonId);
                if (!hasOwn(store, oldKey)) {
                    continue;
                }
                var oldValue = store[oldKey];
                if (oldValue == null || oldValue === '') {
                    continue;
                }

                if (recordAmbiguousValue(recovery, oldKey, oldValue, group)) {
                    changed = true;
                }

                var lessonIds = Object.keys(group.newByLesson);
                for (var L = 0; L < lessonIds.length; L++) {
                    var newJsonId = group.newByLesson[lessonIds[L]][i];
                    var newKey = questionRuntimeId(group.course, newJsonId);
                    if (newKey === oldKey) {
                        continue;
                    }
                    if (!hasOwn(store, newKey)) {
                        continue;
                    }
                    // Existing new values stay. Never copy the shared value here.
                }

                if (group.vacateOldKey && !siblingHasNew) {
                    delete store[oldKey];
                    changed = true;
                }
            }
        }

        store[RECOVERY_KEY] = recovery;
        store[MIGRATION_FLAG] = true;
        changed = true;

        return {
            responses: store,
            changed: changed,
            alreadyApplied: false,
            malformed: false
        };
    }

    function loadAndMigrateResponses(storage) {
        var read = readResponsesFromStorage(storage);
        // An unreadable copy may still contain recoverable answers. Leave it
        // untouched, and let the host block later autosaves for this session.
        if (!read.available || read.malformed) {
            return {
                responses: {}, available: read.available, malformed: read.malformed,
                changed: false, alreadyApplied: false
            };
        }
        var migrated = migrateSharedQuestionResponses(read.responses);
        if (read.available && migrated.changed) {
            writeResponsesToStorage(storage, migrated.responses);
        }
        return {
            responses: migrated.responses,
            available: read.available,
            malformed: read.malformed,
            changed: migrated.changed,
            alreadyApplied: migrated.alreadyApplied
        };
    }

    function collectRuntimeIdsFromLesson(courseId, lessonData) {
        var ids = [];
        if (!isPlainObject(lessonData) || !Array.isArray(lessonData.blocks)) {
            return ids;
        }
        for (var i = 0; i < lessonData.blocks.length; i++) {
            var block = lessonData.blocks[i];
            if (!block || typeof block.id !== 'string' || !block.id) {
                continue;
            }
            if (block.type === 'question') {
                ids.push(questionRuntimeId(courseId, block.id));
            } else if (block.type === 'checklist') {
                ids.push(checklistRuntimeId(courseId, block.id));
            }
        }
        return ids;
    }

    function findDuplicateRuntimeIds(courseLessons) {
        var seen = {};
        var duplicates = [];
        for (var i = 0; i < courseLessons.length; i++) {
            var entry = courseLessons[i];
            var ids = collectRuntimeIdsFromLesson(entry.courseId, entry.lesson);
            for (var j = 0; j < ids.length; j++) {
                var id = ids[j];
                if (seen[id]) {
                    duplicates.push({
                        id: id,
                        lessons: [seen[id], entry.lessonId]
                    });
                } else {
                    seen[id] = entry.lessonId;
                }
            }
        }
        return duplicates;
    }

    return {
        RESPONSES_KEY: RESPONSES_KEY,
        RECOVERY_KEY: RECOVERY_KEY,
        MIGRATION_FLAG: MIGRATION_FLAG,
        SHARED_QUESTION_GROUPS: SHARED_QUESTION_GROUPS,
        questionRuntimeId: questionRuntimeId,
        checklistRuntimeId: checklistRuntimeId,
        readResponsesFromStorage: readResponsesFromStorage,
        writeResponsesToStorage: writeResponsesToStorage,
        migrateSharedQuestionResponses: migrateSharedQuestionResponses,
        loadAndMigrateResponses: loadAndMigrateResponses,
        collectRuntimeIdsFromLesson: collectRuntimeIdsFromLesson,
        findDuplicateRuntimeIds: findDuplicateRuntimeIds
    };
}));
