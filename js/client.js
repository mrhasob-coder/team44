// One Supabase client for every page, so later stories reuse it instead of creating their own.
const isConfigured = !SUPABASE_URL.startsWith("PASTE") && !SUPABASE_ANON_KEY.startsWith("PASTE");
const db = isConfigured ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
