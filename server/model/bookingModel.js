const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required for booking "],
    index:true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event Id is required for booking "],
    index:true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
   seatsNumber: {
    type: [String],
    required: [true, "At least one seat number is required for booking "],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "At least one seat number is required for booking"
    }
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required for booking "],
    min: [0, "Total price cannot be negative"]
  },
  ticketNumber:{
    type:String,
    required: [true, "Ticket number is required for booking "],
    unique:true
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  bookingStatus: {
    type: String,
    enum: ["Confirmed", "Cancelled", "Pending"],
    default: "Pending",
  },
  paymentId: {
    type: String,
    default: null,
    unique:true
  },
  orderId: {
    type: String,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
},{timestamps:true})

bookingSchema.index({userId:1,createdAt:-1})

module.exports = mongoose.model("Booking", bookingSchema);