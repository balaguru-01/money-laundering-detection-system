import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fromAccount: {
      type: String,
      required: true,
      index: true,
    },
    toAccount: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      enum: ["transfer", "withdrawal", "deposit", "payment"],
      default: "transfer",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "flagged", "cleared"],
      default: "completed",
    },
    description: String,
    metadata: {
      country: String,
      paymentMethod: String,
      reference: String,
    },
    detectionFlags: [
      {
        rule: String,
        severity: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
