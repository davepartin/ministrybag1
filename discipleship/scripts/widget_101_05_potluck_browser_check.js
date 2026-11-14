"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const assert = require("assert");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const WIDGET_PATH = "/widgets/church-potluck.html";
const SHOT_DIR =
  process.env.SHOT_DIR ||
  "/Users/dpartin/.gemini/antigravity/brain/f6932f32-8ffd-4554-beec-fbe4d8f15996/scratch/potluck-shots";

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

  await page.goto(`${baseUrl}${WIDGET_PATH}`, { waitUntil: "networkidle" });
  await page.waitForSelector("#widgetOuter");

  // No horizontal overflow
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  assert.strictEqual(overflow, false, `Horizontal overflow at ${viewport.width}x${viewport.height}`);

  // Touch target minimums
  const targets = await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll(".nav-btn")).map((b) => {
      const r = b.getBoundingClientRect();
      return { id: b.id, w: r.width, h: r.height };
    });
    const dots = Array.from(document.querySelectorAll(".step-dot")).map((d) => {
      const r = d.getBoundingClientRect();
      return { step: d.getAttribute("data-step"), w: r.width, h: r.height };
    });
    return { navBtns, dots };
  });
  for (const b of targets.navBtns) {
    assert(b.h >= 44, `${b.id} height ${b.h} < 44px`);
  }
  for (const d of targets.dots) {
    assert(d.w >= 28 && d.h >= 28, `dot ${d.step} box ${d.w}x${d.h} < 28x28px`);
  }

  // Record card heights across all steps and dishes on step 5
  const heights = [];
  for (let s = 0; s < 6; s++) {
    if (s > 0) {
      await page.click("#nextBtn");
      await page.waitForTimeout(options.reducedMotion === "reduce" ? 30 : 380);
    }
    const state = await page.evaluate(() => {
      const outer = document.getElementById("widgetOuter");
      const card = document.querySelector(".verse-card");
      const title = document.getElementById("svgTitle").textContent;
      const desc = document.getElementById("svgDesc").textContent;
      const heading = document.getElementById("cardHeading").textContent;
      return {
        step: outer.getAttribute("data-step"),
        cardH: Math.round(card.getBoundingClientRect().height),
        title,
        desc,
        heading
      };
    });
    assert.strictEqual(state.step, String(s), `Expected step ${s}, got ${state.step}`);
    assert(state.title.length > 5 && state.desc.length > 10, "Dynamic SVG title/desc empty");
    heights.push(state.cardH);

    if (options.captureDir) {
      await page.screenshot({ path: path.join(options.captureDir, `step${s}.png`) });
    }
  }

  // Verify interactive dish selection on Step 5
  await page.click("#dish2");
  await page.waitForTimeout(options.reducedMotion === "reduce" ? 30 : 380);
  const afterDish2 = await page.evaluate(() => {
    const d2 = document.getElementById("dish2");
    const note = document.getElementById("cardNote").textContent;
    const cardH = Math.round(document.querySelector(".verse-card").getBoundingClientRect().height);
    return {
      picked: d2.classList.contains("is-picked"),
      pressed: d2.getAttribute("aria-pressed"),
      note,
      cardH
    };
  });
  assert.strictEqual(afterDish2.picked, true, "Dish 2 should be marked picked");
  assert.strictEqual(afterDish2.pressed, "true", "Dish 2 aria-pressed should be true");
  assert(afterDish2.note.includes("Welcome & Bread"), "Note should reflect Welcome & Bread");
  heights.push(afterDish2.cardH);

  // Also test keyboard activation on dish 4
  await page.focus("#dish4");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(options.reducedMotion === "reduce" ? 30 : 380);
  const afterDish4 = await page.evaluate(() => {
    return {
      picked: document.getElementById("dish4").classList.contains("is-picked"),
      footer: document.getElementById("stageFooter").textContent,
      cardH: Math.round(document.querySelector(".verse-card").getBoundingClientRect().height)
    };
  });
  assert.strictEqual(afterDish4.picked, true, "Dish 4 keyboard Enter should mark picked");
  assert(afterDish4.footer.includes("2 dishes on the table"), `Unexpected footer: ${afterDish4.footer}`);
  heights.push(afterDish4.cardH);

  if (options.captureDir) {
    await page.screenshot({ path: path.join(options.captureDir, "step5_picked.png") });
  }

  // Verify fixed card height across all steps & dish selections (max delta <= 1px)
  const minH = Math.min(...heights);
  const maxH = Math.max(...heights);
  assert(maxH - minH <= 1, `Card height jumped at ${viewport.width}x${viewport.height}: min=${minH}, max=${maxH}`);

  // Keyboard ArrowLeft navigation back to step 4
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(50);
  const stepAfterArrow = await page.evaluate(() => document.getElementById("widgetOuter").getAttribute("data-step"));
  assert.strictEqual(stepAfterArrow, "4", "ArrowLeft should go to step 4");

  // Reduced motion check: transitions disabled
  if (options.reducedMotion === "reduce") {
    const dur = await page.evaluate(() => {
      return getComputedStyle(document.querySelector(".dish-group")).transitionDuration;
    });
    assert.strictEqual(dur, "0s", `Expected 0s transition in reduced-motion, got ${dur}`);
  }

  // Zero idle DOM mutations over 600ms
  const mutations = await page.evaluate(async () => {
    let count = 0;
    const obs = new MutationObserver(() => { count++; });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    await new Promise((r) => setTimeout(r, 600));
    obs.disconnect();
    return count;
  });
  assert.strictEqual(mutations, 0, `Expected 0 idle DOM mutations, got ${mutations}`);

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
    console.log(`ALL CHECKS PASSED. Screenshots saved to ${SHOT_DIR}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
