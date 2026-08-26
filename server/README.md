# server — proxy IA d'Époka

Petit service serverless (cible : **Scaleway Functions**) qui reçoit les questions de l'app et appelle le modèle d'IA.

## Pourquoi un proxy ?

- **La clé API ne vit JAMAIS dans l'app mobile.** Une clé embarquée dans un binaire iOS est extractible → fuite garantie, et motif de refus App Store. Elle reste ici, côté serveur.
- C'est aussi l'endroit où l'on **construit le prompt ancré** (persona + fiche vérifiée + règles de sécurité enfant) et où l'on pourra plus tard journaliser, limiter le débit, ou changer de modèle sans toucher à l'app.

## Contenu

- `characters.js` — corpus curé v1 : fiches de faits vérifiés par personnage, chacune rattachée à ses sources (voir `docs/sources.md`).
- `history-chat.js` — construit le prompt système (rôle + grounding + garde-fous enfant), appelle Claude (Sonnet 5), renvoie `{ reply, sources }`. Les sources ne sont jamais générées par le modèle : elles viennent telles quelles de la fiche.
- `index.js` — petit serveur Express pour le dev local (`POST /chat`). En production, la même logique est déployée sur Scaleway Functions.

## Variables d'environnement

Voir `.env.example` à la racine (`ANTHROPIC_API_KEY`, `PORT`). En prod, la clé se configure **uniquement** dans l'environnement de la fonction déployée sur Scaleway, jamais dans le repo.

## Lancer en local

```bash
cd server
npm install
cp ../.env.example ../.env   # puis renseigner ANTHROPIC_API_KEY
npm run dev
```

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"characterId":"cleopatre","childAge":8,"messages":[{"role":"user","content":"Tu avais peur des Romains ?"}]}'
```
