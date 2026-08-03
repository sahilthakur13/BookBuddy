import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { checkAuthentication, loginUser, logoutUser, registerUser } from "../api/axios";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [authChecked, setAuthChecked] = useState(false);

    const checkAuth = useCallback(async () => {
        try {
            const response = await checkAuthentication();
            const userData = response?.data?.user;

            if (userData && userData.role) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setAuthChecked(true);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    const login = async (data) => {
        const response = await loginUser(data);
        setUser(response.data.user);
        return response;
    }

    const logout = async () => {
        const res = await logoutUser();
        setUser(null);

    }

    const signup = async (data) => {
        const response = await registerUser(data);
        return response;
    }
    const value = {
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" ? true : false,
        role: user?.role,
        authChecked, checkAuth, login, logout, signup, user, setUser
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}


export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}