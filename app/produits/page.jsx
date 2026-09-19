import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

async function getData(q, brand, promo) {
  const supabase = createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  let productsQuery = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (q) {
    productsQuery = productsQuery.or(`name.ilike.%${q}%,ref.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (brand) {
    productsQuery = productsQuery.eq('brand', brand);
  }
  if (promo) {
    productsQuery = productsQuery.eq('on_promo', true);
  }

  const { data: products, error } = await productsQuery;
  if (error) console.error('Erreur chargement produits :', error.message);

  return { categories: categories ?? [], products: products ?? [] };
}

export default async function ProduitsPage({ searchParams }) {
  const q = searchParams?.q?.trim() || '';
  const brand = searchParams?.brand?.trim() || '';
  const promo = searchParams?.promo === '1';
  const { categories, products } = await getData(q, brand, promo);

  return (
    <>
      <Header current="produits" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">Accueil / Produits</span>
          <h1>{promo ? '🔥 Nos bons plans' : 'Le catalogue LB Service'}</h1>
          <p>
            {promo
              ? 'Une sélection de produits en promotion ou en déstockage, pour un temps limité.'
              : brand
              ? `Produits de la marque ${brand}`
              : q
              ? `Résultats pour « ${q} »`
              : 'Nos univers, mis à jour directement par notre équipe. Prix indicatifs HT — ajoutez au panier pour recevoir un devis chiffré.'}
          </p>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap">

          {(q || brand || promo) && products.length === 0 && (
            <p style={{ marginBottom: 32, color: 'var(--steel)' }}>
              Aucun produit ne correspond à votre recherche. <a href="/produits" style={{ color: 'var(--orange)' }}>Voir tout le catalogue</a>.
            </p>
          )}

          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.category_id === cat.id);
            if ((q || brand || promo) && catProducts.length === 0) return null;
            return (
              <div className="cat-block" id={cat.slug} key={cat.id}>
                <div className="cat-block-head">
                  <h2>{cat.name}</h2>
                  <p>{cat.description}</p>
                </div>
                {catProducts.length > 0 ? (
                  <div className="prod-grid">
                    {catProducts.map((p) => <ProductCard product={p} key={p.id} />)}
                  </div>
                ) : (
                  !q && !brand && !promo && <p style={{ color: 'var(--steel)', fontSize: 14 }}>Aucun produit publié pour l&apos;instant dans cet univers.</p>
                )}
              </div>
            );
          })}

          {categories.length === 0 && (
            <p style={{ color: 'var(--steel)' }}>
              Aucune catégorie pour l&apos;instant — ajoutez-en depuis l&apos;espace admin.
            </p>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Une référence introuvable dans le catalogue ?</h2>
            <p>Notre équipe se procure aussi les produits hors gamme sur demande.</p>
          </div>
          <a href="/contact" className="btn btn--dark">Nous contacter →</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
