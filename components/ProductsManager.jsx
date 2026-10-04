'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const empty = {
  id: null, category_id: '', name: '', ref: '', description: '',
  spec: '', price: '', unit: 'unité', active: true, sort_order: 0,
  images: [],
};

function slugifyFile(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.\-]+/g, '-');
}

export default function ProductsManager({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const refresh = async () => {
    const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    setProducts(data ?? []);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onEdit = (p) => {
    setForm({ ...p, price: p.price ?? '', images: Array.isArray(p.images) && p.images.length ? p.images : (p.image_url ? [p.image_url] : []) });
    setEditing(true);
    setStatus(null);
  };
  const onCancel = () => { setForm(empty); setEditing(false); };

  const onFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setStatus(null);
    const uploaded = [];
    for (const file of files) {
      const path = `produits/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugifyFile(file.name)}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) {
        setStatus({ ok: false, msg: `Erreur envoi photo "${file.name}" : ${error.message}` });
        continue;
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      if (data?.publicUrl) uploaded.push(data.publicUrl);
    }
    setForm((f) => ({ ...f, images: [...(f.images || []), ...uploaded] }));
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (idx, dir) => {
    setForm((f) => {
      const imgs = [...f.images];
      const target = idx + dir;
      if (target < 0 || target >= imgs.length) return f;
      [imgs[idx], imgs[target]] = [imgs[target], imgs[idx]];
      return { ...f, images: imgs };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.category_id) {
      setStatus({ ok: false, msg: 'Merci de choisir un univers pour ce produit.' });
      return;
    }
    const images = form.images || [];
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
      images,
      image_url: images[0] || null,
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
          <tr><th>Photo</th><th>Réf.</th><th>Nom</th><th>Univers</th><th>Prix HT</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          {visibleProducts.map((p) => {
            const thumb = (Array.isArray(p.images) && p.images[0]) || p.image_url;
            return (
              <tr key={p.id}>
                <td>
                  {thumb ? (
                    <img src={thumb} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--line)' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 4, border: '1px dashed var(--line)' }} />
                  )}
                </td>
                <td style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>{p.ref ||
