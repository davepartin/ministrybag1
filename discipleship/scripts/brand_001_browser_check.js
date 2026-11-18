#!/usr/bin/env node
/**
 * BRAND-001 home-page check. Synthetic, signed-out. Serves discipleship/ itself
 * so favicon, manifest, and logo paths are the live site layout.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var http = require('http');
var { chromium } = require('playwright');

var ROOT = path.resolve(__dirname, '..');
var SHOTS = process.env.BRAND_SHOTS || '/opt/cursor/artifacts';
var passed = 0;
var failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        passed += 1;
        console.log('PASS: ' + name);
        return;
    }
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' | ' + detail : ''));
}

function startServer() {
    var mime = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.json': 'application/json; charset=utf-8',
        '.webmanifest': 'application/manifest+json',
        '.ico': 'image/x-icon'
    };
    return new Promise(function (resolve) {
        var server = http.createServer(function (req, res) {
            var reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
            var safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
            var rel = safePath === '/' ? 'index.html' : safePath.replace(/^\/+/, '');
            var fullPath = path.join(ROOT, rel);
            if (!fullPath.startsWith(ROOT) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            var ext = path.extname(fullPath);
            res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
            fs.createReadStream(fullPath).pipe(res);
        });
        server.listen(0, '127.0.0.1', function () {
            resolve({ server: server, url: 'http://127.0.0.1:' + server.address().port });
        });
    });
}

async function launchBrowser() {
    try {
        return await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    } catch (err) {
        return chromium.launch({ headless: true });
    }
}

(async function () {
    fs.mkdirSync(SHOTS, { recursive: true });
    var hosted = await startServer();
    var browser = await launchBrowser();
    try {
        var widths = [375, 390, 1280];
        for (var i = 0; i < widths.length; i += 1) {
            var width = widths[i];
            var context = await browser.newContext({ viewport: { width: width, height: 844 } });
            var page = await context.newPage();
            var errors = [];
            var failedRequests = [];
            page.on('pageerror', function (err) { errors.push(String(err)); });
            page.on('console', function (msg) {
                if (msg.type() === 'error') errors.push(msg.text());
            });
            page.on('response', function (res) {
                var status = res.status();
                if (status >= 400) failedRequests.push(status + ' ' + res.url());
            });
            await page.route('**/scripts/account.js', function (route) {
                return route.fulfill({ contentType: 'text/javascript', body: '' });
            });
            await page.goto(hosted.url + '/index.html', { waitUntil: 'networkidle' });
            await page.waitForSelector('img.home-logo');
            await page.waitForFunction(function () {
                var img = document.querySelector('img.home-logo');
                return img && img.complete && img.naturalWidth > 0;
            });

            var info = await page.evaluate(function () {
                var img = document.querySelector('img.home-logo');
                var rect = img.getBoundingClientRect();
                function attr(sel, name) {
                    var el = document.querySelector(sel);
                    return el ? el.getAttribute(name) : null;
                }
                return {
                    src: img.getAttribute('src'),
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    displayWidth: rect.width,
                    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
                    title: document.title,
                    description: attr('meta[name="description"]', 'content'),
                    themeColor: attr('meta[name="theme-color"]', 'content'),
                    iconSvg: attr('link[rel="icon"][type="image/svg+xml"]', 'href'),
                    icon32: attr('link[rel="icon"][sizes="32x32"]', 'href'),
                    icon16: attr('link[rel="icon"][sizes="16x16"]', 'href'),
                    apple: attr('link[rel="apple-touch-icon"]', 'href'),
                    manifest: attr('link[rel="manifest"]', 'href'),
                    ogTitle: attr('meta[property="og:title"]', 'content'),
                    ogImage: attr('meta[property="og:image"]', 'content'),
                    ogUrl: attr('meta[property="og:url"]', 'content'),
                    ogType: attr('meta[property="og:type"]', 'content'),
                    ogSite: attr('meta[property="og:site_name"]', 'content'),
                    twitterCard: attr('meta[name="twitter:card"]', 'content'),
                    twitterImage: attr('meta[name="twitter:image"]', 'content')
                };
            });

            var shotName = width >= 1000 ? 'home-header-desktop.png' : 'home-header-mobile-' + width + '.png';
            await page.locator('.home-header').screenshot({ path: path.join(SHOTS, shotName) });

            assert(width + ': logo uses gt-logo.svg', info.src === 'images/brand/gt-logo.svg', info.src);
            assert(width + ': logo rendered', info.naturalWidth > 0, String(info.naturalWidth));
            assert(width + ': logo fits the viewport', info.displayWidth <= width - 8, String(info.displayWidth));
            assert(width + ': no sideways scroll', info.overflowX === false);
            assert(width + ': title kept', info.title === 'Growing Together Discipleship Series');
            assert(width + ': theme-color is navy', info.themeColor === '#18263F');
            assert(width + ': svg favicon linked', info.iconSvg === 'favicon.svg');
            assert(width + ': 32px favicon linked', info.icon32 === 'favicon-32x32.png');
            assert(width + ': 16px favicon linked', info.icon16 === 'favicon-16x16.png');
            assert(width + ': apple-touch-icon linked', info.apple === 'apple-touch-icon.png');
            assert(width + ': manifest linked', info.manifest === 'site.webmanifest');
            assert(width + ': og:title matches the page title', info.ogTitle === 'Growing Together Discipleship Series');
            assert(width + ': og:image is the growingtogetherdiscipleship.com card',
                info.ogImage === 'https://growingtogetherdiscipleship.com/images/brand/og-card.jpg', info.ogImage);
            assert(width + ': og:url is growingtogetherdiscipleship.com',
                info.ogUrl === 'https://growingtogetherdiscipleship.com/');
            assert(width + ': og:type is website', info.ogType === 'website');
            assert(width + ': og:site_name is Growing Together Discipleship',
                info.ogSite === 'Growing Together Discipleship');
            assert(width + ': twitter card is summary_large_image', info.twitterCard === 'summary_large_image');
            assert(width + ': twitter image matches og:image', info.twitterImage === info.ogImage);
            assert(width + ': zero page errors', errors.length === 0, errors.join(' || '));
            var brandFails = failedRequests.filter(function (item) {
                return /favicon|apple-touch|webmanifest|gt-logo|og-card|icon-19|icon-51/.test(item);
            });
            assert(width + ': brand files did not 404', brandFails.length === 0, brandFails.join(' || '));
            await context.close();
        }

        var assets = [
            '/favicon.svg',
            '/favicon.ico',
            '/favicon-32x32.png',
            '/favicon-16x16.png',
            '/apple-touch-icon.png',
            '/site.webmanifest',
            '/images/brand/gt-logo.svg',
            '/images/brand/gt-app-icon.svg',
            '/images/brand/og-card.jpg',
            '/images/brand/icon-192.png',
            '/images/brand/icon-512.png'
        ];
        for (var a = 0; a < assets.length; a += 1) {
            var res = await fetch(hosted.url + assets[a]);
            assert(assets[a] + ' returns 200', res.status === 200, String(res.status));
        }
        var manifest = await (await fetch(hosted.url + '/site.webmanifest')).json();
        assert('manifest name', manifest.name === 'Growing Together Discipleship');
        assert('manifest short_name', manifest.short_name === 'Growing Together');
        assert('manifest theme_color', manifest.theme_color === '#18263F');
        assert('manifest background_color', manifest.background_color === '#F8F6F1');
        assert('manifest has 192 and 512 icons', manifest.icons.length === 2 &&
            manifest.icons[0].sizes === '192x192' && manifest.icons[1].sizes === '512x512');
        assert('manifest start_url is relative', manifest.start_url === './');
    } finally {
        await browser.close();
        hosted.server.close();
    }
    console.log('BRAND-001 browser checks: ' + passed + ' passed, ' + failed + ' failed');
    if (failed) process.exitCode = 1;
})().catch(function (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
});
