import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Select, Button, Row, Col, Checkbox, Tag } from "antd";
import "./listContract.scss";

import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_CONTRACT_URL = "manager/contract/get-contract/1";
const FILTER_CONTRACT_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListContractRenter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState();
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
    <Option value={1}>1 tháng</Option>,
    <Option value={2}>2 tháng</Option>,
    <Option value={3}>3 tháng</Option>,
    <Option value={4}>4 tháng</Option>,
    <Option value={5}>5 tháng</Option>,
    <Option value={6}>6 tháng</Option>,
    <Option value={7}>7 tháng</Option>,
    <Option value={8}>8 tháng</Option>,
    <Option value={9}>9 tháng</Option>,
    <Option value={10}>10 tháng</Option>,
    <Option value={11}>11 tháng</Option>,
    <Option value={12}>1 năm</Option>,
    <Option value={24}>2 năm</Option>,
    <Option value={36}>3 năm</Option>,
    <Option value={48}>4 năm</Option>,
    <Option value={60}>5 năm</Option>,
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
  const getFilterContract = async () => {
    let cookie = localStorage.getItem("Cookie");
    setLoading(true);
    const response = await axios
      .get(FILTER_CONTRACT_URL, {
        params: { duration: duration },
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
  const durationChange = (value) => {
    setDuration(value);
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
                defaultValue={1}
                onChange={durationChange}
              >
                {children}
              </Select>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col offset={10}>
            <Button type="primary" icon={<SearchOutlined />} onClick={getFilterContract}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Search
          placeholder="Tìm kiếm theo tên hợp đồng hoặc tên khách thuê"
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

export default ListContractRenter;
