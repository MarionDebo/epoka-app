# Instructions pour Claude Code — Époka

Contexte produit complet : voir `docs/one-pager.md`, `docs/scope-v1.md`, `docs/decisions-log.md`.

## Guardrails UI / implémentation

Règles à respecter par défaut dans le code, sans qu'il soit nécessaire de les répéter à chaque demande.

- **Sources affichées une seule fois par écran, pas répétées à chaque message.** Les sources viennent toutes de la même fiche personnage (`server/characters.js`) : les répéter sous chaque bulle de réponse alourdit l'UI sans apporter d'info nouvelle.
