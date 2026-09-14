import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact — LB Service' };

export default function ContactPage() {
  return (
    <>
      <Header current="contact" />

      <section className="page-hero">
        <div className="wrap">
          <span className="breadcrumb">Accueil / Contact</span>
          <h1>Parlons de votre chantier</h1>
          <p>Une question, un besoin urgent, une demande générale : appelez-nous ou laissez-nous un message.</p>
        </div>
      </section>
      <div className="hazard hazard--thin"></div>

      <section className="section">
        <div className="wrap contact-grid">
          <div>
            <div className="contact-info-card">
              <h3>Coordonnées</h3>
              <ul>
                <li>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg></span>
                  <div><b>Téléphone</b><span>06 36 29 48 46 </span></div>
                </li>
                <li>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
                  <div><b>Email</b><span>lbservices.idf@outlook.fr</span></div>
                </li>
                <li>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                  <div><b>Adresse</b><span>9 rue de la porte des bois, 94440 Marolles-en-Brie</span></div>
                </li>
              </ul>
              <table className="hours-table">
                <tbody>
                  <tr><td>Lundi – Vendredi</td><td>7h30 – 17h30</td></tr>
                  <tr><td>Samedi</td><td>Sur rendez-vous</td></tr>
                  <tr><td>Dimanche</td><td>Fermé</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-card">
            <h3>Nous écrire</h3>
            <p className="sub">Réponse sous 24h ouvrées. Pour une demande de devis produits, passez plutôt par le panier.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
