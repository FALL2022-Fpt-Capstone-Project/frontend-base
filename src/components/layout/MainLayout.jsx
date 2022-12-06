import React, { useEffect, useState } from "react";
import { Avatar, Divider, Layout } from "antd";
import Sidebar from "../sidebar/Sidebar";
import Breadcrumbs from "../BreadCrumb ";
import { UserOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import "./mainlayout.scss";
const { Content, Sider, Header } = Layout;
const MainLayout = ({ children, button, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState();
  let cookie = localStorage.getItem("Cookie");
  let id = localStorage.getItem("id");
  useEffect(() => {
    axios
      .get(`manager/staff/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id, cookie]);
  return (
    <Layout
      style={{
        minHeight: "100vh",
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
        <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <Header className="layout-header">
          <p className="header-title">{title}</p>
          <div className="avatar">
            <Avatar
              size={{
                xs: 24,
                sm: 32,
                md: 40,
                lg: 40,
              }}
              icon={<UserOutlined />}
            />
            <span className="user-name">Xin chào {user?.full_name}</span>
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
