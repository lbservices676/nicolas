'use client';

import { useState } from 'react';

export default function HomeQuoteForm() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name || !form.email || !form.message) {
      setStatus({ ok: false, msg: 'Merci de renseigner au moins votre nom, votre email et votre besoin.' });
      return;
    }

    const web3key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!web3key) {
      setStatus({ ok: false, msg: "Le formulaire n'est pas encore configuré. Merci de nous appeler directement au 06 39 29 48 46." });
      return;
    }

    setSending(true);
    try {
      const data = new FormData();
      data.append('access_key', web3key);
      data.append('subject', 'Nouvelle demande de devis — page d\'accueil');
      data.append('Nom / Société', `${form.name}${form.company ? ' — ' + form.company : ''}`);
      data.append('Téléphone', form.phone);
      data.append('Email', form.email);
      data.append('Besoin', form.message);
      if (file) data.append('attachment', file);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (res.ok) {
        setStatus({ ok: true, msg: 'Demande envoyée ! Nous revenons vers vous sous 24h ouvrées.' });
        setForm({ name: '', company: '', phone: '', email: '', message: '' });
        setFile(null);
      } else {
        setStatus({ ok: false, msg: "L'envoi a échoué. Vous pouvez aussi nous appeler au 06 39 29 48 46." });
      }
    } catch {
      setStatus({ ok: false, msg: "L'envoi a échoué. Vous pouvez aussi nous appeler au 06 39 29 48 46." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="hq-name">Nom / Société *</label>
          <input id="hq-name" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="hq-phone">Téléphone</label>
          <input id="hq-phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="hq-email">E-mail *</label>
          <input id="hq-email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="hq-message">Votre besoin *</label>
          <textarea id="hq-message" name="message" value={form.message} onChange={onChange} required
            placeholder="Ex : liste de fournitures, quantités, délai souhaité…" />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="hq-file">Joindre un fichier (optionnel)</label>
          <input id="hq-file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div className="form-foot">
        <p className="form-note">Champs marqués * obligatoires.</p>
        <button type="submit" className="btn btn--primary" disabled={sending}>
          {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
      </div>
      {status && <div className={`form-status show ${status.ok ? 'ok' : 'bad'}`} role="status">{status.msg}</div>}
    </form>
  );
}
