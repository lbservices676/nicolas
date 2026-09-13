'use client';

import { Fragment, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const STATUS_LABELS = { nouveau: 'Nouveau', 'en-cours': 'En cours', traite: 'Traité' };

export default function DevisManager({ initialRequests, itemsByRequest }) {
  const [requests, setRequests] = useState(initialRequests);
  const [openId, setOpenId] = useState(null);
  const supabase = createClient();

  const setStatus = async (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from('devis_requests').update({ status }).eq('id', id);
  };

  return (
    <table className="admin-table">
      <thead>
        <tr><th>Date</th><th>Client</th><th>Contact</th><th>Articles</th><th>Statut</th><th></th></tr>
      </thead>
      <tbody>
        {requests.map((r) => {
          const items = itemsByRequest[r.id] || [];
          const isOpen = openId === r.id;
          return (
            <Fragment key={r.id}>
              <tr>
                <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--f-mono)', fontSize: 12 }}>
                  {new Date(r.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>{r.name}{r.company ? <><br /><span style={{ color: 'var(--steel)', fontSize: 12.5 }}>{r.company}</span></> : null}</td>
                <td style={{ fontSize: 13 }}>
                  <div>{r.email}</div>
                  {r.phone && <div style={{ color: 'var(--steel)' }}>{r.phone}</div>}
                </td>
                <td>{items.length} article{items.length > 1 ? 's' : ''}</td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                    className={`status-pill ${r.status === 'nouveau' ? 'nouveau' : r.status === 'en-cours' ? 'en-cours' : 'traite'}`}
                    style={{ border: 'none', fontFamily: 'var(--f-mono)' }}
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td>
                  <button type="button" className="link-btn" onClick={() => setOpenId(isOpen ? null : r.id)}>
                    {isOpen ? 'Masquer' : 'Détail'}
                  </button>
                </td>
              </tr>
              {isOpen && (
                <tr>
                  <td colSpan={6} style={{ background: 'var(--paper)' }}>
                    <div style={{ padding: '10px 4px' }}>
                      <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, textTransform: 'uppercase', color: 'var(--steel)', marginBottom: 8 }}>Panier demandé</p>
                      <ul style={{ marginBottom: 12, paddingLeft: 18, listStyle: 'disc' }}>
                        {items.map((it) => <li key={it.id}>{it.product_name} × {it.quantity}</li>)}
                        {items.length === 0 && <li style={{ color: 'var(--steel)' }}>Aucun article (demande envoyée sans panier).</li>}
                      </ul>
                      {r.message && (
                        <>
                          <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, textTransform: 'uppercase', color: 'var(--steel)', marginBottom: 6 }}>Message</p>
                          <p style={{ marginBottom: 12 }}>{r.message}</p>
                        </>
                      )}
                      <div className="admin-actions">
                        <a className="btn btn--dark" href={`mailto:${r.email}`}>Répondre par email</a>
                        {r.phone && <a className="btn btn--ghost" style={{ color: 'var(--navy)', borderColor: 'var(--line)' }} href={`tel:${r.phone}`}>Appeler {r.phone}</a>}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
        {requests.length === 0 && (
          <tr><td colSpan={6} style={{ color: 'var(--steel)' }}>Aucune demande de devis pour l&apos;instant.</td></tr>
        )}
      </tbody>
    </table>
  );
}
