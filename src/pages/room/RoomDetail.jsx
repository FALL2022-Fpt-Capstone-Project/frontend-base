import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Tag } from 'antd';
import React from 'react';
import {
    UserOutlined
} from "@ant-design/icons";
const sizeHeader = {
    fontSize: '17px'
}

const card = {
    border: '1px solid #C0C0C0',
    borderRadius: '10px',
}
const memeber = {
    border: '1px solid #C0C0C0',
    borderRadius: '10px',
    width: 300
}

function RoomDetail({ visible, close, data }) {
    return (
        <>
            <Modal
                title={<h2>Xem chi tiết phòng</h2>}
                open={visible}
                onOk={() => {
                    close(false);
                }}
                onCancel={() => {
                    close(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            close(false);
                        }}
                    >
                        Đóng
                    </Button>,
                ]}
                width={1000}
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={<span style={sizeHeader}>Thông tin chi tiết</span>} key="1">
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col xs={24} xl={12} span={12}>
                                <Card
                                    style={card}
                                    title="Thông tin phòng"
                                >
                                    <Row>
                                        <Col span={12}>
                                            <h4>Tên chung cư: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>Trọ Xanh</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Tên phòng:</h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>Phòng 201</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Giá phòng: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>3.000.000đ</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Tiền cọc: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>3.000.000đ</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Diện tích: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>30m2</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Thời hạn hợp đồng: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>6 tháng</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Ngày bắt đầu ở: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>11/11/2022</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Ngày kết thúc hợp đồng: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <p>11/05/2023</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <h4>Trạng thái phòng: </h4>
                                        </Col>
                                        <Col span={12}>
                                            <Tag color="success">Đang ở</Tag>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} xl={12} span={12}>
                                <Card
                                    style={card}
                                    title="Dịch vụ sử dụng"
                                >
                                    <Row>
                                        <Col span={10}>
                                            <h4>Dịch vụ điện: </h4>
                                        </Col>
                                        <Col span={14}>
                                            <p>5.000 ₫ (Đồng hồ điện/nước)</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span style={sizeHeader}>Thành viên trong phòng</span>} key="2">
                        <Row>
                            <div style={{ overflow: 'auto' }}>
                                <h3>Số lượng thành viên trong phòng: 1/5</h3>
                            </div>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col>
                                <Card
                                    style={memeber}
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
                                            <p>Phap</p>
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
                                            <p>0345422402</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <h4>CMND/CCCD: </h4>
                                        </Col>
                                        <Col span={14}>
                                            <p>123</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <h4>Địa chỉ: </h4>
                                        </Col>
                                        <Col span={14}>
                                            <p>Ha noi</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <h4>Biển số xe: </h4>
                                        </Col>
                                        <Col span={14}>
                                            <p>16P1 7433</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </>
    );
}

export default RoomDetail;