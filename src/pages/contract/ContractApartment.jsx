import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { Button, Layout } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import ListContractApartment from "./ListContractApartment";
import "./contract.scss";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const fontSize = {
  fontSize: 15,
};
const ContractApartment = () => {
  return (
    <div className="contract">
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vh",
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p className="header-title">Quản lý hợp đồng đi thuê</p>
          </Header>
          <Content
            className="layout-content"
            style={{
              margin: "10px 16px",
            }}
          >
            <Breadcrumbs />
            <div className="btn-contract">
              <Button
                type="primary"
                icon={<PlusCircleOutlined style={fontSize} />}
                size="middle"
                className="button-add"
                href="/contract-apartment/create"
              >
                Thêm mới hợp đồng đi thuê
              </Button>
            </div>
            <div
              className="site-layout-background"
              style={{
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
