"use client";

import type { WorkoutExerciseLog, WorkoutExerciseTemplate } from "@/lib/types";
import { getProgressionAdvice } from "@/lib/utils/workout";

export type EditableExerciseLog = Omit<WorkoutExerciseLog, "id" | "workout_id" | "created_at">;

export function createLogFromTemplate(exercise: WorkoutExerciseTemplate): EditableExerciseLog {
  return {
    exercise_name: exercise.name,
    sets: exercise.sets ?? null,
    reps: firstNumber(exercise.reps),
    weight: null,
    duration_seconds: firstNumber(exercise.duration),
    side: exercise.side ?? null,
    pain: 0,
    rpe: 6,
    completed: false,
    notes: ""
  };
}

export function ExerciseLogRow({
  exercise,
  log,
  onChange
}: {
  exercise: WorkoutExerciseTemplate;
  log: EditableExerciseLog;
  onChange: (log: EditableExerciseLog) => void;
}) {
  const advice = getProgressionAdvice({ completed: log.completed, pain: log.pain, rpe: log.rpe });

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-bold text-ink">{exercise.name}</h3>
          <p className="mt-1 text-sm text-stone-600">{exercise.cue}</p>
          {exercise.safety ? <p className="mt-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">{exercise.safety}</p> : null}
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            className="h-5 w-5 accent-moss"
            type="checkbox"
            checked={log.completed}
            onChange={(event) => onChange({ ...log, completed: event.target.checked })}
          />
          Done
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Sets" value={log.sets ?? ""} onChange={(value) => onChange({ ...log, sets: toNullableNumber(value) })} />
        <Field label="Reps" value={log.reps ?? ""} onChange={(value) => onChange({ ...log, reps: toNullableNumber(value) })} />
        <Field label="Weight" value={log.weight ?? ""} onChange={(value) => onChange({ ...log, weight: toNullableNumber(value) })} />
        <Field label="Seconds" value={log.duration_seconds ?? ""} onChange={(value) => onChange({ ...log, duration_seconds: toNullableNumber(value) })} />
        <Field label="Pain" value={log.pain} min={0} max={10} onChange={(value) => onChange({ ...log, pain: Number(value) || 0 })} />
        <Field label="RPE" value={log.rpe} min={1} max={10} onChange={(value) => onChange({ ...log, rpe: Number(value) || 1 })} />
      </div>

      <label className="mt-3 block space-y-2">
        <span className="label">Notes</span>
        <input className="field" value={log.notes ?? ""} onChange={(event) => onChange({ ...log, notes: event.target.value })} />
      </label>
      <p className="mt-3 text-sm font-semibold text-moss">{advice}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max
}: {
  label: string;
  value: string | number;
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

function firstNumber(value?: string) {
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function toNullableNumber(value: string) {
  if (value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
