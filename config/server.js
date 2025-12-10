const os = require("os");

// Get local network IP
function getLocalIP() {
    const network = os.networkInterfaces();
    for (let key in network) {
        for (let iface of network[key]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "0.0.0.0";
}

const LOCAL_IP = getLocalIP();

const startServer = (app) => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, LOCAL_IP, () => {
        console.log(`🚀 Server running on http://${LOCAL_IP}:${PORT}`);
        console.log("📡 Accessible on all devices in same WiFi network");
    });
};

module.exports = startServer;
