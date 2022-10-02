import Sidebar from "../../components/sidebar/Sidebar";
import "./room.scss";
import {
    Layout, Modal, Table, Input, Button, DatePicker,
    Form,
    InputNumber,
    Select,
    Switch,
    Tag,
    Anchor,
    Alert,
} from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from 'moment';
import EditRoom from "./EditRoom";
import { Link } from "react-router-dom";
const { Content, Sider, Header } = Layout;

function room(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isEdit, setisEdit] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAdd, setisAdd] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [editRenter, setEditRenter] = useState(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [searched, setSearched] = useState("");
    const renter = [];
    // const renter = [{
    //     index: 1,
    //     roomCode: 'A201C',
    //     owner: `Nguyen Duc Phap`,
    //     building: 'Toa nha 15',
    //     floor: 10,
    //     numberOfRenter: 3,
    //     square: `500m2`,
    //     dateOfHire: `30/09/2022`,
    //     contractExpirationDate: `30/09/2023`,
    //     price: '2000000',
    //     deposit: '2000000',
    //     debit: '2000000',
    //     status: true
    // },
    // {
    //     index: 2,
    //     roomCode: 'B201C',
    //     owner: `Nguyen Duc Phanh`,
    //     building: 'Toa nha 16',
    //     floor: 5,
    //     numberOfRenter: 4,
    //     square: `600m2`,
    //     dateOfHire: `30/08/2022`,
    //     contractExpirationDate: `30/08/2025`,
    //     price: '2000000',
    //     deposit: '2000000',
    //     debit: '2000000',
    //     status: true
    // },
    // {
    //     index: 3,
    //     roomCode: 'C201',
    //     owner: `Nguyen Duc Xo`,
    //     building: 'Toa nha 16',
    //     floor: 5,
    //     numberOfRenter: 5,
    //     square: `600m2`,
    //     dateOfHire: `30/08/2022`,
    //     contractExpirationDate: `30/08/2027`,
    //     price: '2000000',
    //     deposit: '2000000',
    //     debit: '2000000',
    //     status: true
    // },
    // {
    //     index: 4,
    //     roomCode: 'D201',
    //     owner: null,
    //     building: 'Toa nha 19',
    //     floor: 5,
    //     numberOfRenter: 0,
    //     square: `600m2`,
    //     dateOfHire: null,
    //     contractExpirationDate: null,
    //     price: '2000000',
    //     deposit: '2000000',
    //     debit: '2000000',
    //     status: false
    // }
    // ];
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
                deposit: 0,
                debit: 0,
                status: false
            });
        }
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataSource, setDataSource] = useState(renter);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
        },
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
                // <Anchor></Anchor>
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
            title: 'Giá nợ',
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const [toggle, setToggle] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mappedRoom = dataSource.map((obj, index) => obj.roomCode);
    const roomFilter = mappedRoom.filter((type, index) => mappedRoom.indexOf(type) === index);
    console.log(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(2000000));
    return (
        <div className="building">
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
                                padding: 0,
                                minHeight: 360,
                            }}
                        >
                            {/* <Alert message="Success Text" type="success" />
                            <Alert message="Error Text" type="error" /> */}
                            <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: 500 }}
                                onSearch={(e) => {
                                    setSearched(e);
                                }}
                                onChange={(e) => {
                                    setSearched(e.target.value);
                                }}
                            />
                            <Button type="primary" size="default" style={{ float: "right", width: 150 }}
                                onClick={() => {
                                    onAdd()
                                }}>
                                Thêm phòng
                            </Button>
                            <Table
                                dataSource={dataSource}
                                columns={columns}>
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

                            </Modal>
                            <Modal
                                title="Sửa thông tin phòng"
                                visible={isEdit}
                                onCancel={() => {
                                    resetEditing()
                                }}
                                onOk={() => {
                                    setDataSource((pre) => {
                                        return pre.map(renter => {
                                            if (renter.index === editRenter.index) {
                                                return editRenter;
                                            } else {
                                                return renter;
                                            }
                                        });
                                    });
                                    resetEditing()
                                }}
                                width={700}
                                footer={[
                                    <Button htmlType="submit" form="createBuilding" type="primary" onClick={() => {
                                        setDataSource((pre) => {
                                            return pre.map(renter => {
                                                if (renter.index === editRenter.index) {
                                                    return editRenter;
                                                } else {
                                                    return renter;
                                                }
                                            });
                                        });
                                        resetEditing()
                                    }}>
                                        Lưu
                                    </Button>,
                                    <Button key="back" onClick={() => {
                                        resetEditing()
                                    }}>
                                        Huỷ
                                    </Button>,
                                ]}>

                                {/* <Input value={editRenter?.roomCode} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, roomCode: e.target.value }
                                    })
                                }}></Input>
                                <Input value={editRenter?.owner} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, owner: e.target.value }
                                    })
                                }}></Input>
                                <Input value={editRenter?.building} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, building: e.target.value }
                                    })
                                }}></Input>
                                <Input value={editRenter?.floor} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, floor: e.target.value }
                                    })
                                }}></Input>
                                <Input value={editRenter?.numberOfRenter} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, numberOfRenter: e.target.value }
                                    })
                                }}></Input>
                                <Input value={editRenter?.square} onChange={(e) => {
                                    setEditRenter(pre => {
                                        return { ...pre, square: e.target.value }
                                    })
                                }}></Input> */}
                                <Form
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
                                >
                                    <Form.Item label="Phòng" rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập phòng",
                                        },
                                    ]}>
                                        <Select
                                            showSearch
                                            placeholder="Chọn phòng"
                                            optionFilterProp="children"
                                            onChange={(e) => {
                                                setEditRenter(pre => {
                                                    return { ...pre, roomCode: e }
                                                })
                                            }}
                                            onSearch={onSearch}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            value={editRenter?.roomCode}
                                        >
                                            {roomFilter.map((obj, index) => {
                                                return <Select.Option key={index} value={obj}>{obj}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Tên chủ hộ" rules={[
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
                                    <Form.Item label="Tòa" rules={[
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
                                    <Form.Item label="Số lượng người" rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập số lượng người",
                                        },
                                    ]}>
                                        <InputNumber onChange={(e) => {
                                            setEditRenter(pre => {
                                                return { ...pre, numberOfRenter: e }
                                            })
                                        }} value={editRenter?.numberOfRenter} />
                                    </Form.Item>
                                    <Form.Item label="Diện tích" rules={[
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
                                    <Form.Item label="Ngày thuê" rules={[
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
                                    <Form.Item label="Ngày hết hạn hợp đồng" rules={[
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
                                    <Form.Item label="Tình trạng" valuePropName="checked">
                                        <Switch checked={editRenter?.status}
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
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default room;