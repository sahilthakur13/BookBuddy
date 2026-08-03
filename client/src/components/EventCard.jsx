import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEventDate, formatDuration } from '../utils/formatDate'

const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const { formatted, time } = formatEventDate(event.eventDate)
  const { hour, mints } = formatDuration(event?.duration);

  return (

    <div className='p-3 bg-gray-950 flex flex-col rounded-xl w-full group'>
      <div className="w-full aspect-video overflow-hidden rounded-lg">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover brightness-75
                     transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h1 className='mb-3 mt-3 text-base sm:text-lg font-semibold text-white truncate'>{event.title}</h1>
      <p className='text-white/55 text-xs'>{event.artist}</p>
      <h3 className='text-white/75 text-xs mt-1'>
        {event.genre} - {formatted} {time}-{hour}h {mints}m
      </h3>
      <h3 className='text-white/85 text-xs mt-1 truncate'>{event.location}</h3>

      <button
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/eventDetails/${event._id}`)
        }}
        className="shrink-0 items-center gap-1 px-3 py-1.5 rounded-full mt-3 w-fit inline-block cursor-pointer
                   border border-orange-500
                   text-[11px] font-medium text-white
                   transition-all duration-200
                   hover:border-white hover:text-white hover:bg-orange-700"
      >
        🎟️ Get Ticket
      </button>
    </div>
  )
}

export default EventCard