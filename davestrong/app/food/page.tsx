"use client";

import { Apple, Trophy } from "lucide-react";
import { FoodEntryForm } from "@/components/forms/FoodEntryForm";
import { ProteinProgress } from "@/components/ui/ProteinProgress";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { useDaveData } from "@/lib/data/DaveDataProvider";
import { startingFoodPatterns } from "@/lib/data/dave";
import { todayIso, weekKey } from "@/lib/utils/date";

export default function FoodPage() {
  const { profile, foodEntries, dailyCheckins } = useDaveData();
  const today = todayIso();
  const checkinProtein = dailyCheckins.find((checkin) => checkin.date === today)?.protein_grams ?? 0;
  const foodTotal = foodEntries.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.protein_grams, 0);
  const todayTotal = foodTotal || checkinProtein;
  const thisWeek = weekKey(today);
  const weekEntries = foodEntries.filter((entry) => weekKey(entry.date) === thisWeek);
  const byDay = weekEntries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.date] = (acc[entry.date] ?? 0) + entry.protein_grams;
    return acc;
  }, {});
  dailyCheckins
    .filter((checkin) => weekKey(checkin.date) === thisWeek && (checkin.protein_grams ?? 0) > 0)
    .forEach((checkin) => {
      byDay[checkin.date] ??= checkin.protein_grams ?? 0;
    });
  const days = Object.values(byDay);
  const weeklyAverage = days.length ? Math.round(days.reduce((sum, value) => sum + value, 0) / days.length) : 0;
  const bestDay = days.length ? Math.max(...days) : 0;
  const targetDays = days.filter((value) => value >= profile.protein_target).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="surface p-4">
          <ProteinProgress total={todayTotal} target={profile.protein_target} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardCard title="Weekly average" value={`${weeklyAverage}g`} icon={<Apple className="h-5 w-5" />} tone="green" />
          <DashboardCard title="Best protein day" value={`${bestDay}g`} icon={<Trophy className="h-5 w-5" />} tone="blue" />
          <DashboardCard title="Days hitting target" value={targetDays} subtext="This week" tone="orange" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <FoodEntryForm />
        <div className="space-y-4">
          <div className="surface p-4">
            <p className="label">Starting patterns</p>
            <div className="mt-4 space-y-3">
              {startingFoodPatterns.map((pattern) => (
                <div key={pattern.name} className="rounded-lg bg-stone-50 p-3">
                  <p className="font-semibold text-ink">{pattern.name}</p>
                  <p className="mt-1 text-sm text-stone-600">{pattern.items.join(", ")}</p>
                  <p className="mt-2 text-sm font-semibold text-moss">{pattern.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="surface p-4">
            <p className="label">Recent food</p>
            <div className="mt-4 space-y-3">
              {foodEntries.slice(0, 12).map((entry) => (
                <div key={entry.id} className="rounded-lg bg-stone-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{entry.food_name}</p>
                      <p className="text-sm text-stone-500">{entry.date} - {entry.meal_type}</p>
                    </div>
                    <p className="text-lg font-bold text-moss">{entry.protein_grams}g</p>
                  </div>
                </div>
              ))}
              {foodEntries.length === 0 ? <p className="text-sm text-stone-500">No food logged yet. Keep this simple. Win the day.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
