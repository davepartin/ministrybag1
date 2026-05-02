"use client";

import { Activity, Apple, Dumbbell, Footprints, Flame, HeartPulse, Scale, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { PainBadge } from "@/components/ui/PainBadge";
import { ProteinProgress } from "@/components/ui/ProteinProgress";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";
import { SafetyWarning } from "@/components/ui/SafetyWarning";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { todayIso, formatShortDate, toIsoDate } from "@/lib/utils/date";
import { calculateReadinessScore, getReadinessBand } from "@/lib/utils/readiness";
import { getSafetyWarnings } from "@/lib/utils/safety";
import { getScheduledWorkout, getWorkoutRecommendation, scheduledLabel } from "@/lib/utils/workout";
import { getLatestByName } from "@/lib/utils/progress";

export default function DashboardPage() {
  const { profile, dailyCheckins, foodEntries, workouts, strengthTests } = useDaveData();
  const today = todayIso();
  const todayCheckin = dailyCheckins.find((item) => item.date === today) ?? dailyCheckins[0];
  const todayFood = foodEntries.filter((entry) => entry.date === today);
  const proteinFromFood = todayFood.reduce((sum, entry) => sum + entry.protein_grams, 0);
  const proteinTotal = proteinFromFood || todayCheckin?.protein_grams || 0;
  const readiness =
    todayCheckin?.readiness_score ??
    calculateReadinessScore({
      sleep_hours: 7,
      energy: 3,
      stress: 3,
      back_pain: 2,
      shoulder_pain: 0,
      leg_symptoms: false
    });
  const band = getReadinessBand(readiness);
  const scheduled = getScheduledWorkout();
  const recommendation = getWorkoutRecommendation({ readiness, checkin: todayCheckin, scheduled });
  const latestTests = getLatestByName(strengthTests);
  const latestWorkout = workouts[0];
  const trendData = dailyCheckins
    .slice(0, 7)
    .reverse()
    .map((checkin) => ({
      date: formatShortDate(checkin.date),
      back: checkin.back_pain,
      shoulder: checkin.shoulder_pain,
      protein: checkin.protein_grams ?? 0,
      weight: checkin.weight ?? 0,
      walking: checkin.walking_minutes ?? 0,
      workouts: workouts.some((workout) => workout.date === checkin.date && workout.completed) || checkin.workout_completed ? 1 : 0
    }));
  const warnings = getSafetyWarnings({
    leg_symptoms: todayCheckin?.leg_symptoms,
    back_pain: todayCheckin?.back_pain,
    shoulder_pain: todayCheckin?.shoulder_pain
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="surface overflow-hidden">
          <div className="bg-charcoal p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">Strong for life</p>
            <h1 className="mt-2 text-3xl font-bold">Build the body you can trust, Dave.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-200">{profile.primary_goal}</p>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-3">
            <div>
              <p className="label">Readiness</p>
              <div className="mt-2"><ReadinessBadge score={readiness} /></div>
            </div>
            <div>
              <p className="label">Today</p>
              <p className="mt-2 font-semibold text-ink">{band.guidance}</p>
            </div>
            <div>
              <p className="label">Next workout</p>
              <p className="mt-2 font-semibold text-ink">{recommendation.title}</p>
            </div>
          </div>
        </div>
        <div className="surface p-4">
          <ProteinProgress total={proteinTotal} target={profile.protein_target} />
        </div>
      </section>

      <SafetyWarning warnings={warnings} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Today's readiness score" value={readiness} subtext={band.label} icon={<ShieldCheck className="h-5 w-5" />} tone={band.color === "green" ? "green" : band.color} />
        <DashboardCard title="Back pain today" value={`${todayCheckin?.back_pain ?? 2}/10`} subtext={<PainBadge value={todayCheckin?.back_pain ?? 2} label="Back" />} icon={<HeartPulse className="h-5 w-5" />} />
        <DashboardCard title="Shoulder status today" value={`${todayCheckin?.shoulder_pain ?? 0}/10`} subtext={<PainBadge value={todayCheckin?.shoulder_pain ?? 0} label="Shoulder" />} icon={<Activity className="h-5 w-5" />} />
        <DashboardCard title="Protein progress" value={`${proteinTotal}g`} subtext={`${Math.max(0, profile.protein_target - proteinTotal)}g left`} icon={<Apple className="h-5 w-5" />} tone="green" />
        <DashboardCard title="Workout completed" value={todayCheckin?.workout_completed || latestWorkout?.date === today ? "Yes" : "Not yet"} subtext={latestWorkout ? `Latest: ${latestWorkout.workout_type}` : "Back-safe progress"} icon={<Dumbbell className="h-5 w-5" />} />
        <DashboardCard title="Walking minutes" value={todayCheckin?.walking_minutes ?? 0} subtext="Disc golf engine" icon={<Footprints className="h-5 w-5" />} tone="blue" />
        <DashboardCard title="Current streak" value={calculateStreak(dailyCheckins)} subtext="Check-in days" icon={<Flame className="h-5 w-5" />} tone="orange" />
        <DashboardCard title="Current weight" value={`${todayCheckin?.weight ?? profile.starting_weight} lb`} subtext="Track the trend, not the mood" icon={<Scale className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="surface p-4">
          <p className="label">Latest strength test summary</p>
          <div className="mt-4 space-y-3">
            {["30-Second Chair Stand", "Max Strict Push-Ups", "Max Strict Pull-Ups", "Front Plank"].map((name) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 p-3">
                <span className="text-sm font-semibold text-ink">{name}</span>
                <span className="text-sm font-bold text-moss">
                  {latestTests[name]?.value ?? "Not tested"} {latestTests[name]?.unit ?? ""}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="label">Weekly trend</p>
              <h2 className="text-xl font-bold text-ink">Pain, protein, workouts, weight</h2>
            </div>
            <span className="rounded-lg bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">{scheduledLabel(scheduled)}</span>
          </div>
          <WeeklyTrendChart
            data={trendData}
            series={[
              { key: "back", label: "Back pain", color: "#bd6b2d" },
              { key: "protein", label: "Protein", color: "#2f6f5e" },
              { key: "workouts", label: "Workouts", color: "#20242a" },
              { key: "weight", label: "Weight", color: "#2f6f9f" }
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function calculateStreak(checkins: { date: string }[]) {
  const dates = new Set(checkins.map((item) => item.date));
  let streak = 0;
  const cursor = new Date();
  while (dates.has(toIsoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
