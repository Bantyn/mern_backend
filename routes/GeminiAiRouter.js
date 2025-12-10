const express = require("express");
const router = express.Router();

// Import the chatBot controller
const { chatBot } = require("../controllers/genAiController.js");

// POST /api/genai/genai
router.post("/", chatBot);

module.exports = router;
