import JWT from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
	try {
		const authHeader = req?.headers?.authorization;
		if(!authHeader){
			return res.status(401).json({
				status:"auth_failed",
				message: "Authorization header missing"
			});
		}

		// Bearer <token> -> we need to extract only the token part
		const token = authHeader?.split(" ")[1];

		if(!token){
			return res.status(401).json({
				message: "Token missing"
			});
		
		}

		const decoded = JWT.verify(token, process.env.JWT_SECRET);
		// console.log("Decoded JWT:", decoded); //for debugging purpose to check what the decoded variable contains

		// Attach user to request
		req.user = {
			userId: decoded.user_id,
			email: decoded.email
		};
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token"
		});
	}
}

export default authMiddleware;