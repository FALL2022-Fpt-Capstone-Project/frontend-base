import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Select, Button, Row, Col, Checkbox } from "antd";
import "./listContract.scss";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_CONTRACT_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListContractRenter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const options = [
    {
      label: "Hợp đồng còn hiệu lực",
      value: "newContract",
    },
    {
      label: "Hợp đồng đã kết thúc",
      value: "endContract",
    },
  ];
  const children = [
    <Option value={30}>1 tháng</Option>,
    <Option value={120}>2 tháng</Option>,
    <Option value={180}>3 tháng</Option>,
    <Option value={365}>4 tháng</Option>,
    <Option value={365}>5 tháng</Option>,
    <Option value={365}>6 tháng</Option>,
    <Option value={365}>7 tháng</Option>,
    <Option value={365}>8 tháng</Option>,
    <Option value={365}>9 tháng</Option>,
    <Option value={365}>10 tháng</Option>,
    <Option value={365}>11 tháng</Option>,
    <Option value={365}>1 năm</Option>,
    <Option value={365}>2 năm</Option>,
    <Option value={365}>3 năm</Option>,
    <Option value={365}>4 năm</Option>,
    <Option value={365}>5 năm</Option>,
  ];

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
  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };
  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col className="gutter-row" span={8}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Tìm kiếm hợp đồng trong khoảng thời gian
              </label>
            </Row>
            <Row>
              <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} onChange={dateChange} />
            </Row>
          </Col>
          <Col className="gutter-row" span={8}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Tìm kiếm theo trạng thái hợp đồng
              </label>
            </Row>
            <Row>
              <Checkbox.Group options={options} />
            </Row>
          </Col>
          <Col className="gutter-row" span={6}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Tìm kiếm theo thời gian (Tháng, năm)
              </label>
            </Row>
            <Row>
              <Select
                placeholder="Tìm kiếm theo thời gian (Tháng, năm)"
                style={{
                  width: "100%",
                }}
                defaultValue={30}
              >
                {children}
              </Select>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col offset={10}>
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Search
          placeholder="Tìm kiếm theo tên hợp đồng"
          style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
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
            dataIndex: "contractName",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.contractName?.includes(value);
            },
          },
          {
            title: "Tên khách thuê",
            dataIndex: "building_total_floor",
          },

          {
            title: "Số tiền cọc",
            dataIndex: "deposit",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Tiền phòng",
            dataIndex: "price",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
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
            title: "Trạng thái hợp đồng",
            dataIndex: "paymentCycle",
          },
          // {
          //   title: "Ghi chú",
          //   dataIndex: "address_more_detail",
          // },
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

export default ListContractRenter;
