'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function ProductDetailActions({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
          style={{ width: 72, padding: '11px 12px', border: '1px solid var(--line)', borderRadius: 4, fontFamily: 'var(--f-body)', fontSize: 15 }}
        />
        <button type="button" className="btn btn--primary" onClick={handleAdd} disabled={added} style={{ flex: 1 }}>
          {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
        </button>
      </div>
      <Link href="/panier" style={{ fontSize: 13.5, color: 'var(--orange)', fontWeight: 600 }}>
        Voir mon panier →
      </Link>
    </div>
  );
}
