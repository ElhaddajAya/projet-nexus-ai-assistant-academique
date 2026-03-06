const Recommendation = require("../models/Recommendation");
const Submission = require("../models/Submission");
const Filiere = require("../models/Filiere");
const Ressource = require("../models/Ressource");
const Matiere = require("../models/Matiere");
const { generateRecommendation } = require("../services/geminiService");

// POST /api/recommendations/generate
const generate = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { submissionId } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: "submissionId est requis" });
    }

    // 1. Récupérer la submission
    const submission = await Submission.findById(submissionId)
      .populate("filiereId", "nom_filiere");

    if (!submission) {
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

    // 3. Appeler Gemini
    const result = await generateRecommendation({
      filiere: submission.filiereId.nom_filiere,
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
      plan_travail: result.plan_travail,
      conseils_ia: result.conseils_ia,
      ressources_recommandees: result.ressources_recommandees,
    });

    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/recommendations/:submissionId
const getBySubmission = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      submissionId: req.params.submissionId,
    });

    if (!recommendation) {
      return res.status(404).json({ message: "Recommandation non trouvée" });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { generate, getBySubmission };