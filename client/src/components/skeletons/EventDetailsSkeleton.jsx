export const EventDetailsSkeleton = () => (
  <div className='min-h-screen w-full custom-rounded bg-gray-950 text-gray-100 p-4 md:p-8'>
    <div className='max-w-4xl mx-auto border-white border-dashed border-4 rounded-2xl shadow-2xl overflow-hidden animate-pulse'>

      {/* Banner placeholder */}
      <div className='h-64 md:h-96 w-full bg-zinc-800' />

      <div className="p-6 md:p-8 space-y-8 bg-white">
        {/* Header placeholder */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-zinc-200 rounded" />
          <div className="h-10 w-2/3 bg-zinc-200 rounded" />
          <div className="h-5 w-40 bg-zinc-200 rounded" />
        </div>

        {/* Meta cards placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3">
              <div className="h-3 w-20 bg-zinc-200 rounded" />
              <div className="h-5 w-24 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>

        {/* Description placeholder */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 space-y-3">
          <div className="h-6 w-48 bg-zinc-200 rounded" />
          <div className="h-4 w-full bg-zinc-200 rounded" />
          <div className="h-4 w-full bg-zinc-200 rounded" />
          <div className="h-4 w-2/3 bg-zinc-200 rounded" />
        </div>

        {/* Seats placeholder */}
        <div className="space-y-4">
          <div className="h-8 w-40 bg-zinc-200 rounded" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-14 h-14 rounded-2xl bg-zinc-200" />
            ))}
          </div>
        </div>

        {/* Total & pay placeholder */}
        <div className="bg-zinc-200 rounded-3xl h-28" />
      </div>
    </div>
  </div>
);