import express from "express";
import * as networkController from "../controllers/networkController.js";

const router = express.Router();

// Network routes
router.get("/", networkController.getNetwork);
router.get("/anomalies", networkController.getAnomalousSubgraphs);
router.get("/accounts", networkController.getAccounts);
router.get("/accounts/:accountId/stats", networkController.getAccountStats);

export default router;
