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
  // On inclut la description pour aider Groq à faire un choix pertinent
  const ressourcesText = ressources.length > 0
    ? ressources.map(r =>
      `• [${r.type.toUpperCase()}] ${r.titre}${r.description ? ` — ${r.description}` : ""} → ${r.lien}`
    ).join("\n")
    : "Aucune ressource disponible.";

  // System prompt — force une réponse JSON pure
  const systemPrompt = `Tu es OrientAI, un assistant académique expert pour les étudiants de l'Ecole Marocaine des Sciences de l'Ingénieur.
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

    "ressources_recommandees" : Analyse les difficultés déclarées par l'étudiant et sélectionne
      UNIQUEMENT les ressources de la liste ci-dessus qui adressent DIRECTEMENT ces difficultés.
      Si une ressource ne correspond à aucune difficulté déclarée, ne l'inclus PAS.
      Maximum 3 ressources. Ne génère JAMAIS de ressources inventées ou non présentes dans la liste.

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
          "type": "ex : document, video, TP/TD, site web"
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

  // System prompt amélioré — bullet points seulement quand c'est pertinent
  const systemPrompt = `Tu es OrientAI, un assistant académique pour les étudiants de l'Ecole Marocaine des Sciences de l'Ingénieur.
    Tu réponds UNIQUEMENT aux questions liées au profil académique de l'étudiant,
    à son plan d'apprentissage, ses ressources, ou sa matière.
    Si la question est hors sujet, réponds en 1 à 2 phrases courtes et polies. Pas de bullet points pour les refus.

    LANGUE : Français uniquement. Ton encourageant et professionnel.

    FORMAT DE RÉPONSE — adapte le format selon le type de question :

    Pour les DÉFINITIONS ou EXPLICATIONS DE CONCEPTS (ex: "c'est quoi X", "explique Y") :
    - 1 à 2 phrases d'explication claire et directe
    - Si le concept a des composantes distinctes, utilise 2 à 3 bullet points (•) seulement
    - Pas de bullet points si la réponse peut se faire en 2 phrases

    Pour les ÉTAPES, LISTES, CONSEILS ou MÉTHODES (ex: "comment faire X", "donne-moi des exemples") :
    - 1 phrase d'introduction courte
    - 3 à 5 bullet points (•), chacun court et actionnable (1-2 phrases max)
    - 1 phrase de conclusion si utile

    Pour les RÉSUMÉS ou RÉCAPITULATIFS :
    - 1 phrase d'intro
    - Bullet points pour les points clés
    - 1 phrase de synthèse

    Pour les exemples de CODE :
    - Utilise des blocs de code avec triple backticks et le langage (ex: \`\`\`java ... \`\`\` ou \`\`\`php ... \`\`\`)
    - Chaque bloc de code doit être court et focalisé sur le concept expliqué
    - Ajoute une courte explication avant ou après le bloc

    RÈGLE GÉNÉRALE : utilise les bullet points seulement quand il y a vraiment plusieurs éléments distincts à lister.
    N'utilise JAMAIS de titres markdown (##, **).
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
