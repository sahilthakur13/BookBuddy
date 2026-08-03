const ticketModel = require("../model/ticketModel");

exports.getTicketController = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const ticket = await ticketModel.findOne({ bookingId })
      

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error("Ticket fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.verifyTicketController = async(req,res)=>{
   try {
    const { ticketNumber, bookingId } = req.body;

    
    if (!ticketNumber || !bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid QR Code format. Missing ticket tracking tokens." 
      });
    }

    const ticket = await ticketModel.findOne({ ticketNumber, bookingId });

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: "Ticket not found. Invalid or counterfeit ticket." 
      });
    }

    const currentDate = new Date();
    const eventDate = new Date(ticket.event.date);
    
    if (currentDate.getTime() > (eventDate.getTime() + 24 * 60 * 60 * 1000)) {
      return res.status(400).json({ 
        success: false, 
        message: `This ticket expired on ${eventDate.toLocaleDateString()}.` 
      });
    }

    if (ticket.checkInStatus === true) {
      return res.status(400).json({ 
        success: false, 
        message: "⚠️ Already Scanned! This ticket has already been used for entry." 
      });
    }

    ticket.checkInStatus = true;
    
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket verified successfully! Access Granted.",
      ticketDetails: {
        title: ticket.event.title,
        user: ticket.user.name,
        seats: ticket.seatNumbers
      }
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during verification processing." 
    });
  }
}