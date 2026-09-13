import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoMark from '@/components/LogoMark';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Filet de sécurité en plus du middleware : si jamais pas de session, on renvoie au login.
  if (!session) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="logo">
          <LogoMark size={34} />
          <span className="word" style={{ fontSize: 16 }}>LB SERVICE<small>ESPACE PRO</small></span>
        </Link>
        <nav>
          <Link href="/admin">Tableau de bord</Link>
          <Link href="/admin/categories">Univers produits</Link>
          <Link href="/admin/produits">Produits</Link>
          <Link href="/admin/devis">Demandes de devis</Link>
          <Link href="/" target="_blank">Voir le site public →</Link>
        </nav>
        <SignOutButton />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
