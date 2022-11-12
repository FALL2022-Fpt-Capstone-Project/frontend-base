import "./room.scss";
import axios from "../../api/axios";
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
  Tree,
  Card,
} from "antd";
import {
  EyeTwoTone,
  AuditOutlined,
  SearchOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddRoom from "./AddRoom";
import AddRoomAuto from "./AddRoomAuto";
import RoomDetail from "./RoomDetail";
const style = {
  marginBottom: "3%",
};
const textSize = {
  fontSize: 15,
};
const iconSize = {
  fontSize: "130%",
  marginRight: "8%",
};

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];
const APARTMENT_DATA_GROUP = "/manager/group/all";

function ListRoom(props) {
  const [form] = Form.useForm();
  const [addRoom, setAddRoom] = useState(false);
  const [addRoomAuto, setAddRoomAuto] = useState(false);
  const [roomDetail, setSetRoomDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  let cookie = localStorage.getItem("Cookie");

  //Tree
  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  //Tree

  const navigate = useNavigate();

  const onClickAddRoom = (e) => {
    setAddRoom(true);
  };
  const onClickAddRoomAuto = (e) => {
    setAddRoomAuto(true);
  };
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
      roomNumberOfRenter: "1/5",
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
      roomPrice: 10000000,
      roomDeposit: 0,
      roomSquare: "30m2",
      billCycle: "",
      paymentCycle: "Kỳ 30",
      durationContract: "Chưa vào ở",
      roomStatus: 0,
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
        return <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomPrice)}</span>;
      },
    },
    {
      title: "Tiền cọc",
      dataIndex: "roomDeposit",
      key: "index",
      render: (roomDeposit) => {
        return (
          <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomDeposit)}</span>
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
        if (record.roomStatus === 0) {
          return (
            <>
              <Tooltip title="Xem chi tiết">
                <EyeTwoTone
                  onClick={() => {
                    setSetRoomDetail(true);
                  }}
                  style={iconSize}
                />
              </Tooltip>
              <Tooltip title="Lập hợp đồng phòng">
                <AuditOutlined
                  onClick={() => {
                    navigate(`/contract-renter/create`);
                  }}
                  style={iconSize}
                />
              </Tooltip>
              <Tooltip title="Xóa phòng">
                <DeleteOutlined style={{ fontSize: "130%", color: "red" }} />
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              <Tooltip title="Xem chi tiết">
                <EyeTwoTone
                  onClick={() => {
                    setSetRoomDetail(true);
                  }}
                  style={iconSize}
                />
              </Tooltip>
              <Tooltip title="Thêm thành viên vào phòng">
                <UserOutlined style={iconSize} />
              </Tooltip>
              <Tooltip title="Xóa phòng">
                <DeleteOutlined style={{ fontSize: "130%", color: "red" }} />
              </Tooltip>
            </>
          );
        }
      },
    },
  ];
  useEffect(() => {
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
  console.log(dataApartmentGroup);

  return (
    <div
      className="site-layout-background"
      style={{
        padding: 0,
        minHeight: 360,
      }}
    >
      <Divider />
      <Row>
        <Col span={24}>
          <Button
            onClick={onClickAddRoom}
            type="primary"
            size="default"
            style={{ marginBottom: "1%", marginLeft: "1%", float: "right" }}
            icon={<PlusCircleOutlined style={textSize} />}
          >
            Thêm Phòng
          </Button>
          <Button
            onClick={onClickAddRoomAuto}
            type="primary"
            size="default"
            style={{ marginBottom: "1%", float: "right" }}
            icon={<PlusCircleOutlined style={textSize} />}
          >
            Thêm mới phòng nhanh
          </Button>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} lg={8} xl={5} span={5}>
          <Card
            className="card-w100-h100"
            title={<p className="text-card">Chọn chung cư để hiển thị dữ liệu</p>}
            bordered={false}
          >
            <Row>
              <Col span={24}>
                <p>Danh sách các chung cư, tầng và phòng: </p>
              </Col>
            </Row>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16} xl={19} span={19}>
          <Card
            className="card-w100-h100"
            title="Danh sách phòng chung cư A"
            bordered={false}
          >
            <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <Statistic
                  title={
                    <>
                      <span style={textSize}>Tổng số phòng: </span>
                    </>
                  }
                  value={2}
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
                  value={1}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={
                    <>
                      <span style={textSize}>Tổng số tiền phòng: </span>
                    </>
                  }
                  value={20000000}
                />
              </Col>
            </Row>
            <Tabs defaultActiveKey="1" style={{ marginBottom: "1%" }}>
              <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={12} xl={8} span={8}>
                    <Input.Search placeholder="Nhập tên phòng hoặc tên chung cư để tìm kiếm" />
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
                      <Select placeholder="Chọn khoảng diện tích" style={{ width: "100%", marginBottom: "5%" }}>
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
                      <Select placeholder="Chọn số lượng người tối đa" style={{ width: "100%", marginBottom: "5%" }}>
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
            <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 1180, y: 600 }}></Table>
          </Card>
        </Col>
      </Row>

      <AddRoom visible={addRoom} close={setAddRoom} />
      <AddRoomAuto visible={addRoomAuto} close={setAddRoomAuto} />
      <RoomDetail visible={roomDetail} close={setSetRoomDetail} />
    </div>
  );
}

export default ListRoom;
