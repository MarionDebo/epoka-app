# Étude de faisabilité — oral, sources, structure

> Le doc qui répond à « est-ce qu'on peut le faire ? » **avant** d'écrire la première ligne.
> Trois questions posées, trois verdicts, et ce qui reste ouvert.

- **Date :** 2026-09-09
- **État du projet :** fin de Phase 0 ([scope-v1.md](scope-v1.md)) — un écran jetable, un personnage, le proxy IA ancré fonctionne.

---

## Objet et méthode

Trois besoins court terme se présentaient au moment de sortir de la Phase 0 :

1. Une vraie première **structure de code** scalable.
2. Se connecter **pour de vrai aux API** retenues en décision #4 (data.bnf.fr, Gallica), au lieu de garder des faits en dur.
3. Passer la conversation **à l'oral**, piste envisagée : **Gemini Live**.

Plutôt que de coder puis découvrir, chaque question a été instruite en amont. Les verdicts ci-dessous reposent sur des **tests réellement exécutés** — requêtes lancées contre les API et réponses observées, conditions d'utilisation lues dans le texte, documentation Expo consultée dans sa version exacte (SDK 57.0.0) — et non sur de la documentation parcourue ou des souvenirs.

Ça compte, parce que **deux des trois verdicts contredisent ce qu'on croyait**, et que l'un d'eux dément des affirmations déjà écrites dans nos propres docs.

**Résumé des verdicts :**

| Question | Verdict |
|---|---|
| L'oral via Gemini Live | ❌ **Non** — contractuellement interdit. Alternative on-device retenue. |
| Les API BnF comme source de faits | ❌ **Non** — mais excellentes pour la provenance et la vérification. |
| La structure de code | ✅ **Oui** — chemin standard, peu d'incertitude. |

---

## Question 1 — Faire parler les personnages à l'oral

### Gemini Live : non, et le motif n'est pas technique

Les *Gemini API Additional Terms of Service* (mise à jour du 23 mars 2026) disent :

> « You must be 18 years of age or older to use the APIs. »
>
> « You also will not use the Services as part of a website, mobile application, or other service [...] that is **directed towards or is likely to be accessed by individuals under the age of 18**. »

Une app en catégorie Enfants de l'App Store, conçue pour des 7-12 ans, est l'exemple type de ce qui est interdit. Ce n'est pas un réglage à contourner ni un filtre technique : c'est le contrat. Le risque est la résiliation du compte et le rejet en revue App Store — donc **une attaque directe sur le critère de succès n°1 : publier**.

Ce seul motif suffit à trancher. Quatre obstacles techniques s'y ajoutent néanmoins, et méritent d'être notés parce qu'ils resteraient vrais même si les conditions changeaient :

- **On perdrait le grounding.** Le raisonnement passerait dans le modèle vocal de Google : tout le travail d'ancrage sur sources vérifiées serait à refaire, et l'argument de différenciation avec.
- **On perdrait la modération avant diffusion.** En temps réel, la transcription de la réponse arrive *en même temps* que l'audio. Impossible de vérifier ce que dit le personnage avant que l'enfant l'entende. Sur du 7-12 ans, c'est disqualifiant.
- **L'infrastructure ne suit pas.** Scaleway Functions, notre cible de déploiement, ne supporte pas les WebSocket (« only HTTP/1.1 and HTTP/2 »). Il faudrait migrer vers des conteneurs.
- **La lecture audio n'a pas de solution en React Native.** Expo SDK 57 n'expose aucune API pour jouer un flux audio brut ; le sujet est toujours ouvert côté Google, sans exemple officiel React Native.

### L'alternative retenue : tout sur l'appareil

```
voix de l'enfant → transcription SUR LE TÉLÉPHONE → texte
    → proxy Claude actuel (ancré, inchangé)
    → texte → lu à voix haute PAR LE TÉLÉPHONE
```

Deux briques natives iOS, exposées par Expo :

- **L'écoute** — `SFSpeechRecognizer`, le moteur de dictée d'Apple, avec l'option `requiresOnDeviceRecognition`. L'audio ne quitte jamais l'appareil. Conséquence agréable : dans ce mode, l'app n'a même pas besoin de la permission « Reconnaissance vocale », seulement du micro.
- **La parole** — `AVSpeechSynthesizer`, la synthèse vocale intégrée d'iOS (celle de VoiceOver et de « Contenu énoncé »). Synthèse locale, aucun réseau, aucune clé API, aucun coût.

### Comparaison

| | Gemini Live | OpenAI Realtime | **On-device (retenu)** |
|---|---|---|---|
| Autorisé pour une app enfants | ❌ interdit | à vérifier | ✅ |
| Notre grounding actuel | à refaire | à refaire | ✅ **intact** |
| Vérifier la réponse avant qu'elle soit dite | ❌ | ❌ | ✅ |
| Coût pour 3 min de conversation | ~0,04 $ | ~0,54 $ | ✅ **0** |
| L'audio de l'enfant sort du téléphone | oui | oui | ✅ **jamais** |
| Latence | ~1 s | ~0,5-1 s | 1,5-3 s |
| Complexité en React Native | élevée | moyenne | ✅ faible |

### Le gain qu'on n'avait pas anticipé

Le détour par l'on-device produit un argument que Gemini Live n'aurait jamais permis :

> **La voix de mon enfant ne quitte jamais le téléphone.**

Aucune API cloud ne peut le dire. Le [one-pager](one-pager.md) identifie la confiance du parent comme aussi importante que le plaisir de l'enfant ; c'est une promesse concrète, vérifiable, et directement adressée à cette confiance. Ce qui était une contrainte devient un argument produit.

Corollaire à noter pour la suite : cette promesse **n'est propre que sur iOS**. Sur Android, le module de synthèse peut router silencieusement le texte vers les serveurs de Google, sans moyen fiable de l'en empêcher. C'est l'une des raisons de l'arbitrage iOS-only ci-dessous.

### Ce qui coince : l'identité vocale des personnages

iOS ne fournit qu'un petit répertoire de voix françaises — Thomas, Audrey, Aurélie, Marie. **Tous les personnages partageraient donc la même voix**, ce qui affaiblit la promesse de « rencontre ».

Atténuations gratuites : répartir par genre (Thomas pour César et Napoléon, Audrey pour Cléopâtre et Marie Curie) et faire varier hauteur et vitesse pour donner une signature à chacun. Ça sépare les personnages ; ça ne les incarne pas.

Deux pièges à connaître : les bonnes voix françaises (dites *Enhanced*) **ne sont pas installées par défaut** — sans elles, on tombe sur une voix compacte franchement robotique, et il ne faut donc pas juger la qualité sur un seul iPhone sans vérifier ce qui y est installé. Et les voix Siri sont inaccessibles aux apps tierces.

**Plan B, s'il s'avère que la voix système casse la magie** — et sans casser la promesse de confidentialité : faire générer la voix par un service cloud appelé **depuis notre serveur**, qui renvoie un fichier audio. Ce qui sort alors, c'est le texte du personnage produit par notre propre serveur — **pas une donnée de l'enfant**. La voix de l'enfant reste sur l'appareil dans tous les cas. Coût de l'ordre de 1 à 6 centimes pour 1 000 répliques, négligeable devant Claude. Levier malin : pré-générer une fois les phrases fixes (accroche du personnage, « le savais-tu ») avec une belle voix et les livrer avec l'app — payé une fois, joué à l'infini.

**Décision v1 : voix système d'abord.** Gratuit, testable immédiatement, et ça répond à la seule question qui ne se tranche pas sur le papier — une voix générique suffit-elle à créer la rencontre ? Le passage au cloud se ferait plus tard en changeant une fonction, pas l'architecture.

---

## Question 2 — Se connecter pour de vrai aux API BnF

### Verdict : elles ne contiennent pas les faits dont Époka a besoin

Tests réels sur data.bnf.fr et Gallica. Quatre constats, tous vérifiés :

**1. Le volume factuel est dérisoire.** Environ six champs par personnage, et une note biographique d'**une seule phrase**, rédigée dans le registre du catalogueur.

| Personnage | Note biographique — texte intégral de la BnF |
|---|---|
| Cléopâtre | « Reine d'Égypte de 51 à 30 av. J.-C. » |
| Jeanne d'Arc | « Béatifiée en 1909 ; canonisée en 1920 » |
| Marie Curie | « Physicienne et chimiste. - Créatrice de l'Institut du radium. - Prix Nobel de physique (1903) [...] et de chimie (1911) » |

Celle de Jeanne d'Arc ne dit même pas qui elle était.

**2. Les faits les plus intéressants sont précisément ceux que l'API ignore.** Sur les quatre faits actuellement curés pour Cléopâtre :

| Fait curé | Présent dans l'API ? |
|---|---|
| Reine d'Égypte de 51 à 30 av. J.-C., dernière des Ptolémées | ⚠️ moitié — « dernière des Ptolémées » est absent |
| Née en 69, morte en 30 av. J.-C. | ✅ |
| Parlait plusieurs langues, dont le grec et l'égyptien | ❌ **absent** |
| S'est alliée à Rome, avec César puis Marc Antoine | ❌ **absent** |

Les deux faits absents sont exactement ceux qui permettent une conversation. **Brancher l'API en remplacement du corpus curé appauvrirait le personnage.**

**3. Un champ est faux, et dangereusement.** Le bloc de données structurées présent dans les pages HTML de data.bnf.fr — celui que [`sources.md`](sources.md) recommande — contient `birthPlace: "Paris"` **codé en dur pour tout le monde**. Vérifié sur cinq personnages :

```
Cléopâtre        → birthPlace = "Paris"
Marie Curie      → birthPlace = "Paris"
Jeanne d'Arc     → birthPlace = "Paris"
Napoléon Ier     → birthPlace = "Paris"
Léonard de Vinci → birthPlace = "Paris"
```

Les données RDF, elles, sont correctes : Alexandrie, Varsovie, Domremy, Ajaccio, Anchiano. Mais sur une app qui promet « zéro hallucination » à des parents, brancher ce bloc ferait dire à Marie Curie qu'elle est née à Paris — **une affirmation fausse portant le tampon de la BnF**, donc invérifiable par un parent. C'est le pire scénario possible pour notre promesse.

**4. La recherche d'images ne trouve pas les bonnes images.** Une recherche « Cléopâtre » dans Gallica renvoie, sur les huit premiers résultats en images, **huit photographies du ballet des Ballets Russes de 1913**. Une danseuse suédoise en costume de scène. Zéro Égypte antique.

### Ce à quoi ces API servent réellement

Le verdict n'est pas « inutiles ». Il est « pas pour ça ». Deux usages solides :

- **La provenance.** L'ARK est un identifiant pérenne, la notice d'autorité est publiquement consultable, et elle est reliée aux référentiels internationaux (VIAF, ISNI). Aujourd'hui, notre champ `sources` pointe vers la page d'accueil de Gallica — qui ne prouve rien. Il peut devenir une référence vérifiable au document près.
- **La vérification automatisée.** Les dates et lieux du corpus curé peuvent être **comparés programmatiquement** aux notices BnF, avec une alerte en cas de divergence. Ce n'est pas de la génération de faits : c'est un test de régression sur des faits historiques. Défendable en entretien, et plus original qu'un simple appel d'API.

Point d'architecture qui en découle : **ces appels ne doivent jamais se trouver dans le chemin de requête du chat.** L'endpoint n'affiche aucune garantie de service et a renvoyé une erreur pendant les tests. Ils tournent à la curation, hors ligne. L'app ne dépend jamais de la BnF à l'exécution.

### La conclusion à assumer

[`sources.md`](sources.md) présente le corpus curé manuellement comme un « Plan B assumé ». **Ce n'était pas un plan B — c'est le seul plan viable.** Les API le complètent par la preuve et la vérification ; elles ne le remplacent pas.

Ce n'est pas un échec : le récit « sources institutionnelles, zéro hallucination » tient toujours, et il tient même mieux, parce qu'un humain relit chaque fait — ce qui est précisément ce qui aurait évité le piège du `birthPlace`.

---

## Question 3 — La structure de code

La question la plus simple des trois, et la seule sans mauvaise surprise.

- **Navigation :** `expo-router` est le choix recommandé par défaut en SDK 57. Cinq packages, trois lignes de configuration, aucun réglage exotique. Il apporte le geste retour, les transitions natives et les en-têtes — tout ce qu'il faudrait sinon recoder.
- **Structure cible :** sept fichiers, organisés par écran (Collection, Fiche, Conversation), plus un module pour les appels réseau et un pour la persistance. Volontairement **pas** de dossiers « composants » ou « hooks » : on les créera à la première duplication réelle.
- **Persistance :** le module SQLite d'Expo propose une API clé-valeur simple, suffisante pour mémoriser les cartes débloquées.
- **Le seul vrai arbitrage :** où vit le corpus. La tentation serait de recopier les infos des personnages dans l'app pour afficher la grille. Mauvaise idée — deux copies finissent par diverger, et un jour la carte affiche une date que le personnage contredit à l'oral. **L'app demandera la liste au serveur.** Une seule source de vérité.

---

## Ce que ces tests corrigent dans nos docs

Trois affirmations déjà écrites dans [`sources.md`](sources.md) et [`decisions-log.md`](decisions-log.md) sont démenties par les tests. Elles sont signalées ici mais **pas encore corrigées** : ce doc établit les faits, les corrections suivront une fois les verdicts arbitrés.

| Ce qui est écrit | Ce que montrent les tests |
|---|---|
| `sources.md` — « pas de SPARQL public exploitable en l'état » | **Faux.** L'endpoint `https://data.bnf.fr/sparql` répond, sans clé. Le piège est le slash final : `/sparql/` sert l'éditeur web interactif, `/sparql` est l'endpoint machine. |
| `sources.md`, `decisions-log.md` #4 — Gallica « nécessite un User-Agent de type navigateur » | **Imprécis.** Seule la signature de `curl` est bloquée ; un identifiant applicatif honnête comme `EpokaApp/1.0` passe. Pas besoin d'usurper un navigateur — préférable pour une app publiée. |
| `decisions-log.md` #4 — Wikidata nécessaire comme annuaire pour retrouver l'ARK | **Contournable.** Une recherche par nom fonctionne directement en SPARQL sur data.bnf.fr, et **désambiguïse mieux** : les dates figurent dans le libellé, ce qui distingue Cléopâtre VII de Cléopâtre Ire. Wikidata, lui, confond « Jeanne d'Arc » la sainte avec une partition de Maurice Jaubert portant le même titre. |

Le troisième point a une valeur qui dépasse la correction technique : la décision #4 écartait Wikidata comme source *tout en en dépendant techniquement*. Cette contradiction se referme — la chaîne devient **100 % institutionnelle**, sans exception à justifier.

À ajouter également dans `sources.md` : un avertissement explicite contre le bloc de données HTML et son `birthPlace` erroné.

---

## Arbitrages de périmètre

Deux décisions prises à la lumière de cette étude. Elles suppriment les zones de risque les plus lourdes.

### Pas d'images en v1

Les cartes seront typographiques.

**Ce que ça supprime :** le seul risque juridique du projet. Les *métadonnées* BnF sont en Licence Ouverte (libres, usage commercial inclus), mais les **images ne le sont pas** — « la réutilisation commerciale est payante et fait l'objet d'une licence », avec une clause spécifique visant l'IA générative, gratuite uniquement pour la recherche académique non lucrative. Ce mur disparaît du chemin de la v1. Bénéfice secondaire : le champ image de data.bnf.fr pointe vers Wikimedia Commons, source collaborative que la décision #4 écarte explicitement — ne pas l'utiliser referme aussi cette incohérence.

**Ce que ça coûte :** la carte doit rester désirable pour un enfant de huit ans sans illustration, alors que c'est le moteur de collection, donc de rétention. Proposition la moins coûteuse : **une couleur par époque**, un grand glyphe, une typographie forte, et l'état verrouillé en gris. Bénéfice inattendu — le code couleur par époque sert directement le point 5 de la boucle du one-pager (« situer » : Antiquité, Moyen Âge…), qui n'avait jusqu'ici aucun support visuel. À valider à l'œil sur la grille.

### iOS uniquement en v1

**Ce que ça supprime :** tout le volet Android du pipeline oral, qui était le plus fragile. Sur Android, le module de synthèse n'expose pas l'information permettant de savoir si une voix nécessite le réseau — le texte du personnage pouvait donc partir chez Google sans moyen fiable de l'empêcher. S'y ajoutaient un plafond de longueur avec échec silencieux, la reconnaissance sur l'appareil réservée aux versions récentes, et un modèle vocal français que l'utilisateur devait télécharger lui-même.

Sur iOS, rien de tout ça. **La promesse « la voix de mon enfant ne quitte jamais le téléphone » devient vraie sans astérisque** — ce qui est précisément l'argument le plus fort dégagé par cette étude.

**Ce que ça coûte :** la moitié du marché mobile. Acceptable au regard du critère n°1, qui vise l'App Store.

---

## Ce qui reste ouvert

Par ordre de gravité. Le premier point conditionne tous les autres.

### 1. Les conditions d'utilisation d'Anthropic — non vérifiées

La découverte que Gemini interdit contractuellement les apps destinées aux mineurs pose mécaniquement la question pour Claude. **Cette vérification n'a pas été menée à son terme.**

Elle concerne **le montage actuel** — app Kids 7-12 ans appelant l'API Claude derrière un proxy — et pas seulement la question de l'oral. Si une clause équivalente existe, elle remet en cause l'architecture du produit bien plus profondément que le choix d'une techno vocale.

**À lever avant tout engagement de développement.** Estimation : quinze minutes.

### 2. Les règles Apple sur l'IA générative pour mineurs

À instruire en même temps : les règles de revue 1.3 (catégorie Enfants) et 5.1.4 (données d'enfants transmises à des tiers), ainsi que les durcissements récents d'Apple sur l'IA générative destinée aux mineurs. Maintenant que la v1 est iOS-only, c'est le risque principal pesant sur le critère de succès n°1.

Question annexe utile : existe-t-il des apps de chat IA effectivement publiées en catégorie Enfants ? Leur existence dirait si le chemin est praticable, et comment elles se positionnent.

### 3. La précision de la reconnaissance vocale sur une voix d'enfant en français

Le risque produit central de l'oral, et **il n'existe aucune donnée publique** sur ce moteur en français avec des voix d'enfants. La littérature générale donne 15 à 21 % d'erreurs sur des 6-10 ans.

Si Cléopâtre comprend une question sur deux, l'oral est mort — et il faut le savoir avant d'avoir construit autour. **Un test de 30 minutes le tranche** : dicter dix questions d'enfant sur un iPhone physique (le micro ne fonctionne pas de façon fiable en simulateur) et compter les transcriptions exploitables. Seuil proposé : **en dessous de 8/10, on renonce** et l'oral attend la v2.

Deux conséquences irréversibles à assumer avant de lancer ce test : le module de reconnaissance impose un *development build*, donc **la perte d'Expo Go pour tout le projet** et une itération un peu plus lourde ; et un minimum d'iOS 16.4.

### Rappel du garde-fou

[`scope-v1.md`](scope-v1.md) classe explicitement la voix **hors v1**. L'intégrer est donc un changement de périmètre, à assumer comme tel.

Il se défend : l'oral sert le critère n°4 (l'IA au cœur du concept) et lève une vraie barrière d'usage pour des enfants de 7-9 ans qui tapent mal. Mais il repousse le critère n°1. Le garde-fou anti-dérive du one-pager s'applique sans exception : **si le test ci-dessus échoue ou traîne, l'oral attend la v2** et on reprend la Phase 2 (Collection et persistance).

---

## Suite proposée

1. **Lever le point ouvert n°1** (conditions Anthropic) — avant tout le reste.
2. **La structure de code** — fondation sans risque, débloque tout le reste.
3. **La connexion BnF** — provenance et vérification automatisée des faits.
4. **Le test oral de 30 minutes**, puis l'oral seulement s'il passe.

### Décisions à consigner

Cette étude produit cinq décisions à ajouter au [journal](decisions-log.md) une fois arbitrées :

| # | Décision |
|---|---|
| 6 | Renoncer à Gemini Live au profit d'un pipeline oral sur l'appareil — motif contractuel, pas technique |
| 7 | Les API BnF servent la provenance et la vérification, pas la production de faits |
| 8 | `expo-router` et corpus servi par le proxy — une seule source de vérité |
| 9 | Pas d'images en v1 |
| 10 | iOS uniquement en v1 |

---

## Références

- Gemini API Additional Terms of Service (MAJ 23/03/2026) — <https://ai.google.dev/gemini-api/terms>
- Documentation Expo SDK 57.0.0 — <https://docs.expo.dev/versions/v57.0.0/>
- Endpoint SPARQL data.bnf.fr — <https://data.bnf.fr/sparql> (sans slash final)
- Conditions de réutilisation des contenus Gallica — <https://gallica.bnf.fr/edit/und/conditions-dutilisation-des-contenus-de-gallica>
- Conditions de réutilisation des données de la BnF (Licence Ouverte) — <https://www.bnf.fr/fr/conditions-de-reutilisations-des-donnees-de-la-bnf>
