import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { PlusOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card, Modal, Select, Row, Col } from "antd";
import ListContractRenter from "./ListContractRenter";
import ListContractExpired from "./ListContractExpired";
import ListContractRenterAlmostExpired from "./ListContractRenterAlmostExpired";
import ListContractRenterLatest from "./ListContractRenterLatest";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
const { Option } = Select;
const { Content, Sider, Header } = Layout;

const COUNT_CONTRACT_GROUP = "manager/contract/statistical/get-contract/1";

const ContractRenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalOldOpen, setIsModalOldOpen] = useState(false);
  const [isModalEndOpen, setIsModalEndOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const [countAlmostExpired, setcountAlmostExpired] = useState("");
  const [countLatest, setcountLatest] = useState("");
  const [countExpired, setcountExpired] = useState("");
  const { auth } = useAuth();
  const children = [
    <Option value={1}>1 tháng</Option>,
    <Option value={4}>4 tháng</Option>,
    <Option value={6}>6 tháng</Option>,
    <Option value={12}>1 năm</Option>,
  ];
  const showModalNew = () => {
    setIsModalNewOpen(true);
  };
  const showModalOld = () => {
    setIsModalOldOpen(true);
  };
  const showModalEnd = () => {
    setIsModalEndOpen(true);
  };
  const durationChange = (value) => {
    console.log(value);
    setDuration(value);
    getCountContract();
  };

  useEffect(() => {
    getCountContract();
  }, []);
  let cookie = localStorage.getItem("Cookie");
  const getCountContract = async () => {
    const response = await axios
      .get(COUNT_CONTRACT_GROUP, {
        params: { duration: duration },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        console.log(res);
        setcountAlmostExpired(res.data.body?.almost_expired_contract);
        setcountExpired(res.data.body?.expired_contract);
        setcountLatest(res.data.body?.latest_contract);
        console.log(res.data.body?.almost_expired_contract);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                className="button-add"
                href="/contract-renter/create"
              >
                Thêm hợp đồng
              </Button>
            </div>
            {isOpen && (
              <div className="contract-statistic">
                <div className="contract-card">
                  <Row>
                    <Col span={6}>
                      <Card
                        title="Số lượng hợp đồng mới được mở"
                        style={{
                          width: 300,
                          marginRight: 20,
                          height: 175,
                        }}
                      >
                        <span>{countLatest} hợp đồng</span>
                        <Button type="primary" onClick={showModalNew} style={{ marginLeft: "10px" }}>
                          Xem chi tiết
                        </Button>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        title="Số lượng hợp đồng đã kết thúc"
                        style={{
                          width: 300,
                          marginRight: 20,
                          height: 175,
                        }}
                      >
                        <span>{countExpired} hợp đồng</span>
                        <Button type="primary" onClick={showModalEnd} style={{ marginLeft: "10px" }}>
                          Xem chi tiết
                        </Button>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        title="Số lượng hợp đồng sắp hết hạn"
                        style={{
                          width: 300,
                          height: 175,
                        }}
                      >
                        <span>{countAlmostExpired} hợp đồng</span>
                        <Button type="primary" onClick={showModalOld} style={{ marginLeft: "10px" }}>
                          Xem chi tiết
                        </Button>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <label htmlFor="" style={{ margin: "120px 10px 0 20px", fontSize: "14px", display: "block" }}>
                        Chọn thời gian thống kê dữ liệu hợp đồng
                      </label>
                      <Select
                        style={{
                          width: "80%",
                          marginLeft: "20px",
                        }}
                        defaultValue={1}
                        onChange={durationChange}
                      >
                        {children}
                      </Select>
                    </Col>
                  </Row>
                </div>
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
          <Modal
            title="Số lượng hợp đồng mới được mở"
            // style={{ maxwidth: 900 }}
            width={1200}
            visible={isModalNewOpen}
            onOk={() => setIsModalNewOpen(false)}
            onCancel={() => setIsModalNewOpen(false)}
          >
            <ListContractRenterLatest duration={duration} />
          </Modal>
          <Modal
            title="Số lượng hợp đồng sắp hết hạn"
            // style={{ maxwidth: 900 }}
            width={1200}
            visible={isModalOldOpen}
            onOk={() => setIsModalOldOpen(false)}
            onCancel={() => setIsModalOldOpen(false)}
          >
            <ListContractRenterAlmostExpired duration={duration} />
          </Modal>
          <Modal
            title="Số lượng hợp đồng đã kết thúc"
            // style={{ maxwidth: 900 }}
            width={1200}
            visible={isModalEndOpen}
            onOk={() => setIsModalEndOpen(false)}
            onCancel={() => setIsModalEndOpen(false)}
          >
            <ListContractExpired duration={duration} />
          </Modal>
        </Layout>
      </Layout>
    </div>
  );
};

export default ContractRenter;
