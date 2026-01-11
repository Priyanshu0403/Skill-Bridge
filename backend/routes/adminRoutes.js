import express from "express";
import {
  getAllUsers,
  getAllGigs,
  blockUser,
  getReports
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// router.use(authMiddleware, roleMiddleware("admin"));
router.use(authMiddleware);

router.get("/users", getAllUsers);
router.get("/gigs", getAllGigs);
router.put("/block/:userId", blockUser);
router.get("/reports", getReports);

export default router;
