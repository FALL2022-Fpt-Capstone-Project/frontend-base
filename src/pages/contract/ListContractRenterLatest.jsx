import React, { useEffect, useState } from "react";
import { Input, Table, Select, DatePicker, Tag } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_LATEST_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListContractRenterLatest = ({ duration }) => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllContractLatest();
  }, []);

  const getAllContractLatest = async () => {
    let cookie = localStorage.getItem("Cookie");
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_LATEST_URL, {
        params: { filter: "latest", duration: duration },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Search
          placeholder="Tìm kiếm theo tên hợp đồng hoặc tên khách thuê"
          style={{ marginBottom: 8, width: 400, padding: "10px 0", marginRight: 20 }}
          onSearch={(value) => {
            setTextSearch(value);
          }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
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
            dataIndex: "contract_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return (
                String(record.contract_name).toLowerCase()?.includes(value.toLowerCase()) ||
                String(record.renter_name).toLowerCase()?.includes(value.toLowerCase())
              );
            },
          },
          {
            title: "Tên khách thuê",
            dataIndex: "renter_name",
          },

          {
            title: "Số tiền cọc",
            dataIndex: "contract_deposit",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Tiền phòng",
            dataIndex: "contract_price",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Ngày lập hợp đồng",
            dataIndex: "contract_start_date",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "contract_end_date",
            render: (date) => getFullDate(date),
          },

          {
            title: "Trạng thái hợp đồng",
            dataIndex: "contract_is_disable",
            render: (_, record) => {
              let status;
              if (record.contract_is_disable === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Hợp đồng đã kết thúc
                  </Tag>
                );
              } else if (record.contract_is_disable === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    Hợp đồng còn hiệu lực
                  </Tag>
                );
              }
              return <>{status}</>;
            },
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px" }} />
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

export default ListContractRenterLatest;
