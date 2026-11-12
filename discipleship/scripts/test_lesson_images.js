#!/usr/bin/env node
'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var assets = require('./lesson-image-assets.js');
var images = require('./lesson-images.js');
var ROOT = path.resolve(__dirname, '..');
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
}

fs.readdirSync(path.join(ROOT, 'images')).filter(function (file) {
    return /\.(jpe?g|png)$/i.test(file);
}).forEach(function (file) {
    check(file + ' has optimized delivery copies', !!assets['images/' + file]);
});

var outputs = new Set();
Object.keys(assets).forEach(function (src) {
    var asset = assets[src];
    var original = fs.readFileSync(path.join(ROOT, src));
    check(src + ' delivery copies match the current original',
        crypto.createHash('sha256').update(original).digest('hex') === asset.sourceHash);
    check(src + ' has reserved dimensions', asset.width > 0 && asset.height > 0);
    asset.variants.forEach(function (variant) {
        check(variant.src + ' is safe in responsive source lists', !/\s/.test(variant.src));
        check(variant.src + ' belongs to only one original', !outputs.has(variant.src));
        outputs.add(variant.src);
        var file = fs.readFileSync(path.join(ROOT, variant.src));
        check(variant.src + ' is a smaller WebP copy',
            file.toString('ascii', 0, 4) === 'RIFF' && file.toString('ascii', 8, 12) === 'WEBP' &&
            file.length < original.length && variant.width <= asset.width);
    });
});

fs.readdirSync(path.join(ROOT, 'data')).filter(function (file) {
    return /^\d{3}-\d+\.json$/.test(file);
}).forEach(function (file) {
    var lesson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', file), 'utf8'));
    lesson.blocks.forEach(function (block) {
        [block.src, block.image, block.icon, block.imageBw, block.imageColor].concat(block.imageSequence || [])
            .filter(function (src) { return src && src.startsWith('images/') && /\.(jpe?g|png)$/i.test(src); })
            .forEach(function (src) { check(file + ' uses an optimized delivery copy for ' + src, !!assets[src]); });
    });
});

var attrs = images.attributes('images/aspen-bw.png', 'test version');
check('deferred image has no real src before lesson activation', !/(^|\s)src=/.test(attrs));
check('image is native-lazy and asynchronous', attrs.includes('loading="lazy" decoding="async"'));
check('dimensions are available before download', attrs.includes('width="1400" height="788"'));
check('responsive candidates are versioned and encoded',
    attrs.includes('aspen-bw-640.webp?v=test%20version 640w') && attrs.includes('aspen-bw-1280.webp?v=test%20version 1280w'));
check('small icons get an accurate display size',
    images.attributes('images/aspen-bw.png', 1, '105px').includes('sizes="105px"'));
check('unconverted artwork keeps its original path',
    images.attributes('images/other.jpg', 1).includes('data-lesson-src="images/other.jpg?v=1"'));
check('query strings and attribute values stay safe',
    images.attributes('images/test.jpg?x="&y=1', '"').includes('?x=&quot;&amp;y=1&amp;v=%22'));

function fakeImage(pending) {
    var values = pending ? { 'data-lesson-src': 'image.webp?v=1', 'data-lesson-srcset': 'image.webp?v=1 640w' } : {};
    var events = {};
    return {
        complete: false,
        values: values,
        events: events,
        getAttribute: function (name) { return values[name] || null; },
        setAttribute: function (name, value) { values[name] = value; },
        removeAttribute: function (name) { delete values[name]; },
        addEventListener: function (name, callback) { events[name] = callback; },
        removeEventListener: function (name) { delete events[name]; }
    };
}

(async function () {
    var img = fakeImage(true);
    var session = { querySelectorAll: function () { return [img]; } };
    images.activate(session);
    check('activation sets responsive sources', img.values.src === 'image.webp?v=1' && !!img.values.srcset);
    check('activation clears pending markers', !img.values['data-lesson-src'] && !img.values['data-lesson-srcset']);
    var loaded = fakeImage(false);
    loaded.complete = true;
    session.querySelectorAll = function (selector) { return selector === 'img' ? [img, loaded] : []; };
    var ready = false;
    var pendingPrint = images.preparePrint(session).then(function () { ready = true; });
    await Promise.resolve();
    check('printing makes current lesson images eager', img.loading === 'eager' && loaded.loading === 'eager');
    check('printing waits for a pending image', !ready);
    img.events.load();
    await pendingPrint;
    check('printing continues after image load and removes handlers', ready && Object.keys(img.events).length === 0);
    var errorImage = fakeImage(false);
    session.querySelectorAll = function (selector) { return selector === 'img' ? [errorImage] : []; };
    var failedPrint = images.preparePrint(session);
    errorImage.events.error();
    await failedPrint;
    check('an image error does not trap the print command', Object.keys(errorImage.events).length === 0);
    await images.preparePrint(null);
    images.activate(null);
    check('missing session is safe', true);
    console.log(passed + ' lesson image checks passed.');
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
