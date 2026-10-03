import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailActions from '@/components/ProductDetailActions';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_ICON } from '@/lib/categoryIcons';

export const revalidate = 0;

async function getProduct(id) {
  const supabase = createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', id).eq('active', true).single();
  if (!product) return { product: null, category: null };
  const { data: category } = product.category_id
    ? await supabase.from('categories').select('*').eq('id', product.category_id).single()
    : { data: null };
  return { product, category };
}

export default async function ProductDetailPage({ params }) {
  const { product, category } = await getProduct(params.id);
  if (!product) notFound();

  return (
    <>
      <Header current="produits" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">
            <a href="/produits" style={{ color: 'inherit' }}>Accueil / Produits</a>
            {category ? <> / <a href={`/produits?category=${category.slug}`} style={{ color: 'inherit' }}>{category.name}</a></> : ''}
            {` / ${product.name}`}
          </span>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

          <div className="shot" style={{
            position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1/1',
            background: product.image_url ? '#fff' : 'var(--paper)',
            backgroundImage: product.image_url ? 'none' : 'repeating-linear-gradient(-45deg, var(--line) 0 10px, transparent 10px 20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {product.ref && <span className="ref">{product.ref}</span>}
            {product.on_promo && (
              <span style={{
                position: 'absolute', top: 12, right: 12, zIndex: 1,
                background: 'var(--orange)', color: '#fff', fontFamily: 'var(--f-mono)',
                fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase',
              }}>
                Promo
              </span>
            )}
            {product.image_url
              ? <img src={product.image_url} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: 64, height: 64 }}>{DEFAULT_ICON}</div>}
          </div>

          <div>
            {product.brand && (
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>
                {product.brand}
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, textTransform: 'uppercase', marginBottom: 10, lineHeight: 1.2 }}>
              {product.name}
            </h1>
            {product.spec && (
              <p style={{ color: 'var(--steel)', fontSize: 15, marginBottom: 20 }}>{product.spec}</p>
            )}

            <div style={{ marginBottom: 24 }}>
              {product.on_promo && product.old_price != null && (
                <span style={{ textDecoration: 'line-through', color: 'var(--steel)', fontSize: 18, marginRight: 10 }}>
                  {product.old_price} €
                </span>
              )}
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 30, color: product.on_promo ? 'var(--orange)' : 'var(--navy)' }}>
                {product.price != null ? `${product.price} €` : 'Prix sur devis'}
              </span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--steel)', textTransform: 'uppercase', marginLeft: 8 }}>
                HT / {product.unit || 'unité'}
              </span>
            </div>

            <ProductDetailActions product={product} />

            {product.description && (
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 16, textTransform: 'uppercase', marginBottom: 12 }}>
                  Description
                </h2>
                <p style={{ color: 'var(--steel)', fontSize: 15, lineHeight: 1.6 }}>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Une question sur ce produit ?</h2>
            <p>Notre équipe vous conseille sur le choix et la disponibilité.</p>
          </div>
          <Link href="/contact" className="btn btn--dark">Nous contacter →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
