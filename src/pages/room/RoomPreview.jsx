import "./room.scss";
import React from "react";
import Preview from "./Preview";
import MainLayout from "../../components/layout/MainLayout";

function RoomPreview(props) {
    return (
        <MainLayout title="Xem trước tạo mới phòng nhanh">
            <Preview />
        </MainLayout>
    );
}

export default RoomPreview;
