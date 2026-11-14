#!/usr/bin/env node
// Studio Wash browser check for 201-08 The Grace and Mercy Cycle (widgets/grace-diagram.html).
// GT_BASE_URL selects local or Firebase preview URL; GT_SCREENSHOT_DIR saves 390x844 step PNGs.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8766/index.html';
const screenshotDir = process.env.GT_SCREENSHOT_DIR || '';
if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/201-08.json'), 'utf8'));
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-201-' + q.id, 'SYN-grace-' + i]));
seed['question-101-1-1'] = 'SYN-grace-other-course';

let checks = 0;
function ck(label, ok) {
    checks++;
    assert.ok(ok, label);
}

(async () => {
    const launchOpts = { headless: true };
    if (process.env.GT_CHROMIUM_PATH) launchOpts.executablePath = process.env.GT_CHROMIUM_PATH;
    const browser = await chromium.launch(launchOpts);

    try {
        for (const width of [375, 390, 1280]) {
            for (const motion of ['no-preference', 'reduce']) {
                const tag = width + '/' + motion;
                const ctx = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: motion });
                try {
                    await ctx.route('**/scripts/account.js', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
                    await ctx.addInitScript(seedData => {
                        window.__widgetStorageWrites = 0;
                        for (const m of ['setItem', 'removeItem', 'clear']) {
                            const orig = Storage.prototype[m];
                            Storage.prototype[m] = function (...args) {
                                if (location.pathname.includes('grace-diagram.html')) window.__widgetStorageWrites++;
                                return orig.apply(this, args);
                            };
                        }
                        if (window === window.top && !sessionStorage.getItem('grace-seeded')) {
                            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seedData));
                            sessionStorage.setItem('grace-seeded', '1');
                        }
                    }, seed);

                    const page = await ctx.newPage();
                    const pageErrors = [];
                    const consoleErrors = [];
                    const httpErrors = [];
                    page.on('pageerror', e => pageErrors.push(e.message));
                    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
                    page.on('response', r => {
                        if (/grace-diagram\.html|201-08\.json/.test(r.url()) && r.status() >= 400) {
                            httpErrors.push(r.status() + ' ' + r.url());
                        }
                    });

                    await page.goto(base + '#201-8');
                    const lesson = page.locator('#session-8.active');
                    await lesson.waitFor();
                    const frameEl = lesson.locator('iframe[src*="widgets/grace-diagram.html"]');
                    await frameEl.waitFor();
                    const frame = await (await frameEl.elementHandle()).contentFrame();
                    await frame.locator('.title-bar h1').waitFor();
                    await frame.locator('[data-control="begin"]').waitFor();
                    await page.waitForTimeout(250);

                    // Studio Wash header & course tag
                    const hdr = await frame.evaluate(() => {
                        const h = document.querySelector('.title-bar');
                        const t = h.querySelector('h1');
                        const b = h.querySelector('.course-tag');
                        const hr = h.getBoundingClientRect();
                        const tr = t.getBoundingClientRect();
                        const br = b.getBoundingClientRect();
                        return {
                            title: t.textContent.trim(),
                            tag: b.textContent.trim(),
                            bg: getComputedStyle(h).backgroundColor,
                            color: getComputedStyle(t).color,
                            fontSize: getComputedStyle(t).fontSize,
                            badgeColor: getComputedStyle(b).color,
                            height: hr.height,
                            gap: br.left - tr.right
                        };
                    });
                    ck(tag + ' header text/tag', hdr.title === 'The Grace and Mercy Cycle' && hdr.tag === '201-08');
                    ck(tag + ' Studio Wash header colors/type', hdr.bg === 'rgb(44, 36, 22)' && hdr.color === 'rgb(250, 248, 243)' && hdr.fontSize === '17px' && hdr.badgeColor === 'rgb(229, 222, 201)');
                    ck(tag + ' header height/gap', hdr.height >= 34 && hdr.height <= 60 && hdr.gap >= 7);

                    // Zero em/en dashes, questions intact
                    const frameText = await frame.locator('body').textContent();
                    ck(tag + ' zero em/en dashes', !/[\u2013\u2014]/.test(frameText));
                    for (const q of questions) {
                        const key = 'question-201-' + q.id;
                        ck(tag + ' restores ' + key, await lesson.locator('#' + key).inputValue() === seed[key]);
                    }
                    const storedBefore = await page.evaluate(() => localStorage.getItem('christianFoundationsResponses'));

                    const capture = async (name) => {
                        if (!screenshotDir || width !== 390 || motion !== 'no-preference') return;
                        await frameEl.scrollIntoViewIfNeeded();
                        await page.waitForTimeout(120);
                        await frameEl.screenshot({ path: path.join(screenshotDir, name + '.png') });
                    };

                    const cardArea = frame.locator('#card-area');
                    const guidedHeight = await cardArea.evaluate(e => e.clientHeight);
                    await capture('01-intro');

                    await frame.locator('[data-control="begin"]').click();
                    const waitMs = motion === 'reduce' ? 50 : 480;
                    await page.waitForTimeout(waitMs);

                    const stepNames = ['02-step1-mercy', '03-step2-justified', '04-step3-righteous', '05-step4-grace', '06-step5-cross'];
                    for (let step = 0; step < 5; step++) {
                        await page.waitForTimeout(step === 4 ? (motion === 'reduce' ? 50 : 800) : waitMs);
                        ck(tag + ' card-area height locked step ' + step, await cardArea.evaluate((e, h) => Math.abs(e.clientHeight - h) <= 1, guidedHeight));
                        ck(tag + ' zero horizontal overflow step ' + step,
                            await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
                            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
                        ck(tag + ' iframe accommodates content step ' + step,
                            await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);

                        if (step === 4) {
                            const crossVisible = await frame.locator('#cross-container').evaluate(e => e.classList.contains('visible'));
                            ck(tag + ' center cross visible on step 5', crossVisible);
                        }
                        await capture(stepNames[step]);
                        if (step < 4) await frame.locator('[data-control="next"]').click();
                    }

                    // Overview check
                    await frame.locator('[data-control="overview"]').click();
                    await page.waitForTimeout(motion === 'reduce' ? 50 : 500);
                    ck(tag + ' overview arrows === 4', await frame.locator('.arrow-group.visible').count() === 4);
                    ck(tag + ' overview cross visible', await frame.locator('#cross-container').evaluate(e => e.classList.contains('visible')));
                    ck(tag + ' overview boxes are native buttons', await frame.locator('button.grace-box').count() === 4);
                    await capture('07-overview');

                    // Idle stability & height-only resize guard
                    await page.waitForTimeout(450);
                    await frame.evaluate(() => {
                        window.__widgetMutations = 0;
                        new MutationObserver(ms => { window.__widgetMutations += ms.length; }).observe(
                            document.getElementById('widget-outer'),
                            { attributes: true, childList: true, characterData: true, subtree: true }
                        );
                    });
                    await frameEl.evaluate(el => {
                        window.__hostHeightWrites = 0;
                        new MutationObserver(ms => { window.__hostHeightWrites += ms.length; }).observe(
                            el,
                            { attributes: true, attributeFilter: ['style'] }
                        );
                    });
                    await page.waitForTimeout(600);
                    ck(tag + ' idle 0 mutations / 0 height writes',
                        await frame.evaluate(() => window.__widgetMutations) === 0 &&
                        await page.evaluate(() => window.__hostHeightWrites) === 0);

                    await page.setViewportSize({ width, height: 740 });
                    await page.waitForTimeout(250);
                    ck(tag + ' height-only resize 0 mutations / 0 height writes',
                        await frame.evaluate(() => window.__widgetMutations) === 0 &&
                        await page.evaluate(() => window.__hostHeightWrites) === 0);

                    ck(tag + ' zero storage writes by widget',
                        await frame.evaluate(() => window.__widgetStorageWrites) === 0 &&
                        await page.evaluate(() => localStorage.getItem('christianFoundationsResponses')) === storedBefore);
                    ck(tag + ' no page/console/http errors', pageErrors.length === 0 && consoleErrors.length === 0 && httpErrors.length === 0);
                } finally {
                    await ctx.close();
                }
            }
        }
    } finally {
        await browser.close();
    }

    console.log('PASSED ' + checks + ' checks in widget_201_08_grace_browser_check.js');
})().catch(err => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
