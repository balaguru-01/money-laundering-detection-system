import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }
  return socket;
};

export const subscribeToAlerts = (callback) => {
  const socket = connectSocket();
  socket.emit("subscribe-alerts");
  socket.on("new-alert", (alert) => {
    console.log("📢 New alert received:", alert);
    callback(alert);
  });
};

export const subscribeToTransactions = (callback) => {
  const socket = connectSocket();
  socket.emit("subscribe-transactions");
  socket.on("new-transaction", (transaction) => {
    console.log("📊 New transaction received:", transaction);
    callback(transaction);
  });
};

export const unsubscribeFromAlerts = () => {
  if (socket) {
    socket.off("new-alert");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default connectSocket;
