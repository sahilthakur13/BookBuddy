const Booking = require("../model/bookingModel");
const User = require("../model/userModel");
const Event = require("../model/eventModel");
const fileUploads = require('../services/imagekitStorageService');
const bookingModel = require("../model/bookingModel");

exports.createEventController = async (req, res) => {

  const { title, description, contactEmail, contactPhone, eventDate, location, totalSeats, price, artist, genre, duration } = req.body;
  console.log("eventDate..",eventDate);
  try {
    if (!title || !description || !contactEmail || !contactPhone || !eventDate || !location || !totalSeats || !price || !artist ||
      !genre || !duration
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await fileUploads(req.file.buffer.toString('base64'));

    const event = await Event.create({
      title,
      description,
      contactEmail,
      contactPhone,
      eventDate,
      location,
      totalSeats,
      price,
      bannerImage: result.url,
      artist,
      genre,
      duration,
      createdBy: req.user._id
    });

    return res.status(201).json({ message: "Event created successfully", event });

  } catch (error) {
    console.log("error.......", error)
    res.status(400).json({ message: "Error creating event", error: error.message });
  }
}


// @desc    Get dashboard overview stats (cards + 7-day chart data)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalEvents, totalUsers, totalBookings, paidBookings] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments({ bookingStatus: { $ne: "Cancelled" } }),
      Booking.find({ paymentStatus: "Paid" }).select("totalPrice createdAt"),
    ]);

    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Build last 7 days trend for the chart
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    const chartData = last7Days.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayBookings = paidBookings.filter(
        (b) => b.createdAt >= date && b.createdAt < nextDate
      );

      return {
        date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        bookings: dayBookings.length,
        revenue: dayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      };
    });

    res.status(200).json({
      success: true,
      stats: { totalEvents, totalUsers, totalBookings, totalRevenue },
      chartData,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

// @desc    Get all events (search + pagination) for the admin table
// @route   GET /api/admin/events
// @access  Private/Admin
exports.getAllEventsAdmin = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      events,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("getAllEventsAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};


// for edit
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("getEventById error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
};


// @desc    Update an existing event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Never let the edit form overwrite seats/totalSeats directly —
    // that would wipe out isBooked/bookedBy state for existing bookings.
    const { seats, totalSeats, ...safeUpdates } = req.body;

    const event = await Event.findByIdAndUpdate(id, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
    console.error("updateEvent error:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};


exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["upcoming", "ongoing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const event = await Event.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", event });
  } catch (error) {
    console.error("updateEventStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Guard: don't allow deleting an event that already has active bookings
    const activeBookings = await Booking.countDocuments({
      eventId: id,
      bookingStatus: { $ne: "Cancelled" },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${activeBookings} active booking(s) exist for this event`,
      });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("deleteEvent error:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};


// Bookings

exports.getAllBooking = async (req, res) => {

  try {

    const { search = "", page = 1, limit = 10 } = req.query;
    const query = search ? { ticketNumber: { $regex: search, $options: "i" } } : {};

    const bookings = await bookingModel.find(query)
      .populate('eventId', 'title').populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const bookingsCount = await bookingModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      bookingCount: bookingsCount,
      totalPages: Math.ceil(bookingsCount / limit),
      currentPgae: Number(page),
      bookings
    })
  }
  catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

}


exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updateFields = {
      bookingStatus: status,
      ...(status === "Cancelled" && { cancelledAt: new Date() })
    }

    const booking = await Booking.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });


    if (!booking) {
      return res.status(404).json({ success: false, message: "booking not found" });
    }


    res.status(200).json({ success: true, message: "Status updated", booking });
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
}

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking data deleted"
    });

  } catch (error) {
    console.error("deleteBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking due to a server error"
    });
  }
};


// Users

exports.getAllUsersAdmin = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = search
      ? {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i"
            }
          },
          { email: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalCount = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("getAllUsersAdmin error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};


exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: "You can't change your own role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Role updated", user });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: "You can't delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};