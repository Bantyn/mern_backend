// config/cors.js
const os = require("os");
const cors = require("cors");
const getLocalIP = require("./getLocalIP");

const backendIP = getLocalIP();

const allowedOrigins = [
  `http://${backendIP}:5173`,  // Vite on your IP
  `http://localhost:5173`,     // Vite locally
  `http://${backendIP}:5000`,  // Backend itself
  "http://localhost:5000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
};

module.exports = cors(corsOptions);
