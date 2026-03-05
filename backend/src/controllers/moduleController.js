const Module = require("../models/Module");

// GET /api/modules
const getAllModules = async (req, res) => {
  try {
    const { filiereId, semestre } = req.query;
    const filter = {};
    if (filiereId) filter.id_filiere = filiereId;
    if (semestre) filter.semestre = semestre;

    const modules = await Module.find(filter)
      .populate("id_filiere", "nom_filiere")
      .sort({ semestre: 1 });
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/modules/:id
const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate("id_filiere", "nom_filiere");
    if (!module) {
      return res.status(404).json({ message: "Module non trouvé" });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST /api/modules
const createModule = async (req, res) => {
  try {
    const { nom_module, semestre, id_filiere } = req.body;
    if (!nom_module || !semestre || !id_filiere) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const module = await Module.create({ nom_module, semestre, id_filiere });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// PUT /api/modules/:id
const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!module) {
      return res.status(404).json({ message: "Module non trouvé" });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// DELETE /api/modules/:id
const deleteModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Module non trouvé" });
    }
    res.status(200).json({ message: "Module supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};