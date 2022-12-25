import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Row, Select } from "antd";
import axios from "../../api/axios";
const ROOM_STATUS = "manager/statistical/room/status";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Trạng thái phòng",
      font: {
        size: 21,
      },
      color: "#868d96",
    },
  },
};

const RoomStatus = ({ dataGroup, dataRoomStatus = [] }) => {
  let cookie = localStorage.getItem("Cookie");
  const [roomStatus, setRoomStatus] = useState([]);

  const getRoomStatus = async (groupId = null) => {
    await axios
      .get(ROOM_STATUS, {
        params: {
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setRoomStatus(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const data = {
    labels: ["Phòng còn trống", "Phòng đã thuê"],
    datasets: [
      {
        data:
          roomStatus.length === 0
            ? [dataRoomStatus?.total_empty_room, dataRoomStatus?.total_rented_room]
            : [roomStatus?.total_empty_room, roomStatus?.total_rented_room],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Row>
        <Select
          defaultValue={""}
          placeholder="Chọn chung cư"
          className="select-w-100"
          showSearch
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.trim().toLowerCase())}
          options={[
            ...dataGroup?.map((group) => {
              return { label: group.group_name, value: group.group_id };
            }),
            {
              label: "Tất cả chung cư",
              value: "",
            },
          ]}
          onChange={(e) => {
            getRoomStatus(e);
          }}
        />
      </Row>
      <div style={{ width: "100%", height: "330px", display: "flex", justifyContent: "center" }}>
        <Pie data={data} options={options} />
      </div>
    </>
  );
};

export default RoomStatus;
