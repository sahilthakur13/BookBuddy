export const BookingCardSkeleton = () => {
  return (
    <div className="bg-white border mt-1 border-zinc-200 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 sm:h-6 bg-zinc-200 rounded w-3/4" />
            <div className="h-3.5 bg-zinc-200 rounded w-1/2" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-3 bg-zinc-200 rounded w-20" />
            <div className="h-5 bg-zinc-200 rounded-full w-16" />
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2.5 bg-zinc-200 rounded w-16" />
              <div className="h-4 bg-zinc-200 rounded w-24 sm:w-28" />
            </div>
          ))}
        </div>

        {/* Seats */}
        <div className="mt-6">
          <div className="h-2.5 bg-zinc-200 rounded w-24 mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-zinc-200 rounded-xl w-12" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <div className="h-11 bg-zinc-200 rounded-2xl" />
        <div className="h-11 bg-zinc-200 rounded-2xl" />
      </div>
    </div>
  );
};