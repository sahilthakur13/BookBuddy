const express = require("express");
const cors =  require('cors');
const cookieParser  = require('cookie-parser');
const authRouter = require("./routes/auth.routes");
const { authMiddleware } = require("./middleware/auth.middleware");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");
const tickedRoutes = require("./routes/ticket.routes");
const adminRouter = require("./routes/admin.routes");

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));




app.use("/bookbuddy/auth",authRouter)
app.use("/bookbuddy/event",eventRoutes)
app.use("/bookbuddy/booking",bookingRoutes)
app.use("/bookbuddy/ticket",tickedRoutes);
app.use("/bookbuddy/admin",adminRouter);


module.exports = app;