'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const empty = { id: null, name: '', slug: '', description: '', icon: 'outillage', sort_order: 0 };

const ICONS = ['outillage', 'epi', 'fixation', 'manutention', 'abrasifs', 'plomberie'];

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoriesManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const supabase = createClient();

  const refresh = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    setCategories(data ?? []);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === 'name' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const onEdit = (cat) => { setForm(cat); setEditing(true); setStatus(null); };
  const onCancel = () => { setForm(empty); setEditing(false); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      icon: form.icon,
      sort_order: Number(form.sort_order) || 0,
    };

    const { error } = editing
      ? await supabase.from('categories').update(payload).eq('id', form.id)
      : await supabase.from('categories').insert(payload);

    if (error) {
      setStatus({ ok: false, msg: `Erreur : ${error.message}` });
      return;
    }
    setStatus({ ok: true, msg: editing ? 'Univers mis à jour.' : 'Univers ajouté.' });
    setForm(empty);
    setEditing(false);
    refresh();
  };

  const onDelete = async (id) => {
    if (!confirm('Supprimer cet univers ? Les produits associés ne seront pas supprimés mais perdront leur catégorie.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { setStatus({ ok: false, msg: `Erreur : ${error.message}` }); return; }
    refresh();
  };

  return (
    <>
      <table className="admin-table" style={{ marginBottom: 32 }}>
        <thead>
          <tr><th>Ordre</th><th>Nom</th><th>Slug</th><th>Description</th><th></th></tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.sort_order}</td>
              <td>{cat.name}</td>
              <td style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>{cat.slug}</td>
              <td style={{ maxWidth: 320 }}>{cat.description}</td>
              <td>
                <div className="admin-actions">
                  <button type="button" className="link-btn" onClick={() => onEdit(cat)}>Modifier</button>
                  <button type="button" className="link-btn danger" onClick={() => onDelete(cat.id)}>Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr><td colSpan={5} style={{ color: 'var(--steel)' }}>Aucun univers pour l&apos;instant.</td></tr>
          )}
        </tbody>
      </table>

      <div className="admin-form">
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: 18, textTransform: 'uppercase', marginBottom: 16 }}>
          {editing ? 'Modifier un univers' : 'Ajouter un univers'}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Nom *</label>
            <input name="name" value={form.name} onChange={onChange} required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
          </div>
          <div className="field">
            <label>Identifiant URL (slug)</label>
            <input name="slug" value={form.slug} onChange={onChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
          </div>
          <div className="field">
            <label>Description courte</label>
            <textarea name="description" value={form.description || ''} onChange={onChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6, minHeight: 70 }} />
          </div>
          <div className="field">
            <label>Icône</label>
            <select name="icon" value={form.icon} onChange={onChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }}>
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Ordre d&apos;affichage</label>
            <input name="sort_order" type="number" value={form.sort_order} onChange={onChange}
              style={{ width: 120, padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }} />
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
