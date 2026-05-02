"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDaveData } from "@/lib/data/DaveDataProvider";

export default function SettingsPage() {
  const { user, updateEmail, supabaseReady } = useAuth();
  const { profile, updateProfile } = useDaveData();
  const [state, setState] = useState({
    name: profile.name,
    birthday: profile.birthday,
    height_inches: String(profile.height_inches),
    starting_weight: String(profile.starting_weight),
    protein_target: String(profile.protein_target),
    primary_goal: profile.primary_goal,
    back_history: profile.back_history,
    shoulder_history: profile.shoulder_history,
    equipment: profile.equipment.join(", "),
    training_days: profile.training_days?.join("\n") ?? "",
    email: user?.email ?? ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setState({
      name: profile.name,
      birthday: profile.birthday,
      height_inches: String(profile.height_inches),
      starting_weight: String(profile.starting_weight),
      protein_target: String(profile.protein_target),
      primary_goal: profile.primary_goal,
      back_history: profile.back_history,
      shoulder_history: profile.shoulder_history,
      equipment: profile.equipment.join(", "),
      training_days: profile.training_days?.join("\n") ?? "",
      email: user?.email ?? ""
    });
  }, [profile, user?.email]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setError(null);
    try {
      await updateProfile({
        name: state.name,
        birthday: state.birthday,
        height_inches: Number(state.height_inches),
        starting_weight: Number(state.starting_weight),
        protein_target: Number(state.protein_target),
        primary_goal: state.primary_goal,
        back_history: state.back_history,
        shoulder_history: state.shoulder_history,
        equipment: state.equipment.split(",").map((item) => item.trim()).filter(Boolean),
        training_days: state.training_days.split("\n").map((item) => item.trim()).filter(Boolean),
        units: "pounds/inches"
      });
      if (supabaseReady && user?.email && state.email && state.email !== user.email) {
        await updateEmail(state.email);
        setStatus("Profile saved. Supabase will ask you to confirm the email change.");
      } else {
        setStatus("Profile saved. Keep building durable strength.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="surface p-5">
        <p className="label">Settings/Profile</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Dave Strong baseline</h1>
      </section>

      <section className="surface space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input label="Name" value={state.name} onChange={(value) => update("name", value)} />
          <Input label="Birthday" type="date" value={state.birthday} onChange={(value) => update("birthday", value)} />
          <Input label="Height inches" type="number" value={state.height_inches} onChange={(value) => update("height_inches", value)} />
          <Input label="Current weight" type="number" value={state.starting_weight} onChange={(value) => update("starting_weight", value)} />
          <Input label="Protein target" type="number" value={state.protein_target} onChange={(value) => update("protein_target", value)} />
          <Input label="Units" value="pounds/inches" onChange={() => undefined} disabled />
          <Input label="Supabase user email" type="email" value={state.email} onChange={(value) => update("email", value)} disabled={!supabaseReady} />
        </div>
        <TextArea label="Primary goal" value={state.primary_goal} onChange={(value) => update("primary_goal", value)} />
        <TextArea label="Back surgery history" value={state.back_history} onChange={(value) => update("back_history", value)} />
        <TextArea label="Shoulder limitation" value={state.shoulder_history} onChange={(value) => update("shoulder_history", value)} />
        <TextArea label="Equipment list" value={state.equipment} onChange={(value) => update("equipment", value)} />
        <TextArea label="Training days" value={state.training_days} onChange={(value) => update("training_days", value)} />
        <button className="btn-primary" type="submit" disabled={submitting}>
          <Save className="h-4 w-4" aria-hidden />
          Save profile
        </button>
      </section>
      {status ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </form>
  );

  function update(key: keyof typeof state, value: string) {
    setState((current) => ({ ...current, [key]: value }));
  }
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <input className="field disabled:bg-stone-100 disabled:text-stone-500" type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="label">{label}</span>
      <textarea className="field min-h-24" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
