const express = require("express");
const router = express.Router();

const { forgotPassword, resetPassword, registerUser, loginUser } = require("../controllers/authController");

// Request reset email
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
