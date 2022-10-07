import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Form, Table, Space, Input, Select, Tabs, Row, Col, Radio, DatePicker, Upload, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const CreateContractRenter = () => {
    const asset = [];
    const [searched, setSearched] = useState("");
    for (let i = 0; i < 100; i++) {
        if ((Math.floor(Math.random() * (100 - 1 + 1)) + 1) % 2 === 0) {
            asset.push({
                index: i + 1,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                roomCode: i.toString(),
                assetName: `Tài sản ${1}`,
                numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                dateOfDelivery: `30/09/2022`,
                status: true,
            });
        } else {
            asset.push({
                index: i + 1,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                roomCode: i.toString(),
                assetName: `Tài sản ${1}`,
                numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                dateOfDelivery: `30/09/2022`,
                status: false,
            });
        }
    }
    const [dataSource, setDataSource] = useState(asset);
    const columns = [
        {
            title: 'Tầng',
            dataIndex: 'floor',
            key: 'index',
        },
        {
            title: 'Phòng',
            dataIndex: 'roomCode',
            key: 'index',
        },
        {
            title: 'Tên tài sản',
            dataIndex: 'assetName',
            key: 'index',
        },
        {
            title: 'Số lượng',
            dataIndex: 'numberOfAsset',
            key: 'index',
        },
        {
            title: 'Ngày bàn giao',
            dataIndex: 'dateOfDelivery',
            key: 'index',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'index',
            render: (status) => {
                return (
                    <>
                        <Tag color={status ? "success" : "error"}>{status ? 'Tốt' : 'Hỏng'}</Tag>
                    </>
                )
            }
        }
    ];
    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    return (
        <div className="contract">
            <Layout
                style={{
                    minHeight: "100vh",
                    minWidth: "100vh"
                }}
            >
                <Sider width={250}>
                    <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                    <Sidebar />
                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="layout-header"
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
                            <Row>
                                <Button style={{ float: "right" }}>Lưu</Button>
                                <Button style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
                            </Row>
                            <Row>
                                <Tabs defaultActiveKey="1">
                                    <Tabs.TabPane tab="Thông tin hợp đồng" key="1">
                                        <Row>
                                            <Col span={12} style={{ paddingRight: "10%" }}>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Input
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
                                                    <Input
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
                                                    <Input
                                                        placeholder="Số điện thoại">
                                                    </Input>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Input
                                                        placeholder="Gmail">
                                                    </Input>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Input
                                                        placeholder="CCCD/CMND">
                                                    </Input>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Col span={12}>
                                                        <Select placeholder="Chọn tầng" style={{ width: "95%" }}>
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
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Select placeholder="Thời hạn hợp đồng" style={{ width: "100%" }}>
                                                        <Option value="">6 tháng</Option>
                                                        <Option value="">1 năm</Option>
                                                    </Select>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Col span={12}>
                                                        <DatePicker placeholder="Ngày vào ở" style={{ width: "95%" }} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <DatePicker placeholder="Ngày kết thúc" style={{ width: "100%" }} />
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <TextArea rows={4} placeholder="Ghi chú" />
                                                </Row>
                                            </Col>
                                            <Col span={12} style={{ paddingRight: "10%" }}>
                                                <Row>
                                                    <p><b>Thông tin giá trị hợp đồng</b></p>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Input
                                                        placeholder="Giá phòng">
                                                    </Input>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Input
                                                        placeholder="Số tiền cọc">
                                                    </Input>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Select placeholder="Chu kỳ tính tiền" style={{ width: "100%" }}>
                                                        <Option value="">1 tháng</Option>
                                                        <Option value="">2 tháng</Option>
                                                    </Select>
                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>
                                                    <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
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
                                        <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: 500 }}
                                            onSearch={(e) => {
                                                setSearched(e);
                                            }}
                                            onChange={(e) => {
                                                setSearched(e.target.value);
                                            }}
                                        />
                                        <Table
                                            dataSource={dataSource}
                                            columns={columns}>
                                        </Table>
                                    </Tabs.TabPane>
                                </Tabs>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div >
    );
};

export default CreateContractRenter;
