import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./building.scss";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Modal } from "antd";
import CreateBuilding from "./CreateBuilding";
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
          <Header
            className="layout-header"
            style={{
              margin: "0 16px",
            }}
          >
            <p className="header-title">Quản lý chung cư</p>
            <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={showModal}>
              Thêm chung cư
            </Button>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
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

      <Modal
        open={open}
        title="Thêm chung cư"
        onOk={handleOk}
        onCancel={handleCancel}
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
