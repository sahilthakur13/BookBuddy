import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Ticket, Users, ScanLine, LogOut } from "lucide-react";
import { useAuth } from "../context api/AuthContext"; 


const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/checkTicket", label: "Check Ticket", icon: ScanLine },
];

const AdminLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 custom-rounded">
      {/* Sidebar — icon-only on phone/tablet, full labels from md upward */}
      <aside className="w-16 md:w-64 shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col rounded-l-4xl">
        <div className="px-2 md:px-6 py-5 border-b border-zinc-800">
          <h1 className="text-lg font-bold tracking-tight bg-gray-950 p-2 rounded text-center md:text-left">
            <span className="text-white/60 text-sm font-normal hidden md:inline">Admin Panel</span>
            <span className="text-white/60 text-sm font-normal md:hidden">AP</span>
          </h1>
        </div>

        <nav className="flex-1 px-2 md:px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500/30 text-white/80 border border-white/70"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent"
                }`
              }
            >
              <Icon size={18} />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-2 md:px-3 py-4 border-t border-zinc-800">
          <div className="px-3 py-2 mb-2 text-xs text-zinc-500 truncate hidden md:block">
            {user?.email}
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content area — whichever child route is active renders here */}
      <main className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;