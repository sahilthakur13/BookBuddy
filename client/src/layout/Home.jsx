import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { allEvents, searchEvents } from '../api/axios'
import EventCard from '../components/EventCard'
import { Search, X } from 'lucide-react'

const Home = () => {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState();

  // ── Search dropdown
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchBoxRef = useRef(null);      
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const getEventData = async () => {
      const response = await allEvents(page);
      setEvents(response.data.allEvents);

      setPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    }
    getEventData();
  }, [page])

  // ── Debounced search
  useEffect(() => {

    if (!search.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      // Cancel the previous in-flight request (if any) — prevents an
      // older, slower response from overwriting a newer one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setSearchLoading(true);
        const { data } = await searchEvents(search, controller.signal);
        setSuggestions(data.results);
        setShowDropdown(true);
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Search failed:", error);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ── Close dropdown on outside click ────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = () => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="custom-rounded home bg-[#a6c1ee] min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 flex flex-col">

      <div className="relative w-full sm:max-w-sm" ref={searchBoxRef}>
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 top-3 text-zinc-500 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.trim() && setShowDropdown(true)}
            placeholder="Search events..."
            className="w-full bg-zinc-900 border border-zinc-800 mb-3 rounded-lg pl-9 pr-9 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-zinc-500 hover:text-zinc-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-[calc(100%-0.75rem)] left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
            {searchLoading ? (
              <p className="px-4 py-3 text-sm text-zinc-500">Searching...</p>
            ) : suggestions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-zinc-500">No events found</p>
            ) : (
              suggestions.map((event) => (
                <Link
                  key={event._id}
                  to={`/eventDetails/${event._id}`}
                  onClick={handleSuggestionClick}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800 transition-colors"
                >
                  {event.bannerImage && (
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      className="w-9 h-9 rounded-md object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{event.title}</p>
                    <p className="text-xs text-zinc-500 truncate">{event.artist}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {(!events || events.length === 0) ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-100 p-6 text-center bg-black rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-2">
            No Events Found
          </h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 px-0 sm:px-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 sm:mt-10">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gray-900 border border-gray-800 rounded px-3 py-2 shadow-xl">

              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-3 py-2 cursor-pointer bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-xl transition-all flex items-center gap-2"
              >
                ← Prev
              </button>

              <span className="text-gray-500 px-3 sm:px-6 py-2 text-sm sm:text-lg whitespace-nowrap">
                Page <span className="text-white">{page}</span> of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 cursor-pointer bg-gray-600/85 hover:bg-gray-700/85 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded transition-all flex items-center gap-2"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home