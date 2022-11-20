import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./building.scss";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Layout, Modal } from "antd";
import CreateBuilding from "./CreateBuilding";
import ListBuilding from "./ListBuilding";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const Building = () => {
  const [createBuilding, setCreateBuilding] = useState(false);
  const onClickCreateBuilding = () => {
    setCreateBuilding(true);
  };

  return (
    <div className="building">
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
          <Header className="layout-header">
            <p className="header-title">Quản lý chung cư</p>
          </Header>
          <Content
            className="layout-content"
            style={{
              margin: "10px 10px",
            }}
          >
            <Breadcrumbs />
            <Divider />
            <div>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="middle"
                onClick={onClickCreateBuilding}
                className="button-add"
              >
                Thêm chung cư
              </Button>
            </div>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <ListBuilding />
            </div>
          </Content>
        </Layout>
      </Layout>
      <CreateBuilding visible={createBuilding} close={setCreateBuilding} />
    </div>
  );
};

export default Building;
