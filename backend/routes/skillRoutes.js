//Students - AI based

import express from "express";
import { addSkill, addSkillToGig, addSkillToUser, getGigSkills, getUserSkills, matchSkillsWithGig } from "../controllers/skillController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authMiddleware, addSkill);
router.post("/user/add",authMiddleware,addSkillToUser);
router.get("/user/:userId", authMiddleware, getUserSkills);
router.post("/gig/:gigId/add",authMiddleware,addSkillToGig);
router.get("/gig/:gigId", getGigSkills);

//for AI matching in future
router.get("/match/:gigId",matchSkillsWithGig);

export default router;