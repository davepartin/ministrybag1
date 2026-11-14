"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const assert = require("assert");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SHOT_DIR =
  process.env.SHOT_DIR ||
  "/Users/dpartin/.gemini/antigravity/brain/f6932f32-8ffd-4554-beec-fbe4d8f15996/scratch/potluck-buttons-shots";

function startStaticServer(rootDir) {
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".json": "application/json; charset=utf-8"
  };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, "");
      const fullPath = path.join(rootDir, safePath === "/" ? "index.html" : safePath);
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

async function openLesson10105(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html#101-5`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#checklist-101-service-interests .checklist-tile", { timeout: 20000 });
}

async function runViewportCheck(browser, baseUrl, viewport, options = {}) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: options.reducedMotion || "no-preference"
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });

  await openLesson10105(page, baseUrl);
  await page.locator("#checklist-101-service-interests").scrollIntoViewIfNeeded();

  // No horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.strictEqual(overflow, false, `Horizontal overflow at ${viewport.width}x${viewport.height}`);

  // Touch targets & retired tiles hidden cleanly
  const layoutInfo = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll("#checklist-101-service-interests .checklist-tile"));
    const visible = tiles.filter((t) => !t.hasAttribute("hidden"));
    const hidden = tiles.filter((t) => t.hasAttribute("hidden"));
    const heights = visible.map((t) => Math.round(t.getBoundingClientRect().height));
    const hiddenDisplay = hidden.map((t) => getComputedStyle(t).display);
    const visibleTexts = visible.map((t) => t.textContent.trim());
    const lastVisualTile = visible.reduce((best, t) => {
      const r = t.getBoundingClientRect();
      if (!best) return { text: t.textContent.trim(), top: r.top, left: r.left };
      if (r.top > best.top + 2 || (Math.abs(r.top - best.top) <= 2 && r.left > best.left)) {
        return { text: t.textContent.trim(), top: r.top, left: r.left };
      }
      return best;
    }, null);
    return { total: tiles.length, visible: visible.length, hidden: hidden.length, minH: Math.min(...heights), hiddenDisplay, visibleTexts, lastVisualText: lastVisualTile && lastVisualTile.text };
  });
  assert.strictEqual(layoutInfo.hidden, 4, "Expected 4 retired items hidden");
  assert(layoutInfo.hiddenDisplay.every((d) => d === "none"), "Retired tiles should have display:none");
  assert(layoutInfo.minH >= 34 && layoutInfo.minH <= 40, `Expected ~20% shorter tile min-height (34-40px), got ${layoutInfo.minH}px`);
  assert(layoutInfo.visibleTexts.every((t) => !t.includes("/")), `No visible button should contain '/': ${layoutInfo.visibleTexts.filter((t) => t.includes("/"))}`);
  for (const expectedLabel of ["Welcome Team", "Small Group", "Men's Ministry", "Women's Ministry", "Mentoring"]) {
    assert(layoutInfo.visibleTexts.includes(expectedLabel), `Missing expected button label: ${expectedLabel}`);
  }
  assert.strictEqual(layoutInfo.lastVisualText, "Other", `Expected 'Other' to be visually last, got '${layoutInfo.lastVisualText}'`);

  if (options.captureDir) {
    await page.screenshot({ path: path.join(options.captureDir, "before_white.png") });
  }

  // Click first 6 visible buttons -> rotates in exact order: blue (0), teal (1), mustard (2), blue (0), teal (1), mustard (2)
  const visibleLoc = page.locator("#checklist-101-service-interests .checklist-tile:not([hidden])");
  const firstColors = [];
  for (let i = 0; i < 6; i++) {
    await visibleLoc.nth(i).click();
    const color = await visibleLoc.nth(i).getAttribute("data-color");
    const pressed = await visibleLoc.nth(i).getAttribute("aria-pressed");
    assert.strictEqual(pressed, "true", `Tile ${i} should have aria-pressed=true`);
    firstColors.push(color);
  }
  assert.deepStrictEqual(
    firstColors,
    ["0", "1", "2", "0", "1", "2"],
    `Expected blue(0), teal(1), mustard(2) repeating in order, got ${firstColors.join(",")}`
  );

  if (options.captureDir) {
    await page.waitForTimeout(260);
    await page.screenshot({ path: path.join(options.captureDir, "after_colored.png") });
  }

  // Turn tile 0 OFF (returns to clean white, no data-color), then turn it back ON -> gets a new rotating color!
  const prevColor0 = firstColors[0];
  await visibleLoc.nth(0).click();
  await page.waitForTimeout(options.reducedMotion === "reduce" ? 20 : 260);
  const offState = await visibleLoc.nth(0).evaluate((el) => ({
    selected: el.classList.contains("selected"),
    color: el.getAttribute("data-color"),
    pressed: el.getAttribute("aria-pressed"),
    bg: getComputedStyle(el).backgroundColor
  }));
  assert.strictEqual(offState.selected, false);
  assert.strictEqual(offState.color, null);
  assert.strictEqual(offState.pressed, "false");
  assert(
    offState.bg === "rgb(255, 255, 255)" || offState.bg === "rgb(252, 251, 248)",
    `Unselected tile should return to clean white, got ${offState.bg}`
  );

  await visibleLoc.nth(0).click();
  const nextColor0 = await visibleLoc.nth(0).getAttribute("data-color");
  assert.notStrictEqual(nextColor0, prevColor0, "Re-enabling a tile should cycle to another color");

  // Reload page and confirm chosen items stay saved and hydrate cleanly with colors
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#checklist-101-service-interests .checklist-tile", { timeout: 20000 });
  const reloadedSelected = await page.evaluate(() => {
    const selected = Array.from(document.querySelectorAll("#checklist-101-service-interests .checklist-tile.selected"));
    return selected.map((el) => ({
      idx: el.getAttribute("data-index"),
      color: el.getAttribute("data-color"),
      pressed: el.getAttribute("aria-pressed")
    }));
  });
  assert.strictEqual(reloadedSelected.length, 6, `Expected 6 persisted tiles after reload, got ${reloadedSelected.length}`);
  assert(reloadedSelected.every((s) => s.color !== null && s.pressed === "true"), "Persisted tiles missing color/aria-pressed");

  if (options.reducedMotion === "reduce") {
    const dur = await page.evaluate(() => {
      return getComputedStyle(document.querySelector("#checklist-101-service-interests .checklist-tile")).transitionDuration;
    });
    assert.strictEqual(dur, "0s", `Expected 0s transition in reduced-motion, got ${dur}`);
  }

  assert.strictEqual(errors.length, 0, `Console/page errors: ${errors.join("; ")}`);
  await context.close();
}

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const { server, url } = await startStaticServer(ROOT);
  const browser = await chromium.launch();
  try {
    await runViewportCheck(browser, url, { width: 390, height: 844 }, { captureDir: SHOT_DIR });
    await runViewportCheck(browser, url, { width: 375, height: 812 });
    await runViewportCheck(browser, url, { width: 1280, height: 800 });
    await runViewportCheck(browser, url, { width: 390, height: 844 }, { reducedMotion: "reduce" });
    console.log(`ALL POTLUCK BUTTON CHECKS PASSED. Screenshots saved to ${SHOT_DIR}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
