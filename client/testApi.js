// ============================================================
//  services/api.js
//  Saare backend requests YAHAN SE jaate hain.
//  axios.create se ek instance banaya hai jo:
//    - base URL automatically lagata hai
//    - withCredentials: true → cookie (JWT) har request ke saath jaati hai
// ============================================================

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // 🔧 apna backend URL yahan
  withCredentials: true,                  // HttpOnly cookie automatic jaayegi
});

// ─── AUTH ────────────────────────────────────────────────────
// POST /api/auth/register  → { name, email, password }
export const registerUser   = (data) => api.post('/auth/register', data);

// POST /api/auth/verify-otp → { email, otp }
export const verifyOtp      = (data) => api.post('/auth/verify-otp', data);

// POST /api/auth/login      → { email, password }
export const loginUser      = (data) => api.post('/auth/login', data);

// POST /api/auth/logout     → clears the HttpOnly cookie on backend
export const logoutUser     = ()     => api.post('/auth/logout');

// GET  /api/auth/me         → returns { user: { _id, name, email, role } }
// Yeh call refresh pe bhi hoti hai — cookie se backend verify karta hai
export const getMe          = ()     => api.get('/auth/me');


// ─── EVENTS ──────────────────────────────────────────────────
// GET  /api/events              → array of all events (public)
export const getAllEvents   = ()     => api.get('/events');

// GET  /api/events/:id          → single event with seats[] (public)
export const getEventById   = (id)  => api.get(`/events/${id}`);

// POST /api/events              → create event (admin only)
// body: { title, artist, description, eventDate, location, totalSeats, price, ... }
export const createEvent    = (data) => api.post('/events', data);

// PUT  /api/events/:id          → update event (admin only)
export const updateEvent    = (id, data) => api.put(`/events/${id}`, data);

// DELETE /api/events/:id        → delete event (admin only)
export const deleteEvent    = (id)  => api.delete(`/events/${id}`);


// ─── BOOKINGS ────────────────────────────────────────────────
// POST /api/bookings
// body: { eventId, seatsNumber: ["1","3","5"], totalPrice: 1500 }
// Backend: seats mark booked, booking doc create, confirmation email send
export const createBooking  = (data) => api.post('/bookings', data);

// GET  /api/bookings/my         → logged-in user ki saari bookings
export const getMyBookings  = ()     => api.get('/bookings/my');

// PUT  /api/bookings/:id/cancel → cancel a booking
export const cancelBooking  = (id)  => api.put(`/bookings/${id}/cancel`);

// GET  /api/admin/bookings      → admin: all bookings (admin only)
export const getAllBookings  = ()     => api.get('/admin/bookings');


export default api;
