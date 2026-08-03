const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleBasedAccessControl } = require('../middleware/role.middleware');
const { createBookingController,getUserBookingController ,verifyBookingPaymentController} = require('../controller/booking.controller');

const bookingRoutes = express.Router();

bookingRoutes.post("/event",authMiddleware,createBookingController);
bookingRoutes.get("/userBooking",authMiddleware,getUserBookingController)
bookingRoutes.post("/verifyBookingPayment",authMiddleware,verifyBookingPaymentController)

module.exports = bookingRoutes;