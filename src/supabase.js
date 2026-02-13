import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));



export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);