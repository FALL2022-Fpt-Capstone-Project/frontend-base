import React, { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import "./service.scss";
import { Button, Col, Input, Layout, Modal, Row, Space, Table, Tag } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Form } from 'react-router-dom';
function Service(props) {
    const { Content, Sider, Header } = Layout;
    const [componentSize, setComponentSize] = useState('default');
    const [addServiceStatus, setAddServiceStatus] = useState(false);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Đơn giá (VNĐ)',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Ngày tạo',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
    const onlickAddService = () => {
        setAddServiceStatus(true);
        console.log('Them moi');
    };
    return (
        <div className="service">
            <Layout
                style={{
                    minHeight: "100vh",
                    minWidth: "100vh",
                    overflow: "auto",
                }}>
                <Sider width={250}>
                    <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                    <Sidebar />
                </Sider>
                <Layout className="site-layout">
                    <Header className="layout-header">
                        <p className="header-title">Danh sách dịch vụ</p>
                    </Header>
                    <Content style={{ margin: "10px 16px" }} >
                        <div
                            className="site-layout-background"
                            style={{
                                minHeight: 360,
                                overflow: "auto",
                            }}>
                            <Row>
                                <Col span={24}>
                                    <Button type="primary" style={{ marginBottom: '1%', float: 'right' }}
                                        onClick={onlickAddService} icon={<PlusCircleOutlined style={{ fontSize: 15, }} />}>
                                        Thêm mới
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Table columns={columns} dataSource={data}
                                        scroll={{ x: 800, y: 600 }}
                                    />
                                </Col>
                            </Row>
                            <Modal
                                title="Chỉnh sửa tài sản trong phòng"
                                visible={addServiceStatus}
                                onCancel={() => {
                                    setAddServiceStatus(false);
                                }}
                                onOk={() => {
                                    setAddServiceStatus(false);
                                }}
                                width={500}
                                footer={[
                                    <Button style={{ overflow: "auto" }} htmlType="submit" key="submit" form="add-service" type="primary">
                                        Thêm mới
                                    </Button>,
                                    <Button key="back" onClick={() => {
                                        setAddServiceStatus(false);
                                    }}>
                                        Huỷ
                                    </Button>,
                                ]} >
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default Service;