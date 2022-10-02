import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Building from "./pages/building/Building";
import Room from "./pages/room/Room";
import Contract from "./pages/contract/Contract";
import Unauthorized from "./components/Unautharized";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

const ROLES = {
  User: "ROLE_USER",
  Admin: "ROLE_ADMIN",
};

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="building" element={<Building />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="room" element={<Room />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="contact" element={<Contract />} />
        </Route>
      </Routes>
      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
