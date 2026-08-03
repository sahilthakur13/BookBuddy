const config = require("../config/config");
const { razorpayInstance } = require("../config/razorpay");
const bookingModel = require("../model/bookingModel");
const eventModel = require("../model/eventModel");
const crypto = require('crypto');
const { createTicket } = require("../services/ticket.service");
const { getDailyCounterForToday } = require('crypto')

const mongoose = require('mongoose')


exports.getUserBookingController = async (req, res) => {
    const userId = req.user._id;

    const bookingData = await bookingModel.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate("eventId", "title artist eventDate location");

    return res.status(200).json({
        bookingData
    })
}

exports.createBookingController = async (req, res) => {

    const { eventId, seatsNumbers } = req.body;
    const userId = req.user._id;

    if (!eventId || !seatsNumbers) {
        return res.status(400).json({
            message: "Booking failed , Something is missing",
            success: false
        })
    }

    const eventData = await eventModel.findOne({ _id: eventId }).select('_id seats price')

    const price = eventData.price * seatsNumbers.length;

    const alreadybookedSeats = eventData.seats.filter((seat) => seatsNumbers.includes(seat.seatNumber) && seat.isBooked == true);

    if (alreadybookedSeats.length > 0) {
        const bookedNumber = alreadybookedSeats.map((seat) => seat.seatNumber)
        return res.status(400).json({
            message: `Seat number ${bookedNumber.join()} ${bookedNumber.length >= 1 ? "are" : "is"} already booked`
        })
    }

    // razorpay payment order  Code  
    const options = {
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    }

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({
        order,
        success: "true",
        amount: price
    })

}


exports.verifyBookingPaymentController = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId, seatsNumbers ,totalPrice} = req.body;
    const userId = req.user._id;

    // 1. check
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !eventId) {
        return res.status(400).json({
            success: false,
            message: "Payment is cancelled, Your Booking is failed"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid event"
        });
    }

    // 3. Signature verification
    const razorpayVerificationString = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_SECRET_KEY)
        .update(razorpayVerificationString)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Payment verification Failed"
        });
    }

    // 4. Idempotency check — same payment should never create two bookings
    const existingBooking = await bookingModel.findOne({ paymentId: razorpay_payment_id });
    if (existingBooking) {
        return res.status(200).json({
            success: true,
            bookingId: existingBooking._id,
            message: "Booking already confirmed for this payment"
        });
    }

    const session = await mongoose.startSession();
    let userBooking;

    try {
        await session.withTransaction(async () => {
            const event = await eventModel.findById(eventId).session(session);

            if (!event) {
                throw new Error("Event not found");
            }

            // Check if any requested seat is already booked
            const seatAlreadyBooked = event.seats.some(
                (seat) => seatsNumbers.includes(seat.seatNumber) && seat.isBooked
            );
            if (seatAlreadyBooked) {
                throw new Error("Seats already booked");
            }

            // 5. NEVER trust totalPrice from client — calculate from event/seat data
            const seatsToBook = event.seats.filter((seat) => seatsNumbers.includes(seat.seatNumber));
            if (seatsToBook.length !== seatsNumbers.length) {
                throw new Error("One or more selected seats do not exist for this event");
            }

            const updatedModel = await eventModel.findOneAndUpdate(
                { _id: eventId },
                {
                    $set: {
                        "seats.$[elem].isBooked": true,
                        "seats.$[elem].bookedBy": userId
                    }
                },
                {
                    arrayFilters: [{ "elem.seatNumber": { $in: seatsNumbers } }],
                    session,
                    returnDocument: 'after'
                }
            );

            // 6. Verify the update actually touched all requested seats
            const bookedCount = updatedModel.seats.filter(
                (seat) => seatsNumbers.includes(seat.seatNumber) && seat.isBooked && String(seat.bookedBy) === String(userId)
            ).length;
            if (bookedCount !== seatsNumbers.length) {
                throw new Error("Seat update mismatch — booking aborted");
            }

            const ticketNumber = `BB-${new Date().toISOString().slice(2, 7).replace('-', '')}-${crypto.randomInt(100, 1000)}`;

            [userBooking] = await bookingModel.create([{
                userId,
                eventId,
                seatsNumber: seatsNumbers,
                totalPrice,
                paymentStatus: "Paid",
                bookingStatus: "Confirmed",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                ticketNumber
            }], { session });

            await createTicket(userBooking, session);
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.message
        });
    } finally {
        await session.endSession();
    }

    return res.status(201).json({
        bookingId: userBooking._id,
        message: "Your Booking has been done",
        success: true
    });
};


