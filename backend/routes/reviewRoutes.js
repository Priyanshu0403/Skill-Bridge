import express from "express";
import {
  createReview,
  getReviewsByUser,
  getReviewsByGig
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Students can create reviews for gigs they have completed
router.post("/:gigId", authMiddleware, createReview);

// public 
router.get("/user/:userId", getReviewsByUser);
router.get("/gig/:gigId", getReviewsByGig);

export default router;
