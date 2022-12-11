import { Button } from "antd";
import React, { useState } from "react";
import "./invoice.scss";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";

const Invoice = () => {
  return (
    <div className="invoice">
      <MainLayout
        title="Quản lý hoá đơn"
        button={
          <Link to="/invoice/create-invoice-auto">
            <Button type="primary" icon={<PlusCircleOutlined />} size="middle" className="button-add">
              Tạo mới nhanh hoá đơn
            </Button>
          </Link>
        }
      >
        <ListInvoice />
      </MainLayout>
    </div>
  );
};

export default Invoice;
