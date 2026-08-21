# Epoka — Scope v1

> Le doc qui fait passer d'« one-pager » à « je code ».
> Principe : **une seule boucle, prouvée de bout en bout, publiable.** Tout le reste attend la v2.

---

## Objectif de la v1

Prouver — et démontrer en 10 secondes — la boucle :

> l'enfant **interroge** un personnage → réponse *en rôle*, sûre et ancrée → **carte débloquée** qui rejoint la collection.

## Les écrans (3 + onboarding léger + parental gate)

**0. Onboarding (ultra-léger).** Prénom de l'enfant, tranche d'âge. Aucune création de compte, aucune collecte superflue (contrainte Kids Category).

**1. La Collection (écran d'accueil).** La grille des personnages : ceux déjà « rencontrés » (carte en couleur) et ceux à découvrir (silhouette verrouillée). C'est le moteur de progression — « il m'en manque un ». Point d'entrée vers chaque personnage.

**2. La Fiche / Carte personnage.** La carte à collectionner : illustration, dates clés, « le savais-tu ». Bouton **« Lui parler »**. Une fois la rencontre faite, la carte est « acquise ».

**3. La Conversation.** L'enfant pose ses questions ; le personnage répond en rôle, à hauteur d'enfant, **ancré sur sa fiche vérifiée**, dans un périmètre de sujets sûr. À la fin d'un premier échange, la carte se débloque avec une petite animation.

**Parental gate.** Avant tout achat, lien externe ou réglage sensible : une porte parentale (petit calcul / geste que seul un adulte fait). Exigence App Store Kids.

## La boucle exacte

1. Depuis **La Collection**, l'enfant ouvre une **Fiche** (personnage déverrouillé ou à découvrir).
2. Il tape **« Lui parler »** → écran **Conversation**.
3. Il pose une question → l'app construit le prompt (persona + fiche vérifiée + règles de sécurité) → appel au **proxy** → réponse en rôle.
4. Après le premier échange réussi, la **carte se débloque** et rejoint la Collection (persistée en local).
5. Retour Collection : une case de plus remplie → envie d'en découvrir un autre.

## Dans la v1 / Hors v1

**Dans :** 15 personnages ancrés sur un corpus curé · la boucle interroger → débloquer → collectionner · garde-fous de sécurité enfant · collection persistée en local · onboarding minimal + parental gate + conformité Kids de base.

**Hors (reporté) :** comptes cloud, échange/multijoueur de cartes, génération d'illustrations à la volée, voix/audio des personnages, catalogue étendu, quêtes avancées, personnalisation poussée.

## L'ordre de construction (pour une démo vite)

**Phase 0 — La magie + la sécurité, en throwaway (½–1 j).**
Un seul écran jetable, **un seul personnage**, fiche curée en dur. But : valider la **qualité** des réponses en rôle *et* leur **sûreté** (comment le personnage gère une question sensible, sort-il de son périmètre ?) **avant** toute UI. Si la réponse n'est ni juste, ni sûre, ni « à hauteur d'enfant », rien d'autre ne compte.

**Phase 1 — La Conversation (1-2 j).** L'écran de conversation réel + le grounding sur fiche + les garde-fous (périmètre de sujets, refus gracieux, ton). C'est déjà une démo qui touche.

**Phase 2 — La Collection + persistance (1-2 j).** Grille, déblocage de carte, stockage local. Là, c'est un produit, pas une démo.

**Phase 3 — Conformité Kids (1 j).** Onboarding, parental gate, zéro tracking, politique de confidentialité, disclaimer IA. C'est ce qui rend la publication possible (critère de succès n°1).

**Phase 4 — Polish + publication (2-3 j).** 15 personnages, illustrations des cartes, animations. Puis build EAS → TestFlight → soumission App Store (catégorie Enfants).

## Stack

Expo / React Native · stockage local (SQLite ou MMKV) pour la collection · IA appelée **derrière un proxy serverless Scaleway** (clé API jamais dans l'app) · grounding via corpus curé local (fiches) injecté dans le prompt · modèle multimodal léger, réponses bornées (coût/latence).

## Sécurité enfant — le pilier (à ne jamais rogner)

- **Périmètre de sujets** défini par personnage/époque ; sujets durs (guerre, mort, esclavage, violence) traités avec un **ton adapté à l'âge** et une **profondeur bornée**, jamais graphiques.
- **Refus gracieux** hors-cadre (« ça, c'est une question à poser à un adulte ») plutôt qu'un mur.
- **Grounding strict** sur la fiche : le personnage ne « brode » pas au-delà des faits vérifiés.
- **Zéro collecte** de données enfant, **parental gate** sur tout ce qui sort de l'app.

## Métrique nord

**Nombre de personnages rencontrés (carte débloquée) par enfant et par semaine.** Activation : *% de nouveaux qui débloquent une première carte dès la 1re session.*

## Le « moment démo » (entretien & portfolio)

Un enfant tape « Cléopâtre, tu avais peur des Romains ? » → réponse juste, en rôle, à sa hauteur → **la carte se débloque** et rejoint la collection. Dix secondes = IA ancrée + sécurité enfant + boucle de collection.
