const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecommendation = async ({
  filiere, semestre, niveau, difficultes,
  objectifs, ressources, module, matiere
}) =>
{

  const prompt = `
Tu es OrientAI, un assistant académique intelligent et bienveillant 
spécialisé pour les étudiants de l'EMSI (École Marocaine des Sciences 
de l'Ingénieur).

═══════════════════════════════════════
PROFIL DE L'ÉTUDIANT
═══════════════════════════════════════
- Filière     : ${filiere}
- Module      : ${module || "non précisé"}
- Matière     : ${matiere || "non précisée"}
- Semestre    : ${semestre}
- Niveau      : ${niveau || "non précisé"}

Difficultés rencontrées :
${difficultes.map(d => `  • ${d}`).join("\n")}

Objectifs visés :
${objectifs.map(o => `  • ${o}`).join("\n")}

═══════════════════════════════════════
RESSOURCES DISPONIBLES
═══════════════════════════════════════
${ressources.length > 0
      ? ressources.map(r => `  • [${r.type.toUpperCase()}] ${r.titre} → ${r.lien}`).join("\n")
      : "  Aucune ressource disponible pour cette matière."
    }

═══════════════════════════════════════
INSTRUCTIONS
═══════════════════════════════════════
Génère une analyse académique personnalisée et un plan d'action concret.
Sois précis, encourageant, et adapte ton langage à un étudiant ingénieur.

Réponds UNIQUEMENT avec ce JSON (aucun texte avant ou après) :

{
  "plan_travail": "Plan semaine par semaine très détaillé. Pour chaque semaine : objectif clair, activités concrètes, et ressources à utiliser. Minimum 4 semaines.",
  "conseils_ia": "3 à 5 conseils personnalisés et actionnables basés sur les difficultés spécifiques de l'étudiant.",
  "ressources_recommandees": ["uniquement les liens des ressources listées ci-dessus, classés par priorité"]
}
`;

  module.exports = { generateRecommendation };