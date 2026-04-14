import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Keep explicit runtime error so misconfiguration is obvious in demos.
  // Do not throw at import time to avoid blank screens in non-auth routes.
  console.warn("Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

