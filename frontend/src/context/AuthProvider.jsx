import { useEffect, useState } from "react";
import AuthContext from "./AuthContext.jsx";
import {
  loginUser,
  logoutUser,
} from "../features/auth/auth.api";

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
           const checkLoggedInUser = async () => {
                try {
                const response = await getCurrentUser();
                setUser(response.data.data);
                } catch (error) {
                setUser(null);
                } finally {
                setLoading(false);
                }
            };

        checkLoggedInUser(); 
    },[])

    const login = async(credentials) => {
        try {
            setLoading(true)

            const response = await loginUser(credentials);

            const loggedInUser = response.data.data.user
            setUser(loggedInUser)

            return loggedInUser;
        } finally {
            setLoading(false)
        }
    }

    const logout = async() => {
        try {
            setLoading(true)

            await logoutUser();

            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;