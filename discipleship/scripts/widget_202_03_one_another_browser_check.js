#!/usr/bin/env node
// Studio Wash browser check for 202-03 One Another (widgets/one-another.html).
// GT_BASE_URL selects local or Firebase preview URL; GT_SCREENSHOT_DIR saves 390x844 step PNGs.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8767/index.html';
const screenshotDir = process.env.GT_SCREENSHOT_DIR || '';
if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/202-03.json'), 'utf8'));
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-202-' + q.id, 'SYN-one-another-' + i]));
seed['question-101-1-1'] = 'SYN-one-another-other';

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
                                if (location.pathname.includes('one-another.html')) window.__widgetStorageWrites++;
                                return orig.apply(this, args);
                            };
                        }
                        if (window === window.top && !sessionStorage.getItem('one-another-seeded')) {
                            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seedData));
                            sessionStorage.setItem('one-another-seeded', '1');
                        }
                    }, seed);

                    const page = await ctx.newPage();
                    const pageErrors = [];
                    const consoleErrors = [];
                    const httpErrors = [];
                    page.on('pageerror', e => pageErrors.push(e.message));
                    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
                    page.on('response', r => {
                        if (/one-another\.html|202-03\.json/.test(r.url()) && r.status() >= 400) {
                            httpErrors.push(r.status() + ' ' + r.url());
                        }
                    });

                    await page.goto(base + '#202-3');
                    const lesson = page.locator('#session-3.active');
                    await lesson.waitFor();
                    const frameEl = lesson.locator('iframe[src*="widgets/one-another.html"]');
                    await frameEl.waitFor();
                    const frame = await (await frameEl.elementHandle()).contentFrame();
                    await frame.locator('.title-bar h1').waitFor();
                    await frame.locator('.ocard').first().waitFor();
                    await page.waitForTimeout(250);

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
                    ck(tag + ' header text/tag', hdr.title === 'One Another' && hdr.tag === '202-03');
                    ck(tag + ' Studio Wash header colors/type', hdr.bg === 'rgb(44, 36, 22)' && hdr.color === 'rgb(250, 248, 243)' && hdr.fontSize === '17px' && hdr.badgeColor === 'rgb(229, 222, 201)');
                    ck(tag + ' header height/gap', hdr.height >= 34 && hdr.height <= 60 && hdr.gap >= 7);

                    const frameText = await frame.locator('body').textContent();
                    ck(tag + ' zero em/en dashes', !/[\u2013\u2014]/.test(frameText));
                    ck(tag + ' diagram present with 8 seats', await frame.locator('#seat-dots circle.table-seat').count() === 8);
                    ck(tag + ' 8 ocard buttons', await frame.locator('.ocard').count() === 8);

                    for (const q of questions) {
                        const key = 'question-202-' + q.id;
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
                    const lockedHeight = await cardArea.evaluate(e => e.clientHeight);
                    await capture('01-empty');

                    const cards = frame.locator('.ocard');
                    for (let i = 0; i < 8; i++) {
                        await cards.nth(i).click();
                        await page.waitForTimeout(motion === 'reduce' ? 40 : 300);
                        ck(tag + ' active pressed card ' + i, await cards.nth(i).getAttribute('aria-pressed') === 'true');
                        ck(tag + ' card-area height locked ' + i, await cardArea.evaluate((e, h) => Math.abs(e.clientHeight - h) <= 1, lockedHeight));
                        ck(tag + ' no horizontal overflow ' + i,
                            await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
                            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
                        ck(tag + ' iframe height >= content ' + i,
                            await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
                        if (i === 0) await capture('02-welcome');
                        if (i === 4) await capture('03-pray-for');
                    }

                    // Pick for this week + verify table label/ring updates
                    await frame.locator('[data-control="pick"]').click();
                    await page.waitForTimeout(motion === 'reduce' ? 40 : 220);
                    ck(tag + ' picked state set', await frame.locator('[data-control="picked"]').count() === 1);
                    ck(tag + ' diagram sub updates to PICKED', /PICKED/i.test(await frame.locator('#diagram-focus-sub').textContent()));
                    await capture('04-picked');

                    // Keyboard test on first card and clear
                    await frame.locator('[data-control="clear"]').focus();
                    await page.keyboard.press('Enter');
                    await page.waitForTimeout(80);
                    ck(tag + ' keyboard Clear restores prompt', /Christ Loves First/i.test(await cardArea.textContent()));

                    await cards.first().focus();
                    await page.keyboard.press('Space');
                    await page.waitForTimeout(80);
                    ck(tag + ' keyboard Space opens Welcome', /Welcome one another/i.test(await cardArea.textContent()));

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

    console.log('PASSED ' + checks + ' checks in widget_202_03_one_another_browser_check.js');
})().catch(err => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
