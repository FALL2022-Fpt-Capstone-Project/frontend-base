import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "../../api/axios";
import {
  EditTwoTone,
  DeleteOutlined,
  PlusCircleOutlined,
  FilterOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  AuditOutlined,
  DollarOutlined,
  CheckCircleTwoTone,
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
  Spin,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
const { Content, Sider, Header } = Layout;
const { Option } = Select;
const LIST_ASSET_TYPE = "manager/asset/type";
const ADD_ASSET = "manager/asset/hand-over/add/";
const APARTMENT_DATA_GROUP = "manager/group/all";
const GET_ROOM_CONTRACT_BY_ID = "manager/contract/room/";
const ADD_RENTER = "manager/renter/add";
const DELETE_RENTER = "manager/renter/remove/";
const UPDATE_RENTER = "manager/renter/update/";
const UPDATE_CONTRACT_RENTER = "manager/contract/room/update/";


const cardHeight = {
  height: 850,
};
const fontSizeIcon = {
  fontSize: "120%",
};

const EditContractRenter = () => {
  const { contract_id, group_id } = useParams();
  console.log(contract_id, group_id);
  const dateFormatList = ["DD-MM-YYYY", "YYYY-MM-DD"];
  const defaultAddAsset = {
    dateOfDelivery: moment(),
    asset_unit: 1,
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
  const [dataMember, setDataMember] = useState([]);
  // const [memberId, setMemberId] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formEditMem] = Form.useForm();
  const [isEditMem, setIsEditMem] = useState(false);
  const [formAddMem] = Form.useForm();
  const [isAddMem, setIsAddMem] = useState(false);
  const [dataAsset, setDataAsset] = useState([]);
  const [assetId, setAssetId] = useState(-1);
  const [changeTab, setChangeTab] = useState("1");
  const [visibleSubmit, setVisibleSubmit] = useState(false);
  const [contractStartDate, setContractStartDate] = useState();
  const [contractDuration, setContractDuration] = useState();
  const [contractBillCycle, setContractBillCycle] = useState(1);
  const [displayFinish, setDisplayFinish] = useState([]);
  const [dataApartmentGroupSelect, setDataApartmentGroupSelect] = useState([]);
  const [disableEditAsset, setDisableEditAsset] = useState(true);
  const [dataContractById, setDataContractById] = useState();

  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    apartmentGroup();
    getContractRoomById();
  }, []);

  const apartmentGroup = async () => {
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
        setDataApartmentGroup(res.data.data);
        setDataApartmentGroupSelect(res.data.data.find((obj, index) => obj.group_id === parseInt(group_id)));
        // console.log(res.data.data?.find((obj, index) => obj.group_id === parseInt(group_id))?.list_rooms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getContractRoomById = async () => {
    setLoading(true);
    await axios
      .get(GET_ROOM_CONTRACT_BY_ID + contract_id, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data);
        const listRoom = res.data.data?.list_room?.filter(
          (data) => data.room_floor === res.data.data?.room.room_floor && data.contract_id === null
        );
        listRoom.push(res.data.data?.list_room?.find((obj, index) => obj.contract_id === parseInt(contract_id)));
        setDataContractById(res.data.data);
        setDataAsset(res.data.data?.list_hand_over_asset);
        setDataMember(
          res.data.data?.list_renter
            ?.map((obj, index) => {
              return {
                ...obj,
                member_id: obj.renter_id,
                name: obj.renter_full_name,
                member_gender: obj.gender,
                identity_card: obj.identity_number,
                address: obj.address.address_more_details,
              };
            })
            .filter((o, i) => o.represent === false)
        );
        setRoom(listRoom);
        setRoomSelect(listRoom.find((obj, index) => obj.room_id === res.data.data?.room_id));
        setContractStartDate(moment(res.data.data?.contract_start_date));
        setContractDuration(res.data.data?.contract_term);
        form.setFieldsValue({
          contract_name: res.data.data?.contract_name,
          renter_name: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.renter_full_name,
          renter_gender: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.gender,
          renter_phone_number: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.phone_number,
          renter_email: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.email,
          license_plates: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.license_plates,
          address_more_detail: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)?.address
            ?.address_more_details,
          renter_identity_card: res.data.data?.list_renter?.find((obj, index) => obj.represent === true)
            ?.identity_number,
          contract_note: res.data.data?.note,
          group_id: res.data.data?.group_id,
          contract_type: res.data.data?.contract_type,
          room_floor: res.data.data?.room.room_floor,
          room_id: res.data.data?.room_id,
          contract_duration: contract_duration?.find((obj, index) => obj.contractTermValue === res.data.data?.contract_term) ? res.data.data?.contract_term : null,
          contract_start_date: moment(res.data.data?.contract_start_date),
          contract_end_date: moment(res.data.data?.contract_end_date),
          contract_payment_cycle: res.data.data?.contract_payment_cycle,
          contract_bill_cycle: res.data.data?.contract_bill_cycle,
          contract_price: res.data.data?.contract_price,
          contract_deposit: res.data.data?.contract_deposit,
          serviceIndexInForm: Object.assign(
            {},
            res.data.data.list_hand_over_general_service?.map((obj, index) => {
              return { hand_over_service_index: obj.hand_over_general_service_index };
            })
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const loadingMemberInRoom = async () => {
    setLoading(true);
    await axios
      .get(GET_ROOM_CONTRACT_BY_ID + contract_id, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataMember(
          res.data.data?.list_renter
            ?.map((obj, index) => {
              return {
                ...obj,
                member_id: obj.renter_id,
                name: obj.renter_full_name,
                member_gender: obj.gender,
                identity_card: obj.identity_number,
                address: obj.address.address_more_details,
              };
            })
            .filter((o, i) => o.represent === false)
        );
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
    {
      title: "Ngày bàn giao",
      dataIndex: "hand_over_date_delivery",
      key: "asset_id",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "hand_over_asset_status",
    //   filters: [
    //     { text: "Tốt", value: true },
    //     { text: "Hỏng", value: false },
    //   ],
    //   filteredValue: assetStatus.hand_over_asset_status || null,
    //   onFilter: (value, record) => record.hand_over_asset_status === value,
    //   render: (status) => {
    //     return (
    //       <>
    //         <Tag color={status ? "success" : "error"}>{status ? "Tốt" : "Hỏng"}</Tag>
    //       </>
    //     );
    //   },
    // },
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
                  hand_over_asset_date_delivery:
                    record.hand_over_date_delivery !== null
                      ? moment(record.hand_over_date_delivery, dateFormatList)
                      : "",
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
        createAssetForm.setFieldsValue({ asset_type_show_name: res.data.data?.find((obj, index) => obj.asset_type_name === "OTHER" && obj.asset_type_show_name === "Khác")?.id });
      })
      .catch((error) => {
        console.log(error);
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
      dataIndex: "address",
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
                member_gender: record.member_gender,
                name: record.name,
                identity_card: record.identity_card,
                phone_number: record.phone_number,
                license_plates: record.license_plates,
                address: record.address,
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
  const onFinishAddMem = async (dataMem) => {
    console.log(dataContractById);
    if (dataContractById?.list_renter?.length < dataContractById?.room?.room_limit_people) {
      const data = {
        ...dataMem,
        name: dataMem.name,
        gender: dataMem.member_gender,
        email: "",
        phone_number: dataMem.phone_number,
        identity_card: dataMem.identity_card,
        license_plates: dataMem.license_plates,
        room_id: dataContractById?.room_id,
        address_more_detail: dataMem.address,
        represent: false,
      };
      setLoading(true);
      await axios
        .post(ADD_RENTER, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          notification.success({
            message: "Thêm mới thành viên thành công",
            placement: "top",
            duration: 2,
          });
          setIsAddMem(false);
          formAddMem.setFieldsValue({
            // member_id: memberId,
            name: "",
            identity_card: "",
            phone_number: "",
            license_plates: "",
            address: "",
          });
          loadingMemberInRoom();
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Vui lòng kiểm tra lại " + error.response.data.data,
            placement: "top",
            duration: 2,
          });
        });
      setLoading(false);
    } else {
      notification.error({
        message: "Phòng " + roomSelect?.room_name === undefined ? "" : " phòng " + roomSelect?.room_name + " đã đầy",
        placement: "top",
        duration: 2,
      });
    }
  };

  const onFinishFailAddMem = (e) => {
    notification.error({
      message: "Thêm mới thành viên thất bại",
      placement: "top",
      duration: 2,
    });
  };

  const onFinishEditMem = async (dataMem) => {
    const data = {
      ...dataMem,
      id: dataMem.member_id,
      name: dataMem.name,
      gender: dataMem.member_gender,
      email: "",
      phone_number: dataMem.phone_number,
      identity_card: dataMem.identity_card,
      license_plates: dataMem.license_plates,
      room_id: dataContractById?.room_id,
      address_more_detail: dataMem.address,
      represent: false,
    };
    // console.log(JSON.stringify(data));
    // setLoading(true);
    await axios
      .put(UPDATE_RENTER + dataMem.member_id, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Cập nhật thành viên thành công",
          placement: "top",
          duration: 2,
        });
        setIsEditMem(false);
        formEditMem.setFieldsValue({
          // member_id: memberId,
          name: "",
          identity_card: "",
          phone_number: "",
          license_plates: "",
          address: "",
        });
        loadingMemberInRoom();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Cập nhật thành viên thất bại",
          placement: "top",
          duration: 2,
        });
      });
    // setLoading(false);
  };
  const onFinishFailEditMem = (e) => {
    message.error("Chỉnh sửa thành viên thất bại");
  };

  const onDeleteMember = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.name} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        // setLoading(true);
        await axios
          .delete(DELETE_RENTER + record.renter_id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookie}`,
            },
          })
          .then((res) => {
            notification.success({
              message: "Xóa thành viên thành công",
              placement: "top",
              duration: 2,
            });
            setIsAddMem(false);
            loadingMemberInRoom();
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Xóa thành viên thất bại",
              placement: "top",
              duration: 2,
            });
          });
        // setLoading(false);
      },
    });
  };

  const [addAssetInRoom, setAddAssetInRoom] = useState(false);
  const [floorRoom, setFloorRoom] = useState();
  const getListFloor = dataApartmentGroupSelect?.list_rooms
    ?.filter((obj, index) => obj.contract_id === null)
    ?.map((o, i) => o.room_floor);

  const floors = getListFloor?.filter((obj, index) => getListFloor.indexOf(obj) === index);

  const [room, setRoom] = useState([]);

  const [roomSelect, setRoomSelect] = useState();

  const onFinish = async (e) => {
    console.log(dataContractById);
    const listServiceOfBuilding = Object.values(e.serviceIndexInForm);

    listServiceOfBuilding.push({
      general_service_id: dataContractById.list_hand_over_general_service.map((obj, index) => obj.general_service_id),
    });
    listServiceOfBuilding.push({
      hand_over_general_service_id: dataContractById.list_hand_over_general_service.map((obj, index) => obj.hand_over_general_service_id),
    });
    listServiceOfBuilding.push({
      service_id: dataContractById.list_hand_over_general_service.map((obj, index) => obj.service_id),
    });
    console.log(listServiceOfBuilding);
    const list_general_service = listServiceOfBuilding
      .map((obj, index) => {
        return {
          hand_over_general_service_index: obj.hand_over_service_index,
          service_id: listServiceOfBuilding[listServiceOfBuilding.length - 1].service_id[index],
          general_service_id: listServiceOfBuilding[listServiceOfBuilding.length - 3].general_service_id[index],
          hand_over_general_service_id: listServiceOfBuilding[listServiceOfBuilding.length - 2].hand_over_general_service_id[index]
        };
      })
      .filter((o, i) => i !== listServiceOfBuilding.length - 1);

    // console.log(
    //   JSON.stringify({
    //     ...e,
    // list_general_service: list_general_service,
    //     contract_end_date: e.contract_end_date.format('YYYY-MM-DD'),
    //     contract_start_date: e.contract_start_date.format('YYYY-MM-DD'),
    //   })
    // );

    const data = {
      ...e,
      list_general_service: list_general_service,
      contract_end_date: e.contract_end_date.format("YYYY-MM-DD"),
      contract_start_date: e.contract_start_date.format("YYYY-MM-DD"),
      list_renter: e.list_renter.map((obj, index) => {
        return {
          id: obj.renter_id,
          name: obj.name,
          gender: obj.member_gender,
          email: "",
          phone_number: obj.phone_number,
          identity_card: obj.identity_card,
          license_plates: obj.license_plates,
          room_id: dataContractById?.room_id,
          address_more_detail: obj.address,
          represent: false,
        };
      }),
    };
    console.log(JSON.stringify(data));
    await axios
      .put(UPDATE_CONTRACT_RENTER + contract_id, data, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        navigate("/contract-renter");
        notification.success({
          message: "Cập nhật hợp đồng thành công",
          placement: "top",
          duration: 3,
        });
      })
      .catch((error) => {
        console.log(error);
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

  const addAssetFinish = async (dataAsset) => {
    const data = {
      asset_id: dataAsset?.asset_id,
      assets_additional_name: dataAsset?.asset_name,
      assets_additional_type: dataAsset?.asset_type_show_name,
      hand_over_asset_quantity: dataAsset?.hand_over_asset_quantity,
      hand_over_asset_status: true,
      hand_over_date_delivery: dataAsset?.hand_over_asset_date_delivery?.format('DD-MM-YYYY')
    };
    console.log(JSON.stringify(data));
    setLoading(true);
    await axios
      .post(ADD_ASSET + contract_id, data, {
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
    const duplicate = dataAsset.find(
      (asset) =>
        asset.asset_name.toLowerCase().trim() === e.asset_name.toLowerCase().trim() &&
        asset.asset_type_show_name === e.asset_type_show_name &&
        asset.hand_over_asset_date_delivery === moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY") &&
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
              hand_over_asset_date_delivery: moment(e.hand_over_asset_date_delivery).format("DD-MM-YYYY"),
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

  useEffect(() => {
    loadDefault();
  }, []);

  const loadDefault = () => {
    form.setFieldsValue({
      contract_type: 1,
      note: "",
    });
    createAssetForm.setFieldsValue({
      asset_id: assetId,
      hand_over_asset_date_delivery: formAddAsset.dateOfDelivery,
      hand_over_asset_quantity: formAddAsset.asset_unit,
      // asset_type_show_name: formAddAsset.asset_type,
      // hand_over_asset_status: formAddAsset.asset_status,
    });
  };

  form.setFieldsValue({
    // group_id: dataApartmentGroupSelect?.group_id,
    list_renter: dataMember,
    // list_general_service: listGeneralService,
    list_hand_over_assets: dataAsset,
  });

  const onNext = async () => {
    try {
      if (changeTab === "1") {
        await form.validateFields([
          "contract_name",
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
        ]);
        setDisplayFinish([...displayFinish, 1]);
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
      console.log(e);
      notification.error({
        message: "Không thể chuyển qua bước tiếp theo",
        description: "Vui lòng điền đủ thông tin hợp đồng",
        placement: "top",
        duration: 2,
      });
    }
  };
  console.log(dataContractById);
  return (
    <div className="contract">
      <Spin size="large" spinning={loading}>
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
                  <p className="header-title">Cập nhật hợp đồng cho khách thuê</p>
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
                          <Col xs={24} xl={8} span={8}>
                            <Card
                              style={cardHeight}
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
                              bordered={false}
                            >
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
                                    <b>Địa chỉ: </b>
                                  </span>
                                }
                              >
                                <Input placeholder="Địa chỉ"></Input>
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
                                <Input.TextArea maxLength={200} rows={6} placeholder="Ghi chú" value={""} />
                              </Form.Item>
                            </Card>
                          </Col>
                          <Col xs={24} xl={8} span={8}>
                            <Card
                              style={cardHeight}
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
                              {/* <Form.Item
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
                            </Form.Item> */}
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
                                <Select
                                  disabled
                                  onChange={(e) => {
                                    form.setFieldsValue({
                                      room_floor: "",
                                      room_id: "",
                                      contract_price: 0,
                                      contract_deposit: 0,
                                      serviceIndexInForm: null,
                                    });
                                    setDataApartmentGroupSelect(
                                      dataApartmentGroup.find((obj, index) => obj.group_id === e)
                                    );
                                    setDataAsset(
                                      dataApartmentGroup
                                        .find((obj, index) => obj.group_id === e)
                                        ?.list_hand_over_assets?.map(
                                          (obj, index) =>
                                            [
                                              {
                                                asset_id: obj.asset_id,
                                                asset_name: obj.asset_name,
                                                asset_type: obj.asset_type,
                                                hand_over_asset_date_delivery: moment(
                                                  obj.hand_over_date_delivery,
                                                  dateFormatList
                                                )._i,
                                                asset_type_show_name: obj.asset_type_show_name,
                                                hand_over_asset_quantity: 1,
                                                // hand_over_asset_status: obj.hand_over_asset_status,
                                              },
                                            ][0]
                                        )
                                    );
                                  }}
                                  placeholder="Chọn tòa nhà"
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
                                  disabled
                                  placeholder="Chọn tầng"
                                  optionFilterProp="children"
                                  onChange={(e) => {
                                    const listRoom = dataApartmentGroupSelect?.list_rooms?.filter(
                                      (data) => data.room_floor === e && data.contract_id === null
                                    );
                                    listRoom.push(
                                      dataContractById?.list_room?.find(
                                        (obj, index) => obj.contract_id === parseInt(contract_id)
                                      )
                                    );

                                    setRoom(listRoom);
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
                                  disabled
                                  showSearch
                                  filterOption={(input, option) => (option?.children ?? "").includes(input)}
                                  placeholder="Chọn phòng"
                                  onChange={(e) => {
                                    setRoomSelect(dataApartmentGroupSelect?.list_rooms?.find((obj) => obj.room_id === e));
                                    form.setFieldsValue({
                                      contract_price: dataApartmentGroupSelect?.list_rooms?.find(
                                        (obj) => obj.room_id === e
                                      ).room_price,
                                      contract_deposit: dataApartmentGroupSelect?.list_rooms?.find(
                                        (obj) => obj.room_id === e
                                      ).room_price,
                                    });
                                  }}
                                >
                                  <Select.Option value="">Chọn phòng</Select.Option>
                                  {room?.map((obj, index) => {
                                    return (
                                      <Select.Option key={index} value={obj.room_id}>
                                        {dataContractById?.room?.id === obj.room_id
                                          ? obj.room_name + " (Phòng đang ở)"
                                          : obj.room_name}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                className="form-item"
                                name="contract_type"
                                style={{ display: "none" }}
                              ></Form.Item>
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
                                  <b>Kỳ 15:</b> Khách thuê vào từ ngày 1-15 <br /> <b>Kỳ 30:</b> Khách thuê vào từ ngày
                                  16-31
                                </i>
                              </span>
                            </Card>
                          </Col>
                          <Col xs={24} xl={8} span={8}>
                            <Card
                              title={
                                <Tag
                                  color="blue"
                                  style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}
                                >
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
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Vui lòng nhập giá phòng",
                              //   },
                              // ]}
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
                                    <b>- Chu kỳ thanh toán: </b> nếu bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ
                                    30. Trường hợp có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của
                                    khách, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31
                                    của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.
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
                          {dataApartmentGroupSelect?.list_general_service?.map((obj, index) => {
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
                                        ? "Nhập chỉ số"
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
                        <p>
                          <i>
                            Các thông tin dịch vụ trên đã được ghi nhận :{" "}
                            <b>{moment(dataContractById?.contract_start_date).format("DD-MM-YYYY")}</b>
                          </i>
                        </p>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Table
                            bordered
                            rowKey={(record) => record.key}
                            dataSource={dataApartmentGroupSelect?.list_general_service}
                            columns={columnsService}
                            loading={loading}
                            scroll={{ x: 800, y: 600 }}
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
                              (Số lượng: {dataMember?.length}/{roomSelect?.room_limit_people - 1})
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
                                // member_id: memberId,
                              });
                            }}
                          />
                        </Col>
                        <Table
                          loading={loading}
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
                          4. Tài sản{" "}
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
                          <Form.Item className="form-item" name="list_hand_over_assets" labelCol={{ span: 24 }}>
                            <p>
                              <h3>
                                <b>
                                  Thông tin tài sản bàn giao tòa{" "}
                                  {dataApartmentGroupSelect?.group_name !== undefined
                                    ? dataApartmentGroupSelect?.group_name + " "
                                    : ""}
                                  {floorRoom?.room_floor !== undefined ? "tầng " + floorRoom?.room_floor : ""}{" "}
                                  {roomSelect?.room_name === undefined ? "" : "phòng " + roomSelect?.room_name}
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
                      {/* <Row>
                      <p>
                        <i>
                          <b>Lưu ý:</b>
                          <br />
                          - Trên đây là những tài sản cố định theo phòng
                          <br />- Nếu bạn muốn chỉnh sửa, thay đổi những tài sản cố định này cần vào mục <b>Quản lý trang thiết bị</b>
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
                    Cập nhật hợp đồng
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
                            <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    {/* <Form.Item
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
                  </Form.Item> */}
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
                      <Select disabled={disableEditAsset} placeholder={"Nhóm tài sản"}>
                        {listAssetType?.map((obj, index) => {
                          return (
                            <Select.Option value={obj.asset_type_show_name}>{obj.asset_type_show_name}</Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    {/* <Form.Item
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
                  </Form.Item> */}
                  </Form>
                </Modal>
                <Modal
                  title={
                    roomSelect?.room_name === undefined
                      ? "Thêm thành viên "
                      : "Thêm thành viên vào Phòng " + roomSelect?.room_name
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
      </Spin>
    </div>
  );
};
export default EditContractRenter;
