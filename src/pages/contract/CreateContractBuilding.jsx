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
  HomeOutlined,
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
  Checkbox,
  InputNumber,
  message,
  notification,
  Divider,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;
const { Option } = Select;
const LIST_ASSET_TYPE = "manager/asset/type";
const ADD_NEW_CONTRACT = "/manager/contract/add-new-contract";
const dateFormatList = ["DD/MM/YYYY", "YYYY/MM/DD"];
const defaultAddAsset = {
  dateOfDelivery: moment(),
  asset_unit: 1,
  asset_type: "Khác",
  asset_status: true,
};

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

const floorNumber = [];
for (let i = 1; i <= 20; i++) {
  floorNumber.push({
    name: `${i} Tầng`,
    value: i,
  });
}

const dataFilter = {
  id: [],
  asset_type: [],
};

const CreateContractBuilding = () => {
  const [listAssetType, setListAssetType] = useState([]);
  const navigate = useNavigate();
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [componentSize, setComponentSize] = useState("default");
  const [form] = Form.useForm();
  const [createAssetForm] = Form.useForm();
  const [editAssetForm] = Form.useForm();
  const [formAddAsset, setFormAddAsset] = useState(defaultAddAsset);
  const [isEditAsset, setIsEditAsset] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dataAsset, setDataAsset] = useState([]);
  const [assetId, setAssetId] = useState(-1);
  const [changeTab, setChangeTab] = useState("1");
  const [visibleSubmit, setVisibleSubmit] = useState(false);
  const [paymentCircle, setPaymentCircle] = useState(new Date().getDate() < 16 ? 15 : 30);
  const [contractStartDate, setContractStartDate] = useState(moment());
  const [addServiceGeneral, setAddServiceGeneral] = useState(false);
  const [formAddSerivce] = Form.useForm();
  const [numberOfFloor, setNumberOfFloor] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [apartmentFloor, setApartmentFloor] = useState([]);
  const [floorAndRoom, setFloorAndRoom] = useState([]);
  const [displayFloor, setDisplayFloor] = useState(false);
  const [selectFloorNumber, setSelectFloorNumber] = useState(0);

  let cookie = localStorage.getItem("Cookie");

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
      title: "Ngày bàn giao",
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
  console.log(listAssetType);
  const [listGeneralService, setListGeneralService] = useState([]);

  form.setFieldsValue({
    contract_term: 1,
    contract_start_date: contractStartDate,
    contract_note: "",
    list_general_service: listGeneralService,
    list_hand_over_assets: dataAsset,
    contract_bill_cycle: 1,
    contract_payment_cycle: paymentCircle,
  });

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
    {
      title: "Thao tác",
      key: "general_service_id",
      render: (record) => {
        return (
          <>
            <EditOutlined style={{ fontSize: "120%" }} />
            <DeleteOutlined style={{ color: "red", marginLeft: 12, fontSize: "120%" }} />
          </>
        );
      },
    },
  ];

  const [addAssetInRoom, setAddAssetInRoom] = useState(false);

  const onFinish = async (e) => {
    console.log(
      JSON.stringify({
        ...e,
        contract_end_date: new Date(e.contract_end_date).toLocaleDateString(),
        contract_start_date: new Date(e.contract_start_date).toLocaleDateString(),
      })
    );

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
  };
  const onFinishContractFail = (e) => {
    message.error("Vui lòng kiểm tra lại thông tin hợp đồng");
  };

  createAssetForm.setFieldsValue({
    asset_id: assetId,
    hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
    hand_over_asset_quantity: formAddAsset.asset_unit,
    asset_type_show_name: formAddAsset.asset_type,
    hand_over_asset_status: formAddAsset.asset_status,
  });
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

  const onFinishAddService = (e) => {
    console.log(e);
  };

  const onFinishAddServiceFail = (e) => {
    console.log(e);
  };
  const onCheckAllChange = (e) => {
    setApartmentFloor(e.target.checked ? numberOfFloor : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const onChangeSelectFloor = (list) => {
    setApartmentFloor(list);
    setIndeterminate(!!list.length && list.length < numberOfFloor.length);
    setCheckAll(list.length === numberOfFloor.length);
  };
  console.log(floorAndRoom);
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
            <p className="header-title">Thêm hợp đồng chung cư mini/căn hộ</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <Breadcrumbs />
            <div
              className="site-layout-background"
              style={{
                minHeight: 360,
              }}
            >
              <div style={{ overflow: "auto" }}>
                <Button
                  href="/contract-apartment"
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
                  <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>1. Thông tin chung</span>} key="1">
                    <Row>
                      <Col span={12}>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <div style={{ overflow: "auto" }}>
                              <h3>
                                <UserOutlined style={{ fontSize: "130%" }} />
                                <span style={{ fontSize: "15px" }}>
                                  <b> Thông tin người cho thuê </b>
                                </span>
                              </h3>
                            </div>
                          </Tag>
                          <Form.Item
                            className="form-item"
                            name="contract_name"
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
                        </Row>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <h3>
                              <AuditOutlined style={{ fontSize: "130%" }} />
                              <span style={{ fontSize: "15px" }}>
                                <b> Thông tin về hợp đồng </b>
                              </span>
                            </h3>
                          </Tag>
                          <Form.Item
                            className="form-item"
                            name="floor"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Tên chung cư mini/căn hộ: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn tầng",
                                whitespace: true,
                              },
                            ]}
                          >
                            <Input placeholder="Tên chung cư mini/căn hộ" />
                          </Form.Item>
                          <Form.Item
                            className="form-item"
                            name="room_id"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Chọn Tỉnh/Tp: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn Tỉnh/Tp",
                              },
                            ]}
                          >
                            <Select placeholder="Chọn Tỉnh/Tp">
                              <Select.Option value="">Chọn Tỉnh/Tp</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="form-item"
                            name="contract_duration"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Chọn Quận/Huyện: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn Quận/Huyện",
                              },
                            ]}
                          >
                            <Select placeholder="Chọn Quận/Huyện">
                              <Select.Option value="">Chọn Quận/Huyện</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="form-item"
                            name="contract_duration"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Địa chỉ: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập địa chỉ",
                              },
                            ]}
                          >
                            <Input placeholder="Địa chỉ" />
                          </Form.Item>
                          <Form.Item
                            className="form-item"
                            name="contract_duration"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Thời hạn hợp đồng (ít nhất 6 tháng): </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn thời hạn hợp đồng",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Thời hạn hợp đồng"
                              onChange={(e) => {
                                console.log();
                                form.setFieldsValue({
                                  contract_end_date: moment(contractStartDate.add(e, "M"), dateFormatList),
                                  contract_start_date: moment(contractStartDate.add(-e, "M"), dateFormatList),
                                });
                              }}
                            >
                              {contract_duration?.map((obj, index) => {
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
                          >
                            <DatePicker
                              allowClear={false}
                              style={{ width: "100%" }}
                              placeholder="Ngày kết thúc"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <h3>
                              <HomeOutlined style={{ fontSize: "130%" }} />
                              <span style={{ fontSize: "15px" }}>
                                <b> Thông tin tầng và phòng </b>
                              </span>
                            </h3>
                          </Tag>
                          <Form.Item
                            className="form-item"
                            name="contract_price"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Số lượng tầng của tòa nhà: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá phòng",
                              },
                            ]}
                          >
                            <Select
                              onChange={(e) => {
                                setCheckAll(false);
                                setNumberOfFloor([]);
                                setApartmentFloor([]);
                                setSelectFloorNumber(e);
                                setDisplayFloor(false);
                              }}
                              placeholder="Số lượng tầng"
                            >
                              {floorNumber?.map((obj, index) => {
                                return <Select.Option value={obj.value}>{obj.name}</Select.Option>;
                              })}
                            </Select>
                          </Form.Item>
                          <Row>
                            <Checkbox
                              checked={displayFloor}
                              style={{ width: "100%" }}
                              disabled={selectFloorNumber === 0 ? true : false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  for (let i = 1; i <= selectFloorNumber; i++) {
                                    setNumberOfFloor((pre) => [...pre, i]);
                                  }
                                  setDisplayFloor(true);
                                } else {
                                  setNumberOfFloor([]);
                                  setApartmentFloor([]);
                                  setCheckAll(false);
                                  setDisplayFloor(false);
                                }
                              }}
                            >
                              Chọn tầng thuê và nhập số lượng phòng mỗi tầng
                            </Checkbox>
                          </Row>
                          <Form.Item
                            style={displayFloor ? { display: "none" } : { display: "block" }}
                            className="form-item"
                            name="contract_deposit"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Số lượng phòng mỗi tầng: </b>
                              </span>
                            }
                          >
                            <InputNumber
                              placeholder="Số lượng phòng"
                              controls={false}
                              defaultValue={0}
                              style={{ width: "100%" }}
                              min={0}
                            />
                          </Form.Item>
                          <Row
                            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                            style={!displayFloor ? { display: "none" } : { display: "contents" }}
                          >
                            <Col span={24}>
                              <Row>
                                <Col span={16}>
                                  <span>
                                    <b>Chọn các tầng:</b> <br />
                                    <Checkbox
                                      indeterminate={indeterminate}
                                      onChange={onCheckAllChange}
                                      checked={checkAll}
                                    >
                                      Chọn tất cả:
                                    </Checkbox>
                                    <Divider />
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={24}>
                                  <Form.Item className="form-item" labelCol={{ span: 24 }}>
                                    <Checkbox.Group
                                      options={numberOfFloor}
                                      value={apartmentFloor}
                                      onChange={onChangeSelectFloor}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                {apartmentFloor?.map((obj, index) => {
                                  return (
                                    <>
                                      <Col>
                                        <span>Tầng {obj}</span>
                                        <InputNumber
                                          onChange={(e) => {
                                            if (!floorAndRoom.find((o, i) => o.floor === obj)) {
                                              setFloorAndRoom((pre) => [...pre, { floor: obj, number_of_room: e }]);
                                            } else {
                                              setFloorAndRoom((pre) => {
                                                return pre.map((o, i) => {
                                                  if (o.floor === obj) {
                                                    return {
                                                      floor: o.floor,
                                                      number_of_room: e,
                                                    };
                                                  } else {
                                                    return o;
                                                  }
                                                });
                                              });
                                            }
                                          }}
                                          placeholder="Số lượng phòng"
                                          style={{ width: "100%" }}
                                          min={0}
                                          max={20}
                                        />
                                      </Col>
                                    </>
                                  );
                                })}
                              </Row>
                            </Col>
                          </Row>
                          <br />
                          <p>
                            <i>
                              Hệ thống sẽ tự động tạo phòng theo số lượng bạn nhập bên trên để tiết kiệm thời gian việc
                              nhập dữ liệu cho từng phòng
                            </i>
                          </p>
                          <Form.Item
                            className="form-item"
                            name="contract_deposit"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Giá phòng trung bình (VND): </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập diện tích trung bình mỗi phòng",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Giá thuê trung bình"
                              controls={false}
                              addonAfter="VNĐ"
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                              defaultValue={0}
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
                                <b>Diện tích trung bình mỗi phòng (m2): </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập diện tích trung bình mỗi phòng",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Diện tích phòng"
                              controls={false}
                              addonAfter="m2"
                              defaultValue={0}
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
                                <b>Số lượng người trung bình mỗi phòng: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn số lượng người trung bình mỗi phòng",
                              },
                            ]}
                          >
                            <Select placeholder="Số lượng người">
                              <Select.Option>1 người</Select.Option>
                            </Select>
                          </Form.Item>
                        </Row>
                        <Row>
                          <Tag color="blue" style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}>
                            <h3>
                              <DollarOutlined style={{ fontSize: "130%" }} />
                              <span style={{ fontSize: "15px" }}>
                                <b> Thông tin giá trị hợp đồng </b>
                              </span>
                            </h3>
                          </Tag>
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
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>2. Dịch vụ</span>} key="2">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="list_general_service" labelCol={{ span: 24 }}>
                          <h3>
                            <b>Thông tin về dịch vụ sử dụng </b>
                          </h3>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Button
                          type="primary"
                          style={{ marginBottom: "1%", float: "left" }}
                          icon={<PlusCircleOutlined style={{ fontSize: 15 }} />}
                        >
                          Thêm mới nhanh
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className="gutter-row" span={20}>
                        <p>
                          <i>
                            Thêm mới nhanh các dịch vụ cơ bản (điện, nước, internet, xe) giúp việc nhập dữ liệu nhanh
                            hơn
                          </i>
                        </p>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <PlusCircleOutlined
                          onClick={() => {
                            setAddServiceGeneral(true);
                          }}
                          style={{ fontSize: 36, color: "#1890ff", marginBottom: "2%", float: "right" }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Table
                          bordered
                          rowKey={(record) => record.key}
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
                          <br />
                        </i>
                      </p>
                    </Row>
                    <Row>
                      <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>3. Tài sản bàn giao</span>} key="3">
                    <Row>
                      <Col span={24}>
                        <Form.Item className="form-item" name="list_hand_over_assets" labelCol={{ span: 24 }}>
                          <p>
                            <h3>
                              <b>Thông tin tài sản bàn giao</b>
                            </h3>
                          </p>
                        </Form.Item>
                        <Row>
                          <Button
                            icon={<PlusCircleOutlined style={{ fontSize: 15 }} />}
                            type="primary"
                            style={{ marginBottom: "1%" }}
                          >
                            Thêm mới nhanh
                          </Button>
                        </Row>
                        <Row>
                          <p>
                            <i>
                              Thêm mới nhanh các tài sản cơ bản (điều hòa, giường tủ, nóng lạnh,...) giúp việc nhập dữ
                              liệu nhanh hơn
                            </i>
                          </p>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col span={22}>
                            <Row>
                              <FilterOutlined style={{ fontSize: "150%" }} />
                              <p>
                                <b>Loại tài sản: </b>
                              </p>
                              <Checkbox.Group
                                style={{ marginLeft: "1%" }}
                                options={listAssetType?.map((obj, index) => {
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
                              style={{ fontSize: 36, color: "#1890ff", float: "right" }}
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
                    {/* <Row>
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
                                        </Row> */}
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
                  Tạo mới hợp đồng
                </Button>
              ) : (
                ""
              )}
              <Button
                style={
                  visibleSubmit ? { display: "none" } : { marginTop: "1%", marginRight: "0.5%", display: "inline" }
                }
                type="primary"
                onClick={() => {
                  setChangeTab((pre) => {
                    if (pre === "3") {
                      return "1";
                    } else {
                      return (parseInt(pre) + 1).toString();
                    }
                  });
                  if (changeTab === "2") {
                    setVisibleSubmit(true);
                  }
                }}
              >
                Tiếp
              </Button>
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
                      {listAssetType?.map((obj, index) => {
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
                    <Select placeholder={"Loại tài sản"}>
                      {listAssetType?.map((obj, index) => {
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
                title="Thêm dịch vụ cho tòa nhà "
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
                  <Button
                    key="back"
                    onClick={() => {
                      setAddServiceGeneral(false);
                    }}
                  >
                    Huỷ
                  </Button>,
                ]}
              >
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
                  <Form.Item
                    className="form-item"
                    name="service_id"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Tên dịch vụ: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên dịch vụ",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input placeholder="Tên dịch vụ" />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="general_service_price"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Đơn giá (VND): </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập giá dịch vụ",
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      addonAfter="VNĐ"
                      placeholder="Nhập giá dịch vụ"
                      // defaultValue={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="general_service_type"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Cách tính giá dịch vụ: </b>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn cách tính giá dịch vụ",
                      },
                    ]}
                  >
                    <Input placeholder="Cách tính giá dịch vụ" />
                  </Form.Item>
                  <Form.Item
                    className="form-item"
                    name="note"
                    labelCol={{ span: 24 }}
                    label={
                      <span>
                        <b>Ghi chú: </b>
                      </span>
                    }
                  >
                    <TextArea rows={5} placeholder="Ghi chú"></TextArea>
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
export default CreateContractBuilding;
