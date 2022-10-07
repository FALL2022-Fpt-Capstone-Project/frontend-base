import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth);

  let role = localStorage.getItem("Role");

  return allowedRoles?.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequireAuth;
