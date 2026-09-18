import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Mentions légales — LB Service' };

export default function MentionsLegalesPage() {
  return (
    <>
      <Header current="mentions-legales" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">Accueil / Mentions légales</span>
          <h1>Mentions légales</h1>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            1. Éditeur du site
          </h2>
          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            Le présent site est édité par <strong>LB Service</strong>, dont le siège est situé au
            9 rue de la porte des bois, 94440 Marolles-en-Brie.<br />
            Forme juridique : <em>[à compléter]</em><br />
            N° SIRET : <em>[à compléter]</em><br />
            N° de TVA intracommunautaire : <em>[à compléter, si applicable]</em><br />
            Téléphone : 06 39 29 48 46<br />
            E-mail : lbservices.idf@outlook.fr<br />
            Directeur de la publication : <em>[nom à compléter]</em>
          </p>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            2. Hébergement
          </h2>
          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            Ce site est hébergé par :<br />
            Vercel Inc.<br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
            Site web : https://vercel.com<br />
            E-mail : privacy@vercel.com
          </p>

          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            Les données du catalogue et des demandes de devis sont hébergées par :<br />
            Supabase Inc. — <em>infrastructure cloud sécurisée</em>
          </p>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            3. Propriété intellectuelle
          </h2>
          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            L&apos;ensemble des contenus présents sur ce site (textes, images, logo, graphismes)
            est la propriété de LB Service, sauf mention contraire, et est protégé par le droit
            d&apos;auteur. Toute reproduction, représentation ou diffusion, totale ou partielle,
            sans autorisation préalable est interdite.
          </p>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            4. Données personnelles
          </h2>
          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            Les informations recueillies via les formulaires du site (contact, demande de devis)
            sont utilisées uniquement pour traiter votre demande et ne sont ni cédées ni vendues à
            des tiers. Conformément au Règlement Général sur la Protection des Données (RGPD) et à
            la loi « Informatique et Libertés », vous disposez d&apos;un droit d&apos;accès, de
            rectification et de suppression des données vous concernant, que vous pouvez exercer en
            nous contactant à lbservices.idf@outlook.fr.
          </p>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            5. Cookies et stockage local
          </h2>
          <p style={{ color: 'var(--steel)', marginBottom: 24 }}>
            Ce site utilise le stockage local de votre navigateur pour mémoriser le contenu de
            votre panier de devis d&apos;une visite à l&apos;autre. Aucun cookie publicitaire ou de
            traçage tiers n&apos;est utilisé.
          </p>

          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, textTransform: 'uppercase', margin: '0 0 12px' }}>
            6. Droit applicable
          </h2>
          <p style={{ color: 'var(--steel)' }}>
            Les présentes mentions légales sont soumises au droit français. Pour tout litige, les
            tribunaux compétents seront ceux du ressort du siège social de LB Service.
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}
