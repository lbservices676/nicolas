import { createClient } from '@/lib/supabase/server';
import CategoriesManager from '@/components/CategoriesManager';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });

  return (
    <>
      <div className="admin-header">
        <h1>Univers produits</h1>
      </div>
      <CategoriesManager initialCategories={categories ?? []} />
    </>
  );
}
