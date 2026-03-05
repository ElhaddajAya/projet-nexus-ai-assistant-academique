const express = require("express");
const router = express.Router();
const {
    getAllRessources,
    getRessourceById,
    createRessource,
    updateRessource,
    deleteRessource,
} = require("../controllers/ressourceController");

const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/", getAllRessources);
router.get("/:id", getRessourceById);
// Admin only
router.post("/", auth, allowRoles("admin"), createRessource);
router.put("/:id", auth, allowRoles("admin"), updateRessource);
router.delete("/:id", auth, allowRoles("admin"), deleteRessource);

module.exports = router;