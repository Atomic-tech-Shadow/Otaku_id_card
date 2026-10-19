<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=28&pause=1000&color=F97316&center=true&vCenter=true&width=700&lines=Otaku+ID+Card;Agence+Internationale+d%27Identification+Otaku;Syst%C3%A8me+de+carte+professionnelle+anime" alt="Otaku ID Card banner" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Monorepo-pnpm-FF6B6B?style=for-the-badge&logo=pnpm" alt="pnpm monorepo" />
</p>

<p align="center">
  <strong>🎴 Gestion, génération et visuel d'une carte d'identité otaku premium</strong>
</p>

# ✨ Otaku ID Card

Bienvenue dans le dépôt officiel de l'Agence Internationale d'Identification Otaku (`OIA`).

Ce projet permet de concevoir, prévisualiser et exporter une carte d'identité otaku stylisée, avec une interface moderne, un système de templates, et une base de données PostgreSQL pour structurer les profils.

## 🚀 Fonctionnalités

- 🧩 Frontend React/Vite dédié à la création de cartes
- 🎨 Plusieurs templates et mises en page visuelles
- 🖼️ Upload de photo et génération de rendu visuel
- 📦 Monorepo TypeScript avec packages partagés
- 🌐 API Express 5 pour la logique backend
- 🧪 Validation Zod/OpenAPI générée automatiquement
- 🗄️ Accès PostgreSQL avec Drizzle ORM
- 🛠️ Outils de scripts et build centralisés

## 🏗️ Architecture

```text
Otaku_id_card/
├── artifacts/
│   ├── api-server/         # API backend Express
│   ├── otaku-card/         # App React / Vite
│   └── mockup-sandbox/     # Prototype visuel / maquette
├── lib/
│   ├── api-spec/           # OpenAPI + Orval
│   ├── api-client-react/   # Hooks React Query générés
│   ├── api-zod/            # Schémas Zod générés
│   └── db/                 # Drizzle + PostgreSQL
├── scripts/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── replit.md
├── README.md
└── vercel.json
```

## 🧠 Stack technique

- TypeScript 5.9
- React + Vite
- Express 5
- PostgreSQL + Drizzle ORM
- Zod + OpenAPI
- pnpm workspaces
- Orval codegen

## ⚡ Démarrage rapide

### 1) Installer les dépendances

```bash
pnpm install
```

### 2) Vérifier le monorepo

```bash
pnpm run typecheck
pnpm run build
```

### 3) Lancer le backend

```bash
PORT=3000 DATABASE_URL="postgres://user:pass@host:5432/db" \
pnpm --filter @workspace/api-server run dev
```

### 4) Lancer le frontend

```bash
pnpm --filter @workspace/otaku-card run dev
```

## 🛡️ Variables d'environnement

Le backend attend surtout :

- `PORT` : port d’écoute de l’API
- `DATABASE_URL` : chaîne de connexion PostgreSQL

## 📦 Scripts clés

```bash
pnpm run build
pnpm run typecheck
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/otaku-card run dev
pnpm --filter @workspace/api-spec run codegen
```

## 🏁 Objectif du projet

Le projet a pour but de fournir une solution visuelle et technique pour générer une carte d'identité otaku moderne, premium et cataloguée, avec un rendu de type agence de sécurité / institution internationale.

## ✨ Vision

> “Une identité numérique, un design premium, et un système certifié.”

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-FF69B4?style=for-the-badge" alt="Made with love" />
  <img src="https://img.shields.io/badge/Status-Active-00C853?style=for-the-badge" alt="Active project" />
</p>

<p align="center">
  <sub>© 2026 Otaku International Agency</sub>
</p>
