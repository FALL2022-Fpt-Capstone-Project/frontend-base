import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./building.scss";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Layout, Modal } from "antd";
import CreateBuilding from "./CreateBuilding";
import ListBuilding from "./ListBuilding";
import Breadcrumbs from "../../components/BreadCrumb ";
import MainLayout from "../../components/layout/MainLayout";
const { Content, Sider, Header } = Layout;
const Building = () => {
  const [createBuilding, setCreateBuilding] = useState(false);
  const onClickCreateBuilding = () => {
    setCreateBuilding(true);
  };

  return (
    <div className="building">
      <MainLayout
        title="Quản lý chung cư"
        button={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="middle"
            onClick={onClickCreateBuilding}
            className="button-add"
          >
            Thêm chung cư
          </Button>
        }
      >
        <ListBuilding />
      </MainLayout>
      <CreateBuilding visible={createBuilding} close={setCreateBuilding} />
    </div>
  );
};

export default Building;
