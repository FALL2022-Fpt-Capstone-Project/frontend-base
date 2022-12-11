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
import axios from "../../api/axios";

const Sidebar = () => {
  const [contractRenterLink, setContractRenterLink] = useState("/contract-renter");
  const [contractApartmentLink, setContractApartmentLink] = useState("/contract-apartment");
  const [invoiceLink, setInvoiceLink] = useState("/invoice");
  const [roomLink, setRoomLink] = useState("/room");

  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/room/equipment")) {
      setContractApartmentLink("/room/equipment");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("/room/preview")) {
      setRoomLink("/room/preview");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/room/member")) {
      setRoomLink("/room/member/");
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

  let role = localStorage.getItem("Role");

  return (
    <div>
      {role === "ROLE_ADMIN" ? (
        <Menu
          theme="dark"
          defaultSelectedKeys={[window.location.pathname]}
          // selectedKeys={[window.location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang chủ</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key="/building">
            <ApartmentOutlined />
            <span>Quản lý chung cư</span>
            <Link to="/building" />
          </Menu.Item>
          <Menu.Item key={roomLink}>
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>

          <Menu.Item key={invoiceLink}>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
            <Link to="/invoice" />
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key={contractApartmentLink}>
            <SolutionOutlined />
            <span>Quản lý hợp đồng đi thuê</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key={contractRenterLink}>
            <SolutionOutlined />
            <span>Quản lý hợp đồng cho thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>
          <Menu.Item key="/manage-staff">
            <UserOutlined />
            <span>Quản lý nhân viên</span>
            <Link to="/manage-staff" />
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          theme="dark"
          defaultSelectedKeys={[window.location.pathname]}
          // selectedKeys={[window.location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang chủ</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key={roomLink}>
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>

          <Menu.Item key={invoiceLink}>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
            <Link to="/invoice" />
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key={contractRenterLink}>
            <SolutionOutlined />
            <span>Quản lý hợp đồng cho thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default Sidebar;
