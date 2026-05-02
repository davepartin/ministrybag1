import type { DailyCheckin, FoodEntry, StrengthTest, WorkoutSession } from "@/lib/types";
import { weekKey } from "@/lib/utils/date";

export function getLatestByName(tests: StrengthTest[]) {
  return tests.reduce<Record<string, StrengthTest>>((acc, test) => {
    const previous = acc[test.test_name];
    if (!previous || previous.test_date < test.test_date) acc[test.test_name] = test;
    return acc;
  }, {});
}

export function weeklyProteinAverage(entries: FoodEntry[]) {
  const byWeek = entries.reduce<Record<string, { protein: number; days: Set<string> }>>((acc, entry) => {
    const key = weekKey(entry.date);
    acc[key] ??= { protein: 0, days: new Set<string>() };
    acc[key].protein += entry.protein_grams;
    acc[key].days.add(entry.date);
    return acc;
  }, {});

  return Object.entries(byWeek)
    .map(([week, value]) => ({
      week,
      protein: Math.round(value.protein / Math.max(1, value.days.size))
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

export function weeklyWorkoutTotals(workouts: WorkoutSession[], checkins: DailyCheckin[]) {
  const byWeek = workouts.reduce<Record<string, { workouts: number; walking: number }>>((acc, workout) => {
    const key = weekKey(workout.date);
    acc[key] ??= { workouts: 0, walking: 0 };
    if (workout.completed) acc[key].workouts += 1;
    return acc;
  }, {});

  checkins.forEach((checkin) => {
    const key = weekKey(checkin.date);
    byWeek[key] ??= { workouts: 0, walking: 0 };
    byWeek[key].walking += checkin.walking_minutes ?? 0;
  });

  return Object.entries(byWeek)
    .map(([week, value]) => ({ week, ...value }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

export function calculateDurabilityScore(input: {
  latestTests: Record<string, StrengthTest>;
  workouts: WorkoutSession[];
  foodEntries: FoodEntry[];
  checkins: DailyCheckin[];
  proteinTarget: number;
}) {
  const chair = scoreValue(input.latestTests["30-Second Chair Stand"]?.value, 20);
  const push = scoreValue(input.latestTests["Max Strict Push-Ups"]?.value, 20);
  const pull = scoreValue(input.latestTests["Max Strict Pull-Ups"]?.value, 5);
  const plank = scoreValue(input.latestTests["Front Plank"]?.value, 75);
  const carry = scoreValue(input.latestTests["Farmer Carry"]?.value, 45);

  const recentCheckins = input.checkins.slice(0, 14);
  const avgBackPain =
    recentCheckins.reduce((sum, item) => sum + (item.back_pain ?? 0), 0) / Math.max(1, recentCheckins.length);
  const backScore = Math.max(0, 100 - avgBackPain * 12);

  const recentWorkouts = input.workouts.filter((workout) => {
    const days = (Date.now() - new Date(`${workout.date}T12:00:00`).getTime()) / 86400000;
    return days <= 14 && workout.completed;
  }).length;
  const workoutScore = Math.min(100, (recentWorkouts / 6) * 100);

  const lastSeven = new Set<string>();
  input.foodEntries.forEach((entry) => {
    const days = (Date.now() - new Date(`${entry.date}T12:00:00`).getTime()) / 86400000;
    if (days <= 7) lastSeven.add(entry.date);
  });
  const proteinScore = Math.min(100, (lastSeven.size / 7) * 100);

  const total =
    chair * 0.14 +
    push * 0.12 +
    pull * 0.1 +
    plank * 0.12 +
    carry * 0.1 +
    backScore * 0.16 +
    workoutScore * 0.14 +
    proteinScore * 0.12;

  return Math.round(total);
}

function scoreValue(value: number | null | undefined, target: number) {
  if (!value) return 0;
  return Math.min(100, (value / target) * 100);
}
