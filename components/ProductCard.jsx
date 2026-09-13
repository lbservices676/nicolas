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
      <div className="shot">
        {product.ref && <span className="ref">{product.ref}</span>}
        {DEFAULT_ICON}
      </div>
      <div className="body">
        <h3>{product.name}</h3>
        {product.spec && <p className="spec">{product.spec}</p>}
        <div className="row">
          <span className="price">
            {product.price != null ? `${product.price} €` : '—'}
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
