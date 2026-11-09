import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["individual", "business", "charity"],
      default: "individual",
    },
    balance: {
      type: Number,
      default: 0,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    country: {
      type: String,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "closed"],
      default: "active",
    },
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
