import { Button, Col, Divider, Layout, Modal, Row, Statistic } from "antd";
import React, { useState } from "react";
import "./invoice.scss";
import Breadcrumbs from "../../components/BreadCrumb ";
import Sidebar from "../../components/sidebar/Sidebar";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";
import ListInvoiceDebt from "./ListInvoiceDebt";
import ListInvoiceUnpaid from "./ListInvoiceUnpaid";

const { Content, Sider, Header } = Layout;
const Invoice = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalUnpaidOpen, setIsModalUnpaidOpen] = useState(false);
  const [isModalDebtOpen, setIsModalDebtOpen] = useState(false);
  const showModalUnpaid = () => {
    setIsModalUnpaidOpen(true);
  };
  const showModalDebt = () => {
    setIsModalDebtOpen(true);
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
                  <p className="show-more" onClick={showModalDebt}>
                    Xem chi tiết
                  </p>
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <>
                        <span className="invoice-statistic">Số hoá đơn chưa thanh toán </span>
                        {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button> */}
                      </>
                    }
                    value={4}
                  />
                  <p className="show-more" onClick={showModalUnpaid}>
                    Xem chi tiết
                  </p>
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
      <Modal
        title="Danh sách hoá đơn còn nợ"
        // style={{ maxwidth: 900 }}
        width={1300}
        visible={isModalDebtOpen}
        onOk={() => setIsModalDebtOpen(false)}
        onCancel={() => setIsModalDebtOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalDebtOpen(false)}>
            Quay lại
          </Button>,
        ]}
      >
        <ListInvoiceDebt />
      </Modal>
      <Modal
        title="Danh sách hoá đơn chưa thanh toán"
        // style={{ maxwidth: 900 }}
        width={1300}
        visible={isModalUnpaidOpen}
        onOk={() => setIsModalUnpaidOpen(false)}
        onCancel={() => setIsModalUnpaidOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalUnpaidOpen(false)}>
            Quay lại
          </Button>,
        ]}
      >
        <ListInvoiceUnpaid />
      </Modal>
    </div>
  );
};

export default Invoice;
