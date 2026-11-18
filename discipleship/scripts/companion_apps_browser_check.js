#!/usr/bin/env node
'use strict';
// Home controls -> standalone app hub -> app -> lesson, with synthetic saved work.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const fixture = require('./fixtures/daily-prayers-legacy.json');
const lesson = require('../data/101-03.json');
const memoryLessons = ['101-04','201-05'].map(id=>({id,questions:require('../data/'+id+'.json').blocks.filter(b=>b.type==='question')}));
const marriageQuestions = require('../data/202-08.json').blocks.filter(b => b.type === 'question');
const BASE = process.env.COMPANION_BASE_URL || 'http://127.0.0.1:8849/discipleship/index.html';
const SHOTS = process.env.COMPANION_SCREENSHOTS;
const questions = lesson.blocks.filter(b => b.type === 'question');
const seed = {
    answers: JSON.stringify({ ...Object.fromEntries(questions.map((q, i) => ['question-101-' + q.id, 'SYN-hub-answer-' + i])), ...Object.fromEntries(marriageQuestions.map((q,i) => ['question-202-' + q.id, 'SYN-marriage-answer-' + i])), ...Object.fromEntries(memoryLessons.flatMap(l=>l.questions.map((q,i)=>['question-'+l.id.slice(0,3)+'-'+q.id,'SYN-memory-answer-'+l.id+'-'+i]))), __gtAmbiguousSharedAnswers: { version: 1, items: {} }, __gtSharedKeyMigrationV1: true }),
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
        const main = new URL(BASE), hub = new URL('tools/', main), app = new URL('daily-prayers/', hub);
        async function intact(p) {
            const stores = await p.evaluate(() => [localStorage.getItem('christianFoundationsResponses'), localStorage.getItem('lordsPrayerApp'), localStorage.getItem('lordsPrayerApp_generated')]);
            check(stores[0] === seed.answers, 'lesson answers remain byte-identical');
            check(stores[1] === seed.data && stores[2] === seed.prayer, 'prayer and unknown metadata remain byte-identical');
        }
        await page.goto(main.href, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const appsLink = page.locator('#home-growing-apps-link');
        check(await page.locator('#home-view').isVisible(), 'home opens normally');
        check((await appsLink.textContent()).trim() === 'Your Growing Apps', 'home apps button label');
        const layout = await appsLink.evaluate(el => {
            const a = el.getBoundingClientRect(), prior = el.previousElementSibling, b = prior.getBoundingClientRect();
            return { title: prior.textContent.trim(), width: Math.abs(a.width - b.width), height: Math.abs(a.height - b.height), gap: a.top - b.bottom, minimum: a.height };
        });
        check(layout.title === 'Browse All Lessons', 'renamed browse button immediately precedes apps');
        check(layout.width < 1 && layout.height < 1 && layout.gap >= 8 && layout.minimum >= 44, 'two matching full-width accessible buttons');
        check(await appsLink.evaluate(el => el.href) === hub.href, 'home apps button links to standalone same-site hub');
        check(await page.locator('#home-view #daily-prayers-app-link').count() === 0, 'app list removed from home');
        await intact(page);
        await appsLink.scrollIntoViewIfNeeded();
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/home-controls-${job.width}-${job.reducedMotion || 'normal'}.png` });
        await appsLink.focus(); await appsLink.press('Enter');
        await page.locator('.apps-hub h1').waitFor();
        await page.evaluate(() => document.fonts.ready);
        check((await page.locator('h1').textContent()).trim() === 'Your Growing Apps', 'dedicated apps-page heading');
        check(new URL(page.url()).pathname === hub.pathname, 'hub is a separate page');
        check(await page.locator('.app-button').count() === 3, 'only the three available apps ship');
        check(await page.locator('#weekly-connection-app-link').evaluate(el => el.href) === new URL('weekly-connection-time/', hub).href, 'marriage companion joins the same-site app list');
        const appLink = page.locator('#daily-prayers-app-link');
        check((await appLink.textContent()).trim().startsWith('Your Daily Prayers'), 'personal app button label');
        check(await appLink.evaluate(el => el.href) === app.href, 'app opens on this site');
        check(await appLink.evaluate(el => Math.abs(el.getBoundingClientRect().width - el.parentElement.clientWidth) < 1 && el.getBoundingClientRect().height >= 44), 'app button fills page width and keeps a large touch target');
        check(await page.locator('.ministry-link img').evaluate(el => el.complete && el.naturalWidth > 0), 'shared MinistryBag logo loads');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'hub has no horizontal overflow');
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/apps-page-${job.width}-${job.reducedMotion || 'normal'}.png` });
        // Test six rows without adding fake apps to the shipped page.
        const fit = await page.evaluate(() => {
            const original = document.querySelector('.app-button');
            for (let i = original.parentElement.children.length + 1; i <= 6; i++) {
                const row = original.cloneNode(true); row.removeAttribute('id'); row.dataset.fitSample = 'true'; row.querySelector('span').textContent = 'Example App ' + i; original.parentElement.appendChild(row);
            }
            const fits = document.documentElement.scrollHeight <= innerHeight + 1;
            document.querySelectorAll('[data-fit-sample]').forEach(el => el.remove());
            return fits;
        });
        check(fit, 'six compact app buttons fit on one screen');
        await appLink.click();
        await page.locator('#read-view').waitFor({ state: 'visible' });
        check(new URL(page.url()).origin === main.origin && new URL(page.url()).pathname === app.pathname, 'hub opens local companion');
        check(await page.locator('#prayer-content').textContent() === seed.prayer, 'existing prayer opens verbatim');
        check(await page.locator('.wordmark').evaluate(el => el.href) === main.href, 'brand returns to courses on this site');
        check(await page.locator('#lesson-link').evaluate(el => el.href) === main.href + '#101-3', 'related lesson stays on this site');
        check(await page.locator('#growing-apps-link').evaluate(el => el.href) === hub.href, 'app returns to standalone hub');
        await intact(page);
        await page.locator('#copy-tools summary').click();
        check(await page.locator('#ministrybag-move').isVisible(), 'migration instructions remain available');
        await page.locator('#lesson-link').click();
        await page.locator('#session-3.active').waitFor();
        for (const q of questions) check(await page.locator('#question-101-' + q.id).inputValue() === JSON.parse(seed.answers)['question-101-' + q.id], 'saved lesson answer restores: ' + q.id);
        const tool = page.locator('#session-3.active .block-tool-btn[href="tools/daily-prayers/"]');
        check(await tool.count() === 1, 'lesson links to the same companion');
        const popupPromise = ctx.waitForEvent('page'); await tool.click();
        const popup = await popupPromise; watch(popup); await popup.waitForLoadState('networkidle');
        await popup.locator('#read-view').waitFor({ state: 'visible' });
        check(new URL(popup.url()).origin === main.origin && new URL(popup.url()).pathname === app.pathname, 'lesson opens local companion');
        await intact(popup);
        await popup.locator('#growing-apps-link').click();
        await popup.locator('.apps-hub h1').waitFor();
        check((await popup.locator('h1').textContent()).trim() === 'Your Growing Apps', 'app return opens hub');
        await popup.locator('.breadcrumb a').click(); await popup.locator('#home-view').waitFor({ state: 'visible' });
        check((await popup.locator('#home-growing-apps-link').textContent()).trim() === 'Your Growing Apps', 'hub returns to courses');
        await intact(popup);
        await popup.locator('#home-growing-apps-link').click();
        await popup.locator('#weekly-connection-app-link').click();
        await popup.locator('#welcomeScreen').waitFor({state:'visible'});
        check(new URL(popup.url()).origin === main.origin && new URL(popup.url()).pathname === new URL('weekly-connection-time/', hub).pathname, 'weekly companion stays on the same site');
        check(await popup.locator('#lesson-link').evaluate(el=>el.href) === main.href+'#202-8', 'weekly companion returns to marriage lesson');
        await intact(popup);
        await popup.locator('#lesson-link').click();
        await popup.locator('#session-8.active').waitFor();
        for (const q of marriageQuestions) check(await popup.locator('#question-202-'+q.id).inputValue() === JSON.parse(seed.answers)['question-202-'+q.id], 'saved marriage answer restores: '+q.id);
        const marriageTool = popup.locator('#session-8.active .block-tool-btn[href="tools/weekly-connection-time/"]');
        check(await marriageTool.count()===1, 'marriage practice links to the local companion');
        const weeklyPagePromise = ctx.waitForEvent('page');await marriageTool.click();
        const weeklyPage = await weeklyPagePromise;watch(weeklyPage);await weeklyPage.waitForLoadState('networkidle');
        await weeklyPage.locator('#welcomeScreen').waitFor({state:'visible'});
        check(new URL(weeklyPage.url()).origin === main.origin, 'lesson opens same-origin Weekly Connection Time');
        await intact(weeklyPage);
        await weeklyPage.locator('#growing-apps-link').click();
        await weeklyPage.locator('.apps-hub h1').waitFor();
        check(await weeklyPage.locator('.app-button').count()===3, 'weekly companion returns to all three apps');
        await intact(weeklyPage);
        await weeklyPage.locator('#heart52-app-link').click();
        await weeklyPage.locator('#library-view').waitFor({state:'visible'});
        check(new URL(weeklyPage.url()).pathname===new URL('heart52/',hub).pathname,'hub opens same-site Heart52');
        check(await weeklyPage.locator('.verse-link').count()===52,'Heart52 library loads');
        for(const l of memoryLessons){
            await weeklyPage.goto(main.href+'#'+l.id.slice(0,3)+'-'+Number(l.id.slice(4)),{waitUntil:'networkidle'});
            const section=weeklyPage.locator('#session-'+Number(l.id.slice(4))+'.active');await section.waitFor();
            for(const q of l.questions)check(await section.locator('#question-'+l.id.slice(0,3)+'-'+q.id).inputValue()===JSON.parse(seed.answers)['question-'+l.id.slice(0,3)+'-'+q.id],'preserve memory lesson answer '+l.id+' '+q.id);
            const memoryLink=section.locator('a[href="tools/heart52/"]');check(await memoryLink.count()===1,'single optional Heart52 link '+l.id);
            const opening=ctx.waitForEvent('page');await memoryLink.click();const memory=await opening;watch(memory);await memory.waitForLoadState('networkidle');await memory.locator('#library-view').waitFor({state:'visible'});
            check(new URL(memory.url()).pathname===new URL('heart52/',hub).pathname,'lesson opens canonical Heart52 '+l.id);await intact(memory);await memory.close();
        }
        check(errors.length === 0, 'no page exceptions: ' + errors.join(';'));
        console.log('PASS', job.width, job.reducedMotion || 'normal');
        await ctx.close();
    }
    await browser.close();
    console.log(`${passed} companion app hub checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
