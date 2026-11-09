import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import transactionRoutes from './routes/transactions.js';
import alertRoutes from './routes/alerts.js';
import networkRoutes from './routes/network.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store io instance for use in routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/network', networkRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('subscribe-alerts', () => {
    socket.join('alerts');
    console.log(`📢 Client subscribed to alerts`);
  });

  socket.on('subscribe-transactions', () => {
    socket.join('transactions');
    console.log(`📊 Client subscribed to transactions`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   💰 Money Laundering Detection System - Backend Started   ║
╠════════════════════════════════════════════════════════════╣
║   Port: ${PORT}                                                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   WebSocket: Enabled                                       ║
║   Endpoints:                                               ║
║   - /api/transactions                                      ║
║   - /api/alerts                                            ║
║   - /api/network                                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
