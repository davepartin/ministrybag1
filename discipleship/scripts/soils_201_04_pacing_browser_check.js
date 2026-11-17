#!/usr/bin/env node
'use strict';
// 201-04 normal scrolling: 20% opening hold, five 15% dissolves, no pinning.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.SOILS_BASE_URL || 'http://127.0.0.1:8845/index.html';
(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.GT_CHROMIUM_PATH ? { executablePath: process.env.GT_CHROMIUM_PATH } : { channel: 'chrome' }) });
    let passed = 0;
    const check = (value, label) => { assert(value, label); passed++; };
    for (const job of [
        { width: 375, height: 812 }, { width: 390, height: 844 },
        { width: 1280, height: 800 }, { width: 390, height: 844, reducedMotion: 'reduce' }
    ]) {
        const ctx = await browser.newContext({ viewport: { width: job.width, height: job.height }, reducedMotion: job.reducedMotion || 'no-preference' });
        const page = await ctx.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${BASE}#201-4`, { waitUntil: 'networkidle' });
        await page.locator('#session-4.active [data-parable-sequence]').waitFor();
        const state = () => page.evaluate(() => {
            const e = document.querySelector('#session-4.active [data-parable-sequence]');
            const w = e.parentElement, r = e.getBoundingClientRect(), wr = w.getBoundingClientRect();
            const bar = document.querySelector('.lesson-topbar').getBoundingClientRect().bottom;
            return { top: r.top, docTop: r.top + scrollY, height: r.height, wrapperHeight: wr.height,
                y: scrollY, bar, viewport: innerHeight, stops: e.dataset.sequenceStops,
                position: getComputedStyle(e).position,
                opacity: [...e.querySelectorAll('img')].map(i => +getComputedStyle(i).opacity),
                loaded: [...e.querySelectorAll('img')].length === 6 && [...e.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0),
                paced: w.hasAttribute('data-sequence-paced') || w.hasAttribute('data-sequence-paced-active'),
                overflow: document.documentElement.scrollWidth > innerWidth,
                parableTop: w.nextElementSibling.getBoundingClientRect().top, bottom: r.bottom };
        });
        const initial = await state();
        check(initial.loaded, 'six approved frames load');
        check(initial.stops === '0.2,0.35,0.5,0.65,0.8,0.95', 'requested 20% hold and 15% stops');
        check(!initial.paced && initial.position === 'relative', 'no sticky or paced treatment');
        check(Math.abs(initial.wrapperHeight - initial.height) < 2, 'no extra scroll section');
        check(!initial.overflow, 'no horizontal overflow');
        const at = async progress => {
            const s = await state();
            const visible = s.viewport - s.bar;
            const y = s.docTop - (s.bar + visible * 0.40 - progress * visible * 0.62);
            await page.evaluate(y => scrollTo({ top: Math.round(y), behavior: 'instant' }), y);
            await page.waitForTimeout(100);
            return state();
        };
        if (job.reducedMotion) {
            check(initial.opacity[5] === 1 && initial.opacity.slice(0, 5).every(v => v === 0), 'reduced motion final static frame');
        } else {
            check(initial.y === 0 && initial.opacity[0] === 1 && initial.opacity.slice(1).every(v => v === 0), 'page opens on first frame');
            let previous = initial;
            for (const progress of [0, 0.10, 0.19]) {
                const s = await at(progress);
                check(s.opacity[0] === 1 && s.opacity.slice(1).every(v => v === 0), 'opening holds through first 20 percent');
                check(Math.abs((previous.top - s.top) - (s.y - previous.y)) < 2, 'image moves up with scroll during hold');
                previous = s;
            }
            for (let i = 0; i < 5; i++) {
                const s = await at(0.20 + i * 0.15 + 0.075);
                check(s.opacity[i] === 1 && Math.abs(s.opacity[i + 1] - 0.5) < 0.025, 'each 15 percent interval cross-dissolves smoothly');
                check(Math.abs((previous.top - s.top) - (s.y - previous.y)) < 2, 'image continues scrolling through every dissolve');
                check(Math.abs(s.wrapperHeight - initial.height) < 2, 'no added height through transitions');
                previous = s;
            }
            const end = await at(0.98);
            check(end.opacity[5] === 1 && end.opacity.slice(0, 5).every(v => v === 0), 'final frame reached after 95 percent');
            check(Math.abs(end.parableTop - end.bottom) < 2, 'image remains joined to story');
            const reverse = await at(0.10);
            check(reverse.opacity[0] === 1 && reverse.opacity.slice(1).every(v => v === 0), 'reverse scroll restores first frame');
        }
        check(errors.length === 0, 'no page exceptions: ' + errors.join(';'));
        console.log('PASS', job.width, job.reducedMotion || 'normal');
        await ctx.close();
    }
    await browser.close();
    console.log(`${passed} normal-scroll soils pacing checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
