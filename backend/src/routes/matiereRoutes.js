const express = require("express");
const router = express.Router();

const {
    getAllMatieres,
    getMatiereById,
    createMatiere,
    updateMatiere,
    deleteMatiere,
} = require("../controllers/matiereController");

router.get("/", getAllMatieres);
router.get("/:id", getMatiereById);
router.post("/", createMatiere);
router.put("/:id", updateMatiere);
router.delete("/:id", deleteMatiere);

module.exports = router;