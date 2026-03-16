const express = require("express");
const router = express.Router();

const { register, login, updateMe, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", authMiddleware, changePassword);
router.put("/me", authMiddleware, allowRoles("student"), updateMe);

module.exports = router;