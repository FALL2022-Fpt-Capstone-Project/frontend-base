import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { PlusOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Layout, Card, Modal } from "antd";
import ListContractRenter from "./ListContractRenter";
import ListContractExpired from "./ListContractExpired";
import ListContractRenterAlmostExpired from "./ListContractRenterAlmostExpired";
import ListContractRenterLatest from "./ListContractRenterLatest";
const { Content, Sider, Header } = Layout;
const ContractRenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalOldOpen, setIsModalOldOpen] = useState(false);
  const [isModalEndOpen, setIsModalEndOpen] = useState(false);
  const showModalNew = () => {
    setIsModalNewOpen(true);
  };
  const showModalOld = () => {
    setIsModalOldOpen(true);
  };
  const showModalEnd = () => {
    setIsModalEndOpen(true);
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
              <Button type="primary" icon={<PlusOutlined />} size="middle" className="button-add">
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
                    {/* <p>100 hợp đồng</p> */}
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
                    {/* <p>100 hợp đồng</p> */}
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
                    {/* <p>100 hợp đồng</p> */}
                    <Button type="primary" onClick={showModalOld}>
                      Xem chi tiết
                    </Button>
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
