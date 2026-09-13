import { createClient } from '@/lib/supabase/server';
import ProductsManager from '@/components/ProductsManager';

export default async function AdminProduitsPage() {
  const supabase = createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('sort_order', { ascending: true }),
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
  ]);

  return (
    <>
      <div className="admin-header">
        <h1>Produits</h1>
      </div>
      <ProductsManager initialProducts={products ?? []} categories={categories ?? []} />
    </>
  );
}
