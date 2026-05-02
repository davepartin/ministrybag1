"use client";

import { FormEvent, useMemo, useState } from "react";
import { ClipboardPlus } from "lucide-react";
import { strengthGoals } from "@/lib/data/dave";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { todayIso } from "@/lib/utils/date";

const testUnits: Record<string, string> = {
  "30-Second Chair Stand": "reps",
  "Max Strict Push-Ups": "reps",
  "Max Strict Pull-Ups": "reps",
  "Front Plank": "seconds",
  "Side Plank": "seconds",
  "Floor Get-Up Test": "support points",
  "Farmer Carry": "pounds/time",
  "Goblet Squat": "pounds/reps",
  "Bench Press": "pounds/reps"
};

type TestState = {
  test_date: string;
  test_name: string;
  value: string;
  value_secondary: string;
  quality: string;
  pain: string;
  notes: string;
};

export function TestEntryForm() {
  const { addStrengthTest } = useDaveData();
  const [state, setState] = useState<TestState>({
    test_date: todayIso(),
    test_name: strengthGoals[0].goal_name,
    value: "",
    value_secondary: "",
    quality: "",
    pain: "",
    notes: ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const unit = useMemo(() => testUnits[state.test_name] ?? "value", [state.test_name]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addStrengthTest({
        test_date: state.test_date,
        test_name: state.test_name,
        value: state.value === "" ? null : Number(state.value),
        value_secondary: state.value_secondary === "" ? null : Number(state.value_secondary),
        unit,
        quality: state.quality,
        pain: state.pain === "" ? null : Number(state.pain),
        notes: state.notes
      });
      setStatus("Test saved. Back-safe progress, one clean retest at a time.");
      setState((current) => ({ ...current, value: "", value_secondary: "", quality: "", pain: "", notes: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save test.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="block space-y-2">
          <span className="label">Test date</span>
          <input className="field" type="date" value={state.test_date} onChange={(event) => update("test_date", event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="label">Test</span>
          <select className="field" value={state.test_name} onChange={(event) => update("test_name", event.target.value)}>
            {strengthGoals.map((goal) => (
              <option key={goal.goal_name} value={goal.goal_name}>
                {goal.goal_name}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="label">Primary value</span>
          <input className="field" type="number" step="0.5" value={state.value} onChange={(event) => update("value", event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="label">Secondary value</span>
          <input className="field" type="number" step="0.5" value={state.value_secondary} onChange={(event) => update("value_secondary", event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span className="label">Quality</span>
          <select className="field" value={state.quality} onChange={(event) => update("quality", event.target.value)}>
            <option value="">Choose quality</option>
            <option value="clean">Clean</option>
            <option value="imperfect">Imperfect</option>
            <option value="shaky">Shaky</option>
            <option value="solid">Solid</option>
            <option value="not tested">Not tested</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="label">Pain 0-10</span>
          <input className="field" type="number" min="0" max="10" value={state.pain} onChange={(event) => update("pain", event.target.value)} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="label">Notes</span>
        <textarea className="field min-h-24" value={state.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      <button className="btn-primary" type="submit" disabled={submitting}>
        <ClipboardPlus className="h-4 w-4" aria-hidden />
        Save test
      </button>
      {state.test_name === "Bench Press" ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Shoulder-smart warning: no wide grip and no painful range.</p>
      ) : null}
      {status ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </form>
  );

  function update<Key extends keyof TestState>(key: Key, value: TestState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }
}
