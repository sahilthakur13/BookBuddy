import { useState, useEffect, useMemo } from "react";
import { deleteBooking, getAllBooking, updateBookingStatus } from "../api/axios";
import toast from 'react-hot-toast'
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Search, Trash2 } from "lucide-react";
import { formatEventDate } from "../utils/formatDate";

const AdminBookings = () => {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await getAllBooking({ search, page: currentPage, limit: 10 });
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchBookings, 500);
    return () => clearTimeout(timer);

  }, [search, currentPage]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
      toast.success("Booking status updated")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;

    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: "ticketNumber",
      header: "Booking Number & Name",
      cell: ({ row }) => {
        const ticketNumber = row.original.ticketNumber;
        const userName = row.original.userId?.name;
        return (
          <div>
            <p className="font-medium text-zinc-100">{ticketNumber || "—"}</p>
            <p className="text-zinc-400 text-xs">{userName}</p>
          </div>
        )
      }
    },
    {
      accessorKey: "eventId",
      header: "Event",
      cell: ({ row }) => (
        <p className="font-medium text-zinc-100">{row.original.eventId?.title}</p>
      )
    },
    {
      accessorKey: "seatsNumber",
      header: "Seats",
      cell: ({ row }) => (
        <p className="max-w-28">{row.original.seatsNumber.map((s) => "S" + s).join(" ")}</p>
      )
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => (
        <p className="font-medium text-zinc-100">₹{row.original.totalPrice}</p>
      )
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => {
        const { formatted, time } = formatEventDate(row.original.bookingDate);
        return <p>{formatted} {time}</p>
      }
    },
   {
  accessorKey: "paymentStatus",
  header: "Payment Status",
  cell: ({ row }) => {
    const status = row.original.paymentStatus;

    const statusStyles = {
      Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      Failed: "bg-red-500/15 text-red-400 border-red-500/30",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
        }`}
      >
        {status}
      </span>
    );
  },
},
{
  accessorKey: "bookingStatus",
  header: "Booking Status",
  cell: ({ row }) => {
    const status = row.original.bookingStatus;

    const statusStyles = {
      Confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
      Cancelled: "bg-red-500/15 text-red-400 border-red-500/40",
      Pending: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    };

    return (
      <div className="flex items-center gap-3">
        {/* Status Select */}
        <div
          className={`relative inline-flex items-center rounded-lg border px-2 py-1 ${
            statusStyles[status] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
          }`}
        >
          <select
            value={status}
            onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
            className="bg-transparent text-xs font-medium outline-none cursor-pointer appearance-none pr-5"
          >
            <option value="Confirmed" className="bg-zinc-900 text-white">
              Confirmed
            </option>
            <option value="Cancelled" className="bg-zinc-900 text-white">
              Cancelled
            </option>
            <option value="Pending" className="bg-zinc-900 text-white">
              Pending
            </option>
          </select>

          {/* Custom arrow */}
          <svg
            className="absolute right-1.5 w-3.5 h-3.5 pointer-events-none opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(row.original._id)}
          className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Delete booking"
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  },
}

  ], [])

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-2 px-1 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">All Bookings</h2>
      <p className="text-zinc-400 text-xs sm:text-sm">
        Manage all BookBuddy Bookings
      </p>

      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, event or ticket number..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs sm:text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-zinc-800">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-zinc-400 font-medium whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-zinc-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-zinc-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 sm:px-4 py-2.5 sm:py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 py-3">
          <p className="text-xs text-zinc-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm sm:text-md cursor-pointer rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-blue-700 hover:border-blue-600/60"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm sm:text-md cursor-pointer rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-blue-700 hover:border-blue-600/60"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;