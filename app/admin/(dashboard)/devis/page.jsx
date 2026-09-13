import { createClient } from '@/lib/supabase/server';
import DevisManager from '@/components/DevisManager';

export default async function AdminDevisPage() {
  const supabase = createClient();

  const { data: requests } = await supabase
    .from('devis_requests')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: items } = await supabase
    .from('devis_items')
    .select('*');

  const itemsByRequest = {};
  (items ?? []).forEach((it) => {
    if (!itemsByRequest[it.devis_request_id]) itemsByRequest[it.devis_request_id] = [];
    itemsByRequest[it.devis_request_id].push(it);
  });

  return (
    <>
      <div className="admin-header">
        <h1>Demandes de devis</h1>
      </div>
      <DevisManager initialRequests={requests ?? []} itemsByRequest={itemsByRequest} />
    </>
  );
}
