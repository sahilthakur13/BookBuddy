const mongoose = require("mongoose");
const config = require("./config");

async function dbConnect() {
    mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');

    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("mongodb is connected");
    } catch (error) {
        console.error("Error in db connectivity:-", error);
        process.exit(1);
    }
}

module.exports = dbConnect;