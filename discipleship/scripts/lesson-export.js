/**
 * Growing Together lesson export helpers for ENG-004.
 * Works in the browser (global GrowingTogetherLessonExport) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 *
 * Field lists come from the selected lesson's actual blocks. Copied historical
 * JSON IDs make prefix guessing unsafe, so this module never infers a lesson
 * from a stored key shape.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherLessonExport = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var RECOVERY_KEY = '__gtAmbiguousSharedAnswers';
    var MIGRATION_FLAG = '__gtSharedKeyMigrationV1';
    var EMPTY_RESPONSE = '[No response]';
    var DIVIDER = '==================================================';

    /**
     * Advisory only. Some older mail clients struggle near 2000 characters.
     * Modern apps often accept more. This is not a universal mailto size limit.
     */
    var MAILTO_LENGTH_ADVISORY = 2000;

    function isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function hasOwn(obj, key) {
        return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
    }

    function questionRuntimeId(course, jsonId) {
        return 'question-' + course + '-' + jsonId;
    }

    function checklistRuntimeId(course, jsonId) {
        return 'checklist-' + course + '-' + jsonId;
    }

    function commitmentRuntimeId(course) {
        return 'commitment-' + course;
    }

    function isInternalResponseKey(key) {
        return key === RECOVERY_KEY || key === MIGRATION_FLAG ||
            (typeof key === 'string' && key.indexOf('__gt') === 0);
    }

    function stripHtml(value) {
        return String(value == null ? '' : value)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function fieldLabel(block) {
        if (!block) return '';
        if (block.type === 'question') {
            return stripHtml(block.text || block.data_question || block.id || '');
        }
        if (block.type === 'checklist') {
            return stripHtml(block.prompt || block.text || block.id || '');
        }
        if (block.type === 'commitment') {
            return stripHtml(block.text || 'Course Commitment');
        }
        return stripHtml(block.text || block.id || '');
    }

    /**
     * Collect exportable fields from one lesson's actual blocks.
     * Does not scan the responses object or guess IDs by prefix.
     */
    function collectLessonExportFields(courseId, lessonData) {
        var fields = [];
        if (!isPlainObject(lessonData) || !Array.isArray(lessonData.blocks)) {
            return fields;
        }
        for (var i = 0; i < lessonData.blocks.length; i++) {
            var block = lessonData.blocks[i];
            if (!block || typeof block.type !== 'string') {
                continue;
            }
            if (block.type === 'question' && typeof block.id === 'string' && block.id) {
                fields.push({
                    kind: 'question',
                    jsonId: block.id,
                    runtimeId: questionRuntimeId(courseId, block.id),
                    label: fieldLabel(block) || questionRuntimeId(courseId, block.id)
                });
            } else if (block.type === 'checklist' && typeof block.id === 'string' && block.id) {
                fields.push({
                    kind: 'checklist',
                    jsonId: block.id,
                    runtimeId: checklistRuntimeId(courseId, block.id),
                    label: fieldLabel(block) || checklistRuntimeId(courseId, block.id),
                    items: Array.isArray(block.items) ? block.items.slice() : [],
                    retiredItemIndexes: Array.isArray(block.retiredItemIndexes) ? block.retiredItemIndexes.slice() : []
                });
            }
        }
        return fields;
    }

    function formatStoredValue(field, raw) {
        if (field.kind === 'checklist') {
            if (!Array.isArray(raw) || raw.length === 0) {
                return EMPTY_RESPONSE;
            }
            var labels = [];
            for (var i = 0; i < raw.length; i++) {
                var item = field.items && field.items[raw[i]];
                if (item != null && item !== '') {
                    var earlier = Array.isArray(field.retiredItemIndexes) && field.retiredItemIndexes.indexOf(raw[i]) !== -1;
                    labels.push(String(item) + (earlier ? ' (earlier selection)' : ''));
                }
            }
            return labels.length ? labels.join(', ') : EMPTY_RESPONSE;
        }
        if (raw == null || raw === '') {
            return EMPTY_RESPONSE;
        }
        return String(raw);
    }

    function collectLessonReadingNotes(courseId, lessonData) {
        var notes = [];
        var seen = new Set();
        var blocks = isPlainObject(lessonData) && Array.isArray(lessonData.blocks) ? lessonData.blocks : [];
        blocks.forEach(function (block) {
            if (!block || block.type !== 'bible_reading' || !Array.isArray(block.chapters)) return;
            block.chapters.forEach(function (chapter) {
                if (!chapter || typeof chapter.ref !== 'string' || !chapter.ref.trim()) return;
                var chapterId = courseId + '-' + chapter.ref.replace(/\s+/g, '-');
                var runtimeId = 'reading-notes-' + chapterId;
                if (seen.has(runtimeId)) return;
                seen.add(runtimeId);
                notes.push({ runtimeId: runtimeId, storageKey: 'notes-' + chapterId, label: chapter.ref });
            });
        });
        return notes;
    }

    function readFieldValue(field, responses, liveValues) {
        if (liveValues && hasOwn(liveValues, field.runtimeId)) {
            return liveValues[field.runtimeId];
        }
        if (responses && hasOwn(responses, field.runtimeId)) {
            return responses[field.runtimeId];
        }
        return undefined;
    }

    function lessonDisplayTitle(lessonNum, lessonData, metaTitle) {
        if (metaTitle) return String(metaTitle);
        if (lessonData && typeof lessonData.title === 'string' && lessonData.title) {
            return lessonData.title.replace(/^Lesson\s+\d+:\s*/i, '');
        }
        return 'Lesson ' + lessonNum;
    }

    function courseLabel(courseId, title) {
        return [courseId, stripHtml(title), 'Course'].filter(Boolean).join(' ');
    }

    // The summary is the lesson's own description, so there is one source of truth.
    function lessonSummary(courseId, lessonNum, lessonData) {
        return stripHtml(lessonData && lessonData.description || '');
    }

    var CLOSING_LABELS = { key: 'Key thing', step: "This week's step", devos: 'Daily devotions', prayer: 'Prayer request' };

    // Numbered questions keep their number plus a short form of the question.
    // Closing questions carry a plain label instead of a made-up number.
    function emailQuestionLabel(field, lessonNum) {
        var text = field.label || '';
        var number = text.match(/^(\d+\.\d+)\s*-\s*(.*)$/);
        if (number) return number[1] + ' ' + shortQuestion(number[2]);
        var suffix = String(field.jsonId || '').split('-').pop();
        if (CLOSING_LABELS[suffix]) return CLOSING_LABELS[suffix];
        return shortQuestion(text);
    }

    function shortQuestion(text) {
        var t = String(text || '').replace(/\s+/g, ' ').trim();
        if (t.length <= 90) return t;
        var cut = t.slice(0, 90);
        var space = cut.lastIndexOf(' ');
        return (space > 40 ? cut.slice(0, space) : cut) + '...';
    }

    function formatLessonSection(courseId, lessonNum, lessonData, metaTitle, responses, liveValues, summary, reading) {
        var title = lessonDisplayTitle(lessonNum, lessonData, metaTitle);
        var heading = 'Lesson ' + lessonNum + ': ' + title;
        var fields = collectLessonExportFields(courseId, lessonData);
        var includedIds = [];
        var text = heading + '\n\n';
        if (summary) text += summary + '\n\n';
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            includedIds.push(field.runtimeId);
            var label = field.kind === 'question' ? emailQuestionLabel(field, lessonNum) : field.label;
            text += label + '\n';
            text += formatStoredValue(field, readFieldValue(field, responses, liveValues)) + '\n\n';
        }
        // Removed prompts stay out of the lesson while their saved answers remain
        // exportable. Only explicitly listed IDs from this lesson may be read.
        var earlierText = '';
        var retired = isPlainObject(lessonData) && Array.isArray(lessonData.retiredQuestions) ? lessonData.retiredQuestions : [];
        retired.forEach(function (block) {
            if (!block || block.type !== 'question' || typeof block.id !== 'string' || !block.id) return;
            var id = questionRuntimeId(courseId, block.id);
            if (includedIds.indexOf(id) !== -1) return;
            var value = readFieldValue({ runtimeId: id }, responses, liveValues);
            if (typeof value !== 'string' || !value.trim()) return;
            includedIds.push(id);
            earlierText += fieldLabel(block) + '\n' + value + '\n\n';
        });
        if (earlierText) text += 'Earlier saved responses\n\n' + earlierText;
        var notesText = '';
        collectLessonReadingNotes(courseId, lessonData).forEach(function (note) {
            // A cleared live field must suppress its older stored value, too.
            var value = hasOwn(liveValues, note.runtimeId) ? liveValues[note.runtimeId]
                : hasOwn(reading, note.storageKey) ? reading[note.storageKey] : undefined;
            if (typeof value !== 'string' || !value.trim()) return;
            includedIds.push(note.runtimeId);
            notesText += note.label + '\n' + value + '\n\n';
        });
        if (notesText) text += 'Reading Notes\n\n' + notesText;
        if (!fields.length && !notesText && !earlierText) text += 'No written responses in this lesson.\n\n';
        return { text: text, includedIds: includedIds, title: heading, fields: fields };
    }

    function formatCommitmentSection(courseId, responses, liveValues) {
        var key = commitmentRuntimeId(courseId);
        var raw;
        if (liveValues && hasOwn(liveValues, key)) {
            raw = liveValues[key];
        } else if (responses && hasOwn(responses, key)) {
            raw = responses[key];
        }
        if (raw == null || raw === '') {
            return { text: '', included: false, runtimeId: key };
        }
        return {
            text: 'Course Commitment\n' + String(raw) + '\n\n',
            included: true,
            runtimeId: key
        };
    }

    /**
     * Build the exact outgoing export. Lesson scope never attaches another
     * lesson's fields, course commitment, or internal migration/recovery keys.
     */
    function buildExport(options) {
        var opts = options || {};
        var scope = opts.scope === 'course' ? 'course' : 'lesson';
        var courseId = String(opts.courseId || '');
        var courseTitle = opts.courseTitle || 'Growing Together';
        var responses = isPlainObject(opts.responses) ? opts.responses : {};
        var liveValues = isPlainObject(opts.liveValues) ? opts.liveValues : {};
        var reading = isPlainObject(opts.reading) ? opts.reading : {};
        var lessons = Array.isArray(opts.lessons) ? opts.lessons : [];
        var currentLessonNum = opts.currentLessonNum;
        var includedIds = [];
        var body = '';
        var selectedTitle = '';

        if (scope === 'lesson') {
            var current = null;
            for (var i = 0; i < lessons.length; i++) {
                if (Number(lessons[i].num) === Number(currentLessonNum)) {
                    current = lessons[i];
                    break;
                }
            }
            if (!current) {
                selectedTitle = 'Lesson ' + currentLessonNum;
                body = courseLabel(courseId, courseTitle) + '\n\n' + selectedTitle + '\n\nNo written responses in this lesson.\n';
            } else {
                var lessonPart = formatLessonSection(
                    courseId,
                    current.num,
                    current.data,
                    current.metaTitle,
                    responses,
                    liveValues,
                    lessonSummary(courseId, current.num, current.data),
                    reading
                );
                selectedTitle = lessonPart.title;
                includedIds = includedIds.concat(lessonPart.includedIds);
                body = courseLabel(courseId, courseTitle) + '\n\n' + lessonPart.text;
            }
        } else {
            selectedTitle = courseTitle;
            body = courseTitle + ' - Complete course\n' + DIVIDER + '\n\n';
            for (var L = 0; L < lessons.length; L++) {
                var entry = lessons[L];
                var part = formatLessonSection(
                    courseId,
                    entry.num,
                    entry.data,
                    entry.metaTitle,
                    responses,
                    liveValues,
                    undefined,
                    reading
                );
                includedIds = includedIds.concat(part.includedIds);
                body += part.text + '\n';
            }
            var commitment = formatCommitmentSection(courseId, responses, liveValues);
            if (commitment.included) {
                includedIds.push(commitment.runtimeId);
                body += commitment.text;
            }
        }

        var subject = scope === 'course'
            ? ('My ' + courseTitle + ' Journey')
            : ('My ' + courseLabel(courseId, courseTitle) + ' - ' + selectedTitle);

        return {
            scope: scope,
            title: selectedTitle,
            subject: subject,
            body: body,
            includedIds: includedIds
        };
    }

    function buildMailtoHref(subject, body) {
        return 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    function mailtoAdvisory(href) {
        var length = String(href || '').length;
        return {
            href: href,
            length: length,
            advisoryLimit: MAILTO_LENGTH_ADVISORY,
            mayExceedSomeClients: length > MAILTO_LENGTH_ADVISORY,
            note: length > MAILTO_LENGTH_ADVISORY
                ? 'This draft is long. Some mail apps may not open it. Copy the text if the draft does not open. There is no single mailto size limit.'
                : ''
        };
    }

    function exportContainsInternalMetadata(text) {
        var sample = String(text || '');
        return sample.indexOf(RECOVERY_KEY) !== -1 || sample.indexOf(MIGRATION_FLAG) !== -1;
    }

    return {
        RECOVERY_KEY: RECOVERY_KEY,
        MIGRATION_FLAG: MIGRATION_FLAG,
        EMPTY_RESPONSE: EMPTY_RESPONSE,
        MAILTO_LENGTH_ADVISORY: MAILTO_LENGTH_ADVISORY,
        questionRuntimeId: questionRuntimeId,
        checklistRuntimeId: checklistRuntimeId,
        commitmentRuntimeId: commitmentRuntimeId,
        isInternalResponseKey: isInternalResponseKey,
        collectLessonExportFields: collectLessonExportFields,
        formatStoredValue: formatStoredValue,
        courseLabel: courseLabel,
        lessonSummary: lessonSummary,
        emailQuestionLabel: emailQuestionLabel,
        buildExport: buildExport,
        buildMailtoHref: buildMailtoHref,
        mailtoAdvisory: mailtoAdvisory,
        exportContainsInternalMetadata: exportContainsInternalMetadata
    };
}));
