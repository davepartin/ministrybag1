# Tribe Game Calendar

A private availability calendar for Dave, Chris, Curtis, Brian, Silas, and Joel.

## Run It

Open `index.html` in a browser. Without Supabase keys, the app runs in local test mode and stores picks in the current browser only.

## Connect Supabase

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase.sql`.
3. Copy `app-config.example.js` into `app-config.js`, or edit the existing `app-config.js`.
4. Add your project URL and anon key:

```js
window.TRIBE_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT-REF.supabase.co",
  supabaseAnonKey: "YOUR-SUPABASE-ANON-KEY"
};
```

The calendar code is `tribe`. Each click toggles one person's availability for that day.

## Deploy

This is a static site, so it can be hosted on GitHub Pages, Netlify, Vercel, or any static hosting service. Keep `index.html`, `styles.css`, `app.js`, `app-config.js`, and the `assets` folder together.
