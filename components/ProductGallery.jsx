'use client';

import { useState } from 'react';
import { DEFAULT_ICON } from '@/lib/categoryIcons';

export default function ProductGallery({ images, name }) {
  const list = Array.isArray(images) && images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (list.length === 0) {
    return (
      <div className="shot" style={{ position: 'relative', aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {DEFAULT_ICON}
      </div>
    );
  }

  return (
    <div>
      <div className="shot" style={{ position: 'relative', aspectRatio: '4 / 3', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <img
          src={list[active]}
          alt={name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {list.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {list.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Voir la photo ${idx + 1} de ${name}`}
              aria-current={idx === active}
              style={{
                width: 64, height: 64, padding: 0, borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                border: idx === active ? '2px solid var(--orange)' : '1px solid var(--line)',
                background: '#fff', flexShrink: 0,
              }}
            >
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
