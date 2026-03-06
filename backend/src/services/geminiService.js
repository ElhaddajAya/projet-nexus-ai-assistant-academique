const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecommendation = async ({ filiere, semestre, niveau, difficultes, objectifs, ressources }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Tu es un assistant académique intelligent pour des étudiants de l'EMSI.

Voici le profil de l'étudiant :
- Filière : ${filiere}
- Semestre : ${semestre}
- Niveau : ${niveau || "non précisé"}
- Difficultés : ${difficultes.join(", ")}
- Objectifs : ${objectifs.join(", ")}

Ressources disponibles dans notre base de données :
${ressources.map(r => `- ${r.titre} (${r.type}) : ${r.lien}`).join("\n")}

Génère une réponse JSON avec exactement cette structure :
{
  "plan_travail": "un plan de travail détaillé semaine par semaine",
  "conseils_ia": "des conseils personnalisés pour cet étudiant",
  "ressources_recommandees": ["lien1", "lien2"]
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

module.exports = { generateRecommendation };