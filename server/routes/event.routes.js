const express = require('express');
const { createEventController, getAllEventsController , getEventByIdController, searchEventsController } = require('../controller/event.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleBasedAccessControl } = require('../middleware/role.middleware');
const uploadBannerImage = require('../middleware/uploadBannerImage');

const eventRoutes = express.Router();

eventRoutes.get("/all",getAllEventsController);
eventRoutes.get("/details/:id",getEventByIdController);
eventRoutes.get("/search", searchEventsController);

module.exports = eventRoutes;