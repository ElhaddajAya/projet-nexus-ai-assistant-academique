const Groq = require("groq-sdk");

// Initialiser le client Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Fonction pour générer la recommandation complète ─────────────────────────
const generateRecommendation = async ({
    filiere, semestre, niveau, difficultes,
    objectifs, ressources, module, matiere
}) =>
{
    // Préparer la liste des ressources pour le prompt
    const ressourcesText = ressources.length > 0
        ? ressources.map(r => `• [${r.type.toUpperCase()}] ${r.titre} → ${r.lien}`).join("\n")
        : "Aucune ressource disponible.";

    // System prompt — force une réponse JSON pure
    const systemPrompt = `Tu es OrientAI, un assistant académique expert pour les étudiants de l'école marocaine des sciences de l'ingénieur (EMSI).
    Tu réponds TOUJOURS et UNIQUEMENT avec un objet JSON valide.
    Tu ne mets JAMAIS de texte avant ou après le JSON.
    Tu ne mets JAMAIS de balises markdown comme \`\`\`json.
    Ta réponse doit commencer par { et finir par }.`;

    // User prompt — profil complet + structure JSON avec analyse enrichie
    const userPrompt = `Voici le profil complet de l'étudiant :
    - Filière  : ${filiere}
    - Module   : ${module || "non précisé"}
    - Matière  : ${matiere || "non précisée"}
    - Semestre : ${semestre}
    - Niveau   : ${niveau || "non précisé"}
    - Difficultés déclarées : ${difficultes.join(", ")}
    - Objectifs visés : ${objectifs.join(", ")}

    Ressources pédagogiques disponibles pour cette matière :
    ${ressourcesText}

    Génère une réponse avec EXACTEMENT cette structure JSON.

    INSTRUCTIONS IMPORTANTES pour chaque champ :

    "analyse" : Rédige 4 à 6 phrases bien structurées couvrant :
      (1) Le niveau général de l'étudiant dans cette matière
      (2) Une analyse précise de ses difficultés spécifiques et leur impact sur sa progression
      (3) Les points forts ou acquis à exploiter
      (4) Une recommandation générale personnalisée et motivante

    "plan_travail" : 4 étapes concrètes et progressives, chacune avec un titre clair,
      une durée réaliste et une description détaillée et actionnable (2-3 phrases minimum).

    "conseils_ia" : 4 à 5 conseils pratiques, spécifiques aux difficultés déclarées,
      chaque conseil doit être directement applicable et pas générique.

    "ressources_recommandees" : Sélectionne UNIQUEMENT parmi les ressources disponibles listées (types disponibles : document, TP/TD, video, site web).
      Ne génère pas de fausses ressources.

    {
      "analyse": "4 à 6 phrases structurées couvrant niveau, difficultés, points forts et recommandation",
      "note_progression": 55,
      "plan_travail": [
        {
          "step": 1,
          "titre": "Titre court et clair de l étape",
          "duree": "Jours 1-2",
          "desc": "Description détaillée et actionnable. Minimum 2 phrases concrètes."
        },
        {
          "step": 2,
          "titre": "Titre court et clair",
          "duree": "Jours 3-5",
          "desc": "Description détaillée et actionnable. Minimum 2 phrases concrètes."
        },
        {
          "step": 3,
          "titre": "Titre court et clair",
          "duree": "Jours 6-8",
          "desc": "Description détaillée et actionnable. Minimum 2 phrases concrètes."
        },
        {
          "step": 4,
          "titre": "Titre court et clair",
          "duree": "Jours 9-10",
          "desc": "Description détaillée et actionnable. Minimum 2 phrases concrètes."
        }
      ],
      "conseils_ia": [
        "Conseil 1 spécifique à une difficulté déclarée directement applicable",
        "Conseil 2 spécifique à une difficulté déclarée directement applicable",
        "Conseil 3 spécifique à une difficulté déclarée directement applicable",
        "Conseil 4 spécifique aux objectifs de l étudiant",
        "Conseil 5 de méthode de travail adapté au niveau"
      ],
      "ressources_recommandees": [
        {
          "titre": "Titre exact depuis la liste disponible",
          "lien": "https://lien-exact-depuis-la-liste",
          "type": "... (document, video, tp/td, site web)"
        }
      ]
    }

    Pour note_progression : entier entre 0 et 100 basé sur les difficultés déclarées.
    Peu de difficultés fondamentales = note haute, beaucoup = note basse.
    Exemples : débutant complet = 10-25, bases acquises = 30-50, intermédiaire = 55-75, avancé = 80-95.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 2500,
        response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Valider note_progression
    if (
        typeof parsed.note_progression !== "number" ||
        parsed.note_progression < 0 ||
        parsed.note_progression > 100
    )
    {
        parsed.note_progression = 50;
    }
    parsed.note_progression = Math.round(parsed.note_progression);

    return parsed;
};

// ─── Fonction pour les questions de suivi (chat) ──────────────────────────────
const askFollowUp = async ({ question, recommendation, submission }) =>
{

    // System prompt amélioré — structure bullet points obligatoire
    const systemPrompt = `Tu es OrientAI, un assistant académique pour les étudiants de l'EMSI.
    Tu réponds UNIQUEMENT aux questions liées au profil académique de l'étudiant,
    à son plan d'apprentissage, ses ressources, ou sa matière.
    Si la question est hors sujet, réponds poliment que tu ne peux répondre
    qu'aux questions académiques liées à son profil.

    LANGUE : Français uniquement. Ton encourageant et professionnel.

    FORMAT DE RÉPONSE OBLIGATOIRE — respecte toujours cette structure :
    1. Une phrase d'introduction courte qui répond directement à la question (1 phrase max)
    2. Des bullet points avec le symbole • pour les étapes, conseils ou détails :
       - Chaque bullet point : court, précis, actionnable (1-2 phrases maximum)
       - Entre 3 et 5 bullet points selon la complexité
    3. Une phrase de conclusion courte et motivante si pertinent

    N'écris JAMAIS de longs paragraphes continus.
    N'utilise JAMAIS de titres markdown comme ## ou **.
    Utilise UNIQUEMENT le symbole • pour les listes.`;

    const userPrompt = `Contexte de l'étudiant :
    - Filière  : ${submission.filiereId?.nom_filiere || "non précisé"}
    - Matière  : ${submission.matiereId?.nom_matiere || "non précisé"}
    - Difficultés : ${submission.difficultes?.join(", ")}
    - Objectifs   : ${submission.objectifs?.join(", ")}

    Analyse de son profil : ${recommendation.analyse}

    Son plan d'apprentissage :
    ${recommendation.plan_travail.map(p => `Étape ${p.step} — ${p.titre} (${p.duree}) : ${p.desc}`).join("\n")}

    Ressources recommandées :
    ${recommendation.ressources_recommandees.map(r => `• ${r.titre} → ${r.lien}`).join("\n")}

    Question de l'étudiant : "${question}"

    Réponds directement à sa question avec le format bullet points.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 600,
    });

    return response.choices[0].message.content;
};

module.exports = { generateRecommendation, askFollowUp };