const { redis } = require('../config/redis');

async function saveOtp(email, otp, action) {
    const otpKey = `otp:${action}:${email}`;
    
    // For Upstash requires options passed as an object { ex: seconds } but not IO-redis
    await redis.set(otpKey, otp, { ex: 300 }); 
}

async function verifyOtp(email, userSubmitedOtp, action) {
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
}

module.exports = {
    saveOtp,
    verifyOtp
};
