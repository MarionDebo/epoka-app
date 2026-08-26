# Sources de grounding — sélection et rationale

> Objectif : ancrer les réponses des personnages historiques sur des sources françaises fiables, pour tenir la promesse « zéro hallucination » du [one-pager](one-pager.md).

---

## Sources retenues

### data.bnf.fr

- **Nature :** données structurées (Linked Data) de la Bibliothèque nationale de France — dates de naissance/mort, œuvres, relations entre personnalités.
- **Accès testé :** pas de SPARQL public exploitable en l'état — `data.bnf.fr/sparql/` est un éditeur web interactif (React), pas une API REST interrogeable en `curl`, et la recherche par nom (`/fr/search`) est une SPA sans API JSON exposée. En revanche, chaque personnage a une **URL stable par ARK** qui renvoie du JSON structuré exploitable : `https://data.bnf.fr/ark:/12148/{ARK}.json` (léger) ou `.rdf` (complet, RDF/XML), ou encore le bloc `<script type="application/ld+json">` (Schema.org : nom, dates, lieux, image) intégré dans la page HTML de la ressource.
- **Contrainte :** il faut **connaître l'ARK du personnage au préalable** — pas de recherche par nom côté API. Solution validée : récupérer l'ARK via la propriété `P268` de **Wikidata** (SPARQL fonctionnel), qui fait ici office d'annuaire technique, pas de source de contenu (cf. sources mises de côté).
- **Pourquoi retenue :** source **institutionnelle et vérifiée** (BnF), alignée avec la promesse de confiance faite aux parents. Format structuré = idéal pour verrouiller les faits factuels (dates clés, filiations) sans risque de reformulation hasardeuse par l'IA.
- **Limite à garder en tête :** données factuelles, pas de texte narratif prêt à l'emploi — nécessite un travail de mise en récit côté produit. Vu le corpus restreint (8-12 personnages), une table de correspondance nom → ARK constituée une fois suffit, pas besoin d'appeler Wikidata à chaque requête.

### Gallica (BnF)

- **Nature :** bibliothèque numérique patrimoniale de la BnF — documents d'époque, portraits, manuscrits, textes.
- **Accès testé :** API SRU fonctionnelle (`https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=...`), gratuite, sans clé — validée avec une recherche "Napoléon" (136 164 résultats retournés en XML/Dublin Core). API IIIF disponible pour les images. **Attention :** l'endpoint bloque le user-agent par défaut de `curl` (403) — nécessite d'envoyer un `User-Agent` de type navigateur.
- **Pourquoi retenue :** même statut **institutionnel et vérifié** que data.bnf.fr. Utile en complément pour illustrer les fiches personnages (portraits d'époque libres de droits) et sourcer des citations/documents authentiques.
- **Limite à garder en tête :** contenu brut d'archive, souvent en langue/orthographe d'époque — nécessite une adaptation pour un public 7-12 ans.

---

## Sources mises de côté

| Source | Raison de la mise à l'écart |
|---|---|
| **Wikipédia FR** | Contenu riche et sous licence réutilisable (CC-BY-SA), mais **non institutionnel** (collaboratif, non vérifié par une autorité) et non calibré pour un public enfant — risque pour l'argument « sources vérifiées » face aux parents. |
| **Wikidata** | Même logique que Wikipédia : projet collaboratif, pas d'autorité éditoriale garante. Écarté au profit de data.bnf.fr, équivalent institutionnel. |
| **Vikidia / Wikimini** | Niveau de langue adapté aux enfants, mais ce sont des **encyclopédies collaboratives associatives**, pas des sources institutionnelles. Statut d'API incertain (pas de documentation officielle trouvée pour Vikidia ; aucune API identifiée pour Wikimini). |
| **Éduthèque** | Contenu institutionnel (Éducation nationale) de bonne qualité, mais **accès réservé aux comptes enseignants** — pas d'API ouverte exploitable pour un produit grand public. |
| **Larousse / Encyclopædia Universalis** | Qualité éditoriale reconnue, mais **contenu propriétaire fermé**, sans API publique. Nécessiterait un accord de licence commerciale — hors scope v1 (vibe coding solo). |

---

## Rationale de sélection

Le critère décisif est **l'institutionnalité** : data.bnf.fr et Gallica proviennent d'une autorité publique française (la BnF), ce qui permet de défendre sans détour l'argument « sources vérifiées » auprès des parents et en entretien. Les sources collaboratives (Wikipédia, Wikidata, Vikidia, Wikimini) sont écartées à ce stade non pas pour leur qualité — souvent bonne — mais parce qu'elles ne portent pas la même garantie d'autorité, plus difficile à défendre comme argument de confiance parentale.

**Plan B assumé** (cf. one-pager) : si l'intégration API BnF s'avère trop lourde pour le v1, un **corpus curé manuellement** à partir de ces mêmes sources (data.bnf.fr, Gallica) reste la solution de repli — le récit « sources institutionnelles, zéro hallucination » tient dans les deux cas.
