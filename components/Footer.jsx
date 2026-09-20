'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';
import { createClient } from '@/lib/supabase/client';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('categories')
      .select('name, slug')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" style={{ marginBottom: 14 }}>
              <LogoMark size={38} />
              <span className="word">LB SERVICE<small>FOURNITURES BTP &amp; TP</small></span>
            </Link>
            <p style={{ fontSize: 13.5, maxWidth: '32ch', color: 'var(--steel-light)', marginBottom: 6 }}>
              Fournitures professionnelles BTP &amp; TP.
            </p>
            <p style={{ fontSize: 13.5, maxWidth: '32ch', color: 'var(--yellow)', fontWeight: 600 }}>
              L&apos;équipement qui tient le chantier.
            </p>
          </div>
          <div>
            <h4>Nos produits</h4>
            <ul>
              {categories.length > 0
                ? categories.map((c) => (
                    <li key={c.slug}><Link href={`/produits?category=${c.slug}`}>{c.name}</Link></li>
                  ))
                : (
                  <>
                    <li><Link href="/produits">Outillage</Link></li>
                    <li><Link href="/produits">EPI &amp; sécurité</Link></li>
                    <li><Link href="/produits">Fixation</Link></li>
                    <li><Link href="/produits">Manutention</Link></li>
                  </>
                )}
            </ul>
          </div>
          <div>
            <h4>LB Service</h4>
            <ul>
              <li><Link href="/apropos">À propos</Link></li>
              <li><Link href="/produits">Nos marques</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/panier">Demander un devis</Link></li>
              <li><Link href="/admin">Espace Pro</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>06 39 29 48 46</li>
              <li>lbservices.idf@outlook.fr</li>
              <li>lbservices.fr</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LB Service. Tous droits réservés.</span>
          <span><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/admin">Espace professionnel</Link></span>
        </div>
      </div>
    </footer>
  );
}
