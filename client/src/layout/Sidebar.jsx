import React, { useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context api/AuthContext'

const Sidebar = ({ isOpen, onClose, user, isAdmin ,isAuthenticated}) => {

  const {logout} = useAuth();

  const navigate = useNavigate()

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  const LoginHandler = ()=>{
    navigate("/login");
    onClose()
  }

  const logoutHandler = async()=>{
  await logout();
    navigate("/login",{replace:true})
    onClose();
  }

  return (
    <>
      
      <div
        onClick={onClose}
        className={`fixed inset-0.5 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

     
      <div className={`fixed top-0 right-0 h-full w-60 bg-[#0f0e13]
                       border-l border-violet-500/20 z-50 flex flex-col
                       transition-transform duration-300 ease-in-out
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header — user info */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/20
                            border border-violet-500/35
                            flex items-center justify-center
                            text-[15px] font-medium text-violet-400">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-[14px] font-medium text-white/88">{user?.name || 'User'}</p>
              <p className="text-[11px] text-white/30">{isAdmin ? 'Admin' : 'User'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 border-none
                       flex items-center justify-center
                       text-white/40 hover:text-white/80 hover:bg-white/10
                       transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3">
          <p className="text-[10px] font-medium tracking-[0.08em] uppercase
                        text-white/20 px-5 py-2">Menu</p>

          {[
            { label: 'Home',        path: '/',          icon: '🏠' },
          ].map(({ label, path, icon }) => (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className="w-full flex items-center gap-2.5 px-5 py-2.5
                         text-[13px] text-white/45 text-left
                         border-l-2 border-transparent
                         hover:text-white/80 hover:bg-white/[0.04]
                         hover:border-violet-500/30
                         transition-all duration-200 cursor-pointer"
            >
              <span>{icon}</span> {label}
            </button>
          ))}

          {isAuthenticated && [
            
            { label: 'My Bookings', path: '/myBooking', icon: '🎟️' },
            
          ].map(({ label, path, icon }) => (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className="w-full flex items-center gap-2.5 px-5 py-2.5
                         text-[13px] text-white/45 text-left
                         border-l-2 border-transparent
                         hover:text-white/80 hover:bg-white/[0.04]
                         hover:border-violet-500/30
                         transition-all duration-200 cursor-pointer"
            >
              <span>{icon}</span> {label}
            </button>
          ))}

          
          {isAdmin && (
            <>
              <div className="h-px bg-white/5 mx-5 my-2" />
              <p className="text-[10px] font-medium tracking-[0.08em] uppercase
                            text-white/20 px-5 py-2">Admin</p>

              {[
                { label: 'Create Event', path: '/createEvent', icon: '➕' },
                { label: 'Dashboard',    path: '/dashboard',   icon: '📊' },
                { label: 'Check Ticked',    path: '/checkTicket',   icon: '⛶' },
              ].map(({ label, path, icon }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className="w-full flex items-center gap-2.5 px-5 py-2.5
                             text-[13px] text-white/45 text-left
                             border-l-2 border-transparent
                             hover:text-white/80 hover:bg-white/[0.04]
                             hover:border-violet-500/30
                             transition-all duration-200 cursor-pointer"
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </>
          )}
        </nav>

        
        {isAuthenticated ?
          <div className="px-5 py-4 border-t border-white/[0.06]">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                       bg-transparent border border-red-500/20
                       text-[13px] text-red-400/60
                       hover:bg-red-500/8 hover:border-red-500/40 hover:text-red-400/90
                       transition-all duration-200 cursor-pointer"
          >
            🚪 Log out
          </button>
        </div>

        :
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <button
            onClick={LoginHandler}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                       bg-transparent border border-red-500/20
                       text-[13px] text-red-400/60
                       hover:bg-red-500/8 hover:border-red-500/40 hover:text-red-400/90
                       transition-all duration-200 cursor-pointer"
          >
            🚪 Log In
          </button>
        </div>
        }
      </div>
    </>
  )
}

export default Sidebar