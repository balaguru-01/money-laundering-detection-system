import React, { useEffect, useState } from "react";
import { alertAPI } from "../services/apiService";
import { useAlerts } from "../hooks/useRealtimeData";
import "./AlertsPanel.css";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState(null);
  const realtimeAlerts = useAlerts([]);

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, []);

  useEffect(() => {
    if (realtimeAlerts.length > 0) {
      setAlerts([...realtimeAlerts, ...alerts]);
    }
  }, [realtimeAlerts]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await alertAPI.getAll(
        100,
        filter === "all" ? null : filter
      );
      setAlerts(response.data.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await alertAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleAlertStatusChange = async (alertId, newStatus) => {
    try {
      await alertAPI.updateStatus(alertId, newStatus, "admin");
      fetchAlerts();
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      critical: "#ff0000",
      high: "#ff4444",
      medium: "#ffa500",
      low: "#ffff00",
    };
    return colors[level] || "#fff";
  };

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h2>🚨 Alerts & Detections</h2>
        {stats && (
          <div className="alert-stats">
            <div className="stat-card critical">
              <span>{stats.byLevel.critical}</span>
              <label>Critical</label>
            </div>
            <div className="stat-card high">
              <span>{stats.byLevel.high}</span>
              <label>High</label>
            </div>
            <div className="stat-card medium">
              <span>{stats.byLevel.medium}</span>
              <label>Medium</label>
            </div>
            <div className="stat-card low">
              <span>{stats.byLevel.low}</span>
              <label>Low</label>
            </div>
          </div>
        )}
      </div>

      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Alerts</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={fetchAlerts} className="primary">
          Refresh
        </button>
      </div>

      <div className="alerts-list">
        {loading ? (
          <div className="loading">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="no-alerts">No alerts found</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className="alert-item"
              style={{ borderLeft: `4px solid ${getLevelColor(alert.level)}` }}
            >
              <div className="alert-header">
                <span className={`alert-level ${alert.level}`}>
                  {alert.level.toUpperCase()}
                </span>
                <span className="alert-rule">{alert.rule}</span>
                <span className="alert-time">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="alert-message">{alert.message}</div>
              {alert.details && (
                <div className="alert-details">
                  <small>
                    From: {alert.details.fromAccount} → To:{" "}
                    {alert.details.toAccount} | Amount: ₹
                    {alert.details.amount?.toLocaleString()}
                  </small>
                </div>
              )}
              <div className="alert-status">
                <select
                  value={alert.status}
                  onChange={(e) =>
                    handleAlertStatusChange(alert.alertId, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="open">Open</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="false-positive">False Positive</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
