import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Search } = Input;

const ListContractRenter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
          // {
          //   title: 'STT',
          //   key: 'index',
          //   render: (text, record, index) => index,
          // },
          {
            title: "Tên hợp đồng",
            dataIndex: "building_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.building_name.includes(value);
            },
          },
          {
            title: "Số tiền cọc",
            dataIndex: "building_total_floor",
          },
          {
            title: "Tiền phòng",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Tên khách thuê",
            // dataIndex: "building_total_floor",
          },
          {
            title: "Ngày lập",
            // dataIndex: "building_total_floor",
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "address_more_detail",
          },
          {
            title: "Ngày vào ở",
            dataIndex: "address_more_detail",
          },
          {
            title: "Chu kỳ thu",
            dataIndex: "address_more_detail",
          },
          {
            title: "Ghi chú",
            dataIndex: "address_more_detail",
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
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

export default ListContractRenter;
