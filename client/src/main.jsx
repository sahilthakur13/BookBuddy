import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LoadingProvider } from './context api/LoadingContext.jsx'
import { AuthProvider } from './context api/AuthContext.jsx'

createRoot(document.getElementById('root')).render(

  <LoadingProvider>
 <BrowserRouter>
  <AuthProvider>
  <Toaster position="top-center" reverseOrder={false} /> 
    <App />
</AuthProvider>
   </BrowserRouter>
</LoadingProvider>
)
