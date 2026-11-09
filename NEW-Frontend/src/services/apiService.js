import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Transaction endpoints
export const transactionAPI = {
  getAll: (limit = 50, status = null) => {
    const params = { limit };
    if (status) params.status = status;
    return api.get("/transactions", { params });
  },
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post("/transactions", data),
  updateStatus: (id, status) =>
    api.patch(`/transactions/${id}/status`, { status }),
};

// Alert endpoints
export const alertAPI = {
  getAll: (limit = 50, level = null, status = null) => {
    const params = { limit };
    if (level) params.level = level;
    if (status) params.status = status;
    return api.get("/alerts", { params });
  },
  getById: (id) => api.get(`/alerts/${id}`),
  getStats: () => api.get("/alerts/stats"),
  updateStatus: (id, status, reviewedBy) =>
    api.patch(`/alerts/${id}/status`, { status, reviewedBy }),
};

// Network endpoints
export const networkAPI = {
  getNetwork: () => api.get("/network"),
  getAnomalies: () => api.get("/network/anomalies"),
  getAccounts: (limit = 50, riskLevel = null) => {
    const params = { limit };
    if (riskLevel) params.riskLevel = riskLevel;
    return api.get("/network/accounts", { params });
  },
  getAccountStats: (accountId) =>
    api.get(`/network/accounts/${accountId}/stats`),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
