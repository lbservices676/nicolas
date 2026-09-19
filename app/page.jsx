import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import HomeQuoteForm from '@/components/HomeQuoteForm';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

const CURATED_BRANDS = ['Makita', 'Talia', 'Golz'];

function findSlug(categories, keywords) {
  const match = categories.find((c) =>
    keywords.some((k) => c.name.toLowerCase().includes(k))
  );
  return match ? `/produits#${match.slug}` : '/produits';
}

const CATEGORY_PHOTOS = [
  { keywords: ['outillage'], image: '/carousel/outillage.png' },
  { keywords: ['epi', 'sécurité', 'securite'], image: '/carousel/epi-securite.png' },
  { keywords: ['manutention'], image: '/carousel/manutention.png' },
  { keywords: ['consommable', 'matériaux', 'materiaux'], image: '/carousel/consommables.png' },
  { keywords: ['base vie', 'installation'], image: '/carousel/base-vie.png' },
];

function findCategoryImage(name) {
  const lower = name.toLowerCase();
  const match = CATEGORY_PHOTOS.find((c) => c.keywords.some((k) => lower.includes(k)));
  return match ? match.image : null;
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

  const { data: promoProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('on_promo', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return { categories: categories ?? [], featured: featured ?? [], promoProducts: promoProducts ?? [] };
}

export default async function HomePage() {
  const { categories, featured, promoProducts } = await getHomeData();

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

      <section style={{ background: '#fff', padding: '36px 0 4px' }}>
        <div className="wrap" style={{ maxWidth: 1600 }}>
          <ProductCarousel slides={carouselSlides} />
        </div>
      </section>

      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow" style={{ marginTop: 24, display: 'inline-flex' }}>Grossiste fournitures BTP &amp; TP</span>
            <h1>L&apos;équipement qui<br /><span className="accent">tient le chantier.</span></h1>
            <p className="lead">Outillage, EPI, fixation, manutention, abrasifs, plomberie et fournitures de chantier : LB Services accompagne les professionnels du BTP et du TP avec des produits adaptés à leurs besoins, au bon prix et livrés directement sur chantier.</p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,199,44,.4)',
              borderRadius: 6, padding: '10px 16px', marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yellow)', flex: 'none' }}></span>
              <span style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: 15 }}>
                Un seul interlocuteur pour vos besoins chantier.
              </span>
            </div>
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

      {promoProducts.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow" style={{ color: 'var(--orange)' }}>🔥 En ce moment</span>
                <h2>Bons plans</h2>
              </div>
              <Link href="/produits?promo=1" className="more" style={{ fontSize: 14 }}>Voir tous les bons plans →</Link>
            </div>
            <div className="prod-grid">
              {promoProducts.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          </div>
        </section>
      )}

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

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Nos univers</span>
              <h2>Tout pour vos chantiers</h2>
            </div>
            <p>Retrouvez nos principales familles de produits pour équiper vos équipes et vos chantiers.</p>
          </div>

          <div className="cat-grid">
            {categories.map((cat, i) => {
              const photo = findCategoryImage(cat.name);
              return (
                <div className="cat-card" key={cat.id}>
                  <div className="thumb" data-code={String(i + 1).padStart(2, '0')} style={photo ? { background: '#fff' } : undefined}>
                    {photo
                      ? <img src={photo} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="1.6">
                          <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8v8H8z" />
                        </svg>
                      )}
                  </div>
                  <div className="body">
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <Link href={`/produits#${cat.slug}`} className="more">Découvrir →</Link>
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p style={{ color: 'var(--steel)' }}>
                Aucun univers pour l&apos;instant — ajoutez-en depuis l&apos;espace admin.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="diff-band">
        <div className="wrap diff-band-inner">
          <div>
            <span className="eyebrow" style={{ color: 'var(--yellow)' }}>LB Service</span>
            <h2>Pas juste un catalogue.<br />Un vrai interlocuteur.</h2>
            <p>
              Chez LB Services, nous ne nous contentons pas de vous présenter un catalogue.
              Vous avez une référence à trouver, un besoin chantier à anticiper ou un budget à
              respecter&nbsp;? Nous recherchons la solution adaptée auprès de nos fabricants et partenaires.
            </p>
            <p>
              <strong>Notre objectif :</strong> vous faire gagner du temps et vous permettre de garder
              votre chantier en mouvement.
            </p>
            <Link href="/contact" className="btn btn--primary">Parler à LB Service</Link>
          </div>
          <div className="diff-contact-card">
            <a href="tel:0639294846">
              <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg></span>
              <span>06 39 29 48 46</span>
            </a>
            <a href="mailto:lbservices.idf@outlook.fr">
              <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
              <span>lbservices.idf@outlook.fr</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Comment ça marche</span>
              <h2>Votre besoin. Notre solution.</h2>
            </div>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3>Vous nous consultez</h3>
              <p>Par téléphone, e-mail ou directement depuis le site.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3>Nous recherchons</h3>
              <p>Nous identifions les produits et fabricants adaptés à votre besoin.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3>Vous recevez votre devis</h3>
              <p>Une proposition claire et chiffrée sous 24h ouvrées.</p>
            </div>
            <div className="step-card">
              <span className="step-num">04</span>
              <h3>Vous êtes livré</h3>
              <p>Livraison directement sur chantier ou en dépôt.</p>
            </div>
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

      <section className="section" id="devis" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap devis-cta-grid">
          <div>
            <span className="eyebrow">Demander un devis</span>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 30, textTransform: 'uppercase', margin: '14px 0 16px', lineHeight: 1.2 }}>
              Un besoin pour votre prochain chantier ?
            </h2>
            <p style={{ color: 'var(--steel)', maxWidth: '48ch' }}>
              Outillage, EPI, fixation, consommables ou équipement spécifique : envoyez-nous votre
              liste et nous vous préparons une proposition adaptée.
            </p>
          </div>
          <div className="form-card">
            <HomeQuoteForm />
          </div>
        </div>
      </section>

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
