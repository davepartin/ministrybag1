#!/usr/bin/env node
/**
 * SEC-001b check. The bundled World English Bible text of John is complete and clean,
 * and no Bible API credential or ESV API call remains in the discipleship app.
 */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
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

// Verse counts per chapter of John (879 total).
var JOHN_VERSES = [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25];

var book = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'bible', 'john-web.json'), 'utf8'));
assert('book is John in the World English Bible', book.book === 'John' && book.abbreviation === 'WEB' && book.license === 'Public Domain');
assert('John has 21 chapters in order', book.chapters.length === 21 && book.chapters.every(function (ch, i) { return ch.chapter === i + 1; }));

var segments = [];
book.chapters.forEach(function (ch) {
    var verses = [];
    ch.paragraphs.forEach(function (para) {
        assert('chapter ' + ch.chapter + ' paragraph type is known', para.type === 'p' || para.type === 'q', para.type);
        para.segments.forEach(function (seg) {
            segments.push({ chapter: ch.chapter, v: seg.v, text: seg.text });
            if (seg.v) verses.push(seg.v);
        });
    });
    var expected = JOHN_VERSES[ch.chapter - 1];
    assert('John ' + ch.chapter + ' has verses 1 to ' + expected + ' in order',
        verses.length === expected && verses.every(function (v, i) { return v === i + 1; }), verses.length);
});
assert('879 verses in total', segments.filter(function (s) { return s.v; }).length === 879);

var markup = segments.filter(function (s) { return /\\|\|strong=|[<>]/.test(s.text); });
assert('no USFM or HTML markup remains in the text', markup.length === 0, markup.slice(0, 2).map(function (s) { return s.chapter + ':' + s.v; }).join(', '));
var joined = segments.filter(function (s) { return /[a-z][A-Z]/.test(s.text); });
assert('no words run together where notes were removed', joined.length === 0, joined.slice(0, 2).map(function (s) { return s.chapter + ':' + s.v; }).join(', '));
var empty = segments.filter(function (s) { return !s.text.trim(); });
assert('every segment has text', empty.length === 0);

function verse(ch, v) {
    var found = segments.filter(function (s) { return s.chapter === ch && s.v === v; })[0];
    return found ? found.text : '';
}
assert('John 3:16 matches the WEB wording',
    verse(3, 16) === 'For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.');
assert('John 11:35 matches the WEB wording', verse(11, 35) === 'Jesus wept.');

var html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert('index.html makes no ESV API call', html.indexOf('api.esv.org') === -1);
assert('index.html defines no Bible API token', !/API_TOKEN|Authorization/.test(html));
assert('index.html loads John from the bundled file', html.indexOf("John: 'data/bible/john-web.json'") !== -1);
assert('the reading app copy inside discipleship is gone', !fs.existsSync(path.join(ROOT, 'dailybiblereading')));

var brief = fs.readFileSync(path.join(ROOT, 'PROJECT-BRIEF.md'), 'utf8');
assert('PROJECT-BRIEF lists no API token', !/API Token/i.test(brief));

if (failed) {
    console.error('\n' + failed + ' check(s) failed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
