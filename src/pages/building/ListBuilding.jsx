import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_EMPLOYEE_URL = "manager/get-list-building";
const ListBuilding = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    let cookie = localStorage.getItem("Cookie");
    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataSource(res.data.body);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

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
            title: "Tên toà",
            dataIndex: "building_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.building_name.includes(value);
            },
          },
          {
            title: "Tổng số tầng",
            dataIndex: "building_total_floor",
          },
          {
            title: "Tổng số phòng",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Tổng số phòng trống",
            // dataIndex: "building_total_floor",
          },
          {
            title: "Tổng số số người",
            // dataIndex: "building_total_floor",
          },
          {
            title: "Địa chỉ",
            dataIndex: "building_address_more_detail",
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <DeleteOutlined style={{ fontSize: "20px" }} />
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
