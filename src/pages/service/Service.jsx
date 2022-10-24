import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import "./service.scss";
import { Button, Col, Input, Layout, Modal, Row, Space, Table, Tag, Form, InputNumber, Select } from "antd";
import { PlusCircleOutlined, SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "../../api/axios";

function Service(props) {
    const APARTMENT_DATA_GROUP = "manager/group/get-group/1";
    const { Content, Sider, Header } = Layout;
    const [loading, setLoading] = useState(false);
    const [componentSize, setComponentSize] = useState('default');
    const [addServiceGeneral, setAddServiceGeneral] = useState(false);
    const [editServiceGeneral, setEditServiceGeneral] = useState(false);
    const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
    const [formAddSerivce] = Form.useForm();
    const [formEditSerivce] = Form.useForm();

    useEffect(() => {
        apartmentGroup();
    }, []);

    const apartmentGroup = async () => {
        let cookie = localStorage.getItem("Cookie");
        setLoading(true);
        await axios
            .get(APARTMENT_DATA_GROUP, {
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${cookie}`,
                },
                // withCredentials: true,
            })
            .then((res) => {
                setDataApartmentGroup(res.data.body.list_general_service);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }
    const listServiceType = dataApartmentGroup?.map((obj, index) => obj?.service_type_name)?.filter((service, i) => dataApartmentGroup?.map((obj, index) => obj?.service_type_name).indexOf(service) === i);

    const columnServiceGeneral = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'service_show_name',
            key: 'general_service_id',
        },
        {
            title: 'Đơn giá (VNĐ)',
            dataIndex: 'service_price',
            key: 'general_service_id',
            render: (price) => {
                return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
            }
        },
        {
            title: 'Cách tính giá dịch vụ',
            dataIndex: 'service_type_name',
            key: 'general_service_id',
        },
        {
            title: 'Thao tác',
            key: 'general_service_id',
            render: (record) => {
                return (
                    <>
                        <EditOutlined onClick={() => {
                            setEditServiceGeneral(true);
                            formEditSerivce.setFieldsValue({
                                service_show_name: record.service_show_name,
                                service_price: record.service_price,
                                service_type_name: record.service_type_name
                            })
                        }} style={{ fontSize: '120%' }} />
                        <DeleteOutlined
                            onClick={() => {
                                Modal.confirm({
                                    title: `Bạn có chắc chắn muốn xóa ${record.service_show_name} ?`,
                                    okText: 'Có',
                                    cancelText: 'Hủy',
                                    onOk: () => {
                                        console.log('click ok');
                                    },
                                })
                            }}
                            style={{ color: "red", marginLeft: 12, fontSize: '120%' }}
                        />
                    </>
                )
            }
        },
    ];
    const onClikAddService = () => {
        setAddServiceGeneral(true);
        console.log('Them moi');
    };
    const onClickSettingService = () => {
        console.log('setting');
    };
    const onFinishAddService = (e) => {
        console.log(e);
    }
    const onFinishAddServiceFail = (e) => {
        console.log(e);
    }

    formAddSerivce.setFieldsValue({
        service_type_name: ""
    });

    const onFinishEditService = (e) => {
        console.log(e);
    }
    const onFinishEditServiceFail = (e) => {
        console.log(e);
    }
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
                        <p className="header-title">Thiết lập dịch vụ chung tòa nhà</p>
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
                                        onClick={onClikAddService} icon={<PlusCircleOutlined style={{ fontSize: 15, }} />}>
                                        Thêm mới
                                    </Button>
                                    <Button href="/service/setting" type="primary" style={{ marginBottom: '1%', float: 'right', marginRight: '1%' }}
                                        onClick={onClickSettingService} icon={<SettingOutlined />}>
                                        Thiết lập
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Table
                                        bordered
                                        columns={columnServiceGeneral}
                                        loading={loading}
                                        dataSource={dataApartmentGroup}
                                        scroll={{ x: 800, y: 600 }}
                                    />
                                </Col>
                            </Row>
                            <Modal
                                title="Thêm dịch vụ mới cho tòa nhà"
                                visible={addServiceGeneral}
                                onCancel={() => {
                                    setAddServiceGeneral(false);
                                }}
                                onOk={() => {
                                    setAddServiceGeneral(false);
                                }}
                                width={500}
                                footer={[
                                    <Button style={{ overflow: "auto" }} htmlType="submit" key="submit" form="add-service" type="primary">
                                        Thêm mới
                                    </Button>,
                                    <Button key="back" onClick={() => {
                                        setAddServiceGeneral(false);
                                    }}>
                                        Huỷ
                                    </Button>,
                                ]} >
                                <Form
                                    form={formAddSerivce}
                                    onFinish={onFinishAddService}
                                    onFinishFailed={onFinishAddServiceFail}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 30 }}
                                    layout="horizontal"
                                    initialValues={{ size: componentSize }}
                                    size={"default"}
                                    id="add-service"
                                >
                                    <Form.Item className="form-item" name="service_show_name"
                                        labelCol={{ span: 24 }} label={<span><b>Tên dịch vụ: </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập tên dịch vụ",
                                                whitespace: true,
                                            }
                                        ]}>
                                        <Input
                                            placeholder="Tên dịch vụ">
                                        </Input>
                                    </Form.Item>
                                    <Form.Item className="form-item" name="service_price"
                                        labelCol={{ span: 24 }} label={<span><b>Đơn giá (VND): </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập giá dịch vụ",
                                            },
                                        ]}>
                                        <InputNumber
                                            defaultValue={0}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                    <Form.Item className="form-item" name="service_type_name"
                                        labelCol={{ span: 24 }} label={<span><b>Cách tính giá dịch vụ: </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng chọn cách tính giá dịch vụ",
                                            }
                                        ]}>
                                        <Select
                                            placeholder="Chọn cách tính giá dịch vụ"
                                            optionFilterProp="children"
                                        >
                                            <Select.Option value="">Tùy chọn</Select.Option>
                                            {listServiceType.map((obj, index) => {
                                                return <Select.Option value={obj}>{obj}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <Modal
                                title="Chỉnh sửa dịch vụ cho tòa nhà"
                                visible={editServiceGeneral}
                                onCancel={() => {
                                    setEditServiceGeneral(false);
                                }}
                                onOk={() => {
                                    setEditServiceGeneral(false);
                                }}
                                width={500}
                                footer={[
                                    <Button style={{ overflow: "auto" }} htmlType="submit" key="submit" form="edit-service" type="primary">
                                        Lưu
                                    </Button>,
                                    <Button key="back" onClick={() => {
                                        setAddServiceGeneral(false);
                                    }}>
                                        Huỷ
                                    </Button>,
                                ]} >
                                <Form
                                    form={formEditSerivce}
                                    onFinish={onFinishEditService}
                                    onFinishFailed={onFinishEditServiceFail}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 30 }}
                                    layout="horizontal"
                                    initialValues={{ size: componentSize }}
                                    size={"default"}
                                    id="edit-service"
                                >
                                    <Form.Item className="form-item" name="service_show_name"
                                        labelCol={{ span: 24 }} label={<span><b>Tên dịch vụ: </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập tên dịch vụ",
                                                whitespace: true,
                                            }
                                        ]}>
                                        <Input
                                            placeholder="Tên dịch vụ">
                                        </Input>
                                    </Form.Item>
                                    <Form.Item className="form-item" name="service_price"
                                        labelCol={{ span: 24 }} label={<span><b>Đơn giá (VND): </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng nhập giá dịch vụ",
                                            },
                                        ]}>
                                        <InputNumber
                                            defaultValue={0}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                    <Form.Item className="form-item" name="service_type_name"
                                        labelCol={{ span: 24 }} label={<span><b>Cách tính giá dịch vụ: </b></span>}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng chọn cách tính giá dịch vụ",
                                            }
                                        ]}>
                                        <Select
                                            placeholder="Chọn cách tính giá dịch vụ"
                                            optionFilterProp="children"
                                        >
                                            <Select.Option value="">Tùy chọn</Select.Option>
                                            {listServiceType.map((obj, index) => {
                                                return <Select.Option value={obj}>{obj}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <p><i><b>Lưu ý: </b>Trên đây là danh sách dịch vụ áp dụng chung cho Tòa Nhà. Nếu muốn thay đổi thông tin, phương thức tính toán vào phần <b>"Thiết lập"</b><br />
                            </i></p>
                            <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default Service;