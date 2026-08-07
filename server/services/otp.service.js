const { redis } = require('../config/redis'); 

async function saveOtp(email, otp, action) { 
    try {
        const otpKey = `otp:${action}:${email}`; 
        // Note: Make sure your specific redis client supports the { ex: 300 } syntax, 
        // otherwise use: await redis.set(otpKey, otp, 'EX', 300);
        await redis.set(otpKey, otp, { ex: 300 }); 
        return { success: true };
    } catch (error) {
        console.error("REDIS SAVE OTP ERROR:", error);
        return { success: false, error: error.message };
    }
} 

async function verifyOtp(email, userSubmitedOtp, action) { 
    try {
        const otpCacheKey = `otp:${action}:${email}`; 
        const savedOtp = await redis.get(otpCacheKey); 
        
        if (!savedOtp) { 
            return 'EXPIRED'; 
        } 
        
        if (String(savedOtp) !== String(userSubmitedOtp)) { 
            return 'INVALID'; 
        } 
        
        await redis.del(otpCacheKey); 
        return 'VALID'; 
    } catch (error) {
        console.error("REDIS VERIFY OTP ERROR:", error);
        return 'ERROR';
    }
} 

module.exports = { saveOtp, verifyOtp };
