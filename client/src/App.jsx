import React from 'react'
import {Routes, Route} from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Signup from './pages/Signup'
import { Login } from './pages/Login'
import OtpVerify from './pages/OtpVerify'
import CreateEvent from './AdminPages/CreateEvent'
import Home from './layout/Home'
import Loader from './components/Loader'
import EventsDetails from './pages/EventsDetails'
import MyBooking from './pages/MyBooking'
import AdminScanner from './AdminPages/AdminScanner'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoutes from './components/ProtectedRoutes'
import { useAuth } from './context api/AuthContext'
import AdminOverview from './AdminPages/Adminoverview'
import AdminLayout from './AdminPages/Adminlayout'
import AdminEvents from './AdminPages/Adminevents'
import AdminBookings from './AdminPages/Adminbookings'
import AdminUsers from './AdminPages/Adminusers'
import Adminusers from './AdminPages/Adminusers'

const App = () => {

  const {authChecked} = useAuth();
  if(!authChecked){
    return(
       <div className="h-screen w-screen flex items-center justify-center bg-black ">
        <Loader />
      </div>
    )
  }

  return (
    
    <Routes>
       <Route path='/' element={<MainLayout/>}>
        <Route index element={<Home/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/otp-verify' element={<OtpVerify/>}/>


     {/* For Admin only */}
      <Route element={<ProtectedRoutes AllowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path='/dashboard' index element={<AdminOverview />} />
          <Route path='/admin/events' element={<AdminEvents />} />
          <Route path='/admin/bookings' element={<AdminBookings />} />
          <Route path='/admin/users' element={<AdminUsers />} />
          <Route path='/checkTicket' element={<AdminScanner />} />
          <Route path='/createEvent' element={<CreateEvent />} />
          <Route path='/admin/events/edit/:id' element={<CreateEvent/>} />
        </Route>
      </Route>

      {/* for user + admin  */}
      <Route element={<ProtectedRoutes AllowedRoles={['user','admin']} />}>
        <Route path='/myBooking' element={<MyBooking/>}/>
      </Route>

    <Route path='/admin/users' element={<Adminusers/>} />

        <Route path='/eventDetails/:id' element={<EventsDetails/>}/>

        <Route path="/unauthorized" element={<Unauthorized />} />
       </Route>
    </Routes>
  )
}

export default App