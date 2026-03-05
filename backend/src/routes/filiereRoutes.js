const express = require("express");
const router = express.Router();
const {
  getAllFilieres,
  getFiliereById,
  createFiliere,
  updateFiliere,
  deleteFiliere,
} = require("../controllers/filiereController");

router.get("/", getAllFilieres);
router.get("/:id", getFiliereById);
router.post("/", createFiliere);
router.put("/:id", updateFiliere);
router.delete("/:id", deleteFiliere);

module.exports = router;