const Recommendation = require("../models/Recommendation");
const Submission = require("../models/Submission");
const Filiere = require("../models/Filiere");
const Ressource = require("../models/Ressource");
const Matiere = require("../models/Matiere");
// const { generateRecommendation } = require("../services/geminiService");
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

    // 1. Récupérer la submission
    const submission = await Submission.findById(submissionId)
      .populate("filiereId", "nom_filiere")
      .populate("moduleId", "nom_module")
      .populate("matiereId", "nom_matiere");

    if (!submission)
    {
      return res.status(404).json({ message: "Submission non trouvée" });
    }

    // 2. Récupérer les ressources liées aux matières des modules de la filière
    const matieres = await Matiere.find({}).populate({
      path: "moduleId",
      match: { id_filiere: submission.filiereId._id },
    });

    const matieresFiltrees = matieres.filter(m => m.moduleId !== null);
    const matiereIds = matieresFiltrees.map(m => m._id);
    const ressources = await Ressource.find({ matiereId: { $in: matiereIds } });

    // 3. Appeler Grok
    const result = await generateRecommendation({
      filiere: submission.filiereId.nom_filiere,
      module: submission.moduleId?.nom_module,
      matiere: submission.matiereId?.nom_matiere,
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
      plan_travail: result.plan_travail,
      conseils_ia: result.conseils_ia,
      ressources_recommandees: result.ressources_recommandees,
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
    const userId = req.user?.id;
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

    // 2. Récupérer la submission avec populate pour le contexte
    const submission = await Submission.findById(submissionId)
      .populate("filiereId", "nom_filiere")
      .populate("matiereId", "nom_matiere");

    if (!submission)
    {
      return res.status(404).json({ message: "Submission non trouvée" });
    }

    // 3. Appeler Groq avec le contexte complet
    const answer = await askFollowUp({ question, recommendation, submission });

    res.status(200).json({ answer });

  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { generate, getBySubmission, ask };