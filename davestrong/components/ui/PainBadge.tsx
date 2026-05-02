import { clsx } from "clsx";

export function PainBadge({ value, label = "Pain" }: { value: number; label?: string }) {
  const tone =
    value >= 6
      ? "bg-red-100 text-red-800 border-red-200"
      : value >= 4
        ? "bg-orange-100 text-orange-800 border-orange-200"
        : value >= 3
          ? "bg-amber-100 text-amber-800 border-amber-200"
          : "bg-emerald-100 text-emerald-800 border-emerald-200";

  return (
    <span className={clsx("inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold", tone)}>
      {label}: {value}/10
    </span>
  );
}
