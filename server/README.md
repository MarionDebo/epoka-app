# server — proxy IA d'Époka

Petit service serverless (cible : **Scaleway Functions**) qui reçoit les questions de l'app et appelle le modèle d'IA.

## Pourquoi un proxy ?

- **La clé API ne vit JAMAIS dans l'app mobile.** Une clé embarquée dans un binaire iOS est extractible → fuite garantie, et motif de refus App Store. Elle reste ici, côté serveur.
- C'est aussi l'endroit où l'on **construit le prompt ancré** (persona + fiche vérifiée + règles de sécurité enfant) et où l'on pourra plus tard journaliser, limiter le débit, ou changer de modèle sans toucher à l'app.

## Contenu

- `history-chat.example.js` — **stub non fonctionnel** montrant la structure de l'appel : construction du prompt système (rôle + grounding + garde-fous), format de la requête. À adapter au provider choisi et à déployer sur Scaleway.

## Variables d'environnement

Voir `.env.example` à la racine. La clé du provider IA se configure **uniquement** dans l'environnement de la fonction déployée, pas dans le repo.
