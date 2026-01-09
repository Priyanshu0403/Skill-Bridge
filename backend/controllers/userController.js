import db from "../config/db.js";
//this function will be for admin to get all users in the database
export const getAllUsers = async (req, res) => {
  try {
    const users = await db.any(
      `SELECT user_id, name, email,credits, reputation_score, created_at FROM users`
    );

    if (!users.length) {
      return res.status(404).json({
        status: "failed",
        message: "No users found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

//this function will get a single user profile by user id
//this function will be used by the user to get their own profile
//or by admin to get any user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await db.oneOrNone(
      `SELECT user_id,name,email,credits,reputation_score, created_at 
            FROM users
            WHERE user_id = $1`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

//this function will update a user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.userId != userId) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized to update this profile",
      });
    }

    const { name, bio } = req.body;

    /**COALESCE is a SQL function that:
Returns the first value that is NOT NULL.
🔹 Syntax
COALESCE(value1, value2, value3, ...)
SQL checks from left to right and returns the first non-null value. */

    const updateUser = await db.oneOrNone(
      `UPDATE users 
            SET
                name = COALESCE($1, name),
                bio = COALESCE($2, bio)
            WHERE user_id = $3
            RETURNING user_id, name, email, credits, reputation_score, created_at`,
      [name, bio, userId]
    );

    if (!updateUser) {
      return res.status(404).json({
        status: "failed",
        message: "Error updating user profile",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
        
      status: "failed",
      message: error.message,
    });
  }
};
