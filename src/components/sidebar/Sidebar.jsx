import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  LogoutOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
  UserOutlined,
  ApartmentOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const [contractRenterLink, setContractRenterLink] = useState("/contract-renter");
  const [contractApartmentLink, setContractApartmentLink] = useState("/contract-apartment");
  const [invoiceLink, setInvoiceLink] = useState("/invoice");
  const [roomLink, setRoomLink] = useState("/room");
  const { auth } = useAuth();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/room/equipment")) {
      setRoomLink("/room/equipment");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("/room/preview")) {
      setRoomLink("/room/preview");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/room/member")) {
      setRoomLink("/room/member");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("/contract-renter/create") || location.pathname.includes("/contract-renter/edit")) {
      setContractRenterLink("/contract-renter/create");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/contract-renter/edit")) {
      setContractRenterLink(location.pathname);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/contract-apartment/create")) {
      setContractApartmentLink("/contract-apartment/create");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/contract-apartment/edit")) {
      setContractApartmentLink("/contract-apartment/edit");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/invoice/create-invoice-auto")) {
      setInvoiceLink("/invoice/create-invoice-auto");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/invoice/create-invoice-auto/preview")) {
      setInvoiceLink("/invoice/create-invoice-auto/preview");
    }
  }, [location.pathname]);

  let role = localStorage.getItem("Role");

  return (
    <div>
      {role === "ROLE_ADMIN" ? (
        <Menu theme="dark" defaultSelectedKeys={[window.location.pathname]} mode="inline">
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang ch???</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key="/building">
            <ApartmentOutlined />
            <span>Qu???n l?? chung c??</span>
            <Link to="/building" />
          </Menu.Item>
          <Menu.Item key={roomLink}>
            <HomeOutlined />
            <span>Qu???n l?? ph??ng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key={invoiceLink}>
            <ProfileOutlined />
            <span>Qu???n l?? ho?? ????n</span>
            <Link to="/invoice" />
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>D???ch v???</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key={contractApartmentLink}>
            <SolutionOutlined />
            <span>Qu???n l?? h???p ?????ng ??i thu??</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key={contractRenterLink}>
            <SolutionOutlined />
            <span>Qu???n l?? h???p ?????ng cho thu??</span>
            <Link to="/contract-renter" />
          </Menu.Item>
          <Menu.Item key="/manage-staff">
            <UserOutlined />
            <span>Qu???n l?? nh??n vi??n</span>
            <Link to="/manage-staff" />
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>????ng xu???t</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      ) : (
        <Menu theme="dark" defaultSelectedKeys={[window.location.pathname]} mode="inline">
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang ch???</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key={roomLink}>
            <HomeOutlined />
            <span>Qu???n l?? ph??ng</span>
            <Link to="/room" />
          </Menu.Item>

          <Menu.Item key={invoiceLink}>
            <ProfileOutlined />
            <span>Qu???n l?? ho?? ????n</span>
            <Link to="/invoice" />
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>D???ch v???</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key={contractRenterLink}>
            <SolutionOutlined />
            <span>Qu???n l?? h???p ?????ng cho thu??</span>
            <Link to="/contract-renter" />
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>????ng xu???t</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default Sidebar;
