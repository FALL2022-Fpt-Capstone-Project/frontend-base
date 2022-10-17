import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Select } from "antd";
import "./listContract.scss";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_CONTRACT_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListContractRenter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllContract();
  }, []);

  const getAllContract = async () => {
    let cookie = localStorage.getItem("Cookie");
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_URL, {
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
  const getFullDate = (date) => {
    const dateAndTime = date.split("T");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Search
          placeholder="Tìm kiếm"
          style={{ marginBottom: 8, marginRight: 20, width: 400, padding: "10px 0" }}
          onSearch={(value) => {
            setTextSearch(value);
          }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
        <label htmlFor="">Ngày lập hợp đồng</label>
        <RangePicker format={"DD/MM/YYYY"} placeholder={["Từ", "Đến"]} style={{ marginLeft: 20 }} />
        <label
          htmlFor=""
          style={{
            marginLeft: 20,
          }}
        >
          Chu kỳ thanh toán
        </label>
        <Select
          defaultValue={15}
          style={{
            width: 120,
            marginLeft: 20,
          }}
        >
          <Option value={15}>15</Option>
          <Option value={30}>30</Option>
        </Select>
      </div>
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
            dataIndex: "contractName",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.contractName?.includes(value);
            },
          },
          {
            title: "Số tiền cọc",
            dataIndex: "deposit",
          },
          {
            title: "Tiền phòng",
            dataIndex: "price",
          },

          // {
          //   title: "Tên khách thuê",
          //    dataIndex: "building_total_floor",
          // },
          // {
          //   title: "Ngày lập",
          //   // dataIndex: "building_total_floor",
          // },
          {
            title: "Ngày lập hợp đồng",
            dataIndex: "startDate",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            render: (date) => getFullDate(date),
          },

          {
            title: "Chu kỳ thanh toán",
            dataIndex: "paymentCycle",
          },
          // {
          //   title: "Ghi chú",
          //   dataIndex: "address_more_detail",
          // },
          // {
          //   title: "Thao tác",
          //   dataIndex: "action",
          //   render: (_, record) => {
          //     return (
          //       <>
          //         <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
          //         <DeleteOutlined style={{ fontSize: "20px" }} />
          //       </>
          //     );
          //   },
          // },
        ]}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </div>
  );
};

export default ListContractRenter;
