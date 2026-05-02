import type { DailyCheckin, WorkoutTemplateType } from "@/lib/types";

export function getScheduledWorkout(date = new Date()): WorkoutTemplateType {
  const day = date.getDay();
  if (day === 1 || day === 5) return "strength-a";
  if (day === 3) return "strength-b";
  if (day === 2 || day === 4) return "mobility";
  if (day === 6) return "active";
  return "rest";
}

export function scheduledLabel(type: WorkoutTemplateType) {
  const labels: Record<WorkoutTemplateType, string> = {
    "strength-a": "Strength A",
    "strength-b": "Strength B",
    mobility: "Walk and Mobility",
    active: "Disc golf, walk, or active family day",
    rest: "Rest"
  };
  return labels[type];
}

export function getWorkoutRecommendation(options: {
  readiness: number;
  checkin?: DailyCheckin;
  scheduled?: WorkoutTemplateType;
}) {
  const scheduled = options.scheduled ?? getScheduledWorkout();
  const checkin = options.checkin;
  const backPain = checkin?.back_pain ?? 2;
  const shoulderPain = checkin?.shoulder_pain ?? 0;

  if (checkin?.leg_symptoms) {
    return {
      type: "rest" as WorkoutTemplateType,
      title: "No strength workout today",
      guidance: "Log symptoms, keep movement gentle, and consider medical guidance before continuing.",
      flags: ["medical-caution"]
    };
  }

  if (backPain >= 4) {
    return {
      type: "mobility" as WorkoutTemplateType,
      title: "Back-safe recovery day",
      guidance: "Back pain is 4 or higher. Walk, do gentle mobility, and avoid hinges or loaded lower-body work.",
      flags: ["avoid-hinges-loaded-lower", "back-recovery"]
    };
  }

  if (options.readiness < 40) {
    return {
      type: "rest" as WorkoutTemplateType,
      title: "Rest or gentle walk only",
      guidance: "Win the day by recovering. Keep it easy.",
      flags: ["low-readiness"]
    };
  }

  if (options.readiness < 60) {
    return {
      type: "mobility" as WorkoutTemplateType,
      title: "Walking and mobility",
      guidance: "Recovery work is the right strength work today.",
      flags: ["recovery"]
    };
  }

  if (shoulderPain >= 4) {
    return {
      type: "mobility" as WorkoutTemplateType,
      title: "Shoulder-smart recovery day",
      guidance: "Avoid push-ups, pressing, pull-ups, hanging, dips, and painful shoulder ranges today.",
      flags: ["avoid-press-pull-hang"]
    };
  }

  const flags: string[] = [];
  if (backPain >= 4) flags.push("avoid-hinges-loaded-lower");
  if (shoulderPain >= 4) flags.push("avoid-press-pull-hang");

  return {
    type: scheduled,
    title:
      options.readiness >= 80
        ? scheduledLabel(scheduled)
        : `${scheduledLabel(scheduled)} - moderate`,
    guidance:
      options.readiness >= 80
        ? "Good day to train. Keep the reps clean and conservative."
        : "Use the scheduled plan, but keep every set moderate.",
    flags
  };
}

export function getProgressionAdvice(input: {
  completed: boolean;
  pain: number;
  rpe: number;
}) {
  if (!input.completed) return "Repeat this next time before progressing.";
  if (input.pain >= 4) return "Deload or replace this movement next time.";
  if (input.pain === 3) return "Hold steady next time.";
  if (input.pain <= 2 && input.rpe <= 7) {
    return "Ready to progress: add 1 to 2 reps or 5 pounds, not both.";
  }
  return "Keep the same load until it feels cleaner.";
}
