/**
 * Growing Together confirmed restore helpers for ENG-006c.
 * Works in the browser (global GrowingTogetherBackupRestore) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * This module applies an explicit confirmed restore of a version 1 backup.
 * Partial source files stay preview-only. Writes are one transaction across
 * answers, completion and reading, with verification reads and rollback.
 * Format contract: scripts/backup-format.md
 */
(function (root, factory) {
    var download = root.GrowingTogetherBackupDownload;
    var preview = root.GrowingTogetherBackupPreview;
    if (!download && typeof require === 'function') {
        try {
            download = require('./backup-download.js');
        } catch (err) {
            download = null;
        }
    }
    if (!preview && typeof require === 'function') {
        try {
            preview = require('./backup-preview.js');
        } catch (err) {
            preview = null;
        }
    }
    var api = factory(download, preview);
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherBackupRestore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (download, preview) {
    var KIND = 'growing-together-backup';
    var FORMAT_VERSION = 1;
    var RECOVERY_KEY = '__gtAmbiguousSharedAnswers';
    var MIGRATION_FLAG = '__gtSharedKeyMigrationV1';
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
    var CHOICE_KEEP = 'keep-device';
    var CHOICE_BACKUP = 'use-backup';

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

    function fail(code, message, extra) {
        var result = {
            ok: false,
            code: code,
            message: message,
            unchanged: true
        };
        if (extra) {
            Object.keys(extra).forEach(function (key) {
                result[key] = extra[key];
            });
        }
        return result;
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

    function learnerKeys(data) {
        if (!isPlainObject(data)) {
            return [];
        }
        return Object.keys(data).filter(function (key) {
            return !isInternalKey(key);
        });
    }

    function displayValue(value) {
        if (typeof value === 'string') {
            return value;
        }
        try {
            return JSON.stringify(value);
        } catch (err) {
            return String(value);
        }
    }

    function sortChoices(choices) {
        var sorted = {};
        Object.keys(choices || {}).sort().forEach(function (key) {
            sorted[key] = choices[key];
        });
        return sorted;
    }

    function fileIdentity(sourceText, filename) {
        return JSON.stringify({
            filename: typeof filename === 'string' ? filename : '',
            text: typeof sourceText === 'string' ? sourceText : ''
        });
    }

    function emptyStoreBag() {
        return { answers: {}, completion: {}, reading: {} };
    }

    function snapshotFromDevice(currentDevice) {
        var stores = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        var memory = emptyStoreBag();
        var storageRaw = { answers: null, completion: null, reading: null };
        var loadReasons = { answers: null, completion: null, reading: null };
        var writable = { answers: false, completion: false, reading: false };
        STORE_ORDER.forEach(function (id) {
            var store = isPlainObject(stores[id]) ? stores[id] : {};
            memory[id] = isPlainObject(store.data) ? cloneJson(store.data) : {};
            storageRaw[id] = hasOwn(store, 'persistedRaw')
                ? store.persistedRaw
                : (store.storageRaw !== undefined ? store.storageRaw : null);
            loadReasons[id] = store.loadState && store.loadState !== 'ok' ? store.loadState : null;
            writable[id] = store.writable === true;
        });
        return {
            memory: memory,
            storageRaw: storageRaw,
            loadReasons: loadReasons,
            writable: writable
        };
    }

    function confirmationFingerprint(input) {
        var source = input || {};
        var snapshot = source.snapshot || snapshotFromDevice(source.currentDevice);
        return JSON.stringify({
            file: source.fileIdentity || fileIdentity(source.sourceText, source.filename),
            memory: snapshot.memory,
            storageRaw: snapshot.storageRaw,
            loadReasons: snapshot.loadReasons,
            writable: snapshot.writable
        });
    }

    function applyFingerprint(input) {
        var source = input || {};
        var base = JSON.parse(confirmationFingerprint(source));
        base.choices = sortChoices(source.choices);
        return JSON.stringify(base);
    }

    function fingerprintsMatch(left, right) {
        return left === right && typeof left === 'string' && left !== '';
    }

    function canConfirmPreview(previewResult) {
        return !!(previewResult && previewResult.ok === true &&
            previewResult.complete === true &&
            previewResult.kind === KIND &&
            previewResult.formatVersion === FORMAT_VERSION);
    }

    function deviceDataFor(currentDevice, storeId) {
        var stores = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        var store = isPlainObject(stores[storeId]) ? stores[storeId] : {};
        return isPlainObject(store.data) ? store.data : {};
    }

    function storeIsReadable(currentDevice, storeId) {
        var stores = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        var store = isPlainObject(stores[storeId]) ? stores[storeId] : {};
        if (!hasOwn(store, 'loadState') || store.loadState == null) {
            return true;
        }
        return store.loadState === 'ok';
    }

    function listConflicts(validated, currentDevice) {
        var items = [];
        if (!validated || !validated.stores) {
            return items;
        }
        STORE_ORDER.forEach(function (id) {
            var backupData = validated.stores[id].data;
            var deviceData = deviceDataFor(currentDevice, id);
            var backupKeys = learnerKeys(backupData);
            backupKeys.forEach(function (key) {
                if (!hasOwn(deviceData, key)) {
                    return;
                }
                if (sameValue(backupData[key], deviceData[key])) {
                    return;
                }
                items.push({
                    id: id + ':' + key,
                    storeId: id,
                    key: key,
                    noun: STORE_NOUNS[id],
                    deviceValue: cloneJson(deviceData[key]),
                    backupValue: cloneJson(backupData[key]),
                    deviceText: displayValue(deviceData[key]),
                    backupText: displayValue(backupData[key]),
                    destinationReadable: storeIsReadable(currentDevice, id),
                    kind: 'learner'
                });
            });
            if (id === 'answers') {
                var deviceAmb = isPlainObject(deviceData[RECOVERY_KEY]) && isPlainObject(deviceData[RECOVERY_KEY].items)
                    ? deviceData[RECOVERY_KEY].items
                    : {};
                var backupAmb = isPlainObject(backupData[RECOVERY_KEY]) && isPlainObject(backupData[RECOVERY_KEY].items)
                    ? backupData[RECOVERY_KEY].items
                    : {};
                Object.keys(backupAmb).forEach(function (key) {
                    if (!hasOwn(deviceAmb, key) || sameValue(deviceAmb[key], backupAmb[key])) {
                        return;
                    }
                    items.push({
                        id: 'ambiguous:' + key,
                        storeId: 'answers',
                        key: key,
                        noun: 'Retained ambiguous answers',
                        deviceValue: cloneJson(deviceAmb[key]),
                        backupValue: cloneJson(backupAmb[key]),
                        deviceText: displayValue(deviceAmb[key]),
                        backupText: displayValue(backupAmb[key]),
                        destinationReadable: storeIsReadable(currentDevice, 'answers'),
                        kind: 'ambiguous'
                    });
                });
            }
        });
        return items;
    }

    function choicesComplete(conflicts, choices) {
        var map = choices || {};
        if (!conflicts || !conflicts.length) {
            return true;
        }
        return conflicts.every(function (item) {
            return map[item.id] === CHOICE_KEEP || map[item.id] === CHOICE_BACKUP;
        });
    }

    function invalidChoice(conflicts, choices) {
        var map = choices || {};
        var ids = {};
        (conflicts || []).forEach(function (item) {
            ids[item.id] = true;
        });
        return Object.keys(map).some(function (id) {
            if (!ids[id]) {
                return false;
            }
            return map[id] !== CHOICE_KEEP && map[id] !== CHOICE_BACKUP;
        });
    }

    function mergeAmbiguous(deviceRecovery, backupRecovery, choices) {
        var deviceItems = isPlainObject(deviceRecovery) && isPlainObject(deviceRecovery.items)
            ? cloneJson(deviceRecovery.items)
            : {};
        var backupItems = isPlainObject(backupRecovery) && isPlainObject(backupRecovery.items)
            ? cloneJson(backupRecovery.items)
            : {};
        var items = {};
        Object.keys(deviceItems).forEach(function (key) {
            items[key] = deviceItems[key];
        });
        Object.keys(backupItems).forEach(function (key) {
            if (!hasOwn(items, key)) {
                items[key] = backupItems[key];
                return;
            }
            if (sameValue(items[key], backupItems[key])) {
                return;
            }
            var choice = choices['ambiguous:' + key];
            if (choice === CHOICE_BACKUP) {
                items[key] = backupItems[key];
            }
        });
        Object.keys(items).forEach(function (key) {
            if (isPlainObject(items[key])) {
                items[key].status = 'ambiguous';
            }
        });
        var version = 1;
        if (isPlainObject(backupRecovery) && typeof backupRecovery.version === 'number') {
            version = backupRecovery.version;
        } else if (isPlainObject(deviceRecovery) && typeof deviceRecovery.version === 'number') {
            version = deviceRecovery.version;
        }
        return {
            version: version,
            items: items
        };
    }

    function mergeStore(storeId, backupData, deviceData, choices) {
        var backup = isPlainObject(backupData) ? cloneJson(backupData) : {};
        var device = isPlainObject(deviceData) ? cloneJson(deviceData) : {};
        var result = {};
        Object.keys(device).forEach(function (key) {
            result[key] = cloneJson(device[key]);
        });
        learnerKeys(backup).forEach(function (key) {
            if (!hasOwn(device, key)) {
                result[key] = cloneJson(backup[key]);
                return;
            }
            if (sameValue(device[key], backup[key])) {
                return;
            }
            var choice = choices[storeId + ':' + key];
            if (choice === CHOICE_BACKUP) {
                result[key] = cloneJson(backup[key]);
            }
        });
        if (storeId === 'answers') {
            result[MIGRATION_FLAG] = device[MIGRATION_FLAG] === true || backup[MIGRATION_FLAG] === true;
            result[RECOVERY_KEY] = mergeAmbiguous(device[RECOVERY_KEY], backup[RECOVERY_KEY], choices);
            Object.keys(backup).forEach(function (key) {
                if (!isInternalKey(key) || key === MIGRATION_FLAG || key === RECOVERY_KEY) {
                    return;
                }
                if (!hasOwn(result, key)) {
                    result[key] = cloneJson(backup[key]);
                }
            });
        }
        return result;
    }

    function countOutcome(validated, currentDevice, choices, merged) {
        var restored = 0;
        var kept = 0;
        var conflictCount = 0;
        var backupOnly = 0;
        var deviceOnly = 0;
        var matching = 0;
        var useBackup = 0;
        var keepDevice = 0;
        STORE_ORDER.forEach(function (id) {
            var backupData = validated.stores[id].data;
            var deviceData = deviceDataFor(currentDevice, id);
            var backupKeys = learnerKeys(backupData);
            var deviceKeys = learnerKeys(deviceData);
            var seen = Object.create(null);
            backupKeys.forEach(function (key) {
                seen[key] = true;
                if (!hasOwn(deviceData, key)) {
                    backupOnly += 1;
                    restored += 1;
                    return;
                }
                if (sameValue(backupData[key], deviceData[key])) {
                    matching += 1;
                    kept += 1;
                    return;
                }
                conflictCount += 1;
                if (choices[id + ':' + key] === CHOICE_BACKUP) {
                    useBackup += 1;
                    restored += 1;
                } else {
                    keepDevice += 1;
                    kept += 1;
                }
            });
            deviceKeys.forEach(function (key) {
                if (seen[key]) {
                    return;
                }
                deviceOnly += 1;
                kept += 1;
            });
        });
        var ambiguousConflicts = listConflicts(validated, currentDevice).filter(function (item) {
            return item.kind === 'ambiguous';
        });
        conflictCount += ambiguousConflicts.length;
        ambiguousConflicts.forEach(function (item) {
            if (choices[item.id] === CHOICE_BACKUP) {
                useBackup += 1;
            } else {
                keepDevice += 1;
            }
        });
        return {
            restored: restored,
            kept: kept,
            conflicts: conflictCount,
            backupOnly: backupOnly,
            deviceOnly: deviceOnly,
            matching: matching,
            useBackup: useBackup,
            keepDevice: keepDevice,
            mergedKeyCounts: {
                answers: learnerKeys(merged.answers).length,
                completion: learnerKeys(merged.completion).length,
                reading: learnerKeys(merged.reading).length
            }
        };
    }

    function successCountsText(counts) {
        var c = counts || {};
        return 'Restored ' + (c.restored || 0) + ' from the backup, kept ' +
            (c.kept || 0) + ' device value(s), resolved ' +
            (c.conflicts || 0) + ' conflict(s).';
    }

    function safetyBackupFilename() {
        return 'growing-together-backup-before-restore.json';
    }

    function safetyStatusText(envelope) {
        var partial = envelope && envelope.complete === false
            ? ' At least one store could not be read, and that original evidence is included when it was captured.'
            : '';
        return 'A safety backup download was started. This page cannot prove the file was saved on your device. Confirm you have the file before restoring.' + partial;
    }

    function safetyIncludesGuardEvidence(safetyEnvelope, currentDevice) {
        if (!safetyEnvelope || !isPlainObject(safetyEnvelope.stores)) {
            return false;
        }
        var stores = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        for (var i = 0; i < STORE_ORDER.length; i++) {
            var id = STORE_ORDER[i];
            var dest = isPlainObject(stores[id]) ? stores[id] : {};
            var envStore = safetyEnvelope.stores[id];
            if (!envStore) {
                return false;
            }
            if (!sameValue(envStore.data, isPlainObject(dest.data) ? dest.data : {})) {
                return false;
            }
            var destState = dest.loadState && dest.loadState !== 'ok' ? dest.loadState : null;
            if (!destState) {
                continue;
            }
            var destRaw = dest.originalRaw != null && String(dest.originalRaw) !== ''
                ? String(dest.originalRaw)
                : null;
            if (destRaw != null) {
                if (typeof envStore.originalRaw !== 'string' || envStore.originalRaw !== destRaw) {
                    return false;
                }
            }
        }
        return true;
    }

    function classifyWriteError(err) {
        if (!err) {
            return 'write-failed';
        }
        var name = String(err.name || '');
        var message = String(err.message || '');
        if (name === 'QuotaExceededError' || /quota/i.test(message)) {
            return 'quota';
        }
        if (/blocked|denied|getter|unavailable/i.test(message)) {
            return 'unavailable';
        }
        return 'write-failed';
    }

    function readRaw(storage, key) {
        if (!storage || typeof storage.getItem !== 'function') {
            return { ok: false, raw: null, error: 'unavailable' };
        }
        try {
            return { ok: true, raw: storage.getItem(key) };
        } catch (err) {
            return { ok: false, raw: null, error: classifyWriteError(err) };
        }
    }

    function writeRaw(storage, key, serialized) {
        if (!storage || typeof storage.setItem !== 'function') {
            return { ok: false, error: 'unavailable' };
        }
        try {
            storage.setItem(key, serialized);
            return { ok: true };
        } catch (err) {
            return { ok: false, error: classifyWriteError(err) };
        }
    }

    function rawMatches(left, right) {
        if (left === right) {
            return true;
        }
        if (left == null && (right == null || right === '')) {
            return true;
        }
        if (right == null && (left == null || left === '')) {
            return true;
        }
        if (typeof left !== 'string' || typeof right !== 'string') {
            return false;
        }
        try {
            return JSON.stringify(JSON.parse(left)) === JSON.stringify(JSON.parse(right));
        } catch (err) {
            return false;
        }
    }

    function verifyRaw(storage, key, expected) {
        var read = readRaw(storage, key);
        if (!read.ok) {
            return { ok: false, error: read.error || 'verify-failed' };
        }
        if (!rawMatches(read.raw, expected)) {
            return { ok: false, error: 'verify-failed' };
        }
        return { ok: true, raw: read.raw };
    }

    function restoreSnapshotValue(storage, key, snapshotRaw) {
        if (snapshotRaw == null) {
            if (storage && typeof storage.removeItem === 'function') {
                try {
                    storage.removeItem(key);
                } catch (err) {
                    return { ok: false, error: classifyWriteError(err) };
                }
            } else {
                var cleared = writeRaw(storage, key, '{}');
                if (!cleared.ok) {
                    return cleared;
                }
            }
            return verifyRaw(storage, key, null);
        }
        var written = writeRaw(storage, key, snapshotRaw);
        if (!written.ok) {
            return written;
        }
        return verifyRaw(storage, key, snapshotRaw);
    }

    function snapshotAllStores(storage) {
        var snapshot = {};
        var errors = {};
        var ok = true;
        STORE_ORDER.forEach(function (id) {
            var read = readRaw(storage, STORE_KEYS[id]);
            snapshot[id] = read.ok ? read.raw : null;
            if (!read.ok) {
                ok = false;
                errors[id] = read.error || 'unavailable';
            }
        });
        return { ok: ok, snapshot: snapshot, errors: errors };
    }

    function validateSource(sourceText, fileMeta) {
        if (!preview || typeof preview.parseAndValidate !== 'function') {
            return fail('preview-unavailable', 'Backup validation is not available, so restore cannot run.');
        }
        var inspect = preview.inspectSelectedFile({
            name: fileMeta && fileMeta.name,
            size: fileMeta && typeof fileMeta.size === 'number'
                ? fileMeta.size
                : (typeof sourceText === 'string' ? sourceText.length : 0)
        });
        if (!inspect.ok) {
            inspect.unchanged = true;
            return inspect;
        }
        var validated = preview.parseAndValidate(sourceText, {
            name: inspect.name || (fileMeta && fileMeta.name) || ''
        });
        if (!validated.ok) {
            validated.unchanged = true;
            return validated;
        }
        return validated;
    }

    function prepareConfirmation(sourceText, fileMeta, currentDevice) {
        var validated = validateSource(sourceText, fileMeta || {});
        if (!validated.ok) {
            return validated;
        }
        var previewResult = preview.buildPreview(validated, currentDevice || {});
        var confirmable = canConfirmPreview(previewResult);
        var conflicts = confirmable ? listConflicts(validated, currentDevice || {}) : [];
        var snapshot = snapshotFromDevice(currentDevice || {});
        var identity = fileIdentity(sourceText, fileMeta && fileMeta.name);
        return {
            ok: true,
            confirmable: confirmable,
            code: confirmable ? 'confirm' : (previewResult.ok ? 'preview-only' : previewResult.code),
            message: confirmable
                ? 'Review each conflict, download a safety backup, then confirm restore.'
                : (validated.complete
                    ? 'This file cannot be restored.'
                    : 'This backup is partial. Restore stays preview-only for this first restore path.'),
            preview: previewResult,
            validated: {
                ok: true,
                complete: validated.complete,
                stores: validated.stores,
                ambiguous: validated.ambiguous,
                filename: validated.filename,
                exportedAt: validated.exportedAt
            },
            conflicts: conflicts,
            fingerprint: confirmationFingerprint({
                fileIdentity: identity,
                snapshot: snapshot
            }),
            fileIdentity: identity,
            snapshot: snapshot
        };
    }

    function buildMergedStores(validated, currentDevice, choices) {
        var merged = {};
        STORE_ORDER.forEach(function (id) {
            merged[id] = mergeStore(
                id,
                validated.stores[id].data,
                deviceDataFor(currentDevice, id),
                choices || {}
            );
        });
        return merged;
    }

    function guardedStoreIds(currentDevice) {
        var ids = [];
        var stores = isPlainObject(currentDevice) && isPlainObject(currentDevice.stores)
            ? currentDevice.stores
            : {};
        STORE_ORDER.forEach(function (id) {
            var store = isPlainObject(stores[id]) ? stores[id] : {};
            if (store.writable === false || (store.loadState && store.loadState !== 'ok')) {
                ids.push(id);
            }
        });
        return ids;
    }

    function applyConfirmedRestore(options) {
        var opts = options || {};
        var currentDevice = opts.currentDevice || {};
        var choices = opts.choices || {};
        var storage = opts.storage;
        var prepared = prepareConfirmation(opts.sourceText, {
            name: opts.filename,
            size: typeof opts.sourceText === 'string' ? opts.sourceText.length : 0
        }, currentDevice);
        if (!prepared.ok) {
            return prepared;
        }
        if (!prepared.confirmable) {
            return fail(
                'partial-source',
                'Only a complete version 1 backup can be restored. Partial source files stay preview-only.',
                { preview: prepared.preview }
            );
        }
        var liveFingerprint = confirmationFingerprint({
            fileIdentity: prepared.fileIdentity,
            snapshot: snapshotFromDevice(currentDevice)
        });
        if (!fingerprintsMatch(opts.fingerprint, liveFingerprint)) {
            return fail(
                'stale-confirmation',
                'This confirmation is out of date. Preview the file again before restoring. Nothing was changed.'
            );
        }
        if (invalidChoice(prepared.conflicts, choices)) {
            return fail(
                'invalid-choices',
                'Each conflict needs an explicit keep-device or use-backup choice. Nothing was changed.'
            );
        }
        if (!choicesComplete(prepared.conflicts, choices)) {
            return fail(
                'incomplete-choices',
                'Choose keep the device value or use the backup value for every conflict before restoring. Nothing was changed.'
            );
        }
        if (opts.safetyDownloaded !== true) {
            return fail(
                'safety-not-downloaded',
                'Download a safety backup of the current device state before restoring. This page cannot prove the file was saved.'
            );
        }
        if (opts.safetyAcknowledged !== true) {
            return fail(
                'safety-not-acknowledged',
                'Confirm that you have the safety backup file before restoring. This page cannot prove the download was saved.'
            );
        }
        if (!opts.safetyEnvelope || !safetyIncludesGuardEvidence(opts.safetyEnvelope, currentDevice)) {
            return fail(
                'missing-guard-evidence',
                'The safety backup must include current page values and any captured original unreadable copy before a failed-load store can be replaced. Nothing was changed.'
            );
        }

        var merged = buildMergedStores(prepared.validated, currentDevice, choices);
        var serialized = {};
        STORE_ORDER.forEach(function (id) {
            serialized[id] = JSON.stringify(merged[id]);
        });

        var pre = snapshotAllStores(storage);
        if (!pre.ok) {
            return fail(
                'snapshot-failed',
                'Could not snapshot current storage for rollback, so restore did not start. Original data was not changed.',
                { storeErrors: pre.errors, offerSafetyDownload: true }
            );
        }

        var written = [];
        var storeErrors = {};
        var writeFailed = null;
        for (var i = 0; i < STORE_ORDER.length; i++) {
            var id = STORE_ORDER[i];
            var key = STORE_KEYS[id];
            var wrote = writeRaw(storage, key, serialized[id]);
            if (!wrote.ok) {
                storeErrors[id] = wrote.error || 'write-failed';
                writeFailed = id;
                break;
            }
            var verified = verifyRaw(storage, key, serialized[id]);
            if (!verified.ok) {
                storeErrors[id] = verified.error || 'verify-failed';
                writeFailed = id;
                break;
            }
            written.push(id);
        }

        if (writeFailed) {
            var rolledBack = {};
            var rollbackFailed = {};
            var rollbackOk = true;
            // A write can land and then fail verification; roll that store back too.
            var failedNow = readRaw(storage, STORE_KEYS[writeFailed]);
            if (!failedNow.ok || !rawMatches(failedNow.raw, pre.snapshot[writeFailed])) {
                written.push(writeFailed);
            }
            written.forEach(function (id) {
                var restored = restoreSnapshotValue(storage, STORE_KEYS[id], pre.snapshot[id]);
                if (restored.ok) {
                    rolledBack[id] = true;
                } else {
                    rollbackOk = false;
                    rollbackFailed[id] = restored.error || 'rollback-failed';
                    storeErrors[id] = 'rollback-failed:' + (restored.error || 'write-failed');
                }
            });
            STORE_ORDER.forEach(function (id) {
                if (written.indexOf(id) === -1) {
                    rolledBack[id] = false;
                }
            });
            if (!rollbackOk) {
                return {
                    ok: false,
                    code: 'rollback-failed',
                    message: 'Restore did not finish, and rollback could not put every store back. Original data may be mixed. Use the pre-restore safety download. Success is not reported.',
                    unchanged: false,
                    storeErrors: storeErrors,
                    rolledBack: rolledBack,
                    rollbackFailed: rollbackFailed,
                    failedStore: writeFailed,
                    offerSafetyDownload: true,
                    counts: null
                };
            }
            var noun = STORE_NOUNS[writeFailed];
            var err = storeErrors[writeFailed];
            var errText = err === 'quota'
                ? noun + ' could not be stored because this device is out of room.'
                : err === 'unavailable'
                    ? noun + ' could not be stored because storage is unavailable.'
                    : noun + ' could not be stored.';
            return {
                ok: false,
                code: 'write-failed',
                message: errText + ' Every store already changed was rolled back. Original data, memory and write guards were not replaced.',
                unchanged: true,
                storeErrors: storeErrors,
                rolledBack: rolledBack,
                rollbackFailed: {},
                failedStore: writeFailed,
                offerSafetyDownload: true,
                writeError: err
            };
        }

        var recoveredGuards = guardedStoreIds(currentDevice);
        var counts = countOutcome(prepared.validated, currentDevice, choices, merged);
        return {
            ok: true,
            code: 'restored',
            message: successCountsText(counts),
            unchanged: false,
            counts: counts,
            stores: merged,
            serialized: serialized,
            recoveredGuards: recoveredGuards,
            fingerprint: applyFingerprint({
                fileIdentity: prepared.fileIdentity,
                snapshot: snapshotFromDevice(currentDevice),
                choices: choices
            })
        };
    }

    function restoreReady(options) {
        var opts = options || {};
        if (!opts.confirmable) {
            return {
                ready: false,
                reason: 'preview-only',
                restoreEnabled: false
            };
        }
        if (opts.stale) {
            return {
                ready: false,
                reason: 'stale-confirmation',
                restoreEnabled: false
            };
        }
        if (!choicesComplete(opts.conflicts, opts.choices)) {
            return {
                ready: false,
                reason: 'incomplete-choices',
                restoreEnabled: false
            };
        }
        if (opts.safetyDownloaded !== true) {
            return {
                ready: false,
                reason: 'safety-not-downloaded',
                restoreEnabled: false
            };
        }
        if (opts.safetyAcknowledged !== true) {
            return {
                ready: false,
                reason: 'safety-not-acknowledged',
                restoreEnabled: false
            };
        }
        return {
            ready: true,
            reason: null,
            restoreEnabled: true
        };
    }

    return {
        KIND: KIND,
        FORMAT_VERSION: FORMAT_VERSION,
        STORE_ORDER: STORE_ORDER,
        STORE_KEYS: STORE_KEYS,
        CHOICE_KEEP: CHOICE_KEEP,
        CHOICE_BACKUP: CHOICE_BACKUP,
        canConfirmPreview: canConfirmPreview,
        listConflicts: listConflicts,
        choicesComplete: choicesComplete,
        fileIdentity: fileIdentity,
        snapshotFromDevice: snapshotFromDevice,
        confirmationFingerprint: confirmationFingerprint,
        applyFingerprint: applyFingerprint,
        fingerprintsMatch: fingerprintsMatch,
        prepareConfirmation: prepareConfirmation,
        buildMergedStores: buildMergedStores,
        mergeStore: mergeStore,
        safetyBackupFilename: safetyBackupFilename,
        safetyStatusText: safetyStatusText,
        safetyIncludesGuardEvidence: safetyIncludesGuardEvidence,
        applyConfirmedRestore: applyConfirmedRestore,
        restoreReady: restoreReady,
        successCountsText: successCountsText,
        classifyWriteError: classifyWriteError
    };
}));
