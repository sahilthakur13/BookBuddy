const express=  require('express');
const adminRouter = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware')
const {roleBasedAccessControl} = require('../middleware/role.middleware');

const { getDashboardStats, 
    createEventController, 
    getAllEventsAdmin,
     getEventById,
      updateEventStatus, deleteEvent, updateEvent ,getAllBooking, 
      updateBookingStatus,
      deleteBooking,
      updateUserRole,
      deleteUser,
      getAllUsersAdmin} = require('../controller/admin.controller');
const uploadBannerImage = require('../middleware/uploadBannerImage');


adminRouter.use(authMiddleware,roleBasedAccessControl('admin'));

//Routes
// For events
adminRouter.get("/dashboard/stats",getDashboardStats);
adminRouter.get("/events",getAllEventsAdmin)


// events
adminRouter.get("/events/:id", getEventById);

adminRouter.post("/create",uploadBannerImage,createEventController)

adminRouter.put("/events/update/:id",updateEvent)
adminRouter.patch("/events/:id/status",updateEventStatus);
adminRouter.delete("/events/:id",deleteEvent);


// Booking
adminRouter.get("/bookings",getAllBooking)
adminRouter.patch("/bookingStatus/:id/status",updateBookingStatus)
adminRouter.delete("/booking/delete/:id",deleteBooking);


// users
adminRouter.get("/users", getAllUsersAdmin);
adminRouter.patch("/users/:id/role", updateUserRole);
adminRouter.delete("/users/:id", deleteUser);

module.exports=adminRouter;