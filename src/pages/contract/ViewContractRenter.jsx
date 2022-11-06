import { Button, Card, Checkbox, Col, Input, Modal, Row, Table, Tabs, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, UserOutlined, FilterOutlined, AuditOutlined, DollarOutlined, GoldOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const LIST_ASSET_TYPE = "manager/asset/type";
const APARTMENT_DATA_GROUP = "manager/contract/room/";

function ViewContractRenter({ openView, closeView, dataContract }) {
    const [dataAsset, setDataAsset] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState("");
    const [filterAssetType, setFilterAssetType] = useState([]);
    const [assetStatus, setAssetStatus] = useState([]);
    const [listAssetType, setListAssetType] = useState([]);
    const navigate = useNavigate();

    const dataFilter = {
        id: [],
        asset_type: []
    };

    const handleOk = () => {
        closeView(false)
    };
    const handleCancel = () => {
        closeView(false)
    };
    useEffect(() => {
        apartmentGroup();
    }, []);

    const columns = [
        {
            title: 'Tên tài sản',
            dataIndex: 'asset_name',
            key: 'asset_id',
            filteredValue: [searched],
            onFilter: (value, record) => {
                return (
                    String(record.asset_name).toLowerCase()?.includes(value.toLowerCase())
                );
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'hand_over_asset_quantity',
            key: 'asset_id',
        },
        {
            title: 'Loại',
            dataIndex: 'asset_type_show_name',
            filters: [
                { text: 'Phòng ngủ', value: 'Phòng ngủ' },
                { text: 'Phòng khách', value: 'Phòng khách' },
                { text: 'Phòng bếp', value: 'Phòng bếp' },
                { text: 'Phòng tắm', value: 'Phòng tắm' },
                { text: 'Khác', value: 'Khác' },
            ],
            filteredValue: filterAssetType.asset_type_show_name || null,
            onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
        },
        {
            title: 'Thời gian',
            dataIndex: 'hand_over_asset_date_delivery',
            key: 'asset_id',
            render: (hand_over_asset_date_delivery) => {
                return new Date(hand_over_asset_date_delivery).toLocaleDateString();
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'hand_over_asset_status',
            filters: [
                { text: 'Tốt', value: true },
                { text: 'Hỏng', value: false },
            ],
            filteredValue: assetStatus.hand_over_asset_status || null,
            onFilter: (value, record) => record.hand_over_asset_status === value,
            render: (status) => {
                return (
                    <>
                        <Tag color={status ? "success" : "error"}>{status ? 'Tốt' : 'Hỏng'}</Tag>
                    </>
                )
            }
        },
    ];

    const apartmentGroup = async () => {
        let cookie = localStorage.getItem("Cookie");
        setLoading(true);
        await axios
            .get(APARTMENT_DATA_GROUP, {
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${cookie}`,
                },
                // withCredentials: true,
            })
            .then((res) => {
                setDataAsset(res.data.body.list_hand_over_assets.map((obj, index) => [
                    {
                        asset_id: obj.asset_id,
                        asset_name: obj.asset_name,
                        asset_type: obj.asset_type,
                        hand_over_asset_date_delivery: new Date(obj.hand_over_asset_date_delivery).toLocaleDateString(),
                        asset_type_show_name: obj.asset_type_show_name,
                        hand_over_asset_quantity: 1,
                        hand_over_asset_status: obj.hand_over_asset_status,
                    }
                ][0]));
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }

    useEffect(() => {
        getAssetType();
    }, []);

    const getAssetType = async () => {
        let cookie = localStorage.getItem("Cookie");
        await axios
            .get(LIST_ASSET_TYPE, {
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${cookie}`,
                },
                // withCredentials: true,
            })
            .then((res) => {
                setListAssetType(res.data.body);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    // console.log(contractInfor);
    return (
        <>
            <div>
                <Modal title={<h2>{dataContract?.contract_name}</h2>} width={1200} open={openView} onOk={handleOk} onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={() => {
                            closeView(false)
                        }}>
                            Đóng
                        </Button>,
                    ]}>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Thông tin chung</span>} key="1">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Card style={{ wordBreak: 'break-all', whiteSpace: 'normal', height: 'auto' }}
                                        title={
                                            <>
                                                <Tag style={{ fontSize: '15px', color: 'black' }} color="blue">
                                                    <UserOutlined style={{ fontSize: '120%' }} /> Thông tin khách thuê
                                                </Tag>
                                            </>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Họ và tên:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>{dataContract?.renter_name}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Giới tính:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nam</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Số điện thoại:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>0345422402</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>CCCD/CMND:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>012345678911</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Email:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>example@gmail.com</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card style={{ wordBreak: 'break-all', whiteSpace: 'normal', height: 'auto' }}
                                        title={
                                            <>
                                                <Tag style={{ fontSize: '15px', color: 'black' }} color="blue">
                                                    <AuditOutlined style={{ fontSize: '120%' }} /> Thông tin hợp đồng
                                                </Tag>
                                            </>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Phòng cho thuê:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Tầng 2 phòng 201</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Thời hạn hợp đồng:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>1 tháng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Ngày hợp đồng có hiệu lực:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>{new Date(dataContract?.contract_start_date).toLocaleDateString()}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Ngày kết thúc: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>{new Date(dataContract?.contract_end_date).toLocaleDateString()}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Trạng thái hợp đồng: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <Tag color="green">Còn hiệu lực</Tag>| <Tag color="red">Hết hiệu lực</Tag>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Chu kỳ thanh toán:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>{dataContract?.contract_bill_cycle} tháng 1 lần</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Thời gian thu tiền:</h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Ngày {dataContract?.contract_payment_cycle} hàng tháng</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Card style={{ wordBreak: 'break-all', whiteSpace: 'normal', height: 'auto' }}
                                        title={
                                            <Tag style={{ fontSize: '15px', color: 'black' }} color="blue"><DollarOutlined style={{ fontSize: '120%' }} /> Giá trị hợp đồng</Tag>
                                        } bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Tiền phòng (VNĐ): </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataContract.contract_price)}</b></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Tiền cọc (VNĐ): </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataContract.contract_deposit)}</b></p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card style={{ wordBreak: 'break-all', whiteSpace: 'normal', height: 'auto' }}
                                        title={
                                            <Tag style={{ fontSize: '15px', color: 'black' }} color="blue"><GoldOutlined /> Dịch vụ sử dụng</Tag>
                                        } bordered={false}>
                                        {dataContract?.list_hand_over_services?.map((obj, index) => {
                                            return (
                                                <Row>
                                                    <Col span={10}>
                                                        <h4>{obj.service_show_name}: </h4>
                                                    </Col>
                                                    <Col span={14}>
                                                        <p><b>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(obj.service_price)}</b> ({obj.service_type_name})</p>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </Card>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Thành viên trong phòng</span>} key="2">
                            <Row>
                                <div style={{ overflow: 'auto' }}>
                                    <h3>Số lượng thành viên trong phòng: (3/4)</h3>
                                </div>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col>
                                    <Card
                                        style={{
                                            width: 300,
                                        }}
                                        cover={
                                            <UserOutlined style={{ fontSize: '500%' }} />
                                        }
                                        bordered
                                    >
                                        <Row>
                                            <Col span={10}>
                                                <h4>Họ và tên: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nguyễn Đức Pháp</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Giới tính: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nam</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Số điện thoại: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>0123456789</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>CCCD/CMND: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>012345678911</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Địa chỉ: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Hữu Quan, Dương Quan, Thủy Nguyên, Hải Phòng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Biển số xe: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>16P1-7433</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        style={{
                                            width: 300,
                                        }}
                                        cover={
                                            <UserOutlined style={{ fontSize: '500%' }} />
                                        }
                                        bordered
                                    >
                                        <Row>
                                            <Col span={10}>
                                                <h4>Họ và tên: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nguyễn Đức Pháp</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Giới tính: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nam</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Số điện thoại: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>0123456789</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>CCCD/CMND: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>012345678911</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Địa chỉ: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Hữu Quan, Dương Quan, Thủy Nguyên, Hải Phòng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Biển số xe: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>16P1-7433</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card
                                        style={{
                                            width: 300,
                                        }}
                                        cover={
                                            <UserOutlined style={{ fontSize: '500%' }} />
                                        }
                                        bordered
                                    >
                                        <Row>
                                            <Col span={10}>
                                                <h4>Họ và tên: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nguyễn Đức Pháp</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Giới tính: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Nam</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Số điện thoại: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>0123456789</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>CCCD/CMND: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>012345678911</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Địa chỉ: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Hữu Quan, Dương Quan, Thủy Nguyên, Hải Phòng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4>Biển số xe: </h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>16P1-7433</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Tài sản đã bàn giao</span>} key="3">
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={8}>
                                            <Input.Search placeholder="Nhập tên tài sản để tìm kiếm" style={{ marginBottom: 8 }}
                                                onSearch={(e) => {
                                                    setSearched(e);
                                                }}
                                                onChange={(e) => {
                                                    setSearched(e.target.value);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={3}>
                                            <FilterOutlined style={{ fontSize: '150%' }} />
                                            Loại tài sản:
                                        </Col>
                                        <Col span={21}>
                                            <Row>
                                                <Checkbox.Group options={listAssetType?.map((obj, index) => { return obj.asset_type_show_name })}
                                                    onChange={(checkedValues) => {
                                                        dataFilter.asset_type_show_name = checkedValues;
                                                        setFilterAssetType(dataFilter);
                                                    }}
                                                >
                                                </Checkbox.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            bordered
                                            onChange={(pagination, filters, sorter, extra) => {
                                                setFilterAssetType(filters);
                                                setAssetStatus(filters)
                                            }}
                                            dataSource={dataContract?.list_hand_over_assets}
                                            columns={columns}
                                            scroll={{ x: 800, y: 600 }}
                                            loading={loading}
                                        >
                                        </Table>
                                    </Row>
                                </Col>
                            </Row>
                            <Row></Row>
                        </Tabs.TabPane>
                    </Tabs>
                    <Button onClick={() => {
                        navigate(`/contract-renter/edit/${dataContract?.contract_id}`);
                    }} style={{ marginTop: '1%' }} type='primary' icon={<ArrowRightOutlined />}> Chỉnh sửa thông tin hợp đồng</Button>
                </Modal>
            </div>
        </>
    );
}

export default ViewContractRenter;