import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
const { Content, Sider, Header } = Layout;

const Home = () => {
  return (
    <div className="home">
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
          {/* <Header
            className="layout-header"
            style={{
              margin: "0 16px",
            }}
          >
            <p className="header-title">Quản lý chung cư</p>
          </Header> */}
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            Hello
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            ></div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
