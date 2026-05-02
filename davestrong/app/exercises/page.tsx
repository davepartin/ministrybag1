"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { exerciseLibrary } from "@/lib/data/dave";
import type { Exercise } from "@/lib/types";
import { clsx } from "clsx";

const categories: Array<Exercise["category"] | "all"> = ["all", "legs", "push", "pull", "core", "carry", "mobility"];

export default function ExercisesPage() {
  const [category, setCategory] = useState<Exercise["category"] | "all">("all");
  const filtered = useMemo(
    () => (category === "all" ? exerciseLibrary : exerciseLibrary.filter((exercise) => exercise.category === category)),
    [category]
  );

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="label">Exercise Library</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Back-safe progress. Shoulder-smart training.</h1>
      </section>
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            className={clsx(
              "rounded-lg px-3 py-2 text-sm font-semibold capitalize transition",
              category === item ? "bg-charcoal text-white" : "border border-stone-200 bg-white text-ink hover:border-moss hover:text-moss"
            )}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((exercise) => {
          const shoulderRisk = /pull-up|push-up|press|shoulder|hang|dips/i.test(
            `${exercise.name} ${exercise.safety_notes}`
          );
          return (
            <article key={exercise.name} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-moss">{exercise.category}</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{exercise.name}</h2>
                </div>
                {shoulderRisk ? <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden /> : null}
              </div>
              <Section title="Why it matters for Dave" value={exercise.why_it_matters} />
              <Section title="How to do it" value={exercise.instructions} />
              <Section title="Safety notes" value={exercise.safety_notes} tone="warning" />
              <Section title="Common mistakes" value={exercise.common_mistakes} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Section title="Regression" value={exercise.regression} />
                <Section title="Progression" value={exercise.progression} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Section({ title, value, tone }: { title: string; value: string; tone?: "warning" }) {
  return (
    <div className={clsx("mt-4 rounded-lg p-3", tone === "warning" ? "bg-amber-50 text-amber-950" : "bg-stone-50 text-stone-700")}>
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{title}</p>
      <p className="mt-1 text-sm leading-5">{value}</p>
    </div>
  );
}
