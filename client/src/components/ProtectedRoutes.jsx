import React from 'react'
import { Outlet , Navigate } from 'react-router-dom'
import { useAuth } from '../context api/AuthContext'

const ProtectedRoutes = ({AllowedRoles}) => {

    const {role,isAuthenticated,authChecked} = useAuth();

    if (!authChecked) {
        return <div>Loading...</div>;
    }

    if(!isAuthenticated){
    return <Navigate to="/login" replace />;
    } 

    const hasAccess = AllowedRoles.includes(role);    

  return hasAccess ? <Outlet/> : <Navigate to="/unauthorized" replace />
}

export default ProtectedRoutes