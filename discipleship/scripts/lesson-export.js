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
            return stripHtml(block.data_question || block.text || block.id || '');
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
                    items: Array.isArray(block.items) ? block.items.slice() : []
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
                    labels.push(String(item));
                }
            }
            return labels.length ? labels.join(', ') : EMPTY_RESPONSE;
        }
        if (raw == null || raw === '') {
            return EMPTY_RESPONSE;
        }
        return String(raw);
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

    function formatLessonSection(courseId, lessonNum, lessonData, metaTitle, responses, liveValues) {
        var title = lessonDisplayTitle(lessonNum, lessonData, metaTitle);
        var heading = 'Lesson ' + lessonNum + ': ' + title;
        var fields = collectLessonExportFields(courseId, lessonData);
        var includedIds = [];
        var text = heading + '\n' + '-'.repeat(heading.length) + '\n\n';
        if (!fields.length) {
            text += 'No written responses in this lesson.\n\n';
            return { text: text, includedIds: includedIds, title: heading, fields: fields };
        }
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            includedIds.push(field.runtimeId);
            text += field.label + '\n';
            text += formatStoredValue(field, readFieldValue(field, responses, liveValues)) + '\n\n';
        }
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
                body = courseTitle + ' - ' + selectedTitle + '\n' + DIVIDER + '\n\nNo written responses in this lesson.\n';
            } else {
                var lessonPart = formatLessonSection(
                    courseId,
                    current.num,
                    current.data,
                    current.metaTitle,
                    responses,
                    liveValues
                );
                selectedTitle = lessonPart.title;
                includedIds = includedIds.concat(lessonPart.includedIds);
                body = courseTitle + ' - ' + selectedTitle + '\n' + DIVIDER + '\n\n' + lessonPart.text;
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
                    liveValues
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
            : ('My ' + selectedTitle);

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
        buildExport: buildExport,
        buildMailtoHref: buildMailtoHref,
        mailtoAdvisory: mailtoAdvisory,
        exportContainsInternalMetadata: exportContainsInternalMetadata
    };
}));
