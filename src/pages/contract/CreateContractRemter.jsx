import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Form, Table, Space, Input, Select, Tabs, Row, Col, Radio, DatePicker, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const CreateContractRenter = () => {
    return (
        <div className="contract">
            <Layout
                style={{
                    minHeight: "100vh",
                }}
            >
                <Sider width={250}>
                    <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                    <Sidebar />
                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="layout-header"
                        style={{
                            margin: "0 16px",
                        }}
                    >
                        <p className="header-title">Thêm hợp đồng mới</p>
                    </Header>
                    <Content
                        style={{
                            margin: "10px 16px",
                        }}
                    >
                        <div
                            className="site-layout-background"
                            style={{
                                minHeight: 360,
                            }}
                        >
                            <Button style={{ float: "right" }}>Lưu</Button>
                            <Button style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Thông tin hợp đồng" key="1">
                                    <Row>
                                        <Col span={12}>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Tên hợp đồng">
                                                </Input>
                                            </Row>
                                            <Row>
                                                <p><b>Thông tin hợp đồng với khách: </b></p>
                                            </Row>
                                            <Row>
                                                <p><i>Các thông tin về khách và tiền cọc</i></p>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Tên khách thuê">
                                                </Input>
                                            </Row>
                                            <Row>
                                                <Radio.Group>
                                                    <Radio value={1}>Nam</Radio>
                                                    <Radio value={2}>Nữ</Radio>
                                                </Radio.Group>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Button>Khách cũ</Button>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Số điện thoại">
                                                </Input>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Gmail">
                                                </Input>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="CCCD/CMND">
                                                </Input>
                                            </Row>
                                            <Row style={{ width: "50%", marginBottom: 10 }}>
                                                <Col span={12}>
                                                    <Select placeholder="Chọn tầng" style={{ width: "90%" }}>
                                                        <Option value="">Tầng 1</Option>
                                                        <Option value="">Tầng 2</Option>
                                                    </Select>
                                                </Col>
                                                <Col span={12}>
                                                    <Select placeholder="Chọn phòng" style={{ width: "100%" }}>
                                                        <Option value="">201C</Option>
                                                        <Option value="">203C</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Row style={{ width: "50%", marginBottom: 10 }}>
                                                <Select placeholder="Thời hạn hợp đồng" style={{ width: "100%" }}>
                                                    <Option value="">6 tháng</Option>
                                                    <Option value="">1 năm</Option>
                                                </Select>
                                            </Row>
                                            <Row style={{ width: "50%", marginBottom: 10 }}>
                                                <Col span={12}>
                                                    <DatePicker placeholder="Ngày vào ở" style={{ width: "90%" }} />
                                                </Col>
                                                <Col span={12}>
                                                    <DatePicker placeholder="Ngày kết thúc" style={{ width: "100%" }} />
                                                </Col>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <TextArea rows={4} style={{ width: "50%" }} placeholder="Ghi chú" />
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            <Row>
                                                <p><b>Thông tin giá trị hợp đồng</b></p>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Giá phòng">
                                                </Input>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Input style={{ width: "50%" }}
                                                    placeholder="Số tiền cọc">
                                                </Input>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Select placeholder="Chu kỳ tính tiền" style={{ width: "50%" }}>
                                                    <Option value="">1 tháng</Option>
                                                    <Option value="">2 tháng</Option>
                                                </Select>
                                            </Row>
                                            <Row style={{ marginBottom: 10 }}>
                                                <Select placeholder="Kỳ thanh toán" style={{ width: "50%" }}>
                                                    <Option value="">kỳ 15</Option>
                                                    <Option value="">kỳ 30</Option>
                                                </Select>
                                            </Row>
                                            <Row>
                                                <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                                            </Row>
                                            <Row>
                                                <Upload>
                                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                </Upload>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <p>Lưu ý:<br />
                                        - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                                        - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                                        - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                                        - Thanh toán mỗi lần: Nhập 1,2,3 ; là số tháng được tính trên mỗi hóa đơn.<br />
                                    </p>
                                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Dịch vụ" key="2">
                                    Content of Tab Pane 2
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Thành viên" key="3">
                                    Content of Tab Pane 3
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Tài sản" key="4">
                                    <p><b>Thông tin tài sản bàn giao</b></p>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div >
    );
};

export default CreateContractRenter;
