import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { Button, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ListContractApartment from "./ListContractApartment";
import "./contract.scss";
const { Content, Sider, Header } = Layout;

const ContractApartment = () => {
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
            <p className="header-title">Quản lý hợp đồng chung cư mini/căn hộ</p>
          </Header>
          <Content
            className="layout-content"
            style={{
              margin: "10px 10px",
            }}
          >
            <div className="btn-contract">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                className="button-add"
                href="/contract-apartment/create"
              >
                Thêm hợp đồng
              </Button>
            </div>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              <ListContractApartment />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ContractApartment;
