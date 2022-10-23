import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  MailOutlined,
  LogoutOutlined,
  DollarOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
  UserOutlined,
  IdcardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import axios from "../../api/axios";

const Sidebar = () => {
  const [current, setCurrent] = useState("1");
  let id = localStorage.getItem("id");
  let cookie = localStorage.getItem("Cookie");
  let role = localStorage.getItem("Role");

  const onClick = (e) => {
    console.log("click ", e);
    console.log(current);
    setCurrent(e.key);
  };
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
      <Menu theme="dark" defaultSelectedKeys={["1"]} selectedKeys={[current]} mode="inline" onClick={onClick}>
        <Menu.Item key="1">
          <DashboardOutlined />
          <span>Trang chủ</span>
          <Link to="/home" />
        </Menu.Item>
        <Menu.SubMenu
          title={
            <>
              <HomeOutlined />
              <span>Quản lý cơ sở vật chất</span>
            </>
          }
        >
          <Menu.Item key="2">
            <span>Quản lý chung cư</span>
            <Link to="/building" />
          </Menu.Item>
          <Menu.Item key="3">
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key="4">
            <span>Quản lý trang thiết bị</span>
            <Link to="/" />
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          title={
            <>
              <DollarOutlined />
              <span>Quản lý nguồn tiền</span>
            </>
          }
        >
          {/* <Menu.Item key="5">
            <span>Quản lý chung cư</span>
            <Link to="/" />
          </Menu.Item> */}
        </Menu.SubMenu>
        <Menu.Item key="6">
          <MailOutlined />
          <span>Email/SMS</span>
          {/* <Link to="/" /> */}
        </Menu.Item>

        <Menu.SubMenu
          title={
            <>
              <ProfileOutlined />
              <span>Quản lý hoá đơn</span>
            </>
          }
        >
          {/* <Menu.Item key="7">
            <span>Quản lý chung cư</span>
            <Link to="/" />
          </Menu.Item> */}
        </Menu.SubMenu>
        <Menu.SubMenu
          title={
            <>
              <SolutionOutlined />
              <span>Quản lý hợp đồng</span>
            </>
          }
        >
          <Menu.Item key="8">
            <span>Quản lý hợp đồng chung cư</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key="9">
            <span>Quản lý hợp đồng khách thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>
        </Menu.SubMenu>
        {role === "ROLE_ADMIN" ? (
          <Menu.SubMenu
            title={
              <>
                <TeamOutlined />
                <span>Quản lý nhân viên</span>
              </>
            }
          >
            <Menu.Item key="10">
              <UserOutlined />
              <span>Quản lý nhân viên</span>
              <Link to="/manage-admin" />
            </Menu.Item>
            <Menu.Item key="11">
              <IdcardOutlined />
              <span>Thông tin cá nhân</span>
              <Link to={`/detail-staff/${id}`} />
            </Menu.Item>
          </Menu.SubMenu>
        ) : (
          <Menu.Item key="11">
            <IdcardOutlined />
            <span>Thông tin cá nhân</span>
            <Link to={`/detail-staff/${id}`} />
          </Menu.Item>
        )}

        <Menu.Item key="12" onClick={() => localStorage.clear()}>
          <LogoutOutlined />
          <span>Đăng xuất</span>
          <Link to="/login" />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
