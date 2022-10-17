import React, { useEffect, useState } from "react";
import { Button, Layout, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import "./admin.scss";
import ListStaff from "./ListStaff";
import CreateStaff from "./CreateStaff";

const { Content, Sider, Header } = Layout;
const Admin = () => {
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
              <p className="header-title">Danh sách nhân viên</p>
            </Header>
            <Content
              className="layout-content"
              style={{
                margin: "10px 16px",
              }}
            >
              <div>
                <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={showModal} className="button-add">
                  Tạo mới
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
        <Modal
          open={open}
          title="Thêm nhân viên"
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose={true}
          width={700}
          footer={[
            <Button htmlType="submit" form="createStaff" type="primary" onClick={handleOk}>
              Lưu
            </Button>,
            <Button key="back" onClick={handleCancel}>
              Huỷ
            </Button>,
          ]}
        >
          <CreateStaff />
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
