import db from "../config/db.js";

export const applyToGig = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    const userId = req.user.userId;

    // Check if gig exists & is open
    const gig = await db.oneOrNone(
      "SELECT gig_id FROM gigs WHERE gig_id = $1 AND status = 'open'",
      [gigId]
    );

    if (!gig) {
      return res.status(400).json({
        status: "failed",
        message: "Gig not found or not open"
      });
    }

    // Apply to gig
    const application = await db.oneOrNone(
      `INSERT INTO gig_applications (gig_id, applicant_id)
       VALUES ($1, $2)
       RETURNING application_id, gig_id, applicant_id, status, applied_at`,
      [gigId, userId]
    );

    if (!application) {
      return res.status(400).json({
        status: "failed",
        message: "Already applied to this gig"
      });
    }

    res.status(201).json({
      status: "success",
      message: "Applied to gig successfully",
      data: application
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};


export const getGigApplicants = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    const userId = req.user.userId;

    // Ownership check
    const gig = await db.oneOrNone(
      "SELECT gig_id FROM gigs WHERE gig_id = $1 AND created_by = $2",
      [gigId, userId]
    );

    if (!gig) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access"
      });
    }

    const applicants = await db.any(
      `SELECT 
          ga.application_id,
          ga.status,
          ga.applied_at,
          u.user_id,
          u.name,
          u.email
       FROM gig_applications ga
       JOIN users u ON ga.applicant_id = u.user_id
       WHERE ga.gig_id = $1`,
      [gigId]
    );

    res.status(200).json({
      status: "success",
      message: "Applicants fetched successfully",
      data: applicants
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};


export const assignGig = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    const applicantId = parseInt(req.params.userId);
    const ownerId = req.user.userId;

    // Ownership check
    const gig = await db.oneOrNone(
      "SELECT gig_id FROM gigs WHERE gig_id = $1 AND created_by = $2",
      [gigId, ownerId]
    );

    if (!gig) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access"
      });
    }

    // Accept selected applicant
    await db.none(
      `UPDATE gig_applications
       SET status = 'accepted'
       WHERE gig_id = $1 AND applicant_id = $2`,
      [gigId, applicantId]
    );

    // Reject others
    await db.none(
      `UPDATE gig_applications
       SET status = 'rejected'
       WHERE gig_id = $1 AND applicant_id != $2`,
      [gigId, applicantId]
    );

    // Update gig status
    await db.none(
      "UPDATE gigs SET status = 'assigned' WHERE gig_id = $1",
      [gigId]
    );

    res.status(200).json({
      status: "success",
      message: "Gig assigned successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};


export const completeGig = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    const userId = req.user.userId;

    // Ownership check
    const gig = await db.oneOrNone(
      "SELECT gig_id FROM gigs WHERE gig_id = $1 AND created_by = $2",
      [gigId, userId]
    );

    if (!gig) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access"
      });
    }

    await db.none(
      "UPDATE gigs SET status = 'completed' WHERE gig_id = $1",
      [gigId]
    );

    res.status(200).json({
      status: "success",
      message: "Gig marked as completed"
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};
