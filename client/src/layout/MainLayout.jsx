import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <div className='bg-black gap-2 flex flex-col text-white h-full w-full'>
    <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default MainLayout