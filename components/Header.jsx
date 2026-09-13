'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoMark from './LogoMark';
import { useCart } from './CartProvider';

export default function Header({ current }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  const cur = (name) => (current === name ? { 'aria-current': 'page' } : {});

  const onSearch = (e) => {
    e.preventDefault();
    router.push(q ? `/produits?q=${encodeURIComponent(q)}` : '/produits');
  };

  return (
    <header className={`site-header ${open ? 'nav-open' : ''}`}>
      <div className="info-bar">
        <div className="wrap">
          <span><strong>Marolles-en-Brie</strong> · Livraison chantier BTP &amp; TP sous 48h</span>
          <div className="info-links">
            <Link href="/apropos" {...cur('apropos')}>À propos</Link>
            <Link href="/contact" {...cur('contact')}>Contact</Link>
          </div>
        </div>
      </div>

      <div className="topbar">
        <div className="wrap">
          <Link href="/" className="logo">
            <LogoMark />
            <span className="word">LB SERVICE<small>FOURNITURES BTP &amp; TP</small></span>
          </Link>

          <form className="searchbar" role="search" onSubmit={onSearch}>
            <input
              type="search"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une référence…"
              aria-label="Rechercher un produit"
            />
            <button type="submit" aria-label="Lancer la recherche">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </form>

          <div className="topbar-actions">
            <Link href="/contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.2 2-2.4 3.5M12 17h.01" /></svg>
              <span>Aide</span>
            </Link>
            <Link href="/admin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
              <span>Espace pro</span>
            </Link>
            <Link href="/panier" className="cart-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" /></svg>
              <span>Mon panier</span>
              {count > 0 && <span className="count">{count}</span>}
            </Link>
          </div>

          <button className="nav-toggle" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <nav className="subnav" aria-label="Navigation produits">
        <div className="wrap">
          <button className="menu-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            Nos univers
          </button>
          <ul className="subnav-links">
            <li><Link href="/produits#outillage">Outillage</Link></li>
            <li><Link href="/produits#epi">EPI &amp; sécurité</Link></li>
            <li><Link href="/produits#fixation">Fixation</Link></li>
            <li><Link href="/produits#manutention">Manutention</Link></li>
            <li><Link href="/produits#abrasifs">Abrasifs</Link></li>
            <li><Link href="/produits#plomberie">Plomberie</Link></li>
          </ul>
          <Link href="/panier" className="subnav-right">Voir mon panier →</Link>
        </div>
      </nav>
    </header>
  );
}
