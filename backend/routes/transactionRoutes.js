import express from "express";
import { getCreditBalance, getTransactionHistory, recordPaidTransaction, transferCredits } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/create", authMiddleware, createTransaction);
// router.get("/user/:userId", authMiddleware, getUserTransactions);
router.get("/balance", authMiddleware, getCreditBalance);
router.post("/transfer", authMiddleware, transferCredits);
router.post("/paid", authMiddleware, recordPaidTransaction);
router.get("/history", authMiddleware, getTransactionHistory);

export default router;