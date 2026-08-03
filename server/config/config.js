require('dotenv').config()

if(!process.env.MONGO_URI){
    throw new Error("Mongo db uri is missing");
}

const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET_CHABII:process.env.JWT_SECRET_CHABII,
    IMAGE_KIT_PRIVATE_KEY:process.env.IMAGE_KIT_PRIVATE_KEY,
    RAZORPAY_SECRET_KEY:process.env.RAZORPAY_SECRET_KEY,
    RAZORPAY_API_KEY:process.env.RAZORPAY_API_KEY
}

module.exports=config