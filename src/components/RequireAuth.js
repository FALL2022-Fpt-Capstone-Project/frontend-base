import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles, allowedPermission }) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth);

  let role = localStorage.getItem("Role");
  let permission = localStorage.getItem("permission");
  let b = permission + ",6";
  let permissionfinal = b.split(",");
  console.log(b.split(","));
  console.log(permission);
  console.log(allowedPermission);
  console.log(permissionfinal?.includes(allowedPermission));
  return allowedRoles?.includes(role) && permissionfinal?.includes(allowedPermission) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default RequireAuth;
