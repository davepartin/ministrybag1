/**
 * Growing Together save-status helpers for ENG-005.
 * Works in the browser (global GrowingTogetherSaveFeedback) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * Status words are Saving, Saved, and Could not save. Saved is only returned
 * after a successful write, never from an input event or timer alone.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherSaveFeedback = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var STATUS = {
        SAVING: 'Saving',
        SAVED: 'Saved',
        COULD_NOT_SAVE: 'Could not save'
    };

    var STORES = {
        answers: {
            id: 'answers',
            key: 'christianFoundationsResponses',
            noun: 'Lesson answers',
            verb: 'are'
        },
        completion: {
            id: 'completion',
            key: 'foundationsCompletionData',
            noun: 'Lesson completion',
            verb: 'is'
        },
        reading: {
            id: 'reading',
            key: 'foundationsReadingData',
            noun: 'Reading notes',
            verb: 'are'
        }
    };

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function storeInfo(storeId) {
        return STORES[storeId] || STORES.answers;
    }

    function classifyLoad(loaded) {
        if (!loaded || loaded.available === false) {
            return 'unavailable';
        }
        if (loaded.malformed) {
            return 'malformed';
        }
        return 'ok';
    }

    function isWritableLoad(loaded) {
        if (!loaded || loaded.available === false || loaded.malformed) {
            return false;
        }
        var data = loaded.data !== undefined ? loaded.data : loaded.responses;
        return isPlainObject(data);
    }

    function loadReason(loaded) {
        var kind = classifyLoad(loaded);
        if (kind === 'ok') {
            return null;
        }
        return kind;
    }

    /**
     * Decide the visible status after a persist attempt.
     * wrote:true is the only path to Saved.
     */
    function statusAfterAttempt(options) {
        var opts = options || {};
        if (opts.phase === 'saving') {
            return {
                status: STATUS.SAVING,
                reason: null,
                wrote: false
            };
        }
        if (opts.wrote === true) {
            return {
                status: STATUS.SAVED,
                reason: 'written',
                wrote: true
            };
        }
        var reason = opts.guarded ? (opts.loadReason || 'unavailable') : (opts.writeError || 'write-failed');
        return {
            status: STATUS.COULD_NOT_SAVE,
            reason: reason,
            wrote: false
        };
    }

    // A successful write in one store must not conceal another store's failure.
    function recordAttempt(states, storeId, result) {
        if (result.status !== STATUS.SAVING || !states[storeId] ||
            states[storeId].status !== STATUS.COULD_NOT_SAVE) {
            states[storeId] = result;
        }
        return Object.keys(states).filter(function (id) {
            return states[id].status === STATUS.COULD_NOT_SAVE;
        });
    }

    function detailFor(storeId, status, reason) {
        var noun = storeInfo(storeId).noun;
        if (status === STATUS.SAVING) {
            return 'Storing ' + noun.toLowerCase() + ' on this device.';
        }
        if (status === STATUS.SAVED) {
            return noun + ' ' + storeInfo(storeId).verb + ' stored on this device.';
        }
        if (reason === 'malformed') {
            return 'The original stored ' + noun.toLowerCase() +
                ' could not be read, so this page is not replacing them. Your edits remain only on this page and could be lost if you reload.';
        }
        if (reason === 'unavailable') {
            return noun + ' could not be read from storage. Edits remain only on this page and could be lost if you reload.';
        }
        if (reason === 'quota') {
            return noun + ' could not be stored because this device is out of room. Edits remain on this page. Retry or copy them before you reload.';
        }
        if (reason === 'blocked') {
            return noun + ' could not be stored because storage is blocked. Edits remain on this page. Retry or copy them before you reload.';
        }
        return noun + ' were not stored. They remain only on this page and could be lost if you reload.';
    }

    function actionsFor(status, reason, hasOriginalRaw) {
        if (status !== STATUS.COULD_NOT_SAVE) {
            return {
                retry: false,
                copy: false,
                download: false,
                downloadOriginal: false
            };
        }
        return {
            retry: true,
            copy: true,
            download: true,
            downloadOriginal: !!hasOriginalRaw && (reason === 'malformed')
        };
    }

    function readJsonStore(storage, key) {
        if (!storage || typeof storage.getItem !== 'function') {
            return { data: {}, available: false, malformed: false, raw: null };
        }
        var raw;
        try {
            raw = storage.getItem(key);
        } catch (err) {
            return { data: {}, available: false, malformed: false, raw: null };
        }
        if (raw == null || raw === '') {
            return { data: {}, available: true, malformed: false, raw: raw == null ? null : raw };
        }
        try {
            var parsed = JSON.parse(raw);
            if (!isPlainObject(parsed)) {
                return { data: {}, available: true, malformed: true, raw: raw };
            }
            return { data: parsed, available: true, malformed: false, raw: raw };
        } catch (err) {
            return { data: {}, available: true, malformed: true, raw: raw };
        }
    }

    function writeJsonStore(storage, key, data) {
        if (!storage || typeof storage.setItem !== 'function') {
            return false;
        }
        try {
            storage.setItem(key, JSON.stringify(data));
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * In-memory recovery snapshot. Not a versioned backup and not an import path.
     */
    function buildRecoveryPayload(storeId, memoryData) {
        return {
            kind: 'growing-together-in-memory-recovery',
            store: storeId,
            note: 'Edits from this page only. Not a versioned backup. Import remains ENG-006.',
            data: memoryData && typeof memoryData === 'object' ? memoryData : {}
        };
    }

    function recoveryText(payload) {
        return JSON.stringify(payload, null, 2);
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
        if (/blocked|denied|getter/i.test(message)) {
            return 'blocked';
        }
        return 'write-failed';
    }

    return {
        STATUS: STATUS,
        STORES: STORES,
        classifyLoad: classifyLoad,
        isWritableLoad: isWritableLoad,
        loadReason: loadReason,
        statusAfterAttempt: statusAfterAttempt,
        recordAttempt: recordAttempt,
        detailFor: detailFor,
        actionsFor: actionsFor,
        readJsonStore: readJsonStore,
        writeJsonStore: writeJsonStore,
        buildRecoveryPayload: buildRecoveryPayload,
        recoveryText: recoveryText,
        classifyWriteError: classifyWriteError
    };
}));
