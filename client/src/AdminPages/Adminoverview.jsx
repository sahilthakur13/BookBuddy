import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CalendarDays, Users, Ticket, IndianRupee } from "lucide-react";
import StatCard from "../components/Statcard";
import { getDashboardStats } from "../api/axios";
import { Link } from "react-router-dom";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data.stats);
        setChartData(data.chartData);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-zinc-400 px-1">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Overview</h2>
        <p className="text-zinc-400 text-xs sm:text-sm">Snapshot of what's happening on BookBuddy</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/admin/events"><StatCard label="Total Events" value={stats.totalEvents} icon={CalendarDays} accent="violet" /></Link>
        <Link to="/admin/bookings"><StatCard label="Total Bookings" value={stats.totalBookings} icon={Ticket} accent="orange" /></Link>
        <Link to="/admin/users"><StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="violet" /></Link>
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          accent="orange"
        />
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5">
        <h3 className="text-zinc-200 font-semibold mb-4 text-sm sm:text-base">Bookings — last 7 days</h3>
        <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
            <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
              labelStyle={{ color: "#e4e4e7" }}
            />
            <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverview;