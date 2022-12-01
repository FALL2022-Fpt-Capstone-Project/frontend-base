import "./room.scss";
import axios from "../../api/axios";
import {
    Table,
    Input,
    Button,
    Form,
    Tag,
    Row,
    Col,
    Tabs,
    Statistic,
    Divider,
    Tooltip,
    Tree,
    Card,
    Spin,
    Modal,
    message,
} from "antd";
import {
    EyeTwoTone,
    DownOutlined,
    ArrowLeftOutlined,
    DeleteOutlined,
    UserOutlined,
    EditOutlined,
    EditTwoTone,
    HomeOutlined,
    MinusCircleFilled
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

const APARTMENT_DATA_GROUP = "/manager/group/all";
const ROOM_INFOR = "manager/room/";
const GET_ALL_CONTRACT = "manager/contract";
const ALL_FLOOR = "config/floor;"

function Preview(props) {

    const [form] = Form.useForm();
    const [addRoom, setAddRoom] = useState(false);
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
    const [allFloor, setAllFloor] = useState([]);
    const [groupIdSelect, setGroupIdSelect] = useState("");

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
                && Number.isInteger(o.contract_id))?.length
        });
        const totalEmptyRoom = group_floor?.map((obj, index) => {
            return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor
                && o.contract_id === null)?.length
        });
        const totalPrice = group_floor?.map((obj, index) => {
            return roomInfor?.filter((o, i) => o.group_id === obj.group && o.room_floor === obj.floor)
                ?.map((room, j) => room.room_price).reduce(
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
    const onClickEditRoom = (e) => {
        setEditRoom(true);
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
        // {
        //   title: "Thời hạn hợp đồng",
        //   dataIndex: "durationContract",
        //   key: "room_id",
        //   render: (durationContract) => {
        //     if (durationContract < 12) {
        //       return durationContract + ' tháng'
        //     } else {
        //       if (durationContract > 12) {
        //         return durationContract % 12 !== 0 ?
        //           Math.floor(durationContract / 12) + ' năm ' + durationContract % 12 + ' tháng' :
        //           Math.floor(durationContract / 12) + ' năm '
        //       } else {
        //         return 'Chưa vào ở';
        //       }
        //     }
        //   }
        // },
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
                            <Tooltip title="Chỉnh sửa phòng">
                                <EditTwoTone onClick={() => { }} style={iconSize} />
                            </Tooltip>
                            <Tooltip title="Xóa phòng">
                                <DeleteOutlined
                                    style={{
                                        fontSize: "130%",
                                        marginRight: "8%",
                                        color: 'red'
                                    }}
                                    onClick={() => {
                                        onDeleteRoom(record);
                                    }}
                                />
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
                            <Tooltip title="Chỉnh sửa phòng">
                                <EditTwoTone onClick={() => { }} style={iconSize} />
                            </Tooltip>
                        </>
                    );
                }
            },
        },
    ];

    const onDeleteRoom = (record) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xóa phòng ${record.roomName} này ?`,
            okText: "Có",
            cancelText: "Hủy",
            onOk: () => {

            },
        });
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelected(selectedRows);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

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
                const mergeGroup = res.data.data.list_group_contracted?.concat(res.data.data.list_group_non_contracted);
                setCheckedKeys(mergeGroup?.map((obj, index) => obj.group_id.toString()));
                setDataApartmentGroup(mergeGroup);
                setGroupRoom(pre => {
                    return { ...pre, group: mergeGroup }
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

    const getRoomInfor = async (group_id) => {
        setLoading(true);
        await axios
            .get(ROOM_INFOR, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                const room_data = group_id === undefined || group_id === "" ? res.data.data :
                    res.data.data?.filter((room, index) => room.group_id === group_id)
                setGroupRoom(pre => {
                    return { ...pre, list_rooms: room_data };
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
        console.log(obj.total_floor);
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
                            href="/room"
                            type="primary"
                            size="default"
                            style={{ marginBottom: "1%", marginLeft: "1%", float: "right" }}
                            icon={<ArrowLeftOutlined style={textSize} />}
                        >
                            Danh sách phòng
                        </Button>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col xs={24} lg={24} xl={8} span={8}>
                        <Card
                            className="card-w100-h100"
                            title={<p className="text-card">Thông tin chung các phòng</p>}
                            bordered={false}
                        >
                            <Tree
                                showIcon
                                checkable={false}
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                onSelect={onSelect}
                                selectedKeys={selectedKeys}
                                treeData={treeData}
                                switcherIcon={<DownOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={24} xl={16} span={16}>
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
                                                placeholder="Nhập tên phòng để tìm kiếm" />
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
                            </Tabs>
                            <Row>
                                <Col span={24}>
                                    <span>
                                        <MinusCircleFilled style={{
                                            fontSize: "130%",
                                            margin: "1% 0",
                                            color: 'red'
                                        }} /> Những phòng đã tồn tại trong tòa nhà
                                    </span>
                                </Col>
                            </Row>
                            <Table
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection,
                                }}
                                rowClassName={(record) => record.roomStatus ? 'data-row' : 'data-row active-row'}
                                rowKey={(record) => record.room_id}
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
                                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                                columns={columns}
                                scroll={{ x: 1000, y: 800 }}></Table>
                            <Row>
                                <Col span={24}>
                                    <Button onClick={onClickEditRoom} style={{ marginRight: "1%" }}
                                        icon={<EditOutlined style={textSize} />} type="primary">Chỉnh sửa phòng đã chọn</Button>
                                    <Button type="danger" icon={<DeleteOutlined style={{ fontSize: "130%", color: "white" }} />}>Xóa phòng đã chọn</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" style={{ marginTop: '1%' }}>Tạo mới</Button>
                </Row>
                <AddRoom visible={addRoom} close={setAddRoom} />
                <AddRoomAuto visible={addRoomAuto} close={setAddRoomAuto} data={dataApartmentGroup} />
                <RoomDetail visible={roomDetail} close={setSetRoomDetail} data={roomDetailData} />
            </div>
        </Spin>
    );
}

export default Preview;
