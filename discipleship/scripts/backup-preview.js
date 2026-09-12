/**
 * Growing Together backup validation and read-only restore preview for ENG-006b.
 * Works in the browser (global GrowingTogetherBackupPreview) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * This module validates a user-selected local file and builds a preview.
 * It does not write storage, apply a restore, open mail, choose accounts
 * or upload data. Confirmed restore writes remain ENG-006c.
 * Format contract: scripts/backup-format.md
 */
(function (root, factory) {
    var download = root.GrowingTogetherBackupDownload;
    if (!download && typeof require === 'function') {
        try {
            download = require('./backup-download.js');
        } catch (err) {
            download = null;
        }
    }
    var api = factory(download);
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherBackupPreview = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (download) {
    var KIND = 'growing-together-backup';
    var FORMAT_VERSION = 1;
    var RECOVERY_KIND = 'growing-together-in-memory-recovery';
    var RECOVERY_KEY = '__gtAmbiguousSharedAnswers';
    var MIGRATION_FLAG = '__gtSharedKeyMigrationV1';
    var MAX_BACKUP_BYTES = 1048576;
    var MAX_TREE_DEPTH = 12;
    var STORE_ORDER = ['answers', 'completion', 'reading'];
    var STORE_KEYS = download && download.STORE_KEYS ? download.STORE_KEYS : {
        answers: 'christianFoundationsResponses',
        completion: 'foundationsCompletionData',
        reading: 'foundationsReadingData'
    };
    var STORE_NOUNS = {
        answers: 'Lesson answers',
        completion: 'Lesson completion',
        reading: 'Reading notes'
    };
    function isDangerousKey(key) {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }
    var LOAD_STATES = {
        ok: true,
        malformed: true,
        unavailable: true
    };

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function hasOwn(obj, key) {
        return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
    }

    function cloneJson(value) {
        if (value === undefined) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(value));
    }

    function isInternalKey(key) {
        if (download && typeof download.isInternalKey === 'function') {
            return download.isInternalKey(key);
        }
        return key === RECOVERY_KEY || key === MIGRATION_FLAG ||
            (typeof key === 'string' && key.indexOf('__gt') === 0);
    }

    function countStoreKeys(storeId, data) {
        if (download && typeof download.countStoreKeys === 'function') {
            return download.countStoreKeys(storeId, data);
        }
        return { keys: isPlainObject(data) ? Object.keys(data).filter(function (key) {
            return !isInternalKey(key);
        }).length : 0 };
    }

    function ownNames(value) {
        if (!value || typeof value !== 'object') {
            return [];
        }
        return Object.getOwnPropertyNames(value);
    }

    function fail(code, message, extra) {
        var result = {
            ok: false,
            code: code,
            message: message
        };
        if (extra) {
            Object.keys(extra).forEach(function (key) {
                result[key] = extra[key];
            });
        }
        return result;
    }

    function looksLikeJsonFilename(name) {
        return typeof name === 'string' && /\.json$/i.test(name);
    }

    function looksLikeOriginalCopyName(name) {
        if (typeof name !== 'string') {
            return false;
        }
        var lower = name.toLowerCase();
        return lower.indexOf('original-storage') !== -1 ||
            lower.indexOf('growing-together-original') !== -1;
    }

    function looksLikeRecoveryFilename(name) {
        if (typeof name !== 'string') {
            return false;
        }
        return /growing-together-(answers|completion|reading)-recovery\.json$/i.test(name);
    }

    function inspectSelectedFile(fileMeta) {
        var meta = fileMeta || {};
        var name = typeof meta.name === 'string' ? meta.name : '';
        var size = typeof meta.size === 'number' && isFinite(meta.size) ? meta.size : null;
        if (size == null) {
            return fail('unknown-size', 'Could not read the file size before opening it. Choose a local Growing Together backup JSON file.');
        }
        if (size <= 0) {
            return fail('empty', 'That file is empty. Choose a Growing Together backup JSON file.');
        }
        if (size > MAX_BACKUP_BYTES) {
            return fail('oversized', 'That file is too large to preview. Backups must be 1 MB or smaller (1,048,576 bytes). This file was not read or parsed.');
        }
        if (looksLikeOriginalCopyName(name)) {
            return fail('original-copy', 'That file looks like an older original storage copy, not a versioned Growing Together backup. It cannot be previewed as a restore source.');
        }
        if (name && !looksLikeJsonFilename(name)) {
            return fail('unsupported-type', 'Choose a .json Growing Together backup file. Other file types are not previewed.');
        }
        return {
            ok: true,
            name: name,
            size: size,
            recoveryFilename: looksLikeRecoveryFilename(name)
        };
    }

    function assertSafeTree(value, path, depth) {
        if (depth > MAX_TREE_DEPTH) {
            return fail('invalid-structure', 'That backup nests objects too deeply to preview safely (' + path + ').');
        }
        if (value == null || typeof value === 'string' || typeof value === 'boolean') {
            return { ok: true };
        }
        if (typeof value === 'number') {
            if (!isFinite(value)) {
                return fail('invalid-type', 'That backup contains a non-finite number at ' + path + '.');
            }
            return { ok: true };
        }
        if (typeof value !== 'object') {
            return fail('invalid-type', 'That backup contains an unsupported value at ' + path + '.');
        }
        var names = ownNames(value);
        for (var i = 0; i < names.length; i++) {
            var key = names[i];
            if (isDangerousKey(key)) {
                return fail('dangerous-key', 'That backup contains an unsafe object key (' + key + ') and was rejected.');
            }
            var child = assertSafeTree(value[key], path + (Array.isArray(value) ? '[' + key + ']' : '.' + key), depth + 1);
            if (!child.ok) {
                return child;
            }
        }
        return { ok: true };
    }

    function classifyKnownKey(storeId, key) {
        if (typeof key !== 'string' || isInternalKey(key)) {
            return null;
        }
        if (storeId === 'answers') {
            if (key.indexOf('question-') === 0) return 'question';
            if (key.indexOf('checklist-') === 0) return 'checklist';
            if (key.indexOf('commitment-') === 0) return 'commitment';
            return 'unknown';
        }
        if (storeId === 'completion') {
            if (key.indexOf('complete-') === 0) return 'complete';
            return 'unknown';
        }
        if (key.indexOf('notes-') === 0) return 'notes';
        if (key.indexOf('check-') === 0) return 'check';
        return 'unknown';
    }

    function isJsonValue(value) {
        if (value == null) {
            return true;
        }
        var type = typeof value;
        if (type === 'string' || type === 'boolean') {
            return true;
        }
        if (type === 'number') {
            return isFinite(value);
        }
        if (Array.isArray(value)) {
            return value.every(isJsonValue);
        }
        if (isPlainObject(value)) {
            return ownNames(value).every(function (key) {
                return isJsonValue(value[key]);
            });
        }
        return false;
    }

    function validateAmbiguousItems(items, path) {
        if (!isPlainObject(items)) {
            return fail('invalid-type', 'Ambiguous-answer items must be an object at ' + path + '.');
        }
        var keys = Object.keys(items);
        var normalized = {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = items[key];
            if (!isPlainObject(item)) {
                return fail('invalid-type', 'Ambiguous item ' + key + ' must be an object.');
            }
            if (hasOwn(item, 'candidateLessons') && !Array.isArray(item.candidateLessons)) {
                return fail('invalid-type', 'Ambiguous item ' + key + ' candidateLessons must be an array.');
            }
            var lessons = Array.isArray(item.candidateLessons) ? item.candidateLessons.slice() : [];
            for (var j = 0; j < lessons.length; j++) {
                if (typeof lessons[j] !== 'string') {
                    return fail('invalid-type', 'Ambiguous item ' + key + ' candidate lessons must be strings.');
                }
            }
            if (hasOwn(item, 'status') && item.status !== 'ambiguous') {
                return fail('invalid-type', 'Ambiguous item ' + key + ' must keep status "ambiguous". Lesson attribution is not inferred.');
            }
            normalized[key] = {
                value: item.value,
                candidateLessons: lessons,
                status: 'ambiguous',
                note: typeof item.note === 'string' ? item.note : 'Shared before unique IDs. Lesson unknown. Not assigned automatically.'
            };
        }
        return { ok: true, items: normalized };
    }

    function validateStoreData(storeId, data) {
        if (!isPlainObject(data)) {
            return fail('invalid-type', STORE_NOUNS[storeId] + ' data must be a JSON object.');
        }
        var keys = Object.keys(data);
        var unknownKeys = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            if (key === MIGRATION_FLAG) {
                if (typeof value !== 'boolean') {
                    return fail('invalid-type', 'The migration flag must be true or false.');
                }
                continue;
            }
            if (key === RECOVERY_KEY) {
                if (!isPlainObject(value)) {
                    return fail('invalid-type', 'Retained ambiguous-answer metadata must be an object.');
                }
                if (hasOwn(value, 'version') && typeof value.version !== 'number') {
                    return fail('invalid-type', 'Ambiguous-answer version must be a number when present.');
                }
                var itemsCheck = validateAmbiguousItems(hasOwn(value, 'items') ? value.items : {}, 'stores.' + storeId + '.data.' + RECOVERY_KEY + '.items');
                if (!itemsCheck.ok) {
                    return itemsCheck;
                }
                continue;
            }
            var kind = classifyKnownKey(storeId, key);
            if (kind === 'question' || kind === 'commitment' || kind === 'notes') {
                if (typeof value !== 'string') {
                    return fail('invalid-type', 'Key ' + key + ' must be a string, including an empty string.');
                }
                continue;
            }
            if (kind === 'checklist') {
                if (!Array.isArray(value) || !value.every(function (item) {
                    return typeof item === 'number' && isFinite(item);
                })) {
                    return fail('invalid-type', 'Key ' + key + ' must be an array of numbers.');
                }
                continue;
            }
            if (kind === 'complete' || kind === 'check') {
                if (typeof value !== 'boolean') {
                    return fail('invalid-type', 'Key ' + key + ' must be true or false.');
                }
                continue;
            }
            if (!isJsonValue(value)) {
                return fail('invalid-type', 'Unknown key ' + key + ' has an unsupported value type.');
            }
            unknownKeys.push(key);
        }
        return { ok: true, unknownKeys: unknownKeys };
    }

    function validateStore(storeId, store) {
        if (!isPlainObject(store)) {
            return fail('invalid-structure', 'Store "' + storeId + '" must be an object.');
        }
        if (hasOwn(store, 'id') && store.id !== storeId) {
            return fail('invalid-structure', 'Store "' + storeId + '" has a mismatched id.');
        }
        if (hasOwn(store, 'storageKey') && store.storageKey !== STORE_KEYS[storeId]) {
            return fail('invalid-structure', 'Store "' + storeId + '" has an unexpected storage key.');
        }
        if (hasOwn(store, 'loadState') && !LOAD_STATES[store.loadState]) {
            return fail('invalid-structure', 'Store "' + storeId + '" has an unsupported loadState.');
        }
        if (hasOwn(store, 'writable') && typeof store.writable !== 'boolean') {
            return fail('invalid-type', 'Store "' + storeId + '" writable must be true or false.');
        }
        if (hasOwn(store, 'includesUnsavedEdits') && typeof store.includesUnsavedEdits !== 'boolean') {
            return fail('invalid-type', 'Store "' + storeId + '" includesUnsavedEdits must be true or false.');
        }
        if (hasOwn(store, 'complete') && typeof store.complete !== 'boolean') {
            return fail('invalid-type', 'Store "' + storeId + '" complete must be true or false.');
        }
        if (hasOwn(store, 'emptyValid') && typeof store.emptyValid !== 'boolean') {
            return fail('invalid-type', 'Store "' + storeId + '" emptyValid must be true or false.');
        }
        if (hasOwn(store, 'originalRaw') && store.originalRaw != null && typeof store.originalRaw !== 'string') {
            return fail('invalid-type', 'Store "' + storeId + '" originalRaw must be a string or omitted. It is not parsed as learner data.');
        }
        var dataCheck = validateStoreData(storeId, hasOwn(store, 'data') ? store.data : {});
        if (!dataCheck.ok) {
            return dataCheck;
        }
        var loadState = LOAD_STATES[store.loadState] ? store.loadState : 'unavailable';
        if (!hasOwn(store, 'loadState')) {
            loadState = 'ok';
        }
        var derivedComplete = loadState === 'ok';
        var data = isPlainObject(store.data) ? store.data : {};
        var counts = countStoreKeys(storeId, data);
        var emptyValid = derivedComplete && counts.keys === 0;
        var originalRaw = (!derivedComplete && typeof store.originalRaw === 'string' && store.originalRaw !== '')
            ? store.originalRaw
            : null;
        return {
            ok: true,
            store: {
                id: storeId,
                storageKey: STORE_KEYS[storeId],
                loadState: loadState,
                writable: store.writable === true,
                includesUnsavedEdits: store.includesUnsavedEdits === true,
                complete: derivedComplete,
                emptyValid: emptyValid,
                dataRepresents: derivedComplete
                    ? 'current-memory-and-known-storage'
                    : 'current-memory-only-storage-unknown-or-unreadable',
                data: cloneJson(data),
                originalRawAvailable: originalRaw != null,
                originalRaw: originalRaw,
                counts: counts,
                unknownKeys: dataCheck.unknownKeys.slice(),
                claimedComplete: hasOwn(store, 'complete') ? store.complete : null,
                claimedEmptyValid: hasOwn(store, 'emptyValid') ? store.emptyValid : null,
                claimedCounts: isPlainObject(store.counts) ? cloneJson(store.counts) : null
            }
        };
    }

    function sameValue(left, right) {
        if (left === right) {
            return true;
        }
        if (left == null || right == null) {
            return left === right;
        }
        try {
            return JSON.stringify(left) === JSON.stringify(right);
        } catch (err) {
            return false;
        }
    }

    function learnerKeys(storeId, data) {
        if (!isPlainObject(data)) {
            return [];
        }
        return Object.keys(data).filter(function (key) {
            return !isInternalKey(key);
        });
    }

    function readAmbiguousFromData(answersData) {
        if (!isPlainObject(answersData) || !isPlainObject(answersData[RECOVERY_KEY])) {
            return { version: 1, items: {} };
        }
        var recovery = answersData[RECOVERY_KEY];
        var items = isPlainObject(recovery.items) ? cloneJson(recovery.items) : {};
        Object.keys(items).forEach(function (key) {
            if (!isPlainObject(items[key])) {
                return;
            }
            items[key].status = 'ambiguous';
            if (!Array.isArray(items[key].candidateLessons)) {
                items[key].candidateLessons = [];
            }
        });
        return {
            version: typeof recovery.version === 'number' ? recovery.version : 1,
            items: items
        };
    }

    function distinguishNonBackup(parsed, fileMeta) {
        var name = fileMeta && fileMeta.name ? fileMeta.name : '';
        if (isPlainObject(parsed) && parsed.kind === RECOVERY_KIND) {
            return fail('recovery-snapshot', 'That file is an older in-memory recovery snapshot, not a versioned Growing Together backup. It cannot be previewed as a restore source.');
        }
        if (looksLikeRecoveryFilename(name)) {
            return fail('recovery-snapshot', 'That filename is an older per-store recovery download, not a versioned Growing Together backup. It cannot be previewed as a restore source.');
        }
        if (looksLikeOriginalCopyName(name)) {
            return fail('original-copy', 'That file looks like an older original storage copy, not a versioned Growing Together backup.');
        }
        if (isPlainObject(parsed) && typeof parsed.kind === 'string' && parsed.kind !== KIND) {
            return fail('unsupported-kind', 'That file has an unsupported kind (' + parsed.kind + '). Only growing-together-backup version 1 can be previewed.');
        }
        if (isPlainObject(parsed) && !hasOwn(parsed, 'kind')) {
            var maybeStoreKeys = Object.keys(parsed).some(function (key) {
                return key.indexOf('question-') === 0 || key.indexOf('complete-') === 0 ||
                    key.indexOf('notes-') === 0 || key === MIGRATION_FLAG;
            });
            if (maybeStoreKeys) {
                return fail('original-copy', 'That JSON looks like a raw storage copy, not a versioned Growing Together backup. It cannot be previewed as a restore source.');
            }
            return fail('unsupported-kind', 'That JSON file is not a Growing Together versioned backup. It has no backup kind.');
        }
        if (!isPlainObject(parsed)) {
            return fail('invalid-structure', 'A Growing Together backup must be a JSON object.');
        }
        return null;
    }

    function countsMismatch(claimed, derived) {
        if (!isPlainObject(claimed) || !isPlainObject(derived)) {
            return false;
        }
        return Object.keys(derived).some(function (key) {
            if (isPlainObject(derived[key]) && isPlainObject(claimed[key])) {
                return countsMismatch(claimed[key], derived[key]);
            }
            return claimed[key] !== derived[key];
        });
    }

    function compareStore(storeId, backupData, deviceData) {
        var backupKeys = learnerKeys(storeId, backupData);
        var deviceKeys = learnerKeys(storeId, deviceData);
        var backupOnly = [];
        var deviceOnly = [];
        var matching = [];
        var conflicts = [];
        backupKeys.forEach(function (key) {
            if (!hasOwn(deviceData, key)) {
                backupOnly.push(key);
                return;
            }
            if (sameValue(backupData[key], deviceData[key])) {
                matching.push(key);
            } else {
                conflicts.push(key);
            }
        });
        deviceKeys.forEach(function (key) {
            if (!hasOwn(backupData, key)) {
                deviceOnly.push(key);
            }
        });
        return {
            backupOnly: backupOnly,
            deviceOnly: deviceOnly,
            matching: matching,
            conflicts: conflicts
        };
    }

    function selectionText(summary) {
        return 'Proposed future restore, not applied: add ' + summary.backupOnly +
            ' backup-only key(s), retain ' + summary.deviceOnly +
            ' device-only key(s), leave ' + summary.matching +
            ' matching key(s) unchanged, and hold ' + summary.conflicts +
            ' conflict(s) for a later choice (default keep the current device value). Unknown keys stay stored without a lesson assignment. Ambiguous answers stay unassigned. Unreadable originalRaw stays evidence only.';
    }

    function buildPreview(validated, currentDevice) {
        var device = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        var inconsistencies = validated.inconsistencies.slice();
        var storePreviews = {};
        var totals = {
            backupOnly: 0,
            deviceOnly: 0,
            matching: 0,
            conflicts: 0,
            unknownKeys: 0
        };
        var unknownKeys = [];
        var conflictKeys = [];
        STORE_ORDER.forEach(function (id) {
            var store = validated.stores[id];
            var deviceStore = isPlainObject(device[id]) ? device[id] : {};
            var deviceData = isPlainObject(deviceStore.data) ? deviceStore.data : {};
            var compared = compareStore(id, store.data, deviceData);
            storePreviews[id] = {
                id: id,
                noun: STORE_NOUNS[id],
                loadState: store.loadState,
                complete: store.complete,
                emptyValid: store.emptyValid,
                includesUnsavedEdits: store.includesUnsavedEdits,
                dataRepresents: store.dataRepresents,
                counts: store.counts,
                unknownKeys: store.unknownKeys.slice(),
                originalRawAvailable: store.originalRawAvailable,
                comparison: compared
            };
            totals.backupOnly += compared.backupOnly.length;
            totals.deviceOnly += compared.deviceOnly.length;
            totals.matching += compared.matching.length;
            totals.conflicts += compared.conflicts.length;
            totals.unknownKeys += store.unknownKeys.length;
            store.unknownKeys.forEach(function (key) {
                unknownKeys.push(id + ':' + key);
            });
            compared.conflicts.forEach(function (key) {
                conflictKeys.push(id + ':' + key);
            });
        });
        var ambiguousKeys = Object.keys(validated.ambiguous.items);
        var originalRawStores = STORE_ORDER.filter(function (id) {
            return validated.stores[id].originalRawAvailable;
        });
        var partialStores = STORE_ORDER.filter(function (id) {
            return !validated.stores[id].complete;
        });
        var unsavedStores = STORE_ORDER.filter(function (id) {
            return validated.stores[id].includesUnsavedEdits;
        });
        var couldRestore = [];
        var couldNotRestore = [];
        STORE_ORDER.forEach(function (id) {
            var store = validated.stores[id];
            if (store.complete) {
                couldRestore.push(STORE_NOUNS[id] + ' included in this file (' + store.counts.keys + ' learner key(s))');
            } else {
                couldRestore.push(STORE_NOUNS[id] + ' current-page values included in this file only (' + store.counts.keys + ' key(s))');
                couldNotRestore.push(STORE_NOUNS[id] + ' data that was unreadable on the source device');
            }
            if (store.originalRawAvailable) {
                couldNotRestore.push(STORE_NOUNS[id] + ' originalRaw bytes (kept as evidence, not parsed into answers)');
            }
        });
        if (!validated.complete) {
            couldNotRestore.push('Any inaccessible stored data that this partial file never contained');
        }
        if (ambiguousKeys.length) {
            couldRestore.push('Retained ambiguous answers as inspectable metadata, still unassigned');
            couldNotRestore.push('Automatic lesson assignment for retained ambiguous answers');
        }
        couldNotRestore.push('An applied restore. Applying a backup is not available yet.');
        var status = validated.complete
            ? (validated.includesUnsavedEdits
                ? 'This version 1 backup is readable and includes unsaved edits from the source page.'
                : 'This version 1 backup is readable.')
            : 'This version 1 backup is partial. At least one store could not be read on the source device.';
        return {
            ok: true,
            code: 'preview',
            kind: KIND,
            formatVersion: FORMAT_VERSION,
            exportedAt: validated.exportedAt,
            filename: validated.filename || '',
            complete: validated.complete,
            includesUnsavedEdits: validated.includesUnsavedEdits,
            partialStores: partialStores,
            unsavedStores: unsavedStores,
            counts: validated.counts,
            inconsistencies: inconsistencies,
            stores: storePreviews,
            unknownKeys: unknownKeys,
            conflictKeys: conflictKeys,
            comparisonTotals: totals,
            ambiguousAnswers: {
                present: ambiguousKeys.length > 0,
                count: ambiguousKeys.length,
                items: validated.ambiguous.items,
                note: 'Shared before unique IDs. Lesson unknown. Not assigned automatically.'
            },
            originalRawStores: originalRawStores,
            selection: selectionText(totals),
            couldRestore: couldRestore,
            couldNotRestore: couldNotRestore,
            status: status,
            applyAvailable: false,
            applyNote: 'Applying a backup is not available yet. This preview does not change answers, completion, reading notes, migration flags or write guards.'
        };
    }

    function validateParsedBackup(parsed, fileMeta) {
        var distinguished = distinguishNonBackup(parsed, fileMeta);
        if (distinguished) {
            return distinguished;
        }
        if (parsed.formatVersion !== FORMAT_VERSION) {
            return fail('unsupported-version', 'This file is format version ' + String(parsed.formatVersion) +
                ', which this page cannot preview. Only version 1 is supported.');
        }
        if (hasOwn(parsed, 'exportedAt') && parsed.exportedAt != null && typeof parsed.exportedAt !== 'string') {
            return fail('invalid-type', 'exportedAt must be a string when present.');
        }
        if (hasOwn(parsed, 'complete') && typeof parsed.complete !== 'boolean') {
            return fail('invalid-type', 'complete must be true or false when present.');
        }
        if (hasOwn(parsed, 'includesUnsavedEdits') && typeof parsed.includesUnsavedEdits !== 'boolean') {
            return fail('invalid-type', 'includesUnsavedEdits must be true or false when present.');
        }
        if (!isPlainObject(parsed.stores)) {
            return fail('invalid-structure', 'A version 1 backup must include a stores object with answers, completion and reading.');
        }
        var stores = {};
        for (var i = 0; i < STORE_ORDER.length; i++) {
            var id = STORE_ORDER[i];
            if (!hasOwn(parsed.stores, id)) {
                return fail('invalid-structure', 'A version 1 backup must include the ' + id + ' store.');
            }
            var storeCheck = validateStore(id, parsed.stores[id]);
            if (!storeCheck.ok) {
                return storeCheck;
            }
            stores[id] = storeCheck.store;
        }
        var extraStoreIds = Object.keys(parsed.stores).filter(function (id) {
            return STORE_ORDER.indexOf(id) === -1;
        });
        var derivedAmbiguous = readAmbiguousFromData(stores.answers.data);
        var derivedComplete = STORE_ORDER.every(function (id) {
            return stores[id].complete;
        });
        var derivedUnsaved = STORE_ORDER.some(function (id) {
            return stores[id].includesUnsavedEdits;
        });
        var derivedCounts = {
            answers: stores.answers.counts,
            completion: stores.completion.counts,
            reading: stores.reading.counts,
            ambiguousAnswers: Object.keys(derivedAmbiguous.items).length
        };
        var inconsistencies = [];
        if (hasOwn(parsed, 'complete') && parsed.complete !== derivedComplete) {
            inconsistencies.push('The file claimed complete=' + parsed.complete +
                ' but validated store load states make complete=' + derivedComplete + '.');
        }
        if (hasOwn(parsed, 'includesUnsavedEdits') && parsed.includesUnsavedEdits !== derivedUnsaved) {
            inconsistencies.push('The file claimed includesUnsavedEdits=' + parsed.includesUnsavedEdits +
                ' but the store flags make that ' + derivedUnsaved + '.');
        }
        if (isPlainObject(parsed.counts) && countsMismatch(parsed.counts, derivedCounts)) {
            inconsistencies.push('Claimed counts do not match the validated store data. Preview uses derived counts.');
        }
        STORE_ORDER.forEach(function (id) {
            var store = stores[id];
            if (store.claimedComplete != null && store.claimedComplete !== store.complete) {
                inconsistencies.push(STORE_NOUNS[id] + ' claimed complete=' + store.claimedComplete +
                    ' but loadState ' + store.loadState + ' makes complete=' + store.complete + '.');
            }
            if (store.claimedEmptyValid != null && store.claimedEmptyValid !== store.emptyValid) {
                inconsistencies.push(STORE_NOUNS[id] + ' claimed emptyValid=' + store.claimedEmptyValid +
                    ' but validated data makes emptyValid=' + store.emptyValid + '.');
            }
            if (store.claimedCounts && countsMismatch(store.claimedCounts, store.counts)) {
                inconsistencies.push(STORE_NOUNS[id] + ' claimed counts do not match its validated data.');
            }
        });
        if (isPlainObject(parsed.ambiguousAnswers)) {
            var claimedCount = parsed.ambiguousAnswers.count;
            var derivedCount = Object.keys(derivedAmbiguous.items).length;
            if (typeof claimedCount === 'number' && claimedCount !== derivedCount) {
                inconsistencies.push('Claimed ambiguousAnswers.count is ' + claimedCount +
                    ' but validated answers data has ' + derivedCount + '.');
            }
            if (isPlainObject(parsed.ambiguousAnswers.items)) {
                var claimedKeys = Object.keys(parsed.ambiguousAnswers.items).sort().join(',');
                var derivedKeys = Object.keys(derivedAmbiguous.items).sort().join(',');
                if (claimedKeys !== derivedKeys) {
                    inconsistencies.push('Duplicated ambiguousAnswers items do not match the retained metadata inside answers data. Preview uses the answers-data copy.');
                }
            }
        }
        if (extraStoreIds.length) {
            inconsistencies.push('Unknown store id(s) were ignored and not assigned: ' + extraStoreIds.join(', ') + '.');
        }
        return {
            ok: true,
            filename: fileMeta && fileMeta.name ? fileMeta.name : '',
            exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
            complete: derivedComplete,
            includesUnsavedEdits: derivedUnsaved,
            counts: derivedCounts,
            stores: stores,
            ambiguous: derivedAmbiguous,
            inconsistencies: inconsistencies
        };
    }

    function parseAndValidate(text, fileMeta) {
        var inspect = inspectSelectedFile({
            name: fileMeta && fileMeta.name,
            size: fileMeta && typeof fileMeta.size === 'number' ? fileMeta.size : (typeof text === 'string' ? text.length : 0),
            type: fileMeta && fileMeta.type
        });
        if (!inspect.ok) {
            return inspect;
        }
        if (typeof text !== 'string') {
            return fail('malformed-json', 'That backup could not be read as text.');
        }
        if (text.length > MAX_BACKUP_BYTES) {
            return fail('oversized', 'That file is too large to preview. Backups must be 1 MB or smaller (1,048,576 bytes). This file was not parsed.');
        }
        var parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            return fail('malformed-json', 'That file is not valid JSON, so it cannot be previewed as a backup.');
        }
        var safe = assertSafeTree(parsed, 'backup', 0);
        if (!safe.ok) {
            return safe;
        }
        return validateParsedBackup(parsed, {
            name: inspect.name || (fileMeta && fileMeta.name) || ''
        });
    }

    function previewFromText(text, fileMeta, currentDevice) {
        var validated = parseAndValidate(text, fileMeta || {});
        if (!validated.ok) {
            return validated;
        }
        return buildPreview(validated, currentDevice || {});
    }

    function previewStatusText(result) {
        if (!result) {
            return 'Could not preview that file.';
        }
        if (!result.ok) {
            return result.message || 'That file cannot be previewed.';
        }
        return result.status + ' ' + result.applyNote;
    }

    return {
        KIND: KIND,
        FORMAT_VERSION: FORMAT_VERSION,
        RECOVERY_KIND: RECOVERY_KIND,
        MAX_BACKUP_BYTES: MAX_BACKUP_BYTES,
        inspectSelectedFile: inspectSelectedFile,
        parseAndValidate: parseAndValidate,
        previewFromText: previewFromText,
        previewStatusText: previewStatusText,
        buildPreview: buildPreview
    };
}));
