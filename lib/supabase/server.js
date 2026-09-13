import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Client Supabase utilisé dans les Server Components et les pages admin
// pour lire la session de connexion à partir des cookies.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // appelé depuis un Server Component : ignoré, le middleware gère le rafraîchissement
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // idem
          }
        },
      },
    }
  );
}
