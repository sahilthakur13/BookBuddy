import axios from 'axios'
import { saveRedirect } from '../utils/authRedirect';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

let showLoader = null;
let hideLoader = null;
let activeRequests = 0;

export const loaderHandler = (show, hide) => {
    showLoader = show;
    hideLoader = hide;
}

const startRequest = () => {
    activeRequests++;
    if (showLoader) showLoader();
}

const endRequest = () => {
    activeRequests--;
    if (activeRequests <= 0) {
        activeRequests = 0;
        if (hideLoader) hideLoader();
    }
}


api.interceptors.request.use((config) => {
    startRequest();
    return config;
}, (error) => {
    endRequest();
    return Promise.reject(error);
})

api.interceptors.response.use(
    (response) => {
        endRequest(); 
        return response;
    },
    (error) => {
        endRequest();

        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const authPages = ["/login", "/signup", "/otp-verify"];

            if (authPages.includes(currentPath)) {
                return Promise.reject(error);
            }

            if (!sessionStorage.getItem("redirectAfterAuth")) {
                const currentTarget = currentPath + window.location.search;
                saveRedirect(currentTarget);
            }

            if (hideLoader) hideLoader();
            activeRequests = 0;

            window.location.href = "/login";
            return new Promise(() => {});
        }

        return Promise.reject(error);
    }
);



export const registerUser = (data) => api.post('/auth/register', data);

export const loginUser = (data) => api.post('/auth/login', data);

export const logoutUser = () => api.post('/auth/logout');

export const checkAuthentication = () => api.get('/auth/me');

export const verifyUserByOtp = (data) => api.post('/auth/verify-otp', data)

export const allEvents = (page) => api.get(`/event/all?page=${page}&limit=12`)

export const getEventDetails = (id) => api.get(`/event/details/${id}`)

export const bookingEvent = (data) => api.post('/booking/event', data);

export const myBooking = () => api.get('/booking/userBooking');

export const verifyBookingPayment = (data) => api.post('/booking/verifyBookingPayment', data)

export const viewTicket = (id) => api.get(`/ticket/${id}`);

export const tickedVerification = (data) => api.post(`/ticket/verify`, data)



// Admin's apis

// events
export const getDashboardStats = () => api.get("/admin/dashboard/stats");

export const getAllEvents = ({ search, page, limit }) => api.get("/admin/events", { params: { search, page, limit } });
export const getEventById = (id) => api.get(`/admin/events/${id}`);

export const createEvent = (data) => api.post('/admin/create', data);


export const updateEvent = (id, data) => api.put(`/admin/events/update/${id}`, data);

export const updateEventStatus = (id, status) => api.patch(`/admin/events/${id}/status`, { status });

export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);

// bookings

export const getAllBooking = ({ search, page, limit }) => api.get("/admin/bookings", { params: { search, page, limit } });

export const updateBookingStatus = (id, status) => api.patch(`/admin/bookingStatus/${id}/status`, { status });

export const deleteBooking = (id) => api.delete(`/admin/booking/delete/${id}`);


// users
export const getAllUsers = (params) => api.get("/admin/users", { params });
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);


// for home search
export const searchEvents = (query, signal) => api.get("/event/search", { params: { q: query }, signal }); 