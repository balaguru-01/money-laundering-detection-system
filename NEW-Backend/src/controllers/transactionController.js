import Transaction from "../models/Transaction.js";
import Alert from "../models/Alert.js";
import Account from "../models/Account.js";
import anomalyDetector from "../utils/anomalyDetector.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all transactions
export const getTransactions = asyncHandler(async (req, res) => {
  const { limit = 50, status, fromAccount, toAccount } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (fromAccount) filter.fromAccount = fromAccount;
  if (toAccount) filter.toAccount = toAccount;

  const transactions = await Transaction.find(filter)
    .limit(parseInt(limit))
    .sort({ date: -1 });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// Get transaction by ID
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    transactionId: req.params.id,
  });

  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  res.json({ success: true, data: transaction });
});

// Create new transaction
export const createTransaction = asyncHandler(async (req, res) => {
  const { transactionId, fromAccount, toAccount, amount, type, metadata } =
    req.body;

  // Validate required fields
  if (!transactionId || !fromAccount || !toAccount || !amount) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const transaction = new Transaction({
    transactionId,
    fromAccount,
    toAccount,
    amount,
    type: type || "transfer",
    metadata,
    status: "completed",
  });

  await transaction.save();

  // Analyze for anomalies
  const detections = await anomalyDetector.analyzeTransaction(transaction);

  // Create alerts for detected anomalies
  const alerts = [];
  for (const detection of detections) {
    const alert = new Alert({
      alertId: `alert_${Date.now()}_${Math.random()}`,
      transactionId,
      level: detection.severity,
      rule: detection.rule,
      message: detection.message,
      details: {
        fromAccount,
        toAccount,
        amount,
      },
      status: "open",
    });
    await alert.save();
    alerts.push(alert);
  }

  // Update transaction with detection flags
  if (detections.length > 0) {
    transaction.detectionFlags = detections.map((d) => ({
      rule: d.rule,
      severity: d.severity,
      timestamp: new Date(),
    }));
    transaction.status = "flagged";
    await transaction.save();
  }

  res.status(201).json({
    success: true,
    data: { transaction, alerts },
  });
});

// Update transaction status
export const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "completed", "flagged", "cleared"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const transaction = await Transaction.findOneAndUpdate(
    { transactionId: req.params.id },
    { status },
    { new: true }
  );

  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  res.json({ success: true, data: transaction });
});
