'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!form.name || !form.email || !form.message) {
      setStatus({ ok: false, msg: 'Merci de renseigner votre nom, votre email et votre message.' });
      return;
    }

    setSending(true);
    try {
      const web3key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (!web3key) {
        setStatus({ ok: false, msg: "Le formulaire n'est pas encore configuré. Merci de nous appeler directement." });
        setSending(false);
        return;
      }
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3key,
          subject: 'Nouveau message — site LB Service',
          Nom: form.name,
          Email: form.email,
          Téléphone: form.phone,
          Message: form.message,
        }),
      });
      if (res.ok) {
        setStatus({ ok: true, msg: 'Message envoyé. Nous revenons vers vous sous 24h ouvrées.' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ ok: false, msg: "L'envoi a échoué. Vous pouvez aussi nous joindre par téléphone." });
      }
    } catch {
      setStatus({ ok: false, msg: "L'envoi a échoué. Vous pouvez aussi nous joindre par téléphone." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">Nom complet *</label>
          <input id="c-name" name="name" type="text" value={form.name} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="c-phone">Téléphone</label>
          <input id="c-phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="c-email">Email *</label>
          <input id="c-email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="c-message">Votre message *</label>
          <textarea id="c-message" name="message" value={form.message} onChange={onChange} required />
        </div>
      </div>
      <div className="form-foot">
        <p className="form-note">Pour une demande de devis produits, utilisez plutôt le panier.</p>
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
      </div>
      {status && <div className={`form-status show ${status.ok ? 'ok' : 'bad'}`} role="status">{status.msg}</div>}
    </form>
  );
}
