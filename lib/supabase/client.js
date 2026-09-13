import { createBrowserClient } from '@supabase/ssr';

// Client Supabase utilisé dans les composants "use client"
// (panier, formulaires, pages admin après connexion)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
