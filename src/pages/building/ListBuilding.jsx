import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_EMPLOYEE_URL = "manager/get-list-building";
const ListBuilding = () => {
  const [dataSource, setDataSource] = useState([
    {
      building_name: "Trọ xanh",
      building_total_floor: "6/10",
      building_total_rooms: "40/80",
      building_empty_rooms: "3",
      total_people: "100",
      address_more_detail: "Đông Du, Đào Viên, Quế Võ,Bắc Ninh",
      description: "Toà nhà nằm ở hướng Đông Nam",
    },
    {
      building_name: "Trọ sạch",
      building_total_floor: "7/10",
      building_total_rooms: "50/80",
      building_empty_rooms: "9",
      total_people: "160",
      address_more_detail: "Đông Du, Đào Viên, Quế Võ,Bắc Ninh",
      description: "Toà nhà nằm ở hướng Đông Nam",
    },
  ]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getAllEmployees();
  // }, []);

  // const getAllEmployees = async () => {
  //   let cookie = localStorage.getItem("Cookie");
  //   setLoading(true);
  //   const response = await axios
  //     .get(LIST_EMPLOYEE_URL, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         // "Access-Control-Allow-Origin": "*",
  //         Authorization: `Bearer ${cookie}`,
  //       },
  //       // withCredentials: true,
  //     })
  //     .then((res) => {
  //       setDataSource(res.data.body);
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   setLoading(false);
  // };

  return (
    <div>
      <Search
        placeholder="Tìm kiếm"
        style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
        onSearch={(value) => {
          setTextSearch(value);
        }}
        onChange={(e) => {
          setTextSearch(e.target.value);
        }}
      />
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "Tên chung cư",
            dataIndex: "building_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.building_name.includes(value);
            },
          },
          {
            title: "Số lượng tầng đã thuê",
            dataIndex: "building_total_floor",
          },
          {
            title: "Số lượng phòng đã thuê",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Số lượng phòng trống",
            dataIndex: "building_empty_rooms",
          },
          {
            title: "Số lượng người",
            dataIndex: "total_people",
          },
          {
            title: "Địa chỉ",
            dataIndex: "address_more_detail",
          },
          {
            title: "Mô tả",
            dataIndex: "description",
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </div>
  );
};

export default ListBuilding;
