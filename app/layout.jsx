import './globals.css';
import { CartProvider } from '@/components/CartProvider';

export const metadata = {
  title: 'LB Service — Fournitures & équipement pour le BTP',
  description: 'LB Service fournit outillage, EPI, fixations, manutention, abrasifs et plomberie aux professionnels du BTP et des travaux publics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
