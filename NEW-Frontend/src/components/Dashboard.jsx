import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { alertAPI, transactionAPI } from "../services/apiService";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [alertsRes, txnsRes] = await Promise.all([
        alertAPI.getStats(),
        transactionAPI.getAll(1000),
      ]);

      const alertStats = alertsRes.data.data;
      setStats(alertStats);

      // Process transactions for chart
      const txns = txnsRes.data.data;
      const hourlyData = {};
      txns.forEach((txn) => {
        const hour = new Date(txn.date).getHours();
        hourlyData[hour] = (hourlyData[hour] || 0) + txn.amount;
      });

      const chartData = Object.entries(hourlyData).map(([hour, amount]) => ({
        hour: `${hour}:00`,
        amount: Math.round(amount / 1000000), // Convert to millions
      }));

      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#ff0000", "#ff4444", "#ffa500", "#ffff00"];

  if (loading) {
    return <div className="dashboard loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="dashboard error">Error loading dashboard</div>;
  }

  const alertLevelData = [
    { name: "Critical", value: stats.byLevel.critical },
    { name: "High", value: stats.byLevel.high },
    { name: "Medium", value: stats.byLevel.medium },
    { name: "Low", value: stats.byLevel.low },
  ];

  const alertStatusData = [
    { name: "Open", value: stats.byStatus.open },
    { name: "Reviewed", value: stats.byStatus.reviewed },
    { name: "Resolved", value: stats.byStatus.resolved },
    { name: "False Positive", value: stats.byStatus.falsePositive },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Detection Dashboard</h1>
        <button onClick={fetchDashboardData} className="primary">
          Refresh
        </button>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-label">Total Alerts</div>
        </div>
        <div className="kpi-card critical">
          <div className="kpi-value">{stats.byLevel.critical}</div>
          <div className="kpi-label">Critical</div>
        </div>
        <div className="kpi-card high">
          <div className="kpi-value">{stats.byLevel.high}</div>
          <div className="kpi-label">High Priority</div>
        </div>
        <div className="kpi-card medium">
          <div className="kpi-value">{stats.byLevel.medium}</div>
          <div className="kpi-label">Medium Priority</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Alerts by Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {alertLevelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Alerts by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00d4ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="charts-container">
          <div className="chart-box full-width">
            <h3>Transaction Amount Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis
                  label={{
                    value: "Amount (Millions)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#00ff88"
                  dot={{ fill: "#00d4ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
