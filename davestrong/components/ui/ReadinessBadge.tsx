import { getReadinessBand } from "@/lib/utils/readiness";

export function ReadinessBadge({ score }: { score: number }) {
  const band = getReadinessBand(score);
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${band.className}`}>
      {score} - {band.label}
    </span>
  );
}
