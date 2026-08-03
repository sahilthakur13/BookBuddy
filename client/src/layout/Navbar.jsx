import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context api/AuthContext'

const Navbar = () => {
  const {
    isAuthenticated,
    isAdmin,
    user,
    authChecked,
    login,
} = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <>
      <div className='navbar flex justify-between items-center p-5 [border-radius:3rem] bg-blue-700'>
        <h1 class="inline-flex flex-col md:flex-row items-center gap-3 bg-neutral-900 border-2 border-neutral-700 px-6 py-3 rounded-2xl shadow-2xl tracking-tight">
      <span class="text-xl md:text-xl font-black text-white">
        TICKET BOOK <span class="bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-md font-mono italic">BUDDY</span>
      </span>
    </h1>


        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-full bg-violet-500/20 border border-white/40
                     flex items-center justify-center
                     text-white font-medium text-[15px]
                     hover:bg-blue-500/30 hover:border-white
                     transition-all cursor-pointer"
        >
          {user?.name?.[0].toUpperCase() || "U"}
        </button>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated} 
      />
    </>
  )
}

export default Navbar