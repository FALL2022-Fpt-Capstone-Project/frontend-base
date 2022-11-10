import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./building.scss";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Modal } from "antd";
import CreateBuilding from "./CreateBuilding";
import ListBuilding from "./ListBuilding";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const Building = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
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
            <div>
              <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={showModal} className="button-add">
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

      <Modal
        open={open}
        title="Thêm chung cư"
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        width={700}
        footer={[
          <Button htmlType="submit" form="createBuilding" type="primary" onClick={handleOk}>
            Lưu
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
        ]}
      >
        <CreateBuilding />
      </Modal>
    </div>
  );
};

export default Building;
