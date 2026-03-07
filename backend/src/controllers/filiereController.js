const Filiere = require("../models/Filiere");

// GET /api/filieres
const getAllFilieres = async (req, res) =>
{
  try
  {
    const filieres = await Filiere.find().sort({ nom_filiere: 1 });
    res.status(200).json(filieres);
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/filieres/:id
const getFiliereById = async (req, res) =>
{
  try
  {
    const filiere = await Filiere.findById(req.params.id);
    if (!filiere)
    {
      return res.status(404).json({ message: "Filière non trouvée" });
    }
    res.status(200).json(filiere);
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST /api/filieres
const createFiliere = async (req, res) =>
{
  try
  {
    const { nom_filiere, code_filiere } = req.body;
    if (!nom_filiere || !code_filiere)
    {
      return res.status(400).json({ message: "Le nom et le code de la filière sont requis" });
    }
    const filiere = await Filiere.create({ nom_filiere, code_filiere });
    res.status(201).json(filiere);
  } catch (error)
  {
    if (error.code === 11000)
    {
      return res.status(400).json({ message: "Cette filière existe déjà" });
    }
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// PUT /api/filieres/:id
const updateFiliere = async (req, res) =>
{
  try
  {
    const filiere = await Filiere.findByIdAndUpdate(
      req.params.id,
      { nom_filiere: req.body.nom_filiere, code_filiere: req.body.code_filiere },
      { new: true, runValidators: true }
    );
    if (!filiere)
    {
      return res.status(404).json({ message: "Filière non trouvée" });
    }
    res.status(200).json(filiere);
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// DELETE /api/filieres/:id
const deleteFiliere = async (req, res) =>
{
  try
  {
    const filiere = await Filiere.findByIdAndDelete(req.params.id);
    if (!filiere)
    {
      return res.status(404).json({ message: "Filière non trouvée" });
    }
    res.status(200).json({ message: "Filière supprimée avec succès" });
  } catch (error)
  {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  getAllFilieres,
  getFiliereById,
  createFiliere,
  updateFiliere,
  deleteFiliere,
};