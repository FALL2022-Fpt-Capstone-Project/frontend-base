import React, { useEffect, useState } from "react";
import { Button, Layout, notification, Space } from "antd";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;

const Home = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => notification.destroy()}>
          Destroy All
        </Button>
        <Button type="primary" size="small" onClick={() => notification.destroy(key)}>
          Confirm
        </Button>
      </Space>
    );
    api.open({
      message: "Notification Title",
      description:
        'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      btn,
      key,
      placement: "top",
    });
  };
  useEffect(() => {
    openNotification();
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="home">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
            <Breadcrumbs />
            {contextHolder}
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
