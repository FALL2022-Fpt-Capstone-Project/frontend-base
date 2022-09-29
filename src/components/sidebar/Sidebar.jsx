import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  MailOutlined,
  LogoutOutlined,
  DollarOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import React, { useState } from "react";
import "./sidebar.scss";

const Sidebar = () => {
  const [current, setCurrent] = useState("1");

  const onClick = (e) => {
    console.log("click ", e);
    console.log(current);
    setCurrent(e.key);
  };

  return (
    <div>
      <Menu theme="dark" defaultSelectedKeys={["1"]} selectedKeys={[current]} mode="inline" onClick={onClick}>
        <Menu.Item key="1">
          <DashboardOutlined />
          <span>Trang chủ</span>
          <Link to="/" />
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
          <Menu.Item key="5">
            <span>Quản lý chung cư</span>
            <Link to="/" />
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="6">
          <MailOutlined />
          <span>Email/SMS</span>
          <Link to="/" />
        </Menu.Item>

        <Menu.SubMenu
          title={
            <>
              <ProfileOutlined />
              <span>Quản lý hoá đơn</span>
            </>
          }
        >
          <Menu.Item key="7">
            <span>Quản lý chung cư</span>
            <Link to="/" />
          </Menu.Item>
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
            <span>Quản lý chung cư</span>
            <Link to="/" />
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="9">
          <LogoutOutlined />
          <span>Đăng xuất</span>
          <Link to="/" />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
