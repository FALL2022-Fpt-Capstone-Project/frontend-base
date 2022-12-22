import React, { useState } from "react";
import "./building.scss";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CreateBuilding from "./CreateBuilding";
import ListBuilding from "./ListBuilding";
import MainLayout from "../../components/layout/MainLayout";
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
