// Supabase settings (reader accounts and comments), set in Vercel.
// Until they are set, sign-in and comments stay switched off.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = supabaseUrl !== "" && supabaseKey !== "";
