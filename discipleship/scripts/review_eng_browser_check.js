#!/usr/bin/env node
// REV-001: real browser regressions missing from the original task checks.
// Fresh contexts and synthetic values only; never open a learner profile.
'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');
const BASE = process.env.GT_BASE_URL || 'http://127.0.0.1:8765/index.html';
let passed = 0;
function check(name, condition) {
    assert.ok(condition, name);
    passed++;
    console.log('PASS: ' + name);
}
(async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || undefined });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        for (const width of [375, 390, 1280]) {
            await page.setViewportSize({ width, height: 844 });
            await page.setContent(`<iframe title="Synthetic resize fixture" style="width:100%;height:640px;border:0" srcdoc='<!DOCTYPE html><html><body style="margin:0"><div style="height:220px">Synthetic content</div></body></html>'></iframe>`);
            const frame = page.frames().find(item => item !== page.mainFrame());
            await frame.locator('div').waitFor();
            await page.addScriptTag({ path: path.join(__dirname, 'widget-iframe.js') });
            await page.evaluate(() => {
                window.fixtureBinding = GrowingTogetherWidgetIframe.bindWidgetIframe(document.querySelector('iframe'));
            });
            await page.waitForFunction(() => document.querySelector('iframe').style.height === '220px');
            check(width + ': real iframe shrinks from its previous viewport', true);
            await frame.locator('div').evaluate(el => { el.style.height = '800px'; });
            await page.waitForFunction(() => document.querySelector('iframe').style.height === '800px');
            await frame.locator('div').evaluate(el => { el.style.height = '180px'; });
            await page.waitForFunction(() => document.querySelector('iframe').style.height === '180px');
            await page.waitForTimeout(150);
            check(width + ': observer grows and shrinks without oscillating', await page.locator('iframe').evaluate(el => el.style.height === '180px'));
            await page.evaluate(() => window.fixtureBinding.cleanup());
        }
        check('resize produces no browser exceptions', errors.length === 0);
        await page.close();

        for (const mode of ['malformed', 'failed-read', 'blocked-getter']) {
            const context = await browser.newContext();
            await context.addInitScript(mode => {
                if (window !== window.top) return;
                const key = 'christianFoundationsResponses';
                const raw = mode === 'malformed' ? '{"SYN-broken":' : '{"SYN-keep":"original"}';
                localStorage.setItem(key, raw);
                window.syntheticRaw = raw;
                if (mode === 'failed-read') {
                    const original = Storage.prototype.getItem;
                    window.syntheticReadFails = true;
                    Storage.prototype.getItem = function (key) {
                        if (key === 'christianFoundationsResponses' && window.syntheticReadFails) throw new Error('Synthetic read failure');
                        return original.call(this, key);
                    };
                }
            }, mode);
            const page = await context.newPage();
            await page.goto(BASE, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => typeof persistResponses === 'function');
            const result = await page.evaluate(mode => {
                window.syntheticReadFails = false;
                if (mode === 'blocked-getter') {
                    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Synthetic getter failure'); } });
                    return { rejected: persistResponses() === false };
                }
                const key = 'christianFoundationsResponses';
                const preservedOnLoad = localStorage.getItem(key) === window.syntheticRaw;
                responses['SYN-new'] = 'in-memory edit';
                const rejected = persistResponses() === false;
                // Same persistence function used by the periodic save callback.
                persistResponses();
                return { preservedOnLoad, rejected, rawPreserved: localStorage.getItem(key) === window.syntheticRaw, editPreserved: responses['SYN-new'] === 'in-memory edit' };
            }, mode);
            check(mode + ': persistence reports failure without throwing', result.rejected);
            if (mode !== 'blocked-getter') {
                check(mode + ': load and repeated saves preserve the original stored copy', result.preservedOnLoad && result.rawPreserved);
                check(mode + ': new edits remain in memory', result.editPreserved);
            }
            await context.close();
        }
        console.log(passed + ' review browser checks passed.');
    } finally {
        await browser.close();
    }
})().catch(err => { console.error(err.message); process.exitCode = 1; });
