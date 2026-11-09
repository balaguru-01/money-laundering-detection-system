import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionId: {
      type: String,
      ref: "Transaction",
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
      index: true,
    },
    rule: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      fromAccount: String,
      toAccount: String,
      amount: Number,
      pattern: String,
      confidence: Number,
    },
    status: {
      type: String,
      enum: ["open", "reviewed", "resolved", "false-positive"],
      default: "open",
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    reviewedAt: Date,
    reviewedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
