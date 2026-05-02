"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { daveProfile, baselineStrengthTests } from "@/lib/data/dave";
import { supabase } from "@/lib/supabase/client";
import type {
  DailyCheckin,
  FoodEntry,
  Profile,
  StrengthTest,
  WorkoutExerciseLog,
  WorkoutSession
} from "@/lib/types";

type DaveStore = {
  profile: Profile;
  dailyCheckins: DailyCheckin[];
  foodEntries: FoodEntry[];
  workouts: WorkoutSession[];
  strengthTests: StrengthTest[];
};

type DaveDataContextValue = DaveStore & {
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveDailyCheckin: (input: Omit<DailyCheckin, "id" | "user_id" | "created_at">) => Promise<DailyCheckin>;
  addFoodEntry: (input: Omit<FoodEntry, "id" | "user_id" | "created_at">) => Promise<FoodEntry>;
  saveWorkout: (
    input: Omit<WorkoutSession, "id" | "user_id" | "created_at" | "exercise_logs">,
    logs: Array<Omit<WorkoutExerciseLog, "id" | "workout_id" | "created_at">>
  ) => Promise<WorkoutSession>;
  addStrengthTest: (input: Omit<StrengthTest, "id" | "user_id" | "created_at">) => Promise<StrengthTest>;
  updateProfile: (input: Partial<Profile>) => Promise<Profile>;
};

const demoUserId = "demo-user";
const storageKey = "dave-strong-demo-store-v1";

const initialStore: DaveStore = {
  profile: daveProfile,
  dailyCheckins: [],
  foodEntries: [],
  workouts: [],
  strengthTests: baselineStrengthTests
};

const DaveDataContext = createContext<DaveDataContextValue | undefined>(undefined);

export function DaveDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [store, setStore] = useState<DaveStore>(initialStore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localReady = useRef(false);

  const persistLocal = useCallback((next: DaveStore) => {
    if (typeof window === "undefined" || supabase || user) return;
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }, [user]);

  const setAndPersist = useCallback(
    (updater: (current: DaveStore) => DaveStore) => {
      setStore((current) => {
        const next = updater(current);
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      if (typeof window !== "undefined" && !localReady.current) {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          setStore(JSON.parse(saved) as DaveStore);
        } else {
          persistLocal(initialStore);
        }
        localReady.current = true;
      }
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profile = await ensureProfile(user.id);
      const [checkins, foods, workouts, tests] = await Promise.all([
        supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        supabase
          .from("food_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        supabase
          .from("workouts")
          .select("*, workout_exercise_logs(*)")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        supabase
          .from("strength_tests")
          .select("*")
          .eq("user_id", user.id)
          .order("test_date", { ascending: false })
      ]);

      for (const result of [checkins, foods, workouts, tests]) {
        if (result.error) throw result.error;
      }

      setStore({
        profile,
        dailyCheckins: (checkins.data ?? []) as DailyCheckin[],
        foodEntries: (foods.data ?? []) as FoodEntry[],
        workouts: ((workouts.data ?? []) as Array<WorkoutSession & { workout_exercise_logs?: WorkoutExerciseLog[] }>).map(
          (workout) => ({
            ...workout,
            exercise_logs: workout.workout_exercise_logs ?? workout.exercise_logs ?? []
          })
        ),
        strengthTests:
          tests.data && tests.data.length > 0 ? ((tests.data ?? []) as StrengthTest[]) : baselineStrengthTests
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Dave Strong data.");
    } finally {
      setLoading(false);
    }
  }, [persistLocal, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function ensureProfile(userId: string) {
    if (!supabase) return daveProfile;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    if (data) return data as Profile;

    const profile = {
      id: userId,
      ...daveProfile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    if (createError) throw createError;
    return created as Profile;
  }

  const value = useMemo<DaveDataContextValue>(
    () => ({
      ...store,
      loading,
      error,
      refresh,
      async saveDailyCheckin(input) {
        const record: DailyCheckin = {
          ...input,
          id: crypto.randomUUID(),
          user_id: user?.id ?? demoUserId,
          created_at: new Date().toISOString()
        };

        if (supabase && user) {
          const { data, error: saveError } = await supabase
            .from("daily_checkins")
            .upsert(record, { onConflict: "user_id,date" })
            .select()
            .single();
          if (saveError) throw saveError;
          const saved = data as DailyCheckin;
          setAndPersist((current) => ({
            ...current,
            dailyCheckins: [saved, ...current.dailyCheckins.filter((item) => item.date !== saved.date)]
          }));
          return saved;
        }

        setAndPersist((current) => ({
          ...current,
          dailyCheckins: [record, ...current.dailyCheckins.filter((item) => item.date !== record.date)]
        }));
        return record;
      },
      async addFoodEntry(input) {
        const record: FoodEntry = {
          ...input,
          id: crypto.randomUUID(),
          user_id: user?.id ?? demoUserId,
          created_at: new Date().toISOString()
        };

        if (supabase && user) {
          const { data, error: saveError } = await supabase.from("food_entries").insert(record).select().single();
          if (saveError) throw saveError;
          const saved = data as FoodEntry;
          setAndPersist((current) => ({ ...current, foodEntries: [saved, ...current.foodEntries] }));
          return saved;
        }

        setAndPersist((current) => ({ ...current, foodEntries: [record, ...current.foodEntries] }));
        return record;
      },
      async saveWorkout(input, logs) {
        const workout: WorkoutSession = {
          ...input,
          id: crypto.randomUUID(),
          user_id: user?.id ?? demoUserId,
          created_at: new Date().toISOString(),
          exercise_logs: []
        };

        if (supabase && user) {
          const workoutRow = {
            id: workout.id,
            user_id: workout.user_id,
            date: workout.date,
            workout_type: workout.workout_type,
            completed: workout.completed,
            overall_rpe: workout.overall_rpe,
            back_pain_before: workout.back_pain_before,
            back_pain_after: workout.back_pain_after,
            shoulder_pain_before: workout.shoulder_pain_before,
            shoulder_pain_after: workout.shoulder_pain_after,
            notes: workout.notes,
            created_at: workout.created_at
          };
          const { data, error: workoutError } = await supabase.from("workouts").insert(workoutRow).select().single();
          if (workoutError) throw workoutError;
          const savedWorkout = data as WorkoutSession;
          const exerciseLogs = logs.map((log) => ({
            ...log,
            id: crypto.randomUUID(),
            workout_id: savedWorkout.id,
            created_at: new Date().toISOString()
          }));
          const { data: savedLogs, error: logsError } = await supabase
            .from("workout_exercise_logs")
            .insert(exerciseLogs)
            .select();
          if (logsError) throw logsError;
          const saved = { ...savedWorkout, exercise_logs: (savedLogs ?? []) as WorkoutExerciseLog[] };
          setAndPersist((current) => ({ ...current, workouts: [saved, ...current.workouts] }));
          return saved;
        }

        const localLogs = logs.map((log) => ({
          ...log,
          id: crypto.randomUUID(),
          workout_id: workout.id,
          created_at: new Date().toISOString()
        }));
        const saved = { ...workout, exercise_logs: localLogs };
        setAndPersist((current) => ({ ...current, workouts: [saved, ...current.workouts] }));
        return saved;
      },
      async addStrengthTest(input) {
        const record: StrengthTest = {
          ...input,
          id: crypto.randomUUID(),
          user_id: user?.id ?? demoUserId,
          created_at: new Date().toISOString()
        };

        if (supabase && user) {
          const { data, error: saveError } = await supabase.from("strength_tests").insert(record).select().single();
          if (saveError) throw saveError;
          const saved = data as StrengthTest;
          setAndPersist((current) => ({ ...current, strengthTests: [saved, ...current.strengthTests] }));
          return saved;
        }

        setAndPersist((current) => ({ ...current, strengthTests: [record, ...current.strengthTests] }));
        return record;
      },
      async updateProfile(input) {
        const nextProfile: Profile = {
          ...store.profile,
          ...input,
          id: user?.id ?? store.profile.id,
          updated_at: new Date().toISOString()
        };

        if (supabase && user) {
          const { data, error: saveError } = await supabase
            .from("profiles")
            .upsert({ ...nextProfile, id: user.id })
            .select()
            .single();
          if (saveError) throw saveError;
          const saved = data as Profile;
          setAndPersist((current) => ({ ...current, profile: saved }));
          return saved;
        }

        setAndPersist((current) => ({ ...current, profile: nextProfile }));
        return nextProfile;
      }
    }),
    [error, loading, refresh, setAndPersist, store, user]
  );

  return <DaveDataContext.Provider value={value}>{children}</DaveDataContext.Provider>;
}

export function useDaveData() {
  const value = useContext(DaveDataContext);
  if (!value) throw new Error("useDaveData must be used inside DaveDataProvider.");
  return value;
}
