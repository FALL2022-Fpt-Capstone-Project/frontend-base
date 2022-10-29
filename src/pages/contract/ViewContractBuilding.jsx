import { Button, Card, Checkbox, Col, Input, Modal, Row, Table, Tabs, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, UserOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ViewContractBuilding({ openView, closeView, dataContract }) {

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

    return (
        <>
            <div>
                <Modal title="Xem hợp đồng chung cư mini/căn hộ" width={1200} open={openView} onOk={handleOk} onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={() => {
                            closeView(false)
                        }}>
                            Đóng
                        </Button>,
                    ]}>
                    <Row>
                        <Col>Tên chung cư</Col>
                    </Row>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Thông tin chung" key="1">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Card title={<Tag color="blue"><h3>Thông tin người cho thuê</h3></Tag>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Họ và tên:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Lê Văn Luyện</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Số điện thoại:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>0345422402</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Email:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>example@gmail.com</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>CCCD/CMND:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>012345678911</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title={<Tag color="blue"><h3>Thông tin chung cư mini/căn hộ</h3></Tag>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Tên chung cư/căn hộ:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>trọ xanh</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Địa chỉ:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>Hà nội</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Thời hạn hợp đồng:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>6 tháng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Ngày hợp đồng có hiệu lực:</b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>29/10/2022</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Ngày kết thúc: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>29/10/2023</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Trạng thái hợp đồng: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <Tag color="green">Còn hiệu lực</Tag>| <Tag color="red">Hết hiệu lực</Tag>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Số lượng tầng: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>10 tầng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Số lượng phòng: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p>50 phòng</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Số lượng phòng đã cho thuê: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <Tag color="green">30/50 phòng</Tag> | <Tag color="red">50/50 phòng</Tag>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Card title={<Tag color="blue"><h3>Giá trị hợp đồng</h3></Tag>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Giá thuê (VNĐ): </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>300.000.000đ</b></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Tiền cọc (VNĐ): </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>50.000.000đ</b></p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title={<Tag color="blue"><h3>Dịch vụ chung của tòa nhà</h3></Tag>} bordered={false}>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Dịch vụ điện: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>3.500đ</b></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={10}>
                                                <h4><b>Dịch vụ nước: </b></h4>
                                            </Col>
                                            <Col span={14}>
                                                <p><b>30.000đ</b></p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Tài sản đã bàn giao" key="2">
                            <Row>
                                <div style={{ overflow: 'auto' }}>
                                    <h3><b>Thông tin các tài sản đã bàn giao </b></h3>
                                </div>
                            </Row>
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
                                            <b>Loại tài sản:</b>
                                        </Col>
                                        <Col span={21}>
                                            <Row>
                                                <Checkbox.Group>
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
                        // navigate(`/contract-renter/edit/${dataContract.contract_id}`)
                    }} style={{ marginTop: '1%' }} type='primary' icon={<ArrowRightOutlined />}>Chỉnh sửa thông tin hợp đồng</Button>
                </Modal>
            </div>
        </>
    );
}

export default ViewContractBuilding;