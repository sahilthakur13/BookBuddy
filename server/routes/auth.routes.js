const express = require('express');
const { registerController,loginController ,optVerification,logoutController} = require('../controller/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.get("/me",authMiddleware,(req,res)=>{
    return res.status(200).json({
         user: req.user
         });
})
authRouter.post("/register",registerController)
authRouter.post("/login",loginController)
authRouter.post("/verify-otp",optVerification)
authRouter.post("/logout",logoutController)


module.exports = authRouter