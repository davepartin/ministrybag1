/**
 * Growing Together versioned backup helpers for ENG-006a.
 * Works in the browser (global GrowingTogetherBackupDownload) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * This module builds a local JSON download only. It does not write storage,
 * import files, open mail, choose accounts or upload data.
 * Format contract: scripts/backup-format.md
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherBackupDownload = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var KIND = 'growing-together-backup';
    var FORMAT_VERSION = 1;
    var RECOVERY_KEY = '__gtAmbiguousSharedAnswers';
    var MIGRATION_FLAG = '__gtSharedKeyMigrationV1';
    var STORE_ORDER = ['answers', 'completion', 'reading'];
    var STORE_KEYS = {
        answers: 'christianFoundationsResponses',
        completion: 'foundationsCompletionData',
        reading: 'foundationsReadingData'
    };
    var STORE_NOUNS = {
        answers: 'Lesson answers',
        completion: 'Lesson completion',
        reading: 'Reading notes'
    };

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function cloneJson(value) {
        if (!isPlainObject(value)) {
            return {};
        }
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (err) {
            return {};
        }
    }

    function isInternalKey(key) {
        return key === RECOVERY_KEY || key === MIGRATION_FLAG ||
            (typeof key === 'string' && key.indexOf('__gt') === 0);
    }

    function normalizeLoadState(value) {
        if (value === 'malformed' || value === 'unavailable' || value === 'ok') {
            return value;
        }
        return 'unavailable';
    }

    function classifyAnswerKey(key) {
        if (typeof key !== 'string' || isInternalKey(key)) {
            return null;
        }
        if (key.indexOf('question-') === 0) {
            return 'questions';
        }
        if (key.indexOf('checklist-') === 0) {
            return 'checklists';
        }
        if (key.indexOf('commitment-') === 0) {
            return 'commitments';
        }
        return 'other';
    }

    function classifyCompletionKey(key) {
        if (typeof key !== 'string' || isInternalKey(key)) {
            return null;
        }
        if (key.indexOf('complete-') === 0) {
            return 'flags';
        }
        return 'other';
    }

    function classifyReadingKey(key) {
        if (typeof key !== 'string' || isInternalKey(key)) {
            return null;
        }
        if (key.indexOf('notes-') === 0) {
            return 'notes';
        }
        if (key.indexOf('check-') === 0) {
            return 'checks';
        }
        return 'other';
    }

    function countStoreKeys(storeId, data) {
        var counts = { keys: 0 };
        if (storeId === 'answers') {
            counts.questions = 0;
            counts.checklists = 0;
            counts.commitments = 0;
            counts.other = 0;
        } else if (storeId === 'completion') {
            counts.flags = 0;
            counts.other = 0;
        } else {
            counts.notes = 0;
            counts.checks = 0;
            counts.other = 0;
        }
        if (!isPlainObject(data)) {
            return counts;
        }
        Object.keys(data).forEach(function (key) {
            var bucket = storeId === 'answers'
                ? classifyAnswerKey(key)
                : storeId === 'completion'
                    ? classifyCompletionKey(key)
                    : classifyReadingKey(key);
            if (!bucket) {
                return;
            }
            counts.keys += 1;
            counts[bucket] += 1;
        });
        return counts;
    }

    function learnerKeyCount(storeId, data) {
        return countStoreKeys(storeId, data).keys;
    }

    function readAmbiguousItems(answersData) {
        if (!isPlainObject(answersData) || !isPlainObject(answersData[RECOVERY_KEY])) {
            return { version: 1, items: {} };
        }
        var recovery = answersData[RECOVERY_KEY];
        var items = isPlainObject(recovery.items) ? cloneJson(recovery.items) : {};
        return {
            version: typeof recovery.version === 'number' ? recovery.version : 1,
            items: items
        };
    }

    function storeNote(storeId, loadState, includesUnsavedEdits, emptyValid, originalRawAvailable) {
        var noun = STORE_NOUNS[storeId] || storeId;
        if (loadState === 'malformed') {
            return noun + ' could not be read, so this store is partial. Current page values are included. The original unreadable copy was not replaced' +
                (originalRawAvailable ? ' and is retained with this backup.' : '.');
        }
        if (loadState === 'unavailable') {
            return noun + ' could not be read from storage, so this store is partial. Current page values are included. Unknown stored data is not treated as empty.';
        }
        if (includesUnsavedEdits) {
            return noun + ' include unsaved edits from this page.';
        }
        if (emptyValid) {
            return noun + ' loaded as valid empty data.';
        }
        return noun + ' from this page, including stored values.';
    }

    function buildStoreSnapshot(storeId, input) {
        var source = input || {};
        var loadState = normalizeLoadState(source.loadState);
        var complete = loadState === 'ok';
        var memory = isPlainObject(source.data) ? cloneJson(source.data) : {};
        var emptyValid = complete && learnerKeyCount(storeId, memory) === 0;
        var originalRawAvailable = source.originalRaw != null && String(source.originalRaw) !== '';
        var originalRaw = (!complete && originalRawAvailable) ? String(source.originalRaw) : null;
        var includesUnsavedEdits = source.includesUnsavedEdits === true;
        return {
            id: storeId,
            storageKey: STORE_KEYS[storeId],
            loadState: loadState,
            writable: source.writable === true,
            includesUnsavedEdits: includesUnsavedEdits,
            complete: complete,
            emptyValid: emptyValid,
            dataRepresents: complete
                ? 'current-memory-and-known-storage'
                : 'current-memory-only-storage-unknown-or-unreadable',
            data: memory,
            originalRawAvailable: originalRawAvailable,
            originalRaw: originalRaw,
            counts: countStoreKeys(storeId, memory),
            note: storeNote(storeId, loadState, includesUnsavedEdits, emptyValid, originalRawAvailable)
        };
    }

    function summarizeCounts(stores, ambiguousCount) {
        return {
            answers: stores.answers.counts,
            completion: stores.completion.counts,
            reading: stores.reading.counts,
            ambiguousAnswers: ambiguousCount
        };
    }

    function backupScopeText(envelope) {
        if (!envelope || !envelope.counts) {
            return '';
        }
        var counts = envelope.counts;
        var parts = [
            'Answers: ' + counts.answers.keys +
                ' (' + counts.answers.questions + ' questions, ' +
                counts.answers.checklists + ' checklists, ' +
                counts.answers.commitments + ' commitments)',
            'Completion: ' + counts.completion.flags + ' flags',
            'Reading: ' + counts.reading.notes + ' notes, ' + counts.reading.checks + ' checks'
        ];
        if (counts.ambiguousAnswers) {
            parts.push('Retained ambiguous answers: ' + counts.ambiguousAnswers);
        }
        if (envelope.includesUnsavedEdits) {
            parts.push('Includes unsaved edits from this page');
        }
        if (!envelope.complete) {
            parts.push('Partial: at least one store could not be read');
        }
        return parts.join('. ') + '.';
    }

    function backupStatusText(envelope) {
        if (!envelope) {
            return 'Could not build a backup.';
        }
        if (!envelope.complete) {
            return 'Downloaded a partial local backup. At least one store could not be read. The original recovery copy was kept and was not replaced. Restore is not available yet.';
        }
        if (envelope.includesUnsavedEdits) {
            return 'Downloaded a local backup that includes unsaved edits from this page. The file stays on this device. Restore is not available yet.';
        }
        return 'Downloaded a local backup of answers, completion and reading notes. The file stays on this device. Restore is not available yet.';
    }

    function buildBackupEnvelope(input) {
        var source = input || {};
        var storesIn = isPlainObject(source.stores) ? source.stores : {};
        var stores = {
            answers: buildStoreSnapshot('answers', storesIn.answers),
            completion: buildStoreSnapshot('completion', storesIn.completion),
            reading: buildStoreSnapshot('reading', storesIn.reading)
        };
        var ambiguous = readAmbiguousItems(stores.answers.data);
        var ambiguousKeys = Object.keys(ambiguous.items);
        var complete = STORE_ORDER.every(function (id) {
            return stores[id].complete;
        });
        var includesUnsavedEdits = STORE_ORDER.some(function (id) {
            return stores[id].includesUnsavedEdits;
        });
        return {
            kind: KIND,
            formatVersion: FORMAT_VERSION,
            exportedAt: typeof source.exportedAt === 'string' && source.exportedAt
                ? source.exportedAt
                : new Date().toISOString(),
            app: 'Growing Together',
            note: 'Local device backup of current page values. Not an upload, mail draft or restore. Import validation is ENG-006b. Restore writes are ENG-006c.',
            complete: complete,
            includesUnsavedEdits: includesUnsavedEdits,
            scope: {
                stores: STORE_ORDER.slice(),
                includesInMemoryEdits: true,
                description: 'All three on-device stores from the current page, including unsaved edits. Unknown storage is marked partial.'
            },
            counts: summarizeCounts(stores, ambiguousKeys.length),
            stores: stores,
            ambiguousAnswers: {
                present: ambiguousKeys.length > 0,
                count: ambiguousKeys.length,
                version: ambiguous.version,
                items: ambiguous.items,
                note: 'Shared before unique IDs. Lesson unknown. Not assigned automatically.'
            }
        };
    }

    function backupText(envelope) {
        return JSON.stringify(envelope, null, 2);
    }

    function backupFilename() {
        return 'growing-together-backup.json';
    }

    return {
        KIND: KIND,
        FORMAT_VERSION: FORMAT_VERSION,
        RECOVERY_KEY: RECOVERY_KEY,
        MIGRATION_FLAG: MIGRATION_FLAG,
        STORE_KEYS: STORE_KEYS,
        isInternalKey: isInternalKey,
        countStoreKeys: countStoreKeys,
        buildStoreSnapshot: buildStoreSnapshot,
        buildBackupEnvelope: buildBackupEnvelope,
        backupScopeText: backupScopeText,
        backupStatusText: backupStatusText,
        backupText: backupText,
        backupFilename: backupFilename
    };
}));
