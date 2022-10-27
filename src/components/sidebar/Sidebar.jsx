import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  LogoutOutlined,
  DollarOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
  UserOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  BulbOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
const Sidebar = () => {
  const { auth } = useAuth();
  let id = localStorage.getItem("id");
  let cookie = localStorage.getItem("Cookie");
  let role = localStorage.getItem("Role");
  useEffect(() => {
    axios
      .get(`manager/account/staff-account/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {});
  }, []);
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
          <Menu.Item key="/room">
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key="/equiment">
            <BulbOutlined />
            <span>Quản lý trang thiết bị</span>
            <Link to="/equiment" />
          </Menu.Item>
          <Menu.Item>
            <DollarOutlined />
            <span>Quản lý nguồn tiền</span>
          </Menu.Item>

          <Menu.Item>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key="/contract-apartment">
            <SolutionOutlined />
            <span>Quản lý hợp đồng chung cư</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key="/contract-renter">
            <SolutionOutlined />
            <span>Quản lý hợp đồng khách thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>
          <Menu.Item key="/manage-admin">
            <UserOutlined />
            <span>Quản lý nhân viên</span>
            <Link to="/manage-admin" />
          </Menu.Item>

          <Menu.Item key={`/detail-staff/${id}`}>
            <IdcardOutlined />
            <span>Thông tin cá nhân</span>
            <Link to={`/detail-staff/${id}`} />
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
          <Menu.Item key="/room">
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key="/equiment">
            <BulbOutlined />
            <span>Quản lý trang thiết bị</span>
            <Link to="/equiment" />
          </Menu.Item>

          <Menu.Item>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key="/contract-renter">
            <SolutionOutlined />
            <span>Quản lý hợp đồng khách thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>

          <Menu.Item key={`/detail-staff/${id}`}>
            <IdcardOutlined />
            <span>Thông tin cá nhân</span>
            <Link to={`/detail-staff/${id}`} />
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
