import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'À propos — LB Service' };

export default function AproposPage() {
  return (
    <>
      <Header current="apropos" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">Accueil / À propos</span>
          <h1>Un fournisseur pensé pour le rythme du chantier</h1>
          <p>LB Service est né d&apos;un constat simple : les équipes BTP perdent trop de temps à courir après leur matériel. Notre métier, c&apos;est de leur en faire gagner.</p>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Notre mission</span>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 30, textTransform: 'uppercase', margin: '14px 0 16px', lineHeight: 1.15 }}>
              Le bon matériel, au bon moment, sur le bon chantier
            </h2>
            <p style={{ color: 'var(--steel)', marginBottom: 16 }}>
              LB Service fournit aux entreprises du bâtiment et des travaux publics l&apos;outillage, les EPI, la fixation, la manutention, les consommables et la plomberie nécessaires à l&apos;avancement de leurs chantiers.
            </p>
            <p style={{ color: 'var(--steel)' }}>
              Notre priorité : la disponibilité. Un chantier qui attend une livraison est un chantier qui coûte cher — nous organisons notre stock et notre logistique pour que ça n&apos;arrive pas.
            </p>
          </div>
          <div className="imgbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="1.2"><path d="M3 21h18M6 21V10l6-6 6 6v11M10 21v-5h4v5" /><path d="M9 13h.01M12 13h.01M15 13h.01" /></svg>
            <div className="hazard hazard--thin"></div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Nos engagements</span>
              <h2>Ce qui nous différencie</h2>
            </div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="num">01</div>
              <h3>Disponibilité</h3>
              <p>Un stock permanent sur les références les plus utilisées, pour ne jamais bloquer un chantier.</p>
            </div>
            <div className="value-card">
              <div className="num">02</div>
              <h3>Réactivité</h3>
              <p>Devis chiffré sous 24h ouvrées, livraison en 48h sur la majorité des commandes.</p>
            </div>
            <div className="value-card">
              <div className="num">03</div>
              <h3>Un seul interlocuteur</h3>
              <p>Un conseiller dédié qui connaît vos chantiers et centralise vos commandes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Parlons de votre prochain chantier</h2>
            <p>Notre équipe est disponible pour étudier vos besoins en fournitures.</p>
          </div>
          <Link href="/contact" className="btn btn--dark">Nous contacter →</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
