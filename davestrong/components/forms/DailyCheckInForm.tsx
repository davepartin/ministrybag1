"use client";

import { FormEvent, useMemo, useState, useEffect, type InputHTMLAttributes } from "react";
import { CheckCircle2 } from "lucide-react";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { todayIso, toIsoDate } from "@/lib/utils/date";
import { calculateReadinessScore, getReadinessBand } from "@/lib/utils/readiness";
import { getSafetyWarnings } from "@/lib/utils/safety";
import { SafetyWarning } from "@/components/ui/SafetyWarning";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";

type FormState = {
  date: string;
  weight: string;
  waist: string;
  sleep_hours: string;
  energy: string;
  mood: string;
  stress: string;
  back_pain: string;
  shoulder_pain: string;
  leg_symptoms: boolean;
  walking_minutes: string;
  steps: string;
  protein_grams: string;
  calories: string;
  water_ounces: string;
  workout_completed: boolean;
  mobility_completed: boolean;
  notes: string;
};

const initialState: FormState = {
  date: todayIso(),
  weight: "185",
  waist: "",
  sleep_hours: "7",
  energy: "3",
  mood: "3",
  stress: "3",
  back_pain: "2",
  shoulder_pain: "0",
  leg_symptoms: false,
  walking_minutes: "",
  steps: "",
  protein_grams: "",
  calories: "",
  water_ounces: "",
  workout_completed: false,
  mobility_completed: false,
  notes: ""
};

export function DailyCheckInForm() {
  const { saveDailyCheckin, profile, dailyCheckins } = useDaveData();
  const [state, setState] = useState<FormState>({ ...initialState, weight: String(profile.starting_weight) });
  const [status, setStatus] = useState<{ score: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill form if a check-in for the selected date already exists
  useMemo(() => {
    const existing = dailyCheckins.find((c) => c.date === state.date);
    if (existing) {
      // Only update if we haven't already loaded this date to avoid infinite loops
      // We can do this safely in a useEffect
    }
  }, [dailyCheckins, state.date]);

  useEffect(() => {
    const existing = dailyCheckins.find((c) => c.date === state.date);
    if (existing) {
      setState({
        date: existing.date,
        weight: existing.weight != null ? String(existing.weight) : "",
        waist: existing.waist != null ? String(existing.waist) : "",
        sleep_hours: existing.sleep_hours != null ? String(existing.sleep_hours) : "",
        energy: existing.energy != null ? String(existing.energy) : "3",
        mood: existing.mood != null ? String(existing.mood) : "3",
        stress: existing.stress != null ? String(existing.stress) : "3",
        back_pain: existing.back_pain != null ? String(existing.back_pain) : "2",
        shoulder_pain: existing.shoulder_pain != null ? String(existing.shoulder_pain) : "0",
        leg_symptoms: existing.leg_symptoms ?? false,
        walking_minutes: existing.walking_minutes != null ? String(existing.walking_minutes) : "",
        steps: existing.steps != null ? String(existing.steps) : "",
        protein_grams: existing.protein_grams != null ? String(existing.protein_grams) : "",
        calories: existing.calories != null ? String(existing.calories) : "",
        water_ounces: existing.water_ounces != null ? String(existing.water_ounces) : "",
        workout_completed: existing.workout_completed ?? false,
        mobility_completed: existing.mobility_completed ?? false,
        notes: existing.notes ?? ""
      });
    } else {
      // Reset to default for this date if no existing record
      setState((current) => ({
        ...initialState,
        date: current.date,
        weight: String(profile.starting_weight)
      }));
    }
  }, [state.date, dailyCheckins, profile.starting_weight]);

  const readiness = useMemo(() => {
    const date = new Date(`${state.date}T12:00:00`);
    date.setDate(date.getDate() - 1);
    const trainedYesterday =
      dailyCheckins.find((checkin) => checkin.date === toIsoDate(date))?.workout_completed ?? false;

    return calculateReadinessScore({
      sleep_hours: toOptionalNumber(state.sleep_hours),
      energy: toOptionalNumber(state.energy),
      stress: toOptionalNumber(state.stress),
      back_pain: toNumber(state.back_pain),
      shoulder_pain: toNumber(state.shoulder_pain),
      leg_symptoms: state.leg_symptoms,
      workout_completed_yesterday: trainedYesterday
    });
  }, [dailyCheckins, state]);
  const band = getReadinessBand(readiness);
  const warnings = getSafetyWarnings({
    leg_symptoms: state.leg_symptoms,
    back_pain: toNumber(state.back_pain),
    shoulder_pain: toNumber(state.shoulder_pain)
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await saveDailyCheckin({
        date: state.date,
        weight: toOptionalNumber(state.weight),
        waist: toOptionalNumber(state.waist),
        sleep_hours: toOptionalNumber(state.sleep_hours),
        energy: toOptionalNumber(state.energy),
        mood: toOptionalNumber(state.mood),
        stress: toOptionalNumber(state.stress),
        back_pain: toNumber(state.back_pain),
        shoulder_pain: toNumber(state.shoulder_pain),
        leg_symptoms: state.leg_symptoms,
        walking_minutes: toOptionalNumber(state.walking_minutes),
        steps: toOptionalNumber(state.steps),
        protein_grams: toOptionalNumber(state.protein_grams),
        calories: toOptionalNumber(state.calories),
        water_ounces: toOptionalNumber(state.water_ounces),
        workout_completed: state.workout_completed,
        mobility_completed: state.mobility_completed,
        notes: state.notes,
        readiness_score: readiness
      });
      setStatus({
        score: readiness,
        message:
          readiness >= 80
            ? "Green light. Keep the reps clean and build the body you can trust."
            : readiness >= 60
              ? "Train moderate. Win the day without chasing max effort."
              : "Recovery counts. Small reps, long faithfulness."
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save check-in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label">Morning status</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">Daily Check-In</h1>
          </div>
          <ReadinessBadge score={readiness} />
        </div>
        <p className="mt-3 text-sm text-stone-600">{band.guidance}</p>
      </div>

      <SafetyWarning warnings={warnings} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input label="Date" type="date" value={state.date} onChange={(value) => update("date", value)} />
        <Input label="Weight" type="number" value={state.weight} onChange={(value) => update("weight", value)} />
        <Input label="Waist at belly button" type="number" value={state.waist} onChange={(value) => update("waist", value)} />
        <Input label="Sleep hours" type="number" step="0.25" value={state.sleep_hours} onChange={(value) => update("sleep_hours", value)} />
        <Select label="Energy" value={state.energy} onChange={(value) => update("energy", value)} />
        <Select label="Mood" value={state.mood} onChange={(value) => update("mood", value)} />
        <Select label="Stress" value={state.stress} onChange={(value) => update("stress", value)} />
        <Input label="Back pain 0-10" type="number" min="0" max="10" value={state.back_pain} onChange={(value) => update("back_pain", value)} />
        <Input label="Shoulder pain 0-10" type="number" min="0" max="10" value={state.shoulder_pain} onChange={(value) => update("shoulder_pain", value)} />
        <Input label="Walking minutes" type="number" value={state.walking_minutes} onChange={(value) => update("walking_minutes", value)} />
        <Input label="Steps optional" type="number" value={state.steps} onChange={(value) => update("steps", value)} />
        <Input label="Protein grams" type="number" value={state.protein_grams} onChange={(value) => update("protein_grams", value)} />
        <Input label="Calories optional" type="number" value={state.calories} onChange={(value) => update("calories", value)} />
        <Input label="Water ounces optional" type="number" value={state.water_ounces} onChange={(value) => update("water_ounces", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Toggle label="Leg pain, numbness, tingling, or weakness" checked={state.leg_symptoms} onChange={(value) => update("leg_symptoms", value)} />
        <Toggle label="Workout completed" checked={state.workout_completed} onChange={(value) => update("workout_completed", value)} />
        <Toggle label="Stretch or mobility completed" checked={state.mobility_completed} onChange={(value) => update("mobility_completed", value)} />
      </div>

      <label className="block space-y-2">
        <span className="label">Notes</span>
        <textarea className="field min-h-28" value={state.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>

      <button className="btn-primary" type="submit" disabled={submitting}>
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Save check-in
      </button>

      {status ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-bold">Readiness {status.score}</p>
          <p className="mt-1 text-sm">{status.message}</p>
        </div>
      ) : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </form>
  );

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} {...rest} />
    </label>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {[1, 2, 3, 4, 5].map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-20 items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input className="h-5 w-5 accent-moss" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toOptionalNumber(value: string) {
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
