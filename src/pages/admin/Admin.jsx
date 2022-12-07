import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./admin.scss";
import ListStaff from "./ListStaff";
import CreateStaff from "./CreateStaff";
import MainLayout from "../../components/layout/MainLayout";

const Admin = () => {
  const [createStaff, setCreateStaff] = useState(false);
  const onClickCreateStaff = () => {
    setCreateStaff(true);
  };
  return (
    <div>
      <div className="admin">
        <MainLayout
          title="Quản lý nhân viên"
          button={
            <Button
              type="primary"
              onClick={onClickCreateStaff}
              icon={<PlusCircleOutlined />}
              size="middle"
              className="button-add"
            >
              Thêm mới nhân viên
            </Button>
          }
        >
          <ListStaff />
        </MainLayout>
      </div>
      <CreateStaff visible={createStaff} close={setCreateStaff} />
    </div>
  );
};

export default Admin;
