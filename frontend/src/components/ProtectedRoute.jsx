import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps protected pages — redirects to /login if not authenticated.
// Passes the intended path as location state so LoginForm can redirect back after login.
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // state.from lets LoginForm know where to send the user after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
}