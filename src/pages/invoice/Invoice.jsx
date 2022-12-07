import { Button } from "antd";
import React, { useState } from "react";
import "./invoice.scss";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";
import MainLayout from "../../components/layout/MainLayout";

const Invoice = () => {
  return (
    <div className="invoice">
      <MainLayout
        title="Quản lý hoá đơn"
        button={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="middle"
            href="/invoice/create-invoice-auto"
            className="button-add"
          >
            Tạo mới nhanh hoá đơn
          </Button>
        }
      >
        <ListInvoice />
      </MainLayout>
    </div>
  );
};

export default Invoice;
