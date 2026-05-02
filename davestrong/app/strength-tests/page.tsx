"use client";

import { TestEntryForm } from "@/components/forms/TestEntryForm";
import { StrengthGoalCard } from "@/components/ui/StrengthGoalCard";
import { strengthGoals } from "@/lib/data/dave";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { getLatestByName } from "@/lib/utils/progress";

export default function StrengthTestsPage() {
  const { strengthTests } = useDaveData();
  const latest = getLatestByName(strengthTests);

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="label">Monthly retests</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Strength Tests</h1>
        <p className="mt-2 text-sm text-stone-600">Clean reps matter more than heroic reps. No dead hangs, no wide-grip bench, no max effort lifting.</p>
      </section>
      <TestEntryForm />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {strengthGoals.map((goal) => (
          <StrengthGoalCard key={goal.goal_name} goal={goal} latest={latest[goal.goal_name]} />
        ))}
      </section>
    </div>
  );
}
