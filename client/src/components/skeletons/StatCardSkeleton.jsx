const StatCardSkeleton = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 rounded bg-zinc-700"></div>
          <div className="h-8 w-20 rounded bg-zinc-700"></div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-zinc-700"></div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;