import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import "./admin.scss";
import ListStaff from "./ListStaff";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/BreadCrumb ";
import CreateStaff from "./CreateStaff";

const { Content, Sider, Header } = Layout;
const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [createStaff, setCreateStaff] = useState(false);
  const onClickCreateStaff = () => {
    setCreateStaff(true);
  };
  return (
    <div>
      <div className="admin">
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
            <Header className="layout-header">
              <p className="header-title">Quản lý nhân viên</p>
            </Header>
            <Content className="layout-content">
              <Breadcrumbs />
              <div>
                <Button
                  type="primary"
                  onClick={onClickCreateStaff}
                  icon={<PlusCircleOutlined />}
                  size="middle"
                  className="button-add"
                >
                  Thêm mới nhân viên
                </Button>
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
      <CreateStaff visible={createStaff} close={setCreateStaff} />
    </div>
  );
};

export default Admin;
