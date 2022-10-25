import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Building from "./pages/building/Building";
import Room from "./pages/room/Room";
import ContractApartment from "./pages/contract/Contract";
import ContractRenter from "./pages/contract/ContractRenter";
import Unauthorized from "./components/Unautharized";
import RequireAuth from "./components/RequireAuth";
import CreateContractRenter from "./pages/contract/CreateContractRemter";
import Admin from "./pages/admin/Admin";
import CreateStaff from "./pages/admin/CreateStaff";
import DetailStaff from "./pages/admin/DetailStaff";
import UpdateStaff from "./pages/admin/UpdateStaff";

const ROLES = {
  User: "ROLE_STAFF",
  Admin: "ROLE_ADMIN",
};

const PERMISSION = {
  Infrastructure: "1",
  Money: "2",
  Invoice: "3",
  Contract: "4",
  Staff: "5",
  Update: "6",
};

const App = () => {
  console.log(typeof PERMISSION.Contract);
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} allowedPermission={PERMISSION.Update} />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="building" element={<Building />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="room" element={<Room />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="contract-apartment" element={<ContractApartment />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} allowedPermission={PERMISSION.Contract} />}
        >
          <Route path="contract-renter" element={<ContractRenter />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} allowedPermission={PERMISSION.Contract} />}
        >
          <Route path="contract-renter/create" element={<CreateContractRenter />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} allowedPermission={PERMISSION.Staff} />}>
          <Route path="manage-admin" element={<Admin />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} allowedPermission={PERMISSION.Staff} />}>
          <Route path="create-staff" element={<CreateStaff />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} allowedPermission={PERMISSION.Update} />}>
          <Route path="detail-staff/:id" element={<DetailStaff />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} allowedPermission={PERMISSION.Update} />}>
          <Route path="update-staff/:id" element={<UpdateStaff />} />
        </Route>
      </Routes>
      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
