import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "../../api/axios";
import {
    EditTwoTone,
    DeleteOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    AuditOutlined,
    DollarOutlined,
    HomeOutlined,
    CheckCircleTwoTone,
    DownOutlined
} from "@ant-design/icons";
import moment from "moment";
import {
    Button,
    Layout,
    Modal,
    Form,
    Table,
    Input,
    Select,
    Tabs,
    Row,
    Col,
    Radio,
    DatePicker,
    Tag,
    InputNumber,
    message,
    notification,
    Divider,
    Card,
    Tree,
    Spin,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const { Option } = Select;
// const LIST_ASSET_TYPE = "manager/asset/type";
const UPDATE_CONTRACT_GROUP = "manager/contract/group/update/";
const APARTMENT_DATA_GROUP = "manager/group/all";
// const ASSET_BASIC = "manager/asset/";
const dateFormatList = ["DD-MM-YYYY"];
// const defaultAddAsset = {
//     dateOfDelivery: moment(),
//     asset_unit: 1,
//     asset_type: "Khác",
//     asset_status: true,
// };

const contract_duration = [];
for (let i = 6; i < 17; i++) {
    if (i < 12) {
        contract_duration.push({
            id: i,
            contractTermName: `${i} tháng`,
            contractTermValue: i,
        });
    } else {
        contract_duration.push({
            id: i,
            contractTermName: `${i % 11} năm`,
            contractTermValue: (i % 11) * 12,
        });
    }
}
const contract_payment_cycle = [];
for (let i = 1; i < 17; i++) {
    if (i < 12) {
        contract_payment_cycle.push({
            id: i,
            contractTermName: `${i} tháng`,
            contractTermValue: i,
        });
    } else {
        contract_payment_cycle.push({
            id: i,
            contractTermName: `${i % 11} năm`,
            contractTermValue: (i % 11) * 12,
        });
    }
}


const EditContractBuilding = () => {
    const { state } = useLocation();
    console.log(state);

    // const dataFilter = {
    //     id: [],
    //     asset_type: [],
    // };
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [listRoomId, setListRoomId] = useState([]);
    const onExpand = (expandedKeysValue) => {
        console.log("onExpand", expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        const data_id = checkedKeysValue?.map((obj, index) => obj.split("-"))?.map((o, i) => {
            return { floor: parseInt(o[0]), room: parseInt(o[1]) }
        })?.filter((room, j) => room !== undefined);
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
        setListRoomId(data_id?.map((obj, index) => obj.room).filter((o, i) => Number.isInteger(o)));
        form.setFieldsValue({
            list_room: data_id?.map((obj, index) => obj.room).filter((o, i) => Number.isInteger(o)),
        });
    };
    const onSelect = (selectedKeysValue, info) => {
        console.log("onSelect", info);
        setSelectedKeys(selectedKeysValue);
    };

    // const [listAssetType, setListAssetType] = useState([]);
    const navigate = useNavigate();
    // const [searched, setSearched] = useState("");
    // const [filterAssetType, setFilterAssetType] = useState([]);
    // const [assetStatus, setAssetStatus] = useState([]);
    const [componentSize, setComponentSize] = useState("default");
    const [form] = Form.useForm();
    // const [createAssetForm] = Form.useForm();
    // const [editAssetForm] = Form.useForm();
    // const [createAssetQuickForm] = Form.useForm();
    // const [formAddAsset, setFormAddAsset] = useState(defaultAddAsset);
    // const [isEditAsset, setIsEditAsset] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [quickAddAsset, setQuickAddAsset] = useState(false);

    // const [dataAsset, setDataAsset] = useState([]);
    // const [assetId, setAssetId] = useState(-1);
    const [changeTab, setChangeTab] = useState("1");
    const [visibleSubmit, setVisibleSubmit] = useState(false);
    const [contractStartDate, setContractStartDate] = useState(moment());
    const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
    const [groupSelect, setGroupSelect] = useState([]);
    const [numberOfFloor, setNumberOfFloor] = useState([]);
    const [contractDuration, setContractDuration] = useState();
    const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);
    const [displayFinish, setDisplayFinish] = useState([]);
    // const [disableEditAsset, setDisableEditAsset] = useState(true);
    const [roomRented, setRoomRented] = useState(0);
    // const [treeDataRented, setTreeDataRented] = useState([]);

    // const [assetBasic, setAssetBasic] = useState([]);

    let cookie = localStorage.getItem("Cookie");

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };
    // const columns = [
    //     {
    //         title: "Tên tài sản",
    //         dataIndex: "asset_name",
    //         key: "asset_id",
    //         filteredValue: [searched],
    //         onFilter: (value, record) => {
    //             return String(record.asset_name).toLowerCase()?.includes(value.toLowerCase());
    //         },
    //     },
    //     {
    //         title: "Số lượng",
    //         dataIndex: "hand_over_asset_quantity",
    //         key: "asset_id",
    //     },
    //     {
    //         title: "Nhóm tài sản",
    //         dataIndex: "asset_type_show_name",
    //         filters: [
    //             { text: "Phòng ngủ", value: "Phòng ngủ" },
    //             { text: "Phòng khách", value: "Phòng khách" },
    //             { text: "Phòng bếp", value: "Phòng bếp" },
    //             { text: "Phòng tắm", value: "Phòng tắm" },
    //             { text: "Khác", value: "Khác" },
    //         ],
    //         filteredValue: filterAssetType.asset_type_show_name || null,
    //         onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
    //     },
    //     {
    //         title: "Ngày bàn giao",
    //         dataIndex: "hand_over_asset_date_delivery",
    //         key: "asset_id",
    //     },
    //     {
    //         title: "Thao tác",
    //         key: "asset_id",
    //         render: (record) => {
    //             record.asset_id < 0 ? setDisableEditAsset(false) : setDisableEditAsset(true);
    //             return (
    //                 <>
    //                     <EditTwoTone
    //                         onClick={() => {
    //                             setIsEditAsset(true);
    //                             editAssetForm.setFieldsValue({
    //                                 asset_id: record.asset_id,
    //                                 asset_name: record.asset_name,
    //                                 hand_over_asset_date_delivery:
    //                                     record.hand_over_asset_date_delivery !== null
    //                                         ? moment(record.hand_over_asset_date_delivery, dateFormatList)
    //                                         : "",
    //                                 hand_over_asset_quantity: record.hand_over_asset_quantity,
    //                                 asset_type_show_name: record.asset_type_show_name,
    //                                 hand_over_asset_status: record.hand_over_asset_status,
    //                             });
    //                         }}
    //                         className="icon-size"
    //                     />
    //                     <DeleteOutlined
    //                         onClick={() => {
    //                             onDeleteAsset(record);
    //                         }}
    //                         className="icon-delete"
    //                     />
    //                 </>
    //             );
    //         },
    //     },
    // ];
    // const onDeleteAsset = (record) => {
    //     Modal.confirm({
    //         title: `Bạn có chắc chắn muốn xóa ${record.asset_name} này ?`,
    //         okText: "Có",
    //         cancelText: "Hủy",
    //         onOk: () => {
    //             setDataAsset((pre) => {
    //                 return pre.filter((asset) => asset.asset_id !== record.asset_id);
    //             });
    //             message.success(`Đã xóa ${record.asset_name}`);
    //         },
    //     });
    // };

    useEffect(() => {
        // getAssetType();
        apartmentGroup();
        // getAssetBasic();
    }, []);

    // const getAssetType = async () => {
    //     await axios
    //         .get(LIST_ASSET_TYPE, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // "Access-Control-Allow-Origin": "*",
    //                 Authorization: `Bearer ${cookie}`,
    //             },
    //             // withCredentials: true,
    //         })
    //         .then((res) => {
    //             setListAssetType(res.data.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };
    // const getAssetBasic = async () => {
    //     await axios
    //         .get(ASSET_BASIC, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // "Access-Control-Allow-Origin": "*",
    //                 Authorization: `Bearer ${cookie}`,
    //             },
    //             // withCredentials: true,
    //         })
    //         .then((res) => {
    //             console.log(res.data.data);
    //             setDataAsset(
    //                 res.data.data?.map((obj, index) => {
    //                     return {
    //                         asset_id: obj.basic_asset_id,
    //                         asset_name: obj.basic_asset_name,
    //                         hand_over_asset_quantity: 10,
    //                         asset_type_show_name: obj.asset_type_show_name,
    //                         hand_over_asset_date_delivery: currentDay.format("DD-MM-YYYY"),
    //                         asset_type_name: obj.asset_type_name,
    //                         asset_type_id: obj.asset_type_id,
    //                     };
    //                 })
    //             );
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    const apartmentGroup = async () => {
        setLoading(true);
        await axios
            .get(APARTMENT_DATA_GROUP, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                const mergeGroup = res.data.data.list_group_non_contracted.concat(res.data.data.list_group_contracted);
                const mapped = mergeGroup?.map((obj, index) => obj.group_id);
                const filterGroupId = mergeGroup?.filter((obj, index) => mapped.indexOf(obj.group_id) === index);
                console.log(filterGroupId);
                setDataApartmentGroup(filterGroupId);

                const getRoomContracted = filterGroupId?.find((obj, index) => obj.group_id === state.group_id)
                    ?.list_rooms?.filter(room => Number.isInteger(room.group_contract_id) && room.contract_id === null);

                const floor = getRoomContracted?.map(obj => obj.room_floor);
                const filterFloor = floor.filter((obj, index) => floor.indexOf(obj) === index).map(floor => floor.toString());

                onChangeGroup(state.group_id, filterGroupId);
                setExpandedKeys(filterFloor);
                setCheckedKeys(getRoomContracted?.map(room => {
                    return room.room_floor.toString() + "-" + room.room_id
                }));

                setListRoomId(getRoomContracted?.map(room => {
                    return room.room_id
                }));

                form.setFieldsValue({
                    list_room: getRoomContracted?.map(room => {
                        return room.room_id
                    }),
                });
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };

    useEffect(() => {
        loadDefault();
    }, []);

    // form.setFieldsValue({
    //     list_hand_over_asset: dataAsset,
    // });

    const loadDefault = () => {
        form.setFieldsValue({
            contract_type: 2,
            note: "",
        });
        // createAssetForm.setFieldsValue({
        //     asset_id: assetId,
        //     hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
        //     hand_over_asset_quantity: formAddAsset.asset_unit,
        //     // asset_type_show_name: formAddAsset.asset_type,
        //     // hand_over_asset_status: formAddAsset.asset_status,
        // });
    };

    const columnsService = [
        {
            title: "Dịch vụ sử dụng",
            dataIndex: "service_show_name",
            key: "service_show_name",
        },
        {
            title: "Đơn giá (VNĐ)",
            dataIndex: "service_price",
            key: "service_price",
            render: (price) => {
                return (
                    <span style={{ fontWeight: "bold" }}>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
                    </span>
                );
            },
        },
        {
            title: "Cách tính giá dịch vụ",
            dataIndex: "service_type_name",
            key: "service_type_name",
        },
    ];

    // const [addAssetInRoom, setAddAssetInRoom] = useState(false);

    const onFinish = async (e) => {
        // const list_asset = dataAsset?.map((obj, index) => {
        //     return {
        //         asset_id: obj.asset_id,
        //         assets_additional_name: obj.asset_name,
        //         assets_additional_type: obj.asset_type_id,
        //         hand_over_asset_quantity: obj.hand_over_asset_quantity,
        //         hand_over_asset_status: true,
        //         hand_over_date_delivery: obj.hand_over_asset_date_delivery,
        //     };
        // });
        const data = {
            ...e,
            contract_end_date: e.contract_end_date.format("YYYY-MM-DD"),
            contract_start_date: e.contract_start_date.format("YYYY-MM-DD"),
            // list_room: listRoomId,
            // list_hand_over_asset: list_asset,
            rack_renter_name: e.owner_name,
            rack_renter_gender: e.owner_gender,
            rack_renter_phone: e.owner_phone_number,
            rack_renter_email: e.owner_email,
            rack_renter_identity: e.owner_identity_card,
            rack_renter_address: e.address_more_detail,
            rack_renter_note: "",
        };
        console.log(data);
        await axios
            .put(UPDATE_CONTRACT_GROUP + state.contract_id, data, {
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${cookie}`,
                },
                // withCredentials: true,
            })
            .then((res) => {
                navigate("/contract-apartment");
                notification.success({
                    message: "Cập nhật hợp đồng thành công",
                    placement: "top",
                    duration: 3,
                });
            })
            .catch((error) => {
                notification.error({
                    message: "Cập nhật hợp đồng thất bại",
                    description: "Vui lòng kiểm tra lại thông tin hợp đồng",
                    placement: "top",
                    duration: 3,
                });
            });
    };
    const onFinishContractFail = (e) => {
        message.error("Vui lòng kiểm tra lại thông tin hợp đồng");
    };

    // createAssetForm.setFieldsValue({
    //     asset_id: assetId,
    //     hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
    //     hand_over_asset_quantity: formAddAsset.asset_unit,
    //     asset_type_show_name: formAddAsset.asset_type,
    //     hand_over_asset_status: formAddAsset.asset_status,
    // });
    // const addAssetFinish = (e) => {
    //     console.log(e);
    //     setAssetId(e.asset_id - 1);
    //     const duplicate = dataAsset.find(
    //         (asset) =>
    //             asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim() &&
    //             asset.hand_over_asset_date_delivery === moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY")
    //     );
    //     if (!duplicate) {
    //         setDataAsset([
    //             ...dataAsset,
    //             { ...e, hand_over_asset_date_delivery: moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY") },
    //         ]);
    //         createAssetForm.setFieldsValue({
    //             asset_id: assetId,
    //             asset_name: "",
    //             hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
    //             hand_over_asset_quantity: formAddAsset.asset_unit,
    //             asset_type_show_name: formAddAsset.asset_type,
    //             // hand_over_asset_status: formAddAsset.asset_status,
    //         });

    //         setAddAssetInRoom(false);
    //         message.success("Thêm mới tài sản thành công");
    //     } else {
    //         setAddAssetInRoom(true);
    //         message.error("Tài sản đã tồn tại");
    //     }
    // };
    // const addAssetFail = (e) => {
    //     setAddAssetInRoom(true);
    // };

    // const editAssetFinish = (e) => {
    //     console.log(e);
    //     const duplicate = dataAsset.find(
    //         (asset) =>
    //             asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim() &&
    //             asset.asset_type_show_name === e.asset_type_show_name &&
    //             asset.hand_over_asset_date_delivery === moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY") &&
    //             asset.hand_over_asset_quantity === e.hand_over_asset_quantity
    //         // asset.hand_over_asset_status === e.hand_over_asset_status
    //     );
    //     if (!duplicate) {
    //         message.success("Cập nhật tài sản thành công");
    //         setDataAsset((pre) => {
    //             return pre.map((asset) => {
    //                 if (asset.asset_id === e.asset_id) {
    //                     return {
    //                         ...e,
    //                         hand_over_asset_date_delivery: moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY"),
    //                     };
    //                 } else {
    //                     return asset;
    //                 }
    //             });
    //         });
    //         setIsEditAsset(false);
    //     } else {
    //         setIsEditAsset(true);
    //         message.error("Cập nhật tài sản thất bại");
    //     }
    // };

    // const editAssetFail = (e) => {
    //     setIsEditAsset(true);
    // };

    const onNext = async () => {
        try {
            if (changeTab === "1") {
                await form.validateFields([
                    "contract_payment_cycle",
                    "owner_name",
                    "owner_gender",
                    "owner_phone_number",
                    "owner_identity_card",
                    "contract_start_date",
                    "contract_end_date",
                ]);
                setDisplayFinish([...displayFinish, 1]);
            } else {
                await form.validateFields(["group_id", "list_room", "contract_price", "contract_deposit"]);
                setDisplayFinish([...displayFinish, 2]);
            }

            setChangeTab((pre) => {
                if (pre === "3") {
                    return "1";
                } else {
                    return (parseInt(pre) + 1).toString();
                }
            });
            if (changeTab === "2") {
                setDisplayFinish([...displayFinish, 2]);
                setVisibleSubmit(true);
            }
        } catch (e) {
            notification.error({
                message: "Không thể chuyển qua bước tiếp theo",
                description: "Vui lòng điền đủ thông tin hợp đồng",
                placement: "top",
                duration: 2,
            });
        }
    };
    const onChangeGroup = (e, data = []) => {
        console.log(e, data);
        const dataGroup = data;
        setDataApartmentGroupSelect(
            dataGroup.find((obj, index) => obj.group_id === e)
        );
        const list_rooms = dataGroup
            ?.find((obj, index) => obj.group_id === e)
            ?.list_rooms?.filter(room => room.contract_id === null);

        const list_rooms_rented = dataGroup
            ?.find((obj, index) => obj.group_id === e)
            ?.list_rooms?.filter((obj, index) => Number.isInteger(obj.group_contract_id));

        setRoomRented(list_rooms_rented?.length);

        const mapped_list_rooms = list_rooms?.map((obj, index) => obj.room_floor);
        const get_floors = mapped_list_rooms
            ?.filter((obj, index) => mapped_list_rooms.indexOf(obj) === index)
            .sort((a, b) => a - b);

        const floor_room = get_floors?.map((obj, index) => {
            const children = list_rooms?.filter((o, i) => o.room_floor === obj)?.map((room, j) => { return [{ title: `Phòng ${room.room_name}`, key: obj + "-" + room.room_id }] })?.map((a, b) => a[0]);
            return [
                {
                    title: `Tầng ${obj} | Số lượng: ${children.length}`,
                    key: obj.toString(),
                    children: children
                }
            ]
        })?.map((o, i) => o[0]);

        setGroupSelect(dataGroup?.find(
            (obj, index) => obj.group_id === e
        ));

        setNumberOfFloor(floor_room);


        form.setFieldsValue({
            address_city: dataGroup?.find((obj, index) => obj.group_id === e)
                ?.address?.address_city,
            address_district: dataGroup?.find((obj, index) => obj.group_id === e)
                ?.address?.address_district,
            address_more_details: dataGroup?.find((obj, index) => obj.group_id === e)
                ?.address?.address_more_details,
            address_wards: dataGroup?.find((obj, index) => obj.group_id === e)
                ?.address?.address_wards,
        });
        setCheckedKeys([]);
        setListRoomId([]);
    };

    useEffect(() => {
        form.setFieldsValue({
            owner_name: state.rack_renter_full_name,
            owner_gender: state.gender,
            owner_phone_number: state.phone_number,
            owner_identity_card: state.identity_number,
            contract_payment_cycle: state.contract_payment_cycle,
            contract_duration: state.contract_term,
            contract_start_date: moment(state.contract_start_date),
            contract_end_date: moment(state.contract_end_date),
            group_id: state.group_id,
            contract_price: state.contract_price,
            contract_deposit: state.contract_deposit
        });
    }, []);

    return (
        <div className="contract">
            <Spin size="large" spinning={loading}>
                <Layout className="page-layout">
                    <Sider width={250}>
                        <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                        <Sidebar />
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="layout-header">
                            <p className="header-title">Cập nhật hợp đồng đi thuê</p>
                        </Header>
                        <Content className="page-content">
                            <Row>
                                <Col span={24}>
                                    <Breadcrumbs />
                                    <Divider />
                                </Col>
                            </Row>
                            <div
                                className="site-layout-background"
                            // style={{
                            //   minHeight: 360,
                            // }}
                            >
                                <div className="button-cover">
                                    <Button
                                        href="/contract-apartment"
                                        type="primary"
                                        icon={<ArrowLeftOutlined />}
                                        // style={{ marginRight: 5, float: "right" }}
                                        className="button-back"
                                    >
                                        Danh sách hợp đồng
                                    </Button>
                                </div>
                                <Form
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishContractFail}
                                    form={form}
                                    layout="horizontal"
                                    initialValues={{
                                        size: componentSize,
                                    }}
                                    onValuesChange={onFormLayoutChange}
                                    size={componentSize}
                                    width={1000}
                                    id="create-contract"
                                >
                                    <Tabs activeKey={changeTab} defaultActiveKey="1">
                                        <Tabs.TabPane
                                            tab={
                                                <span className="text-size-tab">
                                                    1. Thông tin chung{" "}
                                                    {displayFinish.find((obj, index) => obj === 1) ? (
                                                        <CheckCircleTwoTone style={{ fontSize: "130%" }} twoToneColor="#52c41a" />
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                            }
                                            key="1"
                                        >
                                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                <Col xs={24} lg={12} xl={12} span={12}>
                                                    <Card
                                                        title={
                                                            <>
                                                                <Tag color="blue" className="text-tag">
                                                                    <div style={{ overflow: "auto" }}>
                                                                        <h3>
                                                                            <UserOutlined className="icon-size" />
                                                                            <span className="font-size-tag">
                                                                                <b> Thông tin người cho thuê </b>
                                                                            </span>
                                                                        </h3>
                                                                    </div>
                                                                </Tag>
                                                            </>
                                                        }
                                                        className="card-width-100 card-height"
                                                    >
                                                        <Row>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="owner_name"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Tên người cho thuê: </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập tên người cho thuê",
                                                                        whitespace: true,
                                                                    },
                                                                ]}
                                                            >
                                                                <Input placeholder="Tên người cho thuê"></Input>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="owner_gender"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng chọn giới tính",
                                                                    },
                                                                ]}
                                                            >
                                                                <Radio.Group>
                                                                    <Radio value={true}>Nam</Radio>
                                                                    <Radio value={false}>Nữ</Radio>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="owner_phone_number"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Số điện thoại: </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập số điện thoại",
                                                                        whitespace: true,
                                                                    },
                                                                    {
                                                                        pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                                                                        message: "Số điện thoại phải bắt đầu (+84,0,84)",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input placeholder="Số điện thoại"></Input>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="owner_email"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Email: </b>
                                                                    </span>
                                                                }
                                                            >
                                                                <Input placeholder="Email"></Input>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="owner_identity_card"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>CCCD/CMND: </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập CCCD/CMND",
                                                                        whitespace: true,
                                                                    },
                                                                    {
                                                                        pattern: /^([0-9]{12})\b/,
                                                                        message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input placeholder="CCCD/CMND"></Input>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="address_more_detail"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Địa chỉ chi tiết: </b>
                                                                    </span>
                                                                }
                                                            >
                                                                <Input placeholder="Địa chỉ chi tiết"></Input>
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_note"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Ghi chú: </b>
                                                                    </span>
                                                                }
                                                            >
                                                                <TextArea
                                                                    className="textArea"
                                                                    maxLength={200}
                                                                    rows={5}
                                                                    placeholder="Ghi chú"
                                                                    value={""}
                                                                />
                                                            </Form.Item>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} lg={12} xl={12} span={12}>
                                                    <Card
                                                        title={
                                                            <>
                                                                <Tag color="blue" className="text-tag">
                                                                    <h3>
                                                                        <AuditOutlined className="icon-size" />
                                                                        <span className="font-size-tag">
                                                                            <b> Thông tin về hợp đồng </b>
                                                                        </span>
                                                                    </h3>
                                                                </Tag>
                                                            </>
                                                        }
                                                        bordered={false}
                                                        className="card-width-100 card-height"
                                                    >
                                                        <Row>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_payment_cycle"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <>
                                                                        <span>
                                                                            <b>Chu kỳ thanh toán: </b>
                                                                        </span>
                                                                    </>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập chu kỳ thanh toán",
                                                                    },
                                                                ]}
                                                            >
                                                                <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
                                                                    {contract_payment_cycle.map((obj, index) => {
                                                                        return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                            <p>
                                                                <i>
                                                                    <b>Chu kỳ thanh toán:</b> chu kỳ số tháng thanh toán 1 lần
                                                                </i>
                                                            </p>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_duration"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Thời hạn hợp đồng (ít nhất 6 tháng): </b>
                                                                    </span>
                                                                }
                                                            // rules={[
                                                            //   {
                                                            //     required: true,
                                                            //     message: "Vui lòng chọn thời hạn hợp đồng",
                                                            //   },
                                                            // ]}
                                                            >
                                                                <Select
                                                                    placeholder="Thời hạn hợp đồng"
                                                                    onChange={(e) => {
                                                                        setContractDuration(e);
                                                                        form.setFieldsValue({
                                                                            contract_end_date: moment(contractStartDate.add(e, "M"), dateFormatList),
                                                                            contract_start_date: moment(contractStartDate.subtract(e, "M"), dateFormatList),
                                                                        });
                                                                    }}
                                                                >
                                                                    {contract_duration.map((obj, index) => {
                                                                        return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>;
                                                                    })}
                                                                </Select>
                                                            </Form.Item>

                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_start_date"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Ngày hợp đồng có hiệu lực: </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng chọn ngày lập hợp đồng",
                                                                    },
                                                                ]}
                                                            >
                                                                <DatePicker
                                                                    onChange={(e) => {
                                                                        setContractStartDate(e);
                                                                        const startDate = form.getFieldsValue().contract_start_date;
                                                                        form.setFieldsValue({
                                                                            contract_end_date: moment(startDate).add(contractDuration, "M"),
                                                                        });
                                                                    }}
                                                                    allowClear={false}
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Ngày vào ở"
                                                                    defaultValue={moment()}
                                                                    format="DD-MM-YYYY"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_end_date"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Ngày kết thúc: </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng chọn ngày kết thúc",
                                                                    },
                                                                ]}
                                                            >
                                                                <DatePicker
                                                                    allowClear={false}
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Ngày kết thúc"
                                                                    format="DD-MM-YYYY"
                                                                />
                                                            </Form.Item>
                                                        </Row>
                                                        <Row>
                                                            <p>
                                                                <i>
                                                                    Bạn chưa chọn tầng và phòng thuê, bấm <Link onClick={onNext}>tiếp</Link> để chọn
                                                                </i>
                                                            </p>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tabs.TabPane>
                                        <Tabs.TabPane
                                            tab={
                                                <span className="text-size-tab">
                                                    2. Chọn tầng và phòng{" "}
                                                    {displayFinish.find((obj, index) => obj === 2) ? (
                                                        <CheckCircleTwoTone style={{ fontSize: "130%" }} twoToneColor="#52c41a" />
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                            }
                                            key="2"
                                        >
                                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                <Col xs={24} md={12} lg={12} xl={8} span={8}>
                                                    <Card
                                                        title={
                                                            <>
                                                                <Tag color="blue" className="text-tag">
                                                                    <h3>
                                                                        <HomeOutlined className="icon-size" />
                                                                        <span className="font-size-tag">
                                                                            <b> Thông tin chung cư </b>
                                                                        </span>
                                                                    </h3>
                                                                </Tag>
                                                            </>
                                                        }
                                                        bordered={false}
                                                        className="card-width-100 card-height"
                                                    >
                                                        <Row>
                                                            <Col xs={24} md={16} xl={12} span={12}>
                                                                <Form.Item
                                                                    className="form-item"
                                                                    name="group_id"
                                                                    labelCol={{ span: 24 }}
                                                                    label={
                                                                        <span>
                                                                            <b>Chọn chung cư: </b>
                                                                        </span>
                                                                    }
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Vui lòng chọn chung cư",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select
                                                                        disabled
                                                                        showSearch
                                                                        filterOption={(input, option) =>
                                                                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                        onChange={(e) => {
                                                                            onChangeGroup(e, dataApartmentGroup);
                                                                        }}
                                                                        placeholder="Chọn chung cư"
                                                                        options={dataApartmentGroup?.map((obj, index) => {
                                                                            return { value: obj.group_id, label: obj.group_name };
                                                                        })}
                                                                    ></Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Divider />
                                                        <Row>
                                                            <Col span={12}>
                                                                <p><b>Số lượng tầng:</b> </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>
                                                                    {
                                                                        groupSelect.length === 0 ? state.total_floor :
                                                                            groupSelect?.list_rooms?.map((obj, index) => obj.room_floor)
                                                                                ?.filter((o, i) => groupSelect?.list_rooms
                                                                                    ?.map((obj, index) => obj.room_floor)
                                                                                    ?.indexOf(o) === i)?.length
                                                                    }
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p><b>Số lượng phòng:</b> </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>{groupSelect.length === 0 ? state.total_room : groupSelect?.list_rooms?.length}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p>
                                                                    <b>Tỉnh/Tp: </b>{" "}
                                                                </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>{groupSelect?.address?.address_city}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p><b>Quận/Huyện:</b> </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>{groupSelect?.address?.address_district}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p>
                                                                    <b>Phường/Xã:</b>{" "}
                                                                </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>{groupSelect?.address?.address_wards}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p>
                                                                    <b>Địa chỉ chi tiết:</b>{" "}
                                                                </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>{groupSelect?.address?.address_more_details}</p>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <p>
                                                                    <b>Trạng thái: </b>{" "}
                                                                </p>
                                                            </Col>
                                                            <Col span={12}>
                                                                <p>
                                                                    <Tag color={
                                                                        groupSelect.length === 0
                                                                            ? (state?.list_lease_contracted_room?.length === state?.total_room ? 'red' : 'success')
                                                                            : (groupSelect?.list_rooms?.length === roomRented ? 'red' : 'success')}
                                                                    >
                                                                        {groupSelect.length === 0
                                                                            ? (state?.list_lease_contracted_room?.length === state?.total_room ? 'Đã thuê hết' : 'Còn phòng')
                                                                            : (groupSelect?.list_rooms?.length === roomRented ? 'Đã thuê hết' : 'Còn phòng')}
                                                                    </Tag>
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} md={12} lg={12} xl={8} span={8}>
                                                    <Card
                                                        title={
                                                            <>
                                                                <Tag color="blue" className="text-tag">
                                                                    <h3>
                                                                        <HomeOutlined className="icon-size" />
                                                                        <span className="font-size-tag">
                                                                            <b> Chọn tầng và phòng </b>
                                                                        </span>
                                                                    </h3>
                                                                </Tag>
                                                            </>
                                                        }
                                                        bordered={false} className="card-width-100 card-height">
                                                        <Row>
                                                            <Col span={24}>
                                                                <p>
                                                                    <b>Số lượng phòng đã chọn:</b> {listRoomId.length}
                                                                </p>
                                                                <Form.Item
                                                                    className="form-item"
                                                                    name="list_room"
                                                                    labelCol={{ span: 24 }}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Vui lòng chọn phòng",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Tree
                                                                        checkable
                                                                        onExpand={onExpand}
                                                                        expandedKeys={expandedKeys}
                                                                        autoExpandParent={autoExpandParent}
                                                                        onCheck={onCheck}
                                                                        checkedKeys={checkedKeys}
                                                                        onSelect={onSelect}
                                                                        selectedKeys={selectedKeys}
                                                                        treeData={numberOfFloor}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>

                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} md={12} lg={12} xl={8} span={8}>
                                                    <Card
                                                        title={
                                                            <>
                                                                <Tag color="blue" className="text-tag">
                                                                    <h3>
                                                                        <DollarOutlined className="icon-size" />
                                                                        <span className="font-size-tag">
                                                                            <b> Thông tin giá trị hợp đồng </b>
                                                                        </span>
                                                                    </h3>
                                                                </Tag>
                                                            </>
                                                        }
                                                        className="card-width-100 card-height"
                                                    >
                                                        <Row>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_price"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Giá thuê (VND): </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập giá thuê",
                                                                    },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    controls={false}
                                                                    addonAfter="VNĐ"
                                                                    defaultValue={0}
                                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                                                    style={{ width: "100%" }}
                                                                    min={0}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                className="form-item"
                                                                name="contract_deposit"
                                                                labelCol={{ span: 24 }}
                                                                label={
                                                                    <span>
                                                                        <b>Số tiền cọc (VND): </b>
                                                                    </span>
                                                                }
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Vui lòng nhập tiền cọc",
                                                                    },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    controls={false}
                                                                    addonAfter="VNĐ"
                                                                    defaultValue={0}
                                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                                                    style={{ width: "100%" }}
                                                                    min={0}
                                                                />
                                                            </Form.Item>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tabs.TabPane>
                                        <Tabs.TabPane
                                            tab={
                                                <span style={{ fontSize: "17px" }}>
                                                    3. Dịch vụ{" "}
                                                    {displayFinish.find((obj, index) => obj === 3) ? (
                                                        <CheckCircleTwoTone style={{ fontSize: "130%" }} twoToneColor="#52c41a" />
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                            }
                                            key="3"
                                        >
                                            <Row>
                                                <Col span={23}>
                                                    {/* <Form.Item className="form-item" name="list_general_service" labelCol={{ span: 24 }}> */}
                                                    <h3>
                                                        <b>
                                                            Thông tin về dịch vụ sử dụng
                                                            {dataApartmentGroupSelect?.group_name !== undefined
                                                                ? " " + dataApartmentGroupSelect?.group_name + " "
                                                                : ""}
                                                        </b>
                                                    </h3>
                                                    {/* </Form.Item> */}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Table
                                                        bordered
                                                        rowKey={(record) => record.key}
                                                        dataSource={dataApartmentGroupSelect?.list_general_service}
                                                        columns={columnsService}
                                                        loading={loading}
                                                    ></Table>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <p>
                                                    <i>
                                                        <b>Lưu ý:</b>
                                                        <br />
                                                        - Trên đây là dịch vụ chung áp dụng cho tất cả các phòng trong một tòa nhà.
                                                        <br />- Nếu bạn muốn thay đổi dịch vụ chung này cần vào mục <a href="/service">Dịch Vụ</a>
                                                        <br />
                                                    </i>
                                                </p>
                                            </Row>
                                            <Row>
                                                <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                                            </Row>
                                        </Tabs.TabPane>
                                    </Tabs>
                                </Form>
                                <Button
                                    style={changeTab === "1" ? { display: "none" } : { display: "inline", marginRight: "0.5%" }}
                                    type="default"
                                    onClick={() => {
                                        setChangeTab((pre) => {
                                            if (pre === "1") {
                                                return "3";
                                            } else {
                                                return (parseInt(pre) - 1).toString();
                                            }
                                        });
                                        if (changeTab === "3") {
                                            setVisibleSubmit(false);
                                        }
                                    }}
                                >
                                    Quay lại
                                </Button>
                                {visibleSubmit ? (
                                    <Button
                                        htmlType="submit"
                                        style={{ marginTop: "1%", marginRight: "1%" }}
                                        type="primary"
                                        form="create-contract"
                                    >
                                        Cập nhật hợp đồng
                                    </Button>
                                ) : (
                                    ""
                                )}
                                <Button
                                    style={
                                        visibleSubmit ? { display: "none" } : { marginTop: "1%", marginRight: "0.5%", display: "inline" }
                                    }
                                    type="primary"
                                    onClick={onNext}
                                >
                                    Tiếp
                                </Button>
                                {/* <Modal
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
                                        <Button htmlType="submit" key="submit" form="create-asset" type="primary">
                                            Lưu
                                        </Button>,
                                        <Button
                                            key="back"
                                            onClick={() => {
                                                setAddAssetInRoom(false);
                                            }}
                                        >
                                            Huỷ
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
                                        <Form.Item className="form-item" name="asset_id" style={{ display: "none" }}></Form.Item>
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
                                            name="hand_over_asset_date_delivery"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Ngày bàn giao: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn ngày bàn giao",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                placeholder="Ngày bàn giao"
                                                defaultValue={moment()}
                                                format="DD-MM-YYYY"
                                            />
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
                                            <InputNumber defaultValue={1} style={{ width: "100%" }} min={1} />
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
                                                    return (
                                                        <Select.Option value={obj.asset_type_show_name}>{obj.asset_type_show_name}</Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>

                                    </Form>
                                </Modal> */}
                                {/* <Modal
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
                                        <Button htmlType="submit" key="submit" form="edit-asset" type="primary">
                                            Lưu
                                        </Button>,
                                        <Button
                                            key="back"
                                            onClick={() => {
                                                setIsEditAsset(false);
                                            }}
                                        >
                                            Huỷ
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
                                        <Form.Item className="form-item" name="asset_id" style={{ display: "none" }}></Form.Item>
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
                                            name="hand_over_asset_date_delivery"
                                            labelCol={{ span: 24 }}
                                            label={
                                                <span>
                                                    <b>Ngày bàn giao: </b>
                                                </span>
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn ngày bàn giao",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                placeholder="Ngày bàn giao"
                                                defaultValue={moment()}
                                                format="DD-MM-YYYY"
                                            />
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
                                            <InputNumber defaultValue={1} style={{ width: "100%" }} min={1} />
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
                                                    message: "Vui lòng chọn Nhóm tài sản",
                                                },
                                            ]}
                                        >
                                            <Select disabled={disableEditAsset} placeholder={"Nhóm tài sản"}>
                                                {listAssetType?.map((obj, index) => {
                                                    return (
                                                        <Select.Option value={obj.asset_type_show_name}>{obj.asset_type_show_name}</Select.Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Modal> */}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Spin>
        </div>
    );
};
export default EditContractBuilding;