import React, { useEffect, useState } from "react";
import "./listContract.scss";
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
  Tooltip,
  Switch,
  Form,
} from "antd";
import { EyeOutlined, EditOutlined, FilterOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
import moment from "moment";

const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "";
const { Column, ColumnGroup } = Table;
const style = {
  margin: "5% 0",
};
const APARTMENT_DATA_GROUP = "/manager/group/all";
const dateFormat = "DD/MM/YYYY";

const ListContractApartment = () => {
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewContract, setViewContract] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identity, setIdentity] = useState("");
  const [rentalName, setRentalName] = useState("");
  const [building, setBuilding] = useState("");
  const [endContract, setEndContract] = useState(false);
  const dateTimeSelect = [];
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
  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    getAllContractExpired();
    apartmentGroup();
  }, []);

  const apartmentGroup = async () => {
    setLoading(true);
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataApartmentGroup(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

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
  const resetForm = async () => {
    form.resetFields();
    setRentalName("");
    setPhoneNumber("");
    setIdentity("");
    setBuilding("");
    setEndContract(false);
    setLoading(true);
    // const response = await axios
    //   .get(LIST_CONTRACT_URL, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${cookie}`,
    //     },
    //   })
    //   .then((res) => {
    //     setDataSource(res.data.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // setLoading(false);
  };
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
  const rentalNameChange = (e) => {
    setRentalName(e.target.value);
  };
  const phoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const identityChange = (e) => {
    setIdentity(e.target.value);
  };
  const buildingChange = (value) => {
    setBuilding(value);
  };
  const endContractChange = (value) => {
    setEndContract(value);
  };
  const getFilterContractRental = () => {
    console.log(rental);
  };
  const rental = {
    rentalName: rentalName,
    identity: identity,
    phoneNumber: phoneNumber,
    startDate: startDate,
    endDate: endDate,
    building: building,
    endContract: endContract,
  };
  const data = [
    {
      key: "1",
      ownerName: "Nguyễn Viết Thắng",
      apartmentName: "Trọ Xanh",
      startDate: "20-12-2018",
      endDate: "25-10-2022",
      phoneNumber: "0987893432",
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đã hết phòng",
    },
    {
      key: "2",
      ownerName: "Đào Minh Hà",
      phoneNumber: "0987893432",
      apartmentName: "Trọ của Pháp",
      startDate: "20-11-2019",
      endDate: "20-01-2023",
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống",
    },
    {
      key: "3",
      ownerName: "Nguyễn Xuân Nam",
      phoneNumber: "0987893432",
      apartmentName: "Young and Happy",
      startDate: "24-12-2020",
      endDate: "29-12-2022",
      statusContract: "Hợp đồng còn hiệu lực",
      contractValue: 100000000,
      depositValue: 100000000,
      numberOfFloor: 10,
      numberOfRoom: 100,
      roomStatus: "Đang trống",
    },
  ];

  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col>
                <Search
                  placeholder="Nhập tên người cho thuê để tìm kiếm"
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
              onFinish={getFilterContractRental}
            >
              <Row gutter={[16]} className="advanced-search" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                <Row>
                  <Form.Item name="rentalName" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 24 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên người cho thuê
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên người cho thuê" autoComplete="off" onChange={rentalNameChange} />
                      </Row>
                    </Col>
                  </Form.Item>

                  <Form.Item name="identity" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số CCCD
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số CCCD" autoComplete="off" onChange={identityChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phoneNumber" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số điện thoại" autoComplete="off" onChange={phoneNumberChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
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
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên chung cư
                        </label>
                      </Row>
                      <Row>
                        <Select
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label.toLowerCase().trim() ?? "").includes(input.toLocaleLowerCase().trim())
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                          }
                          onChange={buildingChange}
                          options={dataApartmentGroup?.map((obj, index) => {
                            return { value: obj.group_id, label: obj.group_name };
                          })}
                          placeholder="Chọn chung cư"
                        ></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" className="form-item-renter form-item-renter-deactive">
                    <Col className="gutter-row" span={24}>
                      <Switch onChange={endContractChange} />{" "}
                      {endContract ? <span>Hợp đồng đã kết thúc</span> : <span>Hợp đồng còn hiệu lực</span>}
                    </Col>
                  </Form.Item>
                </Row>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col span={24}>
                  <Row justify="center">
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ marginRight: "20px" }}
                      // onClick={getFilterContractRenter}
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={resetForm}>
                      Đặt lại
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table dataSource={data} scroll={{ x: 1600, y: 600 }} bordered>
        <Column title="Tên người cho thuê" dataIndex="ownerName" key="key" />
        <Column title="Số điện thoại" dataIndex="phoneNumber" key="key" />

        <Column title="Tên chung cư" dataIndex="apartmentName" key="key" />

        <Column
          title="Giá thuê"
          dataIndex="contractValue"
          key="key"
          render={(value) => {
            return <span>{value.toLocaleString("vn") + " đ"}</span>;
          }}
        />
        <Column title="Số lượng tầng" dataIndex="numberOfFloor" key="key" />
        <Column title="Số lượng phòng" dataIndex="numberOfRoom" key="key" />
        <Column title="Ngày lập hợp đồng" dataIndex="startDate" key="key" />
        <Column title="Ngày kết thúc" dataIndex="endDate" key="key" />
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
                <Tooltip title="Chỉnh sửa">
                  <EditOutlined className="icon" />
                </Tooltip>
                <Tooltip title="Xem">
                  <EyeOutlined
                    className="icon"
                    onClick={() => {
                      setViewContract(true);
                    }}
                  />
                </Tooltip>
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
