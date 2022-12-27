import React, { useEffect, useState } from "react";
import "./contract.scss";
import axios from "../../api/axios";
import {
  ArrowLeftOutlined,
  UserOutlined,
  AuditOutlined,
  DollarOutlined,
  HomeOutlined,
  CheckCircleTwoTone,
  DownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  Button,
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
  AutoComplete,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
const { Option } = Select;
const ADD_NEW_CONTRACT = "manager/contract/group/add";
const APARTMENT_DATA_GROUP = "/manager/group/all";
const LIST_CONTRACT_APARTMENT_URL = "manager/contract/group";
const dateFormatList = ["DD-MM-YYYY"];

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

const CreateContractBuilding = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [listRoomId, setListRoomId] = useState([]);
  const [optionAutoComplete, setOptionAutoComplete] = useState([]);
  const [dataOwner, setDataOwner] = useState([]);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    const data_id = checkedKeysValue
      ?.map((obj, index) => obj.split("-"))
      ?.map((o, i) => {
        return { floor: parseInt(o[0]), room: parseInt(o[1]) };
      })
      ?.filter((room, j) => room !== undefined)
      ?.map((obj, index) => obj.room)
      .filter((o, i) => Number.isInteger(o));
    setCheckedKeys(checkedKeysValue);
    setListRoomId(data_id);
    const totalRoomPrice = dataApartmentGroupSelect?.list_rooms
      ?.filter((room, i) => data_id.find((obj) => room.room_id === obj))
      ?.map((o) => o.room_price)
      ?.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    form.setFieldsValue({
      list_room: data_id,
      contract_price: totalRoomPrice,
    });
  };
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  const navigate = useNavigate();
  const [componentSize, setComponentSize] = useState("default");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [changeTab, setChangeTab] = useState("1");
  const [visibleSubmit, setVisibleSubmit] = useState(false);
  const [contractStartDate, setContractStartDate] = useState(moment());
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [groupSelect, setGroupSelect] = useState([]);
  const [numberOfFloor, setNumberOfFloor] = useState([]);
  const [contractDuration, setContractDuration] = useState(6);
  const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);
  const [displayFinish, setDisplayFinish] = useState([]);
  const [roomRented, setRoomRented] = useState(0);
  const [treeDataRented, setTreeDataRented] = useState([]);

  let cookie = localStorage.getItem("Cookie");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  useEffect(() => {
    apartmentGroup();
    getAllContractBuilding();
  }, []);

  const getAllContractBuilding = async () => {
    setLoading(true);
    await axios
      .get(LIST_CONTRACT_APARTMENT_URL, {
        params: {},
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        const ownerIdentity = res.data.data.map((owner) => owner.identity_number);
        const filterOwner = res.data.data.filter((obj, index) => ownerIdentity.indexOf(obj.identity_number) === index);

        setDataOwner(
          filterOwner.map((owner) => {
            return {
              rack_renter_full_name: owner.rack_renter_full_name,
              gender: owner.gender,
              rack_renter: owner.rack_renter,
              phone_number: owner.phone_number,
              rack_renter_email: owner.rack_renter_email,
              identity_number: owner.identity_number,
              rack_renter_more_details: owner.rack_renter_more_details,
            };
          })
        );
        setOptionAutoComplete(
          filterOwner?.map((owner) => {
            return {
              value: owner.identity_number,
              label: owner.rack_renter_full_name + " (" + owner.phone_number + ")",
            };
          })
        );
      })
      .catch((error) => { });
    setLoading(false);
  };

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
        setDataApartmentGroup(filterGroupId?.filter(obj => obj.list_rooms?.filter(room => room.group_contract_id === null)?.length !== 0));
      })
      .catch((error) => { });
    setLoading(false);
  };

  useEffect(() => {
    loadDefault();
  }, []);

  const loadDefault = () => {
    form.setFieldsValue({
      contract_payment_cycle: 1,
      contract_price: 0,
      contract_deposit: 0,
      contract_type: 2,
      contract_start_date: contractStartDate,
      contract_end_date: moment().add(contractDuration, "M"),
      owner_gender: true,
      contract_duration: contractDuration,
      note: "",
    });
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

  const onFinish = async (e) => {
    const data = {
      ...e,
      contract_end_date: e.contract_end_date.format("YYYY-MM-DD"),
      contract_start_date: e.contract_start_date.format("YYYY-MM-DD"),
      rack_renter_name: e.owner_name,
      rack_renter_gender: e.owner_gender,
      rack_renter_phone: e.owner_phone_number,
      rack_renter_email: e.owner_email,
      rack_renter_identity: e.owner_identity_card,
      rack_renter_address: e.address_more_detail,
      rack_renter_note: "",
    };
    await axios
      .post(ADD_NEW_CONTRACT, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        navigate("/contract-apartment");
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
  return (
    <MainLayout title={"Tạo mới hợp đồng đi thuê"}>
      <div style={{ overflow: "auto" }}>
        <Link to="/contract-apartment">
          <Button type="primary" style={{ marginRight: 5, float: "right" }} className="button-back">
            Quay lại danh sách hợp đồng
          </Button>
        </Link>
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
                    <AutoComplete
                      filterOption={(input, option) =>
                        (option?.label.toLowerCase().trim() ?? "").includes(input.toLowerCase().trim())
                      }
                      options={optionAutoComplete}
                      placeholder="Nhập tên người cho thuê"
                      onSelect={(e) => {
                        const data = dataOwner.find((owner) => owner.identity_number === e);
                        form.setFieldsValue({
                          owner_name: data.rack_renter_full_name,
                          owner_gender: data.gender,
                          owner_phone_number: data.phone_number,
                          owner_email: data.rack_renter_email,
                          owner_identity_card: data.identity_number,
                          address_more_detail: data.rack_renter_more_details,
                        });
                      }}
                    />
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
                        message: "Số điện thoại phải bắt đầu (+84,0,84) và có 10 số",
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
                    <TextArea className="textArea" maxLength={200} rows={5} placeholder="Ghi chú" value={""} />
                  </Form.Item>
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
                        return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>;
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
                      {
                        validator: (_, value) => {
                          var startDateFrom = moment(form.getFieldValue("contract_start_date"));
                          var endDateForm = moment(value);
                          if (endDateForm < startDateFrom) {
                            return Promise.reject(
                              new Error("Vui lòng nhập ngày kết thúc lớn hơn ngày hợp đồng có hiệu lực")
                            );
                          } else {
                            return Promise.resolve(new Error("Vui lòng chọn ngày kết thúc"));
                          }
                        },
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
              <Col xs={24} lg={8} xl={8} span={8}>
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
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(e) => {
                            setDataApartmentGroupSelect(dataApartmentGroup.find((obj, index) => obj.group_id === e));
                            const list_rooms = dataApartmentGroup
                              ?.find((obj, index) => obj.group_id === e)
                              ?.list_rooms?.filter((obj, index) => obj.group_contract_id === null);

                            const list_rooms_rented = dataApartmentGroup
                              ?.find((obj, index) => obj.group_id === e)
                              ?.list_rooms?.filter((obj, index) => Number.isInteger(obj.group_contract_id));

                            setRoomRented(list_rooms_rented?.length);

                            const mapped_list_rooms = list_rooms?.map((obj, index) => obj.room_floor);
                            const get_floors = mapped_list_rooms
                              ?.filter((obj, index) => mapped_list_rooms.indexOf(obj) === index)
                              .sort((a, b) => a - b);

                            const floor_room = get_floors
                              ?.map((obj, index) => {
                                const children = list_rooms
                                  ?.filter((o, i) => o.room_floor === obj)
                                  ?.map((room, j) => {
                                    return [{ title: `Phòng ${room.room_name}`, key: obj + "-" + room.room_id }];
                                  })
                                  ?.map((a, b) => a[0]);
                                return [
                                  {
                                    title: `Tầng ${obj} | Số lượng: ${children.length}`,
                                    key: obj.toString(),
                                    children: children,
                                  },
                                ];
                              })
                              ?.map((o, i) => o[0]);

                            setGroupSelect(dataApartmentGroup?.find((obj, index) => obj.group_id === e));

                            setNumberOfFloor(floor_room);

                            const mapped_list_rooms_rented = list_rooms_rented?.map((obj, index) => obj.room_floor);

                            const get_floors_rented = mapped_list_rooms_rented
                              ?.filter((obj, index) => mapped_list_rooms_rented.indexOf(obj) === index)
                              .sort((a, b) => a - b);

                            const treeDataRented = get_floors_rented
                              ?.map((obj, index) => {
                                const children = list_rooms_rented
                                  ?.filter((o, i) => o.room_floor === obj)
                                  ?.map((room, j) => {
                                    return [{ title: `Phòng ${room.room_name}`, key: obj + "-" + room.room_id }];
                                  })
                                  ?.map((a, b) => a[0]);
                                return [
                                  {
                                    title: `Tầng ${obj} | Số lượng: ${children.length}`,
                                    key: obj.toString(),
                                    children: children,
                                  },
                                ];
                              })
                              ?.map((o, i) => o[0]);
                            setTreeDataRented(treeDataRented);

                            form.setFieldsValue({
                              address_city: dataApartmentGroup?.find((obj, index) => obj.group_id === e)?.address
                                ?.address_city,
                              address_district: dataApartmentGroup?.find((obj, index) => obj.group_id === e)?.address
                                ?.address_district,
                              address_more_details: dataApartmentGroup?.find((obj, index) => obj.group_id === e)
                                ?.address?.address_more_details,
                              address_wards: dataApartmentGroup?.find((obj, index) => obj.group_id === e)?.address
                                ?.address_wards,
                            });
                            setCheckedKeys([]);
                            setListRoomId([]);
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
                      <p>
                        <b>Số lượng tầng:</b>{" "}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>
                        {
                          groupSelect?.list_rooms
                            ?.map((obj, index) => obj.room_floor)
                            ?.filter(
                              (o, i) => groupSelect?.list_rooms?.map((obj, index) => obj.room_floor)?.indexOf(o) === i
                            )?.length
                        }
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p>
                        <b>Số lượng phòng:</b>{" "}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p>{groupSelect?.list_rooms?.length}</p>
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
                      <p>
                        <b>Quận/Huyện:</b>{" "}
                      </p>
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
                        {groupSelect?.list_rooms?.length === undefined ? (
                          ""
                        ) : groupSelect?.list_rooms?.length === roomRented ? (
                          <Tag color="red">Đã thuê hết</Tag>
                        ) : (
                          <Tag color="success">Còn phòng</Tag>
                        )}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} lg={8} xl={8} span={8}>
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
                  bordered={false}
                  className="card-width-100 card-height"
                >
                  <Row>
                    <Col xs={12} lg={24} xl={24} span={24}>
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
                    <Col xs={12} lg={24} xl={24} span={24}>
                      <Row>
                        <p>
                          <b>Số lượng phòng đã thuê:</b> {roomRented}
                        </p>
                      </Row>
                      <Row>
                        <Tree showIcon checkable={false} treeData={treeDataRented} switcherIcon={<DownOutlined />} />
                      </Row>
                    </Col>
                  </Row>
                  <Row></Row>
                </Card>
              </Col>
              <Col xs={24} lg={8} xl={8} span={8}>
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
              <span className="text-size-tab">
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
                <h3>
                  <b>
                    Thông tin về dịch vụ sử dụng
                    {dataApartmentGroupSelect?.group_name !== undefined
                      ? " " + dataApartmentGroupSelect?.group_name + " "
                      : ""}
                  </b>
                </h3>
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
        <Button htmlType="submit" style={{ marginTop: "1%", marginRight: "1%" }} type="primary" form="create-contract">
          Tạo mới hợp đồng
        </Button>
      ) : (
        ""
      )}
      <Button
        style={visibleSubmit ? { display: "none" } : { marginTop: "1%", marginRight: "0.5%", display: "inline" }}
        type="primary"
        onClick={onNext}
      >
        Tiếp
      </Button>
    </MainLayout>
  );
};
export default CreateContractBuilding;
