-- ==========================================================================
-- LB SERVICE — Schéma de base de données Supabase
-- À exécuter dans Supabase > SQL Editor (une seule fois)
-- ==========================================================================

create extension if not exists "uuid-ossp";

-- ---------- Thèmes / univers produits ----------
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,               -- nom d'icône simple (ex: 'outillage', 'epi'...)
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- Produits ----------
create table if not exists products (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid references categories(id) on delete set null,
  name         text not null,
  ref          text,              -- référence article (ex: "REF-014")
  description  text,
  spec         text,              -- caractéristiques courtes (ex: "18V · 2 batteries")
  price        numeric(10,2),     -- prix indicatif HT, peut être vide
  unit         text default 'unité',
  image_url    text,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- Demandes de devis (panier envoyé par un client) ----------
create table if not exists devis_requests (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  company     text,
  email       text not null,
  phone       text,
  message     text,
  status      text not null default 'nouveau',  -- nouveau / en cours / traité
  created_at  timestamptz not null default now()
);

-- ---------- Lignes du panier associées à une demande de devis ----------
create table if not exists devis_items (
  id                uuid primary key default uuid_generate_v4(),
  devis_request_id  uuid not null references devis_requests(id) on delete cascade,
  product_id        uuid references products(id) on delete set null,
  product_name      text not null,   -- copie du nom au moment de la demande
  quantity          integer not null default 1
);

-- ==========================================================================
-- Sécurité (Row Level Security)
-- ==========================================================================

alter table categories     enable row level security;
alter table products       enable row level security;
alter table devis_requests enable row level security;
alter table devis_items    enable row level security;

-- Tout le monde peut lire les catégories et les produits actifs (site public)
create policy "Lecture publique des catégories"
  on categories for select
  using (true);

create policy "Lecture publique des produits actifs"
  on products for select
  using (active = true);

-- Seuls les utilisateurs connectés (l'administrateur) peuvent modifier
create policy "Admin peut tout faire sur les catégories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin peut tout faire sur les produits"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Un visiteur (non connecté) peut créer une demande de devis, mais pas la lire
create policy "Le public peut créer une demande de devis"
  on devis_requests for insert
  with check (true);

create policy "Admin peut lire/modifier les demandes de devis"
  on devis_requests for select
  using (auth.role() = 'authenticated');

create policy "Admin peut mettre à jour les demandes de devis"
  on devis_requests for update
  using (auth.role() = 'authenticated');

-- Idem pour les lignes de panier
create policy "Le public peut créer des lignes de devis"
  on devis_items for insert
  with check (true);

create policy "Admin peut lire les lignes de devis"
  on devis_items for select
  using (auth.role() = 'authenticated');

-- ==========================================================================
-- Données de démarrage (les 6 univers déjà définis) — à adapter librement
-- depuis le panneau admin ensuite
-- ==========================================================================

insert into categories (name, slug, description, icon, sort_order) values
  ('Outillage & électroportatif', 'outillage',    'Perceuses, meuleuses, visseuses et outillage à main.', 'outillage', 1),
  ('EPI & sécurité chantier',     'epi',          'Casques, gants, chaussures et protections certifiées.', 'epi', 2),
  ('Fixation & visserie',         'fixation',     'Vis, chevilles, boulonnerie et fixations techniques.', 'fixation', 3),
  ('Manutention & levage',        'manutention',  'Diables, transpalettes, sangles et matériel de levage.', 'manutention', 4),
  ('Consommables & abrasifs',     'abrasifs',     'Disques, forets, mèches et bandes abrasives.', 'abrasifs', 5),
  ('Plomberie & sanitaire',       'plomberie',    'Raccords, tubes et équipements sanitaires.', 'plomberie', 6)
on conflict (slug) do nothing;
