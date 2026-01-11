//this is the main router file where we will combine all the routes
import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
// import transactionRoutes from "./transactionRoutes.js";
import gigRoutes from "./gigRoutes.js";
import gigApplicationRoutes from "./gigApplicationRoutes.js";
// import reviewRoutes from "./reviewRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// router.use("/trasactions", transactionRoutes);
router.use("/gigs", gigRoutes);
// router.use("/reviews", reviewRoutes);
router.use("/applications", gigApplicationRoutes);
// router.use("/skills", skillRoutes);
// router.use("/admin", adminRoutes);


export default router;