import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { PlusOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card } from "antd";
import ListContractRenter from "./ListContractRenter";
const { Content, Sider, Header } = Layout;
const ContractRenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="contract">
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
            <p className="header-title">Quản lý hợp đồng khách thuê</p>
          </Header>
          <Content
            className="layout-content"
            style={{
              margin: "10px 10px",
            }}
          >
            <div className="btn-contract">
              <Button
                icon={<PieChartOutlined />}
                size="middle"
                className="button-collapse"
                onClick={() => setIsOpen(!isOpen)}
              >
                Thống kê hợp đồng
              </Button>
              <Button type="primary" icon={<PlusOutlined />} size="middle" className="button-add" href="/contract-renter/create">
                Thêm hợp đồng
              </Button>
            </div>
            {isOpen && (
              <div className="contract-statistic">
                <div className="contract-card">
                  <Card
                    title="Số lượng hợp đồng mới được mở"
                    style={{
                      width: 300,
                      marginRight: 20,
                    }}
                  >
                    <p>100 hợp đồng</p>
                    <Button type="link">Xem chi tiết</Button>
                  </Card>
                  <Card
                    title="Số lượng hợp đồng sắp hết hạn"
                    style={{
                      width: 300,
                    }}
                  >
                    <p>100 hợp đồng</p>
                    <Button type="link">Xem chi tiết</Button>
                  </Card>
                </div>
                <p className="card-info">Thông tin hiển thị dữ liệu 3 tháng gần nhất</p>
              </div>
            )}
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <ListContractRenter />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ContractRenter;
