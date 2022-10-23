import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { PlusOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card, Modal, Select } from "antd";
import ListContractRenter from "./ListContractRenter";
import ListContractExpired from "./ListContractExpired";
import ListContractRenterAlmostExpired from "./ListContractRenterAlmostExpired";
import ListContractRenterLatest from "./ListContractRenterLatest";
import axios from "../../api/axios";
const { Option } = Select;
const { Content, Sider, Header } = Layout;

const LIST_CONTRACT_EXPIRED_URL = "manager/contract/get-contract/1?filter=expired";
const LIST_CONTRACT_LATEST_URL = "manager/contract/get-contract/1?filter=latest";
const LIST_CONTRACT_ALMOST_EXPIRED_URL = "manager/contract/get-contract/1?filter=almostExpired";

const ContractRenter = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalOldOpen, setIsModalOldOpen] = useState(false);
  const [isModalEndOpen, setIsModalEndOpen] = useState(false);
  const [countExpired, setcountExpired] = useState("");
  const [countAlmostExpired, setcountAlmostExpired] = useState("");
  const [countLatest, setcountLatest] = useState("");
  const children = [
    <Option value={30}>1 tháng</Option>,
    <Option value={120}>4 tháng</Option>,
    <Option value={180}>6 tháng</Option>,
    <Option value={365}>1 năm</Option>,
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
  useEffect(() => {
    getAllContractExpired();
  }, []);

  const getAllContractExpired = async () => {
    let cookie = localStorage.getItem("Cookie");
    const response = await axios
      .get(LIST_CONTRACT_EXPIRED_URL, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        let a = res.data.body.length;
        setcountExpired(a);
        console.log(countExpired);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllContractLatest();
  }, []);

  const getAllContractLatest = async () => {
    let cookie = localStorage.getItem("Cookie");
    const response = await axios
      .get(LIST_CONTRACT_LATEST_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setcountLatest(res.data.body.length);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllContractAlmostExpired();
  }, []);

  const getAllContractAlmostExpired = async () => {
    let cookie = localStorage.getItem("Cookie");
    const response = await axios
      .get(LIST_CONTRACT_ALMOST_EXPIRED_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setcountAlmostExpired(res.data.body.length);
        console.log(res);
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
                  <Card
                    title="Số lượng hợp đồng mới được mở"
                    style={{
                      width: 300,
                      marginRight: 20,
                    }}
                  >
                    <p>{countLatest} hợp đồng</p>
                    <Button type="primary" onClick={showModalNew}>
                      Xem chi tiết
                    </Button>
                  </Card>
                  <Card
                    title="Số lượng hợp đồng đã kết thúc"
                    style={{
                      width: 300,
                      marginRight: 20,
                    }}
                  >
                    <p>{countExpired} hợp đồng</p>
                    <Button type="primary" onClick={showModalEnd}>
                      Xem chi tiết
                    </Button>
                  </Card>
                  <Card
                    title="Số lượng hợp đồng sắp hết hạn"
                    style={{
                      width: 300,
                    }}
                  >
                    <p>{countAlmostExpired} hợp đồng</p>
                    <Button type="primary" onClick={showModalOld}>
                      Xem chi tiết
                    </Button>
                  </Card>
                </div>
                <label htmlFor="" style={{ margin: "0 10px 0 20px", fontSize: "14px" }}>
                  Dữ liệu hợp đồng trong:
                </label>
                <Select
                  placeholder="Tìm kiếm theo thời gian"
                  style={{
                    width: "10%",
                  }}
                  defaultValue={30}
                >
                  {children}
                </Select>
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
            <ListContractRenterLatest />
          </Modal>
          <Modal
            title="Số lượng hợp đồng sắp hết hạn"
            // style={{ maxwidth: 900 }}
            width={1200}
            visible={isModalOldOpen}
            onOk={() => setIsModalOldOpen(false)}
            onCancel={() => setIsModalOldOpen(false)}
          >
            <ListContractRenterAlmostExpired />
          </Modal>
          <Modal
            title="Số lượng hợp đồng đã kết thúc"
            // style={{ maxwidth: 900 }}
            width={1200}
            visible={isModalEndOpen}
            onOk={() => setIsModalEndOpen(false)}
            onCancel={() => setIsModalEndOpen(false)}
          >
            <ListContractExpired />
          </Modal>
        </Layout>
      </Layout>
    </div>
  );
};

export default ContractRenter;
