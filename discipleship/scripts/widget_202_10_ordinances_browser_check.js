#!/usr/bin/env node
// Studio Wash browser check for 202-10 The Doorway and the Table (widgets/two-ordinances.html).
// GT_BASE_URL selects local or Firebase preview URL; GT_SCREENSHOT_DIR saves 390x844 step PNGs.
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const base = process.env.GT_BASE_URL || 'http://127.0.0.1:8768/index.html';
const screenshotDir = process.env.GT_SCREENSHOT_DIR || '';
if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/202-10.json'), 'utf8'));
const questions = data.blocks.filter(b => b.type === 'question');
const seed = Object.fromEntries(questions.map((q, i) => ['question-202-' + q.id, 'SYN-ordinances-' + i]));
seed['question-101-1-1'] = 'SYN-ordinances-other';

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
                                if (location.pathname.includes('two-ordinances.html')) window.__widgetStorageWrites++;
                                return orig.apply(this, args);
                            };
                        }
                        if (window === window.top && !sessionStorage.getItem('ordinances-seeded')) {
                            localStorage.setItem('christianFoundationsResponses', JSON.stringify(seedData));
                            sessionStorage.setItem('ordinances-seeded', '1');
                        }
                    }, seed);

                    const page = await ctx.newPage();
                    const pageErrors = [];
                    const consoleErrors = [];
                    const httpErrors = [];
                    page.on('pageerror', e => pageErrors.push(e.message));
                    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
                    page.on('response', r => {
                        if (/two-ordinances\.html|202-10\.json/.test(r.url()) && r.status() >= 400) {
                            httpErrors.push(r.status() + ' ' + r.url());
                        }
                    });

                    await page.goto(base + '#202-10');
                    const lesson = page.locator('#session-10.active');
                    await lesson.waitFor();
                    const frameEl = lesson.locator('iframe[src*="widgets/two-ordinances.html"]');
                    await frameEl.waitFor();
                    const frame = await (await frameEl.elementHandle()).contentFrame();
                    await frame.locator('.title-bar h1').waitFor();
                    await frame.locator('.facet').first().waitFor();
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
                    ck(tag + ' header text/tag', hdr.title === 'The Doorway and the Table' && hdr.tag === '202-10');
                    ck(tag + ' Studio Wash header colors/type', hdr.bg === 'rgb(44, 36, 22)' && hdr.color === 'rgb(250, 248, 243)' && hdr.fontSize === '17px' && hdr.badgeColor === 'rgb(229, 222, 201)');
                    ck(tag + ' header height/gap', hdr.height >= 34 && hdr.height <= 60 && hdr.gap >= 7);

                    const frameText = await frame.locator('body').textContent();
                    ck(tag + ' zero em/en dashes', !/[\u2013\u2014]/.test(frameText));
                    ck(tag + ' 5 facets present', await frame.locator('.facet').count() === 5);

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

                    const answerB = frame.locator('#answer-b');
                    const answerS = frame.locator('#answer-s');
                    const footerEl = frame.locator('#footer');
                    const hB = await answerB.evaluate(e => e.clientHeight);
                    const hS = await answerS.evaluate(e => e.clientHeight);
                    const hFooter = await footerEl.evaluate(e => e.clientHeight);
                    const widgetTotalH = await frame.evaluate(() => document.getElementById('widget-outer').clientHeight);

                    const names = ['01-q1-what', '02-q2-picture', '03-q3-often', '04-q4-says', '05-q5-points-reveal'];
                    for (let i = 0; i < 5; i++) {
                        if (i > 0) await frame.locator('.facet').nth(i).click();
                        await page.waitForTimeout(motion === 'reduce' ? 40 : 280);
                        ck(tag + ' facet ' + i + ' pressed', await frame.locator('.facet').nth(i).getAttribute('aria-pressed') === 'true');
                        ck(tag + ' answer heights locked q' + i,
                            await answerB.evaluate((e, h) => Math.abs(e.clientHeight - h) <= 1, hB) &&
                            await answerS.evaluate((e, h) => Math.abs(e.clientHeight - h) <= 1, hS));
                        ck(tag + ' footer & total height locked q' + i,
                            await footerEl.evaluate((e, h) => Math.abs(e.clientHeight - h) <= 1, hFooter) &&
                            await frame.evaluate(h => Math.abs(document.getElementById('widget-outer').clientHeight - h) <= 1, widgetTotalH));
                        ck(tag + ' no horizontal overflow q' + i,
                            await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) &&
                            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
                        ck(tag + ' iframe height >= content q' + i,
                            await frameEl.evaluate(e => e.clientHeight) >= await frame.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) - 1);
                        if (i === 4) {
                            ck(tag + ' reveal unlocked after all 5', await frame.locator('#reveal').evaluate(e => e.classList.contains('show')));
                        }
                        await capture(names[i]);
                    }

                    // Next / Back / Start Over navigation check
                    await frame.locator('#btn-prev').click();
                    await page.waitForTimeout(motion === 'reduce' ? 40 : 180);
                    ck(tag + ' Back goes to Q4', await frame.locator('.facet').nth(3).getAttribute('aria-pressed') === 'true');
                    await frame.locator('#btn-next').click();
                    await page.waitForTimeout(motion === 'reduce' ? 40 : 180);
                    ck(tag + ' Next goes to Q5 / Restart', await frame.locator('[data-control="restart"]').count() === 1);
                    await frame.locator('[data-control="restart"]').focus();
                    await page.keyboard.press('Enter');
                    await page.waitForTimeout(motion === 'reduce' ? 40 : 180);
                    ck(tag + ' keyboard Start Over returns to Q1', await frame.locator('.facet').first().getAttribute('aria-pressed') === 'true');

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

    console.log('PASSED ' + checks + ' checks in widget_202_10_ordinances_browser_check.js');
})().catch(err => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
});
