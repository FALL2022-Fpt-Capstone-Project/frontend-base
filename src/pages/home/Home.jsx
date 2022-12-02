import React, { useEffect, useState } from "react";
import { Button, Card, Col, Layout, notification, Row, Space, Statistic } from "antd";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/BreadCrumb ";
import RevenueStatistic from "./RevenueStatistic";
import RoomStatistic from "./RoomStatistic";
import ContractStatistic from "./ContractStatistic";
import InvoiceStatistic from "./InvoiceStatistic";
const { Content, Sider, Header } = Layout;

const Home = () => {
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
          <Header className="layout-header">
            <p className="header-title">Trang chủ</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <Breadcrumbs />
            <div className="site-layout-background">
              <Row gutter={[32]}>
                <Col span={11}>
                  <RevenueStatistic />
                  <Row>
                    <Col span={8}>
                      <Card className="card-revenue">
                        <Statistic
                          title={
                            <>
                              <span className="revenue-statistic">Khoản thu</span>
                            </>
                          }
                          value={111234560}
                          precision={2}
                          valueStyle={{
                            color: "#3f8600",
                          }}
                          prefix={<RiseOutlined />}
                          suffix="VNĐ"
                        />
                      </Card>
                    </Col>
                    <Col span={8} offset={2}>
                      <Card className="card-revenue">
                        <Statistic
                          title={
                            <>
                              <span className="revenue-statistic">Khoản chi</span>
                            </>
                          }
                          value={12345600}
                          precision={2}
                          valueStyle={{
                            color: "#cf1322",
                          }}
                          prefix={<FallOutlined />}
                          suffix="VNĐ"
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col span={11} offset={1} style={{ height: "400px" }}>
                  <RoomStatistic />
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <ContractStatistic />
                </Col>
                <Col span={11} offset={1}>
                  <Row>
                    <InvoiceStatistic />
                  </Row>
                  <Row>
                    <p className="description">Hiện tại chưa đến thời hạn lập hoá đơn</p>
                  </Row>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;
