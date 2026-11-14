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

assert('email heading includes the course number and course label',
    lessonExport.body.startsWith('202 Growing Up Course\n\nLesson 5: Suffering and Trials\n\n'));
assert('email subject names both course and lesson',
    lessonExport.subject === 'My 202 Growing Up Course - Lesson 5: Suffering and Trials');
assert('email does not repeat the lesson title',
    lessonExport.body.split('Lesson 5: Suffering and Trials').length === 2);
var description20205 = exporter.lessonSummary('202', 5, lesson20205);
assert('email includes the lesson description as its summary before the answers',
    description20205.length > 0 && lessonExport.body.indexOf(description20205) > -1 &&
    lessonExport.body.indexOf(description20205) < lessonExport.body.indexOf('SYN-202-05-mid'));
assert('numbered responses keep the lesson question number and a short form of the question',
    /^5\.1 [A-Z].+\nSYN-202-05-mid/m.test(lessonExport.body) && !lessonExport.body.includes('5.1 -'));
assert('closing questions carry plain labels instead of made-up numbers',
    lessonExport.body.includes("Key thing\n") && lessonExport.body.includes("This week's step\n") &&
    lessonExport.body.includes('Prayer request\nSYN-202-05-prayer') && !lessonExport.body.includes('5.8\n'));
assert('long questions are shortened with an ellipsis',
    exporter.emailQuestionLabel({ kind: 'question', jsonId: 'x-1', label: '1.1 - ' + new Array(30).join('word ') + 'end' }, 1).endsWith('...'));
assert('course heading uses Dave\'s requested format',
    exporter.courseLabel('201', 'Growing Deep') === '201 Growing Deep Course');
var lessonFiles = fs.readdirSync(DATA_DIR).filter(function (name) { return /^\d{3}-\d{2}\.json$/.test(name); });
lessonFiles.forEach(function (name) {
    var id = name.replace('.json', '');
    var data = readLesson(name);
    var course = id.split('-')[0];
    var num = Number(id.split('-')[1]);
    assert(id + ' has a plain-text description to use as the email summary',
        typeof data.description === 'string' && data.description.trim().length > 0 &&
        !/[<>]/.test(exporter.lessonSummary(course, num, data)));
    var body = exporter.buildExport({ courseId: course, currentLessonNum: num, lessons: [{ num: num, data: data }] }).body;
    var labels = body.split('\n').filter(function (line, i, all) { return all[i + 1] === '[No response]'; });
    var answerBlocks = data.blocks.filter(function (block) { return block.type === 'question' || block.type === 'checklist'; });
    assert(id + ' email labels every question and checklist once and never with a bare number',
        labels.length === answerBlocks.length && labels.every(function (l) { return !/^\d+\.\d+$/.test(l); }));
});
assert('description summaries strip markup',
    exporter.lessonSummary('202', 99, { description: '<strong>Synthetic fallback.</strong>' }) === 'Synthetic fallback.');

var allJohnNotes = {};
for (var chapter = 1; chapter <= 21; chapter++) allJohnNotes['notes-101-John-' + chapter] = 'SYN-chapter-' + chapter + '-end';
allJohnNotes['notes-201-John-1'] = 'SYN-wrong-course';
allJohnNotes['notes-101-John-99'] = 'SYN-orphan';
var readingSnapshot = JSON.stringify(allJohnNotes);
for (var lessonNum = 1; lessonNum <= 7; lessonNum++) {
    var readingLesson = readLesson('101-0' + lessonNum + '.json');
    var expectedRefs = readingLesson.blocks.filter(function (b) { return b.type === 'bible_reading'; })
        .flatMap(function (b) { return b.chapters.map(function (ch) { return ch.ref; }); });
    var noteExport = exporter.buildExport({ courseId: '101', currentLessonNum: lessonNum,
        lessons: [{ num: lessonNum, data: readingLesson }], reading: allJohnNotes });
    assert('101-0' + lessonNum + ' includes exactly its assigned chapter notes',
        noteExport.includedIds.filter(function (id) { return id.startsWith('reading-notes-'); }).length === expectedRefs.length &&
        expectedRefs.every(function (ref) { return noteExport.body.includes(ref + '\nSYN-chapter-' + ref.split(' ')[1] + '-end'); }));
    assert('101-0' + lessonNum + ' excludes every unassigned chapter and course',
        Object.keys(allJohnNotes).filter(function (key) { return !expectedRefs.some(function (ref) {
            return key === 'notes-101-' + ref.replace(/\s+/g, '-');
        }); }).every(function (key) { return !noteExport.body.includes(allJohnNotes[key]); }));
}
var notesOnly = { blocks: [{ type: 'bible_reading', chapters: [
    { ref: 'John 1' }, { ref: 'John 2' }, { ref: 'John 3' }, { ref: 'John 1' }, null, { ref: 4 }, { ref: '' }
] }] };
var noteOpts = { courseId: '101', currentLessonNum: 1, lessons: [{ num: 1, data: notesOnly }], reading: allJohnNotes,
    liveValues: { 'reading-notes-101-John-1': 'SYN-live\n<not markup> & "quoted"', 'reading-notes-101-John-2': '' } };
var liveNotes = exporter.buildExport(noteOpts);
assert('live notes preserve exact multiline text and symbols', liveNotes.body.includes('John 1\nSYN-live\n<not markup> & "quoted"'));
assert('clearing live notes suppresses old saved notes', !liveNotes.body.includes('SYN-chapter-2-end') && !liveNotes.body.includes('John 2\n'));
assert('notes-only lessons do not falsely report no written responses', !liveNotes.body.includes('No written responses'));
assert('duplicate and malformed chapter references do not duplicate notes', liveNotes.includedIds.length === 2);
assert('export does not mutate reading data', JSON.stringify(allJohnNotes) === readingSnapshot);
var blankNotes = exporter.buildExport({ ...noteOpts, reading: { 'notes-101-John-1': '   ', 'notes-101-John-2': {}, 'notes-101-John-3': [] }, liveValues: {} });
assert('blank and malformed notes produce no empty Reading Notes section', !blankNotes.body.includes('Reading Notes') && blankNotes.includedIds.length === 0);
var wrongLessonNotes = exporter.buildExport({ ...noteOpts, currentLessonNum: 99 });
assert('unknown lesson cannot export reading store', !wrongLessonNotes.body.includes('SYN-'));
var noReadingLesson = exporter.buildExport({ ...noteOpts, lessons: [{ num: 1, data: lesson20101 }] });
assert('a lesson without reading blocks exports no notes', !noReadingLesson.body.includes('Reading Notes') && !noReadingLesson.body.includes('SYN-chapter'));
var legacyNotes = exporter.buildExport({ ...noteOpts, scope: 'course' });
assert('legacy course scope limits notes to explicitly supplied lessons too', legacyNotes.body.includes('SYN-live') && !legacyNotes.body.includes('SYN-chapter-4-end'));
assert('malformed reading store is ignored safely', !exporter.buildExport({ ...noteOpts, reading: [], liveValues: {} }).body.includes('Reading Notes'));

// Retiring a prompt must not strand its existing answer or expose another lesson.
var retiredLesson = readLesson('201-10.json');
var retiredKey = 'question-201-201-10-2';
var retiredValue = 'SYN-earlier response\n<plain text> & symbols';
var retiredResponses = { [retiredKey]: retiredValue, 'question-201-other': 'SYN-other-retired' };
var retiredSnapshot = JSON.stringify(retiredResponses);
var retiredOptions = { courseId: '201', currentLessonNum: 10,
    lessons: [{ num: 10, data: retiredLesson }], responses: retiredResponses };
var retiredExport = exporter.buildExport(retiredOptions);
assert('removed prompt is absent from active fields', !exporter.collectLessonExportFields('201', retiredLesson).some(f => f.runtimeId === retiredKey));
assert('earlier answer exports under its original prompt without changing text', retiredExport.body.includes('Earlier saved responses\n\n10.2 - As you walked through the Learning Circle, which step is hardest for you?\n' + retiredValue));
assert('retired answer ID remains tracked exactly once', retiredExport.includedIds.filter(id => id === retiredKey).length === 1);
assert('retired export does not mutate stored answers', JSON.stringify(retiredResponses) === retiredSnapshot);
assert('unlisted response stays outside retired export', !retiredExport.body.includes('SYN-other-retired'));
assert('retired answer stays out of another selected lesson', !exporter.buildExport({ ...retiredOptions, currentLessonNum: 1, lessons: [{ num: 1, data: lesson20101 }] }).body.includes(retiredValue));
assert('blank retired answer creates no placeholder or section', !exporter.buildExport({ ...retiredOptions, responses: { [retiredKey]: '   ' } }).body.includes('Earlier saved responses'));
assert('explicit live clearing suppresses older retired answer', !exporter.buildExport({ ...retiredOptions, liveValues: { [retiredKey]: '' } }).body.includes(retiredValue));
var duplicateRetired = { ...retiredLesson, retiredQuestions: retiredLesson.retiredQuestions.concat(retiredLesson.retiredQuestions) };
assert('duplicate retired metadata does not repeat answers', exporter.buildExport({ ...retiredOptions, lessons: [{ num: 10, data: duplicateRetired }] }).includedIds.filter(id => id === retiredKey).length === 1);
var restoredQuestion = { ...retiredLesson, blocks: retiredLesson.blocks.concat(retiredLesson.retiredQuestions) };
assert('reintroduced question is exported once as active', !exporter.buildExport({ ...retiredOptions, lessons: [{ num: 10, data: restoredQuestion }] }).body.includes('Earlier saved responses'));

// Removed service choices retain their original numeric identities.
var serviceLesson = readLesson('101-05.json');
var serviceKey = 'checklist-101-service-interests';
var serviceResponses = { [serviceKey]: [14, 15, 18, 19, 20, 21, 22], 'question-202-unrelated': 'SYN-excluded' };
var serviceSnapshot = JSON.stringify(serviceResponses);
var serviceOpts = { courseId: '101', currentLessonNum: 5, lessons: [{ num: 5, data: serviceLesson }], responses: serviceResponses };
var serviceExport = exporter.buildExport(serviceOpts);
assert('old combined teaching choice is labeled earlier, not reinterpreted', serviceExport.body.includes('Teaching / Bible Study (earlier selection)'));
assert('old First Impressions choice stays recoverable', serviceExport.body.includes('First Impressions (earlier selection)'));
assert('old Financial Giving choice stays recoverable', serviceExport.body.includes('Financial Giving (earlier selection)'));
assert('old Outreach index remains Outreach', serviceExport.body.includes('Outreach Events'));
assert('new split and Cleaning choices export independently', serviceExport.body.includes('Teaching, Discipleship Group, Cleaning Team'));
assert('service export never mutates selection indexes', JSON.stringify(serviceResponses) === serviceSnapshot);
assert('service export excludes other lesson answers', !serviceExport.body.includes('SYN-excluded'));
var emptyService = exporter.buildExport({ ...serviceOpts, responses: { [serviceKey]: [] } });
assert('unselected earlier choices are not introduced to export', !emptyService.body.includes('(earlier selection)'));
var serviceField = exporter.collectLessonExportFields('101', serviceLesson).find(f => f.runtimeId === serviceKey);
serviceField.retiredItemIndexes.push(0);
assert('export descriptor does not mutate lesson retirement metadata', !serviceLesson.blocks.find(b => b.type === 'checklist').retiredItemIndexes.includes(0));

if (failed) {
    console.error('\n' + failed + ' check(s) failed, ' + passed + ' passed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
