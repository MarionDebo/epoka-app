/**
 * Époka — proxy IA (STUB / EXEMPLE, non fonctionnel en l'état).
 *
 * Rôle : recevoir { characterId, childAge, messages } depuis l'app,
 * construire un prompt ANCRÉ et SÛR, appeler le modèle, renvoyer la réponse.
 *
 * La clé API vit UNIQUEMENT dans l'environnement de la fonction (jamais dans l'app,
 * jamais dans le repo). Voir .env.example.
 *
 * Cible de déploiement : Scaleway Functions (Node).
 */

// En v1, le grounding vient d'un corpus curé local (fiches vérifiées).
// Ici, une fiche d'exemple minimale pour illustrer la structure.
const CHARACTERS = {
  cleopatre: {
    name: "Cléopâtre",
    era: "Égypte antique, Ier siècle av. J.-C.",
    // Faits vérifiés servant de socle : le personnage ne doit rien affirmer au-delà.
    facts: [
      "Dernière souveraine de la dynastie des Ptolémées en Égypte.",
      "Parlait plusieurs langues, dont le grec et l'égyptien.",
      "A régné en s'alliant à Rome (Jules César, puis Marc Antoine).",
    ],
    // Sujets sensibles bornés pour un enfant (ton adapté, profondeur limitée).
    sensitiveTopics: ["guerre", "mort", "trahison"],
  },
};

function buildSystemPrompt(character, childAge) {
  return [
    `Tu ES ${character.name} (${character.era}). Tu parles à la première personne, comme ce personnage.`,
    `Tu t'adresses à un enfant d'environ ${childAge} ans : phrases simples, ton chaleureux, jamais effrayant.`,
    ``,
    `RÈGLE D'ANCRAGE : tu ne peux affirmer QUE des faits présents ci-dessous. `,
    `Si tu ne sais pas, dis-le simplement, n'invente jamais.`,
    `Faits vérifiés :`,
    ...character.facts.map((f) => `- ${f}`),
    ``,
    `RÈGLES DE SÉCURITÉ ENFANT :`,
    `- Les sujets durs (guerre, mort, violence) sont abordés avec douceur, sans détails graphiques.`,
    `- Hors de ton époque ou de ton histoire, ou pour toute question inadaptée à un enfant, `,
    `  réponds par un refus gracieux : « Ça, c'est une question à poser à un grand ! »`,
    `- Reste toujours bienveillant et encourageant.`,
  ].join("\n");
}

// Handler serverless (signature à adapter à Scaleway Functions).
export async function handle(event) {
  const { characterId, childAge = 8, messages = [] } = JSON.parse(event.body || "{}");

  const character = CHARACTERS[characterId];
  if (!character) {
    return { statusCode: 404, body: JSON.stringify({ error: "Personnage inconnu" }) };
  }

  const systemPrompt = buildSystemPrompt(character, childAge);

  // TODO : appeler le provider IA choisi, avec la clé lue dans process.env.
  // La clé N'APPARAÎT PAS dans le repo — elle est injectée à l'exécution.
  //
  // const response = await fetch(process.env.AI_API_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${process.env.AI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: process.env.AI_MODEL,
  //     messages: [{ role: "system", content: systemPrompt }, ...messages],
  //     max_tokens: 300, // réponses bornées (coût/latence)
  //   }),
  // });
  // const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      stub: true,
      note: "Remplace ce bloc par l'appel réel au provider IA.",
      systemPromptPreview: systemPrompt,
    }),
  };
}
