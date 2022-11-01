import React, { useEffect, useState } from "react";

import { Input, Table, Tag, Row, Checkbox, Tabs, Col, InputNumber, Select, DatePicker, Button } from "antd";
import { EyeOutlined, EditOutlined, FilterOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
import moment from 'moment';


const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "";
const { Column, ColumnGroup } = Table;


const optionContract = [
  {
    label: "Hợp đồng còn hiệu lực",
    value: "1",
  },
  {
    label: "Hợp đồng đã kết thúc",
    value: "2",
  },
];
const optionRoom = [
  {
    label: "Đang trống",
    value: "1",
  },
  {
    label: "Đã hết phòng",
    value: "2",
  },
];

const ListContractApartment = () => {

  const dateFormat = 'DD/MM/YYYY';
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewContract, setViewContract] = useState(false);
  const dateTimeSelect = [];
  for (let i = 1; i < 17; i++) {
    if (i < 12) {
      dateTimeSelect.push({
        id: i,
        timeName: `${i} tháng`,
        timeValue: i,
      });
    } else {
      dateTimeSelect.push({
        id: i,
        timeName: `${i % 11} năm`,
        timeValue: (i % 11) * 12,
      });
    }
  }

  useEffect(() => {
    getAllContractExpired();
  }, []);
  let cookie = localStorage.getItem("Cookie");
  const getAllContractExpired = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_APARTMENT_URL, {
        params: {},
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
  const data = [
    {
      key: "1",

      apartmentName: "Trọ xanh",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đã hết phòng"
    },
    {
      key: "2",
      apartmentName: "Trọ xanh",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống"
    },
    {
      key: "3",
      apartmentName: "Trọ xanh",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống"

    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col>
              <Search
                placeholder="Nhập tên chung cư/căn hộ để tìm kiếm"
                style={{ marginBottom: '3%', width: 400 }}
                onSearch={(value) => {
                  setTextSearch(value);
                }}
                onChange={(e) => {
                  setTextSearch(e.target.value);
                }}
              />
            </Col>
            <Col>
              <FilterOutlined style={{ fontSize: "150%" }} />
              <span style={{ fontSize: "16px", }}>Bộ lọc: </span>
              <Checkbox.Group options={optionContract} />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <Row>
                <span style={{ fontSize: "16px", }}>Giá thuê: </span>
              </Row>
              <Row>
                <Select placeholder="Chọn khoảng giá" style={{ width: '100%' }}>
                  <Select.Option>1.000.000đ - 10.000.0000đ</Select.Option>
                </Select>
              </Row>
              <Row gutter={12} style={{ marginTop: '2%' }}>
                <Col span={12}>
                  <Row>Từ: </Row>
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    style={{ width: '100%' }}
                    placeholder="Từ" controls={false} />
                </Col>
                <Col span={12}>
                  <Row>Đến: </Row>
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    style={{ width: '100%' }}
                    placeholder="Đến"
                    controls={false} />
                </Col>
              </Row>
            </Col>
            <Col className="gutter-row" span={6}>
              <Row>
                <span style={{ fontSize: "16px", }}>Tên chung cư mini/căn hộ: </span>
              </Row>
              <Row>
                <Search
                  placeholder="Nhập tên chung cư/căn hộ để tìm kiếm"
                  style={{ marginBottom: '2%', width: '100%' }}
                  onSearch={(value) => {
                    setTextSearch(value);
                  }}
                  onChange={(e) => {
                    setTextSearch(e.target.value);
                  }}
                />
              </Row>
            </Col>
            <Col className="gutter-row" span={6}>
              <Row>
                <span style={{ fontSize: "16px", }}>Thời gian: </span>
              </Row>
              <Row>
                <Select placeholder="Chọn khoảng thời gian" style={{ width: '100%' }}>
                  {dateTimeSelect.map((obj, index) => {
                    return <Select.Option value={obj.timeValue}>{obj.timeName}</Select.Option>;
                  })}
                </Select>
              </Row>
              <Row gutter={12} style={{ marginTop: '2%', marginBottom: '2%' }}>
                <Col span={12}>
                  <Row>Từ: </Row>
                  <DatePicker placeholder="Từ" />
                </Col>
                <Col span={12}>
                  <Row>Đến: </Row>
                  <DatePicker placeholder="Đến" />
                </Col>
              </Row>
            </Col>
            <Col className="gutter-row" span={6}>
              <Row>
                <span style={{ fontSize: "16px", }}>Trạng thái hợp đồng: </span>
              </Row>
              <Row>
                <Checkbox.Group options={optionContract} />
              </Row>
              <Row>
                <span style={{ fontSize: "16px", marginTop: '2%' }}>Trạng thái phòng: </span>
              </Row>
              <Row>
                <Checkbox.Group options={optionRoom} />
              </Row>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={24}>
              <Row gutter={12} justify="center" style={{ margin: '3% 0 1% 0' }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ marginRight: '1%' }}
                >
                  Tìm kiếm
                </Button>
                <Button icon={<UndoOutlined />}>
                  Đặt lại
                </Button>
              </Row>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
      <Table dataSource={data} scroll={{ x: 1600, y: 600 }} bordered>
        <ColumnGroup title="Thông tin chung cư mini/căn hộ">
          <Column title="Tên chung cư mini/căn hộ" dataIndex="apartmentName" key="key" responsive={["xs"]} />
          <Column title="Ngày hợp đồng có hiệu lực" dataIndex="startDate" key="key" />
          <Column title="Ngày kết thúc" dataIndex="endDate" key="key" />
          <Column
            title="Trạng thái hợp đồng"
            dataIndex="statusContract"
            key="key"
            render={(statusContract) => {
              return <Tag color="success">{statusContract}</Tag>
            }}
          />
        </ColumnGroup>
        <ColumnGroup title="Giá trị hợp đồng">
          <Column title="Giá thuê" dataIndex="contractValue" key="key" responsive={["md"]} />
          <Column title="Số tiền cọc" dataIndex="depositValue" key="key" />
        </ColumnGroup>
        <ColumnGroup title="Thông tin tầng/phòng">
          <Column title="Số lượng tầng" dataIndex="numberOfFloor" key="key" />
          <Column title="Số lượng phòng" dataIndex="numberOfRoom" key="key" />
          <Column
            title="Trạng thái phòng"
            dataIndex="roomStatus"
            key="key"
          />
        </ColumnGroup>

        <ColumnGroup title="Thao tác">
          <Column
            key="action"
            render={(_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px" }} onClick={() => {
                    setViewContract(true);
                  }} />
                </>
              );
            }}
          />
        </ColumnGroup>
      </Table>
      <ViewContractBuilding openView={viewContract} closeView={setViewContract} />
    </div>
  );
};

export default ListContractApartment;
