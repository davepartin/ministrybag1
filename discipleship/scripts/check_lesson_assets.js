#!/usr/bin/env node
/**
 * Read-only lesson asset checks.
 * Covers src, image, imageBw/imageColor, and imageSequence.
 * Does not create files or replace missing teaching images.
 */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var DATA_DIR = path.join(ROOT, 'data');

function isRemote(rel) {
    return /^https?:\/\//i.test(rel);
}

function addStringRef(refs, loc, field, value) {
    if (value === undefined || value === null) {
        return;
    }
    if (typeof value !== 'string' || value.trim() === '') {
        refs.push({
            loc: loc,
            field: field,
            rel: value,
            error: 'empty ' + field + ' reference'
        });
        return;
    }
    refs.push({ loc: loc, field: field, rel: value.trim() });
}

function collectAssetRefs(blocks, lessonName) {
    var refs = [];
    (blocks || []).forEach(function (block, idx) {
        var type = block && block.type ? block.type : 'unknown';
        var loc = lessonName + ' block ' + idx + ' (' + type + ')';
        if (!block || typeof block !== 'object') {
            return;
        }
        addStringRef(refs, loc, 'src', block.src);
        addStringRef(refs, loc, 'image', block.image);
        addStringRef(refs, loc, 'imageBw', block.imageBw);
        addStringRef(refs, loc, 'imageColor', block.imageColor);
        var hasBw = typeof block.imageBw === 'string' && block.imageBw.trim() !== '';
        var hasColor = typeof block.imageColor === 'string' && block.imageColor.trim() !== '';
        if ((block.imageBw !== undefined || block.imageColor !== undefined) && hasBw !== hasColor) {
            refs.push({
                loc: loc,
                field: 'imageBw/imageColor',
                rel: null,
                error: 'incomplete imageBw/imageColor pair'
            });
        }
        if (block.imageSequence !== undefined) {
            if (!Array.isArray(block.imageSequence) || block.imageSequence.length === 0) {
                refs.push({
                    loc: loc,
                    field: 'imageSequence',
                    rel: null,
                    error: 'imageSequence must be a non-empty array'
                });
            } else {
                block.imageSequence.forEach(function (item, j) {
                    addStringRef(refs, loc, 'imageSequence[' + j + ']', item);
                });
            }
        }
    });
    return refs;
}

function checkRefs(rootDir, refs) {
    var problems = [];
    refs.forEach(function (ref) {
        if (ref.error) {
            problems.push(ref);
            return;
        }
        if (isRemote(ref.rel)) {
            return;
        }
        var full = path.resolve(rootDir, ref.rel);
        if (!full.startsWith(path.resolve(rootDir) + path.sep) && full !== path.resolve(rootDir)) {
            problems.push({
                loc: ref.loc,
                field: ref.field,
                rel: ref.rel,
                error: 'path escapes project root'
            });
            return;
        }
        if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
            problems.push({
                loc: ref.loc,
                field: ref.field,
                rel: ref.rel,
                error: 'missing file'
            });
        }
    });
    return problems;
}

function scanLessonDir(dataDir, rootDir) {
    var files = fs.readdirSync(dataDir).filter(function (name) {
        return name.endsWith('.json');
    }).sort();
    var refs = [];
    files.forEach(function (name) {
        var raw = fs.readFileSync(path.join(dataDir, name), 'utf8');
        var data = JSON.parse(raw);
        refs = refs.concat(collectAssetRefs(data.blocks, name));
    });
    return {
        refs: refs,
        problems: checkRefs(rootDir, refs)
    };
}

function formatProblem(problem) {
    var target = problem.rel ? ' -> ' + problem.rel : '';
    return problem.loc + ' ' + problem.field + target + ': ' + problem.error;
}

function main() {
    var result = scanLessonDir(DATA_DIR, ROOT);
    if (result.problems.length) {
        result.problems.forEach(function (problem) {
            console.error('FAIL: ' + formatProblem(problem));
        });
        console.error('Asset check failed: ' + result.problems.length + ' missing or invalid reference(s).');
        process.exit(1);
    }
    console.log('PASS: ' + result.refs.length + ' src/image/imageBw/imageColor/imageSequence references resolve to files.');
}

module.exports = {
    collectAssetRefs: collectAssetRefs,
    checkRefs: checkRefs,
    scanLessonDir: scanLessonDir,
    formatProblem: formatProblem
};

if (require.main === module) {
    main();
}
