const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        unique:true
    },

    ticketNumber:{
        type:String,
        required:[true,"Ticket number is required to create the ticket"],
        unique:true,
    },

    qrCode:{
        type:String
    },

    user:{
        name:String,
        email:String
    },
    event:{
        title:String,
        artist:String,
        location:String,
        date:Date
    },
    seatNumbers:[String],
    checkInStatus:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const ticketModel = mongoose.model("Ticket",ticketSchema);

module.exports = ticketModel;