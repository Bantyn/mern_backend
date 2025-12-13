const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");

// use cors middleware
const corsMiddleware = require("./config/cors");

const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const genAiRoutes = require("./routes/GeminiAiRouter");
const passwordRoutes = require("./routes/passwordRoutes");
const app = express();
app.use(express.json());
app.use(corsMiddleware);

// Auth routes
const authRoutes = require("./routes/authRouters");
app.use("/api/auth", authRoutes);

// Upload routes
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Password routes
app.use("/api/password", passwordRoutes);

// Health route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Gemini AI routes
app.use("/api/genai", genAiRoutes);

// ---- Connect DB and Start Server ----
const PORT = process.env.PORT || 5000;

const getLocalIP = require("./config/getLocalIP");
const backendIP = getLocalIP();



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nServer running on \n port : http://localhost:${PORT} \n local network IP : http://${backendIP}:${PORT} \n render IP : ${process.env.BACKEND_URL}`);
  });
});
