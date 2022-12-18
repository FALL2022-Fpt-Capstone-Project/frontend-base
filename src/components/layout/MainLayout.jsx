import React, { useEffect, useState } from "react";
import { Avatar, Col, Divider, Dropdown, Image, Layout, Menu, Row, Space } from "antd";
import Sidebar from "../sidebar/Sidebar";
import Breadcrumbs from "../BreadCrumb ";
import { UserOutlined } from "@ant-design/icons";
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
          <img src={require("../../assets/image/rms-logo.png")} id="logo" alt="logo" />
        </div>
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <Header className="layout-header">
          <p className="header-title">{title}</p>
          <div className="avatar">
            <Row>
              <Col span={24}>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Space>
                    <span className="user-name">
                      Xin chào,
                      <a onClick={(e) => e.preventDefault()} href="/personal">
                        {" " + name}
                      </a>
                    </span>
                  </Space>
                </Dropdown>{" "}
                {/* <Avatar
                  size={{
                    xs: 24,
                    sm: 32,
                    md: 40,
                    lg: 40,
                  }}
                  icon={<UserOutlined />}
                /> */}
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
          <Breadcrumbs button={button} />
          <Divider />
          <div className="site-layout-background">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
