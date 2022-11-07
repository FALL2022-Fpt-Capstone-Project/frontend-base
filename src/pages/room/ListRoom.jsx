import "./room.scss";
import {
  Modal,
  Table,
  Input,
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Switch,
  Tag,
  Popover,
  Row,
  Col,
  Checkbox,
  Tabs,
  Statistic,
  Tooltip,
  Card,
  Divider,
} from "antd";
import {
  MoreOutlined,
  FilterOutlined,
  SearchOutlined,
  UndoOutlined,
  QuestionCircleTwoTone,
  PlusOutlined,
  ArrowRightOutlined,
  AuditOutlined,
  DollarOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
const style = {
  marginBottom: "5%",
};

function ListRoom(props) {
  const [form] = Form.useForm();
  const optionFilterRoom = [
    {
      label: "Phòng đang ở",
      value: "1",
    },
    {
      label: "Phòng trống",
      value: "2",
    },
    {
      label: "Cọc giữ chỗ",
      value: "3",
    },
  ];
  const optionPaymentCycle = [
    {
      label: "Kỳ 15",
      value: 15,
    },
    {
      label: "Kỳ 30",
      value: 30,
    },
  ];

  const optionRoomStatus = [
    {
      label: "Đang ở",
      value: 1,
    },
    {
      label: "Đang trống",
      value: 0,
    },
    {
      label: "Đã cọc",
      value: 2,
    },
  ];
  const renter = [
    {
      index: 1,
      groupName: "Trọ xanh",
      roomName: "Phòng 201",
      roomFloor: "Tầng 2",
      roomNumberOfRenter: "3/5",
      roomPrice: 10000000,
      roomDeposit: 10000000,
      roomSquare: "30m2",
      billCycle: "1 tháng",
      paymentCycle: "Kỳ 30",
      durationContract: "6 tháng",
      roomStatus: 1,
    },
    {
      index: 2,
      groupName: "Trọ xanh",
      roomName: "Phòng 202",
      roomFloor: "Tầng 2",
      roomNumberOfRenter: "0/5",
      roomPrice: 3000000,
      roomDeposit: 0,
      roomSquare: "30m2",
      billCycle: "",
      paymentCycle: "",
      durationContract: "6 tháng",
      roomStatus: 0,
    },
    {
      index: 3,
      groupName: "Trọ tươi",
      roomName: "Phòng 203",
      roomFloor: "Tầng 2",
      roomNumberOfRenter: "1/5",
      roomPrice: 10000000,
      roomDeposit: 10000000,
      roomSquare: "30m2",
      billCycle: "1 tháng",
      paymentCycle: "Kỳ 30",
      durationContract: "6 tháng",
      roomStatus: 2,
    },
  ];
  const options = [
    {
      label: "Chung cư victory",
      value: 1,
    },
    {
      label: "Trọ xanh",
      value: 2,
    },
    {
      label: "Chung cư Văn Phú",
      value: 3,
    },
  ];

  const [dataSource, setDataSource] = useState(renter);
  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "groupName",
      key: "index",
    },
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "index",
    },
    {
      title: "Tầng",
      dataIndex: "roomFloor",
      key: "index",
    },
    {
      title: "Số lượng người",
      dataIndex: "roomNumberOfRenter",
      key: "index",
    },
    {
      title: "Giá phòng",
      dataIndex: "roomPrice",
      key: "index",
      render: (roomPrice) => {
        return (
          <span style={{ fontWeight: "bold" }}>
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomPrice)}
          </span>
        );
      },
    },
    {
      title: "Tiền cọc",
      dataIndex: "roomDeposit",
      key: "index",
      render: (roomDeposit) => {
        return (
          <span style={{ fontWeight: "bold" }}>
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomDeposit)}
          </span>
        );
      },
    },
    {
      title: "Diện tích",
      dataIndex: "roomSquare",
      key: "index",
    },
    {
      title: "Chu kỳ thanh toán",
      dataIndex: "paymentCycle",
      key: "index",
    },
    {
      title: "Chu kỳ tính tiền",
      dataIndex: "billCycle",
      key: "index",
    },
    {
      title: "Thời hạn hợp đồng",
      dataIndex: "durationContract",
      key: "index",
    },
    {
      title: "Trạng thái phòng",
      key: "index",
      dataIndex: "roomStatus",
      filters: [
        { text: "Đang ở", value: 1 },
        { text: "Đang trống", value: 0 },
        { text: "Đã cọc", value: 2 },
      ],
      onFilter: (value, record) => {
        return record.status === value;
      },
      render: (roomStatus) => {
        if (roomStatus === 0) {
          return <Tag color="error">Đang trống</Tag>;
        } else if (roomStatus === 1) {
          return <Tag color="success">Đang ở</Tag>;
        } else {
          return <Tag color="blue">Đã cọc</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "index",
      render: (record) => {
        return (
          <>
            <Popover
              placement="left"
              title="Thao tác"
              content={
                <>
                  <Row>
                    <Col span={24}>
                      <Row>
                        <Button
                          style={{ marginBottom: "2%" }}
                          icon={<ArrowRightOutlined style={{ fontSize: "130%" }} />}
                        >
                          Chi tiết phòng
                        </Button>
                      </Row>
                      <Row>
                        <Button style={{ marginBottom: "2%" }} icon={<AuditOutlined style={{ fontSize: "130%" }} />}>
                          Hợp đồng mới
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          style={{ marginBottom: "2%", paddingRight: "22%" }}
                          icon={<DollarOutlined style={{ fontSize: "130%" }} />}
                        >
                          Cọc giữ chỗ
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          href="/service"
                          style={{ marginBottom: "2%" }}
                          icon={<SettingOutlined style={{ fontSize: "130%" }} />}
                        >
                          Cài đặt dịch vụ
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          style={{ paddingRight: "25%" }}
                          icon={<DeleteOutlined style={{ fontSize: "130%", color: "red" }} />}
                          danger
                        >
                          Xóa phòng
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </>
              }
              trigger="click"
            >
              <MoreOutlined style={{ fontSize: "180%", borderRadius: "50%", border: "1px solid black" }} />
            </Popover>
          </>
        );
      },
    },
  ];

  return (
    <div
      className="site-layout-background"
      style={{
        padding: 0,
        minHeight: 360,
      }}
    >
      <Row>
        <Col span={7}>
          <span style={{ fontSize: "16px", marginBottom: "0.5%" }}>Chọn tòa nhà để hiển thị dữ liệu </span>
        </Col>
        <Col span={4} offset={13}>
          <Button type="primary" size="default" style={{ float: "right" }} icon={<PlusOutlined />}>
            Thêm Phòng
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: "2%" }}>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: 400,
          }}
          placeholder="Chọn tòa nhà để hiển thị dữ liệu"
          defaultValue={["Trọ xanh"]}
          // onChange={handleChange}
          options={options}
        />
      </Row>
      <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={5}>
          <Statistic
            title={
              <>
                <span style={{ fontSize: "16px" }}>Tổng số phòng: </span>
              </>
            }
            value={50}
          />
        </Col>
        <Col span={7}>
          <Statistic
            title={
              <>
                <span style={{ fontSize: "16px" }}>Tổng số phòng trống: </span>
                <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button>
              </>
            }
            value={10}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={
              <>
                <span style={{ fontSize: "16px" }}>Tổng số tiền cọc: </span>
              </>
            }
            value={100000000}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={
              <>
                <span style={{ fontSize: "16px" }}>Tổng số tiền phòng: </span>
              </>
            }
            value={100000000}
          />
        </Col>
      </Row>
      <Divider />
      <Tabs defaultActiveKey="1" style={{ marginBottom: "1%" }}>
        <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                  <Input.Search placeholder="Nhập tên phòng để tìm kiếm" style={{ marginBottom: 8, width: 400 }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <Row style={style}>
                <span>Tìm kiếm theo diện tích </span>
              </Row>
              <Row>
                <Select placeholder="Chọn khoảng diện tích" style={{ width: "100%", marginBottom: "15%" }}>
                  <Select.Option>15m2 - 20m2</Select.Option>
                </Select>
              </Row>
              <Row style={style}>
                <span>Tìm kiếm theo giá phòng </span>
              </Row>
              {/* <Row>
                                <Select placeholder="Chọn khoảng giá" style={{ width: '100%' }}>
                                    <Select.Option>1.000.000đ - 10.000.0000đ</Select.Option>
                                </Select>
                            </Row> */}
              <Row gutter={12} style={{ marginTop: "1%" }}>
                <Col span={12}>
                  {/* <Row style={style}>Từ: </Row> */}
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    style={{ width: "100%" }}
                    placeholder="Từ"
                    controls={false}
                  />
                </Col>
                <Col span={12}>
                  {/* <Row style={style}>Đến: </Row> */}
                  <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="đ"
                    style={{ width: "100%" }}
                    placeholder="Đến"
                    controls={false}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={6} offset={3}>
              <Row style={style}>
                <span>Số lượng người tốt đa / phòng </span>
              </Row>
              <Row>
                <Select placeholder="Chọn số lượng người tối đa" style={{ width: "100%", marginBottom: "15%" }}>
                  <Select.Option>5 người </Select.Option>
                </Select>
              </Row>
              <Row style={style}>
                <span>Tìm kiếm theo tầng </span>
              </Row>
              <Row>
                <Select placeholder="Chọn tầng" style={{ width: "100%" }}>
                  <Select.Option>Tầng 1</Select.Option>
                  <Select.Option>Tầng 2</Select.Option>
                  <Select.Option>Tầng 3</Select.Option>
                </Select>
              </Row>
            </Col>
            <Col span={6} offset={3}>
              <Row style={style}>
                <span>Trạng thái phòng </span>
              </Row>
              <Row>
                <Checkbox.Group style={{ marginBottom: "15%" }} options={optionRoomStatus}></Checkbox.Group>
              </Row>
              <Row style={style}>
                <span>
                  Chu kỳ thanh toán:
                  <Tooltip
                    color="#108ee9"
                    placement="topLeft"
                    title="Kỳ 15: Khách thuê vào từ ngày 1-15 Kỳ 30: Khách thuê vào từ ngày  16-31"
                  >
                    <QuestionCircleTwoTone style={{ fontSize: "130%" }} />
                  </Tooltip>
                </span>
              </Row>
              <Row>
                <Checkbox.Group defaultValue={[15, 30]} options={optionPaymentCycle}></Checkbox.Group>
              </Row>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={24}>
              <Row gutter={12} justify="center" style={{ margin: "3% 0 3% 0" }}>
                <Button type="primary" icon={<SearchOutlined />} style={{ marginRight: "1%" }}>
                  Tìm kiếm
                </Button>
                <Button icon={<UndoOutlined />}>Đặt lại</Button>
              </Row>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
      <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 1600, y: 800 }}></Table>
    </div>
  );
}

export default ListRoom;
