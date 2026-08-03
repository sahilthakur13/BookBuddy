require("dotenv").config();
const mongoose = require("mongoose");

const Booking = require("../model/bookingModel");
const Event = require("../model/eventModel");
const Ticket = require("../model/ticketModel");
const User = require("../model/userModel");

async function run() {

  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Syncing indexes...");
    await Promise.all([
      Booking.syncIndexes(),
      Event.syncIndexes(),
      Ticket.syncIndexes(),
      User.syncIndexes(),
    ]);

    console.log("All indexes synced successfully");
    process.exit(0);
  } catch (error) {
    console.error("Index sync failed:", error);
    process.exit(1);
  }
}

run();