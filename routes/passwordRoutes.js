const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, resetPassword } = require("../controllers/passwordController");

router.post("/forgot", sendOTP);
router.post("/verify", verifyOTP);
router.post("/reset", resetPassword);

module.exports = router;
