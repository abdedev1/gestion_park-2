import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const {user, isLoading } = useSelector(state => state.auth);
  // If user has the required role, render the child routes
  if (isLoading || !user || user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const LoggedOut = () => {
  const {user, isLoading } = useSelector(state => state.auth);
  // If is logged out, render the child routes
  if (isLoading || user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export { ProtectedRoute, LoggedOut };