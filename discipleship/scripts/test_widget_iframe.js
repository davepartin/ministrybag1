#!/usr/bin/env node
/**
 * ENG-003 synthetic checks for iframe readiness, resize, and cleanup.
 * Does not load learner answers or credentials.
 */
'use strict';

var host = require('./widget-iframe.js');

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

function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function fakeWindow() {
    var listeners = { resize: [] };
    return {
        addEventListener: function (type, fn) {
            listeners[type] = listeners[type] || [];
            listeners[type].push(fn);
        },
        removeEventListener: function (type, fn) {
            listeners[type] = (listeners[type] || []).filter(function (item) {
                return item !== fn;
            });
        },
        _listeners: listeners
    };
}

function fakeObserverCtor(bucket, throwOnBadNode) {
    function FakeObserver(cb) {
        this.cb = cb;
        this.target = null;
        this.disconnected = false;
        this.observe = function (node) {
            if (throwOnBadNode && !host.isNode(node)) {
                throw new TypeError("Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'");
            }
            this.target = node;
            bucket.push(this);
        };
        this.disconnect = function () {
            this.disconnected = true;
        };
    }
    return FakeObserver;
}

function fakeIframe(opts) {
    opts = opts || {};
    var attrs = {};
    var listeners = { load: [] };
    var body = opts.body;
    var doc = opts.noDoc ? null : {
        title: opts.title || '',
        readyState: opts.readyState || 'complete',
        documentElement: opts.documentElement || {
            nodeType: 1,
            scrollHeight: opts.scrollHeight || 0,
            offsetHeight: opts.offsetHeight || 0,
            clientHeight: opts.clientHeight || 0
        },
        get body() {
            return body;
        },
        set body(value) {
            body = value;
        }
    };
    return {
        style: { height: opts.height || '500px' },
        contentDocument: doc,
        contentWindow: doc ? { document: doc } : null,
        setAttribute: function (key, value) {
            attrs[key] = value;
        },
        getAttribute: function (key) {
            return Object.prototype.hasOwnProperty.call(attrs, key) ? attrs[key] : null;
        },
        addEventListener: function (type, fn) {
            listeners[type] = listeners[type] || [];
            listeners[type].push(fn);
        },
        removeEventListener: function (type, fn) {
            listeners[type] = (listeners[type] || []).filter(function (item) {
                return item !== fn;
            });
        },
        _attrs: attrs,
        _listeners: listeners,
        _setBody: function (next) {
            body = next;
        },
        _fire: function (type) {
            (listeners[type] || []).slice().forEach(function (fn) {
                fn();
            });
        }
    };
}

assert('title prefers an explicit widget title', host.titleForWidget({
    title: 'Grace cycle',
    src: 'widgets/grace-diagram.html'
}) === 'Grace cycle');

assert(
    'title uses the known widget name when JSON has no title',
    host.titleForWidget({ src: 'widgets/grace-diagram.html?v=1' }) === 'The Grace and Mercy Cycle'
);

assert(
    'title humanizes an unknown filename',
    host.titleForWidget({ src: 'widgets/new-hope-map.html' }) === 'New Hope Map'
);

assert(
    'title falls back when src is missing',
    host.titleForWidget({}) === 'Lesson widget'
);

assert(
    'escapeAttr encodes quotes and brackets',
    host.escapeAttr('He said "go" <here>') === 'He said &quot;go&quot; &lt;here&gt;'
);

assert('null body is not a Node', host.isNode(null) === false);
assert('plain object is not a Node', host.isNode({ tagName: 'BODY' }) === false);
assert('element-like object is a Node', host.isNode({ nodeType: 1 }) === true);

var missingDoc = fakeIframe({ noDoc: true });
assert('measure without a document returns 0', host.measureContentHeight(missingDoc) === 0);
assert(
    'applyHeight without a document leaves the initial height',
    host.applyHeight(missingDoc) === 0 && missingDoc.style.height === '500px'
);

var tall = fakeIframe({ scrollHeight: 640, offsetHeight: 400 });
assert('measure uses the largest content height', host.measureContentHeight(tall) === 640);
host.applyHeight(tall);
assert('applyHeight expands to measured content', tall.style.height === '640px');

var short = fakeIframe({ height: '640px', scrollHeight: 220 });
host.applyHeight(short);
assert('applyHeight collapses when content shrinks', short.style.height === '220px');

var tooSmall = fakeIframe({ height: '520px', scrollHeight: 20 });
host.applyHeight(tooSmall);
assert(
    'tiny measurements do not overwrite a usable height',
    tooSmall.style.height === '520px'
);

var observers = [];
var resizeObservers = [];
var win = fakeWindow();
var lateFrame = fakeIframe({ scrollHeight: 180, title: '' });
lateFrame._setBody(null);
var binding = host.bindWidgetIframe(lateFrame, {
    windowObj: win,
    MutationObserverCtor: fakeObserverCtor(observers, true),
    ResizeObserverCtor: fakeObserverCtor(resizeObservers, true),
    retryMs: 15,
    maxRetries: 8
});

assert('ready wait does not observe a missing body', observers.length === 0);
assert('window resize listener is attached', win._listeners.resize.length === 1);

lateFrame._setBody({ nodeType: 1, scrollHeight: 310, offsetHeight: 310, clientHeight: 310 });
lateFrame.contentDocument.title = 'The Grace and Mercy Cycle';
lateFrame.contentDocument.documentElement.scrollHeight = 310;
lateFrame._fire('load');

assert('load with a ready body starts the MutationObserver', observers.length >= 1 && observers[0].target.nodeType === 1);
assert('load with a ready body starts the ResizeObserver', resizeObservers.length >= 1);
assert('document title is copied onto the iframe', lateFrame.getAttribute('title') === 'The Grace and Mercy Cycle');
assert('height updates after the body appears', lateFrame.style.height === '310px');

lateFrame.contentDocument.documentElement.scrollHeight = 480;
lateFrame.contentDocument.body.scrollHeight = 480;
lateFrame.contentDocument.body.offsetHeight = 480;
lateFrame.contentDocument.body.clientHeight = 480;
binding.refresh();
assert('refresh expands after a later measurement', lateFrame.style.height === '480px');

lateFrame.contentDocument.documentElement.scrollHeight = 260;
lateFrame.contentDocument.documentElement.offsetHeight = 260;
lateFrame.contentDocument.documentElement.clientHeight = 260;
lateFrame.contentDocument.body.scrollHeight = 260;
lateFrame.contentDocument.body.offsetHeight = 260;
lateFrame.contentDocument.body.clientHeight = 260;
binding.refresh();
assert('refresh collapses after a later measurement', lateFrame.style.height === '260px');

binding.cleanup();
assert('cleanup disconnects the MutationObserver', observers[0].disconnected === true);
assert('cleanup disconnects the ResizeObserver', resizeObservers[0].disconnected === true);
assert('cleanup removes the window resize listener', win._listeners.resize.length === 0);
assert('cleanup removes the iframe load listener', lateFrame._listeners.load.length === 0);

binding.cleanup();
assert('cleanup is safe to call twice', observers[0].disconnected === true);

var neverBody = fakeIframe({ scrollHeight: 0 });
neverBody._setBody(null);
var neverObservers = [];
var neverWin = fakeWindow();
var neverBinding = host.bindWidgetIframe(neverBody, {
    windowObj: neverWin,
    MutationObserverCtor: fakeObserverCtor(neverObservers, true),
    retryMs: 5,
    maxRetries: 2
});

(async function () {
    await delay(30);
    assert('retries stop without observing a missing body', neverObservers.length === 0);
    neverBinding.cleanup();

    var hostApi = host.createHost({
        windowObj: fakeWindow(),
        MutationObserverCtor: fakeObserverCtor([], true)
    });
    var first = fakeIframe({ scrollHeight: 200 });
    first._setBody({ nodeType: 1 });
    var second = fakeIframe({ scrollHeight: 200 });
    second._setBody({ nodeType: 1 });
    hostApi.bind(first);
    hostApi.bind(second);
    first.contentDocument.documentElement.scrollHeight = 333;
    hostApi.refresh();
    assert('host refresh remasures every bound iframe', first.style.height === '333px');
    hostApi.teardown();
    first.contentDocument.documentElement.scrollHeight = 900;
    hostApi.refresh();
    assert('torn-down host no longer resizes stale iframes', first.style.height === '333px');

    if (failed) {
        console.error('\n' + failed + ' widget iframe check(s) failed.');
        process.exit(1);
    }
    console.log('\n' + passed + ' widget iframe checks passed.');
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
