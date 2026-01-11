import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { applyToGig, assignGig, completeGig, getGigApplicants } from "../controllers/gigApplicationController.js";

const router = express.Router();

//Student applies to a gig
// :gigId are the params in the url like /1/apply
router.post("/:gigId/apply",authMiddleware, applyToGig);

//recrutiers view applications to their gig
router.get("/:gigId/applicants",authMiddleware, getGigApplicants);
router.put("/:gigId/assign/:userId", authMiddleware, assignGig);
router.put("/:gigId/complete", authMiddleware, completeGig);

export default router;