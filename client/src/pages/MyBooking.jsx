import React, { useEffect, useState } from 'react'
import { myBooking } from '../api/axios';
import BookingCard from '../components/BookingCard';
import {BookingCardSkeleton} from '../components/skeletons/BookingCardSkeleton'
import toast from 'react-hot-toast'

const MyBooking = () => {

    const [userBooking, setUserBooking] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBookingData() {
      setLoading(true);
      try {
        const response = await myBooking();
        setUserBooking(response.data.bookingData || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load bookings");
        console.log(error);
        setUserBooking([]);
      } finally {
        setLoading(false);
      }
    }

    getBookingData();
  }, []);

   // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-300 p-3 sm:p-5 md:p-7 overflow-y-auto custom-rounded flex flex-col gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <BookingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // No bookings
  if (userBooking.length === 0) {
    return (
      <div className="text-center min-h-[70vh] py-12 px-4 bg-gray-900 custom-rounded border border-gray-800 flex justify-center items-center">
        <p className="text-gray-400 text-xl sm:text-2xl md:text-4xl font-medium">
          No bookings found.
        </p>
      </div>
    );
  }

  // Real bookings
  return (
    <div
      className="min-h-screen w-full bg-gray-300 p-3 sm:p-5 md:p-7 overflow-y-auto custom-rounded flex flex-col gap-3 sm:gap-4"
      id="MyBooking"
    >
      {userBooking.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

export default MyBooking;