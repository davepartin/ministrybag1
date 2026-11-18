#!/usr/bin/env node
/**
 * Rasterize Growing Together brand SVGs into favicons, app icons, and the
 * 1200x630 link-preview card. Run from discipleship/:
 *   node scripts/build_brand_assets.js
 *
 * Uses Playwright so mix-blend-mode and type match the live page. Sharp is
 * used only to resize PNG buffers and pack favicon.ico.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var sharp = require('sharp');
var { chromium } = require('playwright');

var ROOT = path.resolve(__dirname, '..');
var BRAND = path.join(ROOT, 'images/brand');
var ARTIFACTS = process.env.BRAND_ARTIFACTS_DIR || '/opt/cursor/artifacts';
var LOGO = path.join(BRAND, 'gt-logo.svg');
var APP = path.join(BRAND, 'gt-app-icon.svg');

function pngIco(images) {
    var count = images.length;
    var header = Buffer.alloc(6 + 16 * count);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);
    var offset = header.length;
    var chunks = [header];
    images.forEach(function (img, i) {
        var entry = 6 + i * 16;
        var w = img.width >= 256 ? 0 : img.width;
        var h = img.height >= 256 ? 0 : img.height;
        header.writeUInt8(w, entry);
        header.writeUInt8(h, entry + 1);
        header.writeUInt8(0, entry + 2);
        header.writeUInt8(0, entry + 3);
        header.writeUInt16LE(1, entry + 4);
        header.writeUInt16LE(32, entry + 6);
        header.writeUInt32LE(img.buffer.length, entry + 8);
        header.writeUInt32LE(offset, entry + 12);
        chunks.push(img.buffer);
        offset += img.buffer.length;
    });
    return Buffer.concat(chunks);
}

async function launchBrowser() {
    var channel = process.env.GT_BROWSER_CHANNEL || 'chrome';
    try {
        return await chromium.launch({ headless: true, channel: channel });
    } catch (err) {
        return chromium.launch({ headless: true });
    }
}

async function screenshotElement(page, html, selector, options) {
    await page.setContent(html, { waitUntil: 'networkidle' });
    var el = page.locator(selector);
    await el.waitFor();
    return el.screenshot(options || { omitBackground: true, type: 'png' });
}

function logoHtml(width, bg, extraWrap) {
    var svg = fs.readFileSync(LOGO, 'utf8');
    var height = Math.round(width * 248 / 540);
    var wrapCss = extraWrap || '';
    return '<!doctype html><html><head><meta charset="utf-8">' +
        '<style>html,body{margin:0;background:' + bg + ';}' +
        '#logo{width:' + width + 'px;height:' + height + 'px;display:block;}' +
        '#logo svg{width:100%;height:100%;display:block;}' +
        wrapCss +
        '</style></head><body><div id="logo">' + svg + '</div></body></html>';
}

function appHtml(size, radius, bg) {
    var svg = fs.readFileSync(APP, 'utf8');
    if (radius === 0) {
        svg = svg.replace('rx="108"', 'rx="0"');
    }
    return '<!doctype html><html><head><meta charset="utf-8">' +
        '<style>html,body{margin:0;background:' + bg + ';}' +
        '#icon{width:' + size + 'px;height:' + size + 'px;display:block;background:' + bg + ';}' +
        '#icon svg{width:100%;height:100%;display:block;}' +
        '</style></head><body><div id="icon">' + svg + '</div></body></html>';
}

function ogHtml() {
    var svg = fs.readFileSync(LOGO, 'utf8');
    return '<!doctype html><html><head><meta charset="utf-8">' +
        '<link rel="preconnect" href="https://fonts.googleapis.com">' +
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
        '<link href="https://fonts.googleapis.com/css2?family=Forum&family=Raleway:wght@300;700;800&display=swap" rel="stylesheet">' +
        '<style>' +
        'html,body{margin:0;}' +
        '#card{width:1200px;height:630px;background:#F8F6F1;display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;box-sizing:border-box;padding:72px 96px 80px;}' +
        '#mark{width:820px;height:auto;display:block;}' +
        '#mark svg{width:100%;height:auto;display:block;}' +
        'h1{margin:48px 0 0;font-family:Forum,Georgia,serif;font-weight:400;font-size:54px;' +
        'letter-spacing:0.04em;color:#2A2F36;text-align:center;line-height:1.15;}' +
        'p{margin:10px 0 0;font-family:Raleway,Helvetica,sans-serif;font-weight:300;font-size:18px;' +
        'letter-spacing:0.36em;text-transform:uppercase;color:#2A2F36;text-align:center;}' +
        '</style></head><body><div id="card">' +
        '<div id="mark">' + svg + '</div>' +
        '<h1>Growing Together</h1>' +
        '<p>Discipleship Series</p>' +
        '</div></body></html>';
}

async function writePng(file, buffer) {
    fs.writeFileSync(file, buffer);
    console.log(path.relative(ROOT, file) + ': ' + buffer.length + ' bytes');
}

async function main() {
    fs.mkdirSync(BRAND, { recursive: true });
    fs.mkdirSync(ARTIFACTS, { recursive: true });

    var browser = await launchBrowser();
    var page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

    var logo1600 = await screenshotElement(page, logoHtml(1600, '#F8F6F1'), '#logo', { omitBackground: false, type: 'png' });
    await writePng(path.join(ARTIFACTS, 'gt-logo-offwhite-1600.png'), logo1600);

    var app512html = appHtml(512, 108, '#18263F');
    var app512 = await screenshotElement(page, app512html, '#icon', { omitBackground: false, type: 'png' });
    var icon512 = await sharp(app512).resize(512, 512).png().toBuffer();
    await writePng(path.join(BRAND, 'icon-512.png'), icon512);
    await writePng(path.join(ARTIFACTS, 'gt-app-icon-512.png'), icon512);

    var appSquare = await screenshotElement(page, appHtml(512, 0, '#18263F'), '#icon', { omitBackground: false, type: 'png' });
    var icon192 = await sharp(appSquare).resize(192, 192).png().toBuffer();
    var apple180 = await sharp(appSquare).resize(180, 180).png().toBuffer();
    var fav32 = await sharp(appSquare).resize(32, 32).png().toBuffer();
    var fav16 = await sharp(appSquare).resize(16, 16).png().toBuffer();
    await writePng(path.join(BRAND, 'icon-192.png'), icon192);
    await writePng(path.join(ROOT, 'apple-touch-icon.png'), apple180);
    await writePng(path.join(ARTIFACTS, 'apple-touch-icon-180.png'), apple180);
    await writePng(path.join(ROOT, 'favicon-32x32.png'), fav32);
    await writePng(path.join(ROOT, 'favicon-16x16.png'), fav16);

    var ico = pngIco([
        { width: 16, height: 16, buffer: fav16 },
        { width: 32, height: 32, buffer: fav32 }
    ]);
    fs.writeFileSync(path.join(ROOT, 'favicon.ico'), ico);
    console.log('favicon.ico: ' + ico.length + ' bytes');

    fs.copyFileSync(APP, path.join(ROOT, 'favicon.svg'));
    console.log('favicon.svg copied from images/brand/gt-app-icon.svg');

    await page.setViewportSize({ width: 1200, height: 630 });
    var ogPng = await screenshotElement(page, ogHtml(), '#card', { omitBackground: false, type: 'png' });
    var ogOut = await sharp(ogPng).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer();
    var ogJpg = await sharp(ogPng).resize(1200, 630).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    var ogPath;
    if (ogJpg.length < ogPng.length * 0.85) {
        ogPath = path.join(BRAND, 'og-card.jpg');
        fs.writeFileSync(ogPath, ogJpg);
        console.log('images/brand/og-card.jpg: ' + ogJpg.length + ' bytes (jpeg chosen)');
        await writePng(path.join(ARTIFACTS, 'og-card.jpg'), ogJpg);
    } else {
        ogPath = path.join(BRAND, 'og-card.png');
        fs.writeFileSync(ogPath, ogOut);
        console.log('images/brand/og-card.png: ' + ogOut.length + ' bytes');
        await writePng(path.join(ARTIFACTS, 'og-card.png'), ogOut);
    }

    await browser.close();
    console.log('Brand assets ready.');
}

main().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
});
