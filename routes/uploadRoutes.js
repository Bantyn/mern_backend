const express = require("express");
const router = express.Router();
const { upload, uploadFileController } = require("../controllers/uploadController");

// POST /api/upload
router.post("/", upload.single("file"), uploadFileController);

module.exports = router;
