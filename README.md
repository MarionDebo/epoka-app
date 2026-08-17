# Époka

**Kids ask. Époka answers.**
Une app pour enfants qui transforme l'Histoire en rencontre : « parle » à un personnage historique, découvre-le, collectionne sa carte. Les réponses sont ancrées sur des **sources françaises vérifiées** et cadrées pour un public jeune.

> Projet personnel de *product builder* — pensé pour être construit en vibe coding et publié sur l'App Store.

## Critères de réussite

Ce projet réussit s'il coche **tous** ces points (voir [`docs/one-pager.md`](docs/one-pager.md)) :

1. Publié sur l'App Store — critère de succès n°1
2. Grand public (familles), pas B2B
3. Secteur éducation
4. Une touche d'IA au cœur du concept
5. Réalisable en vibe coding
6. Pièce de portfolio montrant la démarche produit

## Structure du repo

```
docs/
  one-pager.md          # l'étoile polaire : concept, enjeux, contraintes
  scope-v1.md           # périmètre v1 : écrans, boucle, ordre de build
  decisions-log.md      # journal chronologique des décisions produit
server/                 # proxy IA (la clé API ne vit jamais dans l'app)
```

## Démarrer (à compléter)

L'app mobile (Expo / React Native) sera générée avec la CLI Expo à jour, par-dessus ce cadre.

```bash
# à venir : commandes d'init Expo + lancement du proxy
```

## Principes techniques

- **Grounding** des réponses sur un corpus curé de fiches vérifiées (anti-hallucination).
- **Sécurité enfant** : périmètre de sujets, ton adapté à l'âge, refus gracieux (voir `docs/decisions-log.md`).
- **Proxy serverless** (Scaleway) pour les appels IA : la clé API reste côté serveur.
- **Conformité Kids Category** : zéro tracking, parental gate, collecte minimale.

## Licence

MIT — voir [`LICENSE`](LICENSE).
