import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const user = useSelector(state => state.auth.user);
  console.log(user);
  
  // If user is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // If user doesn't have the required role, redirect them based on the requiredRole parameter
  if (user.role !== requiredRole) {
    // Get the redirect path based on the requiredRole
    const redirectPath = requiredRole === "admin" ? "/admin/dashboard" : 
                         requiredRole === "client" ? "/client" : "/";
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // If user has the required role, render the child routes
  return <Outlet />;
};

export { ProtectedRoute };