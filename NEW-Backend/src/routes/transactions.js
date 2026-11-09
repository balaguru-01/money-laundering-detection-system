import express from "express";
import * as transactionController from "../controllers/transactionController.js";

const router = express.Router();

// Transaction routes
router.get("/", transactionController.getTransactions);
router.get("/:id", transactionController.getTransactionById);
router.post("/", transactionController.createTransaction);
router.patch("/:id/status", transactionController.updateTransactionStatus);

export default router;
