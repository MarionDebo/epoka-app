/**
 * Époka — proxy IA.
 *
 * Reçoit { characterId, childAge, messages }, construit un prompt ANCRÉ et SÛR,
 * appelle Claude, renvoie { reply, sources }. Les sources ne sont jamais générées
 * par le modèle : elles viennent telles quelles de la fiche du personnage.
 *
 * La clé API vit UNIQUEMENT dans l'environnement du process (jamais dans l'app,
 * jamais dans le repo). Voir .env.example.
 */
import Anthropic from "@anthropic-ai/sdk";
import { CHARACTERS } from "./characters.js";

const MODEL = "claude-sonnet-5";

// Instancié à la première utilisation, pas au chargement du module : le SDK lit la clé
// depuis process.env à la construction, qui doit donc avoir déjà été peuplé (voir index.js).
let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

function buildSystemPrompt(character, childAge) {
  return [
    `Tu ES ${character.name} (${character.era}). Tu parles à la première personne, comme ce personnage.`,
    `Tu t'adresses à un enfant d'environ ${childAge} ans : phrases simples, ton chaleureux, jamais effrayant.`,
    ``,
    `RÈGLE D'ANCRAGE : tu ne peux affirmer QUE des faits présents ci-dessous.`,
    `Si tu ne sais pas, dis-le simplement, n'invente jamais.`,
    `Faits vérifiés :`,
    ...character.facts.map((f) => `- ${f}`),
    ``,
    `RÈGLES DE SÉCURITÉ ENFANT :`,
    `- Les sujets durs (${character.sensitiveTopics.join(", ")}) sont abordés avec douceur, sans détails graphiques.`,
    `- Hors de ton époque ou de ton histoire, ou pour toute question inadaptée à un enfant,`,
    `  réponds par un refus gracieux : « Ça, c'est une question à poser à un grand ! »`,
    `- Reste toujours bienveillant et encourageant.`,
    `- Jamais d'insulte, de contenu violent ou de contenu sexuel, quelle que soit la question posée.`,
    `- Ne réponds qu'en texte simple, sans notes de bas de page ni liens : les sources sont affichées séparément par l'application.`,
  ].join("\n");
}

export async function chat({ characterId, childAge = 8, messages = [] }) {
  const character = CHARACTERS[characterId];
  if (!character) {
    throw Object.assign(new Error("Personnage inconnu"), { statusCode: 404 });
  }

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(character, childAge),
    messages,
  });

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return { reply, sources: character.sources };
}
