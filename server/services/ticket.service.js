const QRCode = require('qrcode')
const userModel = require('../model/userModel');
const eventModel = require('../model/eventModel');
const ticketModel = require('../model/ticketModel')

exports.createTicket = async (userBooking,session) => {
    try{
        const userData = await userModel.findById(userBooking.userId).session(session);
        const eventData = await eventModel.findById(userBooking.eventId).session(session);

    const qrData = {
        ticketNumber:userBooking.ticketNumber,
        bookingId: userBooking._id
    }

    const qrCode = await QRCode.toDataURL(
        JSON.stringify(qrData)
    )

    const [ticket] = await ticketModel.create([{
        bookingId: userBooking._id,
        ticketNumber:userBooking.ticketNumber,
        qrCode,
        user: {
            name: userData.name,
            email: userData.email
        },
        event: {
            title: eventData.title,
            artist: eventData.artist,
            location: eventData.location,
           date:eventData.eventDate
        },
        seatNumbers:userBooking.seatsNumber
    }],{session})
    
    return ticket;

    }catch(error){
        console.log("Error in ticket servive:-",error);
        throw error;
    }
}