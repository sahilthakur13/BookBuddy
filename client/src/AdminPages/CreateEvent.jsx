import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent } from '../api/axios';
import { getEventById, updateEvent } from "../api/axios"; 


const CreateEvent = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const eventGenres = [
    "Music", "Comedy", "Theater & Arts", "Sports & Fitness", "Business & Tech",
    "Food & Drink", "Festivals & Fairs", "Nightlife & Clubbing", "Workshops & Classes",
    "Conferences & Expos", "Charity & Galas", "Fashion & Beauty", "Film & Media",
    "Kids & Family", "Community & Culture"
  ];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({defaultValues: 
                                                                                          {
                                                                                          title: "",
                                                                                            description: "",
                                                                                            contactEmail: "",
                                                                                            contactPhone: "",
                                                                                            artist: "",
                                                                                            eventDate: "",
                                                                                            durationHours: "",
                                                                                            durationMinutes: "",
                                                                                            location: "",
                                                                                            totalSeats: "",
                                                                                            price: "",
                                                                                            genre: "",
                                                                                            bannerImage: null
                                                                                          }
                                                                                        });


   // user cant select past dates in Event date field                                                                                     
const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // local timezone adjust
  return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm" format
};

    const [loading,setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode); // true only when we're about to load an existing event
    const [currentBanner, setCurrentBanner] = useState(null); 

    // Edit mode
    useEffect(() => {
      if (!isEditMode) return;

      const fetchEvent = async () => {
        try {
          setFetching(true);
          const { data } = await getEventById(id);
          const event = data.event;

          // eventDate needs "YYYY-MM-DDTHH:mm" for the datetime-local input
          const eventDateLocal = event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 16)
            : "";

          // duration is stored as total minutes — split back into hours + minutes
          const durationHours = Math.floor((event.duration || 0) / 60);
          const durationMinutes = (event.duration || 0) % 60;

          reset({
            title: event.title,
            description: event.description,
            contactEmail: event.contactEmail,
            contactPhone: event.contactPhone,
            artist: event.artist,
            eventDate: eventDateLocal,
            durationHours: String(durationHours),
            durationMinutes: String(durationMinutes),
            location: event.location,
            totalSeats: event.totalSeats,
            price: event.price,
            genre: event.genre,
            bannerImage: null,
          });

          setCurrentBanner(event.bannerImage);

        } catch (error) {
          console.error("Failed to load event:", error);
          toast.error(error.response?.data?.message || "Failed to load event");
          navigate("/admin/events");
        } finally {
          setFetching(false);
        }
      };

      fetchEvent();
     
    }, [id, isEditMode]);

    const onSubmit = async (data) => {
      try {
        setLoading(true);

        const duration = (parseInt(data.durationHours) || 0) * 60 + (parseInt(data.durationMinutes) || 0);
        const localDate = new Date(data.eventDate)
        data.eventDate = localDate.toISOString();

        if (isEditMode) {
         
          const payload = {
            title: data.title,
            description: data.description,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            artist: data.artist,
            eventDate: data.eventDate,
            duration,
            location: data.location,
            price: data.price,
            genre: data.genre,
          };

          const response = await updateEvent(id, payload);
          toast.success(response.data.message || "Event updated");
          navigate("/admin/events");
          return;
        }

        
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          if (key !== "bannerImage" && key !== "durationHours" && key !== "durationMinutes") {
            formData.append(key, data[key]);
          }
        });

        formData.append("duration", duration);

        if (data.bannerImage && data.bannerImage.length > 0) {
          formData.append("bannerImage", data.bannerImage[0]);
        }

        const response = await createEvent(formData);

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/admin/events");
        }
      } catch (error) {
        console.error("Submission failed: ", error);
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  if (fetching) {
    return (
      <div className='min-h-[80vh] w-full bg-gray-900 p-4 sm:p-6 md:p-10 custom-rounded flex items-center justify-center'>
        <p className='text-gray-400'>Loading event...</p>
      </div>
    );
  }

  return (
    <div className='min-h-[80vh] w-full bg-gray-900 p-4 sm:p-6 md:p-10 custom-rounded'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-tight'>
          {isEditMode ? "Edit Event" : "Create Event"}
        </h1>
        
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl'
        >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
           
           {/* Event Title */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Event Title</label>
             <input 
               type="text" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='Enter event title...'
              {...register("title",{
                required:"Event title is required"
              })} 
             />
             {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
           </div>

           {/* Event Description */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Event Description</label>
             <input 
               type="text" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='Brief description...'
               {...register("description", { required: "Description is required" })}
             />
             {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
           </div>

           {/* Contact Email */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Contact Email</label>
             <input 
               type="email" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='contact@example.com'
               {...register("contactEmail", { 
                 required: "Email is required",
                 pattern: {
                   value: /^\S+@\S+$/i,
                   message: "Please enter a valid email"
                 }
               })}
             />
             {errors.contactEmail && <p className='text-red-500 text-sm mt-1'>{errors.contactEmail.message}</p>}
           </div>

           {/* Contact Number */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Contact Number</label>
             <input 
               type="tel" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='+91 98765 43210'
               {...register("contactPhone", { required: "Contact number is required" })}
             />
             {errors.contactPhone && <p className='text-red-500 text-sm mt-1'>{errors.contactPhone.message}</p>}
           </div>

           {/* Artist Name */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Artist / Host Name</label>
             <input 
               type="text" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='Enter artist or host name...'
               {...register("artist", { required: "Artist/Host name is required" })}
             />
             {errors.artist && <p className='text-red-500 text-sm mt-1'>{errors.artist.message}</p>}
           </div>

           {/* Event Date */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Event Date</label>
             <input 
               type="datetime-local" min={getMinDateTime()}
               className='bg-gray-950 border  border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl [&::-webkit-calendar-picker-indicator]:invert'
               {...register("eventDate", { required: "Event date is required" })}
             />
             {errors.eventDate && <p className='text-red-500 text-sm mt-1'>{errors.eventDate.message}</p>}
           </div>

           {/* Duration */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Duration</label>
             <div className='flex gap-3'>
               <div className='flex-1'>
                 <input 
                   type="number" 
                   className='w-full bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500'
                   placeholder='Hours'
                   {...register("durationHours")}
                 />
               </div>
               <div className='flex-1'>
                 <input 
                   type="number" 
                   className='w-full bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500'
                   placeholder='Minutes'
                   {...register("durationMinutes")}
                 />
               </div>
             </div>
           </div>

           {/* Event Location */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Event Location</label>
             <input 
               type="text" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='Venue address or link...'
               {...register("location", { required: "Location is required" })}
             />
             {errors.location && <p className='text-red-500 text-sm mt-1'>{errors.location.message}</p>}
           </div>

           {/* Total Seats */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>
               Total Seats {isEditMode && <span className='text-gray-500 font-normal'>(locked after creation)</span>}
             </label>
             <input 
               type="number" 
               disabled={isEditMode}
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
               placeholder='Total available seats'
               {...register("totalSeats", { 
                 required: "Total seats is required",
                 min: { value: 1, message: "At least 1 seat is required" }
               })}
             />
             {errors.totalSeats && <p className='text-red-500 text-sm mt-1'>{errors.totalSeats.message}</p>}
           </div>

           {/* Price Per Seat */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Price Per Seat (₹)</label>
             <input 
               type="number" 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl placeholder-gray-500 transition-all'
               placeholder='Ticket price'
               {...register("price", { 
                 required: "Price is required",
                 min: { value: 0, message: "Price cannot be negative" }
               })}
             />
             {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price.message}</p>}
           </div>

           {/* Genre */}
           <div className='flex flex-col gap-2'>
             <label className='text-blue-400 font-medium text-sm tracking-wide'>Genre</label>
             <select 
               className='bg-gray-950 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-xl cursor-pointer'
               {...register("genre", { required: "Please select a genre" })}
             >
              <option value="">Select Genre</option>
              {eventGenres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>  
              ))}
             </select>
             {errors.genre && <p className='text-red-500 text-sm mt-1'>{errors.genre.message}</p>}
           </div>

           {/* Banner Image — create mode only; edit mode shows it read-only */}
           {isEditMode ? (
             <div className='flex flex-col gap-2 lg:col-span-2 xl:col-span-1'>
               <label className='text-blue-400 font-medium text-sm tracking-wide'>Event Banner</label>
               <div className='border border-gray-700 bg-gray-950 rounded-2xl p-4'>
                 {currentBanner ? (
                   <img src={currentBanner} alt="Current banner" className='w-full h-32 object-cover rounded-xl' />
                 ) : (
                   <p className='text-gray-500 text-sm'>No banner uploaded</p>
                 )}
                 <p className='text-xs text-gray-500 mt-2'>Banner image can't be changed from this form.</p>
               </div>
             </div>
           ) : (
             <div className='flex flex-col gap-2 lg:col-span-2 xl:col-span-1'>
               <label className='text-blue-400 font-medium text-sm tracking-wide'>Upload Event Banner</label>
               <div className='border-2 border-dashed border-gray-700 hover:border-blue-500 transition-colors bg-gray-950 rounded-2xl p-4 sm:p-6 text-center cursor-pointer'>
                 <input 
                   type="file" 
                   accept="image/*"
                   className='text-sm'
                   id="banner-upload"
                   {...register("bannerImage", { required: "Banner image is required" })}
                 />
                 <label htmlFor="banner-upload" className='cursor-pointer flex flex-col items-center'>
                   <span className='text-blue-500 text-2xl mb-2'>📸</span>
                   <span className='text-gray-400 text-sm'>Click to upload banner image</span>
                   <span className='text-xs text-gray-500 mt-1'>JPG, PNG, SVG (Recommended: 1920x1080)</span>
                 </label>
               </div>
               {errors.bannerImage && <p className='text-red-500 text-sm mt-1'>{errors.bannerImage.message}</p>}
             </div>
           )}

            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10'>
              <button 
                type="submit"
                disabled={loading}
                className='cursor-pointer bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 rounded px-3 py-2.5 sm:py-2 text-md transition-all flex-1 sm:flex-none shadow-lg shadow-blue-500/30'
              >
                {loading ? "Saving..." : isEditMode ? "Update Event" : "Add Event"}
              </button>
              <button 
                type="button" 
                onClick={() => reset()}
                className='cursor-pointer bg-gray-700 hover:bg-gray-600 active:bg-gray-800  rounded px-3 py-2.5 sm:py-2 text-md transition-all flex-1 sm:flex-none border border-gray-600'
              >
                Clear Form
              </button>
            </div>
        </form>
    </div>
  )
}

export default CreateEvent