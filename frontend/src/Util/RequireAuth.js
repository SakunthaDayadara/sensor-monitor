import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const RequireAuth = ({ allowedRole }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // Check if user is authenticated
    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }   else {
        return <Outlet />;
    }
}

export default RequireAuth;
