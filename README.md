# Lucida

Lucida est une application web de lecture pensée pour tablette Android, conçue pour une personne malvoyante.  
Elle permet de consulter facilement des livres ajoutés à distance via une interface simple, tactile et contrastée.

---

## 🧱 Stack technique

- **Frontend** : Vue 3, Pinia, Tailwind CSS, Vite
- **Backend** : Fastify, Prisma, PostgreSQL
- **Lecture EPUB** : `epub.js`
- **Déploiement** : VPS Hetzner (Docker uniquement en prod)
---## ▶️ Lancement en développement
- **pnpm dev (avec concurrently)** : Lancement du frontend et du backend en même temps
- **pnpm dev:frontend** : Lancement du frontend
- **pnpm dev:backend** : Lancement du backend       
- **pnpm prisma:generate** : Génération du client Prisma
- **pnpm prisma:migrate** : Lancement des migrations Prisma
- **pnpm prisma:studio** : Lancement de Prisma Studio