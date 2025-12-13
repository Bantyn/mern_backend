const multer = require("multer");
const path = require("path");

// -------------------------
// Multer Storage Configuration
// -------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});
 
// -------------------------
// File Filter (optional)
// -------------------------
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png files allowed"), false);
  }
};

// -------------------------
// Initialize Multer
// -------------------------
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
  fileFilter: fileFilter,
});

// -------------------------
// Controller Logic
// -------------------------
const uploadFileController = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      path: req.file.path,
      url: `${process.env.BACKEND_URL}/uploads/${req.file.filename}` || `http://${process.env.LOCAL_IP || "localhost"}:${process.env.PORT}/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// Export both Multer and Controller
// -------------------------
module.exports = {
  upload,               // Use this in your routes: upload.single('file')
  uploadFileController, // Use this as the route handler
};
