
import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  blockUser,

  getAllGigs,
  forceDeleteGig,
  updateGigStatusAdmin,

  getAllTransactions,
  getAllReviews,
  getPlatformStats
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔐 Admin-only middleware */
const adminOnly = (req, res, next) => {
  // console.log(req.user);
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "failed",
      message: "Admin access required"
    });
  }
  next();
};
// router.use(authMiddleware, roleMiddleware("admin"));
//.use() applies middleware to every route defined below it in that file.
//checks if the users is verified as well as user is a admin 
//if its true then the belowe functions get executed
router.use(authMiddleware, adminOnly);

/* USER MANAGEMENT */
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/role", updateUserRole);
router.put("/block/:userId", blockUser);

/* GIG MANAGEMENT */
router.get("/gigs", getAllGigs);
router.put("/gigs/:gigId/status", updateGigStatusAdmin);
router.delete("/gigs/:gigId", forceDeleteGig);

/* PLATFORM MONITORING */
router.get("/transactions", getAllTransactions);
router.get("/reviews", getAllReviews);
router.get("/stats", getPlatformStats);

export default router;
