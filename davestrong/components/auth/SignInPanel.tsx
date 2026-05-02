"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function SignInPanel() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setError(null);
    try {
      await signInWithEmail(email);
      setStatus("Check your email for the sign-in link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send sign-in email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-lg surface p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-moss/10 p-3 text-moss">
          <Mail className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-moss">Private dashboard</p>
          <h1 className="text-2xl font-bold text-ink">Sign in to Dave Strong</h1>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="label">Supabase user email</span>
          <input
            className="field"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          Send sign-in link
        </button>
      </form>
      {status ? <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    </section>
  );
}
