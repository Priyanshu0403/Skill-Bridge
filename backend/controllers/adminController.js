import db from "../config/db.js";

/* =========================
   USER MANAGEMENT
========================= */

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await db.any(
      `SELECT user_id, name, email, role, is_blocked, created_at
     FROM users
     ORDER BY created_at DESC`,
    );

    res.json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await db.oneOrNone(
      `SELECT user_id, name, email, role, is_blocked, credits, reputation_score
     FROM users WHERE user_id = $1`,
      [userId],
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { role } = req.body;

    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid role",
      });
    }

    const user = await db.oneOrNone(
      `UPDATE users SET role = $1 WHERE user_id = $2
     RETURNING user_id, name, role`,
      [role, userId],
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "User role updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Block / unblock user
export const blockUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { block } = req.body;

    const user = await db.oneOrNone(
      `UPDATE users SET is_blocked = $1 WHERE user_id = $2
     RETURNING user_id, name, is_blocked`,
      [block, userId],
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.json({
      status: "success",
      message: `User ${block ? "blocked" : "unblocked"}`,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

/* =========================
   GIG MANAGEMENT
========================= */

// Get all gigs
export const getAllGigs = async (req, res) => {
  try {
    const gigs = await db.any(
      `SELECT g.gig_id, g.title, g.status, g.type, u.name AS created_by
     FROM gigs g
     JOIN users u ON g.created_by = u.user_id
     ORDER BY g.created_at DESC`,
    );

    res.json({ status: "success", data: gigs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Update gig status
export const updateGigStatusAdmin = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    const { status } = req.body;

    if (!["open", "assigned", "completed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid status" });
    }

    const gig = await db.oneOrNone(
      `UPDATE gigs SET status = $1 WHERE gig_id = $2
     RETURNING gig_id, title, status`,
      [status, gigId],
    );

    if (!gig) {
      return res
        .status(404)
        .json({ status: "failed", message: "Gig not found" });
    }

    res.json({ status: "success", data: gig });
  } catch (error) {
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Force delete gig
//deleting a gig with transaction will give error as the transaction table has the
//reference to this gig so it doesnot allow to delete the gig which is assigned to someone user_id
export const forceDeleteGig = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);

    const deleted = await db.oneOrNone(
      `DELETE FROM gigs WHERE gig_id = $1 RETURNING gig_id`,
      [gigId],
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "failed", message: "Gig not found" });
    }

    res.json({ status: "success", message: "Gig deleted by admin" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed", error: error.message });
  }
};

/* =========================
   PLATFORM MONITORING
========================= */

// All transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await db.any(
      `SELECT transaction_id, mode, amount_paid, credits_exchanged, status, created_at
     FROM transactions
     ORDER BY created_at DESC`,
    );

    res.json({ status: "success", data: transactions });
  } catch (error) {
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// All reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await db.any(
      `SELECT r.review_id, r.rating, r.review, u.name AS reviewer
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.user_id
     ORDER BY r.created_at DESC`,
    );

    
    if(reviews.length == 0){
        res.status(404).json({ status: "failed", message: "No reviews found" });
    }
    res.json({ status: "success", data: reviews });
  } catch (error) {
    res.status(500).json({ message: "failed", error: error.message });
  }
};

// Platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const stats = await db.one(`
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM gigs) AS total_gigs,
      (SELECT COUNT(*) FROM reviews) AS total_reviews,
      (SELECT COUNT(*) FROM transactions) AS total_transactions
  `);

    res.json({ status: "success", data: stats });
  } catch (error) {
    res.status(500).json({ message: "failed", error: error.message });
  }
};
