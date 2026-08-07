import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEventDate, formatDuration } from '../utils/formatDate'

const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const { formatted, time } = formatEventDate(event.eventDate)
  const { hour, mints } = formatDuration(event?.duration);

  return (

    <div className='p-3 bg-gray-950 flex flex-col rounded-xl w-full group cursor-pointer' onClick={(e) => {
          e.stopPropagation()
          navigate(`/eventDetails/${event._id}`)
        }} >
      <div className="w-full aspect-video overflow-hidden rounded-lg">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover brightness-75
                     transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h1 className='mb-3 mt-3 text-base sm:text-lg font-semibold text-white truncate'>{event.title}</h1>
      <p className='text-white/70 text-xs'>Artist :-  {event.artist}</p>
      <h3 className='text-yellow-200 text-xs mt-1'>
        {event.genre} - {formatted} {time}  {hour}h {mints}m
      </h3>
      <h3 className='text-white/85 text-xs mt-1 truncate'>{event.location}</h3>

    </div>
  )
}

export default EventCard