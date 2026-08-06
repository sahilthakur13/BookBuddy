import { X } from 'lucide-react';

const SeatLayoutModal = ({ seats, selectedSeats, onClose }) => {
  // Group seats into rows of 10
  const seatsPerRow = 10;
  const rows = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-3 xs:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 shrink-0">
          <h2 className="text-base sm:text-xl font-semibold text-zinc-900">Seats Layout</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 border-b border-zinc-100 text-[10px] sm:text-xs text-zinc-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded"></div> Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded"></div> Booked
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded"></div> Selected
          </div>
        </div>

        {/* Seat Rows */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 w-8 sm:w-10 shrink-0">
                Row {rowIndex + 1}
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {row.map((seat) => {
                  const isBooked = seat.isBooked;
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  return (
                    <div
                      key={seat.seatNumber}
                      className={`
                        w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold
                        flex items-center justify-center border
                        ${isBooked
                          ? 'bg-red-600 text-white border-red-700'
                          : isSelected
                            ? 'bg-blue-500 text-white border-blue-600'
                            : 'bg-green-500 text-black border-green-600'
                        }
                      `}
                    >
                      {seat.seatNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-zinc-900 text-white text-sm sm:text-base font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutModal;