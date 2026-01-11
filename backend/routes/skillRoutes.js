//Students - AI based

import express from "express";

const router = express.Router();

router.post("/add", authMiddleware, addSkill);
router.get("/:userId", authMiddleware, getUserSkills);
router.get("/match/:gigId", authMiddleware, matchSkillsWithGig);

export default router;