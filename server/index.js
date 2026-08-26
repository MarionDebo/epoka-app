/**
 * Époka — serveur de dev local pour le proxy IA.
 * En production, cette même logique (chat.js) est déployée sur Scaleway Functions.
 */
import cors from "cors";
import express from "express";
import { chat } from "./history-chat.js";

try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // .env absent : les variables sont déjà dans l'environnement (CI, Scaleway...).
}

const app = express();
app.use(cors()); // dev local uniquement (Expo web / simulateur) — à restreindre en prod
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const result = await chat(req.body ?? {});
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message });
  }
});

const port = process.env.PORT ?? 8787;
app.listen(port, () => {
  console.log(`Époka proxy — http://localhost:${port}`);
});
