"use client";

import { WorkoutTemplate } from "@/components/workout/WorkoutTemplate";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { calculateReadinessScore } from "@/lib/utils/readiness";
import { getScheduledWorkout } from "@/lib/utils/workout";

export default function WorkoutPage() {
  const { dailyCheckins } = useDaveData();
  const latest = dailyCheckins[0];
  const readiness =
    latest?.readiness_score ??
    calculateReadinessScore({
      sleep_hours: 7,
      energy: 3,
      stress: 3,
      back_pain: 2,
      shoulder_pain: 0,
      leg_symptoms: false
    });

  return <WorkoutTemplate readiness={readiness} scheduled={getScheduledWorkout()} />;
}
