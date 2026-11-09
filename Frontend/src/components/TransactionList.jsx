import {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {subscribeToAlerts, unsubscribeFromAlerts} from "../services/socketService";
import "./TransactionList.css";


const safeText = (...values) => {
    for (const v of values) {
        if (typeof v === "string") {
            const t = v.trim().replace(/^"(.*)"$/, '$1');
            if (t) return t;
        }
    }
    return "NA";
};

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setError(null);
            const res = await axios.get("http://localhost:5000/api/transactions");
            if (res.data.success) {
                setTransactions(res.data.data || []);
            } else {
                setError("Failed to fetch transactions");
                setTransactions([]);
            }
        } catch (err) {
            console.error("Error fetching transactions", err);
            setError(err.message || "Failed to fetch transactions");
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        const onNewAlert = () => {
            fetchTransactions();
        };
        subscribeToAlerts(onNewAlert);
        return () => {
            unsubscribeFromAlerts();
        };
    }, [fetchTransactions]);

    if (loading) {
        return (
            <div className="transaction-list">
                <h2>Recent Transactions</h2>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transaction-list">
                <h2>Recent Transactions</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="transaction-list">
            <h2>Recent Transactions</h2>
            <div className="table-wrapper">
                <table className="transactions-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Sender Name</th>
                        <th>Sender Bank</th>
                        <th>Receiver Name</th>
                        <th>Receiver Bank</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-data">No transactions found</td>
                        </tr>
                    ) : (
                        transactions.map((tx) => {
                            const statusKey = (tx.status || '').toLowerCase().replace(/\s+/g, '-');
                            return (
                                <tr key={tx.id} className={`status-${statusKey}`}>
                                    <td className="id-cell">{tx.id}</td>
                                    <td className="date-cell">
                                        {tx.date ? new Date(tx.date).toLocaleDateString() : "NA"}
                                    </td>
                                    <td className="sender-name-cell">
                                        {safeText(tx.fromName, tx.sender)}
                                    </td>
                                    <td className="sender-bank-cell">{safeText(tx.fromBank)}</td>
                                    <td className="receiver-name-cell">
                                        {safeText(tx.toName, tx.receiver)}
                                    </td>
                                    <td className="receiver-bank-cell">{safeText(tx.toBank)}</td>
                                    <td className="status-cell"><span
                                        className="status-badge">{safeText(tx.status)}</span></td>
                                    <td className="amount-cell">
                                        ₹{typeof tx.amount === "number" ? tx.amount.toLocaleString() : "0"}
                                    </td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;
