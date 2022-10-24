import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import "./admin.scss";
import ListStaff from "./ListStaff";
import { Link } from "react-router-dom";

const { Content, Sider, Header } = Layout;
const Admin = () => {
  return (
    <div>
      <div className="admin">
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider width={250}>
            <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
            <Sidebar />
          </Sider>
          <Layout className="site-layout">
            <Header
              className="layout-header"
              style={{
                margin: "0 16px",
              }}
            >
              <p className="header-title">Quản lý nhân viên</p>
            </Header>
            <Content
              className="layout-content"
              style={{
                margin: "10px 16px",
              }}
            >
              <div>
                <Link to="/create-staff">
                  <Button type="primary" icon={<PlusOutlined />} size="middle" className="button-add">
                    Tạo mới
                  </Button>
                </Link>
              </div>
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                <ListStaff />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default Admin;
