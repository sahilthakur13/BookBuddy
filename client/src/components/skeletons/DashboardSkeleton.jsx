import StatCardSkeleton from './StatCardSkeleton';
import ChartSkeleton from "./ChartSkeleton";

const DashboardSkeleton = () => (
  <div className="space-y-6 p-6 custom-rounded bg-gray-900 animate-pulse">
    <div className="space-y-3">
      <div className="h-8 w-44 rounded bg-zinc-700"></div>
      <div className="h-4 w-72 rounded bg-zinc-800"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    <ChartSkeleton />
  </div>
);

export default DashboardSkeleton;