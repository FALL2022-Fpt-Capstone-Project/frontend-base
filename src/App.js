import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Building from "./pages/building/Building";
import Room from "./pages/room/Room";
import ContractApartment from "./pages/contract/ContractApartment";
import ContractRenter from "./pages/contract/ContractRenter";
import Unauthorized from "./components/Unautharized";
import RequireAuth from "./components/RequireAuth";
import CreateContractRenter from "./pages/contract/CreateContractRemter";
import Admin from "./pages/admin/Admin";
import CreateStaff from "./pages/admin/CreateStaff";
import DetailStaff from "./pages/admin/DetailStaff";
import UpdateStaff from "./pages/admin/UpdateStaff";
import Service from "./pages/service/Service";
import ServiceSetting from "./pages/service/ServiceSetting";
import EditContractRenter from "./pages/contract/EditContractRenter";
import CreateContractBuilding from "./pages/contract/CreateContractBuilding";

const ROLES = {
  User: "ROLE_STAFF",
  Admin: "ROLE_ADMIN",
};

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="building" element={<Building />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="room" element={<Room />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="contract-apartment" element={<ContractApartment />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="contract-renter" element={<ContractRenter />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="contract-renter/create" element={<CreateContractRenter />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="contract-renter/edit/:contract_id/group/:group_id" element={<EditContractRenter />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="contract-apartment/create" element={<CreateContractBuilding />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="manage-admin" element={<Admin />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="create-staff" element={<CreateStaff />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="detail-staff/:id" element={<DetailStaff />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="update-staff/:id" element={<UpdateStaff />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="service" element={<Service />} />
          <Route path="service/setting" element={<ServiceSetting />} />
        </Route>
      </Routes>
      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
