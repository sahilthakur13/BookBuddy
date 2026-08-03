const  razorpay =  require('razorpay');
const config = require('./config');


exports.razorpayInstance = new razorpay({
    key_id:config.RAZORPAY_API_KEY,
    key_secret:config.RAZORPAY_SECRET_KEY
})