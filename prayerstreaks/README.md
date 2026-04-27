# Prayer Streaks

A private prayer web app for a couple to:

- mark that you prayed together today
- track your current streak, longest streak, and total prayer days
- add and delete shared prayer requests
- move current requests into answered prayers
- add answered prayers directly

The app is a plain static site. It runs locally in demo mode with browser storage, and it uses Supabase for real login plus shared cloud storage.

## Run Locally

From this folder:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

If `config.js` still has placeholder Supabase values, the app runs in demo mode. Demo mode is useful for testing the design, but it is not shared between devices.

## Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the Supabase project dashboard.
3. Go to **SQL Editor**.
4. Open `supabase/schema.sql` from this project.
5. Paste the full SQL into Supabase and click **Run**.
6. Go to **Project Settings > API**.
7. Copy your **Project URL** and **anon public key**.
8. Put them in `config.js`:

```js
window.PRAYER_STREAK_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT-REF.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
};
```

The anon key is designed to be public in browser apps. Do not put the service role key in this app.

## Configure Login

In Supabase:

1. Go to **Authentication > Providers > Email**.
2. Keep email/password enabled.
3. For the easiest private couple app, you can temporarily turn off email confirmations while creating accounts.
4. After both accounts are created, you can turn confirmations back on.

If email confirmation is enabled, each person must confirm their email before logging in.

## Create Your Shared Room

1. Open the app.
2. Create your account.
3. Create a prayer room.
4. Copy the invite code shown in the app.
5. Have your wife create her account.
6. She chooses **Join room** and enters the invite code.

After that, both accounts share the same prayer streak, prayer requests, and answered prayers.

## Deploy

### Option A: Netlify Drop

1. Make sure `config.js` has your Supabase URL and anon key.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag this whole `prayerstreaks` folder onto the page.
4. Netlify gives you a live URL.

### Option B: Vercel

1. Push this folder to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Choose this folder as the project root if prompted.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank or use `.`.
7. Deploy.

### Supabase URL Settings

After deployment, go to **Authentication > URL Configuration** in Supabase:

- Site URL: your deployed app URL
- Redirect URLs: add your deployed app URL and `http://localhost:4173`

## Files

- `index.html` - app layout
- `styles.css` - responsive design
- `app.js` - app logic, Supabase integration, demo mode
- `config.js` - your Supabase public config
- `supabase/schema.sql` - database tables, security policies, and helper functions
