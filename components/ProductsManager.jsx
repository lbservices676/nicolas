'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const empty = {
  id: null, category_id: '', name: '', ref: '', description: '',
  spec: '', price: '', unit: 'unité', active: true, sort_order: 0,
};

export default function ProductsManager({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  const refresh = async () => {
    const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    setProducts(data ?? []);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onEdit = (p) => { setForm({ ...p, price: p.price ?? '' }); setEditing(true); setStatus(null); };
  const onCancel = () => { setForm(empty); setEditing(false); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.category_id) {
      setStatus({ ok: false, msg: 'Merci de choisir un univers pour ce produit.' });
      return;
    }
    const payload = {
      category_id: form.category_id,
      name: form.name,
      ref: form.ref || null,
      description: form.description || null,
      spec: form.spec || null,
      price: form.price === '' ? null : Number(form.price),
      unit: form.unit || 'unité',
      active: !!form.active,
      sort_order: Number(form.sort_order) || 0,
    };

    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert(payload);

    if (error) { setStatus({ ok: false, msg: `Erreur : ${error.message}` }); return; }
    setStatus({ ok: true, msg: editing ? 'Produit mis à jour.' : 'Produit ajouté.' });
    setForm(empty);
    setEditing(false);
    refresh();
  };

  const onDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { setStatus({ ok: false, msg: `Erreur : ${error.message}` }); return; }
    refresh();
  };

  const visibleProducts = filter === 'all' ? products : products.filter((p) => p.category_id === filter);
  const catName = (id) => categories.find((c) => c.id === id)?.name || '—';

  return (
    <>
      <div className="filters" style={{ marginBottom: 20 }}>
        <button type="button" className={`chip ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>Tous</button>
        {categories.map((c) => (
          <button key={c.id} type="button" className={`chip ${filter === c.id ? 'is-active' : ''}`} onClick={() => setFilter(c.id)}>{c.name}</button>
        ))}
      </div>

      <table className="admin-table" style={{ marginBottom: 32 }}>
        <thead>
          <tr><th>Réf.</th><th>Nom</th><th>Univers</th><th>Prix HT</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          {visibleProducts.map((p) => (
            <tr key={p.id}>
              <td style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>{p.ref || '—'}</td>
              <td>{p.name}</td>
              <td>{catName(p.category_id)}</td>
              <td>{p.price != null ? `${p.price} €` : '—'}</td>
              <td><span className={`status-pill ${p.active ? 'traite' : 'en-cours'}`}>{p.active ? 'Publié' : 'Masqué'}</span></td>
              <td>
                <div className="admin-actions">
                  <button type="button" className="link-btn" onClick={() => onEdit(p)}>Modifier</button>
                  <button type="button" className="link-btn danger" onClick={() => onDelete(p.id)}>Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
          {visibleProducts.length === 0 && (
            <tr><td colSpan={6} style={{ color: 'var(--steel)' }}>Aucun produit dans cette sélection.</td></tr>
          )}
        </tbody>
      </table>

      <div className="admin-form" style={{ maxWidth: 760 }}>
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18, textTransform: 'uppercase', marginBottom: 16 }}>
          {editing ? 'Modifier un produit' : 'Ajouter un produit'}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Nom du produit *</label>
              <input name="name" value={form.name} onChange={onChange} required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
            </div>
            <div className="field">
              <label>Univers *</label>
              <select name="category_id" value={form.category_id} onChange={onChange} required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }}>
                <option value="">— Choisir —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Référence</label>
              <input name="ref" value={form.ref || ''} onChange={onChange} placeholder="Ex: REF-014"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
            </div>
            <div className="field">
              <label>Caractéristiques courtes</label>
              <input name="spec" value={form.spec || ''} onChange={onChange} placeholder="Ex: 18V · 2 batteries"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Prix HT (€)</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={onChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
            </div>
            <div className="field">
              <label>Unité</label>
              <input name="unit" value={form.unit} onChange={onChange} placeholder="unité, boîte, lot…"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" value={form.description || ''} onChange={onChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6, minHeight: 70 }} />
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="active" name="active" checked={form.active} onChange={onChange} />
            <label htmlFor="active" style={{ margin: 0 }}>Visible sur le site public</label>
          </div>

          {status && <div className={`form-status show ${status.ok ? 'ok' : 'bad'}`}>{status.msg}</div>}
          <div className="admin-actions" style={{ marginTop: 16 }}>
            <button type="submit" className="btn btn--primary">{editing ? 'Enregistrer' : 'Ajouter'}</button>
            {editing && <button type="button" className="btn btn--ghost" onClick={onCancel} style={{ color: 'var(--navy)', borderColor: 'var(--line)' }}>Annuler</button>}
          </div>
        </form>
      </div>
    </>
  );
}
