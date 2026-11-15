const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

let passed = 0;
let failed = 0;

function assert(name, cond, detail) {
  if (cond) {
    passed += 1;
    console.log('PASS: ' + name);
  } else {
    failed += 1;
    console.error('FAIL: ' + name + (detail ? ' -> ' + detail : ''));
  }
}

function createServer() {
  return http.createServer((req, res) => {
    const clean = (req.url || '/').split('?')[0];
    const rel = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT, rel);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

(async () => {
  const srv = createServer();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const baseUrl = 'http://127.0.0.1:' + srv.address().port;
  const browser = await chromium.launch({ headless: true });

  const contexts = [
    { name: '375x667', viewport: { width: 375, height: 667 }, reducedMotion: 'no-preference' },
    { name: '390x844', viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' },
    { name: '1280x800', viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' },
    { name: 'reduced-motion', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }
  ];

  for (const cfg of contexts) {
    const context = await browser.newContext({ viewport: cfg.viewport, reducedMotion: cfg.reducedMotion });
    const page = await context.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));

    await page.goto(baseUrl + '/index.html#202-10', { waitUntil: 'networkidle' });
    await page.waitForSelector('#session-10.active iframe.gt-widget-frame', { timeout: 20000 });

    const frameLocator = page.locator('#session-10.active iframe.gt-widget-frame[src*="lords-supper-picture.html"]');
    assert(cfg.name + ' renders lords-supper-picture iframe', (await frameLocator.count()) === 1);
    const title = await frameLocator.getAttribute('title');
    assert(cfg.name + ' iframe has title "What the Table Pictures"', title === 'What the Table Pictures', title);

    const frame = page.frameLocator('#session-10.active iframe.gt-widget-frame[src*="lords-supper-picture.html"]');
    await frame.locator('#widget').waitFor({ state: 'visible', timeout: 15000 });

    const initialState = await frame.locator('body').evaluate(() => {
      const root = document.documentElement;
      const card = document.querySelector('.verse-card-content');
      const cs = getComputedStyle(document.documentElement);
      return {
        text: document.body.innerText,
        overflow: root.scrollWidth > window.innerWidth + 1,
        cardH: card ? card.getBoundingClientRect().height : 0,
        fleshLight: cs.getPropertyValue('--flesh-light').trim(),
        crimson: cs.getPropertyValue('--crimson').trim(),
        handOpacity: getComputedStyle(document.getElementById('hand-group')).opacity,
        bloodOpacity: getComputedStyle(document.getElementById('blood-group')).opacity
      };
    });

    assert(cfg.name + ' no horizontal overflow inside widget', !initialState.overflow);
    assert(cfg.name + ' no tap-begin text on intro', !/tap begin/i.test(initialState.text));
    assert(cfg.name + ' hand & blood hidden cleanly on intro', initialState.handOpacity === '0' && initialState.bloodOpacity === '0');

    // Step 1: Begin -> Bread & Body
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 500);
    const step1 = await frame.locator('body').evaluate(() => ({
      title: document.querySelector('.verse-card-title').textContent,
      cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height,
      handOpacity: getComputedStyle(document.getElementById('hand-group')).opacity,
      bloodOpacity: getComputedStyle(document.getElementById('blood-group')).opacity,
      bridgeOpacity: getComputedStyle(document.getElementById('bridge-wash')).opacity,
      cupOpacity: getComputedStyle(document.getElementById('cup-group')).opacity,
      breadColor: getComputedStyle(document.querySelector('#bread-left path')).fill,
      handColor: getComputedStyle(document.querySelector('#hand-group path')).fill
    }));
    assert(cfg.name + ' Step 1 shows The Bread: His Body', /1\. The Bread: His Body/.test(step1.title), step1.title);
    assert(cfg.name + ' Step 1 bread & hand fill color match 1:1', step1.breadColor === step1.handColor, step1.breadColor + ' vs ' + step1.handColor);
    assert(cfg.name + ' Step 1 reveals hand and keeps blood off', Number(step1.handOpacity) > 0.9 && step1.bloodOpacity === '0');
    assert(cfg.name + ' Step 1 shows color bridge and locks card height', Number(step1.bridgeOpacity) > 0.9 && Math.abs(step1.cardH - initialState.cardH) < 2);

    // Step 2: Next -> Cup & Blood
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 500);
    const step2 = await frame.locator('body').evaluate(() => ({
      title: document.querySelector('.verse-card-title').textContent,
      cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height,
      bloodOpacity: getComputedStyle(document.getElementById('blood-group')).opacity,
      wineOpacity: getComputedStyle(document.getElementById('cup-wine')).opacity,
      wineColor: getComputedStyle(document.querySelector('#cup-wine rect')).fill,
      bloodDropColor: getComputedStyle(document.querySelector('#blood-group path[fill="var(--crimson)"]')).fill
    }));
    assert(cfg.name + ' Step 2 shows The Cup: His Blood', /2\. The Cup: His Blood/.test(step2.title), step2.title);
    assert(cfg.name + ' Step 2 wine & blood fill color match 1:1', step2.wineColor === step2.bloodDropColor, step2.wineColor + ' vs ' + step2.bloodDropColor);
    assert(cfg.name + ' Step 2 reveals both wine and blood and locks card height', Number(step2.wineOpacity) > 0.9 && Number(step2.bloodOpacity) > 0.9 && Math.abs(step2.cardH - initialState.cardH) < 2);

    // Step 3: Next -> Look Back
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 400);
    const step3 = await frame.locator('body').evaluate(() => ({
      title: document.querySelector('.verse-card-title').textContent,
      arcOpacity: getComputedStyle(document.getElementById('remember-arc')).opacity,
      cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height
    }));
    assert(cfg.name + ' Step 3 shows Remembrance and Look Back arc', /3\. Look Back/.test(step3.title) && Number(step3.arcOpacity) > 0.9 && Math.abs(step3.cardH - initialState.cardH) < 2);

    // Step 4: Next -> Look Forward & Start Over
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 400);
    const step4 = await frame.locator('body').evaluate(() => ({
      title: document.querySelector('.verse-card-title').textContent,
      dawnOpacity: getComputedStyle(document.getElementById('dawn-glow')).opacity,
      cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height
    }));
    assert(cfg.name + ' Step 4 shows Until He Comes and dawn glow', /4\. Look Forward/.test(step4.title) && Number(step4.dawnOpacity) > 0.9 && Math.abs(step4.cardH - initialState.cardH) < 2);

    await frame.locator('[data-control="restart"]').click();
    await page.waitForTimeout(100);
    const resetTitle = await frame.locator('.verse-card-title').textContent();
    assert(cfg.name + ' Start Over resets to intro', /A Meal That Points to the Cross/.test(resetTitle || ''));

    assert(cfg.name + ' zero console/page errors', errs.length === 0, errs.join('; '));
    await context.close();
  }

  await browser.close();
  srv.close();
  console.log('\nTotal: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
