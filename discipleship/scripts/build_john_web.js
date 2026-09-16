#!/usr/bin/env node
// Builds data/bible/john-web.json from the World English Bible (public domain) USFM.
// Source: https://ebible.org/Scriptures/eng-web_usfm.zip, file 73-JHNeng-web.usfm.
// Usage: node scripts/build_john_web.js <path to 73-JHNeng-web.usfm> [output path]
'use strict';

var fs = require('fs');
var path = require('path');

var PARAGRAPH_MARKERS = { p: 'p', m: 'p', nb: 'p', q1: 'q', q2: 'q' };

function cleanText(raw) {
    return raw
        // A note that sits directly between two words stands in for the space between them.
        .replace(/\\([fx])\s[\s\S]*?\\\1\*(?=\\\+?w\s|[A-Za-z0-9])/g, ' ')
        .replace(/\\([fx])\s[\s\S]*?\\\1\*/g, '')
        .replace(/\\\+?w\s([^|\\]*)(\|[^\\]*)?\\\+?w\*/g, '$1')
        .replace(/\\wj\s/g, '')
        .replace(/\\wj\*/g, '')
        .replace(/\s+/g, ' ');
}

function build(usfm) {
    var chapters = [];
    var chapter = null;
    var paragraph = null;
    var segment = null;

    function startParagraph(type) {
        paragraph = { type: type, segments: [] };
        chapter.paragraphs.push(paragraph);
        segment = null;
    }

    usfm.split(/\r?\n/).forEach(function (line) {
        var match = line.match(/^\\([a-z0-9]+)\s?(.*)$/);
        if (!match) {
            if (line.trim() && segment) segment.text += ' ' + line;
            return;
        }
        var marker = match[1];
        var rest = match[2];
        if (marker === 'c') {
            chapter = { chapter: parseInt(rest, 10), paragraphs: [] };
            chapters.push(chapter);
            paragraph = null;
            segment = null;
            return;
        }
        if (!chapter) return;
        if (PARAGRAPH_MARKERS[marker]) {
            startParagraph(PARAGRAPH_MARKERS[marker]);
            rest = rest.trim();
            if (!rest) return;
            if (!/^\\v\s/.test(rest)) {
                segment = { text: rest };
                paragraph.segments.push(segment);
                return;
            }
            match = rest.match(/^\\(v)\s?(.*)$/);
            marker = 'v';
            rest = match[2];
        }
        if (marker === 'v') {
            if (!paragraph) startParagraph('p');
            var verse = rest.match(/^(\d+)\s?(.*)$/);
            segment = { v: parseInt(verse[1], 10), text: verse[2] };
            paragraph.segments.push(segment);
        }
    });

    chapters.forEach(function (ch) {
        ch.paragraphs = ch.paragraphs.filter(function (para) {
            para.segments = para.segments
                .map(function (seg) {
                    seg.text = cleanText(seg.text).trim();
                    return seg;
                })
                .filter(function (seg) { return seg.text || seg.v; });
            return para.segments.length > 0;
        });
    });

    return {
        book: 'John',
        translation: 'World English Bible',
        abbreviation: 'WEB',
        license: 'Public Domain',
        source: 'https://ebible.org/Scriptures/eng-web_usfm.zip (73-JHNeng-web.usfm)',
        notes: 'Footnotes and cross references omitted. Text otherwise unchanged.',
        chapters: chapters
    };
}

if (require.main === module) {
    var input = process.argv[2];
    var output = process.argv[3] || path.join(__dirname, '..', 'data', 'bible', 'john-web.json');
    if (!input) {
        console.error('Usage: node scripts/build_john_web.js <73-JHNeng-web.usfm> [output]');
        process.exit(1);
    }
    var result = build(fs.readFileSync(input, 'utf8'));
    fs.writeFileSync(output, JSON.stringify(result, null, 1) + '\n');
    var verses = result.chapters.reduce(function (n, ch) {
        return n + ch.paragraphs.reduce(function (m, p) {
            return m + p.segments.filter(function (s) { return s.v; }).length;
        }, 0);
    }, 0);
    console.log('Wrote ' + output + ': ' + result.chapters.length + ' chapters, ' + verses + ' verses.');
}

module.exports = { build: build, cleanText: cleanText };
