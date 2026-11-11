/**
 * Growing Together answer sync helpers for DATA-002d.
 * Works in the browser (global GrowingTogetherAnswerSync) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * Each signed-in person has one Firestore document per store
 * (users/{uid}/stores/{answers|completion|reading}) holding
 * { entries: { key: { v: value, t: millis } } }. The browser keeps the same
 * stores in localStorage, plus the time each key last changed on this device.
 * When both sides have a key, the most recent edit wins. Nothing is deleted
 * from an account; a key missing on one side is copied from the other.
 *
 * Keys that start with "__" are this device's own bookkeeping (for example
 * the shared-key migration flag) and never leave the device.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherAnswerSync = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var STORE_IDS = ['answers', 'completion', 'reading'];
    var META_KEY = 'growingTogetherSyncMeta';
    var SWITCH_BACKUP_KEY = 'growingTogetherSyncSwitchBackup';

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function isSyncedKey(key) {
        return typeof key === 'string' && key !== '' && key.slice(0, 2) !== '__';
    }

    function isSyncableValue(value) {
        if (value === undefined || typeof value === 'function') return false;
        if (Array.isArray(value)) {
            // Firestore cannot store an array inside an array.
            return value.every(function (item) { return !Array.isArray(item); });
        }
        return true;
    }

    function same(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function emptyMeta() {
        var times = {};
        STORE_IDS.forEach(function (id) { times[id] = {}; });
        return { version: 1, lastUid: null, times: times };
    }

    function readMeta(storage) {
        var meta = emptyMeta();
        try {
            var parsed = JSON.parse(storage.getItem(META_KEY) || 'null');
            if (isPlainObject(parsed)) {
                if (typeof parsed.lastUid === 'string') meta.lastUid = parsed.lastUid;
                if (isPlainObject(parsed.times)) {
                    STORE_IDS.forEach(function (id) {
                        if (isPlainObject(parsed.times[id])) meta.times[id] = parsed.times[id];
                    });
                }
            }
        } catch (err) {
            // Unreadable bookkeeping only loses edit times; answers are untouched.
        }
        return meta;
    }

    function writeMeta(storage, meta) {
        try {
            storage.setItem(META_KEY, JSON.stringify(meta));
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Watches the stores this device saves and stamps each changed key with
     * the time it changed. listener(storeId, entries) hears about local edits.
     */
    function createTracker(storage, stores, now) {
        var clock = typeof now === 'function' ? now : function () { return Date.now(); };
        var meta = readMeta(storage);
        var known = {};
        var listener = null;

        STORE_IDS.forEach(function (id) {
            known[id] = {};
            var store = isPlainObject(stores[id]) ? stores[id] : {};
            Object.keys(store).forEach(function (key) {
                if (isSyncedKey(key)) known[id][key] = JSON.stringify(store[key]);
            });
        });

        function noteSaved(storeId, value) {
            if (!hasOwn(known, storeId) || !isPlainObject(value)) return {};
            var changed = {};
            var t = clock();
            Object.keys(value).forEach(function (key) {
                if (!isSyncedKey(key) || !isSyncableValue(value[key])) return;
                var json = JSON.stringify(value[key]);
                if (known[storeId][key] === json) return;
                known[storeId][key] = json;
                meta.times[storeId][key] = t;
                changed[key] = { v: value[key], t: t };
            });
            if (Object.keys(changed).length) {
                writeMeta(storage, meta);
                if (listener) listener(storeId, changed);
            }
            return changed;
        }

        // Record values that came from the account, so they are not mistaken
        // for new local edits when the app saves them to this device.
        function acceptRemote(storeId, entries, removedKeys) {
            if (!hasOwn(known, storeId)) return;
            Object.keys(entries || {}).forEach(function (key) {
                known[storeId][key] = JSON.stringify(entries[key].v);
                meta.times[storeId][key] = entries[key].t;
            });
            (removedKeys || []).forEach(function (key) {
                delete known[storeId][key];
                delete meta.times[storeId][key];
            });
            writeMeta(storage, meta);
        }

        function setLastUid(uid) {
            meta.lastUid = uid;
            writeMeta(storage, meta);
        }

        return {
            noteSaved: noteSaved,
            acceptRemote: acceptRemote,
            setLastUid: setLastUid,
            lastUid: function () { return meta.lastUid; },
            times: function (storeId) { return meta.times[storeId] || {}; },
            onLocalChange: function (fn) { listener = fn; }
        };
    }

    /**
     * 'merge' when this device has never synced, or last synced with this
     * same account. 'replace' when it last synced with a different account:
     * then the device shows the new account's answers instead, after a
     * backup copy of what was here.
     */
    function modeForAccount(lastUid, uid) {
        return lastUid && lastUid !== uid ? 'replace' : 'merge';
    }

    /**
     * Compare one store on this device with the same store in the account.
     * Returns what to write on this device (toLocal, removeLocal) and what to
     * write to the account (toRemote). Untimed local values (saved before
     * sync existed) count as older than anything in the account.
     */
    function reconcile(localStore, localTimes, remoteEntries, mode) {
        var local = isPlainObject(localStore) ? localStore : {};
        var times = isPlainObject(localTimes) ? localTimes : {};
        var remote = isPlainObject(remoteEntries) ? remoteEntries : {};
        var plan = { toLocal: {}, removeLocal: [], toRemote: {} };

        Object.keys(remote).forEach(function (key) {
            var entry = remote[key];
            if (!isSyncedKey(key) || !isPlainObject(entry) || !hasOwn(entry, 'v')) return;
            var remoteT = typeof entry.t === 'number' ? entry.t : 0;
            var hasLocal = hasOwn(local, key);
            var localT = typeof times[key] === 'number' ? times[key] : 0;
            if (mode === 'replace' || !hasLocal) {
                if (!hasLocal || !same(local[key], entry.v) || localT !== remoteT) {
                    plan.toLocal[key] = { v: entry.v, t: remoteT };
                }
                return;
            }
            if (same(local[key], entry.v)) {
                if (localT !== remoteT) plan.toLocal[key] = { v: entry.v, t: Math.max(localT, remoteT) };
                return;
            }
            if (remoteT >= localT) {
                plan.toLocal[key] = { v: entry.v, t: remoteT };
            } else if (isSyncableValue(local[key])) {
                plan.toRemote[key] = { v: local[key], t: localT };
            }
        });

        Object.keys(local).forEach(function (key) {
            if (!isSyncedKey(key) || hasOwn(remote, key)) return;
            if (mode === 'replace') {
                plan.removeLocal.push(key);
            } else if (isSyncableValue(local[key])) {
                plan.toRemote[key] = { v: local[key], t: typeof times[key] === 'number' ? times[key] : 0 };
            }
        });

        return plan;
    }

    return {
        STORE_IDS: STORE_IDS,
        META_KEY: META_KEY,
        SWITCH_BACKUP_KEY: SWITCH_BACKUP_KEY,
        isSyncedKey: isSyncedKey,
        isSyncableValue: isSyncableValue,
        createTracker: createTracker,
        modeForAccount: modeForAccount,
        reconcile: reconcile
    };
}));
