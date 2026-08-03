const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { getTicketController,verifyTicketController } = require('../controller/ticket.controller');

const tickedRoutes = express.Router();

tickedRoutes.get("/:bookingId",authMiddleware,getTicketController);
tickedRoutes.post("/verify",authMiddleware,verifyTicketController);

module.exports = tickedRoutes;