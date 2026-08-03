import { useState, useEffect, useMemo } from "react";
import { deleteUser, getAllUsers, updateUserRole } from "../api/axios";
import toast from 'react-hot-toast'
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Search, Trash2 } from "lucide-react";
import { formatEventDate } from "../utils/formatDate";

const Adminusers = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers({ search, page: currentPage, limit: 10 });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timer);
    
  }, [search, currentPage]);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      fetchUsers();
      toast.success("Role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted");
      await fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name & Email",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-zinc-100">{row.original.name}</p>
          <p className="text-zinc-400 text-xs">{row.original.email}</p>
        </div>
      )
    },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
          row.original.isVerified
            ? "bg-green-600/15 text-green-400"
            : "bg-zinc-700/30 text-zinc-400"
        }`}>
          {row.original.isVerified ? "Verified" : "Not verified"}
        </p>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const { formatted ,time} = formatEventDate(row.original.createdAt);
        return <p>{formatted} {time}</p>
      }
    },
    {
      accessorKey: "role",
      header: "Role & Actions",
      cell: ({ row }) => {
        const role = row.original.role;
        const statusClass = role === "admin" ? "bg-yellow-600" : "bg-zinc-600";

        return (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className={`px-2 py-1 rounded text-white text-center font-medium border-white border-2 ${statusClass}`}>
              <select
                onChange={(e) => handleRoleChange(row.original._id, e.target.value)}
                value={role}
                className={`bg-white outline-none text-black ${statusClass} text-white `}
              > 
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-600/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      }
    }

  ], [])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-2 px-1 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">All Users</h2>
      <p className="text-zinc-400 text-xs sm:text-sm">
        Manage all BookBuddy users
      </p>

      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px] text-xs sm:text-sm">
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
                <td colSpan={4} className="text-center py-8 text-zinc-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-zinc-500">
                  No users found
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

export default Adminusers;