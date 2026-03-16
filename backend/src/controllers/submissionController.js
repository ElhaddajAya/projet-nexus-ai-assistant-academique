const Submission = require("../models/Submission");

// GET /api/submissions/:id  (protégé)
const getSubmissionById = async (req, res) =>
{
    try
    {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId)
        {
            return res.status(401).json({ message: "Non autorisée" });
        }
        if (role !== "student")
        {
            return res.status(403).json({ message: "Accès réservé aux étudiants" });
        }

        const submission = await Submission.findById(req.params.id)
            .populate("filiereId", "nom_filiere code_filiere")
            .populate("moduleId", "nom_module")
            .populate("matiereId", "nom_matiere");

        if (!submission)
        {
            return res.status(404).json({ message: "Soumission non trouvée" });
        }

        // Un étudiant ne peut lire que ses submissions
        if (submission.userId.toString() !== userId)
        {
            return res.status(403).json({ message: "Accès interdit" });
        }

        res.status(200).json(submission);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// POST /api/submissions  (protégé)
const createSubmission = async (req, res) =>
{
    try
    {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId)
        {
            return res.status(401).json({ message: "Non autorisée" });
        }
        if (role !== "student")
        {
            return res.status(403).json({ message: "Accès réservé aux étudiants" });
        }

        const { filiereId, moduleId, matiereId, semestre, niveau, difficultes, objectifs } = req.body;

        if (!filiereId || !semestre)
        {
            return res.status(400).json({ message: "filiereId et semestre sont requis" });
        }

        if (!moduleId || !matiereId)
        {
            return res.status(400).json({ message: "moduleId et matiereId sont requis" });
        }

        if (!Array.isArray(difficultes) || difficultes.length === 0)
        {
            return res.status(400).json({ message: "difficultes doit être une liste non vide" });
        }

        if (!Array.isArray(objectifs) || objectifs.length === 0)
        {
            return res.status(400).json({ message: "objectifs doit être une liste non vide" });
        }

        const submission = await Submission.create({
            userId,
            filiereId,
            moduleId,
            matiereId,
            semestre,
            niveau: niveau || "",
            difficultes,
            objectifs,
        });

        res.status(201).json(submission);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// GET /api/submissions/me  (protégé)
const getMySubmissions = async (req, res) =>
{
    try
    {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId)
        {
            return res.status(401).json({ message: "Non autorisée" });
        }
        if (role !== "student")
        {
            return res.status(403).json({ message: "Accès réservé aux étudiants" });
        }

        // Populate pour avoir les vrais noms dans le frontend
        // sans ça, on reçoit juste les ObjectIds et on affiche "Matière", "Module"...
        const submissions = await Submission.find({ userId })
            .populate("filiereId", "nom_filiere code_filiere")
            .populate("moduleId", "nom_module")
            .populate("matiereId", "nom_matiere")
            .sort({ createdAt: -1 });

        res.status(200).json(submissions);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// GET /api/submissions/recent — 10 dernières soumissions (admin)
const getRecentSubmissions = async (req, res) =>
{
    try
    {
        const submissions = await Submission.find()
            .populate("userId", "nom prenom")
            .populate("filiereId", "nom_filiere code_filiere")
            .populate("matiereId", "nom_matiere")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(submissions);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    getSubmissionById,
    createSubmission,
    getMySubmissions,
    getRecentSubmissions
};