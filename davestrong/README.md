# Dave Strong

Dave Strong is a private personal dashboard for durable strength, food, recovery, pain, and progress tracking. It is built around Dave's baseline, back history, shoulder limitation, home equipment, protein target, and first four-week training plan.

## Stack

- Next.js, React, TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- Recharts
- Mobile-first dashboard UI

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment example:

```bash
cp .env.local.example .env.local
```

3. Add your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

If Supabase keys are not set, the app runs in browser demo mode and saves entries to local storage.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Start the app and sign in once with your email. The app creates Dave's profile automatically.
5. Optional: run `supabase/seed.sql` after the profile exists to insert goals, baseline tests, and the exercise library.

## Included MVP Features

- Email sign-in with Supabase magic links
- Dave-specific profile setup and editing
- Daily check-in with readiness score
- Back, shoulder, and symptom safety warnings
- Protein-first food logging with quick-add buttons
- Strength A, Strength B, and mobility workout templates
- Exercise-level logging for sets, reps, weight, pain, RPE, notes, and completion
- Conservative progression advice
- Strength test logging and goal scorecards
- Progress charts for body metrics, pain, protein, workouts, walking, and strength tests
- Exercise library with Dave-specific safety notes
- Future feature placeholder page

## Safety Guardrails

This app is for tracking and conservative training support, not diagnosis. It avoids heavy deadlifts, heavy barbell squats, max effort lifting, dead hangs, overhead pressing, dips, wide-grip bench press, kipping pull-ups, and deep flared-elbow push-ups in the first phase.

If symptoms such as leg pain, numbness, tingling, weakness, bowel or bladder issues, fever, severe worsening pain, high back pain, high shoulder pain, or exercise pain 4+ are logged, the app shows a clear caution message.

## Deploy

The simplest path is Vercel:

1. Push this repo to GitHub.
2. Import the project into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

## Build Next

Planned follow-ups are stubbed in the Future page:

- AI coach weekly summary
- Disc golf readiness score
- Meal templates
- Barcode scanning
- Photo progress
- Apple Health or Google Fit integration
- Export CSV
- Monthly progress report
- Exercise demo images or videos
