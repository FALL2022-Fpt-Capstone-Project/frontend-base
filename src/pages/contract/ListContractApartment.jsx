import React, { useEffect, useState } from "react";
import "./listContract.scss";
import { Input, Table, Tag, Row, Tabs, Col, Select, DatePicker, Button, Tooltip, Switch, Form } from "antd";
import { EyeOutlined, EditOutlined, SearchOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "manager/contract/group";
const { Column, ColumnGroup } = Table;
const LIST_BUILDING_FILTER = "manager/group/all/contracted";
const dateFormat = "DD/MM/YYYY";

const ListContractApartment = () => {
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewContract, setViewContract] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState("");
  const [building, setBuilding] = useState("");
  const [endContract, setEndContract] = useState(false);
  const [dataContract, setDataContract] = useState([]);
  const dateTimeSelect = [];
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const navigate = useNavigate();

  useEffect(() => {
    getAllContractBuilding();
  }, []);

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
  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const getAllContractBuilding = async () => {
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
        setDataSource(res.data.data);
        console.log(res.data.data);
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
  const buildingChange = (value) => {
    setBuilding(value);
  };

  const resetForm = async () => {
    //   form.resetFields();
    //   setRenterName("");
    //   setPhoneNumber("");
    //   setIdentity("");
    //   setBuilding("");
    //   setStartDate("");
    //   setEndDate("");
    //   setEndContract(false);
    //   setLoading(true);
    //   const response = await axios
    //     .get(LIST_CONTRACT_URL, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${cookie}`,
    //       },
    //     })
    //     .then((res) => {
    //       setDataSource(res.data.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //   setLoading(false);
  };
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
              // {...formItemLayout}
              form={form}
              name="filterStaff"
              id="filterStaff"
              // onFinish={getFilterContractRenter}
              style={{ width: "100%" }}
            >
              <Row gutter={[16]} className="advanced-search" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                <Row>
                  <Form.Item name="renterName" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 16 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên người cho thuê
                        </label>
                      </Row>
                      <Row>
                        <Input
                          placeholder="Nhập tên người cho thuê"
                          autoComplete="off"
                        // onChange={renterNameChange}
                        />
                      </Row>
                    </Col>
                  </Form.Item>

                  <Form.Item name="phoneNumber" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input
                          placeholder="Nhập số điện thoại"
                          autoComplete="off"
                        // onChange={phoneNumberChange}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="date" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Ngày bắt đầu lập hợp đồng
                        </label>
                      </Row>
                      <Row>
                        <RangePicker
                          format={"DD-MM-YYYY"}
                          placeholder={["Từ", "Đến"]}
                          // onChange={dateChange}
                          style={{ width: "500px" }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên chung cư
                        </label>
                      </Row>
                      <Row>
                        <Select options={options} placeholder="Chọn chung cư" onChange={buildingChange}></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" className="form-item-renter form-item-renter-deactive">
                    <Col className="gutter-row" span={24}>
                      <Switch
                      // onChange={endContractChange}
                      />{" "}
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
        <Table dataSource={dataSource} scroll={{ x: 1600, y: 600 }} bordered>
          <Column title="Tên người cho thuê" dataIndex="rack_renter_full_name" key="key" />
          <Column title="Số điện thoại" dataIndex="phone_number" key="key" />

          <Column title="Tên chung cư" dataIndex="group_name" key="key" />

          <Column
            title="Giá thuê"
            dataIndex="contract_price"
            key="key"
            render={(value) => {
              return <span>{value.toLocaleString("vn") + " đ"}</span>;
            }}
          />
          <Column title="Số lượng tầng" dataIndex="total_floor" key="key" />
          <Column title="Số lượng phòng" dataIndex="total_room" key="key" />
          <Column
            title="Ngày lập hợp đồng"
            dataIndex="contract_start_date"
            render={(date) => getFullDate(date)}
            key="key"
          />
          <Column title="Ngày kết thúc" dataIndex="contract_end_date" render={(date) => getFullDate(date)} key="key" />
          <Column
            title="Trạng thái hợp đồng"
            dataIndex="contractIsDisable"
            render={(_, record) => {
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
            }}
          />
          <Column
            title="Thao tác"
            key="action"
            render={(_, record) => {
              return (
                <>
                  <Tooltip title="Chỉnh sửa">
                    <EditOutlined onClick={() => {
                      navigate('/contract-apartment/edit', { state: record });
                    }} style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }} />
                  </Tooltip>
                  <Tooltip title="Xem">
                    <EyeOutlined
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                      onClick={() => {
                        setViewContract(true);
                        setDataContract(record);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Đóng hợp đồng">
                    <DeleteOutlined style={{
                      fontSize: "20px",
                      margin: "0 5px",
                      color: 'red'
                    }} onClick={() => {

                    }} />
                  </Tooltip>
                </>
              );
            }}
          />
        </Table>
        <ViewContractBuilding openView={viewContract} closeView={setViewContract} dataContract={dataContract} />
      </div>
    </div>
  );
};

export default ListContractApartment;
