#!/usr/bin/env node
/**
 * DATA-002c Firestore rules check: each signed-in person reaches only their
 * own saved work. Runs against the local Auth and Firestore emulators with
 * two synthetic accounts, never the real project.
 *
 * Run from discipleship/ (the Firestore emulator needs Java):
 *   firebase emulators:exec --only auth,firestore "node scripts/data002c_rules_check.js"
 */
'use strict';

var PROJECT = 'growing-together-discipleship';
var AUTH = 'http://127.0.0.1:9099';
var DOCS = 'http://127.0.0.1:8080/v1/projects/' + PROJECT + '/databases/(default)/documents';

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

async function signUp(email) {
    var res = await fetch(AUTH + '/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: 'synthetic-pass-123', returnSecureToken: true })
    });
    var body = await res.json();
    return { uid: body.localId, token: body.idToken };
}

function storeBody(fields) {
    var entry = {
        mapValue: { fields: { v: { stringValue: 'Synthetic answer' }, t: { integerValue: '1000' } } }
    };
    var body = { fields: { entries: { mapValue: { fields: { 'question-201-201-01-1': entry } } } } };
    Object.keys(fields || {}).forEach(function (key) { body.fields[key] = fields[key]; });
    return body;
}

async function call(method, path, who, body) {
    var headers = { 'Content-Type': 'application/json' };
    if (who) headers.Authorization = 'Bearer ' + who.token;
    var res = await fetch(DOCS + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : undefined });
    return res.status;
}

(async function () {
    await fetch(AUTH + '/emulator/v1/projects/' + PROJECT + '/accounts', { method: 'DELETE' });
    await fetch('http://127.0.0.1:8080/emulator/v1/projects/' + PROJECT + '/databases/(default)/documents', { method: 'DELETE' });

    var a = await signUp('person.a@example.com');
    var b = await signUp('person.b@example.com');
    assert('two synthetic accounts exist', !!(a.uid && b.uid && a.uid !== b.uid));

    var mine = '/users/' + a.uid + '/stores/answers';

    assert('a person can save their answers', await call('PATCH', mine, a, storeBody()) === 200);
    assert('a person can read their answers', await call('GET', mine, a) === 200);
    assert('a person can save lesson check marks', await call('PATCH', '/users/' + a.uid + '/stores/completion', a, storeBody()) === 200);
    assert('a person can save reading notes', await call('PATCH', '/users/' + a.uid + '/stores/reading', a, storeBody()) === 200);

    assert('someone else cannot read them', await call('GET', mine, b) === 403);
    assert('someone else cannot change them', await call('PATCH', mine, b, storeBody()) === 403);
    assert('someone else cannot delete them', await call('DELETE', mine, b) === 403);
    assert('someone signed out cannot read them', await call('GET', mine, null) === 403);
    assert('someone signed out cannot write them', await call('PATCH', mine, null, storeBody()) === 403);

    assert('a person cannot delete their own store (nothing deletes answers)', await call('DELETE', mine, a) === 403);
    assert('only the three known stores are allowed', await call('PATCH', '/users/' + a.uid + '/stores/other', a, storeBody()) === 403);
    assert('no other fields are allowed', await call('PATCH', mine, a, storeBody({ extra: { stringValue: 'x' } })) === 403);
    assert('entries must be a map', await call('PATCH', mine, a, { fields: { entries: { stringValue: 'x' } } }) === 403);
    assert('nothing outside users/{uid}/stores is open', await call('PATCH', '/users/' + a.uid + '/notes/x', a, storeBody()) === 403);
    assert('the top-level users document is closed', await call('PATCH', '/users/' + a.uid, a, storeBody()) === 403);
    assert('another collection is closed', await call('GET', '/lessons/201-01', a) === 403);

    var listA = await call('GET', '/users/' + b.uid + '/stores', a);
    assert('a person cannot list someone else\'s stores', listA === 403);

    console.log('\n' + passed + ' passed, ' + failed + ' failed');
    process.exit(failed ? 1 : 0);
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
