import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Layout, notification, Row, Select, Space, Statistic } from "antd";
import { FallOutlined, RiseOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import "./home.scss";
import "./home.scss";
import RevenueStatistic from "./RevenueStatistic";
import RoomStatistic from "./RoomStatistic";
import ContractStatistic from "./ContractStatistic";
import InvoiceStatistic from "./InvoiceStatistic";
import MainLayout from "../../components/layout/MainLayout";
import moment from "moment";
const cardTop = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  height: "100%",
  width: "100%",
};
const cardBottom = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  // height: '100%',
  width: "100%",
  marginTop: "3%",
};

const Home = () => {
  return (
    <div className="home">
      <MainLayout title="Trang chủ">
        <Row>
          <Col xs={24} lg={6} xl={4} span={4}>
            Chọn năm để thống kê:
            <Select
              defaultValue={2022}
              onChange={(e) => {}}
              style={{ width: "100%", marginBottom: "5%" }}
              options={[
                {
                  value: 2021,
                  label: 2021,
                },
                {
                  value: 2022,
                  label: 2022,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} xl={12} span={12}>
            <Card bordered style={cardTop}>
              <Row justify="center">
                <RevenueStatistic />
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} xl={12} span={12}>
                  <Statistic
                    title={
                      <>
                        <span className="revenue-statistic">Khoản thu (2022)</span>
                      </>
                    }
                    value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(10000000000)}
                    valueStyle={{
                      color: "#3f8600",
                    }}
                    prefix={<RiseOutlined />}
                  />
                </Col>
                <Col xs={24} xl={12} span={12}>
                  <Statistic
                    title={
                      <>
                        <span className="revenue-statistic">Khoản chi (2022)</span>
                      </>
                    }
                    value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(10000000000)}
                    valueStyle={{
                      color: "#cf1322",
                    }}
                    prefix={<FallOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} xl={12} span={12}>
            <Card bordered style={cardTop}>
              <Row justify="center">
                <Col xs={24} xl={12} span={12}>
                  <RoomStatistic />
                </Col>
                <Col className="flex-align-center" xs={24} xl={12} span={12}>
                  <p className="statistic-text">Tổng số phòng: 200</p>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col xs={24} xl={12} span={12}>
                  <Row>
                    <p className="statistic-text">Thống kê phòng tháng 12</p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng: <b>100</b> (
                      <ArrowUpOutlined className="icon-increase" />
                      <span className="statistic-text-detail icon-increase"> 42.85 % </span>)
                    </p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng đã có hợp đồng: <b>6</b> (
                      <ArrowDownOutlined className="icon-decrease" />
                      <span className="statistic-text-detail icon-decrease"> 29.85 % </span>)
                    </p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng chưa có hợp đồng: <b>94</b> (
                      <ArrowDownOutlined className="icon-decrease" />
                      <span className="statistic-text-detail icon-decrease"> 30 % </span>)
                    </p>
                  </Row>
                </Col>
                <Col xs={24} xl={12} span={12}>
                  <Row>
                    <p className="statistic-text">Thống kê phòng tháng 11</p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng: <b>70</b>
                    </p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng đã có hợp đồng: <b>10</b>
                    </p>
                  </Row>
                  <Row>
                    <p className="statistic-text-detail">
                      Tổng số phòng chưa có hợp đồng: <b>60</b>
                    </p>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} xl={12} span={12}>
            <Card bordered style={cardBottom}>
              <ContractStatistic />
            </Card>
          </Col>
          <Col xs={24} xl={12} span={12}>
            <Card bordered style={cardBottom}>
              <Row>
                <InvoiceStatistic />
              </Row>
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
};

export default Home;
