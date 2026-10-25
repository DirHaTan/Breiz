import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

// A Supabase connection with full rights, for the server only (the Stripe
// webhook and checkout). It uses SUPABASE_SERVICE_ROLE_KEY, which bypasses
// the database rules, so it must never reach the browser.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
