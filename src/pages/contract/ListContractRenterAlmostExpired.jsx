import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";

import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_ALMOST_EXPIRED_URL = "manager/contract/get-contract/1?filter=almostExpired";
const ListContractRenterAlmostExpired = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllContractAlmostExpired();
  }, []);

  const getAllContractAlmostExpired = async () => {
    let cookie = localStorage.getItem("Cookie");
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_ALMOST_EXPIRED_URL, {
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
          //   // dataIndex: "building_total_floor",
          // },
          {
            title: "số người trong phòng",
            dataIndex: "renters",
          },
          // {
          //   title: "Ngày lập",
          //   // dataIndex: "building_total_floor",
          // },
          {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ngày vào ở",
            dataIndex: "startDate",
            render: (date) => getFullDate(date),
          },
          {
            title: "Chu kỳ thu",
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

export default ListContractRenterAlmostExpired;
