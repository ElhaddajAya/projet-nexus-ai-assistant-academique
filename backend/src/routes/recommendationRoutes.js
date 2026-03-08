const express = require("express");
const router = express.Router();
const { generate, getBySubmission } = require("../controllers/recommendationController");
const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { generate, getBySubmission, ask } = require("../controllers/recommendationController");

// Student only
router.post("/generate", auth, allowRoles("student"), generate);
router.get("/:submissionId", auth, allowRoles("student"), getBySubmission);
router.post("/ask", auth, allowRoles("student"), ask);

module.exports = router;