import React from "react";
import { formatEventDate } from "../utils/formatDate";
import { useState } from "react";
import toast from 'react-hot-toast';
import { viewTicket } from "../api/axios";
import TicketModal from "./TicketModal";

const BookingCard = ({ booking }) => {
  const { seatsNumber = [], totalPrice, bookingStatus, paymentStatus, eventId, bookingDate, _id } = booking;
  const { title = "Untitled Event", artist = "N/A", eventDate, location = "TBA" } = eventId || {};
  const { formatted, time } = formatEventDate(eventDate);
  const { formatted: bookingDt } = formatEventDate(bookingDate);

  const [ticketData, setTicketData] = useState(null);

  const rateEvent = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-custom-enter' : 'animate-custom-leave'} max-w-md w-72 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <p className="mt-1 text-sm text-gray-500 p-4">Functionality coming soon</p>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent cursor-pointer rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  const viewTicketHandler = async () => {
    try {
      const response = await viewTicket(_id);
      setTicketData(response.data.ticket);
    } catch (err) {
      console.log(err);
      toast.error("Could not load ticket. Try again.");
    }
  };

  return (
    <>
      {ticketData && (
        <TicketModal ticket={ticketData} onClose={() => setTicketData(null)} />
      )}

      <div className="bg-white border mt-1 border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight truncate">
                {title}
              </h3>
              <p className="text-sm text-zinc-600 mt-0.5">by {artist}</p>
            </div>

            <div className="flex flex-col items-end gap-1.5 text-right">
              <span className="text-xs text-zinc-500">Booked {bookingDt}</span>
              <span className={`text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full border
                ${bookingStatus === "Confirmed"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "bg-red-100 text-red-700 border-red-200"
                }`}>
                {bookingStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            {[
              { label: "Event Date", val: `${formatted} • ${time}` },
              { label: "Venue", val: location },
              {
                label: "Payment",
                val: paymentStatus,
                highlight: paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"
              },
              {
                label: "Total",
                val: `₹${totalPrice}`,
                highlight: "font-semibold text-zinc-900"
              },
            ].map(({ label, val, highlight = "" }) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
                <p className={`text-zinc-700 ${highlight}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Seats */}
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Seats Booked</p>
            <div className="flex flex-wrap gap-2">
              {seatsNumber.map((seat) => (
                <span
                  key={seat}
                  className="bg-green-500 border border-green-600 text-gray-30 font-mono text-xs px-3 py-1.5 rounded-xl"
                >
                  S{seat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <button
            onClick={rateEvent}
            className="py-3 rounded-2xl text-sm font-medium border border-zinc-300 text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 transition-all"
          >
            Rate Event
          </button>


          {bookingStatus === 'Confirmed' && (
            <button
              onClick={viewTicketHandler}
              className="py-3 rounded-2xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            >
              View Ticket
            </button>
          )}


        </div>
      </div>
    </>
  );
};

export default BookingCard;