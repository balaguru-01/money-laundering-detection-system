import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import AlertsPanel from "./components/AlertsPanel";
import TransactionList from "./components/TransactionList";
import NetworkVisualization from "./components/NetworkVisualization";
import ReportsSection from "./components/ReportsSection";
import "./App.css";

function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />;
      case "alerts":
        return <AlertsPanel />;
      case "transactions":
        return <TransactionList />;
      case "network":
        return <NetworkVisualization />;
      case "reports":
        return <ReportsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">💰 Money Laundering Detection System</h1>
          <p className="app-subtitle">
            Real-time Financial Crime Detection & Prevention
          </p>
        </div>
        <div className="header-status">
          <span className="status-indicator online"></span>
          <span className="status-text">System Online</span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${currentTab === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${currentTab === "alerts" ? "active" : ""}`}
          onClick={() => setCurrentTab("alerts")}
        >
          🚨 Alerts
        </button>
        <button
          className={`nav-btn ${currentTab === "transactions" ? "active" : ""}`}
          onClick={() => setCurrentTab("transactions")}
        >
          💳 Transactions
        </button>
        <button
          className={`nav-btn ${currentTab === "network" ? "active" : ""}`}
          onClick={() => setCurrentTab("network")}
        >
          🕸️ Network
        </button>
        <button
          className={`nav-btn ${currentTab === "reports" ? "active" : ""}`}
          onClick={() => setCurrentTab("reports")}
        >
          📈 Reports
        </button>
      </nav>

      <main className="app-main">{renderContent()}</main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 Money Laundering Detection System v2.0</p>
          <p>Advanced AI-powered Financial Crime Detection</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
