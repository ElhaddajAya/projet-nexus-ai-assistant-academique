const Groq = require("groq-sdk");

// Initialiser le client Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateRecommendation = async ({
    filiere, semestre, niveau, difficultes,
    objectifs, ressources, module, matiere
}) =>
{

    // Préparer la liste des ressources pour le prompt
    const ressourcesText = ressources.length > 0
        ? ressources.map(r => `• [${r.type.toUpperCase()}] ${r.titre} → ${r.lien}`).join("\n")
        : "Aucune ressource disponible.";

    // Le system prompt force le modèle à répondre UNIQUEMENT en JSON
    const systemPrompt = `Tu es OrientAI, un assistant académique pour les étudiants de l'EMSI.
    Tu réponds TOUJOURS et UNIQUEMENT avec un objet JSON valide.
    Tu ne mets JAMAIS de texte avant ou après le JSON.
    Tu ne mets JAMAIS de balises markdown comme \`\`\`json.
    Ta réponse doit commencer par { et finir par }.`;

    // Le user prompt contient le profil et la structure JSON attendue
    const userPrompt = `Voici le profil de l'étudiant :
    - Filière  : ${filiere}
    - Module   : ${module || "non précisé"}
    - Matière  : ${matiere || "non précisée"}
    - Semestre : ${semestre}
    - Niveau   : ${niveau || "non précisé"}
    - Difficultés : ${difficultes.join(", ")}
    - Objectifs   : ${objectifs.join(", ")}

    Ressources disponibles :
    ${ressourcesText}

    Génère une réponse avec EXACTEMENT cette structure JSON.
    Respecte les types : analyse est une string, plan_travail est un array d'objets, conseils_ia est un array de strings, ressources_recommandees est un array d'objets.

    {
    "analyse": "2 à 3 phrases décrivant le profil académique de l'étudiant, ses difficultés principales et ses points forts",
    "plan_travail": [
        {
        "step": 1,
        "titre": "Titre court de l'étape",
        "duree": "Jours 1-2",
        "desc": "Description concrète de ce que l'étudiant doit faire durant cette étape"
        },
        {
        "step": 2,
        "titre": "Titre court de l'étape",
        "duree": "Jours 3-5",
        "desc": "Description concrète"
        },
        {
        "step": 3,
        "titre": "Titre court de l'étape",
        "duree": "Jours 6-8",
        "desc": "Description concrète"
        },
        {
        "step": 4,
        "titre": "Titre court de l'étape",
        "duree": "Jours 9-10",
        "desc": "Description concrète"
        }
    ],
    "conseils_ia": [
        "Premier conseil pratique et actionnable",
        "Deuxième conseil pratique et actionnable",
        "Troisième conseil pratique et actionnable"
    ],
    "ressources_recommandees": [
        {
        "titre": "Titre exact de la ressource",
        "lien": "https://lien-exact-de-la-ressource",
        "type": "video"
        },
        {
        "titre": "Titre exact de la ressource",
        "lien": "https://lien-exact-de-la-ressource",
        "type": "document"
        }
    ]
    }`;

    // Appel à Groq avec system + user messages séparés
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.3,      // plus bas = plus prévisible et structuré
        max_tokens: 2000,
        response_format: { type: "json_object" }, // force le JSON côté Groq
    });

    // Extraire et parser la réponse
    const text = response.choices[0].message.content;

    // Nettoyer au cas où il y aurait quand même des backticks
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
};

module.exports = { generateRecommendation };