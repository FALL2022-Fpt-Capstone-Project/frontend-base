import { Button, Col, Form, Input, Row, Table, Tabs, Tooltip, DatePicker, Select, Tag, Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, DollarCircleOutlined, UndoOutlined, AccountBookOutlined } from "@ant-design/icons";
import "./listInvoice.scss";
import axios from "../../api/axios";
import ListHistoryInvoice from "./ListHistoryInvoice";
import CreateInvoice from "./CreateInvoice";

const { RangePicker } = DatePicker;
const { Search } = Input;
const LIST_BUILDING_FILTER = "manager/group/all/contracted";
const ListInvoice = () => {
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const onClickCreateInvoice = () => {
    setCreateInvoice(true);
  };
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
  const showModalHistory = () => {
    setIsModalHistoryOpen(true);
  };
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [dataSource, setDataSource] = useState([
    {
      building_name: "Trọ xanh",
      building_total_floor: 101,
      building_total_rooms: 400,
      building_empty_rooms: 30,
      chu_ky: "Kỳ 30",
      total_people: "Nguyễn Hải Phương",
      status: "Đã thanh toán",
      address_more_detail: 2000000,
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 102,
      building_total_rooms: 500,
      building_empty_rooms: 60,
      chu_ky: "Kỳ 15",
      total_people: "Nguyễn Đức Pháp",
      status: "Chưa thanh toán",
      address_more_detail: 3000000,
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 103,
      building_total_rooms: 500,
      building_empty_rooms: 60,
      chu_ky: "Kỳ 30",
      total_people: "Phạm Đặng Thành",
      status: "Đang nợ",
      address_more_detail: 3000000,
    },
    {
      building_name: "Trọ xanh",
      building_total_floor: 104,
      building_total_rooms: 500,
      building_empty_rooms: 60,
      chu_ky: "Kỳ 15",
      total_people: "Nguyễn Văn Toan",
      status: "Đã thanh toán",

      address_more_detail: 3000000,
    },
  ]);

  useEffect(() => {
    const getBuildingFilter = async () => {
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
    };
    getBuildingFilter();
  }, [cookie]);
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
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
            title: "Số điện kỳ trước",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Số nước kỳ trước",
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
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="Xem lịch sử hoá đơn">
                    <AccountBookOutlined className="icon" onClick={showModalHistory} />
                  </Tooltip>
                  <Tooltip title="Tạo hoá đơn">
                    <DollarCircleOutlined className="icon" onClick={onClickCreateInvoice} />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
        // loading={loading}
      />
      <Modal
        title="Lịch sử hoá đơn phòng 101"
        // style={{ maxwidth: 900 }}
        width={1300}
        visible={isModalHistoryOpen}
        onOk={() => setIsModalHistoryOpen(false)}
        onCancel={() => setIsModalHistoryOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalHistoryOpen(false)}>
            Quay lại
          </Button>,
        ]}
      >
        <ListHistoryInvoice />
      </Modal>
      <CreateInvoice visible={createInvoice} close={setCreateInvoice} />
    </div>
  );
};

export default ListInvoice;
