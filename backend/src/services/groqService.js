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

  // Calcul du ratio de difficultés pour guider Groq
  const nbDifficultes = difficultes.length;

  // User prompt — profil complet + structure JSON avec analyse enrichie
  const userPrompt = `Voici le profil complet de l'étudiant :
    - Filière  : ${filiere}
    - Module   : ${module || "non précisé"}
    - Matière  : ${matiere || "non précisée"}
    - Semestre : ${semestre}
    - Niveau   : ${niveau || "non précisé"}
    - Difficultés déclarées : ${difficultes.join(", ")}
    - Nombre de difficultés déclarées : ${nbDifficultes}
    - Objectifs visés : ${objectifs.join(", ")}

    Ressources pédagogiques disponibles pour cette matière :
    ${ressourcesText}

    RÈGLE OBLIGATOIRE — Calcule note_progression AVANT de générer le JSON :
    Tu dois estimer le niveau de maîtrise de l'étudiant basé sur ses difficultés déclarées.
    - L'étudiant a déclaré ${nbDifficultes} difficulté(s).
    - Si ${nbDifficultes} >= 6 difficultés (beaucoup) → note entre 5 et 20.
    - Si ${nbDifficultes} entre 4 et 5 difficultés (majorité) → note entre 21 et 35.
    - Si ${nbDifficultes} entre 2 et 3 difficultés (quelques-unes) → note entre 36 et 60.
    - Si ${nbDifficultes} == 1 difficulté (très peu) → note entre 61 et 80.
    - Si ${nbDifficultes} == 0 difficulté → note entre 81 et 95.
    INTERDIT : Ne retourne JAMAIS 40, 50 ou 55 comme valeur par défaut. Calcule vraiment selon les règles ci-dessus.

    Génère une réponse avec EXACTEMENT cette structure JSON.

    INSTRUCTIONS IMPORTANTES pour chaque champ :

    "analyse" : Rédige 4 à 6 phrases bien structurées couvrant :
      (1) Le niveau général de l'étudiant dans cette matière
      (2) Une analyse précise de ses difficultés spécifiques et leur impact sur sa progression
      (3) Les points forts ou acquis à exploiter
      (4) Une recommandation générale personnalisée et motivante

    "plan_travail" : 4 étapes concrètes et progressives, chacune avec un titre clair,
      une durée réaliste et une description détaillée et actionnable (2-3 phrases minimum).

    "ressources_recommandees" : Sélectionne TOUTES les ressources de la liste disponible
      qui sont utiles pour les difficultés déclarées — pas seulement les plus évidentes.
      RÈGLE STRICTE : si tu mentionnes une ressource dans le plan_travail, elle DOIT
      obligatoirement apparaître dans ressources_recommandees.
      Ne génère JAMAIS de ressources inventées ou absentes de la liste disponible.
      L'objectif est de donner le MAXIMUM de ressources UTILES et qui correspondent aux difficultés declarées — pas le minimum.

    "conseils_ia" : 4 à 5 conseils pratiques, spécifiques aux difficultés déclarées,
      chaque conseil doit être directement applicable et pas générique.



    {
      "analyse": "4 à 6 phrases structurées couvrant niveau, difficultés, points forts et recommandation",
      "note_progression": "<entier calculé selon les règles ci-dessus — JAMAIS 40, 50 ou 55>",
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
    }`;

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

  // System prompt 
  const systemPrompt = `Tu es OrientAI, un assistant académique pour les étudiants de l'Ecole Marocaine des Sciences de l'Ingénieur.

  RÔLE : Tu es un tuteur pédagogique, pas un moteur de réponses. Ton objectif est de guider l'étudiant vers la compréhension par lui-même — pas de lui donner la solution toute faite.

  LANGUE : Français uniquement. Ton encourageant, bienveillant et professionnel.

  RÈGLES STRICTES :
  - Ne donne JAMAIS une solution complète ou du code fonctionnel directement.
  - Commence toujours par identifier ce que l'étudiant a déjà compris avec une question de relance.
  - Oriente vers la méthode de résolution, pas vers la réponse.
  - Si l'étudiant demande du code, donne un squelette incomplet ou un exemple simplifié sur un concept adjacent — jamais la solution exacte à son problème.
  - Si la question est hors sujet académique, réponds en 1 à 2 phrases polies.

  FORMAT DE RÉPONSE :
  - Commence par reformuler ce que l'étudiant cherche à faire (1 phrase).
  - Pose 1 question de relance pour identifier son niveau de compréhension actuel.
  - Donne 2 à 3 pistes de réflexion ou étapes pour qu'il trouve lui-même.
  - Termine par une question d'encouragement ou de vérification.

  EXEMPLE de bonne réponse si l'étudiant demande "comment gérer les erreurs réseau avec Retrofit" :
  "Tu cherches à sécuriser tes appels réseau avec Retrofit — c'est une bonne pratique. Avant de te guider, dis-moi : est-ce que tu sais déjà ce que retourne Retrofit quand un appel échoue ? Est-ce une exception Java ou un objet Response ? Réfléchis d'abord à ça, et regarde comment Retrofit distingue un succès d'un échec dans le callback onResponse vs onFailure. Qu'est-ce que tu as essayé jusqu'ici ?"

  N'utilise JAMAIS de titres markdown (##, **).
  Utilise UNIQUEMENT le symbole • si tu listes des pistes — maximum 3.`;

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

    Guide l'étudiant vers la réponse sans la lui donner directement. Pose des questions de relance et oriente vers la méthode de réflexion.`;

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