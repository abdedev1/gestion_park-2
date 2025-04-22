import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const {user, isLoading } = useSelector(state => state.auth);
  // Wait until loading finishes
  if (isLoading) {
    return null; // or a loader if you want
  }

  // Now decide what to do based on role
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const LoggedOut = () => {
  const { token } = useSelector(state => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const RedirectByRole = () => {
  const { user } = useSelector(state => state.auth);

  if (user?.role === 'admin') {
    return <Navigate to="/users" replace />;
  }

  if (user?.role === 'employe') {
    return <Navigate to="/overview" replace />;
  }

  return <Navigate to="/" replace />;
};

export { ProtectedRoute, LoggedOut, RedirectByRole };