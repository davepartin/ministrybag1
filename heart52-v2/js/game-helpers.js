export function words(text) {
  return text.match(/[\p{L}\p{N}’'-]+|[^\s\p{L}\p{N}’'-]+/gu) || [];
}

export function normalize(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function phraseChunks(text, size = 4) {
  const tokens = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += size) chunks.push(tokens.slice(i, i + size).join(" "));
  return chunks;
}

export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function blankIndexes(text, count = 4, random = Math.random) {
  const tokens = words(text);
  const candidates = tokens.map((token, index) => ({ token, index }))
    .filter(({ token }) => /^[\p{L}\p{N}]/u.test(token) && token.length > 3);
  return shuffled(candidates, random).slice(0, Math.min(count, candidates.length)).map(x => x.index).sort((a, b) => a - b);
}

export function scoreAnswers(expected, actual) {
  const total = expected.length;
  const correct = expected.reduce((sum, value, i) => sum + (normalize(value) === normalize(actual[i] || "") ? 1 : 0), 0);
  return { correct, total, accuracy: total ? Math.round(correct / total * 100) : 100 };
}

export function nextReviewDate(confidence, now = new Date()) {
  const days = [1, 2, 4, 8][Math.max(0, Math.min(3, confidence - 1))];
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
