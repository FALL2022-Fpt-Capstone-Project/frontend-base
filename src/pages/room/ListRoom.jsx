import "./room.scss";
import {
    Modal, Table, Input, Button, DatePicker,
    Form,
    InputNumber,
    Select,
    Switch,
    Tag
} from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import moment from 'moment';
import { Link } from "react-router-dom";

function ListRoom(props) {
    const [isEdit, setisEdit] = useState(false);
    const [isAdd, setisAdd] = useState(false);
    const [editRenter, setEditRenter] = useState(null);
    const [searched, setSearched] = useState("");
    const [form] = Form.useForm();

    const validateRequired = (e) => {
        console.log(e);
        if (e.roomCode !== null && e.owner !== null && e.building !== null
            && e.floor !== null && e.numberOfRenter !== null && e.square !== null
            && e.contractExpirationDate !== null && e.dateOfHire !== null) {
            console.log('in');
            resetEditing();
        }

    }
    const renter = [];
    for (let i = 0; i < 100; i++) {
        if ((Math.floor(Math.random() * (100 - 1 + 1)) + 1) % 2 === 0) {
            renter.push({
                index: i + 1,
                roomCode: i.toString(),
                owner: `Chu ho ${i}`,
                building: `Toa nha ${Math.floor(Math.random() * (100 - 1 + 1)) + 1}`,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                numberOfRenter: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                square: `${Math.floor(Math.random() * (100 - 1 + 1)) + 1} m2`,
                dateOfHire: `30/09/2022`,
                contractExpirationDate: `30/09/2024`,
                price: `${i + 1}000000`,
                deposit: `${i + 1}000000`,
                debit: `${i + 1}000000`,
                status: true,
            });
        } else {
            renter.push({
                index: i + 1,
                roomCode: i.toString(),
                owner: null,
                building: `Toa nha ${Math.floor(Math.random() * (100 - 1 + 1)) + 1}`,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                numberOfRenter: 0,
                square: `${Math.floor(Math.random() * (100 - 1 + 1)) + 1} m2`,
                dateOfHire: null,
                contractExpirationDate: null,
                price: `${i + 1}000000`,
                deposit: `0`,
                debit: `0`,
                status: false
            });
        }
    }
    const [dataSource, setDataSource] = useState(renter);
    const columns = [
        {
            title: 'Phòng',
            dataIndex: 'roomCode',
            key: 'index',
        },
        {
            title: 'Tên chủ hộ',
            key: 'index',
            filteredValue: [searched],
            onFilter: (value, record) => {
                return (
                    String(record.owner).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.building).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.floor).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.roomCode).toLowerCase()?.includes(value.toLowerCase())
                );
            },
            render: (record) => {
                return (
                    <>
                        {record.owner !== null
                            ?
                            <div>
                                <UserOutlined />
                                <Link href="#" title={record.owner}>{record.owner}</Link>
                            </div>
                            : ''
                        }
                    </>
                )
            }

        },
        {
            title: 'Giá thuê',
            dataIndex: 'price',
            key: 'index',
            sorter: (record1, record2) => {
                return record1.price > record2.price
            },
            render: (price) => {
                return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
            }
        },
        {
            title: 'Tiền cọc',
            dataIndex: 'deposit',
            key: 'index',
            sorter: (record1, record2) => {
                return record1.deposit > record2.deposit
            },
            render: (deposit) => {
                return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deposit)}</span>
            }
        },
        {
            title: 'Tiền nợ',
            dataIndex: 'debit',
            key: 'index',
            sorter: (record1, record2) => {
                return record1.debit > record2.debit
            },
            render: (debit) => {
                return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debit)}</span>
            }
        },
        {
            title: 'Tòa',
            dataIndex: 'building',
            key: 'index',
        },
        {
            title: 'Tầng',
            dataIndex: 'floor',
            key: 'index',
        },
        {
            title: 'Số lượng người',
            dataIndex: 'numberOfRenter',
            key: 'index',
            sorter: (record1, record2) => {
                return record1.numberOfRenter > record2.numberOfRenter
            }
        },
        {
            title: 'Diện tích',
            dataIndex: 'square',
            key: 'index',
        },
        {
            title: 'Ngày thuê',
            dataIndex: 'dateOfHire',
            key: 'index',
        },
        {
            title: 'Ngày hết hạn hợp đồng',
            dataIndex: 'contractExpirationDate',
            key: 'index',
        },
        {
            title: 'Tình trạng',
            key: 'index',
            dataIndex: 'status',
            filters: [
                { text: "Đang ở", value: true },
                { text: "Đang trống", value: false }
            ],
            onFilter: (value, record) => {
                return record.status === value
            },
            render: (status) => {
                return (
                    <>
                        <Tag color={status ? "success" : "error"}>{status ? 'Đang ở' : 'Đang trống'}</Tag>
                    </>
                )
            },

        },
        {
            title: 'Thao tác',
            key: 'index',
            render: (record) => {
                return (
                    <>
                        <EditOutlined onClick={() => {
                            onEdit(record)
                        }} />
                        <DeleteOutlined onClick={() => {
                            onDelete(record)
                        }} style={{ color: "red", marginLeft: 12 }} />
                    </>
                )
            }
        }
    ];
    const onDelete = (record) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xóa phòng ${record.roomCode} này ?`,
            okText: 'Có',
            cancelText: 'Hủy',
            onOk: () => {
                setDataSource(pre => {
                    return pre.filter((renter) => renter.index !== record.index)
                })
            },
        })
    }

    const onEdit = (record) => {
        setisEdit(true);
        setEditRenter({ ...record });
        form.setFieldsValue({
            roomCode: record.roomCode,
            owner: record.owner,
            building: record.building,
            floor: record.floor,
            numberOfRenter: record.numberOfRenter,
            square: record.square,
            dateOfHire: record.dateOfHire !== null ? moment(record.dateOfHire, dateFormatList) : '',
            contractExpirationDate: record.contractExpirationDate !== null ? moment(record.contractExpirationDate, dateFormatList) : '',
            status: record.status
        });
    }
    const resetEditing = () => {
        setisEdit(false);
        setEditRenter(null);
    }

    const onAdd = (record) => {
        setisAdd(true);
    }
    const resetAdd = () => {
        setisAdd(false);
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [componentSize, setComponentSize] = useState('default');

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };
    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const mapped = dataSource.map((obj, index) => obj.building);
    const buidlingFilter = mapped.filter((type, index) => mapped.indexOf(type) === index);
    const dateFormatList = ['DD/MM/YYYY', 'YYYY/MM/DD'];
    const mappedFloor = dataSource.map((obj, index) => obj.floor);
    const floorFilter = mappedFloor.filter((type, index) => mappedFloor.indexOf(type) === index);
    const onFinish = (e) => {
        console.log(e);
    }
    return (
        <div
            className="site-layout-background"
            style={{
                padding: 0,
                minHeight: 360,
                overflow: "auto"
            }}
        >
            <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
                onSearch={(e) => {
                    setSearched(e);
                }}
                onChange={(e) => {
                    setSearched(e.target.value);
                }}
            />
            <Button type="primary" size="default" style={{ float: "right" }}
                onClick={() => {
                    onAdd()
                }} icon={<PlusOutlined />}>
                Thêm Phòng
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: 1600, y: 600 }} width>
            </Table>
            <Modal
                title="Thêm phòng"
                visible={isAdd}
                onCancel={() => {
                    resetAdd()
                }}
                onOk={() => {
                    resetAdd()
                }}
                width={700}
            >
                <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    onValuesChange={onFormLayoutChange}
                    size={"default"}
                    width={700}
                >
                    <Form.Item label="Tên phòng">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Danh sách phòng">
                        <Select>
                            <Select.Option value="demo">Tầng</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Giá phòng">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Diện tích">
                        <Input />
                    </Form.Item>
                    <Form.Item label="DatePicker">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="InputNumber">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Switch" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Button">
                        <Button>Button</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Sửa thông tin phòng"
                visible={isEdit}
                onCancel={() => {
                    resetEditing()
                }}
                onOk={(e) => {
                    setDataSource((pre) => {
                        return pre.map(renter => {
                            if (renter.index === editRenter.index) {
                                return editRenter;
                            } else {
                                return renter;
                            }
                        });
                    });
                    if (e.owner !== null) {
                        resetEditing()
                    }
                }}
                width={700}
                footer={[
                    <Button htmlType="submit" form="editRoom" type="primary" onClick={(e) => {
                        setDataSource((pre) => {
                            return pre.map(renter => {
                                if (renter.index === editRenter.index) {
                                    return editRenter;
                                } else {
                                    return renter;
                                }
                            });
                        });
                        validateRequired(editRenter);
                    }}>
                        Lưu
                    </Button>,
                    <Button key="back" onClick={() => {
                        resetEditing()
                    }}>
                        Huỷ
                    </Button>,
                ]}>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 15,
                    }}
                    layout="horizontal"
                    initialValues={{
                        size: componentSize,
                    }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize}
                    width={1000}
                    id="editRoom"
                >
                    <Form.Item label="Phòng" name="roomCode" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập phòng",
                        },
                    ]}>
                        <Input value={editRenter?.roomCode} onChange={(e) => {
                            setEditRenter(pre => {
                                return { ...pre, roomCode: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Tên chủ hộ" name="owner" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên chủ hộ",
                        },
                        {
                            whitespace: true
                        }
                    ]}>
                        <Input value={editRenter?.owner} onChange={(e) => {
                            setEditRenter(pre => {
                                return { ...pre, owner: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Tòa" name="building" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tòa nhà",
                        },
                    ]}>
                        <Select
                            onChange={(e) => {
                                setEditRenter(pre => {
                                    return { ...pre, building: e }
                                })
                            }}
                            value={editRenter?.building}>
                            {buidlingFilter.map((obj, index) => {
                                return <Select.Option key={index} value={obj}>{obj}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tầng" name="floor" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tầng",
                        },
                    ]}>
                        <Select
                            showSearch
                            placeholder="Chọn tầng"
                            optionFilterProp="children"
                            onChange={(e) => {
                                setEditRenter(pre => {
                                    return { ...pre, floor: e }
                                })
                            }}
                            onSearch={onSearch}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            value={editRenter?.floor}
                        >
                            {floorFilter.map((obj, index) => {
                                return <Select.Option key={index} value={obj}>{obj}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Số lượng người" name="numberOfRenter" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số lượng người",
                        },
                    ]}>
                        <InputNumber min={1} onChange={(e) => {
                            setEditRenter(pre => {
                                return { ...pre, numberOfRenter: e }
                            })
                        }} value={editRenter?.numberOfRenter} />
                    </Form.Item>
                    <Form.Item label="Diện tích" name="square" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập diện tích",
                        },
                        {
                            whitespace: true
                        }
                    ]}>
                        <Input value={editRenter?.square} onChange={(e) => {
                            setEditRenter(pre => {
                                return { ...pre, square: e.target.value }
                            })
                        }} />
                    </Form.Item>
                    <Form.Item label="Ngày thuê" name="dateOfHire" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập ngày thuê",
                        },
                    ]}>
                        <DatePicker
                            value={moment(editRenter?.dateOfHire, dateFormatList)}
                            format='DD/MM/YYYY'
                            onChange={(e) => {
                                setEditRenter(pre => {
                                    return { ...pre, dateOfHire: moment(e).format('DD/MM/YYYY') }
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Ngày hết hạn hợp đồng" name="contractExpirationDate" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập ngày hết hạn hợp đồng",
                        },
                    ]}>
                        <DatePicker
                            value={moment(editRenter?.contractExpirationDate, dateFormatList)}
                            format='DD/MM/YYYY'
                            onChange={(e) => {
                                setEditRenter(pre => {
                                    return { ...pre, contractExpirationDate: moment(e).format('DD/MM/YYYY') }
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Tình trạng" name="status" valuePropName="checked" rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập ngày hết hạn hợp đồng",
                        },
                    ]}>
                        <Switch
                            checked={editRenter?.status}
                            onChange={(e) => {
                                setEditRenter(pre => {
                                    return { ...pre, status: e }
                                })
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ListRoom;