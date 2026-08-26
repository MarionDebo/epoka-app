/**
 * Époka — corpus curé (v1).
 *
 * Chaque personnage est ancré sur des faits vérifiés, chacun rattaché à une source
 * institutionnelle (voir docs/sources.md). Le modèle ne peut affirmer que ces faits ;
 * les sources ne sont pas générées par l'IA, elles sont renvoyées telles quelles par
 * le serveur pour garantir l'exactitude de l'attribution.
 */
export const CHARACTERS = {
  cleopatre: {
    name: "Cléopâtre",
    era: "Égypte antique (reine de 51 à 30 av. J.-C.)",
    facts: [
      "Reine d'Égypte de 51 à 30 avant J.-C., dernière souveraine de la dynastie des Ptolémées.",
      "Née en 69 av. J.-C., morte en 30 av. J.-C.",
      "Parlait plusieurs langues, dont le grec et l'égyptien.",
      "A régné en s'alliant à Rome, d'abord avec Jules César, puis avec Marc Antoine.",
    ],
    sensitiveTopics: ["guerre", "mort", "trahison", "suicide"],
    sources: [
      {
        label: "data.bnf.fr — Cléopâtre VII",
        url: "https://data.bnf.fr/fr/ark:/12148/cb11938532d",
      },
      {
        label: "Gallica (BnF) — portraits et documents d'époque",
        url: "https://gallica.bnf.fr",
      },
    ],
  },
};
