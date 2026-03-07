const Ressource = require("../models/Ressource");

// GET /api/ressources?matiereId=...
const getAllRessources = async (req, res) =>
{
    try
    {
        const { matiereId } = req.query;

        const filter = {};
        if (matiereId) filter.matiereId = matiereId;

        const ressources = await Ressource.find(filter).sort({ createdAt: -1 });
        res.status(200).json(ressources);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// GET /api/ressources/:id
const getRessourceById = async (req, res) =>
{
    try
    {
        const ressource = await Ressource.findById(req.params.id);
        if (!ressource)
        {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }
        res.status(200).json(ressource);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// POST /api/ressources
const createRessource = async (req, res) =>
{
    try
    {
        const { titre, description, lien, type, matiereId, filiereId, niveau } = req.body;

        if (!titre || !lien || !type || !matiereId || !filiereId)
        {
            return res.status(400).json({ message: "titre, lien, type, matiereId et filiereId sont requis" });
        }

        const ressource = await Ressource.create({
            titre, description: description || "", lien, type, matiereId, filiereId, niveau: niveau || ""
        });

        res.status(201).json(ressource);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// PUT /api/ressources/:id
const updateRessource = async (req, res) =>
{
    try
    {
        const { titre, description, lien, type, matiereId } = req.body;

        const ressource = await Ressource.findByIdAndUpdate(
            req.params.id,
            { titre, description, lien, type, matiereId },
            { new: true, runValidators: true }
        );

        if (!ressource)
        {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }

        res.status(200).json(ressource);
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// DELETE /api/ressources/:id
const deleteRessource = async (req, res) =>
{
    try
    {
        const ressource = await Ressource.findByIdAndDelete(req.params.id);
        if (!ressource)
        {
            return res.status(404).json({ message: "Ressource non trouvée" });
        }
        res.status(200).json({ message: "Ressource supprimée avec succès" });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = {
    getAllRessources,
    getRessourceById,
    createRessource,
    updateRessource,
    deleteRessource,
};