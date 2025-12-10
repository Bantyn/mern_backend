const express = require("express");
const router = express.Router();

const { chatBot } = require("../controllers/genAiController.js");

router.post("/", chatBot);

module.exports = router;
