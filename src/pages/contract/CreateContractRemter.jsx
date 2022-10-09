import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Button, Layout, Modal, Form, Table, Space, Input, Select, Tabs, Row, Col,
    Radio, DatePicker, Upload, Tag, message, Spin
} from "antd";
import TextArea from "antd/lib/input/TextArea";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const CreateContractRenter = () => {
    const asset = [];
    const [searched, setSearched] = useState("");
    const [isAdd, setisAdd] = useState(false);
    const [componentSize, setComponentSize] = useState('default');
    const [dataOldUser, setDataOldUser] = useState([]);
    const [editContract, setEditContract] = useState([]);
    const [form] = Form.useForm();

    const onFinish = (e) => {
        message.success('Thêm mới hợp đồng thành công');
        console.log(JSON.stringify(e));
    }
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };
    const columns = [
        {
            title: 'Tầng',
            dataIndex: 'floor',
            key: 'index',
            filteredValue: [searched],
            onFilter: (value, record) => {
                return (
                    String(record.floor).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.roomCode).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.assetName).toLowerCase()?.includes(value.toLowerCase())
                );
            },
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
        },
        {
            title: 'Thao tác',
            key: 'index',
        },
    ];

    const oldUser = [];
    const userColumn = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'index',
            filteredValue: [searched],
            onFilter: (value, record) => {
                return (
                    String(record.name).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.phoneNumber).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.identityCard).toLowerCase()?.includes(value.toLowerCase()) ||
                    String(record.email).toLowerCase()?.includes(value.toLowerCase())
                );
            },
        },
        {
            title: 'SĐT',
            dataIndex: 'phoneNumber',
            key: 'index',
        },
        {
            title: 'Gmail',
            dataIndex: 'email',
            key: 'index',
        },
        {
            title: 'CCCD/CMND',
            dataIndex: 'identityCard',
            key: 'index',
        },
    ];
    for (let i = 1; i < 51; i++) {
        oldUser.push({
            index: i,
            name: `user${i}`,
            phoneNumber: `012345678${i}`,
            email: `user${i}@gmail.com`,
            identityCard: `03120000099${i}`
        });

    }
    for (let i = 1; i < 100; i++) {
        if ((Math.floor(Math.random() * (100 - 1 + 1)) + 1) % 2 === 0) {
            asset.push({
                index: i,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                roomCode: i.toString(),
                assetName: `Tài sản ${i}`,
                numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                dateOfDelivery: `30/09/2022`,
                status: true,
            });
        } else {
            asset.push({
                index: i,
                floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                roomCode: i.toString(),
                assetName: `Tài sản ${i}`,
                numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                dateOfDelivery: `30/09/2022`,
                status: false,
            });
        }
    }
    const [dataSource, setDataSource] = useState(asset);

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const onAdd = (record) => {
        setisAdd(true);
    }
    const resetAdd = () => {
        setisAdd(false);
    }
    const onOk = () => {
        console.log(dataOldUser.phoneNumber);
        form.setFieldsValue({
            renterName: dataOldUser.name,
            phoneNumber: dataOldUser.phoneNumber,
            email: dataOldUser.email,
            identityCard: dataOldUser.identityCard
        });
        setisAdd(false);
    }
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
                            <div className="" style={{ overflow: "auto" }}>
                                <Button htmlType="submit" style={{ float: "right" }} type="primary" form="create-contract">Lưu</Button>
                                <Button href="/contract-renter" type="primary" style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
                            </div>
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
                                id="create-contract"
                            >
                                <Tabs defaultActiveKey="1">
                                    <Tabs.TabPane tab="Thông tin hợp đồng" key="1">
                                        <Row>
                                            <Col span={12}>
                                                <p><b>Các thông tin về khách và tiền cọc: </b></p>
                                                <Form.Item className="form-item" name="contractName"
                                                    labelCol={{ span: 24 }} label={<span><b>Tên hợp đồng: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập tên hợp đồng",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="Tên hợp đồng">
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="renterName" rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập tên khách thuê",
                                                    }
                                                ]} labelCol={{ span: 24 }} label={<span><b>Tên khách thuê: </b></span>}>
                                                    {/* <span><b>Tên khách thuê: </b></span> */}
                                                    <Input
                                                        placeholder="Tên khách thuê" onChange={(e) => {
                                                            setDataOldUser(pre => {
                                                                return { ...pre, name: e.target.value }
                                                            })
                                                        }}>
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="sex"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng chọn giới tính",
                                                        }
                                                    ]}>
                                                    <Radio.Group>
                                                        <Radio value={1}>Nam</Radio>
                                                        <Radio value={2}>Nữ</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                {/* <Form.Item className="form-item" name="oldCustomer"> */}
                                                <Button type="primary" size="default"
                                                    onClick={() => {
                                                        onAdd()
                                                    }}>Khách cũ</Button>
                                                {/* </Form.Item> */}
                                                <Form.Item className="form-item" name="phoneNumber"
                                                    labelCol={{ span: 24 }} label={<span><b>Số điện thoại: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập số điện thoại",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="Số điện thoại" onChange={(e) => {
                                                            setDataOldUser(pre => {
                                                                return { ...pre, phoneNumber: e.target.value }
                                                            })
                                                        }}>
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="email" labelCol={{ span: 24 }}
                                                    label={<span><b>Email: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập email",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="Email" onChange={(e) => {
                                                            setDataOldUser(pre => {
                                                                return { ...pre, email: e.target.value }
                                                            })
                                                        }}>
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="identityCard"
                                                    labelCol={{ span: 24 }} label={<span><b>CCCD/CMND: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập CCCD/CMND",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="CCCD/CMND" onChange={(e) => {
                                                            setDataOldUser(pre => {
                                                                return { ...pre, identityCard: e.target.value }
                                                            })
                                                        }}>
                                                    </Input>
                                                </Form.Item>
                                                <Row>
                                                    <Col span={9}>
                                                        <Form.Item className="form-item" name="floor"
                                                            labelCol={{ span: 24 }} label={<span><b>Tầng: </b></span>}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Vui lòng chọn tầng",
                                                                }
                                                            ]}>
                                                            <Select placeholder="Chọn tầng">
                                                                <Option value="1">Tầng 1</Option>
                                                                <Option value="2">Tầng 2</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={9}>
                                                        <Form.Item className="form-item" name="room"
                                                            labelCol={{ span: 24 }} label={<span><b>Phòng: </b></span>}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Vui lòng chọn phòng",
                                                                }
                                                            ]}>
                                                            <Select placeholder="Chọn phòng">
                                                                <Option value="201c">201C</Option>
                                                                <Option value="203c">203C</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Form.Item className="form-item" name="contractTerm"
                                                    labelCol={{ span: 24 }} label={<span><b>Thời hạn hợp đồng: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng chọn thời hạn hợp đồng",
                                                        }
                                                    ]}>
                                                    <Select placeholder="Thời hạn hợp đồng">
                                                        <Option value="6">6 tháng</Option>
                                                        <Option value="1">1 năm</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Row>
                                                    <Col span={9}>
                                                        <Form.Item className="form-item" name="startDate"
                                                            labelCol={{ span: 24 }} label={<span><b>Ngày vào ở: </b></span>}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Vui lòng chọn ngày vào ở",
                                                                }
                                                            ]}>
                                                            <DatePicker placeholder="Ngày vào ở" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={9}>
                                                        <Form.Item className="form-item" name="endDate"
                                                            labelCol={{ span: 24 }} label={<span><b>Ngày kết thúc: </b></span>}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Vui lòng chọn ngày kết khúc",
                                                                }
                                                            ]}>
                                                            <DatePicker placeholder="Ngày kết thúc" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Form.Item className="form-item" name="note"
                                                    labelCol={{ span: 24 }} label={<span><b>Ghi chú: </b></span>}>
                                                    <TextArea rows={4} placeholder="Ghi chú" value={""} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <p><b>Thông tin giá trị hợp đồng: </b></p>
                                                <Form.Item className="form-item" name="roomPrice"
                                                    labelCol={{ span: 24 }} label={<span><b>Giá phòng: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập giá phòng",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="Giá phòng">
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="depositAmount"
                                                    labelCol={{ span: 24 }} label={<span><b>Số tiền cọc: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập tiền cọc",
                                                        }
                                                    ]}>
                                                    <Input
                                                        placeholder="Số tiền cọc">
                                                    </Input>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="billCycle"
                                                    labelCol={{ span: 24 }} label={<span><b>Chu kỳ tính tiền: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập chu kỳ tính tiền",
                                                        }
                                                    ]}>
                                                    <Select placeholder="Chu kỳ tính tiền" style={{ width: "100%" }}>
                                                        <Option value="1">1 tháng</Option>
                                                        <Option value="2">2 tháng</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item className="form-item" name="paymentCycle"
                                                    labelCol={{ span: 24 }} label={<span><b>Chu kỳ thanh toán: </b></span>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập chu kỳ thanh toán",
                                                        }
                                                    ]}>
                                                    <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
                                                        <Option value="15">kỳ 15</Option>
                                                        <Option value="30">kỳ 30</Option>
                                                    </Select>
                                                </Form.Item>
                                                <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                                                <Form.Item className="form-item" name="file">
                                                    <Upload.Dragger multiple listType='picture' showUploadList={{ showRemoveIcon: true }}
                                                        accept=".png,jpeg,.doc"
                                                        beforeUpload={(file) => {
                                                            return false;
                                                        }}
                                                        iconRender={() => {
                                                            return <Spin></Spin>
                                                        }}
                                                        action={"http://localhost:3000/contract-renter/create"}>
                                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                    </Upload.Dragger>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <p>Lưu ý:<br />
                                            - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                                            - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                                            - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                                            - Chu kỳ tính tiền: là số tháng được tính trên mỗi hóa đơn.<br />
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
                                        <Row>
                                            <Col span={24}>
                                                <p><b>Thông tin tài sản bàn giao</b></p>
                                                <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
                                                    onSearch={(e) => {
                                                        setSearched(e);
                                                    }}
                                                    onChange={(e) => {
                                                        setSearched(e.target.value);
                                                    }}
                                                />
                                                <Table
                                                    dataSource={dataSource}
                                                    columns={columns}
                                                    scroll={{ x: 800, y: 600 }}
                                                >

                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                                        </Row>
                                        <Row>
                                            <Upload>
                                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                            </Upload>
                                        </Row>
                                    </Tabs.TabPane>
                                </Tabs>
                            </Form>
                            <Modal
                                title="Khách hàng cũ"
                                visible={isAdd}
                                onCancel={() => {
                                    resetAdd()
                                }}
                                onOk={onOk}
                                width={1000}
                            >
                                <Form
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 30 }}
                                    layout="horizontal"
                                    initialValues={{ size: componentSize }}
                                    onValuesChange={onFormLayoutChange}
                                    size={"default"}
                                >
                                    <Form.Item >
                                        <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
                                            onSearch={(e) => {
                                                setSearched(e);
                                            }}
                                            onChange={(e) => {
                                                setSearched(e.target.value);
                                            }}
                                        />
                                        <Table
                                            columns={userColumn}
                                            dataSource={oldUser}
                                            scroll={{ x: 1000, y: 400 }}
                                            rowKey={(record) => record.index}
                                            rowSelection={{
                                                type: 'radio',
                                                onSelect: (record) => {
                                                    setDataOldUser({ ...record });
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout >
        </div >
    );
};

export default CreateContractRenter;
