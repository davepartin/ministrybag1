#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

echo "Running foundation QA checks (101 + TOC + app engine)..."

command -v jq >/dev/null 2>&1 || fail "jq is required but not installed."

# 1) Validate all lesson JSON files parse.
while IFS= read -r f; do
  jq empty "$f" || fail "Invalid JSON: $f"
done < <(find data -maxdepth 1 -type f -name '*.json' | sort)
echo "PASS: all lesson JSON files parse."

# 2) Verify expected lesson file counts by series and total count.
[[ "$(find data -maxdepth 1 -type f -name '101-*.json' | wc -l | tr -d ' ')" == "7" ]] || fail "Expected 7 files for 101."
[[ "$(find data -maxdepth 1 -type f -name '201-*.json' | wc -l | tr -d ' ')" == "10" ]] || fail "Expected 10 files for 201."
[[ "$(find data -maxdepth 1 -type f -name '202-*.json' | wc -l | tr -d ' ')" == "10" ]] || fail "Expected 10 files for 202."
[[ "$(find data -maxdepth 1 -type f -name '203-*.json' | wc -l | tr -d ' ')" == "10" ]] || fail "Expected 10 files for 203."
[[ "$(find data -maxdepth 1 -type f -name '301-*.json' | wc -l | tr -d ' ')" == "10" ]] || fail "Expected 10 files for 301."
[[ "$(find data -maxdepth 1 -type f -name '*.json' | wc -l | tr -d ' ')" == "47" ]] || fail "Expected 47 lesson files total."
echo "PASS: expected lesson file counts are present."

# 3) 101 lessons must have non-empty blocks.
for n in 01 02 03 04 05 06 07; do
  f="data/101-${n}.json"
  blocks_len="$(jq '.blocks | length' "$f")"
  [[ "$blocks_len" -gt 0 ]] || fail "$f has empty blocks."
done
echo "PASS: 101 lessons have non-empty blocks."

# 4) 101 question ID convention: all question IDs must start with the lesson number.
for n in 1 2 3 4 5 6 7; do
  f="data/101-$(printf '%02d' "$n").json"
  while IFS= read -r qid; do
    [[ "$qid" =~ ^${n}- ]] || fail "$f has non-standard question id: $qid"
  done < <(jq -r '.blocks[]? | select(.type=="question") | .id' "$f")
done
echo "PASS: 101 question IDs follow the lesson-scoped convention."

# 5) TOC coverage for 101 should include 7 lesson rows with non-empty topic.
toc_101_rows="$(awk -F',' '$1=="101" && $2 ~ /^101\.[0-9][0-9]$/ {c++} END {print c+0}' curriculum-toc.csv)"
[[ "$toc_101_rows" == "7" ]] || fail "curriculum-toc.csv should contain 7 rows for 101 lessons."
awk -F',' '$1=="101" && $2 ~ /^101\.[0-9][0-9]$/ && $3=="" {exit 1}' curriculum-toc.csv || fail "curriculum-toc.csv has an empty topic in 101."
echo "PASS: curriculum TOC has complete topic rows for 101."

# 6) App engine safeguards present.
grep -q "function parseCSV(text)" index.html || fail "Robust CSV parser not found in index.html."
grep -q "function validateLessonData(seriesId, lessonNum, data)" index.html || fail "Lesson schema validation function not found."
grep -q "let loadedSessionNums = \[\]" index.html || fail "loadedSessionNums navigation guard not found."
grep -q "console.warn(\`Failed to load lesson file data/" index.html || fail "Lesson load warning not found."
grep -q 'scripts/widget-iframe.js' index.html || fail "Widget iframe helper is not included."
grep -q 'GrowingTogetherWidgetIframe' index.html || fail "Widget iframe host is not wired in index.html."
if grep -q 'new MutationObserver(resize).observe(f.contentDocument.body' index.html; then
  fail "Unguarded iframe MutationObserver remains in index.html."
fi
echo "PASS: index.html includes CSV/validation/navigation safety guards."

# 7) All-course runtime question and checklist IDs must be unique.
# Runtime keys match the renderer: question-{course}-{id} and checklist-{course}-{id}.
runtime_ids="$(
  while IFS= read -r f; do
    series="$(basename "$f" | cut -d- -f1)"
    jq -r --arg series "$series" --arg lesson "$(basename "${f%.json}")" '
      .blocks[]? | select(.type=="question" or .type=="checklist") | select((.id|type)=="string" and (.id|length)>0) |
      (if .type=="question" then "question" else "checklist" end) as $kind |
      "\($kind)-\($series)-\(.id)\t\($lesson)"
    ' "$f"
  done < <(find data -maxdepth 1 -type f -name '*.json' | sort)
)"
runtime_dupes="$(printf '%s\n' "$runtime_ids" | awk -F'\t' 'NF && $1!="" {c[$1]++; l[$1]=l[$1] (l[$1]?", ":"") $2} END {for (id in c) if (c[id]>1) print id " -> " l[id]}')"
if [[ -n "$runtime_dupes" ]]; then
  echo "$runtime_dupes" >&2
  fail "Duplicate runtime question/checklist IDs found."
fi
echo "PASS: all-course runtime question and checklist IDs are unique."

# 8) Read-only asset checks: src, image, imageBw/imageColor, imageSequence.
# Missing teaching images must fail. This check never writes placeholder files.
node scripts/check_lesson_assets.js || fail "Lesson asset references are missing or incomplete."
echo "PASS: lesson src/image/imageBw/imageColor/imageSequence files exist."

# 9) Widget iframe readiness, resize, and cleanup unit checks.
node scripts/test_widget_iframe.js || fail "Widget iframe readiness checks failed."
echo "PASS: widget iframe readiness, resize, and cleanup checks."

# 10) Lesson export scope, preview text, and mailto encoding.
node scripts/test_lesson_export.js || fail "Lesson export scope and encoding checks failed."
echo "PASS: lesson export scope, encoding, and metadata-exclusion checks."

# 11) Save-status words, write-gated Saved, and recovery helpers.
node scripts/test_save_feedback.js || fail "Save feedback checks failed."
echo "PASS: save feedback status, recovery, and store-read checks."

# 12) Versioned backup envelope: all three stores, honest partial/unsaved status.
node scripts/test_backup_download.js || fail "Backup download checks failed."
echo "PASS: versioned backup envelope, counts, and partial-store checks."

# 13) Backup file validation and read-only restore preview.
node scripts/test_backup_preview.js || fail "Backup preview checks failed."
echo "PASS: backup validation, preview counts, conflicts, and rejection checks."

echo "All foundation QA checks passed."
