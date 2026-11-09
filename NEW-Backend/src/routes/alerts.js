import express from "express";
import * as alertController from "../controllers/alertController.js";

const router = express.Router();

// Alert routes
router.get("/", alertController.getAlerts);
router.get("/stats", alertController.getAlertStats);
router.get("/:id", alertController.getAlertById);
router.patch("/:id/status", alertController.updateAlertStatus);

export default router;
