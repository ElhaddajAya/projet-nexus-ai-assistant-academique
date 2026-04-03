const Recommendation = require("../models/Recommendation");
const Submission = require("../models/Submission");
const Ressource = require("../models/Ressource");
const { generateRecommendation, askFollowUp } = require("../services/groqService");


// POST /api/recommendations/generate
const generate = async (req, res) =>
{
  try
  {
    const userId = req.user?.id;
    const { submissionId } = req.body;

    if (!submissionId)
    {
      return res.status(400).json({ message: "submissionId est requis" });
    }

    // 1. Récupérer la submission avec populate complet
    const submission = await Submission.findById(submissionId)
      .populate("filiereId", "nom_filiere")
      .populate("moduleId", "nom_module")
      .populate("matiereId", "nom_matiere");

    if (!submission)
    {
      return res.status(404).json({ message: "Submission non trouvée" });
    }

    if (!submission.filiereId || !submission.moduleId || !submission.matiereId)
    {
      return res.status(400).json({
        message: "Submission incomplète : filiereId, moduleId et matiereId sont requis",
      });
    }

    // ── CACHE : vérifier si une recommandation identique existe déjà ──────────
    // Principe : si l'étudiant a déjà soumis le même profil (même matière +
    // mêmes difficultés), on retourne la recommandation existante directement
    // sans appeler Groq —> réduit le coût API et la charge serveur
    const difficultesSorted = [...submission.difficultes].sort();

    // Chercher toutes les recommendations de cet utilisateur pour cette matière dans la base de données
    const existingRecos = await Recommendation.find({ userId }).populate({
      path: "submissionId",
      select: "matiereId difficultes",
    });

    // Comparer les difficultés une par une
    const cached = existingRecos.find((reco) =>
    {
      if (!reco.submissionId) return false;

      // Même matière ?
      const sameMat =
        reco.submissionId.matiereId?.toString() ===
        submission.matiereId._id.toString();

      if (!sameMat) return false;

      // Mêmes difficultés (triées pour comparer dans n'importe quel ordre) ?
      const existingDiffs = [...(reco.submissionId.difficultes || [])].sort();
      return JSON.stringify(existingDiffs) === JSON.stringify(difficultesSorted);
    });

    if (cached)
    {
      // Cache hit — recommandation réutilisée sans appel Groq
      console.log("Cache hit — recommandation réutilisée sans appel Groq");
      return res.status(200).json(cached);
    }
    // ── FIN CACHE ──────────────────────────────────────────────────────────────

    // 2. Récupérer les ressources de la matière choisie
    const ressources = await Ressource.find({
      matiereId: submission.matiereId._id,
    });

    // 3. Appeler Groq pour générer la recommandation
    const result = await generateRecommendation({
      filiere: submission.filiereId.nom_filiere,
      module: submission.moduleId.nom_module,
      matiere: submission.matiereId.nom_matiere,
      semestre: submission.semestre,
      niveau: submission.niveau,
      difficultes: submission.difficultes,
      objectifs: submission.objectifs,
      ressources,
    });

    // 4. Sauvegarder la recommandation
    const recommendation = await Recommendation.create({
      submissionId,
      userId,
      analyse: result.analyse,
      note_progression: result.note_progression,
      plan_travail: result.plan_travail,
      conseils_ia: result.conseils_ia,
      ressources_recommandees: result.ressources_recommandees,
      chat_history: [],
    });

    res.status(201).json(recommendation);
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// GET /api/recommendations/:submissionId
const getBySubmission = async (req, res) =>
{
  try
  {
    const recommendation = await Recommendation.findOne({
      submissionId: req.params.submissionId,
    });

    if (!recommendation)
    {
      return res.status(404).json({ message: "Recommandation non trouvée" });
    }

    res.status(200).json(recommendation);
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// POST /api/recommendations/ask
const ask = async (req, res) =>
{
  try
  {
    const { submissionId, question } = req.body;

    if (!submissionId || !question)
    {
      return res.status(400).json({ message: "submissionId et question sont requis" });
    }

    // 1. Récupérer la recommendation existante
    const recommendation = await Recommendation.findOne({ submissionId });
    if (!recommendation)
    {
      return res.status(404).json({ message: "Recommandation non trouvée" });
    }

    // 2. Récupérer la submission avec populate pour le contexte Groq
    const submission = await Submission.findById(submissionId)
      .populate("filiereId", "nom_filiere")
      .populate("matiereId", "nom_matiere");

    if (!submission)
    {
      return res.status(404).json({ message: "Submission non trouvée" });
    }

    // 3. Appeler Groq avec le contexte complet
    const answer = await askFollowUp({ question, recommendation, submission });

    // 4. Sauvegarder les deux messages (user + ai) dans chat_history
    await Recommendation.findOneAndUpdate(
      { submissionId },
      {
        $push: {
          chat_history: {
            $each: [
              { role: "user", message: question },
              { role: "ai", message: answer },
            ],
          },
        },
      }
    );

    // 5. Retourner la réponse au frontend
    res.status(200).json({ answer });

  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


module.exports = { generate, getBySubmission, ask };