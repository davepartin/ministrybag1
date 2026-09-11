#!/usr/bin/env node
/**
 * Synthetic checks for the read-only lesson asset scanner.
 * Uses temporary fixture JSON only. Does not write teaching images.
 */
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var checker = require('./check_lesson_assets.js');

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

var live = checker.scanLessonDir(DATA_DIR, ROOT);
assert(
    'live lesson tree has no missing src/image/imageBw/imageColor/imageSequence files',
    live.problems.length === 0,
    live.problems.map(checker.formatProblem).join('; ')
);
assert('live lesson tree collected asset references', live.refs.length >= 60);

var has20210 = live.refs.some(function (ref) {
    return ref.rel === 'images/last-supper-bw.jpg' || ref.rel === 'images/last-supper-color.jpg';
});
var has20304 = live.refs.some(function (ref) {
    return ref.rel === 'images/jesus-washing-feet-bw.png' || ref.rel === 'images/jesus-washing-feet-color.png';
});
assert('202-10 Last Supper pair is referenced', has20210);
assert('203-04 foot-washing pair is referenced', has20304);

var fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gt-eng002-'));
var fixtureData = path.join(fixtureRoot, 'data');
fs.mkdirSync(fixtureData);
fs.writeFileSync(path.join(fixtureData, '999-01.json'), JSON.stringify({
    id: '1',
    title: 'Synthetic fixture',
    blocks: [
        { type: 'image', src: 'images/does-not-exist.jpg', alt: 'missing src' },
        { type: 'parable', image: 'images/also-missing.jpg', title: 'x', text: 'y' },
        { type: 'image', imageBw: 'images/only-bw.jpg' },
        {
            type: 'image',
            imageSequence: ['images/seq-missing-1.jpg', '']
        }
    ]
}));

var fixture = checker.scanLessonDir(fixtureData, fixtureRoot);
var errors = fixture.problems.map(function (p) { return p.error; });
assert('fixture reports missing src', errors.indexOf('missing file') !== -1);
assert(
    'fixture reports incomplete B&W/color pair',
    errors.indexOf('incomplete imageBw/imageColor pair') !== -1
);
assert(
    'fixture reports empty sequence item',
    errors.indexOf('empty imageSequence[1] reference') !== -1
);
assert('fixture does not create placeholder image files', fs.readdirSync(fixtureRoot).indexOf('images') === -1);

fs.rmSync(fixtureRoot, { recursive: true, force: true });

if (failed) {
    console.error('\n' + failed + ' asset check test(s) failed.');
    process.exit(1);
}
console.log('\n' + passed + ' asset check tests passed.');
