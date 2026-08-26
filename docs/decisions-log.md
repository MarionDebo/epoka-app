# Journal des décisions — Époka

Journal chronologique des décisions produit du projet. Une entrée par décision, la plus récente en haut.
Format d'une entrée : **contexte → décision → alternatives écartées → conséquences**.

Pour ajouter une décision : copie le gabarit en bas et ajoute-la **à la fin** (ordre chronologique).

---

## #1 — Concept retenu : Époka *(parmi 3 candidats)*
- **Date :** 2026-08-16 

**Contexte.** Trois concepts en shortlist pour un projet perso à vibe coder, destiné à être publié et défendu en entretien : Époka (interroger des personnages historiques), une app de logistique scolaire, et un scanner d'ordonnance → planning de prise. Critères : grand public, secteur santé ou éducation, publication App Store, touche d'IA, défendable en entretien.

**Décision.** Retenir **Époka**. C'est le concept qui maximise simultanément le plus de critères : secteur éducation pur, défendabilité IA la plus forte (grounding sur sources vérifiées), effet démo/portfolio le plus marquant, récit d'entretien le plus riche — et c'était la première vraie envie.

**Alternatives écartées.**
- *Logistique scolaire* — marché saturé, feature « photo → calendrier » banalisée ; difficile à défendre comme distinctive.
- *Ordonnance → planning* — meilleur fit santé, mais chemin le plus risqué vers une app publiée (OCR d'ordonnances manuscrites peu fiable + falaise de responsabilité médicale).

**Conséquences.** Secteur éducation ; public enfants + parents. Ouvre les enjeux de sécurité du contenu enfant et de conformité Kids Category (voir #3).

---

## #2 — Ancrer les réponses sur des sources vérifiées plutôt que laisser l'IA libre
- **Date :** 2026-08-16

**Contexte.** Le cœur d'Époka est une conversation IA en rôle destinée à des enfants. Un modèle libre peut halluciner, inventer des faits ou glisser des anachronismes — inacceptable pour un public jeune, et la fiabilité est justement ce qui différencie d'un chatbot généraliste.

**Décision.** Chaque personnage est **ancré (grounded)** sur une fiche de faits vérifiés : le modèle répond *en rôle* mais son contenu factuel est contraint par cette fiche, sans affirmer de faits hors socle. En v1, le socle est un **corpus curé** (fiches construites à partir de sources fiables).

**Alternatives écartées.**
- *IA libre, aucun grounding* — risque d'hallucination, aucune garantie de sûreté, pas de différenciation.
- *API bibliothèque/patrimoine en direct (Gallica, data.bnf.fr…)* — reportée : intéressante pour la provenance, mais lourde et pas taillée pour des faits « prêts pour enfants ». À réévaluer après la v1.

**Conséquences.** (+) Fiabilité et récit produit fort (« sources vérifiées, zéro hallucination »). (+) Périmètre maîtrisé, plus facile à publier et à défendre. (−) Effort de curation des fiches en amont ; catalogue initial limité (assumé).

---

## #3 — Définir un périmètre de sécurité pour le contenu destiné aux enfants
- **Date :** 2026-08-16 

**Contexte.** L'Histoire comporte des sujets durs (guerre, mort, esclavage, violence). Un personnage interrogé par un enfant peut y être confronté. Il faut ni édulcorer à l'excès, ni exposer un enfant à un contenu inadapté. C'est le risque produit central d'Époka et une exigence de la catégorie Enfants de l'App Store.

**Décision.** Chaque personnage répond dans un **périmètre de sujets borné**, avec un **ton adapté à l'âge** et une **profondeur limitée** sur les sujets sensibles (jamais de détails graphiques). Hors périmètre : **refus gracieux** (« ça, c'est une question à poser à un adulte ») plutôt qu'un blocage sec. Ces règles sont injectées dans le prompt système, en plus du grounding factuel (#2).

**Alternatives écartées.**
- *Aucune restriction, confiance au modèle* — imprévisible, non conforme Kids Category, risque réputationnel.
- *Liste noire de mots-clés seule* — trop grossière, casse l'expérience et se contourne ; on préfère un cadrage par périmètre + ton.

**Conséquences.** (+) Sécurité et confiance parentale, condition de publication. (+) Excellent sujet d'entretien. (−) Certaines questions reçoivent un refus gracieux plutôt qu'une réponse (assumé). À tester sur cas réels dès la Phase 0 du build.

---

## #4 — Sources de grounding retenues : data.bnf.fr et Gallica (institutionnelles)
- **Date :** 2026-08-26

**Contexte.** La décision #2 reportait l'évaluation des API patrimoniales/bibliothèque. Plusieurs pistes de sources françaises ont été comparées (Wikipédia, Wikidata, Vikidia, Wikimini, Éduthèque, Larousse/Universalis, data.bnf.fr, Gallica) selon deux critères : institutionnalité (autorité garante, défendable auprès des parents) et accès API réellement exploitable.

**Décision.** Retenir **data.bnf.fr** et **Gallica** (toutes deux BnF) comme sources de référence pour le corpus curé — seules sources à la fois institutionnelles et vérifiées techniquement. Détail complet dans `docs/sources.md`.

**Alternatives écartées.** Wikipédia/Wikidata/Vikidia/Wikimini (collaboratifs, pas d'autorité éditoriale garante) ; Éduthèque (pas d'API ouverte, accès enseignant) ; Larousse/Universalis (contenu propriétaire fermé). Détail des raisons dans `docs/sources.md`.

**Conséquences.** (+) Argument « sources vérifiées » défendable sans détour. (−) **data.bnf.fr n'a pas de moteur de recherche en API** : chaque personnage doit être identifié à l'avance par son ARK (identifiant pérenne BnF), pas de recherche par nom exploitable en code. Solution technique validée : passer par **Wikidata (SPARQL, propriété P268)** comme simple annuaire pour retrouver l'ARK, puis interroger data.bnf.fr avec cet identifiant. Vu le corpus restreint (8-15 personnages), une table de correspondance nom → ARK constituée une fois suffit — pas besoin d'appeler Wikidata à chaque requête. Gallica (API SRU) nécessite un header `User-Agent` de navigateur, sinon bloquée (403).

---

## #5 — Modèle Claude pour le chat en rôle : Sonnet 5 plutôt qu'un modèle « léger »
- **Date :** 2026-08-26

**Contexte.** Le one-pager posait la contrainte d'un « modèle multimodal léger » pour maîtriser coût/latence (public enfant, réponses courtes). Au moment de coder le premier écran de conversation (Cléopâtre), il a fallu trancher entre un modèle très économique (Haiku 4.5), un compromis (Sonnet 5) ou le plus capable (Opus 5).

**Décision.** Utiliser **Claude Sonnet 5** pour les réponses en rôle. Compromis entre coût maîtrisé et fiabilité du respect des consignes (jeu de rôle + ancrage strict sur la fiche + garde-fous de sécurité enfant) — plus sûr qu'Haiku sur ce dernier point, sans le surcoût d'Opus.

**Alternatives écartées.** Haiku 4.5 (le plus proche de la contrainte « léger » initiale du one-pager, mais risque plus élevé d'écart au cadrage de sécurité) ; Opus 5 (le plus capable, mais coût disproportionné pour des réponses courtes et bornées).

**Conséquences.** Ajuste implicitement la contrainte « modèle léger » du one-pager vers « modèle intermédiaire » — à surveiller sur le coût réel en usage avant la Phase 4 (polish/publication). Architecture retenue en parallèle : les **sources affichées dans le chat ne sont jamais générées par le modèle** — elles sont attachées programmatiquement par le serveur depuis la fiche du personnage (`server/characters.js`), pour garantir l'exactitude de l'attribution et éviter toute citation halluciné.

---

## Gabarit d'une nouvelle décision

```
## #N — [Titre court de la décision]
- **Date :** AAAA-MM-JJ 

**Contexte.** Quel problème / quelle question ? Quelles contraintes ?
**Décision.** Ce que j'ai décidé, en une ou deux phrases.
**Alternatives écartées.** Option A (pourquoi non), option B (pourquoi non).
**Conséquences.** Bénéfices, coûts, risques, ce que ça ouvre ou ferme.
```
