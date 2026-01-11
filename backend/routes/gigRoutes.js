import express from "express";
import { createGig, deleteGig, getAllGigs, getGigById, updateGig } from "../controllers/gigController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createGig);
router.get("/",getAllGigs);
router.get("/:id", getGigById);
router.put("/:id", authMiddleware, updateGig);
router.delete("/:id",authMiddleware, deleteGig);

export default router;
