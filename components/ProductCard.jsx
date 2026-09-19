'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { DEFAULT_ICON } from '@/lib/categoryIcons';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="prod-card">
      <div className="shot" style={product.image_url ? { background: '#fff' } : undefined}>
        {product.ref && <span className="ref">{product.ref}</span>}
        {product.on_promo && (
          <span style={{
            position: 'absolute', top: 8, right: 8, zIndex: 1,
            background: 'var(--orange)', color: '#fff', fontFamily: 'var(--f-mono)',
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase',
          }}>
            Promo
          </span>
        )}
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : DEFAULT_ICON}
      </div>
      <div className="body">
        {product.brand && (
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4, display: 'block' }}>
            {product.brand}
          </span>
        )}
        <h3>{product.name}</h3>
        {product.spec && <p className="spec">{product.spec}</p>}
        <div className="row">
          <span className="price">
            {product.on_promo && product.old_price != null && (
              <span style={{ textDecoration: 'line-through', color: 'var(--steel)', fontSize: 13, fontWeight: 400, marginRight: 6 }}>
                {product.old_price} €
              </span>
            )}
            <span style={product.on_promo ? { color: 'var(--orange)' } : undefined}>
              {product.price != null ? `${product.price} €` : '—'}
            </span>
            <small>HT / {product.unit || 'unité'}</small>
          </span>
          <button type="button" className="addbtn" onClick={handleAdd} disabled={added}>
            {added ? 'Ajouté ✓' : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  );
}
