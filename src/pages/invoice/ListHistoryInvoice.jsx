import { Button, Col, Form, Input, Row, Table, Tabs, Tooltip, DatePicker, Select, Tag, Checkbox, Modal } from "antd";
import React, { useState } from "react";
import { EditOutlined, SearchOutlined, EyeOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import "./listHistoryInvoice.scss";
const { RangePicker } = DatePicker;
const { Search } = Input;
const ListHistoryInvoice = () => {
  const options = [];
  const option = [
    {
      value: "15",
      label: "Kỳ 15",
    },
    {
      value: "30",
      label: "Kỳ 30",
    },
  ];
  const plainOptions = ["Đã thanh toán", "Chưa thanh toán", "Đang nợ"];
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
  // const showModalHistory = () => {
  //   setIsModalHistoryOpen(true);
  // };
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const [dataSource, setDataSource] = useState([
    {
      building_name: "Trọ xanh",
      building_total_floor: 101,
      building_total_rooms: 400,
      building_empty_rooms: 30,
      chu_ky: "Kỳ 30",
      total_people: "Nguyễn Hải Phương",
      status: "Chưa thanh toán",
      address_more_detail: 2000000,
      date: "30-10-2022",
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 101,
      building_total_rooms: 400,
      building_empty_rooms: 30,
      chu_ky: "Kỳ 30",
      total_people: "Nguyễn Hải Phương",
      status: "Đã thanh toán",
      address_more_detail: 2000000,
      date: "30-9-2022",
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 101,
      building_total_rooms: 400,
      building_empty_rooms: 30,
      chu_ky: "Kỳ 30",
      total_people: "Nguyễn Hải Phương",
      status: "Đã thanh toán",
      address_more_detail: 2000000,
      date: "30-8-2022",
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 101,
      building_total_rooms: 400,
      building_empty_rooms: 30,
      chu_ky: "Kỳ 30",
      total_people: "Nguyễn Hải Phương",
      status: "Đã thanh toán",
      address_more_detail: 2000000,
      date: "30-7-2022",
    },
  ]);
  return (
    <div className="list-history-invoice">
      <div className="list-history-invoice-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Search
              placeholder="Tìm kiếm theo số phòng, tên người đại diện,..."
              className="quich-search"
              // onSearch={(value) => {
              //   setTextSearch(value);
              // }}
              // onChange={(e) => {
              //   setTextSearch(e.target.value);
              // }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
            <Form
              {...formItemLayout}
              form={form}
              name="filterStaff"
              id="filterStaff"
              // onFinish={getFilterContractRenter}
            >
              <Row gutter={[16]} className="advanced-search" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                <Row>
                  <Form.Item name="renterName" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 24 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên người đại diện
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập người đại diện" autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phoneNumber" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên phòng
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên phòng" autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="date" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Ngày lập hoá đơn
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
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên chung cư
                        </label>
                      </Row>
                      <Row>
                        <Select options={options} placeholder="Chọn chung cư"></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo chu kỳ thanh toán
                        </label>
                      </Row>
                      <Row>
                        <Select options={option} placeholder="Chọn chu kỳ thanh toán"></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" className="form-item-renter form-item-renter-deactive">
                    <Row>
                      <label htmlFor="" className="search-name">
                        Tìm kiếm theo trạng thái hoá đơn
                      </label>
                    </Row>
                    <Row>
                      <Checkbox.Group options={plainOptions} />
                    </Row>
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
                    <Button
                      icon={<UndoOutlined />}
                      // onClick={resetForm}
                    >
                      Đặt lại
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "Tên chung cư",
            dataIndex: "building_name",
          },
          {
            title: "Tên phòng",
            dataIndex: "building_total_floor",
          },
          {
            title: "Người đại diện",
            dataIndex: "total_people",
          },
          {
            title: "Chu kỳ thanh toán",
            dataIndex: "chu_ky",
          },
          {
            title: "Số điện",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Số nước",
            dataIndex: "building_empty_rooms",
          },

          {
            title: "Tiền phòng",
            dataIndex: "address_more_detail",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Ngày hoá đơn",
            dataIndex: "date",
          },
          {
            title: "Trạng thái hoá đơn",
            dataIndex: "status",
            render: (_, record) => {
              let status;
              if (record.status === "Đã thanh toán") {
                status = (
                  <Tag color="default" key={record.status}>
                    Chưa thanh toán
                  </Tag>
                );
              } else if (record.status === "Chưa thanh toán") {
                status = (
                  <Tag color="green" key={record.status}>
                    Đã thanh toán
                  </Tag>
                );
              } else if (record.status === "Đang nợ") {
                status = (
                  <Tag color="red" key={record.status}>
                    Đang nợ
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
                  {record.status === "Đã thanh toán" ? (
                    <>
                      <Tooltip title="Xem hoá đơn">
                        <EyeOutlined className="icon" />
                      </Tooltip>
                      <Tooltip title="Xoá hoá đơn">
                        <DeleteOutlined className="icon icon-delete" />
                      </Tooltip>{" "}
                    </>
                  ) : (
                    <>
                      <Tooltip title="Chỉnh sửa hoá đơn">
                        <EditOutlined className="icon" />
                      </Tooltip>
                      <Tooltip title="Xem hoá đơn">
                        <EyeOutlined className="icon" />
                      </Tooltip>
                      <Tooltip title="Xoá hoá đơn">
                        <DeleteOutlined className="icon icon-delete" />
                      </Tooltip>{" "}
                    </>
                  )}
                </>
              );
            },
          },
        ]}
        // loading={loading}
      />
    </div>
  );
};

export default ListHistoryInvoice;
