"use client";

import { FormEvent, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { workoutTemplates } from "@/lib/data/dave";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { getSafetyWarnings } from "@/lib/utils/safety";
import { getWorkoutRecommendation, scheduledLabel } from "@/lib/utils/workout";
import { todayIso } from "@/lib/utils/date";
import type { WorkoutTemplateType } from "@/lib/types";
import { SafetyWarning } from "@/components/ui/SafetyWarning";
import { ExerciseLogRow, createLogFromTemplate, type EditableExerciseLog } from "@/components/workout/ExerciseLogRow";

export function WorkoutTemplate({
  readiness,
  scheduled
}: {
  readiness: number;
  scheduled: WorkoutTemplateType;
}) {
  const { saveWorkout, dailyCheckins } = useDaveData();
  const latestCheckin = dailyCheckins[0];
  const recommendation = getWorkoutRecommendation({ readiness, checkin: latestCheckin, scheduled });
  const defaultType = recommendation.type === "active" || recommendation.type === "rest" ? "mobility" : recommendation.type;
  const [selected, setSelected] = useState<"strength-a" | "strength-b" | "mobility">(defaultType);
  const template = workoutTemplates[selected];
  const [date, setDate] = useState(todayIso());
  const [backBefore, setBackBefore] = useState(String(latestCheckin?.back_pain ?? 2));
  const [backAfter, setBackAfter] = useState(String(latestCheckin?.back_pain ?? 2));
  const [shoulderBefore, setShoulderBefore] = useState(String(latestCheckin?.shoulder_pain ?? 0));
  const [shoulderAfter, setShoulderAfter] = useState(String(latestCheckin?.shoulder_pain ?? 0));
  const [overallRpe, setOverallRpe] = useState("6");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<EditableExerciseLog[]>(() => template.exercises.map(createLogFromTemplate));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const warnings = useMemo(() => {
    const maxExercisePain = Math.max(0, ...logs.map((log) => log.pain));
    return getSafetyWarnings({
      leg_symptoms: latestCheckin?.leg_symptoms,
      back_pain: Number(backAfter),
      shoulder_pain: Number(shoulderAfter),
      exercise_pain: maxExercisePain,
      back_pain_before: Number(backBefore),
      back_pain_after: Number(backAfter)
    });
  }, [backAfter, backBefore, latestCheckin, logs, shoulderAfter]);

  function chooseTemplate(value: "strength-a" | "strength-b" | "mobility") {
    setSelected(value);
    setLogs(workoutTemplates[value].exercises.map(createLogFromTemplate));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await saveWorkout(
        {
          date,
          workout_type: template.name,
          completed: logs.some((log) => log.completed),
          overall_rpe: Number(overallRpe),
          back_pain_before: Number(backBefore),
          back_pain_after: Number(backAfter),
          shoulder_pain_before: Number(shoulderBefore),
          shoulder_pain_after: Number(shoulderAfter),
          notes
        },
        logs
      );
      setStatus("Workout logged. Back-safe progress beats aggressive jumps.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save workout.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="surface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="label">Recommended today</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{recommendation.title}</h1>
            <p className="mt-2 text-sm text-stone-600">{recommendation.guidance}</p>
            {recommendation.flags.includes("avoid-hinges-loaded-lower") ? (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Back pain is 4 or higher: avoid hinge movements and loaded lower-body work today.</p>
            ) : null}
            {recommendation.flags.includes("avoid-press-pull-hang") ? (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Shoulder pain is 4 or higher: avoid push-ups, pressing, pull-ups, and hanging.</p>
            ) : null}
          </div>
          <label className="block min-w-56 space-y-2">
            <span className="label">Choose workout</span>
            <select className="field" value={selected} onChange={(event) => chooseTemplate(event.target.value as "strength-a" | "strength-b" | "mobility")}>
              <option value="strength-a">Strength A</option>
              <option value="strength-b">Strength B</option>
              <option value="mobility">Walk and Mobility</option>
            </select>
          </label>
        </div>
      </div>

      <SafetyWarning warnings={warnings} />

      <div className="surface p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label">{scheduledLabel(scheduled)}</p>
            <h2 className="text-xl font-bold text-ink">{template.name}</h2>
            <p className="text-sm text-stone-600">{template.focus}</p>
          </div>
          <input className="field max-w-44" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="mt-4 rounded-xl bg-stone-50 p-4">
          <p className="font-bold text-ink">Warm-up</p>
          <ul className="mt-2 space-y-1 text-sm text-stone-700">
            {template.warmup.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {template.exercises.map((exercise, index) => (
          <ExerciseLogRow
            key={exercise.name}
            exercise={exercise}
            log={logs[index]}
            onChange={(log) => setLogs((current) => current.map((item, itemIndex) => (itemIndex === index ? log : item)))}
          />
        ))}
      </div>

      <div className="surface p-4">
        <div className="grid gap-4 md:grid-cols-5">
          <Input label="Back before" value={backBefore} min={0} max={10} onChange={setBackBefore} />
          <Input label="Back after" value={backAfter} min={0} max={10} onChange={setBackAfter} />
          <Input label="Shoulder before" value={shoulderBefore} min={0} max={10} onChange={setShoulderBefore} />
          <Input label="Shoulder after" value={shoulderAfter} min={0} max={10} onChange={setShoulderAfter} />
          <Input label="Overall RPE" value={overallRpe} min={1} max={10} onChange={setOverallRpe} />
        </div>
        <label className="mt-4 block space-y-2">
          <span className="label">Workout notes</span>
          <textarea className="field min-h-24" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <button className="btn-primary mt-4" type="submit" disabled={submitting}>
          <Save className="h-4 w-4" aria-hidden />
          Save workout
        </button>
      </div>

      {status ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  min,
  max
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <input className="field" type="number" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
