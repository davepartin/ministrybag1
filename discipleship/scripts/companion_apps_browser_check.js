#!/usr/bin/env node
'use strict';
// Same-site home -> app -> lesson round trips with isolated synthetic saved work.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const fixture = require('./fixtures/daily-prayers-legacy.json');
const lesson = require('../data/101-03.json');
const BASE = process.env.COMPANION_BASE_URL || 'http://127.0.0.1:8849/discipleship/index.html';
const SHOTS = process.env.COMPANION_SCREENSHOTS;
const questions = lesson.blocks.filter(b => b.type === 'question');
const seed = {
    answers: JSON.stringify({ ...Object.fromEntries(questions.map((q, i) => ['question-101-' + q.id, 'SYN-hub-answer-' + i])), __gtAmbiguousSharedAnswers: { version: 1, items: {} }, __gtSharedKeyMigrationV1: true }),
    data: JSON.stringify({ ...fixture.data, futureField: 'SYN-preserve-metadata' }),
    prayer: 'SYN-existing-prayer: keep these words exactly.'
};
(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : { channel: 'chrome' }) });
    let passed = 0;
    const check = (condition, label) => { assert(condition, label); passed++; };
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
    for (const job of [
        { width: 375, height: 667 }, { width: 390, height: 844 },
        { width: 1280, height: 800 }, { width: 390, height: 844, reducedMotion: 'reduce' }
    ]) {
        const ctx = await browser.newContext({ viewport: { width: job.width, height: job.height }, reducedMotion: job.reducedMotion || 'no-preference' });
        await ctx.route('**/scripts/account.js', route => route.fulfill({ body: '', contentType: 'text/javascript' }));
        await ctx.addInitScript(seed => {
            if (window !== window.top || !['http:', 'https:'].includes(location.protocol)) return;
            if (!localStorage.getItem('synthetic-hub-seed')) {
                localStorage.setItem('christianFoundationsResponses', seed.answers);
                localStorage.setItem('lordsPrayerApp', seed.data);
                localStorage.setItem('lordsPrayerApp_generated', seed.prayer);
                localStorage.setItem('synthetic-hub-seed', '1');
            }
        }, seed);
        const errors = [];
        const watch = page => page.on('pageerror', error => errors.push(error.message));
        const page = await ctx.newPage(); watch(page);
        const main = new URL(BASE), app = new URL('tools/daily-prayers/', main);
        async function intact(p) {
            const stores = await p.evaluate(() => [localStorage.getItem('christianFoundationsResponses'), localStorage.getItem('lordsPrayerApp'), localStorage.getItem('lordsPrayerApp_generated')]);
            check(stores[0] === seed.answers, 'lesson answers remain byte-identical');
            check(stores[1] === seed.data && stores[2] === seed.prayer, 'prayer and unknown metadata remain byte-identical');
        }
        await page.goto(main.href + '#growing-apps', { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        check(await page.locator('#home-view').isVisible(), 'home is shown for direct apps link');
        check(await page.locator('#growing-apps-heading').textContent() === 'Growing Apps', 'apps heading');
        check(await page.evaluate(() => document.activeElement.id) === 'growing-apps-heading', 'apps heading receives focus');
        check(await page.locator('#daily-prayers-app-link').count() === 1, 'one working app card');
        check(await page.locator('#daily-prayers-app-link').evaluate(el => el.href) === app.href, 'home card stays in the same site');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'home has no horizontal overflow');
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/hub-${job.width}-${job.reducedMotion || 'normal'}.png` });
        await intact(page);
        await page.locator('#daily-prayers-app-link').click();
        await page.locator('#read-view').waitFor({ state: 'visible' });
        check(new URL(page.url()).origin === main.origin && new URL(page.url()).pathname === app.pathname, 'home opens local companion');
        check(await page.locator('#prayer-content').textContent() === seed.prayer, 'existing prayer opens verbatim');
        check(await page.locator('.wordmark').evaluate(el => el.href) === main.href, 'brand returns to this site');
        check(await page.locator('#lesson-link').evaluate(el => el.href) === main.href + '#101-3', 'related lesson stays on this site');
        check(await page.locator('#growing-apps-link').evaluate(el => el.href) === main.href + '#growing-apps', 'apps return link stays on this site');
        await intact(page);
        await page.locator('#copy-tools summary').click();
        check(await page.locator('#ministrybag-move').isVisible(), 'migration instructions available with backup tools');
        check((await page.locator('#ministrybag-move a').getAttribute('href')).startsWith('https://ministrybag.com/dailyprayers/'), 'old origin remains available for saved prayers');
        await page.locator('#lesson-link').click();
        await page.locator('#session-3.active').waitFor();
        for (const q of questions) check(await page.locator('#question-101-' + q.id).inputValue() === JSON.parse(seed.answers)['question-101-' + q.id], 'saved lesson answer restores: ' + q.id);
        const tool = page.locator('#session-3.active .block-tool-btn[href="tools/daily-prayers/"]');
        check(await tool.count() === 1, 'prayer lesson links to the same companion');
        const popupPromise = ctx.waitForEvent('page');
        await tool.click();
        const popup = await popupPromise; watch(popup);
        await popup.waitForLoadState('networkidle');
        await popup.locator('#read-view').waitFor({ state: 'visible' });
        check(new URL(popup.url()).origin === main.origin && new URL(popup.url()).pathname === app.pathname, 'lesson opens local companion');
        await intact(popup);
        await popup.locator('#growing-apps-link').click();
        await popup.locator('#growing-apps-heading').waitFor({ state: 'visible' });
        check(await popup.locator('#home-view').isVisible(), 'app returns to apps on home');
        await popup.waitForFunction(() => document.activeElement.id === 'growing-apps-heading');
        check(await popup.evaluate(() => document.activeElement.id) === 'growing-apps-heading', 'return focuses apps heading');
        // The same hash must also reveal home when used from an already-open lesson.
        await page.evaluate(() => { location.hash = 'growing-apps'; });
        await page.locator('#home-view').waitFor({ state: 'visible' });
        check(await page.locator('#lesson-view').evaluate(el => !el.classList.contains('active')), 'apps route closes lesson view');
        await intact(page);
        check(errors.length === 0, 'no page exceptions: ' + errors.join(';'));
        console.log('PASS', job.width, job.reducedMotion || 'normal');
        await ctx.close();
    }
    await browser.close();
    console.log(`${passed} companion app navigation checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
