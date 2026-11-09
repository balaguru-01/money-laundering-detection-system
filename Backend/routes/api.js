// API Routes for Backend
const express = require("express");
const router = express.Router();

const { mockTransactions, mockAccounts } = require("../data/mockData");
const { detectSuspiciousPatterns } = require("../utils/patternDetection");
const {
  buildNetworkGraph,
  getNetworkStats,
} = require("../utils/networkAnalysis");

// Store for alerts (in-memory, would be database in production)
let generatedAlerts = detectSuspiciousPatterns(mockTransactions, mockAccounts);

/**
 * GET /api/transactions
 * Fetch all transactions with optional filtering
 */
router.get("/transactions", (req, res) => {
  try {
    const { limit, status } = req.query;
    let transactions = [...mockTransactions];

    // Apply filters if provided
    if (status === "flagged") {
      const flaggedIds = generatedAlerts
        .map((a) => a.transactionId)
        .filter(Boolean);
      transactions = transactions.filter((tx) => flaggedIds.includes(tx.id));
    }

    // Apply limit
    if (limit) {
      transactions = transactions.slice(0, parseInt(limit));
    }

    // Map to response format with status
    const response = transactions.map((tx) => {
      const isFlagged = generatedAlerts.some((a) => a.transactionId === tx.id);
      return {
        id: tx.id,
        account: tx.fromAccount,
        amount: tx.amount,
        status: isFlagged ? "Flagged" : "Cleared",
        date: tx.date,
        fromAccount: tx.fromAccount,
        fromName: tx.fromName,
        fromBank: tx.fromBank,
        toAccount: tx.toAccount,
        toName: tx.toName,
        toBank: tx.toBank,
        type: tx.type,
      };
    });

    res.json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/alerts
 * Retrieve detected alerts for suspicious activities
 */
router.get("/alerts", (req, res) => {
  try {
    const { level } = req.query;
    let alerts = [...generatedAlerts];

    // Filter by level if provided
    if (level) {
      alerts = alerts.filter((a) => a.level === level);
    }

    // Format for frontend
    const response = alerts.map((alert) => ({
      id: alert.id,
      level: alert.level,
      message: alert.message,
      time: formatTimeAgo(alert.timestamp),
      rule: alert.rule,
      details: {
        fromAccount: alert.fromAccount,
        toAccount: alert.toAccount,
        amount: alert.amount,
        transactionId: alert.transactionId,
      },
    }));

    res.json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/network
 * Get network data for visualization
 */
router.get("/network", (req, res) => {
  try {
    const graph = buildNetworkGraph(mockTransactions);
    const stats = getNetworkStats(mockTransactions);

    res.json({
      success: true,
      data: {
        graph: graph,
        stats: stats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/stats
 * Get dashboard statistics
 */
router.get("/stats", (req, res) => {
  try {
    const stats = {
      totalTransactions: mockTransactions.length,
      totalAlerts: generatedAlerts.length,
      highRiskAlerts: generatedAlerts.filter((a) => a.level === "high").length,
      totalVolume: mockTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      accounts: mockAccounts.length,
      recentAlerts: generatedAlerts.slice(0, 5),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/rescan
 * Trigger re-scanning for suspicious patterns
 */
router.post("/rescan", (req, res) => {
  try {
    generatedAlerts = detectSuspiciousPatterns(mockTransactions, mockAccounts);
    const io = req.app.get("io");

    // Broadcast new alerts via WebSocket
    if (io) {
      generatedAlerts.forEach((alert) => {
        io.to("alerts").emit("new-alert", {
          id: alert.id,
          level: alert.level,
          message: alert.message,
          time: formatTimeAgo(alert.timestamp),
          rule: alert.rule,
          timestamp: new Date().toISOString(),
        });
      });
    }

    res.json({
      success: true,
      message: "Scan complete",
      alertsFound: generatedAlerts.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ml-anomalies
 * Get ML-based anomaly detection results
 * Uses Isolation Forest-like detection for outliers
 */
router.get("/ml-anomalies", (req, res) => {
  try {
    const mlAnomalies = detectMLAnomalies(mockTransactions);
    res.json({
      success: true,
      count: mlAnomalies.length,
      data: mlAnomalies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ML-based anomaly detection using Isolation Forest logic (JS implementation)
 * @param {Array} transactions
 * @returns {Array} Anomalous transactions
 */
function detectMLAnomalies(transactions) {
  const anomalies = [];

  // Calculate statistical features
  const amounts = transactions.map((tx) => tx.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length
  );

  // Isolation Forest-like detection: flag transactions > 2.5 std deviations
  transactions.forEach((tx) => {
    const zScore = Math.abs((tx.amount - mean) / stdDev);
    if (zScore > 2.5) {
      anomalies.push({
        id: `ml_anomaly_${tx.id}`,
        transactionId: tx.id,
        fromAccount: tx.fromAccount,
        toAccount: tx.toAccount,
        amount: tx.amount,
        anomalyScore: zScore.toFixed(2),
        reason: `High value transaction (${zScore.toFixed(
          2
        )} std deviations from mean)`,
        confidence: Math.min(0.95, 0.5 + zScore * 0.15),
        model: "isolation-forest",
      });
    }
  });

  // Frequency-based detection: accounts with unusually high transaction count
  const accountFreq = {};
  transactions.forEach((tx) => {
    accountFreq[tx.fromAccount] = (accountFreq[tx.fromAccount] || 0) + 1;
  });
  const freqMean =
    Object.values(accountFreq).reduce((a, b) => a + b, 0) /
    Object.keys(accountFreq).length;
  const freqStdDev = Math.sqrt(
    Object.values(accountFreq).reduce(
      (sq, n) => sq + Math.pow(n - freqMean, 2),
      0
    ) / Object.keys(accountFreq).length
  );

  Object.entries(accountFreq).forEach(([account, freq]) => {
    const zScore = Math.abs((freq - freqMean) / freqStdDev);
    if (zScore > 1.8) {
      anomalies.push({
        id: `ml_freq_${account}`,
        fromAccount: account,
        anomalyScore: zScore.toFixed(2),
        reason: `Unusual transaction frequency (${freq} transactions, ${zScore.toFixed(
          2
        )} std deviations)`,
        confidence: Math.min(0.85, 0.4 + zScore * 0.12),
        model: "frequency-analysis",
      });
    }
  });

  return anomalies;
}

/**
 * GET /api/blockchain
 * Get blockchain transaction monitoring data
 */
router.get("/blockchain", (req, res) => {
  try {
    const blockchainData = getBlockchainData();
    res.json({
      success: true,
      data: blockchainData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Mock blockchain data retrieval
 * In production, connect to Ethereum/Bitcoin nodes via Web3.js or ethers.js
 * @returns {Object} Blockchain transaction data
 */
function getBlockchainData() {
  return {
    ethereum: {
      network: "Mainnet",
      connectedAccounts: ["0x742d35Cc6634C0532925a3b844Bc9e7595f..."],
      recentTransactions: [
        {
          hash: "0x1234567890abcdef...",
          from: "0x742d35Cc...",
          to: "0x987654321...",
          value: "5.5 ETH",
          timestamp: new Date().toISOString(),
          status: "confirmed",
          riskLevel: "low",
        },
      ],
      suspiciousPatterns: [
        {
          pattern: "Rapid sequential transfers",
          count: 2,
          accounts: ["0x742d35Cc...", "0x987654321..."],
          severity: "medium",
        },
      ],
    },
    bitcoin: {
      network: "Mainnet",
      addresses: ["1A1z7agoat...", "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy"],
      recentTransactions: [
        {
          txid: "aAbcdef0123...",
          from: "1A1z7agoat...",
          to: "3J98t1WpEZ7...",
          amount: "0.35 BTC",
          timestamp: new Date().toISOString(),
          confirmations: 6,
          riskLevel: "low",
        },
      ],
      alerts: [
        {
          type: "high-value-transfer",
          message: "Transfer > 1 BTC detected",
          count: 1,
          severity: "medium",
        },
      ],
    },
    mixerDetection: {
      flaggedAddresses: ["3J98t1WpEZ73..."],
      mixerServices: ["Tornado Cash", "Coin Mixer"],
      riskLevel: "high",
    },
  };
}

module.exports = router;
