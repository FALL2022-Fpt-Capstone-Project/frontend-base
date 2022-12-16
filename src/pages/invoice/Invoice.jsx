import { Button, Tabs } from "antd";
import React, { useState, useEffect } from "react";
import "./invoice.scss";
import ListInvoice from "./ListInvoice";
import { PlusCircleOutlined } from "@ant-design/icons";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
import ListPayment from "./ListPayment";

const Invoice = () => {
  const [button1, setButton1] = useState(
    <Link to="/invoice/create-invoice-auto">
      <Button type="primary" icon={<PlusCircleOutlined />} size="middle" className="button-add">
        Tạo mới nhanh hoá đơn thu
      </Button>
    </Link>
  );
  const [button2, setButton2] = useState(
    <Link to="/invoice/create-invoice-auto">
      <Button type="primary" icon={<PlusCircleOutlined />} size="middle" className="button-add">
        Tạo mới hoá đơn chi
      </Button>
    </Link>
  );
  const [key, setKey] = useState();
  const onChange = (key) => {
    console.log(key);
    setKey(key);
  };

  return (
    <div className="invoice">
      <MainLayout title="Quản lý hoá đơn" {...(key === 1 ? { button: button1 } : { button: button2 })}>
        <Tabs defaultActiveKey="1" size="large" onChange={onChange}>
          <Tabs.TabPane tab="Hoá đơn thu" key="1">
            <ListInvoice />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Hoá đơn chi" key="2">
            <ListPayment />
          </Tabs.TabPane>
        </Tabs>
      </MainLayout>
    </div>
  );
};

export default Invoice;
