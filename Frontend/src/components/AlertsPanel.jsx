
import { useState, useEffect, useCallback } from "react";
import { fetchAlerts } from "../services/apiService";
import {
  subscribeToAlerts,
  unsubscribeFromAlerts,
} from "../services/socketService";
import "./AlertsPanel.css";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNewAlert = useCallback((newAlert) => {
    const normalized = {
      ...newAlert,
      level: String(newAlert?.level || "low").toLowerCase(),
      message: newAlert?.message || "Alert received",
      time: newAlert?.time || "just now",
    };
    setAlerts((prevAlerts) => [normalized, ...prevAlerts]);
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlerts();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load alerts", e);
      setError("Failed to load alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    subscribeToAlerts(handleNewAlert);

    return () => {
      unsubscribeFromAlerts();
    };
  }, [loadAlerts, handleNewAlert]);

  if (loading) {
    return (
      <div className="alerts-panel">
        <h2>Alerts 📡</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="alerts-panel">
      <h2>
        Alerts 📡{" "}
        {alerts.length > 0 && (
          <span className="alerts-count">({alerts.length})</span>
        )}
      </h2>
      <div className="alerts-container">
        {error ? (
          <div className="alerts-error">{error}</div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => {
            const level = String(alert.level || "low").toLowerCase();
            return (
              <div
                key={alert.id ?? Math.random()}
                className={`alert alert-${level}`}
              >
                <div className="alert-header">
                  <span className={`alert-level ${level}`}>
                    {level.toUpperCase()}
                  </span>
                  <span className="alert-time">{alert.time || ""}</span>
                </div>
                <div className="alert-message">{alert.message || ""}</div>
                {alert.rule && (
                  <div className="alert-rule">Rule: {alert.rule}</div>
                )}
              </div>
            );
          })
        ) : (
          <div className="alerts-empty">No alerts at this time</div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
