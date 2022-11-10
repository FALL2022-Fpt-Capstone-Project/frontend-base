import "./room.scss";
import {
  Table,
  Input,
  Button,
  Form,
  InputNumber,
  Select,
  Tag,
  Row,
  Col,
  Checkbox,
  Tabs,
  Statistic,
  Divider,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  AuditOutlined,
  SearchOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import React, { useState } from "react";
import AddRoom from "./AddRoom";
import AddRoomAuto from "./AddRoomAuto";
const style = {
  marginBottom: "5%",
};
const textSize = {
  fontSize: 15
}
const iconSize = {
  fontSize: '130%',
  marginRight: '8%',
}

function ListRoom(props) {
  const [form] = Form.useForm();
  const [addRoom, setAddRoom] = useState(false);
  const [addRoomAuto, setAddRoomAuto] = useState(false);
  const onClickAddRoom = (e) => {
    setAddRoom(true);
  }
  const onClickAddRoomAuto = (e) => {
    setAddRoomAuto(true);
  }
  const optionRoomStatus = [
    {
      label: "Đang ở",
      value: 1,
    },
    {
      label: "Đang trống",
      value: 0,
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
  ];
  const options = [
    {
      label: "Chọn tất cả",
      value: 1,
    },
    {
      label: "Chung cư victory",
      value: 2,
    },
    {
      label: "Trọ xanh",
      value: 3,
    },
    {
      label: "Chung cư Văn Phú",
      value: 4,
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
          <span>
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
          <span>
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
      title: "Thời hạn hợp đồng",
      dataIndex: "durationContract",
      key: "index",
    },
    {
      title: "Trạng thái",
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
            <Tooltip title="Xem chi tiết">
              <EyeOutlined style={iconSize} />
            </Tooltip>
            <Tooltip title="Lập hợp đồng phòng">
              <AuditOutlined style={iconSize} />
            </Tooltip>
            <Tooltip title="Xóa phòng">
              <DeleteOutlined style={{ fontSize: '130%', color: 'red' }} />
            </Tooltip>
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
        <Col span={6} offset={18}>
          <span style={textSize}>Chọn chung cư để hiển thị dữ liệu </span>
        </Col>
      </Row>
      <Row>
        <Col span={14}>
          <Button onClick={onClickAddRoomAuto} type="primary" size="default" style={{ marginBottom: "1%", marginRight: "1%", float: "left" }} icon={<PlusCircleOutlined style={textSize} />}>
            Thêm mới phòng nhanh
          </Button>
          <Button onClick={onClickAddRoom} type="primary" size="default" style={{ marginBottom: "1%", float: "left" }} icon={<PlusCircleOutlined style={textSize} />}>
            Thêm Phòng
          </Button>
        </Col>
        <Col span={6} offset={4}>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{
              width: '100%',
            }}
            placeholder="Chọn tòa nhà để hiển thị dữ liệu"
            // onChange={handleChange}
            options={options}
          >
            {/* <Select.Option>Chọn tất cả</Select.Option>
            {options?.map((obj, index) => {
              return <Select.Option value={obj.value}>{obj.label}</Select.Option>
            })} */}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <i>
              <b>Thêm mới phòng nhanh: </b> các thông tin về phòng sẽ tự động được thêm vào giúp việc nhập dữ liệu nhanh hơn
            </i>
          </p>
        </Col>
      </Row>
      <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <Statistic
            title={
              <>
                <span style={textSize}>Tổng số phòng: </span>
              </>
            }
            value={50}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={
              <>
                <span style={textSize}>Tổng số phòng trống: </span>
                {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button> */}
              </>
            }
            value={10}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={
              <>
                <span style={textSize}>Tổng số tiền phòng: </span>
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
            <Col span={8}>
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
              <Row gutter={12} style={{ marginTop: "1%" }}>
                <Col xs={24} xl={12} span={12}>
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
                <Col xs={24} xl={12} span={12}>
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
            <Col span={8}>
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
            <Col span={8}>
              <Row style={style}>
                <span>Trạng thái phòng </span>
              </Row>
              <Row>
                <Checkbox.Group style={{ marginBottom: "15%" }} options={optionRoomStatus}></Checkbox.Group>
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
      <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 1200, y: 600 }}></Table>
      <AddRoom visible={addRoom} close={setAddRoom} />
      <AddRoomAuto visible={addRoomAuto} close={setAddRoomAuto} />
    </div>
  );
}

export default ListRoom;
