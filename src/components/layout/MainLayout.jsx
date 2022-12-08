import React, { useEffect, useState } from "react";
import { Avatar, Col, Divider, Dropdown, Layout, Menu, Row } from "antd";
import Sidebar from "../sidebar/Sidebar";
import Breadcrumbs from "../BreadCrumb ";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import "./mainlayout.scss";
import { useNavigate } from "react-router-dom";
const { Content, Sider, Header } = Layout;
const MainLayout = ({ children, button, title }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  let name = localStorage.getItem("name");
  const menu = (
    <Menu style={{ width: "150px" }}>
      <Menu.Item
        onClick={() => {
          navigate("/personal");
        }}
      >
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          navigate("/login");
          localStorage.clear();
        }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "100vh",
      }}
    >
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <img src={require("../../assets/image/logo.png")} id="logo" alt="Logo" />
        </div>
        {/* <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p> */}
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <Header className="layout-header">
          <p className="header-title">{title}</p>
          <div className="avatar">
            <Row>
              <Col span={24}>
                <Avatar
                  size={{
                    xs: 24,
                    sm: 32,
                    md: 40,
                    lg: 40,
                  }}
                  icon={<UserOutlined />}
                />
                <span className="user-name">
                  Xin chào, <a href="/personal">{name}</a>
                </span>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <DownOutlined />
                </Dropdown>
              </Col>
            </Row>
          </div>
        </Header>
        <Content
          style={{
            margin: "10px 16px",
          }}
          className="layout-content"
        >
          <Breadcrumbs />
          <Divider />
          <div>{button}</div>
          <div className="site-layout-background">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
