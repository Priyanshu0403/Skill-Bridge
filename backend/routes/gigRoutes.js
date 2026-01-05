import express from "express";
import { createGig, getAllGigs } from "../controllers/gigController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// import db from "../config/db.js";

const router = express.Router();

router.post("/create", authMiddleware, createGig);
router.get("/",getAllGigs);



// // GET all gigs
// router.get("/", async (req, res) => {
//   try {
//     const gigs = await db.any("SELECT * FROM gigs");
//     res.json(gigs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // CREATE gig
// router.post("/create", async (req, res) => {
//   const { title, description, mode } = req.body;

//   try {
//     await db.none(
//       "INSERT INTO gigs (title, description, mode) VALUES ($1, $2, $3)",
//       [title, description, mode]
//     );
//     res.json({ message: "Gig created successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
