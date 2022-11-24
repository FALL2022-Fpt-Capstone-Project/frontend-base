import { Form, Input, Radio, Select, Switch, Layout, Button, Row, Col, Table, Statistic, Card, Divider, InputNumber, Typography, Popconfirm } from "antd";
import React, { useState } from 'react';
import "./room.scss";
import {
    ArrowLeftOutlined,
    MinusCircleFilled,
    DeleteOutlined
} from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const style = {
    marginBottom: "2%",
};
const textSize = {
    fontSize: 15,
};
const iconSize = {
    fontSize: "130%",
    marginRight: "8%",
};
const iconRed = {
    fontSize: "130%",
    color: 'red'
};

const dataSource = [];
for (let i = 1; i < 10; i++) {
    dataSource.push({
        id: i,
        roomName: `A10${i}`,
        roomFloor: i,
        roomPrice: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(i * 1000000),
        roomLimitPeople: 3,
        roomSquare: '25 m2',
        roomStatus: i % 2 === 0 ? true : false
    });
}
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = dataIndex === 'roomPrice'
        || dataIndex === 'roomFloor'
        || dataIndex === 'roomSquare'
        || dataIndex === 'roomLimitPeople' ? <InputNumber style={{ width: '100%' }} controls={false} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={dataIndex === 'roomName' ? [
                        {
                            required: true,
                            whitespace: true,
                            message: `Không để trống ${title}!`,
                        },
                    ] : [
                        {
                            required: true,
                            message: `Không để trống ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function RoomPreview(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();
    const [data, setData] = useState(dataSource);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const cancel = () => {
        setEditingKey('');
    };
    const edit = (record) => {
        console.log(record);
        form.setFieldsValue({
            roomName: '',
            roomFloor: '',
            roomPrice: '',
            roomLimitPeople: '',
            roomSquare: '',
            roomStatus: '',
            ...record,
        });
        setEditingKey(record.id);
    };
    const save = async (id) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            console.log(newData);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData.map((obj, index) => {
                    if (obj.id === id) {
                        return {
                            ...obj,
                            roomPrice: obj.roomPrice.toString().includes("₫") ? obj.roomPrice : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(obj.roomPrice),
                            roomSquare: obj.roomSquare.toString().includes('m2') ? obj.roomSquare : obj.roomSquare + ' m2'
                        }
                    } else {
                        return obj
                    }
                }));
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'roomName',
            key: 'id',
            editable: true,
        },
        {
            title: 'Tầng',
            dataIndex: 'roomFloor',
            key: 'id',
            editable: true,
        },
        {
            title: 'Giá phòng',
            dataIndex: 'roomPrice',
            key: 'id',
            editable: true,
        },
        {
            title: 'Số lượng người tối đa',
            dataIndex: 'roomLimitPeople',
            key: 'id',
            editable: true,
        },
        {
            title: 'Diện tích',
            dataIndex: 'roomSquare',
            key: 'id',
            editable: true,
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy" onConfirm={cancel}>
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Sửa
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div className="update-staff">
            <Layout
                style={{
                    minHeight: "100vh",
                    minWidth: '100vh'
                }}
            >
                <Sider width={250}>
                    <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                    <Sidebar />
                </Sider>
                <Layout className="site-layout">
                    <Header className="layout-header">
                        <p className="header-title">Xem trước tạo mới phòng nhanh</p>
                    </Header>
                    <Content className="layout-content">
                        <Breadcrumbs />
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
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
                                <Col xs={24} lg={24} xl={7} span={7}>
                                    <Card
                                        className="card-w100-h100"
                                        title={<p className="text-card">Thông tin bạn đã nhập để tạo mới nhanh</p>}
                                        bordered={false}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <p>Tên chung cư: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>Trọ xanh </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Địa chỉ: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>Hữu Quan - Dương Quan - Thủy Nguyên - Hải Phòng </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Tầng đã chọn: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Số lượng phòng mỗi tầng: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>10</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Tên quy ước: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>A</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Giá phòng chung: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>3.000.000đ</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Số lượng người tối đa: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>3</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <p>Diện tích mỗi phòng: </p>
                                            </Col>
                                            <Col span={12}>
                                                <p>25m2</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24} lg={24} xl={17} span={17}>
                                    <Card
                                        className="card-w100-h100"
                                        title="Danh sách phòng"
                                        bordered={false}
                                    >
                                        <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                            <Col span={12}>
                                                <Statistic
                                                    title={
                                                        <>
                                                            <span style={textSize}>Tổng số phòng </span>
                                                            {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: "50%" }}></Button> */}
                                                        </>
                                                    }
                                                    value={9}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title={
                                                        <>
                                                            <span style={textSize}>Tổng số tiền phòng (VND) </span>
                                                        </>
                                                    }
                                                    value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(45000000)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <p><i>Hiển thị danh sách phòng theo số liệu bạn đã nhập</i></p>
                                            </Col>
                                        </Row>
                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={style}>
                                            <Col xs={24} sm={12} xl={10} span={10}>
                                                <Input.Search
                                                    placeholder="Nhập tên phòng hoặc tên chung cư để tìm kiếm" />
                                            </Col>
                                            <Col span={14}>
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '100%' }}
                                                    placeholder="Chọn tầng"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={[
                                                        {
                                                            label: 'Tầng 1',
                                                            value: 1,
                                                        },
                                                        {
                                                            value: 2,
                                                            label: 'Tầng 2',
                                                        },
                                                        {
                                                            value: 3,
                                                            label: 'Tầng 3',
                                                        },
                                                        {
                                                            value: 4,
                                                            label: 'Tầng 4',
                                                        },
                                                        {
                                                            value: 5,
                                                            label: 'Tầng 5',
                                                        },
                                                        {
                                                            value: 6,
                                                            label: 'Tầng 6',
                                                        },

                                                    ]}></Select>
                                            </Col>
                                        </Row>
                                        <Form form={form} component={false}>
                                            <Table
                                                components={{
                                                    body: {
                                                        cell: EditableCell,
                                                    },
                                                }}
                                                rowSelection={rowSelection}
                                                rowKey={(record) => record.id}
                                                columns={mergedColumns}
                                                dataSource={data}
                                                bordered
                                                rowClassName={(record) => record.roomStatus ? 'data-row active-row' : 'data-row'}
                                                scroll={{ x: 800, y: 600 }}></Table>
                                        </Form>
                                        <Row>
                                            <Col span={24}>
                                                <span>
                                                    <MinusCircleFilled style={iconRed} /> Phòng đã tồn tại
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Button icon={<DeleteOutlined style={{ fontSize: "130%", color: "red" }} />}>Xóa phòng đã tồn tại</Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Button
                                        type="primary"
                                        size="default"
                                        style={{ marginTop: "1%", float: "left" }}
                                    >
                                        Tạo mới
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default RoomPreview;