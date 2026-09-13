'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { createClient } from '@/lib/supabase/client';

export default function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, ready } = useCart();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // { ok: bool, msg: string }
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (items.length === 0) {
      setStatus({ ok: false, msg: 'Votre panier est vide — ajoutez au moins un produit avant de demander un devis.' });
      return;
    }
    if (!form.name || !form.email) {
      setStatus({ ok: false, msg: 'Merci de renseigner au moins votre nom et votre email.' });
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();

      const { data: devis, error: devisError } = await supabase
        .from('devis_requests')
        .insert({
          name: form.name,
          company: form.company || null,
          email: form.email,
          phone: form.phone || null,
          message: form.message || null,
        })
        .select()
        .single();

      if (devisError) throw devisError;

      const rows = items.map((i) => ({
        devis_request_id: devis.id,
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
      }));
      const { error: itemsError } = await supabase.from('devis_items').insert(rows);
      if (itemsError) throw itemsError;

      // Notification email immédiate (facultatif — nécessite une clé Web3Forms, voir README)
      const web3key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (web3key) {
        const summary = items.map((i) => `- ${i.name} × ${i.quantity}`).join('\n');
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3key,
            subject: 'Nouvelle demande de devis — site LB Service',
            Nom: form.name,
            Entreprise: form.company,
            Email: form.email,
            Téléphone: form.phone,
            Panier: summary,
            Message: form.message,
          }),
        }).catch(() => {});
      }

      setStatus({ ok: true, msg: 'Demande envoyée ! Nous vous recontactons sous 24h ouvrées, par email ou par téléphone.' });
      clearCart();
      setForm({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, msg: "L'envoi a échoué. Vous pouvez aussi nous joindre directement par téléphone ou par email." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header current="panier" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">Accueil / Panier</span>
          <h1>Votre demande de devis</h1>
          <p>Ajustez les quantités si besoin, puis envoyez-nous votre demande : nous revenons vers vous avec un devis chiffré et vous appelons si besoin de précisions.</p>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap contact-grid">
          <div>
            {!ready ? null : items.length === 0 ? (
              <div className="cart-empty">
                <p>Votre panier est vide pour l&apos;instant.</p>
                <p><Link href="/produits">Parcourir le catalogue →</Link></p>
              </div>
            ) : (
              <table className="cart-table">
                <thead>
                  <tr><th>Produit</th><th>Quantité</th><th></th></tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td>{i.name}{i.ref ? <span style={{ color: 'var(--steel)', fontFamily: 'var(--f-mono)', fontSize: 12 }}> · {i.ref}</span> : null}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="qty-input"
                          value={i.quantity}
                          onChange={(e) => updateQuantity(i.id, parseInt(e.target.value || '1', 10))}
                        />
                      </td>
                      <td><button type="button" className="rm-btn" onClick={() => removeItem(i.id)}>Retirer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="form-card">
            <h3>Vos coordonnées</h3>
            <p className="sub">Champs marqués * obligatoires. On vous répond par email ou par téléphone, comme vous préférez.</p>

            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Nom complet *</label>
                  <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />
                </div>
                <div className="field">
                  <label htmlFor="company">Entreprise</label>
                  <input id="company" name="company" type="text" value={form.company} onChange={onChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                  <label htmlFor="phone">Téléphone</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="Pour qu'on vous appelle si besoin" />
                </div>
              </div>
              <div className="form-row">
                <div className="field full">
                  <label htmlFor="message">Précisions (délai, adresse de livraison…)</label>
                  <textarea id="message" name="message" value={form.message} onChange={onChange} />
                </div>
              </div>
              <div className="form-foot">
                <p className="form-note">Votre demande et le contenu du panier nous sont transmis directement.</p>
                <button type="submit" className="btn btn--primary" disabled={sending}>
                  {sending ? 'Envoi en cours…' : 'Envoyer ma demande de devis'}
                </button>
              </div>
              {status && (
                <div className={`form-status show ${status.ok ? 'ok' : 'bad'}`} role="status">{status.msg}</div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
