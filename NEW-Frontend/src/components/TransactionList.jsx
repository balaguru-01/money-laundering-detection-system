import React, { useEffect, useState } from "react";
import { transactionAPI } from "../services/apiService";
import "./TransactionList.css";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getAll(
        100,
        filter === "all" ? null : filter
      );
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "#00ff88",
      pending: "#ffa500",
      flagged: "#ff4444",
      cleared: "#00d4ff",
    };
    return colors[status] || "#fff";
  };

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h2>💳 Transaction History</h2>
        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="cleared">Cleared</option>
          </select>
          <button onClick={fetchTransactions} className="primary">
            Refresh
          </button>
        </div>
      </div>

      <div className="transactions-table">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="no-data">No transactions found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className={`status-${txn.status}`}>
                  <td>
                    {new Date(txn.date).toLocaleDateString()}{" "}
                    {new Date(txn.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="account-id">{txn.fromAccount}</td>
                  <td className="account-id">{txn.toAccount}</td>
                  <td className="amount">₹{txn.amount.toLocaleString()}</td>
                  <td className="type">{txn.type}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ color: getStatusColor(txn.status) }}
                    >
                      {txn.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
