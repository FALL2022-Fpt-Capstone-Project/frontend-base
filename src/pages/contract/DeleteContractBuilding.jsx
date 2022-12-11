import { Button, Card, Checkbox, Col, Divider, Input, Modal, notification, Row, Select, Statistic, Table, Tabs, Tag } from "antd";
import React, { useState, useEffect } from "react";
import {
    ArrowRightOutlined,
    UserOutlined,
    AuditOutlined,
    DollarOutlined,
    GoldOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const DELETE_GROUP_CONTRACT = "manager/contract/group/end";

const marginBottom = {
    marginBottom: "1%",
};
const cardTop = {
    height: '100%',
    border: '1px solid #C0C0C0',
    borderRadius: '10px'
};

const cardBellow = {
    height: '100%',
    marginTop: '2%',
    border: '1px solid #C0C0C0',
    borderRadius: '10px'
};


const textSize = {
    fontSize: 15,
};
let optionFloor = [];
function DeleteContractBuilding({ reload, openView, closeView, dataContract, dataAsset }) {
    console.log(dataContract);
    const navigate = useNavigate();
    const [roomFloor, setRoomFloor] = useState("");
    let cookie = localStorage.getItem("Cookie");

    const handleOk = () => {
        closeView(false);
    };
    const handleCancel = () => {
        closeView(false);
    };
    useEffect(() => {

    }, []);

    if (dataContract.length !== 0) {
        optionFloor = [{ label: 'Tất cả các tầng', value: "" }];
        for (let i = 1; i <= dataContract?.total_floor; i++) {
            optionFloor.push({
                value: i,
                label: "Tầng " + i,
            });
        };
    }
    const columnInvoice = [
        {
            title: "Tên phòng",
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Tiền phòng',
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Tiền dịch vụ',
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Tổng cộng',
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Cần thu',
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Ngày lập hóa đơn',
            // dataIndex: "roomName",
            // key: "room_id",
        },
        {
            title: 'Trạng thái',
            // dataIndex: "roomName",
            // key: "room_id",
        },
    ]
    const columns = [
        {
            title: "Tên phòng",
            dataIndex: "roomName",
            key: "room_id",
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
            title: "Diện tích",
            dataIndex: "roomSquare",
            key: "room_id",
            render: (roomSquare) => {
                return roomSquare + " m2"
            },
        },
        {
            title: "Trạng thái phòng",
            dataIndex: "roomStatus",
            key: 'roomStatus',
            render: (roomStatus) => {
                return roomStatus ? <Tag color="success">Đã có hợp đồng</Tag> : <Tag color="error">Chưa có hợp đồng</Tag>
            },
        },
    ];

    const onDeleteGroupContract = async (contract_id, total_money) => {
        // let cookie = localStorage.getItem("Cookie");
        await axios
            .post(DELETE_GROUP_CONTRACT, { group_contract_id: contract_id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                notification.success({
                    message: ` Kết thúc hợp đồng thành công`,
                    placement: "top",
                    duration: 3,
                });
                closeView(false);
                reload();
            })
            .catch((error) => {
                notification.error({
                    message: "Kết thúc hợp đồng thất bại",
                    placement: "top",
                    duration: 3,
                });
            });
    };
    return (
        <>
            <div>
                <Modal
                    title={<h2>{dataContract?.group_name}</h2>}
                    width={1200}
                    open={openView}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={() => {
                                closeView(false);
                            }}
                        >
                            Đóng
                        </Button>,
                    ]}
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Danh sách hóa đơn</span>} key="1">
                            <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} md={12} lg={12} xl={12} span={12}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Hóa đơn chưa thanh toán</span>
                                            </>
                                        }
                                        value={0 + "/" + 0}
                                    />
                                </Col>
                                <Col xs={24} md={12} lg={12} xl={12} span={12}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Tổng số tiền lãi (VND)</span>
                                            </>
                                        }
                                        value={0}
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <Table
                                columns={columnInvoice}
                                dataSource={[]}
                                scroll={{ x: 1000, y: 800 }}
                                bordered
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Thông tin chung</span>} key="2">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} xl={12} span={12}>
                                    <Card
                                        style={cardTop}
                                        title={
                                            <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                                                <UserOutlined style={{ fontSize: "120%" }} /> Thông tin người cho thuê
                                            </Tag>
                                        }
                                        bordered={true}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <h4>Họ và tên:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.rack_renter_full_name}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Giới tính: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.gender ? 'Nam' : 'Nữ'}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Số điện thoại:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.phone_number}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Email:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.rack_renter_email}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>CCCD/CMND:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.identity_number}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Địa chỉ chi tiết: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.rack_renter_more_details}</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24} xl={12} span={12}>
                                    <Card
                                        style={cardTop}
                                        title={
                                            <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                                                <AuditOutlined style={{ fontSize: "120%" }} /> Thông tin chung cư mini / căn hộ
                                            </Tag>
                                        }
                                        bordered={true}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <h4>Tên chung cư/căn hộ:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.group_name}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Số lượng tầng: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.total_floor} tầng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Số lượng phòng: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.total_room} phòng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Địa chỉ:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.address?.address_wards + ", " + dataContract?.address?.address_district + ", " + dataContract?.address?.address_city} </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Thời hạn hợp đồng:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.contract_term < 12
                                                    ? dataContract?.contract_term + ' tháng'
                                                    : dataContract?.contract_term % 12 !== 0 ?
                                                        Math.floor(dataContract?.contract_term / 12) + ' năm ' + dataContract?.contract_term % 12 + ' tháng' :
                                                        Math.floor(dataContract?.contract_term / 12) + ' năm '}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Ngày hợp đồng có hiệu lực:</h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{moment(dataContract?.contract_start_date).format('DD-MM-YYYY')}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Ngày kết thúc: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{moment(dataContract?.contract_end_date).format('DD-MM-YYYY')}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Chu kỳ thanh toán: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>{dataContract?.contract_payment_cycle} tháng 1 lần</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Trạng thái hợp đồng: </h4>
                                            </Col>
                                            <Col span={12}>
                                                <Tag color={dataContract?.contract_is_disable ? 'red' : 'green'}>{dataContract?.contract_is_disable ? 'Hết hiệu lực' : 'Còn hiệu lực'}</Tag>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Số lượng phòng đã thuê: </h4>
                                            </Col>
                                            <Col span={12}>
                                                {dataContract?.list_lease_contracted_room?.length} / {dataContract?.total_room} phòng
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} xl={12} span={12}>
                                    <Card
                                        style={cardBellow}
                                        title={
                                            <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                                                <DollarOutlined style={{ fontSize: "120%" }} /> Giá trị hợp đồng
                                            </Tag>
                                        }
                                        bordered={true}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <h4>Giá thuê (VNĐ): </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>
                                                    <b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataContract.contract_price)}</b>
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <h4>Tiền cọc (VNĐ): </h4>
                                            </Col>
                                            <Col span={12}>
                                                <p>
                                                    <b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataContract.contract_deposit)}</b>
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24} xl={12} span={12}>
                                    <Card
                                        style={cardBellow}
                                        title={
                                            <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                                                <GoldOutlined /> Dịch vụ chung
                                            </Tag>
                                        }
                                        bordered={true}
                                    >
                                        {dataAsset?.map((obj, index) => {
                                            return (
                                                <Row>
                                                    <Col span={12}>
                                                        <h4>{obj.service_show_name}: </h4>
                                                    </Col>
                                                    <Col span={12}>
                                                        <p><b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(obj.service_price)}</b> ({obj.service_type_name})</p>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </Card>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Danh sách phòng đã thuê</span>} key="3">
                            <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} md={12} lg={8} xl={8} span={8}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Phòng chưa có hợp đồng </span>
                                            </>
                                        }
                                        value={dataContract?.list_lease_contracted_room?.filter(room => room.contract_id === null).length + "/"
                                            + dataContract?.list_lease_contracted_room?.length}
                                    />
                                </Col>
                                <Col xs={24} md={12} lg={8} xl={8} span={8}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Phòng đã có hợp đồng </span>
                                            </>
                                        }
                                        value={dataContract?.list_lease_contracted_room?.filter(room => Number.isInteger(room.contract_id)).length + "/"
                                            + dataContract?.list_lease_contracted_room?.length}
                                    />
                                </Col>
                                <Col xs={24} md={12} lg={8} xl={8} span={8}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Tổng số tiền phòng (VND) </span>
                                            </>
                                        }
                                        value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).
                                            format(dataContract?.list_lease_contracted_room?.map((obj, index) => obj.room_price)?.reduce(
                                                (previousValue, currentValue) => previousValue + currentValue, 0))}
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <Row>
                                <span>Tìm kiếm theo tầng </span>
                            </Row>
                            <Row style={marginBottom}>
                                <Col xs={16} md={9} lg={7} xl={5}>
                                    <Select
                                        onChange={(e) => {
                                            setRoomFloor(e);
                                        }}
                                        defaultValue={""}
                                        options={optionFloor}
                                        placeholder="Chọn tầng"
                                        style={{ width: "100%" }}>
                                    </Select>
                                </Col>
                            </Row>
                            <Table
                                bordered
                                dataSource={dataContract?.list_lease_contracted_room?.filter(obj => roomFloor === "" ? obj : obj.room_floor === roomFloor)?.map(room => {
                                    return {
                                        room_id: room.room_id,
                                        roomName: room.room_name,
                                        roomFloor: room.room_floor,
                                        roomPrice: room.room_price,
                                        roomSquare: room.room_area,
                                        roomStatus: room.contract_id === null ? false : true
                                    }
                                })}
                                scroll={{ x: 1000, y: 800 }}
                                columns={columns}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                    <Button onClick={() => {
                        Modal.confirm({
                            title: `Bạn có chắc chắn muốn kết thúc hợp đồng ${dataContract?.group_name} ?`,
                            okText: "Có",
                            cancelText: "Hủy",
                            onOk: () => {
                                onDeleteGroupContract(dataContract?.contract_id)
                            },
                        });
                    }} style={{ marginTop: '3%' }} type='danger' icon={<DeleteOutlined />}>Kết thúc hợp đồng</Button>
                </Modal>
            </div>
        </>
    );
}

export default DeleteContractBuilding;
