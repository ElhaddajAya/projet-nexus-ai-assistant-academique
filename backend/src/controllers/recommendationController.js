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

    // 2. Récupérer UNIQUEMENT les ressources de la matière choisie
    //    CORRECTION : avant on récupérait toutes les ressources de la filière,
    //    ce qui envoyait des ressources hors-sujet à Groq (ex: React pour Laravel)
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

    // 4. Sauvegarder la recommandation avec chat_history vide au départ
    const recommendation = await Recommendation.create({
      submissionId,
      userId,
      analyse: result.analyse,
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