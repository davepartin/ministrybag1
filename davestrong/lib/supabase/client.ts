import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasRealSupabaseUrl = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project")
);
const hasRealAnonKey = Boolean(
  supabaseAnonKey &&
    supabaseAnonKey !== "your-supabase-anon-key"
);

export const isSupabaseConfigured = hasRealSupabaseUrl && hasRealAnonKey;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
