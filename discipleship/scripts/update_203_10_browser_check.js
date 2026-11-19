#!/usr/bin/env node
'use strict';
// 203-10 update (Dave's voice-session copy, 2026-11-19). Isolated synthetic
// answers only, no real accounts. Confirms the approved copy renders, the
// retired 10.4 ("What is next for you?") keeps its answer and original prompt
// under Earlier saved responses, and the new invitation question starts empty
// instead of inheriting the old answer.
const assert = require('assert/strict');
const {chromium} = require('playwright');
const data = require('../data/203-10.json');
const otherData = require('../data/203-09.json');
const storage = require('./answer-storage.js');
const base = process.env.UPDATE20310_BASE_URL || 'http://127.0.0.1:8833/index.html';
const active = data.blocks.filter(b => b.type === 'question');
const retired = data.retiredQuestions || [];
const invite = active.find(q => q.id === '203-10-invite');
const oldNext = retired.find(q => q.id === '203-10-next');
const foreignKey = 'question-203-' + otherData.blocks.find(b => b.type === 'question').id;
const seed = {[storage.MIGRATION_FLAG]: true, [foreignKey]: 'SYN-other-lesson-private'};
for (const [i, q] of active.entries()) if (q.id !== '203-10-invite') seed['question-203-' + q.id] = 'SYN-current-' + i;
for (const [i, q] of retired.entries()) seed['question-203-' + q.id] = 'SYN-earlier-' + i;
const approved = [
    'Some of these words may show you how much you still need to grow.',
    'You do not have to know how they will respond to take the next loving step.',
    'Growing Deep began with a Father running toward His wayward son.',
    'Keep loving, keep sharing the good news, and help another person follow Jesus.',
    'The raids stopped at a dinner table.'
];
let checks = 0;
function ck(label, ok) { checks++; assert.ok(ok, label); }

(async () => {
    ck('invite question is active', !!invite && invite.text === '10.4 - Who could you begin Growing Together with, and how could you invite them?');
    ck('old 10.4 retired with its original prompt', !!oldNext && oldNext.text === '10.4 - What is next for you?');
    ck('growth question keeps its ID', active.some(q => q.id === '203-10-changed' && q.text.startsWith('10.2 - What are three ways God has grown you')));
    ck('no active and retired ID overlap', !active.some(q => retired.some(r => r.id === q.id)));
    ck('war-ended phrase removed', !JSON.stringify(data).includes('A war ended'));
    const browser = await chromium.launch({headless: true, executablePath: process.env.GT_CHROMIUM_PATH || '/usr/bin/chromium'});
    try {
        for (const width of [375, 390, 1280]) {
            const tag = String(width);
            const ctx = await browser.newContext({viewport: {width, height: 844}});
            try {
                await ctx.route('**/scripts/account.js', r => r.fulfill({body: '', contentType: 'text/javascript'}));
                await ctx.addInitScript(seed => {
                    if (window === window.top && !sessionStorage.getItem('update-seeded')) {
                        localStorage.setItem('christianFoundationsResponses', JSON.stringify(seed));
                        sessionStorage.setItem('update-seeded', 'yes');
                    }
                }, seed);
                const page = await ctx.newPage(), errors = [];
                page.on('pageerror', e => errors.push(e.message));
                await page.goto(base + '#203-10', {waitUntil: 'domcontentloaded'});
                const lesson = page.locator('#session-10');
                await lesson.locator('.question-textarea').first().waitFor();
                ck(tag + ' seven active fields', await lesson.locator('.question-textarea').count() === 7 && active.length === 7);
                for (const q of active) {
                    const key = 'question-203-' + q.id;
                    const want = q.id === '203-10-invite' ? '' : seed[key];
                    ck(tag + ' field ' + q.id, await lesson.locator('#' + key).inputValue() === want);
                }
                for (const q of retired) ck(tag + ' retired field absent ' + q.id, await lesson.locator('#question-203-' + q.id).count() === 0);
                const text = (await lesson.textContent()).replace(/\s+/g, ' ');
                for (const line of approved) ck(tag + ' renders: ' + line.slice(0, 40), text.includes(line));
                ck(tag + ' one "Growing Deep began with"', (text.match(/Growing Deep began with/g) || []).length === 1);
                await lesson.locator('#question-203-203-10-invite').fill('SYN-invite-new');
                await page.reload({waitUntil: 'domcontentloaded'});
                await lesson.locator('#question-203-203-10-invite').waitFor();
                ck(tag + ' invite answer survives reload', await lesson.locator('#question-203-203-10-invite').inputValue() === 'SYN-invite-new');
                await page.locator('#email-lesson-btn').click();
                const outgoing = await page.locator('#export-preview-text').textContent();
                ck(tag + ' Email has the new invite answer', outgoing.includes('Who could you begin Growing Together with, and how could you invite them?') && outgoing.includes('SYN-invite-new'));
                ck(tag + ' Email has Earlier saved responses', outgoing.includes('Earlier saved responses'));
                for (const q of retired) ck(tag + ' Email keeps retired prompt and answer ' + q.id, outgoing.includes(q.text) && outgoing.includes(seed['question-203-' + q.id]));
                ck(tag + ' Email excludes other lesson', !outgoing.includes(seed[foreignKey]));
                ck(tag + ' every earlier answer still stored', await page.evaluate(({seed, retired}) => {
                    const v = JSON.parse(localStorage.getItem('christianFoundationsResponses'));
                    return retired.every(q => v['question-203-' + q.id] === seed['question-203-' + q.id]);
                }, {seed, retired}));
                ck(tag + ' page does not scroll sideways', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
                ck(tag + ' no page exceptions', errors.length === 0);
                console.log('PASS 203-10 update ' + tag);
            } finally { await ctx.close(); }
        }
        console.log(checks + ' 203-10 update checks passed');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
