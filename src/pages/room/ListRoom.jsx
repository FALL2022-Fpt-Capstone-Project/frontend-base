import "./room.scss";
import {
    Modal, Table, Input, Button, DatePicker,
    Form,
    InputNumber,
    Select,
    Switch,
    Tag,
    Popover,
    Row,
    Col,
    Checkbox,
    Tabs,
    Statistic,
    Tooltip
} from "antd";
import { MoreOutlined, FilterOutlined, SearchOutlined, UndoOutlined, QuestionCircleTwoTone, PlusOutlined, ArrowRightOutlined, AuditOutlined, DollarOutlined, SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import moment from 'moment';
import { Link } from "react-router-dom";

function ListRoom(props) {
    const [isEdit, setisEdit] = useState(false);
    const [isAdd, setisAdd] = useState(false);
    const [editRenter, setEditRenter] = useState(null);
    const [searched, setSearched] = useState("");
    const [form] = Form.useForm();
    const optionFilterRoom = [
        {
            label: "Phòng đang ở",
            value: "1",
        },
        {
            label: "Phòng trống",
            value: "2",
        },
        {
            label: "Hợp đồng đã kết thúc",
            value: "3",
        },
        {
            label: "Cọc giữ chỗ",
            value: "4",
        },
    ];
    const optionPaymentCycle = [
        {
            label: "Kỳ 15",
            value: 15,
        },
        {
            label: "Kỳ 30",
            value: 30,
        },
    ];

    const optionRoomStatus = [
        {
            label: "Đang ở",
            value: 1,
        },
        {
            label: "Đang trống",
            value: 0,
        },
        {
            label: "Đã cọc",
            value: 2,
        },
    ];
    const validateRequired = (e) => {
        console.log(e);
        if (e.roomCode !== null && e.owner !== null && e.building !== null
            && e.floor !== null && e.numberOfRenter !== null && e.square !== null
            && e.contractExpirationDate !== null && e.dateOfHire !== null) {
            console.log('in');
            resetEditing();
        }

    }
    const renter = [
        {
            index: 1,
            roomName: 'Phòng 201',
            roomFloor: 'Tầng 2',
            roomNumberOfRenter: '3/5',
            roomPrice: 10000000,
            roomDeposit: 10000000,
            roomSquare: '30m2',
            renterName: 'Nguyễn Đức Pháp',
            startDate: '30/10/2022',
            endDate: '30/10/2023',
            billCycle: '1 tháng',
            paymentCycle: 'Kỳ 30',
            roomStatus: 1,
        },
        {
            index: 2,
            roomName: 'Phòng 202',
            roomFloor: 'Tầng 2',
            roomNumberOfRenter: '0/5',
            roomPrice: 3000000,
            roomDeposit: 0,
            roomSquare: '30m2',
            renterName: '',
            startDate: '',
            endDate: '',
            billCycle: '',
            paymentCycle: '',
            roomStatus: 0,
        },
        {
            index: 3,
            roomName: 'Phòng 203',
            roomFloor: 'Tầng 2',
            roomNumberOfRenter: '1/5',
            roomPrice: 10000000,
            roomDeposit: 10000000,
            roomSquare: '30m2',
            renterName: 'Nguyễn Đức Pháp',
            startDate: '',
            endDate: '',
            billCycle: '1 tháng',
            paymentCycle: 'Kỳ 30',
            roomStatus: 2,
        },
    ];
    const [dataSource, setDataSource] = useState(renter);
    const columns = [
        {
            title: 'Thông tin phòng',
            children: [
                {
                    title: 'Tên phòng',
                    dataIndex: 'roomName',
                    key: 'index',
                },
                {
                    title: 'Tầng',
                    dataIndex: 'roomFloor',
                    key: 'index',
                },
                {
                    title: 'Số lượng người',
                    dataIndex: 'roomNumberOfRenter',
                    key: 'index',
                },
                {
                    title: 'Giá phòng',
                    dataIndex: 'roomPrice',
                    key: 'index',
                    render: (roomPrice) => {
                        return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomPrice)}</span>
                    }
                },
                {
                    title: 'Tiền cọc',
                    dataIndex: 'roomDeposit',
                    key: 'index',
                    render: (roomDeposit) => {
                        return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomDeposit)}</span>
                    }
                },
                {
                    title: 'Diện tích',
                    dataIndex: 'roomSquare',
                    key: 'index',
                },
                {
                    title: 'Chu kỳ thanh toán',
                    dataIndex: 'paymentCycle',
                    key: 'index',
                },
                {
                    title: 'Chu kỳ tính tiền',
                    dataIndex: 'billCycle',
                    key: 'index',
                },
            ]
        },
        {
            title: 'Thông tin khách thuê',
            children: [
                {
                    title: 'Tên khách thuê',
                    dataIndex: 'renterName',
                    key: 'index',
                },
                {
                    title: 'Ngày vào ở',
                    dataIndex: 'startDate',
                    key: 'index',
                },
                {
                    title: 'Ngày kết thúc hợp đồng',
                    dataIndex: 'endDate',
                    key: 'index',
                },
            ]
        },
        {
            title: 'Trạng thái phòng',
            key: 'index',
            dataIndex: 'roomStatus',
            filters: [
                { text: "Đang ở", value: 1 },
                { text: "Đang trống", value: 0 },
                { text: "Đã cọc", value: 2 }
            ],
            onFilter: (value, record) => {
                return record.status === value
            },
            render: (roomStatus) => {
                if (roomStatus === 0) {
                    return <Tag color="error">Đang trống</Tag>
                } else if (roomStatus === 1) {
                    return <Tag color="success">Đang ở</Tag>
                } else {
                    return <Tag color="blue">Đã cọc</Tag>
                }
            },

        },
        {
            title: 'Thao tác',
            key: 'index',
            render: (record) => {
                return (
                    <>
                        {/* <EditOutlined onClick={() => {
                            onEdit(record)
                        }} />
                        <DeleteOutlined onClick={() => {
                            onDelete(record)
                        }} style={{ color: "red", marginLeft: 12 }} /> */}
                        <Popover placement="left" title="Thao tác" content={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Button style={{ marginBottom: '2%' }} icon={<ArrowRightOutlined style={{ fontSize: '130%' }} />}>Chi tiết phòng</Button>
                                        </Row>
                                        <Row>
                                            <Button style={{ marginBottom: '2%' }} icon={<AuditOutlined style={{ fontSize: '130%' }} />}>Hợp đồng mới</Button>
                                        </Row>
                                        <Row>
                                            <Button style={{ marginBottom: '2%', paddingRight: '22%' }} icon={<DollarOutlined style={{ fontSize: '130%' }} />}>Cọc giữ chỗ</Button>
                                        </Row>
                                        <Row>
                                            <Button href="/service" style={{ marginBottom: '2%' }} icon={<SettingOutlined style={{ fontSize: '130%' }} />}>Cài đặt dịch vụ</Button>
                                        </Row>
                                        <Row>
                                            <Button style={{ paddingRight: '25%' }} icon={<DeleteOutlined style={{ fontSize: '130%', color: 'red' }} />} danger>Xóa phòng</Button>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        } trigger="click">
                            <MoreOutlined style={{ fontSize: '180%', borderRadius: '50%', border: '1px solid black' }} />
                        </Popover>
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
            }}
        >
            <Row style={{ marginBottom: '2%' }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                    <Statistic title={
                        <>
                            <span style={{ fontSize: "16px", }}>Tổng số phòng: </span>
                            {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: '50%' }}></Button> */}
                        </>
                    } value={50} />
                </Col>
                <Col span={6}>
                    <Statistic title={
                        <>
                            <span style={{ fontSize: "16px", }}>Tổng số phòng trống: </span>
                            <Button icon={<ArrowRightOutlined />} style={{ borderRadius: '50%' }}></Button>
                        </>
                    } value={10} />
                </Col>
                <Col span={6}>
                    <Statistic title={
                        <>
                            <span style={{ fontSize: "16px", }}>Tổng số tiền cọc: </span>
                            {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: '50%' }}></Button> */}
                        </>
                    } value={100000000} />
                </Col>
                <Col span={6}>
                    <Statistic title={
                        <>
                            <span style={{ fontSize: "16px", }}>Tổng số tiền phòng: </span>
                            {/* <Button icon={<ArrowRightOutlined />} style={{ borderRadius: '50%' }}></Button> */}
                        </>
                    } value={100000000} />
                </Col>
            </Row>
            <Tabs defaultActiveKey="1" style={{ marginBottom: '1%' }}>
                <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={24}>
                            <Row>
                                <Col span={22}>
                                    <Input.Search placeholder="Nhập tên phòng để tìm kiếm" style={{ marginBottom: 8, width: 400 }}
                                        onSearch={(e) => {
                                            setSearched(e);
                                        }}
                                        onChange={(e) => {
                                            setSearched(e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" size="default" style={{ float: "right" }}
                                        onClick={() => {
                                            onAdd()
                                        }} icon={<PlusOutlined />}>
                                        Thêm Phòng
                                    </Button>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col>
                                    <FilterOutlined style={{ fontSize: "150%" }} />
                                    <span style={{ fontSize: "16px", }}>Bộ lọc: </span>
                                    <Checkbox.Group options={optionFilterRoom} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={6}>
                            <Row>
                                <span style={{ fontSize: "16px", }}>Giá phòng: </span>
                            </Row>
                            <Row>
                                <Select placeholder="Chọn khoảng giá" style={{ width: '100%' }}>
                                    <Select.Option>1.000.000đ - 10.000.0000đ</Select.Option>
                                </Select>
                            </Row>
                            <Row gutter={12} style={{ marginTop: '2%' }}>
                                <Col span={12}>
                                    <Row>Từ: </Row>
                                    <InputNumber
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                        addonAfter="đ"
                                        style={{ width: '100%' }}
                                        placeholder="Từ" controls={false} />
                                </Col>
                                <Col span={12}>
                                    <Row>Đến: </Row>
                                    <InputNumber
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                        addonAfter="đ"
                                        style={{ width: '100%' }}
                                        placeholder="Đến"
                                        controls={false} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <span style={{ fontSize: "16px", }}>Diện tích: </span>
                            </Row>
                            <Row>
                                <Select placeholder="Chọn khoảng diện tích" style={{ width: '100%' }}>
                                    <Select.Option>15m2 - 20m2</Select.Option>
                                </Select>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <span style={{ fontSize: "16px", }}>Chu kỳ thanh toán:
                                    <Tooltip color='#108ee9' placement="topLeft" title="Kỳ 15: Khách thuê vào từ ngày 1-15 Kỳ 30: Khách thuê vào từ ngày  16-31"><QuestionCircleTwoTone style={{ fontSize: '130%' }} /></Tooltip>
                                </span>
                            </Row>
                            <Row>
                                <Checkbox.Group options={optionPaymentCycle}></Checkbox.Group>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <span style={{ fontSize: "16px", }}>Trạng thái phòng:</span>
                            </Row>
                            <Row>
                                <Checkbox.Group options={optionRoomStatus}></Checkbox.Group>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={24}>
                            <Row gutter={12} justify="center" style={{ margin: '3% 0 1% 0' }}>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    style={{ marginRight: '1%' }}
                                >
                                    Tìm kiếm
                                </Button>
                                <Button icon={<UndoOutlined />}>
                                    Đặt lại
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Tabs.TabPane>
            </Tabs>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: 1600, y: 800 }}
            >
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