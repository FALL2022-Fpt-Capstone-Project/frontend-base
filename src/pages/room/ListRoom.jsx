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
import { useNavigate, Link } from "react-router-dom";
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

const APARTMENT_DATA_GROUP = "/manager/group/all";
const ROOM_INFOR = "manager/room/";
const GET_ALL_CONTRACT = "manager/contract";

function ListRoom(props) {
  const [form] = Form.useForm();
  const [addRoom, setAddRoom] = useState(false);
  const [addRoomAuto, setAddRoomAuto] = useState(false);
  const [roomDetail, setSetRoomDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [roomInfor, setRoomInfor] = useState([]);
  const [groupRoom, setGroupRoom] = useState([]);
  const [contractRoom, setContractRoom] = useState([]);
  const [numberOfRoom, setNumberOfRoom] = useState(0);
  const [numberOfRoomEmpty, setNumberOfRoomEmpty] = useState(0);
  const [numberOfRoomRented, setNumberOfRoomRented] = useState(0);
  const [totalRoomPrice, setTotalRoomPrice] = useState(0);
  const [searchRoom, setSearchRoom] = useState("");
  const [roomDetailData, setRoomDetailData] = useState([]);
  let cookie = localStorage.getItem("Cookie");
  const navigate = useNavigate();

  //Tree
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [room_status, setRoomStatus] = useState([]);
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
    const group_floor = checkedKeysValue?.map((obj, index) => obj.split("-"))?.map((o, i) => {
      return { group: parseInt(o[0]), floor: parseInt(o[1]) }
    })?.filter((room, j) => room !== undefined);
    const arrTotalRoom = group_floor?.map((obj, index) => {
      return roomInfor?.filter((o, i) => o.group_id === obj.group
        && o.room_floor === obj.floor)?.length
    });
    const totalRoomRented = group_floor?.map((obj, index) => {
      return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor
        && o.contract_id !== null)?.length
    });
    const totalEmptyRoom = group_floor?.map((obj, index) => {
      return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor
        && o.contract_id === null)?.length
    });
    const totalPrice = group_floor?.map((obj, index) => {
      return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor)?.map((room, j) => room.room_price).reduce(
        (previousValue, currentValue) => previousValue + currentValue, 0)
    });

    setNumberOfRoom(arrTotalRoom?.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0));
    setNumberOfRoomEmpty(totalEmptyRoom?.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0));
    setTotalRoomPrice(totalPrice?.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0));
    setNumberOfRoomRented(totalRoomRented?.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0));

    const dataApartment = group_floor?.map((obj, index) => {
      return dataApartmentGroup?.filter((o, i) => o.group_id === obj.group)[0]
    });
    const listRoom = group_floor?.map((obj, index) => {
      return roomInfor?.filter((o, i) => o.group_id === obj.group &&
        o.room_floor === obj.floor)
    });
    const listContract = group_floor?.map((obj, index) => {
      return contractRoom?.filter((o, i) => o.group_id === obj.group &&
        o.room_floor === obj.floor)
    });
    setGroupRoom(pre => {
      return { contracts: listContract.flat(1), group: dataApartment.flat(1), list_rooms: listRoom.flat(1) }
    });
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  //Tree

  const onClickAddRoom = (e) => {
    setAddRoom(true);
  };
  const onClickAddRoomAuto = (e) => {
    setAddRoomAuto(true);
  };

  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "groupName",
      key: "room_id",
    },
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "room_id",
      filteredValue: [searchRoom],
      onFilter: (value, record) => {
        return String(record.roomName.trim()).toLowerCase()?.includes(value.trim().toLowerCase()) ||
          String(record.groupName.trim()).toLowerCase()?.includes(value.trim().toLowerCase());
      },
      render: (roomName) => {
        return 'Phòng ' + roomName
      }
    },
    {
      title: "Tầng",
      dataIndex: "roomFloor",
      key: "room_id",
      render: (roomFloor) => {
        return 'Tầng ' + roomFloor
      }
    },
    {
      title: "Số lượng người",
      // dataIndex: "roomNumberOfRenter",
      key: "room_id",
      render: (record) => {
        return record.roomNumberOfRenter + '/' + record.room_limit_people
      }
    },
    {
      title: "Giá phòng",
      dataIndex: "roomPrice",
      key: "room_id",
      render: (roomPrice) => {
        return <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomPrice)}</span>;
      },
    },
    {
      title: "Tiền cọc",
      dataIndex: "roomDeposit",
      key: "room_id",
      render: (roomDeposit) => {
        return (
          roomDeposit ?
            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomDeposit)
            : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(0)
        );
      },
    },
    {
      title: "Diện tích",
      dataIndex: "roomSquare",
      key: "room_id",
      render: (roomSquare) => {
        return roomSquare + ' m2'
      }
    },
    {
      title: "Thời hạn hợp đồng",
      dataIndex: "durationContract",
      key: "room_id",
      render: (durationContract) => {
        if (durationContract < 12) {
          return durationContract + ' tháng'
        } else {
          if (durationContract > 12) {
            return durationContract % 12 !== 0 ?
              Math.floor(durationContract / 12) + ' năm ' + durationContract % 12 + ' tháng' :
              Math.floor(durationContract / 12) + ' năm '
          } else {
            return 'Chưa vào ở';
          }
        }
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "roomStatus",
      key: 'roomStatus',
      filters: [
        { text: "Đang ở", value: true },
        { text: "Đang trống", value: false },
      ],
      filteredValue: room_status.roomStatus || null,
      onFilter: (value, record) => record.roomStatus === value,
      render: (roomStatus) => {
        return roomStatus ? <Tag color="success">Đang ở</Tag> : <Tag color="error">Đang trống</Tag>
      },
    },
    {
      title: "Thao tác",
      key: "room_id",
      render: (record) => {
        if (!record.roomStatus) {
          return (
            <>
              <Tooltip title="Xem chi tiết">
                <EyeTwoTone
                  onClick={() => {
                    setSetRoomDetail(true);
                    setRoomDetailData(record);
                  }}
                  style={iconSize}
                />
              </Tooltip>
              <Tooltip title="Lập hợp đồng phòng">

                <Link style={{ color: 'black' }}
                  to={{
                    pathname: "/room/create-contract",
                  }}
                  state={{
                    room_id: record.room_id,
                    group_id: record.group_id,
                    room_floor: record.room_floor,
                    room_price: record.roomPrice,
                  }}>
                  <AuditOutlined style={iconSize} />
                </Link>

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
                    setRoomDetailData(record);
                  }}
                  style={iconSize}
                />
              </Tooltip>
              <Tooltip title="Thêm thành viên vào phòng">
                <UserOutlined onClick={() => {
                  navigate(`/room/member/${record.room_id}`);
                }} style={iconSize} />
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
    getRoomInfor();
    getAllContract();
    setRoomStatus({ ...room_status, roomStatus: [true, false] })
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
        setCheckedKeys(res.data.data?.map((obj, index) => obj.group_id.toString()));
        setDataApartmentGroup(res.data.data);
        setGroupRoom(pre => {
          return { ...pre, group: res.data.data }
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getAllContract = async () => {
    setLoading(true);
    await axios
      .get(GET_ALL_CONTRACT, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setGroupRoom(pre => {
          return { ...pre, contracts: res.data.data }
        });
        setContractRoom(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getRoomInfor = async () => {
    setLoading(true);
    await axios
      .get(ROOM_INFOR, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setGroupRoom(pre => {
          return { ...pre, list_rooms: res.data.data };
        });
        setNumberOfRoom(res.data.data.length);
        setNumberOfRoomEmpty(res.data.data?.map((obj, index) => obj.contract_id === null)?.reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0));
        setNumberOfRoomRented(res.data.data?.map((obj, index) => obj.contract_id !== null)?.reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0));
        setTotalRoomPrice(res.data.data?.map((obj, index) => obj.room_price)?.reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0));
        setRoomInfor(res.data.data)
        // setDataSource(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const treeData = dataApartmentGroup?.map((obj, index) => {
    let floor = [];
    for (let i = 1; i <= obj.total_floor; i++) {
      floor.push(i);
    }
    return {
      title: obj.group_name + " (" + obj.total_floor + " tầng, " + obj.list_rooms.length + " phòng)",
      key: obj.group_id.toString(),
      children: floor?.map((pre, k) => {
        return {
          title: 'Tầng ' + pre + ' (' + obj.list_rooms?.filter((u, y) => u.room_floor === pre).length + ' phòng)',
          key: obj.group_id + '-' + pre,
        }
      })
    }
  });
  // console.log(dataApartmentGroup);
  console.log(groupRoom);
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
        <Col xs={24} lg={8} xl={7} span={7}>
          <Card
            className="card-w100-h100"
            title={<p className="text-card">Chọn chung cư để hiển thị dữ liệu</p>}
            bordered={false}
          >
            <Row>
              <Col span={24}>
                <p>Danh sách các chung cư <b>({dataApartmentGroup?.length} chung cư)</b>: </p>
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
        <Col xs={24} lg={16} xl={17} span={17}>
          <Card
            className="card-w100-h100"
            title="Danh sách phòng"
            bordered={false}
          >
            <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <Statistic
                  title={
                    <>
                      <span style={textSize}>Số phòng đã thuê </span>
                    </>
                  }
                  value={numberOfRoomRented + "/" + numberOfRoom}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={
                    <>
                      <span style={textSize}>Số phòng trống </span>
                      {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button> */}
                    </>
                  }
                  value={numberOfRoomEmpty + "/" + numberOfRoom}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={
                    <>
                      <span style={textSize}>Tổng số tiền phòng (VND) </span>
                    </>
                  }
                  value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRoomPrice)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p><i>Hiển thị danh sách phòng theo chung cư bạn đã chọn</i></p>
              </Col>
            </Row>
            <Tabs defaultActiveKey="1" style={{ marginBottom: "1%" }}>
              <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={12} xl={10} span={10}>
                    <Input.Search
                      onSearch={(e) => { setSearchRoom(e) }}
                      onChange={(e) => { setSearchRoom(e.target.value) }}
                      placeholder="Nhập tên phòng hoặc tên chung cư để tìm kiếm" />
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
                      <Checkbox.Group defaultValue={[true, false]} onChange={(e) => {
                        setRoomStatus({ ...room_status, roomStatus: e });
                      }} style={{ marginBottom: "15%" }} options={[
                        { label: "Đang ở", value: true },
                        { label: "Đang trống", value: false },
                      ]}></Checkbox.Group>
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
            <Table
              bordered
              onChange={(pagination, filters, sorter, extra) => {
                console.log(filters.roomStatus)
                setRoomStatus({ ...room_status, roomStatus: filters.roomStatus });
              }}
              loading={loading}
              dataSource={groupRoom?.list_rooms?.map((obj, index) => {
                return {
                  room_id: obj.room_id,
                  group_id: obj.group_id,
                  room_floor: obj.room_floor,
                  contract_id: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_id,
                  groupName: groupRoom?.group?.find((o, i) => o.group_id === obj.group_id)?.group_name,
                  roomName: obj.room_name,
                  roomFloor: obj.room_floor,
                  roomNumberOfRenter: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.list_renter?.length ?
                    groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.list_renter?.length : 0,
                  roomPrice: obj.room_price,
                  roomDeposit: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_deposit,
                  roomSquare: obj.room_area,
                  billCycle: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_bill_cycle,
                  paymentCycle: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_payment_cycle,
                  durationContract: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_term,
                  roomStatus: obj.contract_id !== null ? true : false,
                  room_limit_people: obj.room_limit_people,
                  list_renter: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.list_renter,
                  list_services: groupRoom?.group?.find((o, i) => o.group_id === obj.group_id)?.list_general_service,
                  startDate: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_start_date,
                  endDate: groupRoom?.contracts?.find((o, i) => o.room_id === obj.room_id)?.contract_end_date
                }
              })}
              columns={columns}
              scroll={{ x: 1180, y: 600 }}></Table>
          </Card>
        </Col>
      </Row>

      <AddRoom visible={addRoom} close={setAddRoom} />
      <AddRoomAuto visible={addRoomAuto} close={setAddRoomAuto} data={dataApartmentGroup} />
      <RoomDetail visible={roomDetail} close={setSetRoomDetail} data={roomDetailData} />
    </div>
  );
}

export default ListRoom;
