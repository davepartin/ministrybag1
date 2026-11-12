#!/usr/bin/env node
'use strict';
const assert = require('assert');
const { chromium } = require('playwright');
const lesson = require('../data/202-06.json');
const BASE = process.env.L20206_SEQUENCE_BASE_URL || 'http://127.0.0.1:8775/index.html';
let checks = 0;
function check(name, ok) { assert.ok(ok, name); checks++; console.log('PASS: ' + name); }
(async () => {
    const browser = await chromium.launch({ headless: true, channel: process.env.GT_BROWSER_CHANNEL || 'chrome' });
    try {
        for (const width of [375, 390, 1280]) {
            const page = await browser.newPage({ viewport: { width, height: 844 } });
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.route('**/scripts/account.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
            await page.goto(BASE + '#202-6');
            const root = page.locator('#session-6.active [data-parable-sequence]');
            await root.scrollIntoViewIfNeeded();
            await page.waitForFunction(() => {
                const imgs = [...document.querySelectorAll('#session-6.active .parable-sequence-frame')];
                return imgs.length === 5 && imgs.every(i => i.complete && i.naturalWidth > 0);
            });
            check(width + ': five aligned frames load', await root.locator('img').evaluateAll(imgs => imgs.length === 5 && imgs.every(i => i.width === imgs[0].width && i.height === imgs[0].height)));
            check(width + ': stops retained', await root.getAttribute('data-sequence-stops') === '0,0.16,0.3,0.44,0.58');
            check(width + ': no old dissolve or nested picture', await page.locator('#session-6 .parable-img-bw, #session-6 .block-parable img').count() === 0);
            for (const id of lesson.blocks.filter(b => b.type === 'question').map(b => b.id)) {
                check(width + ': question ' + id + ' retained', await page.locator('[id="question-202-' + id + '"]').count() === 1);
            }
            const h = await root.evaluate(e => e.getBoundingClientRect().height);
            const dominant = [];
            for (const progress of [0, 0.16, 0.3, 0.44, 0.7]) {
                await root.evaluate((e, progress) => {
                    const top = document.querySelector('.lesson-topbar').getBoundingClientRect().bottom;
                    const range = (innerHeight - top) * 0.62;
                    const desired = top + (innerHeight - top) * 0.4 - progress * range;
                    scrollBy({ top: e.getBoundingClientRect().top - desired, behavior: 'instant' });
                }, progress);
                await page.waitForTimeout(100);
                dominant.push(await root.locator('img').evaluateAll(imgs => {
                    let index = 0;
                    imgs.forEach((img, i) => { if (+getComputedStyle(img).opacity >= +getComputedStyle(imgs[index]).opacity) index = i; });
                    return index;
                }));
                check(width + ': reserved height stable at ' + progress, Math.abs(await root.evaluate(e => e.getBoundingClientRect().height) - h) < 1.5);
            }
            check(width + ': frames advance to final', dominant[0] === 0 && dominant[4] === 4 && dominant.every((x, i) => i === 0 || x >= dominant[i - 1]));
            check(width + ': no overflow or page errors', errors.length === 0 && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            await page.close();
        }
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        await page.route('**/scripts/account.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
        await page.goto(BASE + '#202-6');
        const root = page.locator('#session-6.active [data-parable-sequence]');
        await root.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
            const imgs = [...document.querySelectorAll('#session-6.active .parable-sequence-frame')];
            return imgs.length === 5 && imgs[4].complete && imgs[4].naturalWidth > 0;
        });
        check('reduced motion shows final frame', await root.locator('img').last().evaluate(e => +getComputedStyle(e).opacity === 1));
        await page.close();
        console.log(checks + ' worship sequence checks passed.');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
