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
echo "PASS: index.html includes CSV/validation/navigation safety guards."

echo "All foundation QA checks passed."
