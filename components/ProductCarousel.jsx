'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ProductCarousel({ slides }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const scrollToIndex = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    const slide = track.children[clamped];
    if (!slide) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    setIndex(clamped);
  }, [slides.length]);

  const next = useCallback(() => scrollToIndex(index + 1 >= slides.length ? 0 : index + 1), [index, scrollToIndex, slides.length]);
  const prev = useCallback(() => scrollToIndex(index - 1 < 0 ? slides.length - 1 : index - 1), [index, scrollToIndex, slides.length]);

  // défilement automatique, coupé si l'utilisateur préfère moins de mouvement
  useEffect(() => {
    if (!autoplay) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => next(), 5000);
    return () => clearInterval(timer);
  }, [autoplay, next]);

  const stopAutoplay = () => setAutoplay(false);

  // garde l'index à jour si l'utilisateur fait défiler manuellement (swipe, molette)
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const children = [...track.children];
    let closest = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    setIndex(closest);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { stopAutoplay(); next(); }
    if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); }
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Nos produits et solutions"
      onMouseEnter={stopAutoplay}
      onTouchStart={stopAutoplay}
      onFocus={stopAutoplay}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div style={{ position: 'relative' }}>
        <div className="carousel-track" ref={trackRef} onScroll={onScroll}>
          {slides.map((s, i) => (
            <div className="carousel-slide" key={i}>
              {s.type === 'cta' ? (
                <Link href={s.href} className="carousel-cta-card">
                  <span className="eyebrow" style={{ color: 'var(--yellow)' }}>{s.eyebrow}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="carousel-cta-link">{s.cta} →</span>
                </Link>
              ) : (
                <Link href={s.href} className="carousel-image-card">
                  <img src={s.image} alt={`${s.title} — ${s.text}`} loading="lazy" />
                  <span className="sr-only">{s.title} : {s.text}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="carousel-side-btn carousel-side-btn--prev" aria-label="Produit ou solution précédente" onClick={() => { stopAutoplay(); prev(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" className="carousel-side-btn carousel-side-btn--next" aria-label="Produit ou solution suivante" onClick={() => { stopAutoplay(); next(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      <div className="carousel-controls">
        <div className="carousel-dots" role="tablist" aria-label="Aller à la carte">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Aller à la carte ${i + 1}`}
              className={i === index ? 'is-active' : ''}
              onClick={() => { stopAutoplay(); scrollToIndex(i); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
