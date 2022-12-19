import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "../../api/axios";
import {
  EditTwoTone,
  DeleteOutlined,
  PlusCircleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  AuditOutlined,
  DollarOutlined,
  CheckCircleTwoTone,
  FilterOutlined,
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
  notification,
  Card,
  AutoComplete,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
const { Option } = Select;
const LIST_OLD_RENTER = "/manager/renter";
const LIST_ASSET_TYPE = "manager/asset/type";
const APARTMENT_DATA_GROUP = "/manager/group/all";
const ADD_NEW_CONTRACT = "/manager/contract/room/add";
const ASSET_ROOM = "manager/asset/room/";
const ADD_ASSET = "manager/asset/room/add";
const UPDATE_ASSET = "manager/asset/room/update";
const DELETE_ASSET = "manager/asset/room/delete";

const card = {
  height: "100%",
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
};

const fontSizeIcon = {
  fontSize: "120%",
};

const CreateContractRenter = () => {
  const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];
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

  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [dataOldRenter, setDataOldRenter] = useState([]);
  const [listAssetType, setListAssetType] = useState([]);

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
  const [contractDuration, setContractDuration] = useState(1);
  const [contractBillCycle, setContractBillCycle] = useState(1);
  const [displayFinish, setDisplayFinish] = useState([]);
  const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);
  const [disableEditAsset, setDisableEditAsset] = useState(true);
  const [renterId, setRenterId] = useState();
  const [roomId, setRoomId] = useState();
  const [optionAutoComplete, setOptionAutoComplete] = useState([]);

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
        setDataApartmentGroup(res.data.data.list_group_contracted);
      })
      .catch((error) => {
        // console.log(error);
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
    {
      title: "Thao tác",
      key: "asset_id",
      render: (record) => {
        return (
          <>
            <EditTwoTone
              onClick={() => {
                record.asset_id < 0 ? setDisableEditAsset(false) : setDisableEditAsset(true);
                setIsEditAsset(true);
                editAssetForm.setFieldsValue({
                  asset_id: record.asset_id,
                  asset_name: record.asset_name,
                  hand_over_asset_quantity: record.hand_over_asset_quantity,
                  asset_type_show_name: record.asset_type_id,
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
        onDeleteAssetAPI(record.asset_id, record.asset_name);
      },
    });
  };

  const onDeleteAssetAPI = async (asset_id, asset_name) => {
    await axios
      .delete(DELETE_ASSET + "?roomAssetId=" + [asset_id], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: ` Xóa ${asset_name} thành công`,
          placement: "top",
          duration: 3,
        });
        getAssetRoom(roomId);
      })
      .catch((error) => {
        notification.error({
          message: ` Xóa ${asset_name} thất bại`,
          placement: "top",
          duration: 3,
        });
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
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataOldRenter(res.data.data);
        setOptionAutoComplete(
          res.data.data.map((renter) => {
            return {
              value: renter.renter_id,
              label: renter.renter_full_name + " (" + renter.phone_number + ")",
            };
          })
        );
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  console.log(dataOldRenter);
  const filterRenter = async (groupId) => {
    setLoading(true);
    await axios
      .get(LIST_OLD_RENTER, {
        params: {
          group: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataOldRenter(res.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
    setLoading(false);
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
        setListAssetType(res.data.data);
        createAssetForm.setFieldsValue({
          asset_type_show_name: res.data.data?.find(
            (obj, index) => obj.asset_type_name === "OTHER" && obj.asset_type_show_name === "Khác"
          )?.id,
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const renterColumn = [
    {
      title: "CMND/CCCD",
      dataIndex: "identity_number",
      key: "identity_number",
      with: 250,
    },
    {
      title: "Họ và tên",
      dataIndex: "renter_full_name",
      key: "renter_full_name",
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.renter_full_name.trim()).toLowerCase()?.includes(value.trim().toLowerCase()) ||
          String(record.phone_number.trim()).toLowerCase()?.includes(value.trim().toLowerCase()) ||
          String(record.identity_number.trim()).toLowerCase()?.includes(value.trim().toLowerCase())
        );
      },
      width: 200,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Nam", value: true },
        { text: "Nữ", value: false },
      ],
      filteredValue: oldRenterGender.gender || null,
      onFilter: (value, record) => record.gender === value,
      render: (gender) => {
        return <span>{gender ? "Nam" : "Nữ"}</span>;
      },
      width: 120,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 130,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 350,
    },
  ];
  const onAdd = (record) => {
    setisAdd(true);
  };

  const resetAdd = () => {
    setisAdd(false);
  };

  const onOk = () => {
    setRenterId(selectOldRenter.renter_id);
    setGenderChange(selectOldRenter.gender);
    form.setFieldsValue({
      renter_name: selectOldRenter.renter_full_name,
      renter_phone_number: selectOldRenter.phone_number,
      renter_gender: selectOldRenter.gender,
      renter_email: selectOldRenter.email,
      renter_identity_card: selectOldRenter.identity_number,
      license_plates: selectOldRenter.license_plates,
      address_more_detail: selectOldRenter.address.address_more_details,
    });
    setisAdd(false);
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
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
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
      dataIndex: "gender",
      key: "member_id",
      render: (gender) => {
        return gender ? "Nam" : "Nữ";
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
      dataIndex: "address_more_detail",
      key: "member_id",
    },

    {
      title: "Thao tác",
      key: "member_id",
      render: (record) => (
        <Space>
          <EditTwoTone
            style={fontSizeIcon}
            onClick={() => {
              setIsEditMem(true);
              formEditMem.setFieldsValue({
                member_id: record.member_id,
                gender: record.gender,
                name: record.name,
                identity_card: record.identity_card,
                phone_number: record.phone_number,
                license_plates: record.license_plates,
                address_more_detail: record.address_more_detail,
              });
            }}
          />
          <DeleteOutlined
            onClick={() => onDeleteMember(record)}
            style={{ fontSize: "120%", color: "red", marginLeft: 12 }}
          />
        </Space>
      ),
    },
  ];

  const onFinishAddMem = (e) => {
    if (dataOldRenter?.find(mem => mem.identity_number === e.identity_card.toLowerCase().trim())) {
      message.error("Số CMND đã tồn tại");
    } else if (form.getFieldsValue().renter_identity_card === e.identity_card.toLowerCase().trim()) {
      message.error("Số CMND đã trùng với người đại diện");
    } else {
      console.log('out');
      if (dataMember.length < roomSelect?.room_limit_people - 1) {
        if (dataMember.find((mem) => mem.phone_number.toLowerCase().trim() === e.phone_number.toLowerCase().trim())) {
          if (dataMember.find((mem) => mem.identity_card.toLowerCase().trim() !== e.identity_card.toLowerCase().trim())) {
            setIsAddMem(true);
            message.error("Trùng số điện thoại");
          } else {
            setIsAddMem(true);
            message.error("Trùng số điện thoại và CMND");
          }
        } else {
          if (dataMember.find((mem) => mem.identity_card.toLowerCase().trim() === e.identity_card.toLowerCase().trim())) {
            setIsAddMem(true);
            message.error("Trùng số CMND");
          } else {
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
              address_more_detail: "",
            });
          }
        }
      } else {
        setIsAddMem(true);
        message.error("Số lượng thành viên đã đầy");
      }
    }
  };
  const onFinishFailAddMem = (e) => {
    message.error("Thêm thành viên thất bại");
  };

  const onFinishEditMem = (e) => {
    const duplicate = dataMember.find(
      (mem) =>
        mem.name.toLowerCase().trim() === e.name.toLowerCase().trim() &&
        mem.gender === e.gender &&
        mem.identity_card.toLowerCase().trim() === e.identity_card.toLowerCase().trim() &&
        mem.phone_number.toLowerCase().trim() === e.phone_number.toLowerCase().trim() &&
        mem.license_plates.toLowerCase().trim() === e.license_plates.toLowerCase().trim() &&
        mem.address_more_detail.toLowerCase().trim() === e.address_more_detail.toLowerCase().trim()
    );

    if (
      dataMember.find(
        (mem) =>
          mem.phone_number.toLowerCase().trim() === e.phone_number.toLowerCase().trim() &&
          mem.identity_card.toLowerCase().trim() !== e.identity_card.toLowerCase().trim()
      )
    ) {
      setIsEditMem(true);
      message.error("Trùng số điện thoại");
    } else if (duplicate) {
      setIsEditMem(true);
      message.error("Chỉnh sửa thành viên thất bại");
    } else {
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

  const getListFloor = dataApartmentGroupSelect?.list_rooms
    ?.filter((obj, index) => obj.contract_id === null && Number.isInteger(obj.group_contract_id))
    ?.map((o, i) => o.room_floor);

  const floors = getListFloor?.filter((obj, index) => getListFloor.indexOf(obj) === index);

  const [room, setRoom] = useState([]);
  const [roomSelect, setRoomSelect] = useState();

  const onFinish = async (e) => {
    const listServiceOfBuilding = Object.values(e.serviceIndexInForm);
    listServiceOfBuilding.push({
      general_service_id: dataApartmentGroupSelect?.list_general_service.map((obj, index) => obj.general_service_id),
    });
    const list_general_service = listServiceOfBuilding
      .map((obj, index) => {
        return {
          general_service_id: listServiceOfBuilding[listServiceOfBuilding.length - 1].general_service_id[index],
          hand_over_general_service_index: obj.hand_over_service_index,
        };
      })
      .filter((o, i) => i !== listServiceOfBuilding.length - 1);

    await axios
      .post(
        ADD_NEW_CONTRACT,
        {
          ...e,
          list_general_service: list_general_service,
          contract_end_date: e.contract_end_date.format("YYYY-MM-DD"),
          contract_start_date: e.contract_start_date.format("YYYY-MM-DD"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
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
          description: error.response.data.meta.message,
          placement: "top",
          duration: 3,
        });
      });
  };
  const onFinishContractFail = (e) => {
    message.error("Vui lòng kiểm tra lại thông tin hợp đồng");
  };

  const addAssetFinish = async (dataAsset) => {
    const data = {
      room_asset_id: null,
      asset_name: dataAsset.asset_name.trim(),
      asset_type_id: dataAsset.asset_type_show_name,
      asset_quantity: dataAsset.hand_over_asset_quantity,
      room_id: roomId,
    };

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
        setAddAssetInRoom(false);
        getAssetRoom(roomId);
        createAssetForm.setFieldsValue({
          asset_name: "",
          hand_over_asset_quantity: 1,
        });
      })
      .catch((error) => {
        // console.log(error);
        notification.error({
          message: "Thêm mới tài sản thất bại",
          placement: "top",
          duration: 2,
        });
      });
  };

  const addAssetFail = (e) => {
    setAddAssetInRoom(true);
  };

  const editAssetFinish = async (dataAsset) => {
    const data = {
      room_asset_id: dataAsset.asset_id,
      asset_name: dataAsset.asset_name,
      asset_type_id: dataAsset.asset_type_show_name,
      asset_quantity: dataAsset.hand_over_asset_quantity,
      room_id: roomId,
    };
    await axios
      .put(UPDATE_ASSET, [data], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Cập nhật tài sản thành công",
          placement: "top",
          duration: 3,
        });
        setIsEditAsset(false);
        getAssetRoom(roomId);
      })
      .catch((error) => {
        // console.log(error);
        notification.error({
          message: "Thêm mới tài sản thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };

  const editAssetFail = (e) => {
    setIsEditAsset(true);
    notification.error({
      message: "Thêm mới tài sản thất bại",
      placement: "top",
      duration: 3,
    });
  };

  useEffect(() => {
    loadDefault();
  }, []);

  const loadDefault = () => {
    form.setFieldsValue({
      contract_type: 1,
      contract_start_date: contractStartDate,
      contract_end_date: moment()?.add(contractDuration, "M"),
      contract_duration: contractDuration,
      renter_gender: genderChange,
      contract_bill_cycle: contractBillCycle,
      contract_payment_cycle: paymentCircle,
      note: "",
    });
    formAddMem.setFieldsValue({
      name: "",
      identity_card: "",
      phone_number: "",
      license_plates: "",
      address_more_detail: "",
    });
    setOldRenterGender({ ...oldRenterGender, gender: [true, false] });
    createAssetForm.setFieldsValue({
      asset_id: assetId,
      hand_over_date_delivery: formAddAsset.dateOfDelivery,
      hand_over_asset_quantity: formAddAsset.asset_unit,
    });
  };

  form.setFieldsValue({
    list_renter: dataMember,
  });

  const onNext = async () => {
    try {
      if (changeTab === "1") {
        var startDateFrom = moment(form.getFieldValue("contract_start_date"));
        var endDateForm = moment(form.getFieldValue("contract_end_date"));
        if (endDateForm < startDateFrom) {
          notification.error({
            message: "Không thể chuyển qua bước tiếp theo",
            description: "Ngày kết thúc không thể nhỏ hơn ngày hợp đồng có hiệu lực",
            placement: "top",
            duration: 5,
          });
          return;
        } else {
          await form.validateFields([
            "group_id",
            "renter_name",
            "renter_gender",
            "renter_phone_number",
            "renter_identity_card",
            "room_floor",
            "room_id",
            "contract_start_date",
            "contract_bill_cycle",
            "contract_payment_cycle",
            "contract_price",
            "contract_deposit",
            "contract_end_date",
            "contract_start_date",
          ]);
          setDisplayFinish([...displayFinish, 1]);
        }
      } else {
        await form.validateFields();
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

  const getAssetRoom = async (room_id) => {
    setLoading(true);
    await axios
      .get(ASSET_ROOM + room_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataAsset(res.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
    setLoading(false);
  };

  return (
    <MainLayout title="Tạo mới hợp đồng cho thuê">
      <div style={{ overflow: "auto" }}>
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
              <span style={{ fontSize: "17px" }}>
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
            <div className="site-card-wrapper">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8} xs={24} xl={8}>
                  <Card
                    style={card}
                    title={
                      <Tag color="blue">
                        <h3>
                          <UserOutlined style={{ fontSize: "130%" }} />
                          <span style={{ fontSize: "15px" }}>
                            <b>Thông tin người đại diện </b>
                          </span>
                        </h3>
                      </Tag>
                    }
                    bordered={true}
                  >
                    <Row>
                      <Button
                        style={{
                          marginTop: "1%",
                          wordBreak: "break-all",
                          whiteSpace: "normal",
                          height: "auto",
                        }}
                        type="primary"
                        size="default"
                        onClick={() => {
                          onAdd();
                        }}
                      >
                        Lấy thông tin khách thuê
                      </Button>
                    </Row>
                    <Row>
                      <Col>
                        <p>
                          <i>Lấy thông tin khách thuê của tất cả chung cư để việc nhập dữ liệu nhanh hơn</i>
                        </p>
                      </Col>
                    </Row>
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
                      <AutoComplete
                        filterOption={(input, option) =>
                          (option?.label.toLowerCase().trim() ?? "").includes(input.toLowerCase().trim())
                        }
                        options={optionAutoComplete}
                        onSelect={(e) => {
                          const data = dataOldRenter.find((renter) => renter.renter_id === e);
                          form.setFieldsValue({
                            renter_name: data.renter_full_name,
                            renter_phone_number: data.phone_number,
                            renter_gender: data.gender,
                            renter_email: data.email,
                            renter_identity_card: data.identity_number,
                            license_plates: data.license_plates,
                            address_more_detail: data.address.address_more_details,
                          });
                        }}
                        placeholder="Nhập tên khách thuê"
                      />
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
                          message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                        },
                      ]}
                    >
                      <Input placeholder="CMND/CCCD"></Input>
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
                      <TextArea maxLength={200} rows={4} placeholder="Ghi chú" value={""} />
                    </Form.Item>
                  </Card>
                </Col>
                <Col span={8} xs={24} xl={8}>
                  <Card
                    style={card}
                    title={
                      <Tag color="blue">
                        <h3>
                          <AuditOutlined style={{ fontSize: "130%" }} />{" "}
                          <span style={{ fontSize: "15px" }}>
                            <b>Thông tin về hợp đồng </b>
                          </span>
                        </h3>
                      </Tag>
                    }
                    bordered={false}
                  >
                    <Form.Item
                      className="form-item"
                      name="group_id"
                      labelCol={{ span: 24 }}
                      label={
                        <span>
                          <b>Chung cư: </b>
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
                        onChange={(e) => {
                          form.setFieldsValue({
                            room_floor: "",
                            room_id: "",
                            contract_price: 0,
                            contract_deposit: 0,
                            serviceIndexInForm: null,
                          });
                          setRoomStatus(true);
                          setDataApartmentGroupSelect(dataApartmentGroup?.find((obj, index) => obj.group_id === e));
                          setFloorStatus(false);
                        }}
                        placeholder="Chọn chung cư"
                      >
                        {dataApartmentGroup?.map((obj, index) => {
                          return <Select.Option value={obj.group_id}>{obj.group_name}</Select.Option>;
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
                              (data) =>
                                data.room_floor === e &&
                                data.contract_id === null &&
                                Number.isInteger(data.group_contract_id)
                            )
                          );
                          setFloorRoom((pre) => {
                            return { ...pre, room_floor: e };
                          });
                          form.setFieldsValue({
                            room_id: "",
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
                        filterOption={(input, option) => (option?.children ?? "").includes(input)}
                        placeholder="Chọn phòng"
                        disabled={roomStatus}
                        onChange={(e) => {
                          const data = dataApartmentGroupSelect?.list_rooms?.filter(
                            (obj, index) => obj.contract_id === null && Number.isInteger(obj.group_contract_id)
                          );

                          if (e !== "") {
                            setRoomId(e);
                            getAssetRoom(e);
                            setRoomSelect(data?.find((obj) => obj.room_id === e));
                            form.setFieldsValue({
                              contract_price: data?.find((obj) => obj.room_id === e).room_price,
                              contract_deposit: data?.find((obj) => obj.room_id === e).room_price,
                            });
                          }
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
                    <Form.Item className="form-item" name="contract_type" style={{ display: "none" }}></Form.Item>
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
                          message: "Ngày hợp đồng có hiệu lực",
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={(e) => {
                          setContractStartDate(e);
                          const startDate = form.getFieldsValue().contract_start_date;
                          form.setFieldsValue({
                            contract_end_date: moment(startDate).add(contractDuration, "M"),
                            contract_payment_cycle: e.format("D") < 16 ? 15 : 30,
                          });
                        }}
                        allowClear={false}
                        style={{ width: "100%" }}
                        placeholder="Ngày hợp đồng có hiệu lực"
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
                  </Card>
                </Col>
                <Col span={8} xs={24} xl={8}>
                  <Card
                    style={card}
                    title={
                      <Tag color="blue">
                        <h3>
                          <DollarOutlined style={{ fontSize: "130%" }} />{" "}
                          <span style={{ fontSize: "15px" }}>
                            <b> Thông tin giá trị hợp đồng </b>
                          </span>
                        </h3>
                      </Tag>
                    }
                    bordered={false}
                  >
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
                    <Row>
                      <p>
                        <i>
                          <b>Lưu ý:</b>
                          <br />
                          <b>- Chu kỳ thanh toán: </b> nếu bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30.
                          Trường hợp có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách, ví dụ:
                          vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ
                          30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.
                          <br />
                          <b>- Chu kỳ tính tiền: </b> là số tháng được tính trên mỗi hóa đơn.
                          <br />
                        </i>
                      </p>
                      <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span style={{ fontSize: "17px" }}>
                2. Dịch vụ{" "}
                {displayFinish.find((obj, index) => obj === 2) ? (
                  <CheckCircleTwoTone style={{ fontSize: "130%" }} twoToneColor="#52c41a" />
                ) : (
                  ""
                )}
              </span>
            }
            key="2"
          >
            <Row>
              <Col span={24}>
                <Form.Item className="form-item" name="list_general_service" labelCol={{ span: 24 }}>
                  <h3>
                    <b>
                      Thông tin về dịch vụ sử dụng{" "}
                      {dataApartmentGroupSelect?.group_name !== undefined
                        ? dataApartmentGroupSelect?.group_name + " "
                        : ""}
                    </b>
                  </h3>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={12} md={16} xl={6} span={6}>
                {dataApartmentGroupSelect?.list_general_service
                  ?.filter(
                    (service) =>
                      service?.service_show_name?.toLowerCase()?.trim().includes("điện") ||
                      service?.service_show_name?.toLowerCase()?.trim().includes("nước")
                  )
                  ?.map((obj, index) => {
                    return (
                      <>
                        <Form.Item
                          className="form-item"
                          labelCol={{ span: 24 }}
                          name={["serviceIndexInForm", `${index}`, "hand_over_service_index"]}
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
                            controls={false}
                            placeholder={
                              String(obj.service_type_name).toLowerCase()?.includes("Đồng hồ".toLowerCase())
                                ? "Nhập chỉ số hiện tại"
                                : "Số " +
                                obj.service_type_name +
                                " / " +
                                obj.service_price.toLocaleString("vn-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })
                            }
                            addonAfter={
                              String(obj.service_type_name).toLowerCase()?.includes("Đồng hồ".toLowerCase())
                                ? "Chỉ số hiện tại"
                                : obj.service_type_name
                            }
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
                  - Trên đây là dịch vụ chung áp dụng cho tất cả các phòng trong một chung cư.
                  <br />- Nếu bạn muốn thay đổi dịch vụ chung này cần vào mục <a href="/service">Dịch Vụ</a>
                  <br />
                </i>
              </p>
            </Row>
            <Row>
              <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span style={{ fontSize: "17px" }}>
                3. Thành viên{" "}
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
                <Form.Item className="form-item" name="list_renter" labelCol={{ span: 24 }}>
                  <h3>
                    <b>
                      Thông tin về thành viên
                      {roomSelect?.room_name === undefined ? "" : " phòng " + roomSelect?.room_name}
                    </b>{" "}
                    (Số lượng: {dataMember.length}/{roomSelect?.room_limit_people - 1})
                  </h3>
                </Form.Item>
              </Col>
              <Col span={1}>
                <PlusCircleOutlined
                  style={{ fontSize: 36, marginBottom: 20, color: "#1890ff" }}
                  onClick={() => {
                    setIsAddMem(true);
                    formAddMem.setFieldsValue({
                      gender: true,
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
          <Tabs.TabPane
            tab={
              <span style={{ fontSize: "17px" }}>
                4. Trang thiết bị trong phòng{" "}
                {displayFinish.find((obj, index) => obj === 4) ? (
                  <CheckCircleTwoTone style={{ fontSize: "130%" }} twoToneColor="#52c41a" />
                ) : (
                  ""
                )}
              </span>
            }
            key="4"
          >
            <Row>
              <Col span={24}>
                <p>
                  <h3>
                    <b>
                      Thông tin trang thiết bị{" "}
                      {roomSelect?.room_name === undefined ? "" : "phòng " + roomSelect?.room_name}
                    </b>
                  </h3>
                </p>
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
                    dataSource={dataAsset?.map((asset) => {
                      return {
                        asset_id: asset.room_asset_id,
                        asset_name: asset.asset_name,
                        hand_over_asset_quantity: asset.asset_quantity,
                        asset_type_show_name: listAssetType?.find((a) => a?.id === asset?.asset_type_id)
                          ?.asset_type_show_name,
                        asset_type_id: listAssetType?.find((a) => a?.id === asset?.asset_type_id)?.id,
                      };
                    })}
                    columns={columns}
                    scroll={{ x: 800, y: 600 }}
                    loading={loading}
                  ></Table>
                </Row>
              </Col>
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
        title={<h2>Thông tin khách thuê trong tất cả chung cư</h2>}
        visible={isAdd}
        onCancel={() => {
          resetAdd();
        }}
        onOk={onOk}
        footer={[
          <Button key="back" onClick={resetAdd}>
            Đóng
          </Button>,
          <Button type="primary" onClick={onOk}>
            Chọn
          </Button>,
        ]}
        width={1100}
      >
        <Card style={card}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} lg={8} span={8}>
              <Input.Search
                placeholder="Nhập tên, SĐT hoặc số CMND để tìm kiếm"
                style={{ marginBottom: "5%", width: "100%" }}
                onSearch={(e) => {
                  setSearched(e);
                }}
                onChange={(e) => {
                  setSearched(e.target.value);
                }}
              />
            </Col>
            <Col xs={12} lg={8} span={8}>
              <span>Giới tính: </span>
              <Checkbox.Group
                defaultValue={[true, false]}
                onChange={(e) => {
                  setOldRenterGender({ ...oldRenterGender, gender: e });
                }}
                options={[
                  { label: "Nam", value: true },
                  { label: "Nữ", value: false },
                ]}
              ></Checkbox.Group>
            </Col>
            <Col xs={12} lg={8} span={8}>
              <Select
                defaultValue={""}
                style={{ width: "100%" }}
                onChange={(e) => {
                  filterRenter(e);
                }}
                placeholder="Chọn chung cư"
              >
                <Select.Option value="">Tất cả chung cư</Select.Option>
                {dataApartmentGroup?.map((obj, index) => {
                  return <Select.Option value={obj.group_id}>{obj.group_name}</Select.Option>;
                })}
              </Select>
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
                rowKey={(record) => record.renter_id}
                rowSelection={{
                  type: "radio",
                  onSelect: (record) => {
                    setSelectOldRenter({ ...record });
                  },
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        title={<h2>Thêm tài sản mới</h2>}
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
              setAddAssetInRoom(false);
            }}
          >
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="create-asset" type="primary">
            Thêm mới
          </Button>,
        ]}
      >
        <Card style={card}>
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
        </Card>
      </Modal>

      <Modal
        title={<h2>Chỉnh sửa tài sản trong phòng</h2>}
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
        <Card style={card}>
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
            <Form.Item className="form-item" name="asset_id" style={{ display: "none" }}></Form.Item>
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
              <Select placeholder={"Nhóm tài sản"}>
                {listAssetType?.map((obj, index) => {
                  return <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        title={
          <h2>
            {roomSelect?.room_name === undefined
              ? "Thêm thành viên "
              : "Thêm thành viên vào phòng " + roomSelect?.room_name}
          </h2>
        }
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
        <Card style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}>
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
              name="gender"
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
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
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
                  message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
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
          </Form>
        </Card>
      </Modal>
      <Modal
        title={<h2>Chỉnh sửa thành viên </h2>}
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
        <Card style={card}>
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
              name="gender"
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
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
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
                  message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                },
              ]}
            >
              <Input disabled placeholder="CMND/CCCD" style={{ width: "100%" }} />
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
          </Form>
        </Card>
      </Modal>
    </MainLayout>
  );
};
export default CreateContractRenter;
