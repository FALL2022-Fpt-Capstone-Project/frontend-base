import React, { useEffect, useState } from "react";

import {
  Input,
  Table,
  Tag,
  Row,
  Checkbox,
  Tabs,
  Col,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Slider,
  Form,
  Switch,
} from "antd";
import { EyeTwoTone, EditOutlined, FilterOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
import moment from "moment";

const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "";
const LIST_BUILDING_FILTER = "manager/group/all";

const { Column, ColumnGroup } = Table;

const ListContractApartment = () => {
  const dateFormat = "DD/MM/YYYY";
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [viewContract, setViewContract] = useState(false);
  const options = [];
  const [price, setPrice] = useState({ min: 0, max: 10000000000 });
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
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const [form] = Form.useForm();
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

  useEffect(() => {
    const getBuildingFilter = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getBuildingFilter();
  }, [cookie]);
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }

  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

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
  const data = [
    {
      key: "1",
      ownerName: "Antony",
      apartmentName: "Trọ xanh",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đã hết phòng",
    },
    {
      key: "2",
      ownerName: "Harry mac hai",
      apartmentName: "Young and Happy",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống",
    },
    {
      key: "3",
      ownerName: "Fred",
      apartmentName: "Trọ của Pháp",
      startDate: moment().format(dateFormat),
      endDate: moment().format(dateFormat),
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống",
    },
  ];
  const onChangePrice = (value) => {
    if (value[0] < value[1]) {
      setPrice({ min: value[0], max: value[1] });
    }
  };

  const onChangeMin = (value) => {
    if (price.max > value) {
      setPrice({ min: value });
    }
  };
  const onChangeMax = (value) => {
    if (price.min < value) {
      setPrice({ max: value });
    }
  };
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col>
              <Search
                placeholder="Nhập tên chung cư/căn hộ để tìm kiếm"
                style={{ marginBottom: "3%", width: 400 }}
                onSearch={(value) => {
                  setTextSearch(value);
                }}
                onChange={(e) => {
                  setTextSearch(e.target.value);
                }}
              />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
          <Form
            {...formItemLayout}
            form={form}
            name="filterStaff"
            id="filterStaff"
            // onFinish={getFilterContractRenter}
            style={{ width: "100%" }}
          >
            <Row gutter={[16]} style={{ marginBottom: "20px", marginLeft: "20px" }}>
              <Row>
                <Form.Item name="renterName" style={{ width: "500px", marginBottom: 0 }}>
                  <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 24 }}>
                    <Row>
                      <label htmlFor="" style={{ marginBottom: "10px" }}>
                        Tìm kiếm theo tên người cho thuê
                      </label>
                    </Row>
                    <Row>
                      <Input placeholder="Nhập tên người cho thuê" autoComplete="off" />
                    </Row>
                  </Col>
                </Form.Item>

                {/* <Form.Item name="identity" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo số CCCD
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số CCCD" autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item> */}
                <Form.Item name="phoneNumber" style={{ width: "500px" }}>
                  <Col className="gutter-row" span={24}>
                    <Row>
                      <label htmlFor="" style={{ marginBottom: "10px" }}>
                        Tìm kiếm theo số điện thoại
                      </label>
                    </Row>
                    <Row>
                      <Input placeholder="Nhập số điện thoại" autoComplete="off" />
                    </Row>
                  </Col>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item name="date" style={{ width: "500px" }}>
                  <Col className="gutter-row" span={24}>
                    <Row>
                      <label htmlFor="" style={{ marginBottom: "10px" }}>
                        Ngày bắt đầu lập hợp đồng
                      </label>
                    </Row>
                    <Row>
                      <RangePicker
                        format={"DD-MM-YYYY"}
                        placeholder={["Từ", "Đến"]}
                        onChange={dateChange}
                        style={{ width: "500px" }}
                      />
                    </Row>
                  </Col>
                </Form.Item>
                <Form.Item name="groupId" style={{ width: "500px" }}>
                  <Col className="gutter-row" span={24}>
                    <Row>
                      <label htmlFor="" style={{ marginBottom: "10px" }}>
                        Tìm kiếm theo tên chung cư
                      </label>
                    </Row>
                    <Row>
                      <Select options={options} placeholder="Chọn chung cư"></Select>
                    </Row>
                  </Col>
                </Form.Item>
                <Form.Item name="deactive" style={{ width: "500px", marginTop: "30px" }}>
                  <Col className="gutter-row" span={24}>
                    <Switch /> <span>Hợp đồng đã kết thúc</span>
                  </Col>
                </Form.Item>
              </Row>
            </Row>
            <Row style={{ marginBottom: "20px" }}>
              <Col offset={10}>
                <Row>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ marginRight: "20px" }}
                    // onClick={getFilterContractRenter}
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<UndoOutlined />}>Đặt lại</Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Tabs.TabPane>
      </Tabs>
      <Table dataSource={data} scroll={{ x: 1600, y: 600 }} bordered>
        <Column title="Tên người cho thuê" dataIndex="ownerName" key="key" />
        <Column title="Tên chung cư mini/căn hộ" dataIndex="apartmentName" key="key" />
        <Column title="Ngày lập hợp đồng" dataIndex="startDate" key="key" />
        <Column title="Ngày kết thúc" dataIndex="endDate" key="key" />
        <Column
          title="Giá thuê"
          dataIndex="contractValue"
          key="key"
          render={(value) => {
            return <b>{value.toLocaleString("vn") + " đ"}</b>;
          }}
        />
        <Column
          title="Số tiền cọc"
          dataIndex="depositValue"
          key="key"
          render={(value) => {
            return <b>{value.toLocaleString("vn") + " đ"}</b>;
          }}
        />
        <Column title="Số lượng tầng" dataIndex="numberOfFloor" key="key" />
        <Column title="Số lượng phòng" dataIndex="numberOfRoom" key="key" />
        <Column
          title="Trạng thái hợp đồng"
          dataIndex="statusContract"
          key="key"
          render={(statusContract) => {
            return <Tag color="success">{statusContract}</Tag>;
          }}
        />
        <Column
          title="Thao tác"
          key="action"
          render={(_, record) => {
            return (
              <>
                <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                <EyeTwoTone
                  style={{ fontSize: "20px" }}
                  onClick={() => {
                    setViewContract(true);
                  }}
                />
              </>
            );
          }}
        />
      </Table>
      <ViewContractBuilding openView={viewContract} closeView={setViewContract} />
    </div>
  );
};

export default ListContractApartment;
