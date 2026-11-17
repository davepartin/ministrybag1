#!/usr/bin/env node
'use strict';
// Physical scroll regression for the opt-in 201-04 sequence; no real answers used.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.SOILS_BASE_URL || 'http://127.0.0.1:8845/index.html';
(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium' });
    let passed = 0;
    const check = (value, label) => { assert(value, label); passed++; };
    for (const job of [
        { width: 375, height: 812 }, { width: 390, height: 844 },
        { width: 1280, height: 800 }, { width: 390, height: 568 },
        { width: 390, height: 844, reducedMotion: 'reduce' }
    ]) {
        const ctx = await browser.newContext({ viewport: { width: job.width, height: job.height }, reducedMotion: job.reducedMotion || 'no-preference' });
        const page = await ctx.newPage(), errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`${BASE}#201-4`, { waitUntil: 'networkidle' });
        await page.locator('#session-4.active [data-parable-sequence]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        const state = () => page.evaluate(() => {
            const e = document.querySelector('#session-4.active [data-parable-sequence]');
            const w = e.parentElement, r = e.getBoundingClientRect(), wr = w.getBoundingClientRect();
            return { top: r.top, bottom: r.bottom, height: r.height, wrapperHeight: wr.height,
                docTop: wr.top + scrollY, pin: parseFloat(w.style.getPropertyValue('--sequence-pin-top')),
                travel: wr.height - r.height, scrollY, bar: document.querySelector('.lesson-topbar').getBoundingClientRect().bottom,
                viewport: innerHeight, opacity: [...e.querySelectorAll('img')].map(i => +getComputedStyle(i).opacity),
                loaded: [...e.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0),
                active: w.hasAttribute('data-sequence-paced-active'), overflow: document.documentElement.scrollWidth > innerWidth,
                parableTop: w.nextElementSibling.getBoundingClientRect().top };
        });
        let initial = await state();
        check(initial.loaded, 'six images load');
        check(!initial.overflow, 'no horizontal overflow');
        check(await page.locator('#session-4.active .question-textarea').count() === 6, 'six questions retained');
        if (job.reducedMotion) {
            check(initial.opacity[5] === 1 && initial.opacity.slice(0, 5).every(v => v === 0), 'reduced motion final frame');
            check(!initial.active && Math.abs(initial.wrapperHeight - initial.height) < 2, 'reduced motion no extra scroll');
        } else {
            check(initial.scrollY === 0 && initial.opacity[0] === 1 && initial.opacity.slice(1).every(v => v === 0), 'initial frame held at page top');
            check(initial.travel >= 600, 'longer scroll travel enabled');
            const scrollTo = async fraction => {
                const s = await state();
                await page.evaluate(y => window.scrollTo({ top: Math.round(y), behavior: 'instant' }), s.docTop - s.pin + s.travel * fraction);
                await page.waitForTimeout(100);
                return state();
            };
            for (const f of [0.02, 0.10, 0.19]) {
                const s = await scrollTo(f);
                check(s.opacity[0] === 1 && s.opacity.slice(1).every(v => v === 0), 'opening holds during first 20 percent');
                check(s.top >= s.bar && s.bottom <= s.viewport, 'entire image visible while held');
            }
            let previous = -1;
            for (let i = 0; i < 6; i++) {
                const s = await scrollTo(0.20 + ([0, 0.14, 0.27, 0.4, 0.53, 0.66][i] / 0.66) * 0.70 + 0.002);
                const dominant = s.opacity.reduce((best, v, idx, a) => v >= a[best] ? idx : best, 0);
                check(dominant === i && dominant >= previous, 'all frames advance in order'); previous = dominant;
                check(s.top >= s.bar - 1 && s.bottom <= s.viewport + 1, 'entire image visible through every frame');
                check(Math.abs(s.wrapperHeight - initial.wrapperHeight) < 2, 'stable sequence section height');
            }
            // All transitions now span 70% of travel rather than 66% of the old 62%-viewport range.
            check(initial.travel * 0.70 > (initial.viewport - initial.bar) * 0.62 * 0.66 * 1.8, 'frame transitions have at least 80 percent more scroll room');
            const end = await scrollTo(0.98);
            check(end.opacity[5] === 1 && end.opacity.slice(0, 5).every(v => v === 0), 'ending frame holds before release');
            const reverse = await scrollTo(0.10);
            check(reverse.opacity[0] === 1 && reverse.opacity.slice(1).every(v => v === 0), 'reverse scroll restores opening');
            const released = await scrollTo(1.15);
            check(released.top < initial.pin && released.opacity[5] === 1, 'normal scrolling resumes after sequence');
            check(Math.abs(released.parableTop - released.bottom) < 2, 'image stays joined to story after release');
            await page.setViewportSize({ width: job.width, height: job.height - 50 });
            await page.waitForTimeout(150);
            const resized = await scrollTo(0.5);
            check(resized.top >= resized.bar - 1 && resized.bottom <= resized.viewport + 1, 'viewport resize keeps picture visible');
            await page.emulateMedia({ media: 'print' });
            const printed = await state();
            check(Math.abs(printed.wrapperHeight - printed.height) < 2, 'print has no extra scroll spacer');
        }
        check(errors.length === 0, 'no page exceptions: ' + errors.join(';'));
        console.log('PASS', job.width, job.height, job.reducedMotion || 'normal');
        await ctx.close();
    }
    await browser.close();
    console.log(`${passed} soils pacing checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
