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

## Gabarit d'une nouvelle décision

```
## #N — [Titre court de la décision]
- **Date :** AAAA-MM-JJ 

**Contexte.** Quel problème / quelle question ? Quelles contraintes ?
**Décision.** Ce que j'ai décidé, en une ou deux phrases.
**Alternatives écartées.** Option A (pourquoi non), option B (pourquoi non).
**Conséquences.** Bénéfices, coûts, risques, ce que ça ouvre ou ferme.
```
