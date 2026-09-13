# LB Service — site + panier devis + espace admin

Site Next.js connecté à Supabase :
- Catalogue (univers + produits) modifiable depuis un espace admin sécurisé
- Panier client → demande de devis envoyée en base + email de notification
- Espace `/admin` protégé par connexion (email + mot de passe)

## 1. Créer le projet Supabase

1. Va sur https://supabase.com → **New project** (gratuit).
2. Une fois créé, ouvre **SQL Editor** et colle le contenu du fichier
   `supabase/schema.sql` de ce dossier, puis **Run**.
   → Ça crée les tables (`categories`, `products`, `devis_requests`,
   `devis_items`), les règles de sécurité, et les 6 univers de départ.
3. Va dans **Authentication → Users → Add user** et crée ton compte
   admin (email + mot de passe). C'est ce compte qui te servira à te
   connecter sur `/admin`.
4. Va dans **Project Settings → API** et note :
   - `Project URL`
   - `anon public key`

## 2. Configurer le projet

1. Copie `.env.local.example` en `.env.local`.
2. Renseigne :
   ```
   NEXT_PUBLIC_SUPABASE_URL=... (Project URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=... (anon public key)
   ```
3. (Optionnel mais conseillé) Pour recevoir un **email immédiat** à
   chaque nouvelle demande de devis ou message de contact, crée une clé
   gratuite sur https://web3forms.com et ajoute-la :
   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=...
   ```
   Sans cette clé, les demandes de devis sont quand même bien
   enregistrées et visibles dans `/admin/devis` — tu n'as juste pas la
   notification email instantanée.

## 3. Tester en local

```bash
npm install
npm run dev
```
Puis ouvre http://localhost:3000 (site public) et
http://localhost:3000/admin (connexion avec le compte créé à l'étape 1).

## 4. Déployer sur Vercel (gratuit)

1. Mets ce dossier dans un dépôt Git (GitHub, par exemple).
2. Va sur https://vercel.com → **Add New Project** → importe le dépôt.
3. Dans les réglages du projet Vercel, onglet **Environment Variables**,
   ajoute les mêmes variables que dans `.env.local` (URL Supabase, clé
   anon, clé Web3Forms).
4. Déploie.
5. Dans **Settings → Domains**, ajoute `lbservices.fr` et suis les
   instructions pour pointer ton domaine (enregistrements DNS chez ton
   registrar) vers Vercel.

## Comment ça marche au quotidien

- **Ajouter/modifier un produit ou un univers** : connecte-toi sur
  `/admin`, onglets "Univers produits" et "Produits". Aucune ligne de
  code à toucher.
- **Un client passe une commande** : il ajoute des produits à son
  panier sur le site, remplit ses coordonnées, et valide. La demande
  arrive dans `/admin/devis` avec le détail du panier, l'email et le
  téléphone du client. Tu peux le rappeler ou lui répondre par email
  directement depuis cette page, puis marquer la demande "Traité".
- **Aucun paiement en ligne** : le panier sert uniquement à préparer la
  demande de devis, pas à encaisser — c'est toi qui envoies le devis
  chiffré ensuite, comme avant.

## Structure du projet

```
app/                  pages du site (Next.js App Router)
  page.jsx            Accueil
  produits/           Catalogue (lecture Supabase)
  panier/             Panier + formulaire de demande de devis
  apropos/            À propos
  contact/            Contact simple
  admin/
    login/            Connexion
    (dashboard)/      Espace protégé : tableau de bord, univers, produits, devis
components/           Composants réutilisables (header, footer, panier, formulaires)
lib/supabase/         Connexion à Supabase (navigateur, serveur)
supabase/schema.sql   Script de création de la base de données
middleware.js         Protège les pages /admin (redirige vers la connexion si non connecté)
```

## Prochaines étapes possibles (pas indispensables pour démarrer)
- Ajouter de vraies photos produits (actuellement des pictogrammes).
- Ajouter un deuxième compte admin si quelqu'un d'autre doit gérer le
  catalogue (Authentication → Add user dans Supabase).
- Ajouter Google Analytics ou Matomo pour suivre le trafic du site.
