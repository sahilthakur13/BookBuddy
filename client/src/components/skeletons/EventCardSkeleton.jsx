export const EventCardSkeleton = () => {
  return (
    <div className="p-3 bg-gray-950 flex flex-col rounded-xl w-full animate-pulse">
      {/* Image - same aspect ratio */}
      <div className="w-full aspect-video overflow-hidden rounded-lg bg-gray-800" />

      {/* Title */}
      <div className="h-5 sm:h-6 bg-gray-800 rounded mt-3 mb-2 w-[85%]" />

      {/* Artist */}
      <div className="h-3 bg-gray-800 rounded w-[55%] mb-2" />

      {/* Genre + Date + Duration */}
      <div className="h-3 bg-gray-800 rounded w-[75%] mb-2" />

      {/* Location */}
      <div className="h-3 bg-gray-800 rounded w-[65%] mb-3" />

      {/* Button */}
      <div className="h-8 bg-gray-800 rounded-full w-24 sm:w-28 mt-1" />
    </div>
  );
};