import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected");
  });

  socket.on("error", (error) => {
    console.error("❌ WebSocket error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const subscribeToAlerts = (callback) => {
  const sock = getSocket();
  sock.emit("subscribe-alerts");
  sock.on("new-alert", callback);
};

export const subscribeToTransactions = (callback) => {
  const sock = getSocket();
  sock.emit("subscribe-transactions");
  sock.on("new-transaction", callback);
};

export const unsubscribeFromAlerts = () => {
  const sock = getSocket();
  sock.off("new-alert");
};

export const unsubscribeFromTransactions = () => {
  const sock = getSocket();
  sock.off("new-transaction");
};

export const emitAlert = (alert) => {
  const sock = getSocket();
  sock.emit("new-alert", alert);
};

export const emitTransaction = (transaction) => {
  const sock = getSocket();
  sock.emit("new-transaction", transaction);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
