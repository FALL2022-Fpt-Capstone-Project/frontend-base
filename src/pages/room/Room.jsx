import "./room.scss";
import React from "react";
import ListRoom from "./ListRoom";
import MainLayout from "../../components/layout/MainLayout";

function room(props) {
  return (
    <MainLayout title="Quản lý danh sách phòng">
      <ListRoom />
    </MainLayout>
  );
}

export default room;
