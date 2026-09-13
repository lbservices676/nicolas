import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: newCount }, { count: catCount }, { count: prodCount }] = await Promise.all([
    supabase.from('devis_requests').select('*', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <>
      <div className="admin-header">
        <h1>Tableau de bord</h1>
      </div>

      <div className="values-grid" style={{ marginBottom: 32 }}>
        <div className="value-card">
          <div className="num">Devis</div>
          <h3 style={{ fontSize: 30, fontFamily: 'var(--f-display)' }}>{newCount ?? 0}</h3>
          <p>nouvelle(s) demande(s) à traiter</p>
          <Link href="/admin/devis" className="link-btn" style={{ marginTop: 10, display: 'inline-block' }}>Voir les demandes →</Link>
        </div>
        <div className="value-card">
          <div className="num">Univers</div>
          <h3 style={{ fontSize: 30, fontFamily: 'var(--f-display)' }}>{catCount ?? 0}</h3>
          <p>catégorie(s) de produits</p>
          <Link href="/admin/categories" className="link-btn" style={{ marginTop: 10, display: 'inline-block' }}>Gérer les univers →</Link>
        </div>
        <div className="value-card">
          <div className="num">Catalogue</div>
          <h3 style={{ fontSize: 30, fontFamily: 'var(--f-display)' }}>{prodCount ?? 0}</h3>
          <p>produit(s) au catalogue</p>
          <Link href="/admin/produits" className="link-btn" style={{ marginTop: 10, display: 'inline-block' }}>Gérer les produits →</Link>
        </div>
      </div>

      <p style={{ color: 'var(--steel)', fontSize: 14 }}>
        Astuce : pensez à traiter vos demandes de devis rapidement — vos clients reçoivent une confirmation
        mais ne savent pas où en est leur demande tant que vous ne les avez pas rappelés ou recontactés par email.
      </p>
    </>
  );
}
