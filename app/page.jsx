import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import { CATEGORY_ICONS, DEFAULT_ICON } from '@/lib/categoryIcons';

export const revalidate = 0;

async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Erreur chargement catégories :', error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Header current="accueil" />

      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Grossiste fournitures BTP &amp; TP</span>
            <h1>L&apos;équipement qui<br /><span className="accent">tient le chantier.</span></h1>
            <p className="lead">Outillage, EPI, fixation, manutention, abrasifs et plomberie : tout le matériel professionnel dont vos équipes ont besoin, livré sur chantier sous 48h.</p>
            <div className="cta-row">
              <Link href="/produits" className="btn btn--primary">Voir les produits</Link>
              <Link href="/contact" className="btn btn--ghost">Demander un devis</Link>
            </div>
            <div className="hero-stats">
              <div><b>{categories.length || 6}</b><span>Univers produits</span></div>
              <div><b>48H</b><span>Livraison chantier</span></div>
              <div><b>100%</b><span>Pro BTP &amp; TP</span></div>
            </div>
          </div>
          <div className="hero-plate">
            <span className="tag">Pourquoi LB Service</span>
            <ul>
              <li><span className="dot"></span>Stock permanent sur les références les plus utilisées</li>
              <li><span className="dot"></span>Devis chiffré sous 24h ouvrées</li>
              <li><span className="dot"></span>Un interlocuteur unique pour tout le chantier</li>
              <li><span className="dot"></span>Livraison directe sur site ou en dépôt</li>
            </ul>
          </div>
        </div>
      </section>
      <div className="hazard"></div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2>Nos univers produits</h2>
            </div>
            <p>Un catalogue tenu à jour directement par notre équipe — de la visserie au levage.</p>
          </div>

          <div className="cat-grid">
            {categories.map((cat, i) => (
              <div className="cat-card" key={cat.id}>
                <div className="thumb" data-code={String(i + 1).padStart(2, '0')}>
                  {(CATEGORY_ICONS[cat.icon] || DEFAULT_ICON)}
                </div>
                <div className="body">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <Link href={`/produits#${cat.slug}`} className="more">Voir la gamme →</Link>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p style={{ color: 'var(--steel)' }}>
                Aucun univers pour l&apos;instant — ajoutez vos premières catégories depuis l&apos;espace admin.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="trust-bar">
        <div className="wrap">
          <div className="item"><b>1200+</b><span>Références en stock</span></div>
          <div className="item"><b>48H</b><span>Délai de livraison moyen</span></div>
          <div className="item"><b>24H</b><span>Réponse devis</span></div>
          <div className="item"><b>7J/7</b><span>Suivi de commande</span></div>
        </div>
      </div>

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Un chantier à approvisionner ?</h2>
            <p>Ajoutez vos produits au panier et envoyez-nous votre demande : nous revenons vers vous avec un devis chiffré sous 24h.</p>
          </div>
          <Link href="/produits" className="btn btn--dark">Constituer ma demande →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
