import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/db";

export function serverSupabase() {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;
  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Variables SUPABASE_URL / SUPABASE_ANON_KEY manquantes",
    });
  }
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}
