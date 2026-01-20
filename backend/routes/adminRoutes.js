import express from "express";
import {
  getAllUsers,
  getAllGigs,
  blockUser,
  getPlatformStats,
  getAllTransactions
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

const adminOnly = (req,res,next)=>{
  if(req.user.role!=="admin");
    return res.status(403).json({
      status:"failed",
      message:"Admin access required"
    }),
    next();
};
// router.use(authMiddleware, roleMiddleware("admin"));
//.use() applies middleware to every route defined below it in that file.
//checks if the users is verified as well as user is a admin 
//if its true then the belowe functions get executed
router.use(authMiddleware,adminOnly);

router.get("/users", getAllUsers);
router.get("/gigs", getAllGigs);
router.put("/block/:userId", blockUser);
router.get("/reports", getAllTransactions);
router.get("stats", getPlatformStats);

export default router;
