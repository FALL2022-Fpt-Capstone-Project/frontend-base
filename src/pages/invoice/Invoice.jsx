import { Tabs } from "antd";
import React from "react";
import "./invoice.scss";
import ListInvoice from "./ListInvoice";
import MainLayout from "../../components/layout/MainLayout";
import ListPayment from "./ListPayment";

const Invoice = () => {
  return (
    <div className="invoice">
      <MainLayout title="Quản lý hoá đơn">
        <Tabs defaultActiveKey="1" size="large">
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
