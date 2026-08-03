import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context api/AuthContext'
import toast from 'react-hot-toast'
import { redirectAfterAuth } from '../utils/authRedirect';

export const Login = () => {

  const nagivate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  async function signupHandler(data) {
    try {
      const response = await login(data);
      console.log("response", response);

      if (response.status == 200) {
        toast.success("You are login successfully 😊");
        redirectAfterAuth(nagivate);
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      console.log("Error while login :-", error.response.data?.message)
    }
  }

  return (
    <div className='min-h-[70vh] w-full bg-gray-900 flex justify-center items-center px-4 py-8 sm:py-12 custom-rounded'>
      <div className='w-full max-w-md flex flex-col gap-5 p-5 sm:p-6'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white'>
          Login
        </h1>

        <form className='flex flex-col gap-3' onSubmit={handleSubmit(signupHandler)}>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              required
              {...register("email", { required: "Email is required" })}
              className='w-full border-2 border-gray-600 p-2.5 sm:p-3 rounded-lg bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
              type="text"
              name="email"
              id="email"
              placeholder='Enter your email here'
            />
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
                className='w-full border-2 border-gray-600 p-2.5 sm:p-3 pr-11 rounded-lg bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors'
                aria-invalid={errors.password ? "true" : "false"}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white transition-colors"
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
            className='w-full bg-blue-600/85 hover:bg-blue-600 py-2.5 sm:py-3 rounded-lg cursor-pointer active:scale-95 transition-all text-white font-medium mt-2'
          >
            Login
          </button>
        </form>

        <div className='flex flex-wrap gap-2 items-center text-sm sm:text-base'>
          <Link to="/signup" className="text-gray-300">
            New user? <span className='text-blue-500 hover:underline'>Create an account</span>
          </Link>
        </div>
      </div>
    </div>
  )
}