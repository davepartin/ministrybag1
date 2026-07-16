import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { words, normalize, phraseChunks, shuffled, blankIndexes, scoreAnswers, nextReviewDate } from "../js/game-helpers.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const verses = JSON.parse(await readFile(resolve(root, "data/verses.json"), "utf8"));

assert.equal(verses.length, 52, "must contain exactly 52 verses");
assert.equal(new Set(verses.map(v => v.week)).size, 52, "week numbers must be unique");
assert.equal(new Set(verses.map(v => v.reference)).size, 52, "references must be unique");

for (const [index, verse] of verses.entries()) {
  const week = index + 1;
  for (const field of ["week", "reference", "theme", "text", "translation", "audio"])
    assert.ok(verse[field] !== undefined && verse[field] !== "", `week ${week}: missing ${field}`);
  assert.equal(verse.week, week, `week ${week}: sequence mismatch`);
  assert.equal(verse.translation, "ESV", `week ${week}: translation must be ESV`);
  assert.match(verse.text, /[.!?]["']?$/, `week ${week}: incomplete terminal punctuation`);
  assert.equal(verse.audio, `assets/audio/week-${String(week).padStart(2, "0")}.mp3`, `week ${week}: audio mapping`);
}

assert.deepEqual(phraseChunks("one two three four five", 2), ["one two", "three four", "five"]);
assert.equal(words("Faith, hope!").join("|"), "Faith|,|hope|!");
assert.equal(normalize("  Grace—AND truth! "), "grace and truth");
assert.deepEqual(shuffled([1, 2, 3], () => 0), [2, 3, 1]);
const blanks = blankIndexes("Alpha beta gamma delta epsilon.", 3, () => 0);
assert.equal(new Set(blanks).size, 3);
assert.ok(blanks.every(i => Number.isInteger(i)));
assert.deepEqual(scoreAnswers(["Grace", "truth"], ["grace!", "wrong"]), { correct:1, total:2, accuracy:50 });
assert.equal(nextReviewDate(3, new Date("2026-01-01T12:00:00Z")).slice(0,10), "2026-01-05");

console.log("✓ 52 unique passages and required fields");
console.log("✓ punctuation, ESV attribution, and audio paths");
console.log("✓ game helper invariants");
