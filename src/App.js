import "antd/dist/antd.min.css";
// import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/login/Login";
import Forgot from "./pages/forgot/Forgot";
import Building from "./pages/building/Building";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            {/* <Route index element={<Home />} /> */}

            <Route index element={<Login />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="building" element={<Building />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
