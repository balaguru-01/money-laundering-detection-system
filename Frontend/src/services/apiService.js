// API Service for Frontend
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export const fetchTransactions = async (limit = 10) => {
  try {
    const response = await apiClient.get("/transactions", {
      params: { limit },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const fetchAlerts = async (level = null) => {
  try {
    const response = await apiClient.get(
      "/alerts",
      level ? { params: { level } } : {}
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
};

export const fetchNetworkData = async () => {
  try {
    const response = await apiClient.get("/network");
    return response.data.data || { graph: { nodes: [], links: [] }, stats: {} };
  } catch (error) {
    console.error("Error fetching network data:", error);
    return { graph: { nodes: [], links: [] }, stats: {} };
  }
};

export const fetchStats = async () => {
  try {
    const response = await apiClient.get("/stats");
    return response.data.data || {};
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {};
  }
};

export const triggerRescan = async () => {
  try {
    const response = await apiClient.post("/rescan");
    return response.data;
  } catch (error) {
    console.error("Error triggering rescan:", error);
    return { success: false };
  }
};

export default apiClient;
