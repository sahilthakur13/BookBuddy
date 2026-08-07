import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/axios';
import { useAuth } from '../context api/AuthContext'
import Loader from '../components/Loader';

const Signup = () => {

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  async function signupHandler(data) {
    try {
      setLoading(true)
      const response = await signup(data);
      if (response.status == 201 && response.data.requiresVerification == true) {
        toast.success(response.data.message);
        navigate("/otp-verify", { state: { email: response.data.email } })
      }

    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
      console.log("response.error",error.response)
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data.message);
      console.log("URL:", error.config?.url);
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && (
        <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-start pt-6 sm:pt-8 z-50 pointer-events-none'>
          <div className='bg-gray-800/95 py-3 px-5 rounded-full shadow-2xl border border-gray-700/80 flex items-center gap-3 sm:gap-4 pointer-events-auto w-[90%] max-w-xs justify-center'>
            <div className='scale-75 origin-center flex items-center justify-center h-6 w-6'>
              <Loader />
            </div>
            <span className='text-gray-200 text-sm font-medium tracking-wide'>
              Creating your account...
            </span>
          </div>
        </div>
      )}

      <div className='min-h-[70vh] w-full bg-gray-900 flex justify-center items-center px-4 py-8 sm:py-12 custom-rounded'>
        <div className='w-full max-w-md flex flex-col gap-5 p-5 sm:p-6'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white'>
            Sign up
          </h1>

          <form className='flex flex-col gap-3' onSubmit={handleSubmit(signupHandler)}>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                  maxLength: { value: 20, message: "Name must be less than 20 characters" }
                })}
                className='w-full border-2 border-gray-600 p-2.5 sm:p-3 rounded-lg text-white bg-transparent placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                type="text"
                name="name"
                id="name"
                placeholder='Enter your name here'
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                className='w-full border-2 border-gray-600 p-2.5 sm:p-3 rounded-lg text-white bg-transparent placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                type="text"
                name="email"
                id="email"
                placeholder='Enter your email here'
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>

              <div className='relative w-full'>
                <input
                  required
                  {...register("password", {
                    required: "password is required",
                    minLength: {
                      value: 6,
                      message: "Password is more than 6 characters"
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder='password'
                  className='w-full border-2 border-gray-600 p-2.5 sm:p-3 pr-11 rounded-lg text-white bg-transparent placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                  aria-invalid={errors.password ? "true" : "false"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEye size={20} /> : <IoIosEyeOff size={22} />}
                </button>
              </div>

              {errors.password && (
                <span className="text-red-500 text-xs mt-1.5 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 py-2.5 sm:py-3 mt-2 rounded-lg cursor-pointer active:scale-95 text-white font-semibold transition-all'
            >
              Sign up
            </button>
          </form>

          <div className='flex flex-wrap gap-2 text-sm sm:text-base'>
            <Link to="/login" className='text-gray-300'>
              Already have an account? <span className='text-blue-500 hover:underline'>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup