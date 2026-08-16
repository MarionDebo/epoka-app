# Epoka — One-pager projet

> *App pour enfants qui transforme l'Histoire en rencontre : « parle » à un personnage historique, découvre-le, collectionne sa carte. Réponses ancrées sur des sources françaises vérifiées.*

---

## Mes critères de réussite *(ma boussole — à relire à chaque arbitrage)*

Ce projet réussit si, et seulement si, il coche **tous** ces points. Toute décision de scope ou de design se juge contre cette liste.

1. **Publié sur l'App Store.** C'est mon critère de succès n°1. Une app réelle, téléchargeable — pas un prototype.
2. **Grand public.** Je sors volontairement de mon profil très B2B ; l'app s'adresse à des familles, pas à des pros.
3. **Secteur éducation.** L'un de mes deux secteurs cibles de recherche d'emploi.
4. **Une touche d'IA, au cœur du concept.** Pour démontrer mon expertise produit sur l'IA — pas un gadget collé dessus.
5. **Réalisable en vibe coding.** Constructible seule, en un temps raisonnable.
6. **Défendable en entretien senior PM / Head of Product.** Chaque décision produit doit se justifier.
7. **Pièce de portfolio.** Montrer ma démarche et ma dimension de *product builder*.

> **Garde-fou anti-dérive :** si une idée d'amélioration ne sert aucun de ces 7 critères — ou repousse le n°1 (publier) — elle attend la v2.

---

## Le problème / l'insight

Pour un enfant, l'Histoire est souvent transmise de façon **passive et abstraite** : des dates, des noms, des pages à lire. Difficile de s'y attacher. Or les enfants adorent **deux choses** que l'école mobilise mal : *poser des questions directement* (« et toi, t'avais peur ? ») et *collectionner*.

En parallèle, les parents cherchent du temps d'écran qui soit **éducatif ET sûr**. Or, lâcher un enfant sur ChatGPT pour « discuter avec Napoléon », c'est : pas sûr (propos inappropriés, hallucinations), pas sourcé, pas adapté à son âge, et pas ludique.

**L'insight :** transformer les personnages historiques en **interlocuteurs vivants, sûrs et sourcés**, dans une boucle de **collection** qui donne envie d'en découvrir toujours un de plus.

## L'utilisateur cible

- **L'enfant (≈ 7-12 ans)** — l'utilisateur : curieux, joueur, sensible à la découverte et à la collection.
- **Le parent** — le prescripteur et le payeur : il installe, il paie, et il ne le fait que s'il **fait confiance** (sécurité, justesse, absence de dérive). Concevoir pour gagner *sa* confiance est aussi important que ravir l'enfant.

## Le concept

**Une app où l'enfant « interroge » des personnages historiques, dont les réponses sont ancrées sur des sources françaises vérifiées, et où chaque personnage découvert devient une carte à collectionner.**

La boucle centrale :
1. **Découvrir** — l'enfant débloque / choisit un personnage (Cléopâtre, Marie Curie, Jules César…).
2. **Interroger** — il lui pose des questions ; le personnage répond *dans son rôle*, à hauteur d'enfant, en s'appuyant sur des faits vérifiés.
3. **Collectionner** — la rencontre débloque la **carte** du personnage (façon Pokémon) : illustration, dates clés, « le savais-tu ». La collection se remplit.
4. **Recommencer** — la carte suivante donne envie de continuer.

## La touche IA & sa défendabilité *(« pourquoi pas ChatGPT ? »)*

L'IA n'est pas un chatbot brut : c'est un **personnage joué, borné et ancré**.
- **Grounding sur sources vérifiées** = la réponse produit clé. Le modèle ne « raconte » pas librement : il s'appuie sur un corpus de faits validés → **anti-hallucination**, argument central de mon récit d'expertise IA.
- **Persistance** (la collection, la progression) : un fil ChatGPT oublie tout ; ici la valeur s'accumule.
- **Sécurité et cadrage enfant** : ton, périmètre, sujets — impossibles à garantir sur un chat généraliste.
- **Sources françaises** et expérience native pensée pour un enfant.

## La gamification (boucle de rétention)

La collection de cartes est le moteur d'engagement : découverte, complétion, « il m'en manque un ». C'est ce qui transforme une nouveauté amusante en **usage répété** — la dimension rétention que je pourrai défendre en entretien.

## Les sources / le grounding *(à valider en priorité)*

Ancrer les réponses sur des références fiables. Pistes à évaluer : ressources patrimoniales et éducatives françaises (BnF / Gallica, data.bnf.fr, Éduthèque, Wikidata). **Plan B assumé et tout aussi solide :** un **corpus curé** de 30-50 personnages, chaque fiche construite à partir de sources fiables, sur lequel l'IA est strictement ancrée. Le récit « sources vérifiées, zéro hallucination » tient dans les deux cas.

## Les enjeux (risques à résoudre)

- **Sécurité du contenu pour enfants.** Le risque produit central. Comment un personnage historique parle-t-il à un enfant de sujets durs (guerre, mort, esclavage, violence) ? Il faut un **périmètre de sujets**, un ton adapté à l'âge, une modération, et un refus gracieux hors-cadre. C'est *le* sujet à traiter — et un formidable point d'entretien.
- **Exactitude historique.** Le grounding limite l'hallucination, mais les anachronismes et approximations restent à surveiller (le personnage « en rôle » ne doit pas inventer).
- **Kids Category App Store.** Règles strictes (voir Contraintes) : c'est ce qui conditionne mon critère n°1.
- **Rétention au-delà de la nouveauté.** La collection doit vraiment donner envie de revenir, pas juste faire « waouh » une fois.
- **Coût & latence de l'IA.** Chaque conversation a un coût ; à cadrer (réponses courtes, corpus local, modèle léger).

## Les contraintes

- **App Store — Kids Category.** Confidentialité renforcée, **pas de tracking ni de collecte de données** d'enfants, pas de pub tierce, **parental gate** avant tout achat ou lien sortant. À intégrer *dès la conception*, pas à la fin.
- **RGPD / données de mineurs.** Collecte minimale, consentement parental, transparence.
- **Build solo en vibe coding.** Expo / React Native ; IA appelée **derrière un proxy serverless (Scaleway)** — clé API jamais dans l'app ; grounding via corpus local ou API ; stockage local de la collection.
- **Coût / latence.** Compression des échanges, réponses bornées, modèle multimodal léger.

## Le pari de différenciation

> **L'app française, sourcée et sûre, qui transforme l'Histoire en rencontre et en collection — là où ChatGPT n'est ni sûr, ni sourcé, ni ludique, et où les contenus éducatifs classiques restent passifs.**

Ce n'est pas « un chatbot historique de plus » : c'est un produit *conçu pour la confiance du parent et le plaisir de l'enfant*, avec l'ancrage sur sources comme signature.

## Périmètre v1 (assumé)

**Dans :**
- 8-12 personnages pour commencer, ancrés sur un corpus curé
- la boucle : découvrir → interroger → débloquer la carte → collectionner
- garde-fous de sécurité enfant (périmètre de sujets, ton, refus gracieux)
- collection persistante en local
- parental gate + conformité Kids Category de base

**Hors v1 (reporté) :**
comptes cloud, mode multijoueur/échange de cartes, génération d'illustrations à la volée, audio/voix des personnages, catalogue étendu, quêtes/défis avancés, personnalisation poussée.

## Métrique nord

**Nombre de personnages « rencontrés » (carte débloquée) par enfant et par semaine** — la valeur : de l'Histoire réellement découverte, pas juste des messages envoyés. Activation : *% de nouveaux qui débloquent une première carte dès la 1re session.*

## Le « moment démo » (pour l'entretien & le portfolio)

Un enfant tape « Cléopâtre, tu avais peur des Romains ? » → Cléopâtre répond *en personnage*, justement et à sa hauteur → une **carte animée se débloque** et rejoint la collection. Dix secondes, et toute ma thèse est là : IA ancrée + sécurité enfant + boucle de collection.

---

### Prochaines étapes (aujourd'hui)
1. **Dé-risquer les sources** (API vs corpus curé).
2. **Mockups** des 3 écrans clés : la Collection, la Fiche/Carte personnage, la Conversation.
3. **Scaffold du repo** (Expo + structure + proxy IA).
