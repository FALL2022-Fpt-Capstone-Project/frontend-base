import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { PlusCircleOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card, Modal, Select, Row, Col } from "antd";
import ListContractRenter from "./ListContractRenter";
import ListContractExpired from "./ListContractExpired";
import ListContractRenterAlmostExpired from "./ListContractRenterAlmostExpired";
import ListContractRenterLatest from "./ListContractRenterLatest";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Option } = Select;
const { Content, Sider, Header } = Layout;
const fontSize = {
  fontSize: 15,
};
const COUNT_CONTRACT_GROUP = "manager/contract/statistical/get-contract/1";

const ContractRenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalOldOpen, setIsModalOldOpen] = useState(false);
  const [isModalEndOpen, setIsModalEndOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const [countAlmostExpired, setcountAlmostExpired] = useState("");
  const [countLatest, setcountLatest] = useState("");
  const [countExpired, setcountExpired] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const children = [
    <Option value={1}>1 tháng</Option>,
    <Option value={4}>4 tháng</Option>,
    <Option value={6}>6 tháng</Option>,
    <Option value={12}>1 năm</Option>,
  ];
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModalNew = () => {
    setIsModalNewOpen(true);
  };
  const showModalOld = () => {
    setIsModalOldOpen(true);
  };
  const showModalEnd = () => {
    setIsModalEndOpen(true);
  };
  const durationChange = async (value) => {
    console.log(value);
    setDuration(value);
  };

  useEffect(() => {
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
    getCountContract();
  }, [duration]);
  let cookie = localStorage.getItem("Cookie");

  return (
    <div className="contract">
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vh",
        }}
      >
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p className="header-title">Quản lý hợp đồng cho thuê</p>
          </Header>
          <Content
            className="layout-content"
            style={{
              margin: "10px 10px",
            }}
          >
            <Breadcrumbs />
            <div className="btn-contract">
              <Button
                icon={<PieChartOutlined style={fontSize} />}
                size="middle"
                className="button-collapse"
                onClick={showModal}
              >
                Thống kê hợp đồng
              </Button>
              <Button
                type="primary"
                icon={<PlusCircleOutlined style={fontSize} />}
                size="middle"
                className="button-add"
                href="/contract-renter/create"
              >
                Thêm hợp đồng
              </Button>
            </div>
            <Modal
              title="Thống kê hợp đồng"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              cancelText={"Huỷ"}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Quay lại
                </Button>,
              ]}
              width={1200}
            >
              <div className="contract-statistic">
                <div className="contract-card">
                  <Row>
                    <Col span={6}>
                      <Card
                        title="Số lượng hợp đồng mới được mở"
                        style={{
                          width: 300,
                          marginRight: 20,
                          height: 130,
                        }}
                      >
                        {/* <span>{countLatest} hợp đồng</span> */}
                        <span>7 hợp đồng</span>
                        <Button type="primary" onClick={showModalNew} style={{ marginLeft: "10px" }}>
                          Xem chi tiết
                        </Button>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        title="Số lượng hợp đồng sắp hết hạn"
                        style={{
                          width: 300,
                          height: 130,
                        }}
                      >
                        {/* <span>{countAlmostExpired} hợp đồng</span> */}
                        <span>0 hợp đồng</span>
                        <Button type="primary" onClick={showModalOld} style={{ marginLeft: "10px" }}>
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
                          height: 130,
                        }}
                      >
                        {/* <span>{countExpired} hợp đồng</span> */}
                        <span>2 hợp đồng</span>
                        <Button type="primary" onClick={showModalEnd} style={{ marginLeft: "10px" }}>
                          Xem chi tiết
                        </Button>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <label htmlFor="" style={{ margin: "55px 10px 0 20px", fontSize: "14px", display: "block" }}>
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
            </Modal>

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
            footer={[
              <Button key="back" onClick={() => setIsModalNewOpen(false)}>
                Quay lại
              </Button>,
            ]}
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
            footer={[
              <Button key="back" onClick={() => setIsModalOldOpen(false)}>
                Quay lại
              </Button>,
            ]}
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
            footer={[
              <Button key="back" onClick={() => setIsModalEndOpen(false)}>
                Quay lại
              </Button>,
            ]}
          >
            <ListContractExpired duration={duration} />
          </Modal>
        </Layout>
      </Layout>
    </div>
  );
};

export default ContractRenter;
