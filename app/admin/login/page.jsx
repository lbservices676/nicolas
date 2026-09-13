'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoMark from '@/components/LogoMark';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <LogoMark size={40} />
        <h1>Espace professionnel</h1>
        <p>Connectez-vous pour gérer vos produits, vos univers et vos demandes de devis.</p>

        <form onSubmit={onSubmit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="email" style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--steel)' }}>Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', marginTop: 6, padding: '11px 13px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--paper)' }} />
          </div>
          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="password" style={{ fontFamily: 'var(--f-mono)', fontSize: 11.5, textTransform: 'uppercase', color: 'var(--steel)' }}>Mot de passe</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', marginTop: 6, padding: '11px 13px', border: '1px solid var(--line)', borderRadius: 4, background: 'var(--paper)' }} />
          </div>
          {error && <div className="form-status show bad" style={{ marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
