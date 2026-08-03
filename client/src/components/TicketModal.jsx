import React from "react";
import { formatEventDate } from "../utils/formatDate";
import concetImage from '../assets/logo/concert.svg';

const TicketModal = ({ ticket, onClose }) => {
  if (!ticket) return null;
  const { formatted, time } = formatEventDate(ticket.event?.date);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs sm:max-w-md lg:max-w-4xl flex justify-center items-center overflow-hidden rounded shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ticket Container: Stacks vertically on mobile/tablet, row layout on desktop */}
        <div className="h-full w-full flex flex-col lg:flex-row text-white">

          {/* Ticket Number Section: horizontal strip on mobile/tablet, vertical text on desktop */}
          <div className="ticketNumber-div p-2 sm:p-3 flex border-b-2 sm:border-b-3 lg:border-b-0 lg:border-r-3 border-dashed border-fuchsia-800 lg:border-white justify-center items-center bg-violet-950 lg:[writing-mode:vertical-rl]">
            <h1 className="text-xs sm:text-sm lg:text-base font-mono tracking-wider">
              Ticket No: {ticket.ticketNumber}
            </h1>
          </div>

          {/* Ticket Details Section */}
          <div className="ticket-details-div bg-violet-950 flex-1 p-3 sm:p-4 lg:p-6 flex flex-col gap-1.5 sm:gap-2 lg:border-r-3 lg:border-dashed lg:border-fuchsia-800">
            <img src={concetImage} alt="Concert image" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-16 lg:w-16 object-cover rounded" />
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold mt-1 lg:mt-2 truncate">{ticket.event?.title}</h1>
            <h3 className="text-xs sm:text-sm lg:text-base text-gray-300">Artist: <span className="text-white font-medium">{ticket.event?.artist}</span></h3>
            <h3 className="text-xs sm:text-sm lg:text-base text-gray-300">Location: <span className="text-white font-medium">{ticket.event?.location}</span></h3>
            <h3 className="text-xs sm:text-sm lg:text-base text-gray-300">Date & Time: <span className="text-white font-medium">{formatted} {time}</span></h3>

            <h1 className="mt-2 lg:mt-4 text-sm sm:text-base lg:text-2xl font-semibold">
              Seat No. : {ticket.seatNumbers && ticket.seatNumbers.map((s) => (
                <span className="text-yellow-500 font-bold ml-1" key={s}> S{s}</span>
              ))}
            </h1>
          </div>

          {/* QR Code Section */}
          <div className="QR-Location-div bg-fuchsia-800 p-3 sm:p-4 lg:p-6 lg:w-[30%] flex flex-col justify-center items-center gap-2 sm:gap-3 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-violet-950">
            <div className="bg-white p-1.5 sm:p-2 rounded-lg max-w-[100px] sm:max-w-[130px] lg:max-w-full">
              <img src={ticket.qrCode} alt="Ticket QR Code" className="w-full h-auto object-contain" />
            </div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-fuchsia-200 font-semibold lg:hidden">Scan at Entrance</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketModal;