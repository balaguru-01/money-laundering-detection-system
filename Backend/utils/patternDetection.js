// Suspicious Pattern Detection
const THRESHOLDS = {
  LARGE_AMOUNT: 1000000, // ₹10,00,000
  RAPID_TRANSFER_COUNT: 5, // 5+ transfers within time window
  RAPID_TRANSFER_WINDOW: 3600000, // 1 hour in ms
  CROSS_BORDER_HIGH_AMOUNT: 1500000,
};

/**
 * Detect suspicious patterns in transactions
 * @param {Array} transactions - List of transactions
 * @param {Array} accounts - List of accounts
 * @returns {Array} List of alert objects
 */
function detectSuspiciousPatterns(transactions, accounts) {
  const alerts = [];
  const accountMap = new Map(accounts.map((acc) => [acc.id, acc]));

  // Rule 1: Large transactions above threshold
  transactions.forEach((tx) => {
    if (tx.amount > THRESHOLDS.LARGE_AMOUNT) {
      alerts.push({
        id: `alert_${tx.id}_large`,
        level: "high",
        message: `Large transaction detected on ${tx.fromAccount} - ₹${(
          tx.amount / 100000
        ).toFixed(2)} L`,
        transactionId: tx.id,
        fromAccount: tx.fromAccount,
        amount: tx.amount,
        timestamp: tx.timestamp,
        rule: "LARGE_AMOUNT",
      });
    }
  });

  // Rule 2: Rapid consecutive transfers from same account
  const accountTransfers = {};
  transactions.forEach((tx) => {
    if (!accountTransfers[tx.fromAccount]) {
      accountTransfers[tx.fromAccount] = [];
    }
    accountTransfers[tx.fromAccount].push(tx);
  });

  Object.entries(accountTransfers).forEach(([account, txs]) => {
    const sortedTxs = txs.sort((a, b) => a.timestamp - b.timestamp);
    for (let i = 0; i < sortedTxs.length - 1; i++) {
      const timeDiff = sortedTxs[i + 1].timestamp - sortedTxs[i].timestamp;
      if (timeDiff <= THRESHOLDS.RAPID_TRANSFER_WINDOW) {
        const windowTxs = sortedTxs.slice(i, i + 5);
        if (windowTxs.length >= THRESHOLDS.RAPID_TRANSFER_COUNT) {
          alerts.push({
            id: `alert_${account}_rapid_${i}`,
            level: "high",
            message: `Multiple transactions from ${account} within ${
              THRESHOLDS.RAPID_TRANSFER_WINDOW / 60000
            } minutes - ${windowTxs.length} transfers detected`,
            fromAccount: account,
            transactionCount: windowTxs.length,
            timestamp: Date.now(),
            rule: "RAPID_TRANSFERS",
          });
          break;
        }
      }
    }
  });

  // Rule 3: Cross-border transfers with high amounts
  transactions.forEach((tx) => {
    if (
      tx.type === "cross-border" &&
      tx.amount > THRESHOLDS.CROSS_BORDER_HIGH_AMOUNT
    ) {
      alerts.push({
        id: `alert_${tx.id}_crossborder`,
        level: "high",
        message: `Cross-border transfer detected - ${tx.fromAccount} to ${
          tx.toAccount
        } - ₹${(tx.amount / 100000).toFixed(2)} L`,
        transactionId: tx.id,
        fromAccount: tx.fromAccount,
        toAccount: tx.toAccount,
        amount: tx.amount,
        timestamp: tx.timestamp,
        rule: "CROSS_BORDER_HIGH_AMOUNT",
      });
    }
  });

  // Rule 4: Account risk profile checks
  transactions.forEach((tx) => {
    const fromAcc = accountMap.get(tx.fromAccount);
    if (fromAcc && fromAcc.risk === "high" && tx.amount > 500000) {
      alerts.push({
        id: `alert_${tx.id}_highrisk`,
        level: "medium",
        message: `High-risk account (${
          tx.fromAccount
        }) initiated significant transfer - ₹${(tx.amount / 100000).toFixed(
          2
        )} L`,
        fromAccount: tx.fromAccount,
        amount: tx.amount,
        timestamp: tx.timestamp,
        rule: "HIGH_RISK_ACCOUNT",
      });
    }
  });

  // Rule 5: Circular transfer patterns (A->B->C->A)
  const circularPatterns = detectCircularPatterns(transactions);
  circularPatterns.forEach((pattern) => {
    alerts.push({
      id: `alert_circular_${pattern.accounts.join("_")}`,
      level: "medium",
      message: `Circular transaction pattern detected: ${pattern.accounts.join(
        " → "
      )}`,
      accounts: pattern.accounts,
      timestamp: Date.now(),
      rule: "CIRCULAR_PATTERN",
    });
  });

  return alerts;
}

/**
 * Detect circular transfer patterns
 * @param {Array} transactions
 * @returns {Array} Circular patterns found
 */
function detectCircularPatterns(transactions) {
  const patterns = [];
  const graph = {};

  // Build graph
  transactions.forEach((tx) => {
    if (!graph[tx.fromAccount]) graph[tx.fromAccount] = [];
    graph[tx.fromAccount].push(tx.toAccount);
  });

  // Simple cycle detection for 3-node cycles
  Object.keys(graph).forEach((startNode) => {
    graph[startNode].forEach((nextNode) => {
      if (graph[nextNode]) {
        graph[nextNode].forEach((thirdNode) => {
          if (graph[thirdNode] && graph[thirdNode].includes(startNode)) {
            patterns.push({
              accounts: [startNode, nextNode, thirdNode],
            });
          }
        });
      }
    });
  });

  return patterns;
}

module.exports = {
  detectSuspiciousPatterns,
  detectCircularPatterns,
  THRESHOLDS,
};
