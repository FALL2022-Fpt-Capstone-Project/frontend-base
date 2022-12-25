import React, { useState, useEffect } from "react";
import "./contract.scss";
import { PlusCircleOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card, Modal, Select, Row, Col, Divider } from "antd";
import ListContractRenter from "./ListContractRenter";
import ListContractExpired from "./ListContractExpired";
import ListContractRenterAlmostExpired from "./ListContractRenterAlmostExpired";
import ListContractRenterLatest from "./ListContractRenterLatest";
import axios from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
const { Option } = Select;
const fontSize = {
  fontSize: 15,
};
const COUNT_CONTRACT_GROUP = "manager/statistical/contract/room";

const ContractRenter = () => {
  const [isStatistic, setStatistic] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalOldOpen, setIsModalOldOpen] = useState(false);
  const [isModalEndOpen, setIsModalEndOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const [countAlmostExpired, setcountAlmostExpired] = useState("");
  const [countLatest, setcountLatest] = useState("");
  const [countExpired, setcountExpired] = useState("");
  const children = [
    <Option value={1}>1 tháng</Option>,
    <Option value={4}>4 tháng</Option>,
    <Option value={6}>6 tháng</Option>,
    <Option value={12}>1 năm</Option>,
  ];
  const showStatistic = () => {
    setStatistic(!isStatistic);
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
          setcountAlmostExpired(res.data.data?.almost_expired_contract);
          setcountExpired(res.data.data?.expired_contract);
          setcountLatest(res.data.data?.latest_contract);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCountContract();
  }, [duration]);
  let cookie = localStorage.getItem("Cookie");

  return (
    <MainLayout title={"Quản lý hợp đồng cho thuê"}>
      <div className="btn-contract">
        <Button
          icon={<PieChartOutlined style={fontSize} />}
          size="middle"
          className="button-collapse"
          onClick={showStatistic}
        >
          Thống kê hợp đồng
        </Button>
        <Link to="/contract-renter/create">
          <Button type="primary" icon={<PlusCircleOutlined style={fontSize} />} size="middle" className="button-add">
            Thêm mới hợp đồng cho thuê
          </Button>
        </Link>
      </div>

      {isStatistic && (
        <div className="contract-statistic">
          <div className="contract-card">
            <Row>
              <Col lg={6} xs={24}>
                <Card
                  title="Số lượng hợp đồng mới được mở"
                  style={{
                    width: 300,
                    marginRight: 20,
                    height: 130,
                  }}
                >
                  <span>{countLatest} hợp đồng</span>
                  <Button type="primary" onClick={showModalNew} style={{ marginLeft: "10px" }}>
                    Xem chi tiết
                  </Button>
                </Card>
              </Col>
              <Col lg={6} xs={24}>
                <Card
                  title="Số lượng hợp đồng sắp hết hạn"
                  style={{
                    width: 300,
                    height: 130,
                  }}
                >
                  <span>{countAlmostExpired} hợp đồng</span>
                  <Button type="primary" onClick={showModalOld} style={{ marginLeft: "10px" }}>
                    Xem chi tiết
                  </Button>
                </Card>
              </Col>
              <Col lg={6} xs={24}>
                <Card
                  title="Số lượng hợp đồng đã kết thúc"
                  style={{
                    width: 300,
                    marginRight: 20,
                    height: 130,
                  }}
                >
                  <span>{countExpired} hợp đồng</span>
                  <Button type="primary" onClick={showModalEnd} style={{ marginLeft: "10px" }}>
                    Xem chi tiết
                  </Button>
                </Card>
              </Col>
              <Col lg={6} xs={24}>
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
      )}
      <div className="site-layout-background">
        <ListContractRenter />
      </div>
      <Modal
        title={<h2>Số lượng hợp đồng mới được mở</h2>}
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
        title={<h2>Số lượng hợp đồng sắp hết hạn</h2>}
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
        title={<h2>Số lượng hợp đồng đã kết thúc</h2>}
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
    </MainLayout>
  );
};

export default ContractRenter;
