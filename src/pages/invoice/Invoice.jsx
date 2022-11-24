import { Button, Divider, Layout } from "antd";
import React, { useState } from "react";
import "./invoice.scss";
import Breadcrumbs from "../../components/BreadCrumb ";
import Sidebar from "../../components/sidebar/Sidebar";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Content, Sider, Header } = Layout;
const Invoice = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const onClickCreateInvoice = () => {
    setCreateInvoice(true);
  };
  return (
    <div className="invoice">
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
            <p className="header-title">Quản lý hoá đơn</p>
          </Header>
          <Content className="layout-content">
            <Breadcrumbs />
            <Divider />
            <div>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="middle"
                // onClick={onClickCreateInvoice}
                className="button-add"
              >
                Tạo mới nhanh hoá đơn
              </Button>
            </div>
            <div className="site-layout-background">
              <ListInvoice />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Invoice;
