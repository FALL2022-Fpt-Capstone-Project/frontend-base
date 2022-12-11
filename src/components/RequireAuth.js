import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles, allowedPermission }) => {
  const { auth } = useAuth();
  const location = useLocation();

  let roles = localStorage.getItem("Role");
  let permission = localStorage.getItem("permission");

  return allowedRoles?.includes(roles) && allowedPermission?.some((per) => permission.includes(per)) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default RequireAuth;
