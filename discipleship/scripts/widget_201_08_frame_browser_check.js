"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const assert = require("assert");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");

function startStaticServer(rootDir) {
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".json": "application/json; charset=utf-8"
  };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, "");
      const fullPath = path.join(rootDir, safePath === "/" ? "index.html" : safePath.replace(/^\/+/, ""));
      if (!fullPath.startsWith(rootDir) || !fs.existsSync(fullPath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(fullPath);
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      fs.createReadStream(fullPath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function verifyLessonEmbed(browser, baseUrl, viewport, options = {}) {
  const ctx = await browser.newContext({
    viewport,
    reducedMotion: options.reducedMotion || "no-preference"
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
  });

  await page.goto(`${baseUrl}/index.html#201-8`, { waitUntil: "domcontentloaded" });
  const iframeLoc = page.locator("#session-8.active iframe.gt-widget-frame").first();
  await iframeLoc.waitFor({ state: "visible", timeout: 20000 });
  const frame = page.frameLocator("#session-8.active iframe.gt-widget-frame").first();
  await frame.locator('[data-control="begin"]').waitFor({ state: "visible", timeout: 20000 });

  assert.strictEqual(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `Outer overflow at ${viewport.width}`);
  assert.strictEqual(await frame.locator(".course-tag").textContent(), "201-08");
  assert.strictEqual(await frame.locator("header.title-bar h1").textContent(), "The Grace and Mercy Cycle");

  // Overview toggle and return
  await frame.locator('[data-control="overview"]').click();
  await frame.locator('[data-control="box-mercy"]').waitFor({ state: "visible", timeout: 5000 });
  assert.strictEqual(await frame.locator(".grace-box.overview-box").count(), 4);
  await frame.locator('[data-control="return"]').click();
  await frame.locator('[data-control="begin"]').waitFor({ state: "visible", timeout: 5000 });

  // Step through all 5 stops, check uniform card height, accessible dot buttons, and SVG img semantics
  await frame.locator('[data-control="begin"]').click();
  await frame.locator('[data-control="next"]').waitFor({ state: "visible", timeout: 5000 });

  const cardHeights = [];
  for (let i = 0; i < 5; i++) {
    const h = await frame.locator(".verse-card-content").evaluate((el) => Math.round(el.getBoundingClientRect().height));
    cardHeights.push(h);
    const svgRole = await frame.locator("svg").first().getAttribute("role");
    assert.strictEqual(svgRole, "img", "SVG should expose role='img'");
    assert.strictEqual(await frame.locator(".dot-btn").count(), 5, "Expected 5 accessible dot buttons");
    if (i < 4) {
      await frame.locator('[data-control="next"]').click();
    }
  }
  assert.strictEqual(new Set(cardHeights).size, 1, `Expected constant card height across steps, got ${cardHeights.join(",")}`);

  // Confirm bottom box borders do not touch/clip against tray
  const diagramGap = await frame.locator(".diagram-wrapper").evaluate((wrap) => {
    const wRect = wrap.getBoundingClientRect();
    const boxRects = Array.from(wrap.querySelectorAll(".grace-box")).map((b) => b.getBoundingClientRect());
    const maxBottom = Math.max(...boxRects.map((r) => r.bottom));
    return Math.round(wRect.bottom - maxBottom);
  });
  assert(diagramGap >= 10, `Expected >=10px bottom breathing room below diagram boxes, got ${diagramGap}px`);

  // Reduced motion check
  if (options.reducedMotion === "reduce") {
    const dur = await frame.locator(".grace-box").first().evaluate((el) => getComputedStyle(el).transitionDuration);
    assert.strictEqual(dur, "0s", `Expected 0s transition in reduced-motion, got ${dur}`);
  }

  // Back + Restart
  await frame.locator('[data-control="back"]').click();
  assert.strictEqual(await frame.locator('[data-control="next"]').isVisible(), true);
  await frame.locator('[data-control="next"]').click();
  await frame.locator('[data-control="restart"]').click();
  await frame.locator('[data-control="begin"]').waitFor({ state: "visible", timeout: 5000 });

  assert.strictEqual(errors.length, 0, `Errors: ${errors.join("; ")}`);
  await ctx.close();
}

async function main() {
  const { server, url } = await startStaticServer(ROOT);
  const browser = await chromium.launch({ headless: true });
  try {
    await verifyLessonEmbed(browser, url, { width: 390, height: 844 });
    await verifyLessonEmbed(browser, url, { width: 375, height: 812 });
    await verifyLessonEmbed(browser, url, { width: 1280, height: 800 });
    await verifyLessonEmbed(browser, url, { width: 390, height: 844 }, { reducedMotion: "reduce" });
    console.log("ALL 201-08 FRAME EMBEDDED CHECKS PASSED.");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
