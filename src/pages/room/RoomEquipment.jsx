import "./room.scss";
import { Form, Input, Radio, Select, Switch, Layout, Button, Row, Col, Table, Modal, message, Checkbox, notification, DatePicker, InputNumber, Spin } from "antd";
import React, { useEffect, useState } from 'react';
import {
    PlusCircleOutlined,
    EditTwoTone,
    DeleteOutlined,
    FilterOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import Breadcrumbs from "../../components/BreadCrumb ";
import moment from "moment";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";
const { Content, Sider, Header } = Layout;
const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];
const fontSizeIcon = {
    fontSize: "120%",
};
const textSize = {
    fontSize: 15,
};
const LIST_ASSET_TYPE = "manager/asset/type";
const ADD_ASSET = "manager/asset/room/add";

function RoomEquipment(data) {
    const { state } = useLocation();
    console.log(state[0]);
    const dataFilter = {
        id: [],
        asset_type: [],
    };
    const [createAssetForm] = Form.useForm();
    const [editAssetForm] = Form.useForm();
    const [searched, setSearched] = useState("");
    const [filterAssetType, setFilterAssetType] = useState([]);
    const [disableEditAsset, setDisableEditAsset] = useState(true);
    const [isEditAsset, setIsEditAsset] = useState(false);
    const [dataAsset, setDataAsset] = useState([]);
    const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);
    const [floorRoom, setFloorRoom] = useState();
    const [roomSelect, setRoomSelect] = useState();
    const [listAssetType, setListAssetType] = useState([]);
    const [assetStatus, setAssetStatus] = useState([]);
    const [addAssetInRoom, setAddAssetInRoom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [componentSize, setComponentSize] = useState("default");
    let cookie = localStorage.getItem("Cookie");



    useEffect(() => {
        getAssetType();
        loadDefault();
    }, []);

    const loadDefault = () => {
        createAssetForm.setFieldsValue({
            hand_over_asset_quantity: 1,
        });
    };

    const getAssetType = async () => {
        setLoading(true);
        await axios
            .get(LIST_ASSET_TYPE, {
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${cookie}`,
                },
                // withCredentials: true,
            })
            .then((res) => {
                console.log(res.data.data);
                setListAssetType(res.data.data);
                createAssetForm.setFieldsValue({
                    asset_type_show_name: res.data.data?.find(
                        (obj, index) => obj.asset_type_name === "OTHER" && obj.asset_type_show_name === "Khác"
                    )?.id,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };
    const columns = [
        {
            title: "Tên tài sản",
            dataIndex: "asset_name",
            key: "asset_id",
            filteredValue: [searched],
            onFilter: (value, record) => {
                return String(record.asset_name).toLowerCase()?.includes(value.toLowerCase());
            },
        },
        {
            title: "Số lượng",
            dataIndex: "hand_over_asset_quantity",
            key: "asset_id",
        },
        {
            title: "Nhóm tài sản",
            dataIndex: "asset_type_show_name",
            filters: [
                { text: "Phòng ngủ", value: "Phòng ngủ" },
                { text: "Phòng khách", value: "Phòng khách" },
                { text: "Phòng bếp", value: "Phòng bếp" },
                { text: "Phòng tắm", value: "Phòng tắm" },
                { text: "Khác", value: "Khác" },
            ],
            filteredValue: filterAssetType.asset_type_show_name || null,
            onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
        },
        // {
        //     title: "Ngày bàn giao",
        //     dataIndex: "hand_over_date_delivery",
        //     key: "asset_id",
        // },
        {
            title: "Thao tác",
            key: "asset_id",
            render: (record) => {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => {
                                console.log(record);
                                record.asset_id < 0 ? setDisableEditAsset(false) : setDisableEditAsset(true);
                                setIsEditAsset(true);
                                editAssetForm.setFieldsValue({
                                    asset_id: record.asset_id,
                                    asset_name: record.asset_name,
                                    // hand_over_date_delivery:
                                    //     record.hand_over_date_delivery !== null
                                    //         ? moment(record.hand_over_date_delivery, dateFormatList)
                                    //         : "",
                                    hand_over_asset_quantity: record.hand_over_asset_quantity,
                                    asset_type_show_name: record.asset_type_show_name,
                                    // hand_over_asset_status: record.hand_over_asset_status,
                                });
                            }}
                            style={fontSizeIcon}
                        />
                        <DeleteOutlined
                            onClick={() => {
                                onDeleteAsset(record);
                            }}
                            style={{ color: "red", marginLeft: 12, fontSize: "120%" }}
                        />
                    </>
                );
            },
        },
    ];

    const onDeleteAsset = (record) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn xóa ${record.asset_name} này ?`,
            okText: "Có",
            cancelText: "Hủy",
            onOk: () => {
                setDataAsset((pre) => {
                    return pre.filter((asset) => asset.asset_id !== record.asset_id);
                });
                message.success(`Đã xóa ${record.asset_name}`);
            },
        });
    };

    const addAssetFinish = async (dataAsset) => {
        const data = {
            asset_name: dataAsset.asset_name,
            asset_type_id: dataAsset.asset_type_show_name,
            asset_quantity: dataAsset.hand_over_asset_quantity,
            room_id: state[0].room_id
            // hand_over_date_delivery: dataAsset?.hand_over_date_delivery?.format("DD-MM-YYYY"),
        };
        console.log(JSON.stringify(data));
        setLoading(true);
        await axios
            .post(ADD_ASSET, [data], {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                notification.success({
                    message: "Thêm mới tài sản thành công",
                    placement: "top",
                    duration: 2,
                });
                addAssetInRoom(false);
            })
            .catch((error) => {
                console.log(error);
                notification.error({
                    message: "Thêm mới tài sản thất bại",
                    placement: "top",
                    duration: 2,
                });
            });
        setLoading(false);
    };
    const addAssetFail = (e) => {
        setAddAssetInRoom(true);
    };

    const editAssetFinish = (e) => {
        console.log(e);
        const duplicate = dataAsset.find(
            (asset) =>
                asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim() &&
                asset.asset_type_show_name === e.asset_type_show_name &&
                // asset.hand_over_date_delivery === moment(e.hand_over_date_delivery).format("DD-MM-YYYY") &&
                asset.hand_over_asset_quantity === e.hand_over_asset_quantity
            // asset.hand_over_asset_status === e.hand_over_asset_status
        );
        if (!duplicate) {
            message.success("Cập nhật tài sản thành công");
            setDataAsset((pre) => {
                return pre.map((asset) => {
                    if (asset.asset_id === e.asset_id) {
                        return {
                            ...e,
                            // hand_over_date_delivery: moment(e.hand_over_date_delivery).format("DD-MM-YYYY"),
                        };
                    } else {
                        return asset;
                    }
                });
            });
            setIsEditAsset(false);
        } else {
            setIsEditAsset(true);
            message.error("Cập nhật tài sản thất bại");
        }
    };
    const editAssetFail = (e) => {
        setIsEditAsset(true);
    };

    return (
        <Spin spinning={loading} size="large">
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
                            <p className="header-title">Trang thiết bị trong phòng</p>
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
                                <Row>
                                    <Col span={24}>
                                        <Form.Item className="form-item" name="list_hand_over_assets" labelCol={{ span: 24 }}>
                                            <p>
                                                <h3>
                                                    <b>
                                                        Danh sách trang thiết bị trong phòng {state[0].roomName}
                                                    </b>
                                                </h3>
                                            </p>
                                        </Form.Item>
                                        <Row>
                                            <Col>
                                                <Input.Search
                                                    placeholder="Nhập tên tài sản để tìm kiếm"
                                                    style={{ marginBottom: 8, width: 400 }}
                                                    onSearch={(e) => {
                                                        setSearched(e);
                                                    }}
                                                    onChange={(e) => {
                                                        setSearched(e.target.value);
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={22}>
                                                <Row>
                                                    <FilterOutlined style={{ fontSize: "150%" }} />
                                                    <b>Nhóm tài sản: </b>
                                                    <Checkbox.Group
                                                        style={{ paddingLeft: "1%" }}
                                                        options={listAssetType?.map((obj, index) => {
                                                            return obj.asset_type_show_name;
                                                        })}
                                                        onChange={(checkedValues) => {
                                                            // console.log(dataFilter.asset_type_show_name);
                                                            dataFilter.asset_type_show_name = checkedValues;
                                                            setFilterAssetType(dataFilter);
                                                        }}
                                                    ></Checkbox.Group>
                                                </Row>
                                            </Col>
                                            <Col span={2}>
                                                <PlusCircleOutlined
                                                    onClick={() => {
                                                        setAddAssetInRoom(true);
                                                    }}
                                                    style={{ fontSize: 36, color: "#1890ff", float: "right", marginBottom: "10%" }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Table
                                                bordered
                                                onChange={(pagination, filters, sorter, extra) => {
                                                    setFilterAssetType(filters);
                                                    setAssetStatus(filters);
                                                }}
                                                dataSource={dataAsset}
                                                columns={columns}
                                                scroll={{ x: 800, y: 600 }}
                                                loading={loading}
                                            ></Table>
                                        </Row>
                                    </Col>
                                </Row>
                                <Modal
                                    title="Thêm tài sản mới"
                                    visible={addAssetInRoom}
                                    onCancel={() => {
                                        setAddAssetInRoom(false);
                                    }}
                                    onOk={() => {
                                        setAddAssetInRoom(false);
                                    }}
                                    width={500}
                                    footer={[
                                        <Button
                                            key="back"
                                            onClick={() => {
                                                // setFormAddAsset(createAssetForm.getFieldsValue());
                                                // setAddAssetInRoom(false)
                                                setAddAssetInRoom(false);
                                            }}
                                        >
                                            Đóng
                                        </Button>,
                                        <Button htmlType="submit" key="submit" form="create-asset" type="primary">
                                            Lưu
                                        </Button>,
                                    ]}
                                >
                                    <Form
                                        form={createAssetForm}
                                        onFinish={addAssetFinish}
                                        onFinishFailed={addAssetFail}
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 30 }}
                                        layout="horizontal"
                                        initialValues={{ size: componentSize }}
                                        onValuesChange={onFormLayoutChange}
                                        size={"default"}
                                        id="create-asset"
                                    >
                                        <Form.Item
                                            className="form-item"
                                            name="asset_name"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Tên tài sản: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập tên tài sản",
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Tên tài sản"></Input>
                                        </Form.Item>
                                        <Form.Item
                                            className="form-item"
                                            name="hand_over_asset_quantity"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Số lượng: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số lượng",
                                                },
                                                {
                                                    pattern: new RegExp(/^[0-9]*$/),
                                                    message: "Vui lòng nhập số nguyên",
                                                }
                                            ]}
                                        >
                                            <InputNumber placeholder="Nhập số lượng tài sản" style={{ width: "100%" }} min={1} />
                                        </Form.Item>
                                        <Form.Item
                                            className="form-item"
                                            name="asset_type_show_name"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Nhóm tài sản: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn nhóm tài sản",
                                                },
                                            ]}
                                        >
                                            <Select placeholder="Chọn nhóm tài sản">
                                                {listAssetType?.map((obj, index) => {
                                                    return <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>;
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                                <Modal
                                    title="Chỉnh sửa tài sản trong phòng"
                                    visible={isEditAsset}
                                    onCancel={() => {
                                        setIsEditAsset(false);
                                    }}
                                    onOk={() => {
                                        setIsEditAsset(false);
                                    }}
                                    width={500}
                                    footer={[
                                        <Button
                                            key="back"
                                            onClick={() => {
                                                setIsEditAsset(false);
                                            }}
                                        >
                                            Đóng
                                        </Button>,
                                        <Button htmlType="submit" key="submit" form="edit-asset" type="primary">
                                            Lưu
                                        </Button>,
                                    ]}
                                >
                                    <Form
                                        form={editAssetForm}
                                        onFinish={editAssetFinish}
                                        onFinishFailed={editAssetFail}
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 30 }}
                                        layout="horizontal"
                                        initialValues={{ size: componentSize }}
                                        onValuesChange={onFormLayoutChange}
                                        size={"default"}
                                        id="edit-asset"
                                    >
                                        <Form.Item
                                            className="form-item"
                                            name="asset_name"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Tên tài sản: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập tên tài sản",
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input disabled={disableEditAsset} placeholder="Tên tài sản"></Input>
                                        </Form.Item>
                                        <Form.Item
                                            className="form-item"
                                            name="hand_over_asset_quantity"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Số lượng: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số lượng",
                                                },
                                                {
                                                    pattern: new RegExp(/^[0-9]*$/),
                                                    message: "Vui lòng nhập số nguyên",
                                                }
                                            ]}
                                        >
                                            <InputNumber style={{ width: "100%" }} min={1} />
                                        </Form.Item>
                                        <Form.Item
                                            className="form-item"
                                            name="asset_type_show_name"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Nhóm tài sản: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn nhóm tài sản",
                                                },
                                            ]}
                                        >
                                            <Select disabled={disableEditAsset} placeholder={"Nhóm tài sản"}>
                                                {listAssetType?.map((obj, index) => {
                                                    return (
                                                        <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </Spin>
    );
}

export default RoomEquipment;