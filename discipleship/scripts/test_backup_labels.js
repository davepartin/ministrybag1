#!/usr/bin/env node
/**
 * UX-004 checks. Plain-language labels for backup preview and restore, and
 * the generated answer index stays in sync with the lesson files.
 * Synthetic keys only.
 */
'use strict';

var path = require('path');
var fs = require('fs');
var labels = require('./backup-labels.js');
var indexBuilder = require('./build_answer_index.js');

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

var ROOT = path.join(__dirname, '..');
var indexPath = path.join(ROOT, 'data', 'meta', 'answer-index.json');
var committed = fs.readFileSync(indexPath, 'utf8');
var fresh = indexBuilder.serialize(indexBuilder.buildIndex(path.join(ROOT, 'data')));
assert('data/meta/answer-index.json matches the lesson files (rerun node scripts/build_answer_index.js)', committed === fresh);

var answerIndex = JSON.parse(committed);
var lookup = labels.lookupFromCourses([
    { id: '101', lessons: [{ num: 5, title: 'The Church' }] },
    { id: '202', lessons: [{ num: 5, title: 'Suffering' }, { num: 9, title: 'Fighting for Purity' }] }
], { '101': 'Starting in Discipleship', '202': 'Growing Up' }, answerIndex);

function label(key) {
    return labels.describeSavedKey(key, lookup);
}

assert('101 numbered question names lesson and question text',
    label('question-101-5-3').indexOf('Starting in Discipleship 5: The Church. Question: 5.3 - ') === 0, label('question-101-5-3'));
assert('stable ID from another lesson uses its real lesson, not the ID prefix',
    label('question-202-201-09-5').indexOf('Growing Up 5: Suffering. Question: ') === 0, label('question-202-201-09-5'));
assert('closing question names its lesson', label('question-202-202-09-step').indexOf('Growing Up 9: Fighting for Purity. Question: ') === 0);
assert('checklist names its lesson and prompt', label('checklist-101-service-interests').indexOf('Starting in Discipleship 5: The Church. Checklist: ') === 0);
assert('retired shared key never guesses a lesson',
    label('question-202-201-09-prayer') === 'Growing Up: older saved answer not used by a current lesson (prayer request)', label('question-202-201-09-prayer'));
assert('commitment label', label('commitment-101') === 'Starting in Discipleship commitment');
assert('completion label', label('complete-101-5') === 'Starting in Discipleship 5: The Church, marked complete');
assert('reading note label', label('notes-101-John-13') === 'Reading notes on John 13 (Starting in Discipleship)');
assert('reading check label', label('check-101-John-13') === 'Read John 13 checkbox (Starting in Discipleship)');
assert('internal key label hides the raw name', label('__gtSharedKeyMigrationV1') === 'App housekeeping setting');
assert('unknown key stays visible so nothing is hidden', label('legacy-freeform-key') === 'Other saved item (legacy-freeform-key)');
assert('labels never contain raw question keys for known answers', !/question-\d{3}-/.test(label('question-101-5-3')));
assert('missing index still labels without guessing a lesson',
    labels.describeSavedKey('question-101-5-3', labels.lookupFromCourses([], { '101': 'Starting in Discipleship' }, null)) ===
    'Starting in Discipleship: older saved answer not used by a current lesson (answer)');
assert('plural grammar', labels.plural(1, 'question') === '1 question' && labels.plural(2, 'question') === '2 questions' &&
    labels.plural(0, 'difference') === '0 differences');

var markup = '<img src=x onerror="alert(1)">';
assert('labels do not create markup from keys (host renders with textContent)', label(markup).indexOf(markup) !== -1);

if (failed) {
    console.error('\n' + failed + ' check(s) failed.');
    process.exit(1);
}
console.log('\n' + passed + ' check(s) passed.');
