import mongoose from "mongoose";
import dotenv from "dotenv";
import Transaction from "../src/models/Transaction.js";
import Account from "../src/models/Account.js";
import Alert from "../src/models/Alert.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/money-laundering-detection"
    );
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Generate fake accounts
const generateAccounts = () => {
  const countries = ["India", "USA", "UK", "China", "UAE", "Nigeria", "Russia"];
  const types = ["individual", "business", "charity"];
  const names = [
    "Rajesh Kumar",
    "Priya Singh",
    "Amit Patel",
    "Neha Sharma",
    "John Smith",
    "Maria Garcia",
    "Chen Wei",
    "Ahmed Hassan",
  ];

  return names.map((name, idx) => ({
    accountId: `ACC-${String(idx + 1).padStart(5, "0")}`,
    accountHolder: name,
    accountType: types[idx % 3],
    balance: Math.random() * 500000,
    createdDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ),
    country: countries[idx % countries.length],
    riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    status: "active",
  }));
};

// Generate fake transactions
const generateTransactions = (accounts) => {
  const transactions = [];
  const types = ["transfer", "withdrawal", "deposit", "payment"];
  const statuses = ["pending", "completed", "flagged", "cleared"];
  const paymentMethods = ["wire_transfer", "card", "cash", "check", "crypto"];

  for (let i = 0; i < 50; i++) {
    const from = accounts[Math.floor(Math.random() * accounts.length)];
    const to = accounts[Math.floor(Math.random() * accounts.length)];

    // Create some suspicious transactions
    const isSuspicious = Math.random() < 0.3;
    const amount = isSuspicious
      ? Math.random() * 900000 + 100000 // Large suspicious amounts
      : Math.random() * 50000 + 1000; // Normal amounts

    transactions.push({
      transactionId: `TXN-${String(i + 1).padStart(6, "0")}`,
      fromAccount: from.accountId,
      toAccount: to.accountId,
      amount: Math.round(amount),
      currency: "INR",
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Payment from ${from.accountHolder} to ${to.accountHolder}`,
      metadata: {
        country: to.country,
        paymentMethod:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        reference: `REF-${Math.random()
          .toString(36)
          .substring(7)
          .toUpperCase()}`,
      },
    });
  }

  return transactions;
};

// Generate fake alerts
const generateAlerts = (transactions) => {
  const levels = ["low", "medium", "high", "critical"];
  const rules = [
    "LARGE_AMOUNT",
    "RAPID_SUCCESSION",
    "CROSS_BORDER",
    "CIRCULAR_PATTERN",
    "UNUSUAL_TIME",
    "ROUND_AMOUNT",
    "MULTIPLE_DESTINATIONS",
    "DORMANT_ACTIVATION",
  ];

  return transactions
    .filter((_, idx) => idx % 5 === 0) // Create alerts for ~20% of transactions
    .map((tx, idx) => ({
      alertId: `ALT-${String(idx + 1).padStart(6, "0")}`,
      transactionId: tx.transactionId,
      level: levels[Math.floor(Math.random() * levels.length)],
      rule: rules[Math.floor(Math.random() * rules.length)],
      message: `Suspicious activity detected: ${tx.transactionId}`,
      details: {
        amount: tx.amount,
        from: tx.fromAccount,
        to: tx.toAccount,
        pattern: "Flagged for review",
      },
      status: ["open", "reviewed", "resolved"][Math.floor(Math.random() * 3)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    await Alert.deleteMany({});

    // Create accounts
    console.log("👤 Generating accounts...");
    const accounts = generateAccounts();
    const savedAccounts = await Account.insertMany(accounts);
    console.log(`✅ Inserted ${savedAccounts.length} accounts`);

    // Create transactions
    console.log("💳 Generating transactions...");
    const transactions = generateTransactions(accounts);
    const savedTransactions = await Transaction.insertMany(transactions);
    console.log(`✅ Inserted ${savedTransactions.length} transactions`);

    // Create alerts
    console.log("🚨 Generating alerts...");
    const alerts = generateAlerts(transactions);
    const savedAlerts = await Alert.insertMany(alerts);
    console.log(`✅ Inserted ${savedAlerts.length} alerts`);

    console.log(`
╔════════════════════════════════════════════════════════════╗
║            Database Seeding Complete! ✅                  ║
╠════════════════════════════════════════════════════════════╣
║  Accounts:       ${String(savedAccounts.length).padStart(3)} accounts created
║  Transactions:   ${String(savedTransactions.length).padStart(
      3
    )} transactions created
║  Alerts:         ${String(savedAlerts.length).padStart(3)} alerts generated
╚════════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
