export type SafetyInput = {
  leg_symptoms?: boolean | null;
  back_pain?: number | null;
  shoulder_pain?: number | null;
  exercise_pain?: number | null;
  back_pain_before?: number | null;
  back_pain_after?: number | null;
};

export const mainSafetyMessage =
  "Do not push through this. Log what happened, stop the aggravating movement, and consider medical advice if symptoms persist or worsen.";

export function getSafetyWarnings(input: SafetyInput) {
  const warnings: string[] = [];

  if (input.leg_symptoms) {
    warnings.push(
      "Leg pain, numbness, tingling, weakness, bowel or bladder issues, fever, or severe worsening pain deserve extra caution. Consider contacting a medical professional before continuing."
    );
  }
  if ((input.back_pain ?? 0) >= 6) {
    warnings.push("Back pain is high today. Keep training gentle and avoid loaded lower-body work.");
  }
  if ((input.shoulder_pain ?? 0) >= 6) {
    warnings.push("Shoulder pain is high today. Avoid pressing, pull-ups, hanging, dips, and risky overhead positions.");
  }
  if ((input.exercise_pain ?? 0) >= 4) {
    warnings.push("Pain during a movement hit 4 or higher. Stop that movement and log what happened.");
  }

  const before = input.back_pain_before;
  const after = input.back_pain_after;
  if (typeof before === "number" && typeof after === "number" && after >= before + 2) {
    warnings.push("Back pain rose by 2 or more points during the workout. End the aggravating work.");
  }

  return warnings;
}
