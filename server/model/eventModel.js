const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber:{
        type:String,
        required:true
    },
    isBooked:{
        type:Boolean,
        default:false
    },
    bookedBy:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }  
},{_id:false})

const eventSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true
    },
    artist:{
        type:String,
        trim:true,
        required:[true,"Artist name is required for event"]
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true
    },
    contactEmail:{
        type:String,
        required:[true,"Contact email is required"],
        trim:true,
        lowercase:true,
    },
    bannerImage:{
        type:String,
        default:null
    },
    contactPhone:{
        type:String,
        required:[true,"Contact phone is required"],
        trim:true
    },
    eventDate:{
        type:Date,
        required:[true,"Event date is required"]
    },
    location:{
        type:String,
        required:[true,"Location is required"],
        trim:true
    }, 
    totalSeats:{
        type:Number,
        required:[true,"Total seats are required"],
        min:[1,"Total seats must be at least 1"],
        max:[250,"Total seats cannot exceed 250"]
    },
    seats:[seatSchema],
    price:{
        type:Number,
        required:[true,"Price is required"],
        min:[0,"Price cannot be negative"]
    },
    status:{
        type:String,
        enum:["upcoming","completed","cancelled","ongoing"],
        default:"upcoming",
        index:true
    },
    duration:{
        type:Number,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

eventSchema.index({ status: 1, eventDate: 1 });

eventSchema.pre("save",async function(){
    if(this.isNew && this.totalSeats && this.seats.length == 0){
        let newSeats = []
                
        for(let i = 1; i <= this.totalSeats; i++){
            newSeats.push({
                seatNumber:i,
                isBooked:false,
                bookedBy:null
            })
        }
        this.seats = newSeats 
    }
})

module.exports = mongoose.model("Event",eventSchema);