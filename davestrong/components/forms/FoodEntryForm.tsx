"use client";

import { FormEvent, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { quickAddFoods } from "@/lib/data/dave";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import type { FoodEntry } from "@/lib/types";
import { todayIso } from "@/lib/utils/date";

type FoodState = {
  date: string;
  meal_type: FoodEntry["meal_type"];
  meal_name: string;
  food_name: string;
  protein_grams: string;
  calories: string;
  notes: string;
};

const initialState: FoodState = {
  date: todayIso(),
  meal_type: "breakfast",
  meal_name: "",
  food_name: "",
  protein_grams: "",
  calories: "",
  notes: ""
};

export function FoodEntryForm() {
  const { addFoodEntry } = useDaveData();
  const [state, setState] = useState<FoodState>(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => state.food_name.trim() && state.protein_grams !== "", [state]);

  async function save(input: FoodState) {
    const saved = await addFoodEntry({
      date: input.date,
      meal_type: input.meal_type,
      food_name: input.food_name,
      protein_grams: Number(input.protein_grams) || 0,
      calories: input.calories === "" ? null : Number(input.calories),
      notes: [input.meal_name ? `Meal: ${input.meal_name}` : "", input.notes].filter(Boolean).join(". ")
    });
    setStatus(`${saved.food_name} added. Keep this simple. Win the day.`);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await save(state);
      setState(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save food.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="surface p-4">
        <p className="label">Quick add</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickAddFoods.map((food) => (
            <button
              key={food.label}
              type="button"
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-moss hover:text-moss"
              onClick={() => {
                setError(null);
                void save({
                  date: todayIso(),
                  meal_type: food.meal_type,
                  food_name: food.label,
                  meal_name: "",
                  protein_grams: String(food.protein),
                  calories: food.calories ? String(food.calories) : "",
                  notes: "Quick add"
                }).catch((err: unknown) => {
                  setError(err instanceof Error ? err.message : "Could not save food.");
                });
              }}
            >
              {food.label} - {food.protein}g
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="surface space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Date" type="date" value={state.date} onChange={(value) => update("date", value)} />
          <label className="block space-y-2">
            <span className="label">Meal type</span>
            <select className="field" value={state.meal_type} onChange={(event) => update("meal_type", event.target.value as FoodEntry["meal_type"])}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </label>
          <Input label="Food item" value={state.food_name} onChange={(value) => update("food_name", value)} />
          <Input label="Meal name" value={state.meal_name} onChange={(value) => update("meal_name", value)} />
          <Input label="Protein grams" type="number" value={state.protein_grams} onChange={(value) => update("protein_grams", value)} />
          <Input label="Calories optional" type="number" value={state.calories} onChange={(value) => update("calories", value)} />
        </div>
        <label className="block space-y-2">
          <span className="label">Notes</span>
          <textarea className="field min-h-24" value={state.notes} onChange={(event) => update("notes", event.target.value)} />
        </label>
        <button className="btn-primary" type="submit" disabled={submitting || !canSubmit}>
          <PlusCircle className="h-4 w-4" aria-hidden />
          Add food
        </button>
      </form>
      {status ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </div>
  );

  function update<Key extends keyof FoodState>(key: Key, value: FoodState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }
}

function Input({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
