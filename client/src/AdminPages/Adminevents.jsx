import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender ,getPaginationRowModel} from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAllEvents, deleteEvent, updateEventStatus } from "../api/axios";
import {useNavigate} from 'react-router-dom'


const STATUS_STYLES = {
  upcoming: "bg-violet-600/15 text-violet-400 border-violet-600/30",
  ongoing: "bg-orange-600/15 text-orange-400 border-orange-600/30",
  completed: "bg-zinc-700/30 text-zinc-400 border-zinc-700",
  cancelled: "bg-red-600/15 text-red-400 border-red-600/30",
};
 
const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage , setCurrentPage] = useState(1);
  const [totalPages,setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      console.log(search,currentPage) 
      const { data } = await getAllEvents({ search, page: currentPage, limit: 10  });
      
      setEvents(data.events);
      setTotalPage(data.totalPages);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };
 

useEffect(() => {
 setCurrentPage(1);
}, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 500); 
    return () => clearTimeout(timer); 
  }, [search,currentPage]);
 
  const handleDelete = async (id) => {
    
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
 
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      await fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };
 
  const handleStatusChange = async (id, status) => {
    try {
      await updateEventStatus(id, status);
      toast.success("Status updated");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };


  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Event",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-zinc-100">{row.original.title}</p>
            <p className="text-xs text-zinc-500">{row.original.artist}</p>
          </div>
        ),
      },
      {
        accessorKey: "eventDate",
        header: "Date",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "seats",
        header: "Seats Booked",
        cell: ({ row }) => {
          const booked = row.original.seats.filter((s) => s.isBooked).length;
          return `${booked} / ${row.original.totalSeats}`;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <select
            value={row.original.status}
            onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
            className={`text-xs px-2 py-1 rounded-full border bg-transparent capitalize cursor-pointer ${
              STATUS_STYLES[row.original.status]
            }`}
          >
            {Object.keys(STATUS_STYLES).map((s) => (
              <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                {s}
              </option>
            ))}
          </select>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-start">
            <button
              onClick={() => navigate(`/admin/events/edit/${row.original._id}`)}
              className="p-2 rounded-lg text-zinc-400 hover:text-violet-400 hover:bg-violet-600/10"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-600/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    
    []
  );
 
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),

  });
 
  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Events</h2>
          <p className="text-zinc-400 text-xs sm:text-sm">Create and manage all BookBuddy events</p>
        </div>
        <button
          onClick={() => navigate("/createEvent")}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
        >
          <Plus size={16} /> New Event
        </button>
      </div>
 
      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>
 
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px] text-xs sm:text-sm">
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
                <td colSpan={6} className="text-center py-8 text-zinc-500 text-base sm:text-2xl ">
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-zinc-500">
                  No events found
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
              onClick={()=>setCurrentPage(prev=> prev - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm sm:text-md cursor-pointer rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-blue-700 hover:border-blue-600/60"
            >
              Prev
            </button>
            <button
              onClick={()=>setCurrentPage(prev=> prev + 1)}
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
 
export default AdminEvents;