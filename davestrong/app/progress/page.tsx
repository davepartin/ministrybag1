"use client";

import { ShieldCheck } from "lucide-react";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import type { DailyCheckin, FoodEntry } from "@/lib/types";
import { formatShortDate, weekKey } from "@/lib/utils/date";
import { calculateDurabilityScore, getLatestByName, weeklyWorkoutTotals } from "@/lib/utils/progress";

export default function ProgressPage() {
  const { profile, dailyCheckins, foodEntries, workouts, strengthTests } = useDaveData();
  const latestTests = getLatestByName(strengthTests);
  const durability = calculateDurabilityScore({
    latestTests,
    workouts,
    foodEntries,
    checkins: dailyCheckins,
    proteinTarget: profile.protein_target
  });
  const bodyData = dailyCheckins
    .slice()
    .reverse()
    .map((checkin) => ({
      date: formatShortDate(checkin.date),
      weight: checkin.weight ?? 0,
      waist: checkin.waist ?? 0,
      back: checkin.back_pain,
      shoulder: checkin.shoulder_pain,
      walking: checkin.walking_minutes ?? 0
    }));
  const proteinData = buildProteinData(foodEntries, dailyCheckins);
  const workoutData = weeklyWorkoutTotals(workouts, dailyCheckins).map((item) => ({
    week: formatShortDate(item.week),
    workouts: item.workouts,
    walking: item.walking
  }));

  const testChart = (name: string) =>
    strengthTests
      .filter((test) => test.test_name === name && typeof test.value === "number")
      .slice()
      .reverse()
      .map((test) => ({
        date: formatShortDate(test.test_date),
        value: test.value ?? 0
      }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[0.6fr_1.4fr]">
        <DashboardCard
          title="Durability Score"
          value={durability}
          subtext="Chair stand, push-ups, pull-ups, plank, carry, pain trend, workouts, and protein."
          icon={<ShieldCheck className="h-5 w-5" />}
          tone={durability >= 75 ? "green" : durability >= 55 ? "yellow" : "orange"}
        />
        <div className="surface p-5">
          <p className="label">Transparent score</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Durable strength, not gym theater.</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            This score blends strength tests, back pain trend, workout consistency, and protein consistency. It is a simple dashboard signal, not a medical score.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ProgressChart title="Body weight" data={bodyData.filter((item) => item.weight > 0)} dataKey="weight" unit="lb" color="#2f6f9f" />
        <ProgressChart title="Waist" data={bodyData.filter((item) => item.waist > 0)} dataKey="waist" unit="in" color="#bd6b2d" />
        <ProgressChart title="Protein average by week" data={proteinData} dataKey="protein" labelKey="week" unit="g/day" type="bar" color="#2f6f5e" />
        <ProgressChart title="Workouts completed by week" data={workoutData} dataKey="workouts" labelKey="week" type="bar" color="#2f6f9f" />
        <ProgressChart title="Walking minutes by week" data={workoutData} dataKey="walking" labelKey="week" type="bar" color="#4f7f52" />
        <ProgressChart title="Back pain trend" data={bodyData} dataKey="back" color="#bd6b2d" />
        <ProgressChart title="Shoulder pain trend" data={bodyData} dataKey="shoulder" color="#9f4538" />
        <ProgressChart title="Chair stand progress" data={testChart("30-Second Chair Stand")} dataKey="value" unit="reps" />
        <ProgressChart title="Push-up progress" data={testChart("Max Strict Push-Ups")} dataKey="value" unit="reps" color="#2f6f9f" />
        <ProgressChart title="Pull-up progress" data={testChart("Max Strict Pull-Ups")} dataKey="value" unit="reps" color="#4f7f52" />
        <ProgressChart title="Plank progress" data={testChart("Front Plank")} dataKey="value" unit="seconds" color="#6f5f2f" />
        <ProgressChart title="Farmer carry progress" data={testChart("Farmer Carry")} dataKey="value" unit="lb" color="#9f6b2f" />
        <ProgressChart title="Goblet squat progress" data={testChart("Goblet Squat")} dataKey="value" unit="lb" color="#2f6f5e" />
      </section>
    </div>
  );
}

function buildProteinData(foodEntries: FoodEntry[], dailyCheckins: DailyCheckin[]) {
  const byWeek = new Map<string, { byDay: Map<string, number> }>();
  foodEntries.forEach((entry) => {
    const key = weekKey(entry.date);
    if (!byWeek.has(key)) byWeek.set(key, { byDay: new Map() });
    const week = byWeek.get(key);
    if (!week) return;
    week.byDay.set(entry.date, (week.byDay.get(entry.date) ?? 0) + entry.protein_grams);
  });
  dailyCheckins.forEach((checkin) => {
    if (!checkin.protein_grams) return;
    const key = weekKey(checkin.date);
    if (!byWeek.has(key)) byWeek.set(key, { byDay: new Map() });
    const week = byWeek.get(key);
    if (!week || week.byDay.has(checkin.date)) return;
    week.byDay.set(checkin.date, checkin.protein_grams);
  });

  return Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, value]) => {
      const totals = Array.from(value.byDay.values());
      return {
        week: formatShortDate(week),
        protein: totals.length ? Math.round(totals.reduce((sum, item) => sum + item, 0) / totals.length) : 0
      };
    });
}
