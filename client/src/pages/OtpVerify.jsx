import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyUserByOtp } from '../api/axios';
import { MdVerified } from "react-icons/md";
import { useAuth } from '../context api/AuthContext'
import toast from 'react-hot-toast'
import { redirectAfterAuth } from '../utils/authRedirect';

const OtpVerify = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");

  const { setUser } = useAuth();

  async function otpVerifyHandler(e) {
    e.preventDefault();

    try {
      const response = await verifyUserByOtp({
        otp,
        email: state?.email
      })

      if (response.status == 200) {
        setUser(response.data.user);
        toast.success("Account verified!");
        redirectAfterAuth(navigate);
      }
    } catch (error) {

      if (error.response?.status === 429) {
        toast.error(error.response.data.message || "Incorrect OTP. Try again.");
        setOtp("");
        return;
      }

      if (error.response?.status === 410) {
        toast.error(error.response.data.message);
        navigate('/signup');
        return;
      }

      console.error("General error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  }

  return (
    <div className='min-h-[65vh] bg-gray-900 w-full flex justify-center items-center px-4 py-8 sm:py-12 custom-rounded'>
      <form
        onSubmit={otpVerifyHandler}
        className='w-full max-w-md flex flex-col items-center bg-gray-900/80 p-6 sm:p-8 rounded-2xl border border-gray-800'
      >
        <div className='text-5xl sm:text-6xl md:text-7xl text-violet-400 mb-2'>
          <MdVerified />
        </div>

        <h2 className='text-2xl sm:text-3xl md:text-4xl text-gray-300 font-semibold mb-4 sm:mb-6 text-center'>
          Verify OTP
        </h2>

        <p className='text-sm sm:text-base text-gray-500 text-center mb-1 px-2'>
          We have sent a 6 digit OTP to
        </p>
        <p className='text-blue-500 text-sm sm:text-base font-medium break-all text-center mb-2 px-2'>
          {state?.email}
        </p>
        <p className='text-sm text-gray-500 mb-6 text-center'>
          The code is valid for 5 minutes
        </p>

        <div className='w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2'>
          <label htmlFor="otp" className='text-gray-300 text-sm font-medium whitespace-nowrap'>
            OTP
          </label>
          <input
            required
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setOtp(val);
            }}
            className="w-full border-2 border-blue-600 bg-transparent text-white p-2.5 sm:p-3 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          type='submit'
          className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-2.5 sm:py-3 rounded-lg mt-5 cursor-pointer text-white font-medium active:scale-95 transition-all'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default OtpVerify