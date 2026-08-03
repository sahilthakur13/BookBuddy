const bcrypt =require('bcryptjs')
const userModel=require('../model/userModel');
const redis = require('../config/redis');
const {saveOtp,verifyOtp} = require("../services/otp.service")
const {sentOtpEmail} =  require('../services/email.service')
const { jwtSign } = require('../utils/jwt.utils');



exports.registerController = async(req,res)=>{
    const action = "account_verification";    
    const {name,email,password} = req.body;

 try {

    if(!name || !email || !password){
        return res.status(404).json({
            message:"name email and password is required"
        })
    }

    const isExist = await userModel.findOne({email});
    
    if (isExist && isExist.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (isExist && !isExist.isVerified) {
      await userModel.deleteOne({ email });
      
      await redis.del(`otp:${action}:${email}`);
    }

    const user = await userModel.create({
        name,
        email,
        password
    })

    await user.save();

    if(!user.isVerified && user.role == 'user'){

     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     
    await saveOtp(email,otp,action);
    
    await sentOtpEmail(email,otp,"account_verification")

    return res.status(201).json({
        success: true,
        message: "OTP sent successfully",
        requiresVerification: true,
        email: user.email
    });
    }


} catch (error) {
    console.error("FULL ERROR:", error.message); 
    return res.status(400).json({
        message: "Error",
        error: error.message
    })
} 
}


exports.optVerification = async(req,res)=>{
   const action = "account_verification";
    const {email,otp} = req.body;
    try {
        if(!email || !otp){
        return res.status(404).json({
            message:"Otp is not found "
        })
    }

   const otpStatus = await verifyOtp(email,otp,action) 
    

   if (otpStatus === 'EXPIRED') {
    return res.status(410).json({ 
        message: "OTP has expired. Please request a new one."
    });
}

if (otpStatus === 'INVALID') {
    return res.status(429).json({ 
        message: "The OTP you entered is incorrect. Please try again."
    });
}
  
   const updatedUser = await userModel.findOneAndUpdate({email},{isVerified:true},{returnDocument:'after'});
    
     const token = jwtSign(updatedUser._id,updatedUser.role);

    res.cookie("token",token,{
        httpOnly:true, 
        secure:true,
        sameSite: 'strict'   
    });

  return res.status(200).json({
   success:true,
   message:"Account verified",
   user:{
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified:updatedUser.isVerified
   }
})

    } catch (error) {
        return res.status(400).json({
            message:error
        })
    }
}


exports.loginController = async(req,res)=>{
    const {email,password} =req.body;

    if(!email || !password){
        return res.status(404).json({
            message:"Please enter email and password"
        })
    }

    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(404).json({
            message:"Account is not found. Please register"
        })
    }

    const decodedPass = await user.comparePassword(password);
    
    if(!decodedPass){
        return res.status(400).json({
            message:"Your password is invalid or wrong"
        })
    }

    const token = jwtSign(user._id,user.role);

    res.cookie("token",token,{
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(200).json({
        message:"Your are loggedin",
        token,
        user:userWithoutPassword
    })
}   


exports.logoutController = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};