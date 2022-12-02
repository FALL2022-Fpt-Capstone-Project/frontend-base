import "./room.scss";
import axios from "../../api/axios";
import {
  Table,
  Input,
  Button,
  Form,
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
  Spin,
  Modal,
  notification,
  Popconfirm,
  Popover,
} from "antd";
import {
  EyeTwoTone,
  DownOutlined,
  SearchOutlined,
  UndoOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  UserOutlined,
  DollarCircleOutlined,
  EditTwoTone,
  HomeOutlined,
  BulbOutlined,
  MoreOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRoom from "./AddRoom";
import AddRoomAuto from "./AddRoomAuto";
import RoomDetail from "./RoomDetail";
import IncreaseRoomPrice from "./IncreaseRoomPrice";
import UpdateRoom from "./UpdateRoom";
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
const width100 = {
  width: '100%',
  display: 'flex',
  float: 'left'
}

const APARTMENT_DATA_GROUP = "/manager/group/all";
const ROOM_INFOR = "manager/room/";
const GET_ALL_CONTRACT = "manager/contract";
const DELETE_ROOM = "manager/room/delete/";
const DELETE_LIST_ROOM = "manager/room/delete/list";

let optionFloor = [{ label: 'Tất cả các tầng', value: "" }];
for (let i = 1; i <= 10; i++) {
  optionFloor.push({
    value: i,
    label: i + " Tầng",
  });
};

function ListRoom(props) {

  const [componentSize, setComponentSize] = useState("default");
  const [formFilter] = Form.useForm();
  const [addRoom, setAddRoom] = useState(false);
  const [updateRoom, setUpdateRoom] = useState(false);
  const [editRoom, setEditRoom] = useState(false);
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
  const [rowSelected, setRowSelected] = useState([]);
  const [listRoomId, setListRoomId] = useState([]);
  const [groupIdSelect, setGroupIdSelect] = useState("");
  const [increaseRoomPrice, setIncreaseRoomPrice] = useState(false);
  const [textCardGroup, setTextCardGroup] = useState("Danh sách phòng");
  const [room_status, setRoomStatus] = useState([]);
  const [dataRoomUpdate, setDataRoomUpdate] = useState();
  const [filterSave, setFilterSave] = useState();

  let cookie = localStorage.getItem("Cookie");
  const navigate = useNavigate();

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  //Tree
  // const [expandedKeys, setExpandedKeys] = useState([]);
  // const [checkedKeys, setCheckedKeys] = useState([]);
  // const [selectedKeys, setSelectedKeys] = useState([]);
  // const [autoExpandParent, setAutoExpandParent] = useState(true);

  // const onExpand = (expandedKeysValue) => {
  //   console.log('onExpand', expandedKeysValue);
  //   // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  //   // or, you can remove all expanded children keys.
  //   setExpandedKeys(expandedKeysValue);
  //   setAutoExpandParent(false);
  // };

  // const onCheck = (checkedKeysValue) => {
  //   console.log('onCheck', checkedKeysValue);
  //   setCheckedKeys(checkedKeysValue);
  //   const group_floor = checkedKeysValue?.map((obj, index) => obj.split("-"))?.map((o, i) => {
  //     return { group: parseInt(o[0]), floor: parseInt(o[1]) }
  //   })?.filter((room, j) => room !== undefined);

  //   const arrTotalRoom = group_floor?.map((obj, index) => {
  //     return roomInfor?.filter((o, i) => o.group_id === obj.group
  //       && o.room_floor === obj.floor)?.length
  //   });
  //   const totalRoomRented = group_floor?.map((obj, index) => {
  //     return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor
  //       && Number.isInteger(o.contract_id))?.length
  //   });
  //   const totalEmptyRoom = group_floor?.map((obj, index) => {
  //     return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor
  //       && o.contract_id === null)?.length
  //   });
  //   const totalPrice = group_floor?.map((obj, index) => {
  //     return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor)
  //       ?.map((room, j) => room.room_price).reduce(
  //         (previousValue, currentValue) => previousValue + currentValue, 0)
  //   });

  //   setNumberOfRoom(arrTotalRoom?.reduce(
  //     (previousValue, currentValue) => previousValue + currentValue, 0));
  //   setNumberOfRoomEmpty(totalEmptyRoom?.reduce(
  //     (previousValue, currentValue) => previousValue + currentValue, 0));
  //   setTotalRoomPrice(totalPrice?.reduce(
  //     (previousValue, currentValue) => previousValue + currentValue, 0));
  //   setNumberOfRoomRented(totalRoomRented?.reduce(
  //     (previousValue, currentValue) => previousValue + currentValue, 0));

  //   const dataApartment = group_floor?.map((obj, index) => {
  //     return dataApartmentGroup?.filter((o, i) => o.group_id === obj.group)[0]
  //   });

  //   const listRoom = group_floor?.map((obj, index) => {
  //     return roomInfor?.filter((o, i) => o.group_id === obj.group &&
  //       o.room_floor === obj.floor)
  //   });
  //   const listContract = group_floor?.map((obj, index) => {
  //     return contractRoom?.filter((o, i) => o.group_id === obj.group &&
  //       o.room_floor === obj.floor)
  //   });
  //   setGroupRoom(pre => {
  //     return { contracts: listContract.flat(1), group: dataApartment.flat(1), list_rooms: listRoom.flat(1) }
  //   });
  // };

  // const onSelect = (selectedKeysValue, info) => {
  //   console.log('onSelect', info);
  //   setSelectedKeys(selectedKeysValue);
  // };
  //Tree

  const onClickAddRoom = (e) => {
    setAddRoom(true);
  };
  const onClickAddRoomAuto = (e) => {
    setAddRoomAuto(true);
  };
  const onClickEditRoom = (e) => {
    setEditRoom(true);
  };
  const handleOpenChange = (e) => {
    // setOperation(e);
    console.log(e);
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
      title: "Giá phòng",
      dataIndex: "roomPrice",
      key: "room_id",
      render: (roomPrice) => {
        return <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(roomPrice)}</span>;
      },
      // defaultSortOrder: 'ascend',
      // sorter: (a, b) => a.roomPrice - b.roomPrice
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
      // title: "Thao tác",
      width: 50,
      key: "room_id",
      render: (record) => {
        return <>
          <Row justify="center">
            <Popover
              // open={operation}
              // onOpenChange={handleOpenChange}
              placement="left"
              trigger="click"
              title={"Thao tác"}
              content={
                <div>
                  <Row>
                    <Col span={24}>
                      <Button
                        style={width100}
                        onClick={() => {
                          setSetRoomDetail(true);
                          setRoomDetailData(record);
                          // setOperation(false);
                        }}
                        icon={
                          <EyeTwoTone
                            style={iconSize}
                          />
                        }>
                        Xem chi tiết
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Button
                        style={width100}
                        onClick={() => {
                          setUpdateRoom(true);
                          setDataRoomUpdate(record);
                        }}
                        icon={
                          <EditTwoTone
                            style={iconSize}
                          />
                        }>
                        Chỉnh sửa phòng
                      </Button>
                    </Col>
                  </Row>
                  {
                    !record.roomStatus
                      ?
                      <>
                        <Row>
                          <Col span={24}>
                            <Button
                              style={width100}
                              onClick={() => {
                                onDeleteRoom(record);
                              }}
                              icon={
                                <DeleteOutlined style={{
                                  fontSize: "130%",
                                  marginRight: "8%",
                                  color: 'red'
                                }} />
                              }>
                              Xóa phòng
                            </Button>
                          </Col>
                        </Row>
                      </>
                      :
                      <Row>
                        <Col span={24}>
                          <Button
                            style={width100}
                            onClick={() => {
                              navigate(`/room/member/${record.room_id}`);
                            }}
                            icon={
                              <UserOutlined
                                style={iconSize}
                              />
                            }>
                            Thêm thành viên
                          </Button>
                        </Col>
                      </Row>
                  }
                  <Row>
                    <Col span={24}>
                      <Button
                        onClick={() => {
                          navigate('equipment', { state: [record] })
                        }}
                        style={width100}
                        icon={
                          <BulbOutlined style={iconSize} />
                        }>
                        Trang thiết bị
                      </Button>
                    </Col>
                  </Row>
                </div>
              }>
              <Tooltip title="Thao tác">
                <MoreOutlined onClick={() => {
                  // setOperation(true);
                }} style={{ borderRadius: "50%", border: '1px solid black', fontSize: '200%' }} />
              </Tooltip>
            </Popover>
          </Row>
        </>
        // return (
        //   <>
        //     <Tooltip title="Xem chi tiết">
        //       <EyeTwoTone
        //         onClick={() => {
        //           setSetRoomDetail(true);
        //           setRoomDetailData(record);
        //         }}
        //         style={iconSize}
        //       />
        //     </Tooltip>
        //     <Tooltip title="Chỉnh sửa phòng">
        //       <EditTwoTone onClick={() => { }} style={iconSize} />
        //     </Tooltip>
        //     {!record.roomStatus
        //       ?
        //       <>
        //         <Tooltip title="Xóa phòng">
        //           <DeleteOutlined style={{
        //             fontSize: "130%",
        //             marginRight: "8%",
        //             color: 'red'
        //           }} onClick={() => {
        //             onDeleteRoom(record);
        //           }} />
        //         </Tooltip>
        //       </>
        //       :
        //       <>
        //         <Tooltip title="Thêm thành viên vào phòng">
        //           <UserOutlined onClick={() => {
        //             navigate(`/room/member/${record.room_id}`);
        //           }} style={iconSize} />
        //         </Tooltip>
        //       </>
        //     }

        //     <Tooltip title="Thêm trang thiết bị trong phòng">
        //       <BulbOutlined style={iconSize} />
        //     </Tooltip>
        //   </>
        // );
      },
    },
  ];
  const onDeleteRoomAPI = async (room_id, room_name) => {
    // let cookie = localStorage.getItem("Cookie");
    await axios
      .delete(DELETE_ROOM + room_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: ` Xóa phòng ${room_name} thành công`,
          placement: "top",
          duration: 3,
        });
        apartmentGroup();
        getRoomInfor(groupIdSelect);
        getAllContract();
      })
      .catch((error) => {
        notification.error({
          message: "Xóa phòng thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };

  const onDeleteListRoomAPI = async () => {
    // let cookie = localStorage.getItem("Cookie");
    await axios
      .delete(DELETE_LIST_ROOM + "?roomId=" + listRoomId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
      .then((res) => {
        notification.success({
          message: ` Xóa phòng thành công`,
          placement: "top",
          duration: 3,
        });
        apartmentGroup();
        getRoomInfor(groupIdSelect);
        getAllContract();
        setListRoomId([]);
      })
      .catch((error) => {
        notification.error({
          message: "Xóa phòng thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };

  const onDeleteRoom = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa phòng ${record.roomName} này ?`,
      okText: "Có",
      cancelText: "Hủy",
      onOk: () => {
        onDeleteRoomAPI(record.room_id, record.roomName)
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setListRoomId(selectedRows.map(room => room.room_id));
    },
    getCheckboxProps: (record) => ({
      disabled: record.roomStatus === true,
    }),
  };

  useEffect(() => {
    apartmentGroup();
    getRoomInfor();
    getAllContract();
    setRoomStatus({ ...room_status, roomStatus: [true, false] });
    formFilter.setFieldsValue({
      roomGroup: "",
      roomFloor: "",
      roomPrice: "",
      roomStatus: [true, false]
    })
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
        const mergeGroup = res.data.data.list_group_contracted?.concat(res.data.data.list_group_non_contracted);
        // setCheckedKeys(mergeGroup?.map((obj, index) => obj.group_id.toString()));
        setDataApartmentGroup(mergeGroup);
        setGroupRoom(pre => {
          return { ...pre, group: mergeGroup }
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // setLoading(false);
  };
  // console.log(groupRoom);
  const getAllContract = async () => {
    // setLoading(true);
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

  const getRoomInfor = async (group_id = "", sortRoom = "", roomFloor = "", roomStatus = []) => {
    setLoading(true);
    await axios
      .get(ROOM_INFOR, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        let room_data = group_id === undefined || group_id === "" ? res.data.data :
          res.data.data?.filter((room, index) => room.group_id === group_id);

        room_data = typeof sortRoom == "boolean" ? (room_data.sort((a, b) => sortRoom ? a.room_price - b.room_price :
          b.room_price - a.room_price)) : room_data;

        room_data = roomStatus.length === 1 ? (room_data.filter(room => roomStatus[0] ?
          Number.isInteger(room.contract_id) : room.contract_id === null)) : room_data;

        room_data = Number.isInteger(roomFloor) ? room_data?.filter(room => room.room_floor === roomFloor) : room_data;

        setGroupRoom(pre => {
          return {
            ...pre, list_rooms: room_data
          };
        });
        setNumberOfRoom(room_data.length);
        setNumberOfRoomEmpty(room_data?.filter((obj, index) => obj.contract_id === null)?.length);
        setNumberOfRoomRented(room_data?.filter(room => Number.isInteger(room.contract_id))?.length);
        setTotalRoomPrice(room_data?.map((obj, index) => obj.room_price)?.reduce(
          (previousValue, currentValue) => previousValue + currentValue, 0));
        setRoomInfor(room_data)
        // setDataSource(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false)
  };

  const treeData = dataApartmentGroup?.map((obj, index) => {
    let floor = [];
    for (let i = 1; i <= obj.total_floor; i++) {
      floor.push(i);
    }
    return {
      title: <span>{obj.group_name} <b style={{ fontWeight: 600 }}>{" ( " + obj.total_floor + " tầng, " + obj.list_rooms?.length + " phòng )"}</b></span>,
      key: obj.group_id.toString(),
      icon: <HomeOutlined />,
      children: floor?.map((pre, k) => {
        return {
          title: <span>{'Tầng ' + pre} <b style={{ fontWeight: 600 }}> {"( " + obj.list_rooms?.filter((u, y) => u.room_floor === pre).length + " phòng )"} </b></span>,
          key: obj.group_id + '-' + pre,
          children: obj.list_rooms?.filter(rooms => rooms.room_floor === pre)?.map((room, j) => {
            return {
              title: 'Phòng ' + room.room_name,
              key: obj.group_id.toString() + "-" + pre.toString() + "-" + room.room_id
            }
          })
        }
      })
    }
  });

  const onFinishFilter = (e) => {
    setFilterSave(e);
    setRoomStatus({ ...room_status, roomStatus: e.roomStatus });
    getRoomInfor(e.roomGroup, e.roomPrice, e.roomFloor, e.roomStatus);
    setTextCardGroup(e.roomGroup === "" ? 'Danh sách phòng' : 'Danh sách phòng ( ' + dataApartmentGroup?.find(group => group.group_id === e.roomGroup).group_name + ' )');
  }
  const onFinishFailFilter = (e) => {
    console.log(e);
  }

  const reload = () => {
    apartmentGroup();
    if (filterSave === undefined) {
      getRoomInfor()
    } else {
      getRoomInfor(filterSave.roomGroup, filterSave.roomPrice, filterSave.roomFloor, filterSave.roomStatus);
    };
    getAllContract();
  }
  console.log(groupRoom);
  return (
    <Spin spinning={loading} size="large">
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
          <Col xs={24} lg={24} xl={8} span={8}>
            <Card
              className="card-w100-h100"
              title={<p className="text-card">Danh sách các chung cư</p>}
              bordered={false}
            >
              <Row>
                <Col span={24}>
                  <p>Tổng số chung cư: <span style={{ fontWeight: 600 }}>{dataApartmentGroup?.length} chung cư</span></p>
                </Col>
              </Row>
              <Tree
                showIcon
                checkable={false}
                // onExpand={onExpand}
                // expandedKeys={expandedKeys}
                // autoExpandParent={autoExpandParent}
                // onCheck={onCheck}
                // checkedKeys={checkedKeys}
                // onSelect={onSelect}
                // selectedKeys={selectedKeys}
                treeData={treeData}
                switcherIcon={<DownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} lg={24} xl={16} span={16}>
            <Card
              className="card-w100-h100"
              title={textCardGroup}
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
                    value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).
                      format(totalRoomPrice)}
                  />
                </Col>
              </Row>
              <Tabs defaultActiveKey="1" style={{ marginBottom: "1%" }}>
                <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col xs={24} sm={24} md={18} lg={16} xl={12} span={14}>
                      <Input.Search
                        onSearch={(e) => {
                          setSearchRoom(e);
                        }}
                        // onChange={(e) => { setSearchRoom(e.target.value) }}
                        placeholder="Nhập tên phòng hoặc tên chung cư để tìm kiếm" />
                    </Col>
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
                  <Form
                    form={formFilter}
                    onFinish={onFinishFilter}
                    onFinishFailed={onFinishFailFilter}
                    layout="horizontal"
                    initialValues={{
                      size: componentSize,
                    }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize}
                    width={1000}
                    id="filterRoom">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col span={8}>
                        <Row style={style}>
                          <span>Tìm kiếm theo chung cư </span>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              className="form-item"
                              name="roomGroup"
                              labelCol={{ span: 24 }}
                            >
                              <Select
                                defaultValue={""}
                                placeholder="Chọn chung cư"
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                style={{ width: "100%", marginBottom: "5%" }}
                                onChange={(e) => {
                                  setGroupIdSelect(e);
                                }}
                                options={[...dataApartmentGroup?.map(group => {
                                  return { label: group.group_name, value: group.group_id }
                                }), {
                                  label: 'Tất cả chung cư',
                                  value: ""
                                },]} />

                            </Form.Item>
                          </Col>
                        </Row>
                        <Row style={style}>
                          <span>Tìm kiếm theo giá phòng </span>
                        </Row>
                        <Row gutter={12} style={{ marginTop: "1%" }}>
                          <Col span={24}>
                            <Row>
                              <Col span={24}>
                                <Form.Item
                                  className="form-item"
                                  name="roomPrice"
                                  labelCol={{ span: 24 }}
                                >
                                  <Select
                                    placeholder="Sắp xếp theo giá phòng"
                                    options={[
                                      { label: 'Tất cả các giá phòng', value: "" },
                                      { label: 'Giá phòng từ thấp đến cao', value: true },
                                      { label: 'Giá phòng từ cao đến thấp', value: false },
                                    ]}
                                    style={{ width: "100%" }}>
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <Row style={style}>
                          <span>Tìm kiếm theo tầng </span>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              className="form-item"
                              name="roomFloor"
                              labelCol={{ span: 24 }}
                            >
                              <Select
                                defaultValue={""}
                                options={optionFloor}
                                placeholder="Chọn tầng"
                                style={{ width: "100%" }}>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <Row style={style}>
                          <span>Trạng thái phòng </span>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              className="form-item"
                              name="roomStatus"
                              labelCol={{ span: 24 }}
                            >
                              <Checkbox.Group
                                defaultValue={[true, false]}
                                style={{ marginBottom: "15%" }} options={[
                                  { label: "Đang ở", value: true },
                                  { label: "Đang trống", value: false },
                                ]}></Checkbox.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row justify="center">
                      <Col span={24}>
                        <Row gutter={12} justify="center" style={{ margin: "3% 0 3% 0" }}>
                          <Button
                            htmlType="submit"
                            key="submit"
                            form="filterRoom"
                            type="primary"
                            icon={<SearchOutlined />} style={{ marginRight: "1%" }}>
                            Tìm kiếm
                          </Button>
                          <Button
                            onClick={() => {
                              setFilterSave();
                              apartmentGroup();
                              getRoomInfor();
                              getAllContract();
                              setRoomStatus({ ...room_status, roomStatus: [true, false] });
                              formFilter.setFieldsValue({
                                roomGroup: "",
                                roomFloor: "",
                                roomPrice: "",
                                roomStatus: [true, false]
                              })
                            }} icon={<UndoOutlined />}>Đặt lại</Button>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </Tabs.TabPane>
              </Tabs>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                rowKey={(record) => record.room_id}
                bordered
                onChange={(pagination, filters, sorter, extra) => {
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
                // pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                columns={columns}
                scroll={{ x: 800, y: 800 }}></Table>
              <Row>
                <p>Tổng số phòng đã chọn: {listRoomId?.length}</p>
              </Row>
              <Row>
                <Col span={24}>
                  <Button
                    disabled={listRoomId.length === 0 ? true : false}
                    onClick={() => {
                      Modal.confirm({
                        title: `Bạn có chắc chắn muốn xóa các phòng đã chọn ?`,
                        okText: "Có",
                        cancelText: "Hủy",
                        onOk: () => {
                          onDeleteListRoomAPI()
                        },
                      });
                    }}
                    type="danger" icon={<DeleteOutlined style={{ fontSize: "130%", color: "white" }}
                    />}>Xóa phòng đã chọn</Button>
                  <Button onClick={() => {
                    setIncreaseRoomPrice(true);
                  }} style={{ marginLeft: "1%" }}
                    icon={<DollarCircleOutlined style={textSize} />} type="primary">
                    Tăng/Giảm giá phòng
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <AddRoom reRender={reload} visible={addRoom} close={setAddRoom} data={dataApartmentGroup} />
        <UpdateRoom reRender={reload} visible={updateRoom} close={setUpdateRoom} data={dataApartmentGroup} dataUpdate={dataRoomUpdate} setDataUpdate={setDataRoomUpdate} />
        <AddRoomAuto visible={addRoomAuto} close={setAddRoomAuto} data={dataApartmentGroup} />
        <RoomDetail visible={roomDetail} close={setSetRoomDetail} data={roomDetailData} />
        <IncreaseRoomPrice visible={increaseRoomPrice} close={setIncreaseRoomPrice} />
      </div>
    </Spin>
  );
}

export default ListRoom;
