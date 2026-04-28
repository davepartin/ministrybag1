# Pray Together

A private prayer web app for couples, families, and small groups to:

- mark that you prayed together today
- track your current streak, longest streak, and total prayer days
- add and delete shared prayer requests
- move current requests into answered prayers
- add answered prayers directly
- start or join multiple prayer rooms
- switch between prayer rooms after signing in
- delete prayer rooms you created after a double-check confirmation

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
3. For the easiest private setup, you can temporarily turn off email confirmations while creating accounts.
4. After everyone has created an account, you can turn confirmations back on.

If email confirmation is enabled, each person must confirm their email before logging in.

## Create Or Join A Prayer Room

1. Open the app.
2. Choose **Create account** if you are new, or **Log in** if you already have an account.
3. After signing in, choose **Create room** to start a room or **Join room** to enter someone else's invite code.
4. Copy the invite code from the room panel.
5. Have the people you want to invite create their accounts.
6. They choose **Join room** and enter the invite code.

After that, everyone in the room shares the same prayer streak, prayer requests, and answered prayers. If you belong to more than one room, use the room switcher or **Manage rooms** to choose which one you are viewing.

Room creators can delete a room from **Manage rooms**. The app asks for confirmation before deleting because this permanently removes the room's streak days, prayer requests, answered prayers, invite code, and memberships.

## Deploy

### Option A: Netlify Drop

1. Make sure `config.js` has your Supabase URL and anon key.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag this whole `praytogether` folder onto the page.
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
- Redirect URLs: add your deployed app URL, such as `https://ministrybag.com/praytogether/`, and `http://localhost:4173`

## Files

- `index.html` - app layout
- `styles.css` - responsive design
- `app.js` - app logic, Supabase integration, demo mode
- `config.js` - your Supabase public config
- `supabase/schema.sql` - database tables, security policies, and helper functions
