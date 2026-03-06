const Matiere = require("../models/Matiere");

// GET /api/matieres?moduleId=...
const getAllMatieres = async (req, res) =>
{
    try
    {
        const { moduleId } = req.query;
        const filter = {};
        if (moduleId) filter.moduleId = moduleId;

        const matieres = await Matiere.find(filter).sort({ nom_matiere: 1 });
        res.status(200).json(matieres);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// GET /api/matieres/:id
const getMatiereById = async (req, res) =>
{
    try
    {
        const matiere = await Matiere.findById(req.params.id);
        if (!matiere) return res.status(404).json({ message: "Matière non trouvée" });
        res.status(200).json(matiere);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// POST /api/matieres
const createMatiere = async (req, res) =>
{
    try
    {
        const { nom_matiere, moduleId } = req.body;

        if (!nom_matiere || !moduleId)
        {
            return res.status(400).json({ message: "nom_matiere et moduleId sont requis" });
        }

        const matiere = await Matiere.create({ nom_matiere, moduleId });
        res.status(201).json(matiere);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// PUT /api/matieres/:id
const updateMatiere = async (req, res) =>
{
    try
    {
        const matiere = await Matiere.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!matiere) return res.status(404).json({ message: "Matière non trouvée" });
        res.status(200).json(matiere);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// DELETE /api/matieres/:id
const deleteMatiere = async (req, res) =>
{
    try
    {
        const matiere = await Matiere.findByIdAndDelete(req.params.id);
        if (!matiere) return res.status(404).json({ message: "Matière non trouvée" });
        res.status(200).json({ message: "Matière supprimée avec succès" });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    getAllMatieres,
    getMatiereById,
    createMatiere,
    updateMatiere,
    deleteMatiere,
};