import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "../../api/axios";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  FilterOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  AuditOutlined,
  DollarOutlined,
  CheckCircleTwoTone
} from "@ant-design/icons";
import moment from "moment";
import {
  Button,
  Layout,
  Modal,
  Form,
  Table,
  Space,
  Input,
  Select,
  Tabs,
  Row,
  Col,
  Radio,
  DatePicker,
  Tag,
  Checkbox,
  InputNumber,
  message,
  notification
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const CreateContractRenter = () => {
  const LIST_OLD_RENTER = "manager/renter/old";
  const LIST_ASSET_TYPE = "manager/asset/type";
  const APARTMENT_DATA_GROUP = "/manager/group/get-group";
  const ADD_NEW_CONTRACT = "/manager/contract/add-new-contract";
  const dateFormatList = ["DD/MM/YYYY", "YYYY/MM/DD"];
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [dataOldRenter, setDataOldRenter] = useState([]);
  const [listAssetType, setListAssetType] = useState([]);

  const defaultAddAsset = {
    dateOfDelivery: moment(),
    asset_unit: 1,
    asset_type: "Khác",
    asset_status: true,
  };
  const contract_duration = [];
  for (let i = 1; i < 17; i++) {
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

  const dataFilter = {
    id: [],
    asset_type: [],
  };

  const navigate = useNavigate();
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [oldRenterGender, setOldRenterGender] = useState([]);
  const [isAdd, setisAdd] = useState(false);
  const [componentSize, setComponentSize] = useState("default");
  const [selectOldRenter, setSelectOldRenter] = useState([]);
  const [form] = Form.useForm();
  const [createAssetForm] = Form.useForm();
  const [editAssetForm] = Form.useForm();
  const [formAddAsset, setFormAddAsset] = useState(defaultAddAsset);
  const [isEditAsset, setIsEditAsset] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [memberId, setMemberId] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formEditMem] = Form.useForm();
  const [isEditMem, setIsEditMem] = useState(false);
  const [formAddMem] = Form.useForm();
  const [isAddMem, setIsAddMem] = useState(false);
  const [dataAsset, setDataAsset] = useState([]);
  const [assetId, setAssetId] = useState(-1);
  const [changeTab, setChangeTab] = useState("1");
  const [visibleSubmit, setVisibleSubmit] = useState(false);
  const [genderChange, setGenderChange] = useState(true);
  const [paymentCircle, setPaymentCircle] = useState(new Date().getDate() < 16 ? 15 : 30);
  const [contractStartDate, setContractStartDate] = useState(moment());
  const [contractDuration, setContractDuration] = useState();
  const [contractBillCycle, setContractBillCycle] = useState(1);
  const [displayFinish, setDisplayFinish] = useState([]);
  const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);

  const { auth } = useAuth();
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    apartmentGroup();
  }, []);

  const apartmentGroup = async () => {
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
        setDataApartmentGroup(res.data.body);
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
      title: "Loại",
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
    {
      title: "Thời gian",
      dataIndex: "hand_over_asset_date_delivery",
      key: "asset_id",
    },
    {
      title: "Trạng thái",
      dataIndex: "hand_over_asset_status",
      filters: [
        { text: "Tốt", value: true },
        { text: "Hỏng", value: false },
      ],
      filteredValue: assetStatus.hand_over_asset_status || null,
      onFilter: (value, record) => record.hand_over_asset_status === value,
      render: (status) => {
        return (
          <>
            <Tag color={status ? "success" : "error"}>{status ? "Tốt" : "Hỏng"}</Tag>
          </>
        );
      },
    },
    {
      title: "Thao tác",
      key: "asset_id",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                setIsEditAsset(true);
                editAssetForm.setFieldsValue({
                  asset_id: record.asset_id,
                  asset_name: record.asset_name,
                  hand_over_asset_date_delivery:
                    record.hand_over_asset_date_delivery !== null
                      ? moment(record.hand_over_asset_date_delivery, dateFormatList)
                      : "",
                  hand_over_asset_quantity: record.hand_over_asset_quantity,
                  asset_type_show_name: record.asset_type_show_name,
                  hand_over_asset_status: record.hand_over_asset_status,
                });
              }}
              style={{ fontSize: "120%" }}
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

  useEffect(() => {
    getAllOldRenter();
  }, []);

  const getAllOldRenter = async () => {
    await axios
      .get(LIST_OLD_RENTER, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataOldRenter(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAssetType();
  }, []);

  const getAssetType = async () => {
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
        setListAssetType(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renterColumn = [
    {
      title: "Họ và tên",
      dataIndex: "renter_full_name",
      key: "id",
      filteredValue: [searched],
      onFilter: (value, record) => {
        return String(record.renter_full_name).toLowerCase()?.includes(value.toLowerCase()) ||
          String(record.renter_phone_number).toLowerCase()?.includes(value.toLowerCase()) ||
          String(record.renter_identity_number).toLowerCase()?.includes(value.toLowerCase());
      },
      width: 200
    },
    {
      title: "Giới tính",
      dataIndex: "renter_gender",
      key: "renter_gender",
      filters: [
        { text: "Nam", value: 'Nam' },
        { text: "Nữ", value: 'Nữ' },
      ],
      filteredValue: oldRenterGender.renter_gender || null,
      onFilter: (value, record) => record.renter_gender === value,
      width: 120
    },
    {
      title: "Số điện thoại",
      dataIndex: "renter_phone_number",
      key: "id",
      width: 130
    },
    {
      title: "Email",
      dataIndex: "renter_email",
      key: "id",
      width: 350
    },
    {
      title: "CCCD/CMND",
      dataIndex: "renter_identity_number",
      key: "id",
      with: 250
    },
  ];
  const onAdd = (record) => {
    setisAdd(true);
  };

  const resetAdd = () => {
    setisAdd(false);
  };
  const onOk = () => {
    setGenderChange(selectOldRenter.renter_gender === "Nam" ? true : false);
    form.setFieldsValue({
      renter_name: selectOldRenter.renter_full_name,
      renter_phone_number: selectOldRenter.renter_phone_number,
      renter_gender: selectOldRenter.renter_gender === "Nam" ? true : false,
      renter_email: selectOldRenter.renter_email,
      renter_identity_card: selectOldRenter.renter_identity_number,
    });
    setisAdd(false);
  };
  const [listGeneralService, setListGeneralService] = useState([]);

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

  const columnsMember = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "member_id",
    },
    {
      title: "Giới tính",
      dataIndex: "member_gender",
      key: "member_id",
      render: (member_gender) => {
        return member_gender ? "Nam" : "Nữ";
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "member_id",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "identity_card",
      key: "member_id",
    },
    {
      title: "Biển số xe",
      dataIndex: "license_plates",
      key: "member_id",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "member_id",
    },

    {
      title: "Thao tác",
      key: "member_id",
      render: (record) => (
        <Space>
          <EditOutlined
            onClick={() => {
              setIsEditMem(true);
              formEditMem.setFieldsValue({
                member_id: record.member_id,
                member_gender: record.member_gender,
                name: record.name,
                identity_card: record.identity_card,
                phone_number: record.phone_number,
                license_plates: record.license_plates,
                address: record.address,
              });
            }}
          />
          <DeleteOutlined onClick={() => onDeleteMember(record)} style={{ color: "red", marginLeft: 12 }} />
        </Space>
      ),
    },
  ];

  const onFinishAddMem = (e) => {
    const duplicate = dataMember.find(
      (mem) =>
        mem.name.toLowerCase().trim() === e.name.toLowerCase().trim() &&
        mem.member_gender === e.member_gender &&
        mem.identity_card.toLowerCase().trim() === e.identity_card.toLowerCase().trim()
    );

    if (!duplicate) {
      setMemberId(e.member_id + 1);
      setDataMember([...dataMember, e]);
      message.success("Thêm mới thành viên thành công");
      setIsAddMem(false);
      formAddMem.setFieldsValue({
        member_id: memberId,
        name: "",
        identity_card: "",
        phone_number: "",
        license_plates: "",
        address: "",
      });
    } else {
      setIsAddMem(true);
      message.error("Thành viên đã tồn tại");
    }
  };
  const onFinishFailAddMem = (e) => {
    message.error("Thêm thành viên thất bại");
  };

  const onFinishEditMem = (e) => {
    const duplicate = dataMember.find(
      (mem) =>
        mem.name.toLowerCase().trim() === e.name.toLowerCase().trim() &&
        mem.member_gender === e.member_gender &&
        mem.identity_card.toLowerCase().trim() === e.identity_card.toLowerCase().trim() &&
        mem.license_plates.toLowerCase().trim() === e.license_plates.toLowerCase().trim() &&
        mem.address.toLowerCase().trim() === e.address.toLowerCase().trim()
    );
    if (!duplicate) {
      setDataMember((pre) => {
        return pre.map((obj, index) => {
          if (obj.member_id === e.member_id) {
            return e;
          } else {
            return obj;
          }
        });
      });
      message.success("Chỉnh sửa thành viên thành công");
      setIsEditMem(false);
    } else {
      setIsEditMem(true);
      message.error("Chỉnh sửa thành viên thất bại");
    }
  };
  const onFinishFailEditMem = (e) => {
    message.error("Chỉnh sửa thành viên thất bại");
  };

  const onDeleteMember = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.name} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setDataMember((pre) => {
          return pre.filter((member) => member.member_id !== record.member_id);
        });
      },
    });
  };

  const [addAssetInRoom, setAddAssetInRoom] = useState(false);
  const [floorRoom, setFloorRoom] = useState();

  const [roomStatus, setRoomStatus] = useState(true);
  const [floorStatus, setFloorStatus] = useState(true);


  const getListFloor = dataApartmentGroupSelect?.list_rooms?.filter((obj, index) => obj.contract_id === null)?.map((o, i) => o.room_floor);
  const floors = getListFloor?.filter((obj, index) => getListFloor.indexOf(obj) === index);

  const [room, setRoom] = useState([]);
  const [roomSelect, setRoomSelect] = useState("");

  // console.log(dataApartmentGroup);
  const onFinish = async (e) => {
    // console.log(
    //   JSON.stringify({
    //     ...e,
    //     contract_end_date: new Date(e.contract_end_date).toLocaleDateString(),
    //     contract_start_date: new Date(e.contract_start_date).toLocaleDateString(),
    //   })
    // );
    // console.log({
    //   ...e, contract_end_date: new Date(e.contract_end_date).toLocaleDateString(),
    //   contract_start_date: new Date(e.contract_start_date).toLocaleDateString(),
    // });

    await axios
      .post(
        ADD_NEW_CONTRACT,
        {
          ...e,
          contract_end_date: new Date(e.contract_end_date).toLocaleDateString(),
          contract_start_date: new Date(e.contract_start_date).toLocaleDateString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${cookie}`,
          },
          // withCredentials: true,
        }
      )
      .then((res) => {
        navigate("/contract-renter");
        notification.success({
          message: "Thêm mới hợp đồng thành công",
          placement: "top",
          duration: 3,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Thêm mới hợp đồng thất bại",
          description: "Vui lòng kiểm tra lại thông tin hợp đồng",
          placement: "top",
          duration: 3,
        });
      });
    // message.success('Thêm mới hợp đồng thành công');
  };
  const onFinishContractFail = (e) => {
    message.error("Vui lòng kiểm tra lại thông tin hợp đồng");
  };

  const addAssetFinish = (e) => {
    setAssetId(e.asset_id - 1);
    const duplicate = dataAsset.find(
      (asset) => asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim()
    );
    if (!duplicate) {
      setDataAsset([
        ...dataAsset,
        { ...e, hand_over_asset_date_delivery: new Date(e.hand_over_asset_date_delivery).toLocaleDateString() },
      ]);
      createAssetForm.setFieldsValue({
        asset_id: assetId,
        asset_name: "",
        hand_over_asset_date_delivery: "",
        hand_over_asset_quantity: "",
        asset_type_show_name: "",
        hand_over_asset_status: "",
      });
      setAddAssetInRoom(false);
      message.success("Thêm mới tài sản thành công");
    } else {
      setAddAssetInRoom(true);
      message.error("Tài sản đã tồn tại");
    }
  };
  const addAssetFail = (e) => {
    setAddAssetInRoom(true);
  };

  const editAssetFinish = (e) => {
    const duplicate = dataAsset.find(
      (asset) =>
        asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim() &&
        asset.asset_type_show_name === e.asset_type_show_name &&
        asset.hand_over_asset_date_delivery === new Date(e.hand_over_asset_date_delivery).toLocaleDateString() &&
        asset.hand_over_asset_quantity === e.hand_over_asset_quantity &&
        asset.hand_over_asset_status === e.hand_over_asset_status
    );
    if (!duplicate) {
      message.success("Cập nhật tài sản thành công");
      setDataAsset((pre) => {
        return pre.map((asset) => {
          if (asset.asset_id === e.asset_id) {
            return {
              ...e,
              hand_over_asset_date_delivery: new Date(e.hand_over_asset_date_delivery).toLocaleDateString(),
            };
          } else {
            return asset;
          }
        });
      });
      setIsEditAsset(false);
    } else {
      setIsEditAsset(true);
      message.error("Tài sản đã tồn tại");
    }
  };
  const editAssetFail = (e) => {
    setIsEditAsset(true);
  };

  useEffect(() => {
    loadDefault();
  }, []);

  const loadDefault = () => {
    form.setFieldsValue({
      contract_term: 1,
      contract_start_date: contractStartDate,
      renter_gender: genderChange,
      contract_bill_cycle: contractBillCycle,
      contract_payment_cycle: paymentCircle,
    });
    setOldRenterGender({ ...oldRenterGender, renter_gender: ['Nam', 'Nữ'] });
  }

  form.setFieldsValue({
    // group_id: dataApartmentGroupSelect?.group_id,
    list_renter: dataMember,
    list_general_service: listGeneralService,
    list_hand_over_assets: dataAsset,
  });

  formAddMem.setFieldsValue({
    license_plates: "",
    address: "",
  });

  createAssetForm.setFieldsValue({
    asset_id: assetId,
    hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
    hand_over_asset_quantity: formAddAsset.asset_unit,
    asset_type_show_name: formAddAsset.asset_type,
    hand_over_asset_status: formAddAsset.asset_status,
  });

  const onNext = async () => {
    try {
      if (changeTab === "1") {
        await form.validateFields([
          'contract_name', 'renter_name', 'renter_gender', 'renter_phone_number', 'renter_identity_card', 'room_floor',
          'room_id', 'contract_start_date', 'contract_bill_cycle', 'contract_payment_cycle', 'contract_price', 'contract_deposit',
          'contract_end_date'
        ]);
        setDisplayFinish([...displayFinish, 1]);
      } else {
        await form.validateFields(dataApartmentGroupSelect.list_general_service?.map((obj, index) => obj.service_name));
        setDisplayFinish([...displayFinish, 2]);
      }

      setChangeTab((pre) => {
        if (pre === "4") {
          return "1";
        } else {
          return (parseInt(pre) + 1).toString();
        }
      });
      if (changeTab === "3") {
        setDisplayFinish([...displayFinish, 3]);
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
  // console.log(dataApartmentGroupSelect);
  return (
    <div className="contract">
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vh",
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <Row>
              <Col span={24}>
                <p className="header-title">Thêm hợp đồng mới cho khách thuê</p>
              </Col>
            </Row>
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
              <div style={{ overflow: "auto" }}>
                {/* <Button htmlType="submit" style={{ float: "right" }} type="primary" form="create-contract">Tạo mới hợp đồng</Button> */}
                <Button
                  href="/contract-renter"
                  type="primary"
                  icon={<ArrowLeftOutlined />}
                  style={{ marginRight: 5, float: "right" }}
                >
                  Danh sách hợp đồng
                </Button>
              </div>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishContractFail}
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
                <Tabs activeKey={changeTab} defaultActiveKey="1">
                  <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>1. Thông tin chung {displayFinish.find((obj, index) => obj === 1) ? <CheckCircleTwoTone style={{ fontSize: '130%' }} twoToneColor="#52c41a" /> : ''}</span>} key="1">
                    <Row>
                      <Col span={8}>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <h3>
                              <UserOutlined style={{ fontSize: '130%' }} /><span style={{ fontSize: '15px' }}><b>Thông tin về khách thuê </b></span>
                            </h3>
                          </Tag>
                        </Row>
                        <Row>
                          <Button
                            style={{ marginTop: '1%', wordBreak: 'break-all', whiteSpace: 'normal', height: 'auto' }}
                            type="primary"
                            size="default"
                            onClick={() => {
                              onAdd();
                            }}
                          >
                            Lấy thông tin khách cũ
                          </Button>
                        </Row>
                        <Form.Item
                          className="form-item"
                          name="contract_name"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Tên hợp đồng: </b>
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên hợp đồng",
                              whitespace: true,
                            },
                          ]}
                        >
                          <Input placeholder="Tên hợp đồng"></Input>
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="renter_name"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên khách thuê",
                              whitespace: true,
                            },
                          ]}
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Họ và tên khách thuê: </b>
                            </span>
                          }
                        >
                          {/* <span><b>Tên khách thuê: </b></span> */}
                          <Input placeholder="Họ và tên khách thuê"></Input>
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="renter_gender"
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
                          name="renter_phone_number"
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
                          name="renter_email"
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
                          name="renter_identity_card"
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
                          name="contract_note"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Ghi chú: </b>
                            </span>
                          }
                        >
                          <TextArea rows={4} placeholder="Ghi chú" value={""} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                          <h3>
                            <AuditOutlined style={{ fontSize: '130%' }} /> <span style={{ fontSize: '15px' }}><b>Thông tin về hợp đồng </b></span>
                          </h3>
                        </Tag>
                        <Form.Item
                          className="form-item"
                          name="group_id"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Tòa nhà: </b>
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn tòa nhà",
                            },
                          ]}
                        >
                          <Select onChange={(e) => {
                            form.setFieldsValue({ room_floor: "", room_id: "", });
                            setRoomStatus(true);
                            setDataApartmentGroupSelect(dataApartmentGroup.find((obj, index) => obj.group_id === e));
                            setDataAsset(
                              dataApartmentGroup.find((obj, index) => obj.group_id === e)?.list_hand_over_assets?.map(
                                (obj, index) =>
                                  [
                                    {
                                      asset_id: obj.asset_id,
                                      asset_name: obj.asset_name,
                                      asset_type: obj.asset_type,
                                      hand_over_asset_date_delivery: new Date(obj.hand_over_asset_date_delivery).toLocaleDateString(),
                                      asset_type_show_name: obj.asset_type_show_name,
                                      hand_over_asset_quantity: 1,
                                      hand_over_asset_status: obj.hand_over_asset_status,
                                    },
                                  ][0]
                              )
                            );
                            setFloorStatus(false);
                          }} placeholder="Chọn tòa nhà">
                            {dataApartmentGroup.map((obj, index) => {
                              return <Select.Option value={obj.group_id}>{obj.group_name}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="room_floor"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Tầng: </b>
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn tầng",
                            },
                          ]}
                        >
                          <Select
                            disabled={floorStatus}
                            placeholder="Chọn tầng"
                            optionFilterProp="children"
                            onChange={(e) => {
                              setRoomStatus(false);
                              setRoom(
                                dataApartmentGroupSelect?.list_rooms?.filter(
                                  (data) => data.room_floor === e && data.contract_id === null
                                )
                              );
                              setFloorRoom((pre) => {
                                return { ...pre, room_floor: e };
                              });
                            }}
                          >
                            <Select.Option value="">Chọn tầng</Select.Option>
                            {floors
                              ?.sort((a, b) => a - b)
                              ?.map((obj, index) => {
                                return (
                                  <Select.Option key={index} value={obj}>
                                    {obj}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="room_id"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Phòng: </b>
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn phòng",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => (option?.children ?? '').includes(input)}
                            placeholder="Chọn phòng"
                            disabled={roomStatus}
                            onChange={(e) => {
                              setRoomSelect(dataApartmentGroupSelect?.list_rooms?.find((obj) => obj.room_id === e).room_name);
                              form.setFieldsValue({
                                contract_price: dataApartmentGroupSelect?.list_rooms?.find((obj) => obj.room_id === e).room_price,
                                contract_deposit: dataApartmentGroupSelect?.list_rooms?.find((obj) => obj.room_id === e).room_price
                              });
                            }}
                          >
                            <Select.Option value="">Chọn phòng</Select.Option>
                            {room?.map((obj, index) => {
                              return (
                                <Select.Option key={index} value={obj.room_id}>
                                  {obj.room_name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item className="form-item" name="contract_term" style={{ display: "none" }}></Form.Item>
                        <Form.Item
                          className="form-item"
                          name="contract_duration"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Thời hạn hợp đồng (ít nhất 1 tháng): </b>
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
                            format="DD/MM/YYYY"
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
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="contract_bill_cycle"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Chu kỳ tính tiền (tháng): </b>
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chu kỳ tính tiền",
                            },
                          ]}
                        >
                          <Select
                            onChange={(e) => {
                              setContractBillCycle(e);
                            }}
                            placeholder="Chu kỳ tính tiền"
                            style={{ width: "100%" }}
                          >
                            {contract_duration.map((obj, index) => {
                              return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>;
                            })}
                          </Select>
                        </Form.Item>
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
                            <Option value={15}>kỳ 15</Option>
                            <Option value={30}>kỳ 30</Option>
                          </Select>
                        </Form.Item>

                        <span>
                          <i>
                            <b>Kỳ 15:</b> Khách thuê vào từ ngày 1-15 <br /> <b>Kỳ 30:</b> Khách thuê vào từ ngày 16-31
                          </i>
                        </span>
                      </Col>
                      <Col span={8}>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <h3>
                              <DollarOutlined style={{ fontSize: '130%' }} /> <span style={{ fontSize: '15px' }}><b> Thông tin giá trị hợp đồng </b></span>
                            </h3>
                          </Tag>
                          <Form.Item
                            className="form-item"
                            name="contract_price"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Giá phòng (VND): </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá phòng",
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
                      </Col>
                    </Row>
                    <p>
                      <i>
                        <b>Lưu ý:</b>
                        <br />
                        - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng
                        thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu,
                        bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì
                        gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính
                        tiền theo kỳ.
                        <br />
                        - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn
                        tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được
                        trừ ra khi tính tiền trả phòng.
                        <br />
                        - Chu kỳ tính tiền: là số tháng được tính trên mỗi hóa đơn.
                        <br />
                      </i>
                    </p>
                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>2. Dịch vụ {displayFinish.find((obj, index) => obj === 2) ? <CheckCircleTwoTone style={{ fontSize: '130%' }} twoToneColor="#52c41a" /> : ''}</span>} key="2">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="list_general_service" labelCol={{ span: 24 }}>
                          <h3>
                            <b>Thông tin về dịch vụ sử dụng {dataApartmentGroupSelect?.group_name !== undefined ? dataApartmentGroupSelect?.group_name + " " : ''}</b>
                          </h3>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        {dataApartmentGroupSelect.list_general_service?.map((obj, index) => {
                          return (
                            <>
                              <Form.Item
                                className="form-item"
                                name={obj.service_name}
                                labelCol={{ span: 24 }}
                                label={
                                  <h4>
                                    {obj.service_show_name}{" "}
                                    <b>
                                      (
                                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                        obj.service_price
                                      )}
                                      )
                                    </b>
                                  </h4>
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: `Vui lòng không để trống`,
                                  },
                                ]}
                              >
                                <InputNumber
                                  onChange={(e) => {
                                    if (
                                      !listGeneralService.find(
                                        (o, i) => o.general_service_id === obj.general_service_id
                                      )
                                    ) {
                                      setListGeneralService((pre) => {
                                        return [
                                          ...pre,
                                          {
                                            general_service_id: obj.general_service_id,
                                            hand_over_service_index: e,
                                          },
                                        ];
                                      });
                                    } else {
                                      setListGeneralService((pre) => {
                                        return pre.map((object, serviceIndex) => {
                                          if (object.general_service_id === obj.general_service_id) {
                                            return {
                                              general_service_id: obj.general_service_id,
                                              hand_over_service_index: e,
                                            };
                                          } else {
                                            return object;
                                          }
                                        });
                                      });
                                    }
                                  }}
                                  addonAfter={
                                    String(obj.service_type_name).toLowerCase()?.includes("Đồng hồ".toLowerCase())
                                      ? "Chỉ số hiện tại"
                                      : obj.service_type_name
                                  }
                                  defaultValue={0}
                                  style={{ width: "100%" }}
                                  min={0}
                                />
                              </Form.Item>
                            </>
                          );
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Table
                          bordered
                          rowKey={(record) => record.key}
                          dataSource={dataApartmentGroupSelect.list_general_service}
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
                          <br />- Nếu bạn muốn thay đổi dịch vụ chung này cần vào mục <b>Dịch Vụ</b>
                          <br />
                        </i>
                      </p>
                    </Row>
                    <Row>
                      <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>3. Thành viên {displayFinish.find((obj, index) => obj === 3) ? <CheckCircleTwoTone style={{ fontSize: '130%' }} twoToneColor="#52c41a" /> : ''}</span>} key="3">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="list_renter" labelCol={{ span: 24 }}>
                          <h3>
                            <b>Thông tin về thành viên trong phòng </b>
                          </h3>
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <PlusCircleOutlined
                          style={{ fontSize: 36, marginBottom: 20, color: "#1890ff" }}
                          onClick={() => {
                            setIsAddMem(true);
                            formAddMem.setFieldsValue({
                              member_gender: true,
                              member_id: memberId,
                            });
                          }}
                        />
                      </Col>
                      <Table
                        style={{ width: "100%" }}
                        bordered
                        dataSource={dataMember}
                        columns={columnsMember}
                        scroll={{ x: 800, y: 600 }}
                      ></Table>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>4. Tài sản {displayFinish.find((obj, index) => obj === 4) ? <CheckCircleTwoTone style={{ fontSize: '130%' }} twoToneColor="#52c41a" /> : ''}</span>} key="4">
                    <Row>
                      <Col span={24}>
                        <Form.Item className="form-item" name="list_hand_over_assets" labelCol={{ span: 24 }}>
                          <p>
                            <h3>
                              <b>
                                Thông tin tài sản bàn giao{" "}
                                {dataApartmentGroupSelect?.group_name !== undefined ? dataApartmentGroupSelect?.group_name + " " : ''}
                                {floorRoom?.room_floor !== undefined ? "tầng " + floorRoom?.room_floor : ""}{" "}
                                {roomSelect === "" ? "" : "phòng " + roomSelect}
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
                              <b>Loại tài sản: </b>
                              <Checkbox.Group
                                style={{ paddingLeft: "1%" }}
                                options={listAssetType.map((obj, index) => {
                                  return obj.asset_type_show_name;
                                })}
                                onChange={(checkedValues) => {
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
                              style={{ fontSize: 36, color: "#1890ff", float: "right", marginBottom: '10%' }}
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
                    <Row>
                      <p>
                        <i>
                          <b>Lưu ý:</b>
                          <br />- Cột <b>"thời gian"</b>: trong bảng hiển thị là tính từ thời gian đó tới thời điểm hiện
                          tại thì tài sản có trạng thái <b>"Tốt"</b> hoặc <b>"Hỏng"</b>. <br />- Trong trường hợp bàn
                          giao với khách thuê, tài sản ở thời điểm bàn giao <b>"trạng thái"</b> không như trong bảng
                          hiển thị. Cần cập nhập để hệ thống ghi nhận trạng thái của tài sản ở thời điểm hiện tại.
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
                      return "4";
                    } else {
                      return (parseInt(pre) - 1).toString();
                    }
                  });
                  if (changeTab === "4") {
                    setVisibleSubmit(false);
                  }
                }}
              >
                Quay lại
              </Button>
              {visibleSubmit ? (
                <Button htmlType="submit" style={{ marginTop: "1%" }} type="primary" form="create-contract">
                  Tạo mới hợp đồng
                </Button>
              ) : (
                ""
              )}
              <Button
                style={visibleSubmit ? { display: "none" } : { marginTop: "1%", display: "inline" }}
                type="primary"
                onClick={onNext}
              >
                Tiếp
              </Button>
              <Modal
                title="Thông tin khách hàng cũ"
                visible={isAdd}
                onCancel={() => {
                  resetAdd();
                }}
                onOk={onOk}
                footer={[
                  <Button
                    key="back"
                    onClick={resetAdd}
                  >
                    Đóng
                  </Button>,
                  <Button type="primary" onClick={onOk}>
                    Chọn
                  </Button>,
                ]}
                width={1100}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, }}>
                  <Col span={12}>
                    <Input.Search
                      placeholder="Nhập thông tin khách cũ để tìm kiếm"
                      style={{ marginBottom: '5%', width: '100%' }}
                      onSearch={(e) => {
                        setSearched(e);
                      }}
                      onChange={(e) => {
                        setSearched(e.target.value);
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <span>Giới tính: </span>
                    <Checkbox.Group defaultValue={['Nam', 'Nữ']} onChange={(e) => { setOldRenterGender({ ...oldRenterGender, renter_gender: e }) }}
                      options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }]}></Checkbox.Group>
                  </Col>
                </Row>
                <Form
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 30 }}
                  layout="horizontal"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={"default"}
                >
                  <Form.Item>
                    <Table
                      bordered
                      loading={loading}
                      columns={renterColumn}
                      dataSource={dataOldRenter}
                      scroll={{ x: 1000, y: 400 }}
                      onChange={(pagination, filters, sorter, extra) => {
                        setOldRenterGender(filters);
                      }}
                      rowKey={(record) => record.id}
                      rowSelection={{
                        type: "radio",
                        onSelect: (record) => {
                          setSelectOldRenter({ ...record });
                        },
                      }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
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
                  </Button>
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
                      format="DD/MM/YYYY"
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
                        <b>Loại tài sản: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại tài sản",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại tài sản">
                      {listAssetType.map((obj, index) => {
                        return (
                          <Select.Option value={obj.asset_type_show_name}>{obj.asset_type_show_name}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="hand_over_asset_status"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Trạng thái </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn trạng thái",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={true}>
                        <Tag color="success">Tốt</Tag>
                      </Radio>
                      <Radio value={false}>
                        <Tag color="error">Hỏng</Tag>
                      </Radio>
                    </Radio.Group>
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
                  </Button>
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
                    <Input disabled placeholder="Tên tài sản"></Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_id" style={{ display: "none" }}></Form.Item>
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
                      format="DD/MM/YYYY"
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
                        <b>Loại tài sản: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại tài sản",
                      },
                    ]}
                  >
                    <Select disabled placeholder={"Loại tài sản"}>
                      {listAssetType.map((obj, index) => {
                        return (
                          <Select.Option value={obj.asset_type_show_name}>{obj.asset_type_show_name}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="hand_over_asset_status"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Trạng thái </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn trạng thái",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={true}>
                        <Tag color="success">Tốt</Tag>
                      </Radio>
                      <Radio value={false}>
                        <Tag color="error">Hỏng</Tag>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title={roomSelect === "" ? "Thêm thành viên " : "Thêm thành viên vào Phòng " + roomSelect}
                open={isAddMem}
                onOk={() => {
                  setIsAddMem(false);
                }}
                onCancel={() => {
                  setIsAddMem(false);
                }}
                footer={[
                  <Button key="back" onClick={() => setIsAddMem(false)}>
                    Đóng
                  </Button>,
                  <Button htmlType="submit" key="submit" form="add-member" type="primary">
                    Thêm mới
                  </Button>,
                ]}
              >
                <Form
                  form={formAddMem}
                  onFinish={onFinishAddMem}
                  onFinishFailed={onFinishFailAddMem}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 30 }}
                  layout="horizontal"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={"default"}
                  id="add-member"
                >
                  <Form.Item className="form-item" name="member_id" style={{ display: "none" }}></Form.Item>
                  <Form.Item
                    className="form-item"
                    name="name"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Họ và tên: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên thành viên",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input placeholder="Họ và tên"></Input>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="member_gender"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Giới tính: </b>
                      </span>
                    }
                  >
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="phone_number"
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
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input placeholder="Số điện thoại" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="identity_card"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>CMND/CCCD: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập CMND/CCCD",
                        whitespace: true,
                      },
                      {
                        pattern: /^([0-9]{12})\b/,
                        message: "Vui lòng nhập đúng CMND/CCCD",
                      },
                    ]}
                  >
                    <Input placeholder="CMND/CCCD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="license_plates"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Biển số xe: </b>
                      </span>
                    }
                  >
                    <Input placeholder="Biển số xe"></Input>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="address"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Địa chỉ: </b>
                      </span>
                    }
                  >
                    <Input placeholder="Địa chỉ"></Input>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Chỉnh sửa thành viên "
                open={isEditMem}
                onOk={() => {
                  setIsEditMem(false);
                }}
                onCancel={() => {
                  setIsEditMem(false);
                }}
                footer={[
                  <Button
                    key="back"
                    onClick={() => {
                      setIsEditMem(false);
                    }}
                  >
                    Đóng
                  </Button>,
                  <Button htmlType="submit" key="submit" form="edit-member" type="primary">
                    Lưu
                  </Button>,
                ]}
              >
                <Form
                  form={formEditMem}
                  onFinish={onFinishEditMem}
                  onFinishFailed={onFinishFailEditMem}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 30 }}
                  layout="horizontal"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={"default"}
                  id="edit-member"
                >
                  <Form.Item className="form-item" name="member_id" style={{ display: "none" }}></Form.Item>
                  <Form.Item
                    className="form-item"
                    name="name"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Họ và tên: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên thành viên",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input placeholder="Họ và tên"></Input>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="member_gender"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Giới tính: </b>
                      </span>
                    }
                  >
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="phone_number"
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
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input placeholder="Số điện thoại" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="identity_card"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>CMND/CCCD: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập CMND/CCCD",
                        whitespace: true,
                      },
                      {
                        pattern: /^([0-9]{12})\b/,
                        message: "Vui lòng nhập đúng CMND/CCCD",
                      },
                    ]}
                  >
                    <Input placeholder="CMND/CCCD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="license_plates"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Biển số xe: </b>
                      </span>
                    }
                  >
                    <Input placeholder="Biển số xe"></Input>
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="address"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Địa chỉ: </b>
                      </span>
                    }
                  >
                    <Input placeholder="Địa chỉ"></Input>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default CreateContractRenter;
