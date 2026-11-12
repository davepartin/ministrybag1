#!/usr/bin/env node
// Build-only fixtures stay in a temporary folder. Requires the optimizer's sharp dependency.
'use strict';

var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var crypto = require('crypto');
var childProcess = require('child_process');
var sharp = require('sharp');
var passed = 0;

function check(name, condition) {
    assert.ok(condition, name);
    passed += 1;
}

function hash(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

(async function () {
    var root = fs.mkdtempSync(path.join(os.tmpdir(), 'gt-image-build-'));
    var script = path.join(root, 'scripts/build_lesson_images.js');
    var manifest = path.join(root, 'scripts/lesson-image-assets.js');
    fs.mkdirSync(path.join(root, 'scripts'));
    fs.mkdirSync(path.join(root, 'images'));
    fs.copyFileSync(path.join(__dirname, 'build_lesson_images.js'), script);

    function build() {
        return childProcess.execFileSync(process.execPath, [script], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    }
    function assets() {
        delete require.cache[require.resolve(manifest)];
        return require(manifest);
    }
    async function picture(name, width) {
        var image = sharp({ create: { width: width, height: 100, channels: 4, background: '#1a6b55' } });
        await image.toFile(path.join(root, 'images', name));
    }

    try {
        await picture('a.png', 160);
        await picture('space name.jpeg', 200);
        await picture('upper.PNG', 180);
        build();
        var first = assets();
        check('discovers PNG, JPEG and uppercase extensions', Object.keys(first).length === 3);
        var spaced = first['images/space name.jpeg'].variants[0].src;
        check('responsive delivery filenames have no whitespace', spaced === 'images/optimized/space-name-200.webp');
        check('original pixel dimensions stay in the manifest', first['images/a.png'].width === 160 && first['images/a.png'].height === 100);
        var output = path.join(root, first['images/a.png'].variants[0].src);
        var before = hash(output);
        var beforeManifest = hash(manifest);
        var repeated = build();
        check('unchanged sources reuse their delivery copies', repeated.includes('images/a.png: delivery copies unchanged'));
        check('repeated builds preserve output bytes', hash(output) === before);
        check('repeated builds preserve the manifest', hash(manifest) === beforeManifest);

        fs.unlinkSync(output);
        check('missing copies are regenerated', !build().includes('images/a.png: delivery copies unchanged') && fs.existsSync(output));
        await picture('a.png', 240);
        build();
        var updated = assets()['images/a.png'];
        check('changed originals refresh the dimensions', updated.width === 240);
        check('changed originals refresh the source hash', updated.sourceHash !== first['images/a.png'].sourceHash);
        check('changed originals get matching delivery widths', updated.variants[0].width === 240);

        await picture('a.jpeg', 240);
        var collision = '';
        try { build(); } catch (error) { collision = String(error.stderr); }
        check('duplicate output names fail explicitly', collision.includes('Image output name collision: images/optimized/a-240.webp'));
        console.log(passed + ' image build checks passed.');
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
})().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
