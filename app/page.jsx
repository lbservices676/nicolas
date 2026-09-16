import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

const CURATED_BRANDS = ['Makita', 'Talia', 'Golz'];

function findSlug(categories, keywords) {
  const match = categories.find((c) =>
    keywords.some((k) => c.name.toLowerCase().includes(k))
  );
  return match ? `/produits#${match.slug}` : '/produits';
}

async function getHomeData() {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(6);

  return { categories: categories ?? [], featured: featured ?? [] };
}

export default async function HomePage() {
  const { categories, featured } = await getHomeData();

  const carouselSlides = [
    {
      type: 'image', image: '/carousel/outillage.png',
      title: 'Outillage', text: 'Des outils performants pour un travail efficace.',
      href: findSlug(categories, ['outillage']),
    },
    {
      type: 'image', image: '/carousel/epi-securite.png',
      title: 'EPI & Sécurité', text: 'Protégez vos équipes sur tous vos chantiers.',
      href: findSlug(categories, ['epi', 'sécurité', 'securite']),
    },
    {
      type: 'image', image: '/carousel/manutention.png',
      title: 'Manutention', text: 'Gagnez en efficacité sur vos chantiers.',
      href: findSlug(categories, ['manutention']),
    },
    {
      type: 'image', image: '/carousel/consommables.png',
      title: 'Matériaux & Consommables', text: "Tout ce qu'il vous faut pour avancer.",
      href: findSlug(categories, ['consommable', 'matériaux', 'materiaux']),
    },
    {
      type: 'image', image: '/carousel/base-vie.png',
      title: 'Base Vie', text: 'Des solutions pour des chantiers bien organisés.',
      href: findSlug(categories, ['base vie', 'installation']),
    },
    {
      type: 'cta',
      eyebrow: 'LB Service',
      title: 'Vous cherchez une référence ?',
      text: 'Envoyez-nous votre besoin, nous recherchons la solution adaptée auprès de nos fabricants et partenaires.',
      cta: 'Demander un devis',
      href: '/contact',
    },
  ];

  return (
    <>
      <Header current="accueil" />

      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Grossiste fournitures BTP &amp; TP</span>
            <h1>L&apos;équipement qui<br /><span className="accent">tient le chantier.</span></h1>
            <p className="lead">Outillage, EPI, fixation, manutention, abrasifs, plomberie et fournitures de chantier : LB Services accompagne les professionnels du BTP et du TP avec des produits adaptés à leurs besoins, au bon prix et livrés directement sur chantier.</p>
            <p style={{ color: 'var(--yellow)', fontWeight: 600, marginTop: '-16px', marginBottom: 28, fontSize: 15 }}>
              Un seul interlocuteur pour vos besoins chantier.
            </p>
            <div className="cta-row">
              <Link href="/produits" className="btn btn--primary">Voir nos produits</Link>
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
              <span className="eyebrow">Nos produits &amp; solutions</span>
              <h2>Tout pour vos chantiers</h2>
            </div>
            <p>Une sélection de nos univers phares — cliquez pour découvrir les produits associés.</p>
          </div>
          <ProductCarousel slides={carouselSlides} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Nos marques</span>
              <h2>{featured.length > 0 ? 'Produits phares' : 'Des marques que vous connaissez'}</h2>
            </div>
            <p>
              {featured.length > 0
                ? 'Une sélection de références disponibles chez les plus grandes marques du secteur.'
                : 'Nous distribuons des références des plus grandes marques du secteur BTP & TP.'}
            </p>
          </div>

          {featured.length > 0 ? (
            <div className="cat-grid">
              {featured.map((p) => (
                <div className="cat-card" key={p.id}>
                  <div className="thumb" style={{ background: '#fff' }}>
                    <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  </div>
                  <div className="body">
                    {p.brand && (
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4, display: 'block' }}>
                        {p.brand}
                      </span>
                    )}
                    <h3>{p.name}</h3>
                    <p>{p.spec || p.description}</p>
                    <Link href="/produits" className="more">Voir sur le catalogue →</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16, background: 'var(--paper-2)',
              border: '1px solid var(--line)', borderRadius: 8, padding: '32px 28px',
            }}>
              {CURATED_BRANDS.map((brand) => (
                <div key={brand} style={{
                  flex: '1 1 180px', textAlign: 'center', padding: '22px 16px',
                  border: '1px solid var(--line)', borderRadius: 6, background: '#fff',
                }}>
                  <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 22, color: 'var(--navy)', textTransform: 'uppercase' }}>
                    {brand}
                  </span>
                </div>
              ))}
              <p style={{ flexBasis: '100%', color: 'var(--steel)', fontSize: 13, marginTop: 8 }}>
                Ajoutez des photos à vos produits phares depuis l&apos;espace admin pour les voir apparaître ici automatiquement.
              </p>
            </div>
          )}
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
