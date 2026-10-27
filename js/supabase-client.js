const SUPABASE_URL = "https://dsdthxypnyhowwcqembj.supabase.co";
// IMPORTANTE: aquí va la clave "anon" / "publishable" (Project Settings > API).
// NUNCA la "service_role": esa clave salta todas las reglas RLS y no debe
// estar en el navegador ni en el repositorio.
const SUPABASE_ANON_KEY = "PEGA_AQUI_TU_ANON_KEY";
const sup = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
