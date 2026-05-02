import type { Goal, StrengthTest } from "@/lib/types";

export function StrengthGoalCard({ goal, latest }: { goal: Goal; latest?: StrengthTest }) {
  const current = latest?.value ?? goal.current_value;
  const firstProgress = Math.min(100, Math.round(((current || 0) / goal.first_target) * 100));
  const strongProgress = Math.min(100, Math.round(((current || 0) / goal.strong_target) * 100));

  return (
    <div className="surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-ink">{goal.goal_name}</p>
          <p className="text-sm text-stone-500">{goal.category}</p>
        </div>
        <p className="rounded-lg bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">{goal.unit}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="label">Current</p>
          <p className="mt-1 text-xl font-bold">{current ?? "Not tested"}</p>
        </div>
        <div>
          <p className="label">First</p>
          <p className="mt-1 text-xl font-bold">{goal.first_target}</p>
        </div>
        <div>
          <p className="label">Strong</p>
          <p className="mt-1 text-xl font-bold">{goal.strong_target}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full rounded-full bg-moss" style={{ width: `${firstProgress}%` }} />
        </div>
        <p className="text-xs font-semibold text-stone-500">{firstProgress}% to first goal, {strongProgress}% to strong goal</p>
      </div>
      <p className="mt-3 text-xs text-stone-500">Last tested: {latest?.test_date ?? "baseline or not tested"}</p>
    </div>
  );
}
