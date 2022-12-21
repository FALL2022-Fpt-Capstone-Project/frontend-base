import React from "react";
import "./contract.scss";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import ListContractApartment from "./ListContractApartment";
import "./contract.scss";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
const fontSize = {
  fontSize: 15,
};
const ContractApartment = () => {
  return (
    <MainLayout
      title={"Quản lý hợp đồng đi thuê"}
      button={
        <Link to="/contract-apartment/create">
          <Button type="primary" icon={<PlusCircleOutlined style={fontSize} />} size="middle" className="button-add">
            Thêm mới hợp đồng đi thuê
          </Button>
        </Link>
      }
    >
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
