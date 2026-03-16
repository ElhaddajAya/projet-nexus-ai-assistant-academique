const express = require("express");
const router = express.Router();
const { getSubmissionById, createSubmission, getMySubmissions, getRecentSubmissions, getAllSubmissions } = require("../controllers/submissionController");

const auth = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");


// Admin only — avant /:id obligatoirement
router.get("/recent", auth, allowRoles("admin"), getRecentSubmissions);
router.get("/all", auth, allowRoles("admin"), getAllSubmissions);
// Student only
router.get("/me", auth, allowRoles("student"), getMySubmissions);
router.post("/", auth, allowRoles("student"), createSubmission);
router.get("/:id", auth, allowRoles("student"), getSubmissionById);

module.exports = router;
