import React, { useEffect, useState } from 'react'
import { myBooking } from '../api/axios';
import BookingCard from '../components/BookingCard';
import toast from 'react-hot-toast'

const MyBooking = () => {

    const [userBooking, setUserBooking] = useState([]);

    useEffect(() => {
        async function getBookingData() {
            try {
                const response = await myBooking();

                setUserBooking(response.data.bookingData);
            } catch (error) {
                toast.error(error.response.data.message || response.error)
                console.log(error);
            }
        }

        getBookingData()
    }, [])

    if (userBooking.length === 0) {
        return (
            <div className="text-center min-h-[70vh] py-12 px-4 bg-gray-900 custom-rounded border border-gray-800 flex justify-center items-center">
                <p className="text-gray-400 text-xl sm:text-2xl md:text-4xl font-medium">No bookings found.</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen w-full bg-gray-300 p-3 sm:p-5 md:p-7 overflow-y-auto custom-rounded flex flex-col gap-3 sm:gap-4' id='MyBooking'>
            {userBooking.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
            ))}

        </div>
    )
}

export default MyBooking