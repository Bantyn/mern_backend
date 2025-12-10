const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
 
// use cors middleware
const corsMiddleware = require("./config/cors"); 
// get LAN IP
const getLocalIP = require("./config/getLocalIP"); 

const startServer = require("./config/server");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const genAiRoutes = require("./routes/GeminiAiRouter");


const app = express();
app.use(express.json());
app.use(corsMiddleware); 

// Auth routes
const authRoutes = require("./routes/authRouters");
app.use("/api/auth", authRoutes);

// Upload routes
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
  console.log("API is running...");
});

// Gemini AI routes
app.use("/api/genai", genAiRoutes);

// ---- Connect DB and Start Server ----
const PORT = process.env.PORT || 5000;
const LAN_IP = getLocalIP(); 

connectDB().then(() => {
  app.listen(PORT, LAN_IP, () => {
    console.log(`Server running On this : http://${LAN_IP}:${PORT}`);
  });
});
