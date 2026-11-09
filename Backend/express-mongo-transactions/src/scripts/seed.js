const mongoose = require("mongoose");
const path = require("path");
const Transaction = require("../models/transaction.model");
const mockData = require(path.resolve(__dirname, "../../../data/mockData.js"));

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/proactive";

async function main() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Transaction.deleteMany({});
  await Transaction.insertMany(mockData);
  console.log(
    `Inserted ${Array.isArray(mockData) ? mockData.length : 0} transactions`
  );
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
