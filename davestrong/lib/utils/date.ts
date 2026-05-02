export function todayIso() {
  return toIsoDate(new Date());
}

export function toIsoDate(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toIsoDate(date);
}

export function formatShortDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

export function weekKey(value: string) {
  const date = new Date(`${value}T12:00:00`);
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return toIsoDate(start);
}
