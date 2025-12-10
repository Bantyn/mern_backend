const cors = require("cors");
const getLocalIP = require("./getLocalIP");

const backendIP = getLocalIP();

// Allowed static production URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://mern-frontend-6uim.vercel.app",
  "https://mern-backend-f5oi.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser clients (Postman/Thunder)
    if (!origin) return callback(null, true);

    // Allow local network (mobile testing) → 192.168.x.x
    if (/^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow localhost
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // Allow machine IP (Vite dev on your LAN)
    if (origin.startsWith(`http://${backendIP}`)) {
      return callback(null, true);
    }

    // Allow production domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
