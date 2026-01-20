import db from "../config/db.js";

export const addSkill = async (req,res)=>{
    try {
        // const userId = req.user.userId;
        const {skill_name} = req.body;

        if(!skill_name){
            return res.status(400).json({
                status:"failed",
                message:"Skill name is required"});
        };

        const skill = await db.one(
            `INSERT INTO skills (skill_name)
            VALUES ($1)
            ON CONFLICT (skill_name) DO NOTHING
            RETURNING skill_id, skill_name`,
            [skill_name]
        );

        if(!skill){
            return res.status(409).json({
                status:"failed",
                message:"Skill already exists"
            });
        }

        res.status(201).json({
            status:"success",
            data:skill
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json(
            {status:"failed", message:error.message}
        );
    }
};

export const addSkillToUser = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const { skill_id, proficiency_level } = req.body;

        if(!skill_id){
            return res.status(400).json({
                status:"failed",
                message:"Skill ID is required"});
        };

        await db.none(
            `INSERT INTO user_skills (user_id,skill_id,proficiency_level)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, skill_id) DO NOTHING`,
            [userId, skill_id, proficiency_level || 3]
        );

        res.status(201).json({
            status:"success",
            message:"Skill added to user profile successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({status:"failed", message:error.message});
    }
}

export const getUserSkills = async (req,res)=>{
    try {
        const userId = parseInt(req.params.userId);
        const skills = await db.any(
            `SELECT s.skill_id,s.skill_name,us.proficiency_level
            FROM user_skills us
            JOIN skills s ON us.skill_id = s.skill_id
            WHERE us.user_id = $1
            `,
            [userId]
        );

        if(skills.length === 0){
            return res.status(404).json({
                status:"failed",
                message:"No skills found for this user"
            });
        }
        console.log(skills);
        res.status(200).json({
            status:"success",
            message: "user skills fetched successfully",
            data: skills
        }); 

    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
};

export const addSkillToGig = async (req,res)=>{
    try {
        const gigId = parseInt(req.params.gigId);
        const {skill_id, required_level} = req.body;

        if(!skill_id){
            return res.status(400).json({
                status:"failed",
                message:"Skill ID is required"});
        }

        await db.none(
            `INSERT INTO gig_skills (gig_id, skill_id, required_level)
            VALUES ($1,$2,$3)
            ON CONFLICT (gig_id, skill_id) DO NOTHING`,
            [gigId, skill_id, required_level || 3]
        );

        res.status(201).json({
            status:"success",
            message:"Skill added to gig successfully"
        });
    } catch (error) {
        res.status(500).json({status:"failed", message:error.message});
    }
};

// GET SKILLS REQUIRED FOR A GIG
export const getGigSkills = async (req, res) => {
  try {
    const gigId = parseInt(req.params.gigId);

    const skills = await db.any(
      `SELECT 
          s.skill_name,
          gs.skill_id,
          gs.required_level
       FROM gig_skills gs
       JOIN skills s ON gs.skill_id = s.skill_id
       WHERE gs.gig_id = $1`,
      [gigId]
    );

    res.status(200).json({
      status: "success",
      message: "Gig skills fetched successfully",
      data: skills
    });

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};

// AI-READY SKILL MATCHING WITH A GIG
// (Currently i created rule-based matching, can be enhanced with 
//AI algorithms in the future)

export const matchSkillsWithGig = async (req,res)=>{
    try {
        const gigId = parseInt(req.params.gigId);

        const matchedUsers = await db.any(
      `SELECT 
          u.user_id,
          u.name,
          COUNT(*) AS matched_skills
       FROM gig_skills gs
       JOIN user_skills us 
         ON gs.skill_id = us.skill_id
        AND us.proficiency_level >= gs.required_level
       JOIN users u ON us.user_id = u.user_id
       WHERE gs.gig_id = $1
       GROUP BY u.user_id, u.name
       ORDER BY matched_skills DESC`,
      [gigId]
    );
        // const gig = await db.oneOrNone(
        //     `SELECT title,description
        //     FROM gigs
        //     WHERE gig_id = $1`, 
        //     [gigId]
        // );

        // if(!gig){
        //     return res.status(404).json({
        //         status:"failed",
        //         message:"Gig not found"
        //     });
        // }

        // const usersWithSkills = await db.any(
        //     `SELECT u.user_id, u.name, s.skill_name, us.skill_id, us.proficiency_level
        //     FROM users u
        //     JOIN user_skills us ON u.user_id = us.user_id
        //     JOIN skills s ON us.skill_id = s.skill_id`
        // );


        // Below is Simple rule-based matching: check if any skill name is mentioned in gig description
        // This can be replaced with more advanced AI-based matching in the future
        //  - BERT embeddings
        //  - Cosine similarity
        //to integrate NLP-based semantic matching models.
        // const matchedUsers = usersWithSkills.filter(user =>
        //     gig.description
        //         .toLowerCase()
        //         .includes(user.skill_name.toLowerCase())
        // );

        //this below is directly matching skills in database query without NLP
        /* const matchedUsers = await db.any(
      `SELECT 
          u.user_id,
          u.name,
          COUNT(*) AS matched_skills
       FROM gig_skills gs
       JOIN user_skills us 
         ON gs.skill_id = us.skill_id
        AND us.proficiency_level >= gs.required_level
       JOIN users u ON us.user_id = u.user_id
       WHERE gs.gig_id = $1
       GROUP BY u.user_id, u.name
       ORDER BY matched_skills DESC`,
      [gigId]
    ); */

        res.status(200).json({
            status:"success",
            message:`Found ${matchedUsers.length} users matching skills with gig "`,
            data:matchedUsers
        }
        )
    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
}