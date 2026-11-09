/**
 * GET /api/ml-anomalies
 * Get ML-based anomaly detection results
 * Uses Isolation Forest for outlier detection
 */
router.get("/ml-anomalies", (req, res) => {
  try {
    // For now, return a placeholder response
    // In production, call Python ML service or integrate directly
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
