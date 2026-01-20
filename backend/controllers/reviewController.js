import db from '../config/db.js';

/**
 * Create a review for a gig.
 * - the reviewer is taken from req.user (auth middleware)
 * - gigId comes from req.params.gigId
 * - body: { rating: number (1-5), review: string }
 */
export const createReview = async (req, res) => {
  try {
    const reviewer_id = req.user?.userId;
    const gigId = parseInt(req.params.gigId);
    if (Number.isNaN(gigId)) return res.status(400).json({ status: 'failed', message: 'Invalid gig id' });
    const { reviewed_user_id,rating,review} = req.body;

   if (!reviewed_user_id || !rating) {
      return res.status(400).json({
        status: "failed",
        message: "reviewed_user_id and rating are required"
      });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ status: 'failed', message: 'Rating must be a number between 1 and 5' });
    }


    // Verify gig exists and get owner
    const gig = await db.oneOrNone(
        'SELECT gig_id, created_by,status FROM gigs WHERE gig_id = $1',
         [gigId]);

    if (!gig) return res.status(404).json({ status: 'failed', message: 'Gig not found' });

    if(gig.status!=="completed"){
        return res.status(404).json({
            status:"failed",
            message:"Review allowed only after gig completion"
        })
    }
    const gig_creator_id = gig.created_by;

    if (gig_creator_id === reviewer_id) {
      return res.status(400).json({ status: 'failed', message: "You can't review your own gig" });
    }



    // Insert review
    try {
      const newReview = await db.one(
        `INSERT INTO reviews (gig_id, reviewer_id, reviewed_user_id, rating, review)
         VALUES($1, $2, $3, $4, $5)
         RETURNING review_id, gig_id, reviewer_id, reviewed_user_id, rating, review, created_at`,
        [gigId, reviewer_id, reviewed_user_id, rating, review || null]
      );

      // Update reviewed user's reputation and reviews_count
      const userRow = await db.oneOrNone('SELECT reputation_score, reviews_count FROM users WHERE user_id = $1', [gig_creator_id]);
      if (userRow) {
        const oldCount = Number(userRow.reviews_count || 0);
        const oldReputation = Number(userRow.reputation_score || 0);
        const newCount = oldCount + 1;
        const newReputation = ((oldReputation * oldCount) + rating) / newCount;

        await db.none('UPDATE users SET reputation_score = $1, reviews_count = $2 WHERE user_id = $3', [newReputation, newCount, gig_creator_id]);
      }

      return res.status(201).json({ status: 'success', data: newReview });
    } catch (err) {
      // Unique constraint (one review per gig per reviewer)
      if (err && err.code === '23505') {
        return res.status(409).json({ status: 'failed', message: 'You have already reviewed this gig' });
      }
      throw err;
    }
  } catch (err) {
    console.error('createReview error:', err);
    return res.status(500).json({ status: 'failed', message: err.message });
  }
};

//this is the function to get the reviews written by the user of the provided id
export const getReviewsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) return res.status(400).json({ status: 'failed', message: 'Invalid user id' });

    const reviews = await db.any(
      `SELECT r.review_id, r.gig_id, r.reviewer_id, r.rating, r.review, r.created_at,
              u.name AS reviewer_name, g.title as gig_title
       FROM reviews r
       JOIN users u ON u.user_id = r.reviewer_id
       LEFT JOIN gigs g ON g.gig_id = r.gig_id
       WHERE r.reviewed_user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
      status: "failed",
      message: "reviews not found"
    });
  }

    return res.status(200).json({ status: 'success', data: reviews });
  } catch (err) {
    console.error('getReviewsByUser error:', err);
    return res.status(500).json({ status: 'failed', message: err.message });
  }
};

export const getReviewsByGig = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);
    if (Number.isNaN(gigId)) return res.status(400).json({ status: 'failed', message: 'Invalid gig id' });

    const reviews = await db.any(
      `SELECT r.review_id, r.gig_id, r.reviewer_id, r.rating, r.review, r.created_at,
      u.name as reviewer_name
       FROM reviews r
       JOIN users u ON u.user_id = r.reviewer_id
       WHERE r.gig_id = $1
       ORDER BY r.created_at DESC`,
      [gigId]
    );

    if(reviews.length==0){
      return res.status(404).json({
        status:"failed",
        message:"No reviews found"
      })
    }

    return res.status(200).json({ status: 'success', data: reviews});
  } catch (err) {
    console.error('getReviewsByGig error:', err);
    return res.status(500).json({ status: 'failed', message: err.message });
  }
};

 