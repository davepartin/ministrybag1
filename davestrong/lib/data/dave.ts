import type {
  Exercise,
  Goal,
  Profile,
  QuickAddFood,
  StrengthTest,
  WorkoutTemplate
} from "@/lib/types";

export const daveProfile: Profile = {
  name: "Dave",
  birthday: "1977-02-04",
  height_inches: 70,
  starting_weight: 185,
  protein_target: 130,
  primary_goal:
    "Build durable strength for health, disc golf, family, and long-term active life.",
  back_history:
    "Lower back surgery in 2019, probably laminectomy/discectomy after six months of severe sciatic pain. Surgery resolved the sciatic pain. Current back pain baseline: 2 out of 10.",
  shoulder_history:
    "Chronic left shoulder instability/dislocation risk when arm is raised straight overhead. No dislocation for five years because risky positions are avoided.",
  equipment: ["Treadmill", "Bench", "Barbell", "Dumbbells", "Pull-up bar", "Home gym"],
  training_days: [
    "Monday Strength A",
    "Tuesday Walk and Mobility",
    "Wednesday Strength B",
    "Thursday Walk and Mobility",
    "Friday Strength A",
    "Saturday Disc golf, walk, or active family day",
    "Sunday Rest"
  ],
  units: "pounds/inches"
};

export const baselineStrengthTests: StrengthTest[] = [
  {
    id: "baseline-chair-stand",
    test_date: "2026-05-02",
    test_name: "30-Second Chair Stand",
    value: 13,
    unit: "reps",
    quality: "imperfect",
    notes: "First test was imperfect because Dave rocked back up."
  },
  {
    id: "baseline-push-ups",
    test_date: "2026-05-02",
    test_name: "Max Strict Push-Ups",
    value: 8,
    unit: "reps",
    quality: "clean",
    pain: 0,
    notes: "Weakness and burning felt mostly in shoulders."
  },
  {
    id: "baseline-pull-ups",
    test_date: "2026-05-02",
    test_name: "Max Strict Pull-Ups",
    value: 2.5,
    unit: "reps",
    notes: "No dead hang because of left shoulder risk."
  },
  {
    id: "baseline-front-plank",
    test_date: "2026-05-02",
    test_name: "Front Plank",
    value: 45,
    unit: "seconds",
    quality: "shaky"
  },
  {
    id: "baseline-side-plank",
    test_date: "2026-05-02",
    test_name: "Side Plank",
    value: null,
    value_secondary: null,
    unit: "seconds",
    quality: "not tested"
  }
];

export const strengthGoals: Goal[] = [
  {
    goal_name: "30-Second Chair Stand",
    current_value: 13,
    first_target: 20,
    strong_target: 25,
    unit: "reps",
    category: "legs"
  },
  {
    goal_name: "Max Strict Push-Ups",
    current_value: 8,
    first_target: 20,
    strong_target: 30,
    unit: "reps",
    category: "push"
  },
  {
    goal_name: "Max Strict Pull-Ups",
    current_value: 2.5,
    first_target: 5,
    strong_target: 8,
    unit: "reps",
    category: "pull"
  },
  {
    goal_name: "Front Plank",
    current_value: 45,
    first_target: 75,
    strong_target: 120,
    unit: "seconds",
    category: "core"
  },
  {
    goal_name: "Side Plank",
    current_value: 0,
    first_target: 30,
    strong_target: 60,
    unit: "seconds each side",
    category: "core"
  },
  {
    goal_name: "Floor Get-Up Test",
    current_value: 0,
    first_target: 1,
    strong_target: 1,
    unit: "smooth rep",
    category: "mobility"
  },
  {
    goal_name: "Farmer Carry",
    current_value: 0,
    first_target: 45,
    strong_target: 60,
    unit: "lb dumbbells for 60s",
    category: "carry"
  },
  {
    goal_name: "Goblet Squat",
    current_value: 0,
    first_target: 40,
    strong_target: 60,
    unit: "lb x 10",
    category: "legs"
  },
  {
    goal_name: "Bench Press",
    current_value: 0,
    first_target: 135,
    strong_target: 185,
    unit: "lb",
    category: "push"
  }
];

export const quickAddFoods: QuickAddFood[] = [
  { label: "3 eggs", protein: 18, meal_type: "breakfast" },
  { label: "4 thin bacon slices", protein: 10, meal_type: "breakfast" },
  { label: "Protein bar", protein: 20, meal_type: "snack" },
  { label: "Protein shake", protein: 30, meal_type: "snack" },
  { label: "Greek yogurt", protein: 20, meal_type: "snack" },
  { label: "Chicken serving", protein: 40, meal_type: "dinner" },
  { label: "Normal family dinner estimate", protein: 35, calories: 700, meal_type: "dinner" },
  { label: "Taco meal estimate", protein: 30, meal_type: "dinner" },
  { label: "Cookies", protein: 0, meal_type: "snack" },
  { label: "Slim Jim", protein: 6, meal_type: "snack" }
];

export const startingFoodPatterns = [
  {
    name: "Normal day pattern",
    items: ["3 fried eggs", "4 thin pieces of bacon", "Normal family dinner around 700 calories", "1 protein bar", "2 cookies"],
    note: "Protein first. Improve the day without turning eating into a second job."
  },
  {
    name: "Travel example",
    items: ["3 al pastor tacos", "Medium shake", "4 Oreos", "4 Slim Jims"],
    note: "Track it honestly, then find one protein win."
  }
];

export const workoutTemplates: Record<"strength-a" | "strength-b" | "mobility", WorkoutTemplate> = {
  "strength-a": {
    id: "strength-a",
    name: "Strength A",
    focus: "Legs, push, pull, core, and carries",
    warmup: [
      "Treadmill walk, 5 minutes",
      "10 slow bodyweight squats to chair",
      "10 glute bridges",
      "10 easy band pull-aparts if you have a band"
    ],
    exercises: [
      {
        name: "Chair Squat",
        sets: 3,
        reps: "8",
        cue: "Sit back to the chair, pause, stand. No rocking."
      },
      {
        name: "Incline Push-Up",
        sets: 3,
        reps: "5 to 8",
        cue: "Hands on bench. Elbows 30 to 45 degrees, not flared. Stop before shoulder pain.",
        safety: "Avoid deep push-ups with flared elbows."
      },
      {
        name: "One-Arm Dumbbell Row",
        sets: 3,
        reps: "10 each side",
        side: "each",
        cue: "Support one hand on bench. Smooth and controlled."
      },
      {
        name: "Glute Bridge",
        sets: 3,
        reps: "12",
        cue: "Squeeze glutes at the top."
      },
      {
        name: "Dead Bug",
        sets: 3,
        reps: "6 each side",
        side: "each",
        cue: "Slow. Back stays flat."
      },
      {
        name: "Farmer Carry",
        sets: 4,
        duration: "30 seconds",
        cue: "Walk tall with great posture."
      }
    ]
  },
  "strength-b": {
    id: "strength-b",
    name: "Strength B",
    focus: "Step-ups, light hinge pattern, pull, single-leg strength, and anti-lean carries",
    warmup: [
      "Treadmill walk, 5 minutes",
      "Hip hinges with hands on hips",
      "Cat-cow x 8",
      "Bird dog x 6 each side"
    ],
    exercises: [
      {
        name: "Step-Ups",
        sets: 3,
        reps: "8 each leg",
        side: "each",
        cue: "Use a low step. Control the lowering."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 3,
        reps: "8",
        cue: "Very light at first. Hip hinge, not back bend. Stop if back pain rises.",
        safety: "Skip hinge work when back pain is 4 or higher."
      },
      {
        name: "Assisted Pull-Up or Slow Negative Pull-Up",
        sets: 3,
        reps: "2 to 4",
        cue: "Only if shoulder feels stable. No dead hang at bottom.",
        safety: "No kipping and no dead hang."
      },
      {
        name: "Split Squat to Comfortable Depth",
        sets: 2,
        reps: "6 each leg",
        side: "each",
        cue: "Hold onto something if needed."
      },
      {
        name: "Bird Dog",
        sets: 2,
        reps: "8 each side",
        side: "each",
        cue: "Slow and stable."
      },
      {
        name: "Suitcase Carry",
        sets: 3,
        duration: "30 seconds each side",
        side: "each",
        cue: "One dumbbell in one hand. Walk tall."
      }
    ]
  },
  mobility: {
    id: "mobility",
    name: "Walk and Mobility",
    focus: "Easy walking, hips, back, calves, and rotation without load",
    warmup: ["Walk 30 to 45 minutes"],
    exercises: [
      { name: "Cat-Cow", sets: 1, reps: "10", cue: "Move slowly through the spine." },
      { name: "Hip Flexor Stretch", sets: 1, duration: "45 seconds each side", side: "each", cue: "Stay tall and breathe." },
      { name: "Hamstring Stretch", sets: 1, duration: "45 seconds each side", side: "each", cue: "Gentle stretch, no bouncing." },
      { name: "Figure-Four Stretch", sets: 1, duration: "45 seconds each side", side: "each", cue: "Keep it easy on the low back." },
      { name: "Open Book Rotation", sets: 1, reps: "8 each side", side: "each", cue: "Rotate gently, no loaded twisting." },
      { name: "Calf Stretch", sets: 1, duration: "45 seconds each side", side: "each", cue: "Long, steady breathing." }
    ]
  }
};

export const exerciseLibrary: Exercise[] = [
  {
    name: "Chair squat",
    category: "legs",
    why_it_matters: "Builds leg strength for stairs, hills, disc golf rounds, and getting up easily.",
    instructions: "Stand in front of a chair, sit back under control, pause lightly, then stand tall without rocking.",
    safety_notes: "Keep the back quiet and avoid collapsing into the chair.",
    common_mistakes: "Rocking, knees diving inward, rushing the bottom.",
    regression: "Use a higher chair or hold a support.",
    progression: "Add reps first, then hold a light dumbbell."
  },
  {
    name: "Goblet squat",
    category: "legs",
    why_it_matters: "Builds stronger legs and hips while keeping the load easier to control.",
    instructions: "Hold one dumbbell at chest height, sit between the hips, and stand tall.",
    safety_notes: "Start light. Stop if back pain rises.",
    common_mistakes: "Dropping too deep too soon, rounding the back, bouncing.",
    regression: "Return to chair squats.",
    progression: "Add 5 pounds only after clean pain-free sets."
  },
  {
    name: "Step-up",
    category: "legs",
    why_it_matters: "Builds single-leg strength for hills, tee pads, and everyday durability.",
    instructions: "Step onto a low platform, drive through the whole foot, and lower slowly.",
    safety_notes: "Use a low step and hold support if balance is shaky.",
    common_mistakes: "Pushing off hard from the back leg or dropping down fast.",
    regression: "Use a lower step.",
    progression: "Add reps, then light dumbbells."
  },
  {
    name: "Split squat",
    category: "legs",
    why_it_matters: "Builds hips, knees, balance, and useful strength without heavy spinal loading.",
    instructions: "Use a staggered stance, lower to a comfortable depth, and stand with control.",
    safety_notes: "Hold onto something and keep range pain-free.",
    common_mistakes: "Going too deep, twisting, or losing balance.",
    regression: "Shorten the stance and reduce depth.",
    progression: "Add reps, then light dumbbells."
  },
  {
    name: "Glute bridge",
    category: "legs",
    why_it_matters: "Trains glutes to support the low back and hips.",
    instructions: "Lie on your back, feet planted, squeeze glutes, and lift hips until straight.",
    safety_notes: "Do not arch through the low back.",
    common_mistakes: "Overextending the spine or pushing through toes.",
    regression: "Use a smaller range of motion.",
    progression: "Pause longer at the top or add a light dumbbell."
  },
  {
    name: "Dumbbell Romanian deadlift",
    category: "legs",
    why_it_matters: "Teaches the hip hinge and strengthens hamstrings and glutes for back-safe progress.",
    instructions: "Hold light dumbbells, push hips back, keep ribs down, and stand by squeezing glutes.",
    safety_notes: "Very light at first. Avoid on days when back pain is 4 or higher.",
    common_mistakes: "Rounding the back, going too low, or chasing heavy weight.",
    regression: "Practice unloaded hip hinges with hands on hips.",
    progression: "Add 5 pounds only after pain-free, low-RPE sets."
  },
  {
    name: "Incline push-up",
    category: "push",
    why_it_matters: "Builds pressing strength without forcing risky shoulder depth.",
    instructions: "Hands on bench, body straight, elbows 30 to 45 degrees, stop before shoulder pain.",
    safety_notes: "Avoid deep range and flared elbows.",
    common_mistakes: "Letting shoulders shrug, flaring elbows, sagging hips.",
    regression: "Use a higher hand position.",
    progression: "Lower the incline slowly or add reps."
  },
  {
    name: "Dumbbell floor press",
    category: "push",
    why_it_matters: "Builds shoulder-smart pressing with the floor limiting depth.",
    instructions: "Lie on the floor, press neutral-grip dumbbells, and stop with control.",
    safety_notes: "No painful range. Keep elbows closer than a wide bench grip.",
    common_mistakes: "Flaring elbows or bouncing upper arms on the floor.",
    regression: "Use lighter dumbbells or one arm at a time.",
    progression: "Add small weight jumps after clean reps."
  },
  {
    name: "One-arm dumbbell row",
    category: "pull",
    why_it_matters: "Builds back strength and shoulder control for posture and disc golf resilience.",
    instructions: "Support one hand on a bench, row smoothly, pause, and lower with control.",
    safety_notes: "Keep torso stable and avoid twisting under load.",
    common_mistakes: "Yanking, rotating the torso, or shrugging.",
    regression: "Use lighter weight.",
    progression: "Add reps, then 5 pounds."
  },
  {
    name: "Assisted pull-up",
    category: "pull",
    why_it_matters: "Builds pulling strength without hanging from a vulnerable bottom position.",
    instructions: "Use assistance, pull smoothly, and stop before the shoulder feels unstable.",
    safety_notes: "No dead hang, no kipping, no painful range.",
    common_mistakes: "Dropping into the bottom or rushing reps.",
    regression: "Do one-arm rows instead.",
    progression: "Use slightly less assistance."
  },
  {
    name: "Slow negative pull-up",
    category: "pull",
    why_it_matters: "Builds pull-up strength with low volume and control.",
    instructions: "Start at the top with support, lower slowly, and step down before a dead hang.",
    safety_notes: "Only if the shoulder feels stable. Never drop into a dead hang.",
    common_mistakes: "Lowering too far or losing shoulder control.",
    regression: "Assisted pull-up or rows.",
    progression: "Add one controlled rep."
  },
  {
    name: "Farmer carry",
    category: "carry",
    why_it_matters: "Builds grip, trunk stiffness, posture, and useful dad strength.",
    instructions: "Hold dumbbells at your sides and walk tall for time.",
    safety_notes: "Stop if back pain rises or posture breaks.",
    common_mistakes: "Leaning back, rushing, or shrugging.",
    regression: "Use lighter weights or shorter rounds.",
    progression: "Add time before weight."
  },
  {
    name: "Suitcase carry",
    category: "carry",
    why_it_matters: "Builds anti-lean core strength for back resilience.",
    instructions: "Hold one dumbbell in one hand and walk tall without leaning.",
    safety_notes: "Use a moderate weight and keep the torso quiet.",
    common_mistakes: "Leaning away, twisting, or holding breath.",
    regression: "Use a lighter dumbbell.",
    progression: "Add time, then weight."
  },
  {
    name: "Dead bug",
    category: "core",
    why_it_matters: "Builds core control while protecting the low back.",
    instructions: "Lie on your back, brace gently, move opposite arm and leg slowly, and keep back flat.",
    safety_notes: "Reduce range if the low back arches.",
    common_mistakes: "Moving fast or letting ribs flare.",
    regression: "Move arms only or legs only.",
    progression: "Add longer reaches."
  },
  {
    name: "Bird dog",
    category: "core",
    why_it_matters: "Builds spine stability and hip control.",
    instructions: "From hands and knees, reach opposite arm and leg, pause, and return slowly.",
    safety_notes: "Keep hips level and avoid arching.",
    common_mistakes: "Rotating the hips or rushing.",
    regression: "Move only one limb at a time.",
    progression: "Add a longer pause."
  },
  {
    name: "Front plank",
    category: "core",
    why_it_matters: "Builds trunk endurance for a body you can trust.",
    instructions: "Brace on forearms and toes, squeeze glutes, and breathe steadily.",
    safety_notes: "Stop before low-back sagging or shoulder irritation.",
    common_mistakes: "Holding breath, sagging, or chasing time with bad form.",
    regression: "Use knees or an incline.",
    progression: "Add 5 to 10 seconds."
  },
  {
    name: "Side plank",
    category: "core",
    why_it_matters: "Builds lateral core strength for hips, back, and throwing resilience.",
    instructions: "Brace on forearm and feet or knees, keep a straight line, and breathe.",
    safety_notes: "Use the knee version if shoulder or back feels irritated.",
    common_mistakes: "Letting hips drop or shoulder shrug.",
    regression: "Side plank from knees.",
    progression: "Add time before harder variations."
  },
  {
    name: "Cat-cow",
    category: "mobility",
    why_it_matters: "Gives the spine gentle motion without loading it.",
    instructions: "Move between rounded and extended positions slowly on hands and knees.",
    safety_notes: "Stay gentle and avoid end-range pain.",
    common_mistakes: "Forcing range or moving too fast.",
    regression: "Use a smaller range.",
    progression: "Add slow breathing."
  },
  {
    name: "Hip flexor stretch",
    category: "mobility",
    why_it_matters: "Helps hips open up so the low back does not have to compensate.",
    instructions: "Use a half-kneeling or standing stance, tuck pelvis slightly, and breathe.",
    safety_notes: "Do not arch the low back.",
    common_mistakes: "Leaning back or forcing the stretch.",
    regression: "Do it standing.",
    progression: "Add a gentle glute squeeze."
  },
  {
    name: "Hamstring stretch",
    category: "mobility",
    why_it_matters: "Keeps posterior chain movement comfortable for walking and hinging.",
    instructions: "Use a gentle position and hold without bouncing.",
    safety_notes: "Avoid nerve-like symptoms or aggressive stretching.",
    common_mistakes: "Rounding hard through the low back.",
    regression: "Bend the knee.",
    progression: "Hold a little longer."
  },
  {
    name: "Figure-four stretch",
    category: "mobility",
    why_it_matters: "Helps glutes and hips feel better for walking and disc golf.",
    instructions: "Cross one ankle over the opposite thigh and ease into the stretch.",
    safety_notes: "Keep it comfortable for the low back.",
    common_mistakes: "Forcing the knee or twisting.",
    regression: "Do it seated.",
    progression: "Hold longer with calm breathing."
  },
  {
    name: "Open book rotation",
    category: "mobility",
    why_it_matters: "Improves upper-back rotation without loading the low back.",
    instructions: "Lie on your side and rotate the top arm open with control.",
    safety_notes: "This is gentle rotation, not twisting under load.",
    common_mistakes: "Forcing the shoulder or lumbar spine.",
    regression: "Use a smaller range.",
    progression: "Add slow breaths in the open position."
  },
  {
    name: "Calf stretch",
    category: "mobility",
    why_it_matters: "Supports walking volume, hills, and lower-leg comfort.",
    instructions: "Press heel down with a straight or slightly bent knee and hold.",
    safety_notes: "Avoid bouncing.",
    common_mistakes: "Turning the foot out or rushing.",
    regression: "Use a smaller lean.",
    progression: "Hold longer."
  }
];

export const futureFeatures = [
  "AI coach weekly summary",
  "Disc golf readiness score",
  "Meal templates",
  "Barcode scanning",
  "Photo progress",
  "Apple Health or Google Fit integration",
  "Export CSV",
  "Monthly progress report",
  "Exercise demo images or videos"
];
