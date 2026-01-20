
router.get("/users", getAllUsers);
router.get("/gigs", getAllGigs);
router.put("/block/:userId", blockUser);
router.get("/reports", getAllTransactions);

export const getAllUsers = async(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
    })
    }
}

export const getAllGigs = async(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
    })
    }
}

export const blockUser = async(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
    })
    }
}

export const getAllTransactions = async(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
    })
    }
}
export const getPlatformStats = async(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            status:"failed",
            message:error.message
    })
    }
}