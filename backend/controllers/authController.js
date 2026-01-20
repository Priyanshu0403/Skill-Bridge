import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async(req,res)=>{
    try {
        const{ name , email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({status: "failed", message: "Provide required fields"});
        }

        const userExists = await db.oneOrNone(
            "Select user_id, email,password_hash from users where email = $1"
            , [email]);
            
        if(userExists){
            return res.status(409).json({
                status: "failed",
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.one(
            `INSERT INTO users(name, email, password_hash)
            VALUES ($1,$2,$3)
            RETURNING user_id, name , email, created_at, credits, reputation_score`,
            [name, email, hashedPassword]
        )

        res.status(201).json({
            message: "User registered successfully",
            data: newUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed" , message: err.message});
    }
}

export const loginUser = async(req,res)=>{
    try{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({status: "failed", message: "Email and password are required"});
    }

    const user = await db.oneOrNone(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )

    if(!user){
        return res.status(401).json({status:"failed", message:"User does not exist"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if(!isPasswordValid){
        return res.status(401).json({status:"failed", message:"Invalid password"});
    }

    // Generate JWT token
    const token = jwt.sign(
        {user_id: user.user_id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    // here i Removed sensitive field before returning
    delete user.password_hash;

    res.status(200).json({
        message:"login successful",
        token,
        user:{
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            credits: user.credits,
            reputation: user.reputation_score
        }
    });
    }catch(error){
        console.log(error);
        res.status(500).json({message: "login failed", error: error.message});
    }

}


export const getCurrentUser = async(req,res) =>{
    try {
        //below values comes from authMiddleware after decoding the JWT token
        const userId = req.user.userId;

        const user = await db.oneOrNone(
            `SELECT user_id, name, email, credits, reputation_score
            FROM users
            WHERE user_id = $1`,
            [userId]
        );

        if(!user){
            return res.status(404).json({status: "failed", message: "User not found"});
        }

        res.status(200).json({status: "success",
            message:"User fetched successfully",
            data: user});

    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed" , message: error.message});
    }
}