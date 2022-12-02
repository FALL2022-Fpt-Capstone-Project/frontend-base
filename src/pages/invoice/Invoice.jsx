import { Button, Col, Divider, Layout, Row, Statistic } from "antd";
import React, { useState } from "react";
import "./invoice.scss";
import Breadcrumbs from "../../components/BreadCrumb ";
import Sidebar from "../../components/sidebar/Sidebar";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Content, Sider, Header } = Layout;
const Invoice = () => {
  const [collapsed, setCollapsed] = useState(false);
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
              <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8}>
                  <Statistic
                    title={
                      <>
                        <span className="invoice-statistic">Số hoá đơn còn nợ </span>
                      </>
                    }
                    value={2}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <>
                        <span className="invoice-statistic">Số hoá đơn chưa thanh toán </span>
                        {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button> */}
                      </>
                    }
                    value={5}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <>
                        <span className="invoice-statistic">Tổng số tiền đã thu tháng này </span>
                      </>
                    }
                    value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(132990000)}
                  />
                </Col>
              </Row>
            </div>
            <div>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="middle"
                href="/invoice/create-invoice-auto"
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
