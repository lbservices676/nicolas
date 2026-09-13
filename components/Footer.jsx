import Link from 'next/link';
import LogoMark from './LogoMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" style={{ marginBottom: 14 }}>
              <LogoMark size={38} />
              <span className="word">LB SERVICE<small>FOURNITURES BTP &amp; TP</small></span>
            </Link>
            <p style={{ fontSize: 13.5, maxWidth: '32ch', color: 'var(--steel-light)' }}>
              Fournisseur d&apos;outillage et d&apos;équipement pour les professionnels du bâtiment et des travaux publics.
            </p>
          </div>
          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/produits">Produits</Link></li>
              <li><Link href="/apropos">À propos</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Univers produits</h4>
            <ul>
              <li><Link href="/produits#outillage">Outillage</Link></li>
              <li><Link href="/produits#epi">EPI &amp; sécurité</Link></li>
              <li><Link href="/produits#fixation">Fixation</Link></li>
              <li><Link href="/produits#manutention">Manutention</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>01 23 45 67 89</li>
              <li>lbservices.idf@outlook.fr</li>
              <li>9 rue de la porte des bois, 94440 Marolles-en-Brie</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LB Service. Tous droits réservés.</span>
          <span><Link href="/admin">Espace professionnel</Link></span>
        </div>
      </div>
    </footer>
  );
}
