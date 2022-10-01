import React, { useState } from 'react';
import { Layout, Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import './room.scss';
const { Content, Sider, Header } = Layout;

const originData = [];

for (let i = 0; i < 100; i++) {
    originData.push({
        index: i + 1,
        roomCode: i.toString(),
        owner: `Chu ho ${i}`,
        building: 32,
        floor: i,
        numberOfRenter: i,
        square: `${i} m2`,
        dateOfHire: `30/09/2022`,
        contractExpirationDate: `30/09/2024`,
        status: `Đang ở`,
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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập`,
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

const room = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [form] = Form.useForm();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, setData] = useState(originData);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            index: '',
            roomCode: '',
            owner: '',
            building: '',
            floor: '',
            numberOfRenter: '',
            square: '',
            dateOfHire: '',
            contractExpirationDate: '',
            status: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
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
            title: 'STT',
            dataIndex: 'index',
            width: '5%',
            editable: false,
        },
        {
            title: 'Phòng',
            dataIndex: 'roomCode',
            width: '10%',
            editable: true,
        },
        {
            title: 'Chủ hộ',
            dataIndex: 'owner',
            width: '15%',
            editable: true,
        },
        {
            title: 'Tòa',
            dataIndex: 'building',
            width: '10%',
            editable: true,
        },
        {
            title: 'Tầng',
            dataIndex: 'floor',
            width: '10%',
            editable: true,
        },
        {
            title: 'Số lượng người',
            dataIndex: 'numberOfRenter',
            width: '10%',
            editable: true,
        },
        {
            title: 'Diện tích',
            dataIndex: 'square',
            width: '10%',
            editable: true,
        },
        {
            title: 'Ngày thuê',
            dataIndex: 'dateOfHire',
            width: '10%',
            editable: false,
        },
        {
            title: 'Ngày hết hạn hợp đồng',
            dataIndex: 'contractExpirationDate',
            width: '10%',
            editable: false,
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            width: '20%',
            editable: true,
        },
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy ?" onConfirm={cancel}>
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
                inputType: col.dataIndex === 'roomCode' ? 'owner' : 'building',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="room">
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
                        <p className="header-title">Quản lý phòng</p>
                    </Header>
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
                        >
                            <Form form={form} component={false}>
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    bordered
                                    dataSource={data}
                                    columns={mergedColumns}
                                    rowClassName="editable-row"
                                    pagination={{
                                        onChange: cancel,
                                    }}
                                />
                            </Form>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default room;