import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { bookingEvent, getEventDetails, verifyBookingPayment } from '../api/axios';
import toast from 'react-hot-toast'
import { formatDuration, formatEventDate } from '../utils/formatDate';
import { EventDetailsSkeleton } from '../components/skeletons/EventDetailsSkeleton';

const EventsDetails = () => {
 
  const navigate = useNavigate();
 
  const { id } = useParams();
  const [eventData, setEventData] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false); 
 
  useEffect(() => {
    const getEventData = async () => {
      try {
        setLoading(true);
        const response = await getEventDetails(id);
        setEventData(response.data.eventData);
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
 
    getEventData();
  }, [id])
 
  if (loading) {
    return <EventDetailsSkeleton />;
  }
 
  if (!eventData) {
    return (
      <div className='min-h-[80vh] w-full flex flex-col items-center justify-center gap-2 text-center'>
        <h3 className="text-xl font-semibold text-gray-200">Event not found</h3>
        <p className="text-zinc-500 text-sm">It may have been removed or the link is incorrect.</p>
      </div>
    );
  }
 
  const { hour, mints } = formatDuration(eventData.duration);
  const { formatted, time } = formatEventDate(eventData.eventDate);
 
  // Event date has already passed — hide seat selection & checkout
  const isEventOver = new Date(eventData.eventDate) < new Date();
 
  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    )
  }
 
  const totalFairPrice = eventData.price * selectedSeats.length
 
  const totalAvailableSeats = eventData.seats.filter((s) => !s.isBooked).length
 
  const checkoutHandler = async () => {
    if (selectedSeats.length === 0) return;
 
    try {
      const response = await bookingEvent({
        eventId: eventData._id,
        seatsNumbers: selectedSeats,
      })
 
      if (response.status == 200) {
        const order = response.data.order;
 
        const options = {
 
          key: import.meta.env.VITE_RAZORPAY_API_KEY,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "Event book buddy ",
          description: "Event booking website",
 
          handler: async function (paymentResponse) {
 
            try {
              setVerifying(true);
 
              const verifyResponse = await verifyBookingPayment({
                ...paymentResponse,
                eventId: eventData._id,
                seatsNumbers: selectedSeats,
                totalPrice: order.amount / 100 
              })
 
            
              if (verifyResponse.data.success) {
                toast.success("Booking Confirmed");
                navigate("/myBooking");
              }
            } catch (error) {
              const errorMsg = error.response?.data?.message || "Booking failed";
              toast.error(errorMsg);
            } finally {
              setVerifying(false);
            }
 
          }
        }
 
        const rzp = new window.Razorpay(options);
        rzp.open();  // this will open the  razorpay payment method menu ...... 
      }
    } catch (error) {
      const customError = error.response.data.message || error.message;
      toast.error(customError),
        console.log(error);
    }
 
 
  }
 
  return (
    <>
      {verifying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-white font-medium">Verifying your payment...</p>
          <p className="text-zinc-400 text-sm">Please don't close or refresh this page.</p>
        </div>
      )}
 
    <div className='min-h-screen w-full custom-rounded bg-gray-950 text-gray-100 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto border-white border-dashed border-4 rounded-2xl shadow-2xl overflow-hidden'>
 
        {/* Banner Image */}
        <div className='h-64 md:h-96 w-full relative bg-black'>
          <img
            src={eventData.bannerImage}
            alt={eventData.title}
            className="w-full h-full object-contain opacity-90" />
          <span className={`absolute top-4 right-4 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${eventData.status === 'upcoming' ? 'bg-black text-white' : 'bg-gray-700 text-gray-300'
            }`}>
            {eventData.status}
          </span>
        </div>
 
        <div className="p-6 md:p-8 space-y-8 bg-white">
  {/* Header Section */}
  <div>
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 tracking-widest uppercase">
      <span className="text-4xl">✦</span>
      {eventData.genre}
    </span>
    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mt-2 tracking-tight">
      {eventData.title}
    </h1>
    <p className="text-xl text-zinc-600 mt-1">
      Artist:- <span className="font-semibold text-violet-700">{eventData.artist}</span>
    </p>
  </div>
 
  {/* Meta Info Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Date & Time</p>
      <p className="text-lg font-semibold text-zinc-800 mt-2 leading-tight">
        {formatted} <br />
        {time}
      </p>
    </div>
 
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Location</p>
      <p className="text-lg font-semibold text-zinc-800 mt-2">{eventData.location}</p>
    </div>
 
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Event Duration</p>
      <p className="text-lg font-semibold text-zinc-800 mt-2">{hour}hr {mints}min</p>
    </div>
 
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Price Per Seat</p>
      <p className="text-3xl font-bold text-emerald-600 mt-2">₹{eventData.price}</p>
    </div>
  </div>
 
  {/* Description */}
  <div className="bg-white border border-zinc-100 rounded-3xl p-8">
    <h2 className="text-2xl font-semibold text-zinc-900 mb-4">About the Event</h2>
    <p className="text-zinc-600 leading-relaxed text-[17px]">
      {eventData.description}
    </p>
  </div>
 
  {isEventOver ? (
    <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-8 text-center">
      <p className="text-lg font-semibold text-zinc-700">This event has already taken place</p>
      <p className="text-zinc-500 text-sm mt-1">Booking is closed for this event.</p>
    </div>
  ) : (
    <>
      {/* Seat Selection */}
      <div className="space-y-6">
       <div className="flex flex-col items-start justify-between lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest">AVAILABILITY</p>
            <p className="text-3xl font-semibold text-zinc-900 mt-1">
              {totalAvailableSeats} <span className="text-xl text-zinc-500">seats left</span>
            </p>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div> Available
            <div className="w-3 h-3 bg-red-500 rounded ml-3"></div>Already Booked
            <div className="w-3 h-3 bg-blue-500 rounded ml-3"></div>Selected Seats
          </div>
        </div>
 
        <div className="flex flex-wrap gap-3">
          {eventData.seats.map((seat) => {
            const isBooked = seat.isBooked;
            const isSelected = selectedSeats.includes(seat.seatNumber);
            return (
              <button
                disabled={isBooked}
                key={seat.seatNumber}
                onClick={() => toggleSeat(seat.seatNumber)}
                className={`
                  w-14 h-14 rounded-2xl text-sm font-semibold border-2 transition-all duration-200 
                  flex items-center justify-center shadow-sm
                  ${isBooked
                    ? ' border-zinc-200 text-white cursor-not-allowed bg-red-600'
                    : isSelected
                      ? 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg  cursor-pointer'
                      : 'text-black bg-green-500 border-zinc-300  active:scale-95  cursor-pointer'
                  }
                `}
              >
                {seat.seatNumber}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* Total & Pay Section */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <p className="text-zinc-400 text-sm font-medium tracking-widest">TOTAL AMOUNT</p>
          <p className="text-4xl font-bold mt-1">
            {totalFairPrice > 0 ? `₹${totalFairPrice}` : "₹0"}
          </p>
        </div>
 
        <button
          onClick={checkoutHandler}
          disabled={selectedSeats.length === 0}
          className={`
            px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 cursor-pointer
            ${selectedSeats.length > 0
              ? 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-lg'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }
          `}
        >
          Proceed to Pay
        </button>
      </div>
    </>
  )}
 
  {/* Organizer Contact */}
  <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row gap-8">
    <div>
      <p className="font-semibold text-zinc-900">Organizer Contact</p>
      <div className="mt-4 space-y-3 text-zinc-600">
        <p className="flex items-center gap-3">
          <span className="text-xl">✉️</span>
          <a
            href={`mailto:${eventData.contactEmail}`}
            className="hover:text-violet-700 transition-colors underline decoration-dotted"
          >
            {eventData.contactEmail}
          </a>
        </p>
        <p className="flex items-center gap-3">
          <span className="text-xl">☎️</span>
          <a
            href={`tel:${eventData.contactPhone}`}
            className="hover:text-violet-700 transition-colors underline decoration-dotted"
          >
            {eventData.contactPhone}
          </a>
        </p>
      </div>
    </div>
 
    <div className="hidden md:block w-px bg-zinc-200 self-stretch" />
 
    <div className="text-sm text-red-600 max-w-xs">
      Secure your spot for this unforgettable experience. 
      Seats are filling up fast — don't miss out!
    </div>
  </div>
</div>
      </div>
    </div>
    </>
  )
}
 
export default EventsDetails