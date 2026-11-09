import Alert from "../models/Alert.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all alerts
export const getAlerts = asyncHandler(async (req, res) => {
  const { limit = 50, level, status } = req.query;

  const filter = {};
  if (level) filter.level = level;
  if (status) filter.status = status;

  const alerts = await Alert.find(filter)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
});

// Get alert by ID
export const getAlertById = asyncHandler(async (req, res) => {
  const alert = await Alert.findOne({ alertId: req.params.id });

  if (!alert) {
    return res.status(404).json({ success: false, message: "Alert not found" });
  }

  res.json({ success: true, data: alert });
});

// Update alert status
export const updateAlertStatus = asyncHandler(async (req, res) => {
  const { status, reviewedBy } = req.body;

  if (!["open", "reviewed", "resolved", "false-positive"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const alert = await Alert.findOneAndUpdate(
    { alertId: req.params.id },
    { status, reviewedAt: new Date(), reviewedBy },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({ success: false, message: "Alert not found" });
  }

  res.json({ success: true, data: alert });
});

// Get alert statistics
export const getAlertStats = asyncHandler(async (req, res) => {
  const stats = {
    total: await Alert.countDocuments(),
    byLevel: {
      critical: await Alert.countDocuments({ level: "critical" }),
      high: await Alert.countDocuments({ level: "high" }),
      medium: await Alert.countDocuments({ level: "medium" }),
      low: await Alert.countDocuments({ level: "low" }),
    },
    byStatus: {
      open: await Alert.countDocuments({ status: "open" }),
      reviewed: await Alert.countDocuments({ status: "reviewed" }),
      resolved: await Alert.countDocuments({ status: "resolved" }),
      falsePositive: await Alert.countDocuments({ status: "false-positive" }),
    },
  };

  res.json({ success: true, data: stats });
});
