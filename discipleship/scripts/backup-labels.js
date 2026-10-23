/**
 * Growing Together plain-language labels for backup preview and restore (UX-004).
 * Works in the browser (global GrowingTogetherBackupLabels) and in Node tests.
 * Labels only: never changes keys, values or restore decisions.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherBackupLabels = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var PART_LABELS = {
        key: 'key takeaway',
        devos: 'devotional reflection',
        prayer: 'prayer request',
        step: 'next step',
        story: 'story reflection',
        motive: 'motive reflection',
        help: 'help reflection',
        bless: 'BLESS reflection'
    };

    function words(text) {
        return String(text).replace(/[-_]+/g, ' ').trim();
    }

    function plural(count, singular, pluralWord) {
        var n = Number(count) || 0;
        return n + ' ' + (n === 1 ? singular : (pluralWord || singular + 's'));
    }

    // lookup: { courseName(series) -> string, lessonTitle(series, lessonNum) -> string }
    function lessonName(series, lessonNum, lookup) {
        var course = (lookup && lookup.courseName && lookup.courseName(series)) || ('Course ' + series);
        var title = lookup && lookup.lessonTitle ? lookup.lessonTitle(series, lessonNum) : '';
        return title
            ? course + ' ' + lessonNum + ': ' + title
            : course + ', lesson ' + lessonNum;
    }

    function describePart(key) {
        var match = /-([a-z]+)$/.exec(String(key));
        return match && PART_LABELS[match[1]] ? PART_LABELS[match[1]] : 'answer';
    }

    function describeSavedKey(key, lookup) {
        var text = String(key);
        var courseName = function (series) {
            return (lookup && lookup.courseName && lookup.courseName(series)) || ('Course ' + series);
        };
        var match;
        if (/^__gt/.test(text)) {
            return 'App housekeeping setting';
        }
        var info = lookup && lookup.answerInfo ? lookup.answerInfo(text) : null;
        if (info && (match = /^(question|checklist)-(\d{3})-/.exec(text))) {
            return lessonName(match[2], info.lesson, lookup) + '. ' +
                (match[1] === 'checklist' ? 'Checklist: ' : 'Question: ') + info.text;
        }
        if ((match = /^question-(\d{3})-(.+)$/.exec(text))) {
            // Stable IDs do not reliably name their lesson, so never guess one.
            return courseName(match[1]) + ': older saved answer not used by a current lesson (' + describePart(text) + ')';
        }
        if ((match = /^checklist-(\d{3})-(.+)$/.exec(text))) {
            return courseName(match[1]) + ': older checklist not used by a current lesson (' + words(match[2]) + ')';
        }
        if ((match = /^commitment-(\d{3})$/.exec(text))) {
            return courseName(match[1]) + ' commitment';
        }
        if ((match = /^complete-(\d{3})-(\d+)$/.exec(text))) {
            return lessonName(match[1], parseInt(match[2], 10), lookup) + ', marked complete';
        }
        if ((match = /^notes-(\d{3})-(.+)-(\d+)$/.exec(text))) {
            return 'Reading notes on ' + words(match[2]) + ' ' + match[3] + ' (' + courseName(match[1]) + ')';
        }
        if ((match = /^check-(\d{3})-(.+)-(\d+)$/.exec(text))) {
            return 'Read ' + words(match[2]) + ' ' + match[3] + ' checkbox (' + courseName(match[1]) + ')';
        }
        return 'Other saved item (' + text + ')';
    }

    function lookupFromCourses(courses, courseNames, answerIndex) {
        var titles = {};
        (courses || []).forEach(function (course) {
            (course.lessons || []).forEach(function (lesson) {
                titles[course.id + '-' + lesson.num] = lesson.title;
            });
        });
        return {
            courseName: function (series) {
                return (courseNames && courseNames[series]) || '';
            },
            lessonTitle: function (series, lessonNum) {
                return titles[series + '-' + lessonNum] || '';
            },
            answerInfo: function (key) {
                var keys = answerIndex && answerIndex.keys;
                return keys && Object.prototype.hasOwnProperty.call(keys, key) ? keys[key] : null;
            }
        };
    }

    return {
        describeSavedKey: describeSavedKey,
        describePart: describePart,
        lookupFromCourses: lookupFromCourses,
        plural: plural
    };
}));
