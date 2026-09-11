#!/usr/bin/env node
/**
 * ENG-004 synthetic export-scope and encoding checks.
 * Uses only synthetic strings. Never print real learner answers.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var exporter = require('./lesson-export.js');

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

function readLesson(fileName) {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));
}

var lesson20205 = readLesson('202-05.json');
var lesson20206 = readLesson('202-06.json');
var lesson20101 = readLesson('201-01.json');

var syntheticStore = {
    'question-202-201-09-1': 'SYN-202-05-mid "quoted" & cafe',
    'question-202-202-05-prayer': 'SYN-202-05-prayer line1\nline2',
    'question-202-202-05-key': 'SYN-202-05-key',
    'question-202-201-05-prayer': 'SYN-202-06-prayer should stay out',
    'question-202-201-05-key': 'SYN-202-06-key',
    'question-201-201-01-prayer': 'SYN-201-01-prayer',
    'commitment-202': 'Yes',
    '__gtSharedKeyMigrationV1': true,
    '__gtAmbiguousSharedAnswers': {
        version: 1,
        items: {
            'question-202-201-09-prayer': {
                value: 'SYN-ambiguous-legacy-prayer',
                candidateLessons: ['202-05', '202-09'],
                status: 'ambiguous'
            }
        }
    }
};

var lessons202 = [
    { num: 5, data: lesson20205, metaTitle: 'Suffering and Trials' },
    { num: 6, data: lesson20206, metaTitle: 'Worship' }
];

var fields20205 = exporter.collectLessonExportFields('202', lesson20205);
var fieldIds20205 = fields20205.map(function (f) { return f.runtimeId; });

assert(
    '202-05 export fields include copied historical mid-lesson IDs',
    fieldIds20205.indexOf('question-202-201-09-1') !== -1
);
assert(
    '202-05 export fields include the actual closing prayer ID',
    fieldIds20205.indexOf('question-202-202-05-prayer') !== -1
);
assert(
    '202-05 export fields do not invent 202-05-prefixed copies of mid-lesson IDs',
    fieldIds20205.indexOf('question-202-202-05-1') === -1
);
assert(
    '202-05 export fields do not include 202-06 historical prayer ID',
    fieldIds20205.indexOf('question-202-201-05-prayer') === -1
);

var naivePrefixGuess = Object.keys(syntheticStore).filter(function (key) {
    return key.indexOf('question-202-202-05-') === 0;
});
assert(
    'prefix guessing would miss the copied 201-09-1 field on 202-05',
    naivePrefixGuess.indexOf('question-202-201-09-1') === -1 &&
        fieldIds20205.indexOf('question-202-201-09-1') !== -1
);

var lessonExport = exporter.buildExport({
    scope: 'lesson',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 5,
    lessons: lessons202,
    responses: syntheticStore
});

assert('lesson export title names the selected lesson', lessonExport.title.indexOf('Suffering and Trials') !== -1);
assert('lesson export body names the selected lesson', lessonExport.body.indexOf('Lesson 5: Suffering and Trials') !== -1);
assert('lesson export includes the selected lesson prayer', lessonExport.body.indexOf('SYN-202-05-prayer line1\nline2') !== -1);
assert('lesson export includes the copied-ID mid-lesson answer', lessonExport.body.indexOf('SYN-202-05-mid "quoted" & cafe') !== -1);
assert(
    'lesson export excludes another lesson prayer',
    lessonExport.body.indexOf('SYN-202-06-prayer should stay out') === -1 &&
        lessonExport.body.indexOf('SYN-202-06-key') === -1
);
assert(
    'lesson export excludes course commitment',
    lessonExport.body.indexOf('Course Commitment') === -1 &&
        lessonExport.body.indexOf('\nYes\n') === -1
);
assert(
    'lesson export excludes recovery metadata',
    lessonExport.body.indexOf('SYN-ambiguous-legacy-prayer') === -1 &&
        !exporter.exportContainsInternalMetadata(lessonExport.body) &&
        lessonExport.includedIds.indexOf(exporter.RECOVERY_KEY) === -1 &&
        lessonExport.includedIds.indexOf(exporter.MIGRATION_FLAG) === -1
);
assert(
    'lesson export does not dump internal keys as field IDs',
    lessonExport.includedIds.every(function (id) { return !exporter.isInternalResponseKey(id); })
);

var courseExport = exporter.buildExport({
    scope: 'course',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 5,
    lessons: lessons202,
    responses: syntheticStore
});

assert('course export title is the course', courseExport.title === 'Growing Up');
assert('course export subject is a journey subject', courseExport.subject.indexOf('Growing Up') !== -1);
assert('course export includes the other lesson prayer when selected', courseExport.body.indexOf('SYN-202-06-prayer should stay out') !== -1);
assert('course export includes course commitment when selected', courseExport.body.indexOf('Course Commitment') !== -1 && courseExport.body.indexOf('Yes') !== -1);
assert(
    'course export still excludes recovery metadata',
    courseExport.body.indexOf('SYN-ambiguous-legacy-prayer') === -1 &&
        !exporter.exportContainsInternalMetadata(courseExport.body)
);

var switched = exporter.buildExport({
    scope: 'lesson',
    courseId: '201',
    courseTitle: 'Growing Deep',
    currentLessonNum: 1,
    lessons: [{ num: 1, data: lesson20101, metaTitle: 'Welcome' }],
    responses: syntheticStore
});
assert('switching courses uses the new lesson fields', switched.body.indexOf('SYN-201-01-prayer') !== -1);
assert('switching courses drops the previous course prayer', switched.body.indexOf('SYN-202-05-prayer') === -1);

var emptyExport = exporter.buildExport({
    scope: 'lesson',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 5,
    lessons: lessons202,
    responses: {}
});
assert(
    'empty responses still list the selected lesson questions',
    emptyExport.body.indexOf(exporter.EMPTY_RESPONSE) !== -1 &&
        emptyExport.body.indexOf('Lesson 5: Suffering and Trials') !== -1
);
assert('empty lesson export has no other-lesson prayer', emptyExport.body.indexOf('SYN-202-06-prayer') === -1);

var unicodeAnswer = 'Cafe & tea, "quoted", line1\nline2, 日本語, emoji ok';
var encodingExport = exporter.buildExport({
    scope: 'lesson',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 5,
    lessons: lessons202,
    responses: {
        'question-202-202-05-prayer': unicodeAnswer
    }
});
assert('multiline and unicode appear in the exact outgoing body', encodingExport.body.indexOf(unicodeAnswer) !== -1);
assert('ampersand is kept in the readable body', encodingExport.body.indexOf('Cafe & tea') !== -1);
assert('quotes are kept in the readable body', encodingExport.body.indexOf('"quoted"') !== -1);

var href = exporter.buildMailtoHref(encodingExport.subject, encodingExport.body);
assert('mailto href starts with mailto:', href.indexOf('mailto:?subject=') === 0);
assert('mailto encodes ampersands', href.indexOf('Cafe%20%26%20tea') !== -1);
assert('mailto encodes quotes', href.indexOf('%22quoted%22') !== -1);
assert('mailto encodes newlines', href.indexOf('line1%0Aline2') !== -1);
assert('mailto encodes Unicode', href.indexOf(encodeURIComponent('日本語')) !== -1);
assert('readable body is not URI-encoded', encodingExport.body.indexOf('%26') === -1);

var liveOverrides = exporter.buildExport({
    scope: 'lesson',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 5,
    lessons: lessons202,
    responses: syntheticStore,
    liveValues: {
        'question-202-202-05-prayer': 'SYN-live-only-edit'
    }
});
assert('live in-memory edits win over stored values', liveOverrides.body.indexOf('SYN-live-only-edit') !== -1);
assert('live override does not attach extra lessons', liveOverrides.body.indexOf('SYN-202-06-prayer') === -1);

var missingLesson = exporter.buildExport({
    scope: 'lesson',
    courseId: '202',
    courseTitle: 'Growing Up',
    currentLessonNum: 99,
    lessons: lessons202,
    responses: syntheticStore
});
assert('unknown lesson does not dump the store', missingLesson.body.indexOf('SYN-202-05-prayer') === -1);

var advisoryShort = exporter.mailtoAdvisory(exporter.buildMailtoHref('Short', 'Hi'));
assert('short mailto does not trigger the advisory', advisoryShort.mayExceedSomeClients === false);

var longBody = new Array(800).join('SYN-long-line and more text. ');
var advisoryLong = exporter.mailtoAdvisory(exporter.buildMailtoHref('Long', longBody));
assert(
    'long mailto can show an advisory without claiming a universal limit',
    advisoryLong.mayExceedSomeClients === true &&
        advisoryLong.note.indexOf('no single mailto size limit') !== -1
);

assert('isInternalResponseKey flags recovery', exporter.isInternalResponseKey(exporter.RECOVERY_KEY));
assert('isInternalResponseKey flags migration', exporter.isInternalResponseKey(exporter.MIGRATION_FLAG));
assert('isInternalResponseKey leaves lesson keys alone', !exporter.isInternalResponseKey('question-202-202-05-prayer'));

var checklistLesson = {
    blocks: [{
        type: 'checklist',
        id: 'service-interests',
        prompt: 'What can you bring?',
        items: ['Greeting', 'Meals', 'Prayer']
    }]
};
var checklistExport = exporter.buildExport({
    scope: 'lesson',
    courseId: '101',
    courseTitle: 'Starting in Discipleship',
    currentLessonNum: 5,
    lessons: [{ num: 5, data: checklistLesson, metaTitle: 'Church' }],
    responses: { 'checklist-101-service-interests': [0, 2] }
});
assert('checklist selections use the lesson item labels', checklistExport.body.indexOf('Greeting, Prayer') !== -1);

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
