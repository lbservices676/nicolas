'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const empty = { id: null, name: '', slug: '', description: '', icon: 'outillage', sort_order: 0, parent_id: '' };

const ICONS = ['outillage', 'epi', 'fixation', 'manutention', 'abrasifs', 'plomberie'];

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Trie la liste pour afficher chaque sous-catégorie juste après son parent
function sortHierarchy(categories) {
  const byParent = {};
  categories.forEach((c) => {
    const key = c.parent_id || 'root';
    if (!byParent[key]) byParent[key] = [];
    byParent[key].push(c);
  });
  const result = [];
  const walk = (parentKey, depth) => {
    (byParent[parentKey] || []).forEach((c) => {
      result.push({ ...c, depth });
      walk(c.id, depth + 1);
    });
  };
  walk('root', 0);
  return result;
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

  const onEdit = (cat) => { setForm({ ...cat, parent_id: cat.parent_id || '' }); setEditing(true); setStatus(null); };
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
      parent_id: form.parent_id || null,
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
    if (!confirm('Supprimer cet univers ? Les produits associés ne seront pas supprimés mais perdront leur catégorie. Ses éventuelles sous-catégories deviendront des univers principaux.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { setStatus({ ok: false, msg: `Erreur : ${error.message}` }); return; }
    refresh();
  };

  const sorted = sortHierarchy(categories);
  const topLevelOptions = categories.filter((c) => !c.parent_id && c.id !== form.id);

  return (
    <>
      <table className="admin-table" style={{ marginBottom: 32 }}>
        <thead>
          <tr><th>Ordre</th><th>Nom</th><th>Slug</th><th>Description</th><th></th></tr>
        </thead>
        <tbody>
          {sorted.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.sort_order}</td>
              <td style={{ paddingLeft: cat.depth > 0 ? 12 + cat.depth * 20 : undefined }}>
                {cat.depth > 0 && <span style={{ color: 'var(--steel)' }}>— </span>}
                {cat.name}
              </td>
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
            <label>Catégorie parente (optionnel — laisser vide pour un univers principal)</label>
            <select name="parent_id" value={form.parent_id} onChange={onChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 4, marginTop: 6 }}>
              <option value="">— Aucune, c&apos;est un univers principal —</option>
              {topLevelOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
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
