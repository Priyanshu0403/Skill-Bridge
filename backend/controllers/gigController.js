export const createGig = async (req, res)=>{
    try {
        const {title, description, type, budget,} = req.body;
        const userId = req.user.userId;

        if(!title || !description || !type){
            return res.status(400).json({
                status: "failed",
                message: "title, description and type are required",
            })
        };

        const newGigs =  await db.one(
            `INSERT INTO gigs (title,description,type,budget,created_by,status)
            VALUES ($1,$2,$3,$4,$5,'open')
            RETURNING gig_id, title, description, type, budget, status, created_at`,
            [title, description, type, budget||0, userId]
        );

        if(!newGigs){
            return res.status(500).json({
                status: "failed",
                message: "Could not create gig",
            })
        };

        return res.status(201).json({
            status: "success",
            message: "Gig created successfully",
            data: newGigs,
        })

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

//if status provided then the filtering based on status should be done
//otherwise all the gigs realted to the user id must be fetched
export const getAllGigs = async (req, res)=>{
    try {
        const {status} = req.query;

        let query = `SELECT g.gig_id, g.title, g.description, g.type, g.budget,
         g.status, g.created_at, u.user_id, u.name AS creator_name 
            FROM gigs as g 
            JOIN users as u ON g.created_by = u.user_id`;
        
        const values = [];

        if(status){
            query += "WHERE g.status=$1";
            values.push(status); 
        }

        query += "ORDER BY g.created_at DESC"

        const gigs = await db.any(query, values);

        if(!gigs){
            return res.status(404).json({
                status: "failed",
                message: "No gigs found",
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Gigs fetched successfully",
            data: gigs,
        })
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

//getting single gig by id
export const getGigById = async (req, res)=>{
    try {
        const gigId = parseInt(req.params.id);

        const gig = await db.oneOrNone(
            `SELECT g.gig_id, g.title, g.description, g.type, g.budget, 
            g.status, g.created_at,
            u.user_id, u.name AS creator_name
            FROM gigs as g
            JOIN users as u ON g.created_by = u.user_id
            WHERE g.gig_id = $1`,
            [gigId]
        )

        if(!gig){
            return res.status(404).json({
                status:"failed",
                message: "Gig not found"
            })
        };

        res.status(200).json({
            status:"success",
            message: "Gig fetched successfully",
            data: gig
        });

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}

export const updateGig = async (req, res)=>{
    try {
        const gigId = parseInt(req.params.id);
        const userId = req.user.userId;
        const{ title,description,budget,status} = req.body;

        const updateGig = await db.oneOrNone(
            `UPDATE gigs
            SET 
                title = COALESCE($1,title)
                description = COALESCE($2, description)
                budget = COALESCE($3, budget)
                status = COALESCE($4,status)
            WHERE gig_id = $5 AND created_by = $6
            RETURNING gig_id, title,description,type,budget,status,created_at`,
            [title,description,budget,status,gigId,userId]
        );

        if(!updateGig){
            return res.status(403).json({
                status: "failed",
                message: "Unuauthorized access or gig not found"
            })
        }

        res.status(200).json({
            status: "Success",
            message:" Gig updated successfully",
            data: updatedGig
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}
export const deleteGig = async (req, res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message,
        })
    }
}