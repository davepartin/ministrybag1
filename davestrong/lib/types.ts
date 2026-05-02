export type ReadinessColor = "green" | "yellow" | "orange" | "red";

export type Profile = {
  id?: string;
  name: string;
  birthday: string;
  height_inches: number;
  starting_weight: number;
  protein_target: number;
  primary_goal: string;
  back_history: string;
  shoulder_history: string;
  equipment: string[];
  training_days?: string[];
  units?: "pounds/inches";
  created_at?: string;
  updated_at?: string;
};

export type DailyCheckin = {
  id: string;
  user_id?: string;
  date: string;
  weight?: number | null;
  waist?: number | null;
  sleep_hours?: number | null;
  energy?: number | null;
  mood?: number | null;
  stress?: number | null;
  back_pain: number;
  shoulder_pain: number;
  leg_symptoms: boolean;
  walking_minutes?: number | null;
  steps?: number | null;
  protein_grams?: number | null;
  calories?: number | null;
  water_ounces?: number | null;
  workout_completed: boolean;
  mobility_completed: boolean;
  notes?: string | null;
  readiness_score: number;
  created_at?: string;
};

export type FoodEntry = {
  id: string;
  user_id?: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  food_name: string;
  protein_grams: number;
  calories?: number | null;
  notes?: string | null;
  created_at?: string;
};

export type WorkoutExerciseLog = {
  id: string;
  workout_id?: string;
  exercise_name: string;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  duration_seconds?: number | null;
  side?: string | null;
  pain: number;
  rpe: number;
  completed: boolean;
  notes?: string | null;
  created_at?: string;
};

export type WorkoutSession = {
  id: string;
  user_id?: string;
  date: string;
  workout_type: string;
  completed: boolean;
  overall_rpe?: number | null;
  back_pain_before: number;
  back_pain_after: number;
  shoulder_pain_before: number;
  shoulder_pain_after: number;
  notes?: string | null;
  created_at?: string;
  exercise_logs?: WorkoutExerciseLog[];
};

export type StrengthTest = {
  id: string;
  user_id?: string;
  test_date: string;
  test_name: string;
  value?: number | null;
  value_secondary?: number | null;
  unit: string;
  quality?: string | null;
  pain?: number | null;
  notes?: string | null;
  created_at?: string;
};

export type Goal = {
  id?: string;
  user_id?: string;
  goal_name: string;
  current_value: number;
  first_target: number;
  strong_target: number;
  unit: string;
  category: string;
  created_at?: string;
  updated_at?: string;
};

export type Exercise = {
  id?: string;
  name: string;
  category: "legs" | "push" | "pull" | "core" | "carry" | "mobility";
  why_it_matters: string;
  instructions: string;
  safety_notes: string;
  common_mistakes: string;
  regression: string;
  progression: string;
  created_at?: string;
};

export type WorkoutExerciseTemplate = {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  side?: string;
  cue: string;
  safety?: string;
};

export type WorkoutTemplateType = "strength-a" | "strength-b" | "mobility" | "active" | "rest";

export type WorkoutTemplate = {
  id: WorkoutTemplateType;
  name: string;
  focus: string;
  warmup: string[];
  exercises: WorkoutExerciseTemplate[];
};

export type QuickAddFood = {
  label: string;
  protein: number;
  calories?: number;
  meal_type: FoodEntry["meal_type"];
};
