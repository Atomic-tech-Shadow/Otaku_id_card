<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=36&pause=800&color=FF2D55&center=true&vCenter=true&width=900&lines=OTAKU+ID+CARD;OTAKU+INTERNATIONAL+AGENCY;--+CYBERPUNK+NEON+EDITION" alt="Otaku ID Card" />
  <p>
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" />
    <img src="https://img.shields.io/badge/Postgres-Ready-0064a5?style=for-the-badge&logo=postgresql" />
  </p>
</div>

<div align="center">
  <img alt="neon" src="https://raw.githubusercontent.com/atomic-tech-shadow/otaku_id_card/main/artifacts/otaku-card/public/placeholder-neon.gif" style="max-width:100%;border-radius:12px;box-shadow:0 10px 30px rgba(255,45,85,0.12);" />
</div>

# Otaku ID Card — Neon Cyberpunk Edition

Bienvenue à la version "Neon Cyberpunk" du système d'identification O.I.A. — une expérience visuelle sombre, rouge néon et or, pensée pour des cartes d'identité stylisées, exportables et validées.

> « Identité, design et sécurité — rebuild the badge. »

---

## ✨ Aperçu rapide

Otaku ID Card est un monorepo TypeScript qui contient :

- Une application frontend React/Vite (artifacts/otaku-card) pour concevoir et exporter des cartes.
- Un serveur API Express (artifacts/api-server) exposant les endpoints et la logique métier.
- Un schéma DB + client Drizzle (lib/db) pour persister les cartes/profils.
- Une spec OpenAPI (lib/api-spec) qui génère automatiquement :
  - des hooks React Query (lib/api-client-react)
  - des schémas Zod (lib/api-zod)

---

## 🔥 Style & Theme

- Thème : dark, rouge néon (#FF2D55) + or
- Typographie : Orbitron / monospace pour l'identité
- Ambiance : agence secrète + esthétique anime

---

## 🚀 Fonctionnalités clés

- Éditeur visuel de carte (templates, positionnement, couleurs)
- Prévisualisation (canvas) et export PNG haute qualité
- Upload et recadrage d'une photo utilisateur
- Génération automatique d'un numéro de carte
- API REST validée par Zod + OpenAPI
- Persistance avec PostgreSQL via Drizzle ORM
- Monorepo pnpm + TypeScript project references

---

## 🛠️ Installation & démarrage (rapide)

Prérequis : Node 24+, pnpm

```bash
# cloner
git clone https://github.com/Atomic-tech-Shadow/Otaku_id_card.git
cd Otaku_id_card

# installer
pnpm install

# (optionnel) générer les artefacts depuis la spec
pnpm --filter @workspace/api-spec run codegen

# lancer le backend (exemple)
PORT=3000 DATABASE_URL="postgres://user:pass@localhost:5432/otaku" pnpm --filter @workspace/api-server run dev

# lancer le frontend
pnpm --filter @workspace/otaku-card run dev
```

Windows PowerShell :

```powershell
$env:PORT=3000; $env:DATABASE_URL="postgres://user:pass@localhost:5432/otaku"; pnpm --filter @workspace/api-server run dev
```

---

## ⚙️ Variables d'environnement importantes

- PORT — port d'écoute du serveur
- DATABASE_URL — connection string PostgreSQL

---

## ✅ Vérifications automatiques ajoutées

- Le serveur loggue maintenant des warnings si les artefacts générés (lib/api-zod/src/generated ou lib/api-client-react/src/generated) sont manquants.
- Script `dev` de l'api-server est cross-platform (utilise cross-env).

---

## 📚 Organisation du dépôt

```text
Otaku_id_card/
├─ artifacts/
│  ├─ api-server/      # Express API
│  ├─ otaku-card/      # React Vite frontend
│  └─ mockup-sandbox/  # prototypes
├─ lib/
│  ├─ api-spec/        # OpenAPI + Orval (source de vérité)
│  ├─ api-client-react/ # généré: React Query hooks
│  ├─ api-zod/         # généré: Zod schemas
│  └─ db/              # Drizzle + connection
└─ scripts/            # utilitaires
```

---

## 🎯 Roadmap immédiate (je peux appliquer)

1. Ajouter une commande `pnpm --filter @workspace/api-server run prestart` qui génère automatiquement le codegen manquant.
2. Ajouter des snapshots visuels pour le rendu des cartes (CI) pour éviter les régressions visuelles.
3. Ajouter un mode d'export vectoriel (SVG/PDF) pour impressions haute qualité.

Souhaites-tu que j'implémente automatiquement la (1) en commit ? Réponds `OUI` pour que j'ajoute le script et la logique.

---

## 💬 Contribuer

PRs bienvenues — utilise la branche `fix/*` pour corrections et `feat/*` pour nouvelles fonctionnalités.

---

<div align="center">
  <sub style="color:#ff6b81">Otaku International Agency • Built with neon & caffeine</sub>
</div>
