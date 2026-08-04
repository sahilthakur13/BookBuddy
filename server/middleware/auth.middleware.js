const userModel = require("../model/userModel");
const { jwtVerify } = require("../utils/jwt.utils");


exports.authMiddleware = async(req,res,next)=>{
    try {
        
         const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){ 
        return res.status(401).json({
            message:"Token is missing , Please login",
            success:false
        })
    }

    const decoded = jwtVerify(token);

    if (decoded === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Session expired. Please login again."
            });
        }

    if (!decoded) {
            return res.status(401).json({
                message: "Token is invalid or expired",
                success: false
            });
        }

    const user = await userModel.findById(decoded.id);
    
    
      if (!user) {
            return res.status(404).json({
                message: "User account no longer exists",
                success: false
            });
        }

    req.user = user

    next();

    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}