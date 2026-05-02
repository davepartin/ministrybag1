import type { ReadinessColor } from "@/lib/types";

export type ReadinessInput = {
  sleep_hours?: number | null;
  energy?: number | null;
  stress?: number | null;
  back_pain?: number | null;
  shoulder_pain?: number | null;
  leg_symptoms?: boolean | null;
  workout_completed_yesterday?: boolean | null;
};

export function calculateReadinessScore(input: ReadinessInput) {
  let score = 100;

  if (typeof input.sleep_hours === "number" && input.sleep_hours < 6) score -= 15;
  if (input.energy === 1) score -= 20;
  if (input.energy === 2) score -= 10;
  if (input.stress === 4) score -= 10;
  if (input.stress === 5) score -= 20;

  const backPain = input.back_pain ?? 0;
  if (backPain === 3) score -= 10;
  if (backPain >= 4 && backPain <= 5) score -= 25;
  if (backPain >= 6) score -= 40;

  if ((input.shoulder_pain ?? 0) >= 4) score -= 20;
  if (input.leg_symptoms) score -= 40;
  if (input.workout_completed_yesterday) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function getReadinessBand(score: number): {
  color: ReadinessColor;
  label: string;
  guidance: string;
  className: string;
} {
  if (score >= 80) {
    return {
      color: "green",
      label: "Good to train",
      guidance: "Green light. Build durable strength with clean reps.",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
  }
  if (score >= 60) {
    return {
      color: "yellow",
      label: "Moderate day",
      guidance: "Train, but keep it smooth and leave reps in reserve.",
      className: "bg-amber-100 text-amber-800 border-amber-200"
    };
  }
  if (score >= 40) {
    return {
      color: "orange",
      label: "Recovery preferred",
      guidance: "Walking, mobility, and easy movement are the win today.",
      className: "bg-orange-100 text-orange-800 border-orange-200"
    };
  }
  return {
    color: "red",
    label: "Rest day",
    guidance: "Rest or take a gentle walk. Strong for life means listening early.",
    className: "bg-red-100 text-red-800 border-red-200"
  };
}
