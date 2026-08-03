const ChartSkeleton = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
      <div className="h-5 w-52 rounded bg-zinc-700 mb-6"></div>

      <div className="h-[280px] w-full rounded-lg bg-zinc-800 relative overflow-hidden">
        <div className="absolute bottom-4 left-6 flex items-end gap-6 h-56">
          {[90, 150, 110, 180, 130, 170, 120].map((height, index) => (
            <div
              key={index}
              className="w-8 rounded-t bg-zinc-700"
              style={{ height }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;