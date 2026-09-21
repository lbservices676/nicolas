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
  const categorySlug = searchParams?.category?.trim() || '';
  const { categories: allCategories, products } = await getData(q, brand, promo);

  const topLevel = allCategories.filter((c) => !c.parent_id);
  const childrenOf = (id) => allCategories.filter((c) => c.parent_id === id);
  const selectedCategory = categorySlug ? allCategories.find((c) => c.slug === categorySlug) : null;
  const parentOfSelected = selectedCategory?.parent_id
    ? allCategories.find((c) => c.id === selectedCategory.parent_id)
    : null;
  const hasFilter = !!(q || brand || promo || categorySlug);

  // Détermine quelles catégories "de premier niveau" afficher, et quels produits leur associer
  let sections;
  if (selectedCategory) {
    const kids = childrenOf(selectedCategory.id);
    const ids = [selectedCategory.id, ...kids.map((k) => k.id)];
    sections = [{ category: selectedCategory, subcats: kids, productIds: ids }];
  } else {
    sections = topLevel.map((cat) => {
      const kids = childrenOf(cat.id);
      return { category: cat, subcats: kids, productIds: [cat.id, ...kids.map((k) => k.id)] };
    });
  }

  const noResults = hasFilter && sections.every((s) => products.filter((p) => s.productIds.includes(p.category_id)).length === 0);

  return (
    <>
      <Header current="produits" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">
            <a href="/produits" style={{ color: 'inherit' }}>Accueil / Produits</a>
            {parentOfSelected ? ` / ${parentOfSelected.name} / ${selectedCategory.name}` : selectedCategory ? ` / ${selectedCategory.name}` : ''}
          </span>
          <h1>
            {promo ? '🔥 Nos bons plans' : selectedCategory ? selectedCategory.name : 'Le catalogue LB Service'}
          </h1>
          <p>
            {promo
              ? 'Une sélection de produits en promotion ou en déstockage, pour un temps limité.'
              : selectedCategory
              ? (selectedCategory.description || `Tous les produits de l'univers ${selectedCategory.name}.`)
              : brand
              ? `Produits de la marque ${brand}`
              : q
              ? `Résultats pour « ${q} »`
              : 'Nos univers, mis à jour directement par notre équipe. Prix indicatifs HT — ajoutez au panier pour recevoir un devis chiffré.'}
          </p>
          {selectedCategory && (
            <a href="/produits" style={{ color: 'var(--yellow)', fontSize: 13.5, display: 'inline-block', marginTop: 10 }}>
              ← Voir tout le catalogue
            </a>
          )}
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap">

          {categorySlug && !selectedCategory && (
            <p style={{ marginBottom: 32, color: 'var(--steel)' }}>
              Cet univers n&apos;existe plus. <a href="/produits" style={{ color: 'var(--orange)' }}>Voir tout le catalogue</a>.
            </p>
          )}

          {noResults && (
            <p style={{ marginBottom: 32, color: 'var(--steel)' }}>
              Aucun produit ne correspond à votre recherche. <a href="/produits" style={{ color: 'var(--orange)' }}>Voir tout le catalogue</a>.
            </p>
          )}

          {sections.map(({ category, subcats, productIds }) => {
            const sectionProducts = products.filter((p) => productIds.includes(p.category_id));
            if (hasFilter && sectionProducts.length === 0) return null;
            return (
              <div className="cat-block" id={category.slug} key={category.id}>
                {!selectedCategory && (
                  <div className="cat-block-head">
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                  </div>
                )}

                {subcats.length > 0 && (
                  <div className="filters" style={{ marginBottom: 24 }}>
                    {subcats.map((sc) => (
                      <a key={sc.id} href={`/produits?category=${sc.slug}`} className="chip">{sc.name}</a>
                    ))}
                  </div>
                )}

                {sectionProducts.length > 0 ? (
                  <div className="prod-grid">
                    {sectionProducts.map((p) => <ProductCard product={p} key={p.id} />)}
                  </div>
                ) : (
                  !hasFilter && <p style={{ color: 'var(--steel)', fontSize: 14 }}>Aucun produit publié pour l&apos;instant dans cet univers.</p>
                )}
              </div>
            );
          })}

          {allCategories.length === 0 && (
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
