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
      const svg = document.getElementById('supper-svg');
      const card = document.querySelector('.verse-card-content');
      return {
        text: document.body.innerText,
        overflow: root.scrollWidth > window.innerWidth + 1,
        cardH: card ? card.getBoundingClientRect().height : 0,
        wholeOpacity: getComputedStyle(document.getElementById('bread-whole-loaf')).opacity,
        brokenOpacity: getComputedStyle(document.getElementById('bread-broken-halves')).opacity,
        hasBodyColor: svg.classList.contains('color-body'),
        hasBloodColor: svg.classList.contains('color-blood')
      };
    });

    assert(cfg.name + ' no horizontal overflow inside widget', !initialState.overflow);
    assert(cfg.name + ' no tap-begin text on intro', !/tap begin/i.test(initialState.text));
    assert(cfg.name + ' intro starts monochrome with one whole unbroken loaf',
      !initialState.hasBodyColor && !initialState.hasBloodColor && initialState.wholeOpacity === '1' && initialState.brokenOpacity === '0');

    // Step 1: Begin -> Bread breaks raggedly & ONLY Jesus' hand turns warm bread color
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 520);
    const step1 = await frame.locator('body').evaluate(() => {
      const svg = document.getElementById('supper-svg');
      return {
        title: document.querySelector('.verse-card-title').textContent,
        cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height,
        wholeOpacity: getComputedStyle(document.getElementById('bread-whole-loaf')).opacity,
        brokenOpacity: getComputedStyle(document.getElementById('bread-broken-halves')).opacity,
        hasBodyColor: svg.classList.contains('color-body'),
        hasBloodColor: svg.classList.contains('color-blood'),
        breadFill: getComputedStyle(document.querySelector('#bread-left-half .bread-light')).fill,
        handFill: getComputedStyle(document.querySelector('#jesus-hand .hand-light')).fill,
        bloodFill: getComputedStyle(document.querySelector('#beam-blood .blood-main')).fill
      };
    });
    assert(cfg.name + ' Step 1 shows The Bread: His Body', /1\. The Bread: His Body/.test(step1.title), step1.title);
    assert(cfg.name + ' Step 1 switches to broken loaf & turns only hand color ON',
      step1.hasBodyColor && !step1.hasBloodColor && step1.wholeOpacity === '0' && Number(step1.brokenOpacity) > 0.9);
    assert(cfg.name + ' Step 1 bread & hand fill match 1:1', step1.breadFill === step1.handFill, step1.breadFill + ' vs ' + step1.handFill);
    assert(cfg.name + ' Step 1 keeps blood monochrome & card height locked',
      !/155,\s*28,\s*46/.test(step1.bloodFill) && Math.abs(step1.cardH - initialState.cardH) < 2, step1.bloodFill);

    // Step 2: Next -> Hand returns to B&W, cup tips forward toward camera away from bread, ONLY blood turns crimson
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 520);
    const step2 = await frame.locator('body').evaluate(() => {
      const svg = document.getElementById('supper-svg');
      const breadBox = document.getElementById('bread-broken-halves').getBoundingClientRect();
      const pourBox = document.getElementById('cup-pour-stream').getBoundingClientRect();
      return {
        title: document.querySelector('.verse-card-title').textContent,
        cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height,
        hasBodyColor: svg.classList.contains('color-body'),
        hasBloodColor: svg.classList.contains('color-blood'),
        pourOpacity: getComputedStyle(document.getElementById('cup-pour-stream')).opacity,
        pourForwardOpacity: getComputedStyle(document.getElementById('cup-pouring-forward')).opacity,
        uprightOpacity: getComputedStyle(document.getElementById('cup-upright')).opacity,
        pourClearsBread: pourBox.left > breadBox.right + 12,
        wineFill: getComputedStyle(document.querySelector('#cup-pouring-forward [fill="var(--crimson)"]')).fill,
        bloodFill: getComputedStyle(document.querySelector('#beam-blood .blood-main')).fill
      };
    });
    assert(cfg.name + ' Step 2 shows The Cup: His Blood', /2\. The Cup: His Blood/.test(step2.title), step2.title);
    assert(cfg.name + ' Step 2 returns hand to B&W and turns blood crimson ON', !step2.hasBodyColor && step2.hasBloodColor);
    assert(cfg.name + ' Step 2 tips cup forward toward viewer, clears bread, and matches blood 1:1',
      step2.uprightOpacity === '0' && Number(step2.pourForwardOpacity) > 0.9 && Number(step2.pourOpacity) > 0.9 && step2.pourClearsBread && step2.wineFill === step2.bloodFill,
      'upright=' + step2.uprightOpacity + ' clearsBread=' + step2.pourClearsBread + ' ' + step2.wineFill + ' vs ' + step2.bloodFill);
    assert(cfg.name + ' Step 2 card height locked', Math.abs(step2.cardH - initialState.cardH) < 2);

    // Step 3: Next -> Remember Until He Comes (both colored together, cup upright & filled)
    await frame.locator('[data-control="next"]').click();
    await page.waitForTimeout(cfg.reducedMotion === 'reduce' ? 60 : 520);
    const step3 = await frame.locator('body').evaluate(() => {
      const svg = document.getElementById('supper-svg');
      return {
        title: document.querySelector('.verse-card-title').textContent,
        cardH: document.querySelector('.verse-card-content').getBoundingClientRect().height,
        hasBodyColor: svg.classList.contains('color-body'),
        hasBloodColor: svg.classList.contains('color-blood'),
        uprightWineOpacity: getComputedStyle(document.getElementById('cup-upright-wine')).opacity
      };
    });
    assert(cfg.name + ' Step 3 shows Remember Until He Comes with both colored & upright cup',
      /3\. Remember Until He Comes/.test(step3.title) && step3.hasBodyColor && step3.hasBloodColor && Number(step3.uprightWineOpacity) > 0.9);
    assert(cfg.name + ' Step 3 card height locked', Math.abs(step3.cardH - initialState.cardH) < 2);

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
