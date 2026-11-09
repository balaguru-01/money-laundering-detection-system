const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const net = require("net");
const app = express();

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

let PORT = parseInt(process.env.PORT, 10) || 5000;

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Ignore favicon requests
app.get("/favicon.ico", (_, res) => {
  res.status(204).end();
});

// Import routes
const apiRoutes = require("./routes/api");

// Expose io to routes for real-time broadcasts
app.set("io", io);

// Health check route
app.get("/", (_, res) => {
  res.json({
    status: "Backend is running 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`📱 Client disconnected: ${socket.id}`);
  });

  // Subscribe to alerts
  socket.on("subscribe-alerts", () => {
    socket.join("alerts");
    console.log(`✅ Client ${socket.id} subscribed to alerts`);
  });

  // Subscribe to transactions
  socket.on("subscribe-transactions", () => {
    socket.join("transactions");
    console.log(`✅ Client ${socket.id} subscribed to transactions`);
  });
});

// API routes
app.use("/api", apiRoutes);

// Error handling middleware (must be before 404 handler)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
findAvailablePort(PORT)
  .then((availablePort) => {
    PORT = availablePort;
    server.listen(PORT, () => {
      console.log(`\n -- Money Laundering Detection Server`);
      console.log(`--Server running on http://localhost:${PORT}`);
      console.log(`🔌 WebSocket enabled for real-time updates`);
      console.log(`\n                                                                                                                                                                                    Available endpoints:`);
      console.log(`   GET  /api/transactions    - Fetch transactions`);
      console.log(`   GET  /api/alerts          - Get suspicious alerts`);
      console.log(`   GET  /api/network         - Network visualization data`);
      console.log(`   GET  /api/stats           - Dashboard statistics`);
      console.log(`   POST /api/rescan          - Trigger pattern detection`);
      console.log(`   GET  /api/ml-anomalies    - ML-based anomalies (Python)`);
      console.log(
        `   GET  /api/blockchain      - Blockchain transaction data\n`
      );
    });

    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Failed to find available port:", err);
    process.exit(1);
  });
