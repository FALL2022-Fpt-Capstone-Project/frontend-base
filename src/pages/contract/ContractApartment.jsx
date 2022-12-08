import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import { Button, Divider, Layout } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import ListContractApartment from "./ListContractApartment";
import "./contract.scss";
import Breadcrumbs from "../../components/BreadCrumb ";
import MainLayout from "../../components/layout/MainLayout";
const { Content, Sider, Header } = Layout;
const fontSize = {
  fontSize: 15,
};
const ContractApartment = () => {
  return (
    <MainLayout title={"Quản lý hợp đồng đi thuê"}>
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
    </MainLayout>
  );
};

export default ContractApartment;
