import type { ReactNode } from "react";
import { clsx } from "clsx";

type DashboardCardProps = {
  title: string;
  value: ReactNode;
  subtext?: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "green" | "yellow" | "orange" | "red" | "blue";
};

const toneClasses = {
  neutral: "border-stone-100",
  green: "border-emerald-200 bg-emerald-50/60",
  yellow: "border-amber-200 bg-amber-50/70",
  orange: "border-orange-200 bg-orange-50/70",
  red: "border-red-200 bg-red-50/70",
  blue: "border-sky-200 bg-sky-50/70"
};

export function DashboardCard({ title, value, subtext, icon, tone = "neutral" }: DashboardCardProps) {
  return (
    <div className={clsx("surface p-4", toneClasses[tone])}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-stone-500">{title}</p>
        {icon ? <div className="text-moss">{icon}</div> : null}
      </div>
      <div className="mt-3 text-3xl font-bold text-ink">{value}</div>
      {subtext ? <div className="mt-2 text-sm leading-5 text-stone-600">{subtext}</div> : null}
    </div>
  );
}
