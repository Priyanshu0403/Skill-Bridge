import express from "express";
const router = express.Router();

// router.post("/create", authMiddleware, createTransaction);
// router.get("/user/:userId", authMiddleware, getUserTransactions);
router.get("/balance", authMiddleware, getCreditBalance);
router.post("/transfer", authMiddleware, transferCredits);
router.get("/history", authMiddleware, getTransactionHistory);

export default router;