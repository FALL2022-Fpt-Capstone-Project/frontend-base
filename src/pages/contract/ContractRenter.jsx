import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Form, Table, Space, Input, Select } from "antd";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const ContractRenter = () => {
    const [gridData, setGridData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editing, setEditing] = useState(null);
    let [filteredData] = useState();

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/contract-use");
        setGridData(response.data);
        setLoading(false);
    }

    const modifineData = gridData.map(({ body, ...item }) => ({
        ...item,
        key: item.id,
        message: body
    }));

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
        if (e.target.value === "") {
            loadData();
        }
    };

    const globalSearch = () => {
        filteredData = modifineData.filter((value) => {
            return (
                value.tennguoithue.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        setGridData(filteredData);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa không",
            okText: "Xóa",
            cancelText: "Hủy",
            onOk: () => {
                const dataSource = [...modifineData];
                const filteredData = dataSource.filter((item) => item.id !== record.id);
                setGridData(filteredData);
            }
        })

    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setEditing({ ...record })
    }

    const resetEditing = () => {
        setIsEditing(false);
        setEditing(null)
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "id",
        },
        {
            title: "Tên nhà",
            dataIndex: "tennha",
            align: "center",
            editTable: true
        },
        {
            title: "Tên phòng",
            dataIndex: "tenphong",
            align: "center",
            editTable: true
        },
        {
            title: "Tên khách hàng",
            dataIndex: "tennguoithue",
            align: "center",
            editTable: true
        },
        {
            title: "Số điện thoại",
            dataIndex: "sodienthoai",
            align: "center",
            editTable: true
        },
        {
            title: "Số thành viên",
            dataIndex: "sothanhvien",
            align: "center",
            editTable: true
        },
        {
            title: "Tiền cọc",
            dataIndex: "tiencoc",
            align: "center",
            editTable: false
        },
        {
            title: "Giá thuê",
            dataIndex: "giathue",
            align: "center",
            editTable: true
        },
        {
            title: "Chu kỳ thu",
            dataIndex: "chukythu",
            align: "center",
            editTable: true
        },
        {
            title: "Ngày lập",
            dataIndex: "ngaylap",
            align: "center",
            editTable: true
        },
        {
            title: "Ngày vào ở",
            dataIndex: "ngaybatdauthue",
            align: "center",
            editTable: true
        },
        {
            title: "Thời hạn",
            dataIndex: "thoihan",
            align: "center",
            editTable: true
        },
        {
            title: "Thao tác",
            dataIndex: "thaotac",
            align: "center",
            render: (_, record) =>
                modifineData.length >= 1 ? (
                    <Space>
                        <EditOutlined onClick={() => {
                            handleEdit(record)
                        }} />
                        <DeleteOutlined onClick={() => { handleDelete(record) }} style={{ color: "red", marginLeft: 12 }} />

                    </Space>
                ) : null,
        },
    ];

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
                        <p className="header-title">Quản lý hợp đồng khách thuê</p>
                    </Header>
                    <Space style={{ margin: 16 }}>
                        <Form form={form} component={false}>
                            <Input style={{ width: 300, margin: 16 }} placeholder='Tên khách hàng'
                                onChange={handleInputChange}
                                type="text"
                                allowClear
                                value={searchText}></Input>
                            <Button onClick={globalSearch} type="primary">Search</Button>
                            <Select placeholder="Tên nhà" style={{ width: 100, margin: 16 }}>

                                <Option>1</Option>
                                <Option>2</Option>
                                <Option>3</Option>
                                <Option>4</Option>

                            </Select>

                            <Table
                                style={{ width: 1065 }}
                                columns={columns}
                                dataSource={modifineData}
                                bordered
                                loading={loading}
                            ></Table>
                        </Form>
                    </Space>
                    <Content
                        style={{
                            margin: "10px 16px",
                        }}
                    >
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                minHeight: 360,
                            }}
                        ></div>
                    </Content>
                </Layout>
            </Layout>
            <Modal
                title="Chỉnh sửa hợp đồng"
                okText="Cập nhật"
                cancelText="Hủy"
                visible={isEditing}
                onCancel={() => {
                    resetEditing();
                }}
                onOk={() => {
                    setGridData(pre => {
                        return pre.map(item => {
                            if (item.id === editing.id) {
                                return editing;
                            } else {
                                return item;
                            }
                        });
                    });
                    resetEditing();
                }
                }
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    layout="horizontal"
                    scrollToFirstError
                >
                    <Form.Item label="Tên khách thuê">
                        <Input disabled={true} value={editing?.tennguoithue} />
                    </Form.Item>
                    <Form.Item label="Tên nhà">
                        <Input value={editing?.tennha} onChange={(e) => {
                            setEditing(pre => {
                                return { ...pre, tennha: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Tên phòng">
                        <Input value={editing?.tenphong} onChange={(e) => {
                            setEditing(pre => {
                                return { ...pre, tenphong: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}>
                        <Input value={editing?.sodienthoai} onChange={(e) => {
                            setEditing(pre => {
                                return { ...pre, sodienthoai: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Số thành viên">
                        <Input value={editing?.sothanhvien} onChange={(e) => {
                            setEditing(pre => {
                                return { ...pre, sothanhvien: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Tiền cọc">
                        <Input disabled={true} value={editing?.tiencoc} />
                    </Form.Item>
                    <Form.Item label="Giá thuê">
                        <Input disabled={true} value={editing?.giathue} />
                    </Form.Item>

                    <Form.Item label="Ngày lập">
                        <Input disabled={true} value={editing?.ngaylap} />
                    </Form.Item>
                    <Form.Item label="Ngày vào ở">
                        <Input disabled={true} value={editing?.ngaybatdauthue} />
                    </Form.Item>
                    <Form.Item label="Thời hạn">
                        <Input disabled={true} value={editing?.thoihan} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ContractRenter;
