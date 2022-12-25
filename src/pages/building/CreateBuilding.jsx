import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Checkbox,
  notification,
  AutoComplete,
  Table,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./building.scss";
const GET_LIST_SERVICE_BASIC = "manager/service/basics";
const LIST_SERVICE_CACUL_METHOD = "manager/service/types";
const CheckboxGroup = Checkbox.Group;
const ADD_BUILDING_URL = "manager/group/add";
const LIST_BUILDING_URL = "manager/group/all";
const LIST_ASSET_URL = "manager/asset/";
const LIST_ASSET_TYPE_URL = "manager/asset/type";

const CreateBuilding = ({ visible, close, data }) => {
  const [form] = Form.useForm();

  const [group_name, setGroupName] = useState("");
  const [total_floor, setBuildingFloor] = useState(8);
  const [total_room_per_floor, setBuildingRoom] = useState(3);
  const [building_address_city, setBuildingCity] = useState("");
  const [room_name_convention, setRoomNameConvention] = useState("");
  const [room_area, setRoomArea] = useState(25);
  const [room_limited_people, setRoomPeople] = useState(3);
  const [room_price, setRoomRate] = useState(3000000);
  const [buildingName, setBuildingName] = useState();
  const [address_city, setCity] = useState("");
  const [address_district, setDistrict] = useState("");
  const [address_ward, setWard] = useState("");
  const [description, setNote] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [building_address_district, setBuildingDistrict] = useState([]);
  const [building_address_district_id, setBuildingDistrictId] = useState("");
  const [building_address_wards, setBuildingWard] = useState([]);
  const [address_more_detail, setBuildingAddress] = useState("");
  const [disabledDistrict, setDisableDistrict] = useState(true);
  const [disabledWard, setDisableWard] = useState(true);
  const [listServiceName, setListServiceName] = useState([]);
  const [serviceCalMethod, setServiceCalCuMethod] = useState([]);
  const [service, setService] = useState([1, 2]);
  const [asset, setAsset] = useState([1, 2]);
  const [electric, setElectric] = useState(1);
  const [water, setWater] = useState(1);
  const [park, setPark] = useState();
  const [internet, setInternet] = useState();
  const [clean, setClean] = useState();
  const [electricPrice, setElectricPrice] = useState(3500);
  const [waterPrice, setWaterPrice] = useState(30000);
  const [parkPrice, setParkPrice] = useState(0);
  const [internetPrice, setInternetPrice] = useState(0);
  const [cleanPrice, setCleanPrice] = useState(0);
  const [listAssetName, setListAssetName] = useState();
  const [listAssetTypeName, setListAssetTypeName] = useState();
  let optionRoom = [];
  let optionFloor = [];
  for (let i = 1; i <= 10; i++) {
    optionRoom.push({
      value: i,
      label: i + " Phòng",
    });
  }
  for (let i = 1; i <= 10; i++) {
    optionFloor.push({
      value: i,
      label: i + " Tầng",
    });
  }
  let list_general_service = [];
  let cookie = localStorage.getItem("Cookie");
  const handleCreateBuilding = async (value) => {
    if (service?.includes(1)) {
      list_general_service.push({
        service_id: 1,
        general_service_type: electric,
        general_service_price: electricPrice,
      });
    }
    if (service?.includes(2)) {
      list_general_service.push({
        service_id: 2,
        general_service_type: water,
        general_service_price: waterPrice,
      });
    }
    if (service?.includes(3)) {
      list_general_service.push({
        service_id: 3,
        general_service_type: park,
        general_service_price: parkPrice,
      });
    }
    if (service?.includes(4)) {
      list_general_service.push({
        service_id: 4,
        general_service_type: internet,
        general_service_price: internetPrice,
      });
    }
    if (service?.includes(5)) {
      list_general_service.push({
        service_id: 5,
        general_service_type: clean,
        general_service_price: cleanPrice,
      });
    }
    let list_additional_asset = value.list_additional_asset;
    const building = {
      group_name,
      total_room_per_floor,
      total_floor,
      address_city,
      address_district,
      address_ward,
      address_more_detail,
      description,
      list_general_service,
      room_name_convention,
      room_area,
      room_limited_people,
      room_price,
      list_asset,
      list_additional_asset,
    };
    const response = await axios
      .post(ADD_BUILDING_URL, building, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Thêm mới chung cư thành công",
          duration: 3,
          placement: "top",
        });
        close(false);
        reload();
      })
      .catch((e) => {
        console.log(e.request);
        notification.error({
          message: "Thêm mới chung cư thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
        });
      });
  };

  useEffect(() => {
    const getListServiceBasic = async () => {
      await axios
        .get(GET_LIST_SERVICE_BASIC, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setListServiceName(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListServiceBasic();
  }, []);
  useEffect(() => {
    const getListAssetTypeBasic = async () => {
      await axios
        .get(LIST_ASSET_TYPE_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setListAssetTypeName(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListAssetTypeBasic();
  }, []);
  useEffect(() => {
    const getListAssetBasic = async () => {
      await axios
        .get(LIST_ASSET_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setListAssetName(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListAssetBasic();
  }, []);
  for (let i = 0; i < listAssetName?.length; i++) {
    Object.assign(listAssetName[i], { key: i });
  }

  useEffect(() => {
    const getListServiceCaculMethod = async () => {
      await axios
        .get(LIST_SERVICE_CACUL_METHOD, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setServiceCalCuMethod(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListServiceCaculMethod();
  }, []);

  useEffect(() => {
    const getCity = async () => {
      const response = await axios
        .get("https://provinces.open-api.vn/api/p/", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingCity(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCity();
  }, []);

  useEffect(() => {
    const getDistric = async () => {
      const response = await axios
        .get(`https://provinces.open-api.vn/api/p/${building_address_city_id}?depth=2`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingDistrict(res.data.districts);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDistric();
  }, [building_address_city_id]);
  useEffect(() => {
    const getDistric = async () => {
      const response = await axios
        .get(`https://provinces.open-api.vn/api/d/${building_address_district_id}?depth=2`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingWard(res.data.wards);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDistric();
  }, [building_address_district_id]);

  useEffect(() => {
    const getAllBuilding = async () => {
      const response = await axios
        .get(LIST_BUILDING_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingName(res.data.data.list_group_contracted.concat(res.data.data.list_group_non_contracted));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getAllBuilding();
  }, [cookie]);

  let optionsCity = [];
  for (let i = 0; i < building_address_city.length; i++) {
    optionsCity.push({
      label: building_address_city[i].name,
      value: building_address_city[i].code,
    });
  }
  let optionBuilding = [];
  for (let i = 0; i < buildingName?.length; i++) {
    optionBuilding.push({
      label: buildingName[i].group_name,
      value: buildingName[i].group_name,
    });
  }
  const building = [];
  for (let i = 0; i < buildingName?.length; i++) {
    building.push(buildingName[i].group_name);
  }
  const cityChange = (value, option) => {
    setBuildingDistrict([]);
    setBuildingCityId(value);
    setDisableDistrict(false);
    setDisableWard(true);
    form.setFieldsValue({ district: "", ward: "" });
    setCity(option.label);
  };
  const districtChange = (value, option) => {
    setBuildingDistrictId(value);
    setDisableWard(false);
    form.setFieldsValue({ ward: "" });
    setDistrict(option.label);
  };
  const wardChange = (value, option) => {
    setWard(option.label);
  };
  const changeRoom = (value) => {
    setBuildingRoom(value);
  };
  const changeFloor = (value) => {
    setBuildingFloor(value);
  };
  const serviceChange = (checkedValues) => {
    setService(checkedValues);
  };
  const electricChange = (value) => {
    setElectric(value);
  };
  const waterChange = (value) => {
    setWater(value);
  };
  const parkChange = (value) => {
    setPark(value);
  };
  const internetChange = (value) => {
    setInternet(value);
  };
  const cleanChange = (value) => {
    setClean(value);
  };
  const roomPeopleChange = (value) => {
    setRoomPeople(value);
  };
  const roomAreaChange = (value) => {
    setRoomArea(value);
  };
  const roomRateChange = (value) => {
    setRoomRate(value);
  };
  const electricPriceChange = (value) => {
    setElectricPrice(value);
  };
  const waterPriceChange = (value) => {
    setWaterPrice(value);
  };
  const parkPriceChange = (value) => {
    setParkPrice(value);
  };
  const internetPriceChange = (value) => {
    setInternetPrice(value);
  };
  const cleanPriceChange = (value) => {
    setCleanPrice(value);
  };

  const reload = () => window.location.reload();

  const list_asset = [];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setAsset(selectedRows);
    },
  };
  for (let i = 0; i < asset?.length; i++) {
    list_asset.push({
      asset_name: asset[i].basic_asset_name,
      asset_type_id: asset[i].asset_type_id,
    });
  }
  return (
    <>
      <Modal
        title={<h2>Thêm mới chung cư</h2>}
        open={visible}
        width={1300}
        afterClose={() => form.resetFields()}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="createBuilding" type="primary">
            Thêm mới
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateBuilding}
          layout="horizontal"
          size={"default"}
          id="createBuilding"
          autoComplete="off"
          scrollToFirstError
          initialValues={{
            building_total_floor: 8,
            building_total_room: 3,
            room_rate: 3000000,
            room_people: 3,
            room_area: 25,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Card title="Thông tin chung" className="card">
                <Form.Item
                  name="building_name"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tên chung cư: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên chung cư!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const includesValue = building?.some((element) => {
                          return element?.toLowerCase() === value.toLowerCase();
                        });
                        if (!includesValue || !value) {
                          return Promise.resolve(new Error("Vui lòng nhập tên chung cư!"));
                        } else {
                          return Promise.reject(new Error("Tên chung cư đã tồn tại trong hệ thống!"));
                        }
                      },
                    }),
                  ]}
                >
                  <AutoComplete
                    options={optionBuilding}
                    style={{ width: "100%" }}
                    placeholder="Nhập tên chung cư"
                    filterOption={true}
                    onChange={(value) => setGroupName(value)}
                  />
                </Form.Item>
                <Form.Item
                  name="building_total_floor"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng tầng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng tầng lớn hơn 0 và nhỏ hơn 10!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số lượng tầng của chung cư"
                    defaultValue={1}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={1}
                    onChange={changeFloor}
                  />
                </Form.Item>
                <Form.Item
                  name="building_total_room"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng phòng mỗi tầng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng phòng lớn hơn 0 và nhỏ hơn 10!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số lượng phòng"
                    defaultValue={1}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={1}
                    onChange={changeRoom}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="room_name_convention"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tên phòng quy ước: </b>
                    </span>
                  }
                >
                  <Input placeholder="Nhập tên phòng" onChange={(e) => setRoomNameConvention(e.target.value)} />
                </Form.Item>
                <Row>
                  <Col span={24}>
                    <p>
                      <i>
                        <b>Ví dụ:</b>Tầng: <b>1</b>, Số lượng phòng mỗi tầng: <b>10</b>, Tên phòng quy ước: <b>A</b>.
                        Phòng sẽ tự động được tạo lần lượt là: <b>A101, A102, A103 ... A110.</b>
                      </i>
                    </p>
                  </Col>
                </Row>
                <Form.Item
                  className="form-item"
                  name="room_rate"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Giá phòng chung: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá phòng!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập giá phòng"
                    controls={false}
                    addonAfter="VNĐ"
                    defaultValue={3000000}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={0}
                    onChange={roomRateChange}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="room_people"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng người tối đa / phòng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng người tối đa trong phòng!",
                    },
                  ]}
                >
                  <InputNumber
                    addonAfter="Người"
                    style={{ width: "100%" }}
                    defaultValue={3}
                    placeholder="Nhập số lượng người tối đa của phòng"
                    onChange={roomPeopleChange}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="room_area"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Diện tích (m2): </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập diện tích phòng!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    addonAfter="m2"
                    controls={false}
                    placeholder="Nhập diện tích phòng"
                    onChange={roomAreaChange}
                    defaultValue={25}
                  />
                </Form.Item>
                <Form.Item
                  name="city"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn thành phố: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thành phố!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn thành phố"
                    style={{
                      width: "100%",
                    }}
                    onChange={cityChange}
                    options={optionsCity}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="district"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn Quận/Huyện: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quận/huyện!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn Quận/Huyện"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledDistrict}
                    onChange={districtChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={
                      building_address_district === undefined
                        ? []
                        : [
                            ...building_address_district?.map((obj) => {
                              return { label: obj.name, value: obj.code };
                            }),
                            {
                              label: "Chọn Quận/Huyện",
                              value: "",
                            },
                          ]
                    }
                  ></Select>
                </Form.Item>
                <Form.Item
                  name="ward"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn Phường/Xã: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phường/xã!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn Phường/Xã"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledWard}
                    onChange={wardChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={
                      building_address_wards === undefined
                        ? []
                        : [
                            ...building_address_wards?.map((obj) => {
                              return { label: obj.name, value: obj.code };
                            }),
                            {
                              label: "Chọn Phường/Xã",
                              value: "",
                            },
                          ]
                    }
                  ></Select>
                </Form.Item>

                <Form.Item
                  name="building_address_more_detail"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Địa chỉ chi tiết: </b>
                    </span>
                  }
                >
                  <Input onChange={(e) => setBuildingAddress(e.target.value)} placeholder="Nhập địa chỉ chi tiết" />
                </Form.Item>
                <Form.Item
                  name="note"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Mô tả: </b>
                    </span>
                  }
                >
                  <TextArea rows={4} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú" />
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Dịch vụ chung" className="card">
                <Form.Item name="service">
                  <Row>
                    <Col span={7}>
                      <Row style={{ marginBottom: "10px" }}>
                        <b>Tên dịch vụ</b>
                      </Row>
                      <Row>
                        <CheckboxGroup onChange={serviceChange} defaultValue={[1, 2]}>
                          {listServiceName
                            ?.filter(function (img) {
                              if (img.service_show_name === "Khác") {
                                return false;
                              }
                              return true;
                            })
                            .map((obj, idx) => {
                              return (
                                <>
                                  <Row style={{ marginBottom: "23px" }}>
                                    <Checkbox value={obj.id}>{obj.service_show_name}</Checkbox>
                                  </Row>
                                </>
                              );
                            })}
                        </CheckboxGroup>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Row style={{ marginBottom: "10px" }}>
                        <b>Giá tiền dịch vụ</b>
                      </Row>
                      <Row>
                        <InputNumber
                          placeholder="Nhập giá tiền dịch vụ"
                          controls={false}
                          addonAfter="VNĐ"
                          defaultValue={3500}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          min={0}
                          onChange={electricPriceChange}
                        />
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <InputNumber
                          placeholder="Nhập giá tiền dịch vụ"
                          controls={false}
                          addonAfter="VNĐ"
                          defaultValue={30000}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          min={0}
                          onChange={waterPriceChange}
                        />
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <InputNumber
                          placeholder="Nhập giá tiền dịch vụ"
                          controls={false}
                          addonAfter="VNĐ"
                          defaultValue={0}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          min={0}
                          onChange={parkPriceChange}
                        />
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <InputNumber
                          placeholder="Nhập giá tiền dịch vụ"
                          controls={false}
                          addonAfter="VNĐ"
                          defaultValue={0}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          min={0}
                          onChange={cleanPriceChange}
                        />
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <InputNumber
                          placeholder="Nhập giá tiền dịch vụ"
                          controls={false}
                          addonAfter="VNĐ"
                          defaultValue={0}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          style={{ width: "100%" }}
                          min={0}
                          onChange={internetPriceChange}
                        />
                        <br />
                        <br />
                      </Row>
                    </Col>
                    <Col span={8} offset={1}>
                      <Row style={{ marginBottom: "10px" }}>
                        <b>Cách tính giá dịch vụ</b>
                      </Row>
                      <Row>
                        <Select
                          defaultValue={1}
                          style={{
                            width: "100%",
                          }}
                          onChange={electricChange}
                        >
                          <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                          {serviceCalMethod?.map((obj, index) => {
                            return (
                              <>
                                <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                              </>
                            );
                          })}
                        </Select>
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <Select
                          defaultValue={1}
                          style={{
                            width: "100%",
                          }}
                          onChange={waterChange}
                        >
                          <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                          {serviceCalMethod?.map((obj, index) => {
                            return (
                              <>
                                <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                              </>
                            );
                          })}
                        </Select>
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <Select
                          defaultValue={""}
                          style={{
                            width: "100%",
                          }}
                          onChange={parkChange}
                        >
                          <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                          {serviceCalMethod?.map((obj, index) => {
                            return (
                              <>
                                <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                              </>
                            );
                          })}
                        </Select>
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <Select
                          defaultValue={""}
                          style={{
                            width: "100%",
                          }}
                          onChange={internetChange}
                        >
                          <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                          {serviceCalMethod?.map((obj, index) => {
                            return (
                              <>
                                <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                              </>
                            );
                          })}
                        </Select>
                        <br />
                        <br />
                      </Row>
                      <Row>
                        <Select
                          defaultValue={""}
                          style={{
                            width: "100%",
                          }}
                          onChange={cleanChange}
                        >
                          <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                          {serviceCalMethod?.map((obj, index) => {
                            return (
                              <>
                                <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                              </>
                            );
                          })}
                        </Select>
                        <br />
                        <br />
                      </Row>
                    </Col>
                  </Row>
                </Form.Item>
              </Card>
              <Card title="Tài sản mặc định" className="card card-asset">
                <Form.Item name="asset">
                  <Row>
                    <Col span={24}>
                      <Table
                        columns={[
                          {
                            title: "Tên tài sản",
                            dataIndex: "basic_asset_name",
                            key: "basic_asset_id",
                            width: "40%",
                          },
                          {
                            title: "Nhóm tài sản",
                            dataIndex: "asset_type_show_name",
                            key: "asset_type_id",
                          },
                        ]}
                        rowSelection={{
                          ...rowSelection,
                        }}
                        dataSource={listAssetName}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.List name="list_additional_asset">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "asset_name"]}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "Vui lòng nhập tên tài sản, hoặc xoá trường này",
                                },
                              ]}
                            >
                              <Input placeholder="Nhập tên tài sản" />
                            </Form.Item>
                          </Col>
                          <Col span={8} offset={1}>
                            <Form.Item
                              {...restField}
                              name={[name, "asset_type_id"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn nhóm tài sản!",
                                },
                              ]}
                            >
                              <Select
                                style={{
                                  width: "100%",
                                }}
                                defaultValue="Chọn nhóm tài sản"
                              >
                                {listAssetTypeName?.map((obj, index) => {
                                  return (
                                    <>
                                      <Select.Option key={index} value={obj.id}>
                                        {obj.asset_type_show_name}
                                      </Select.Option>
                                    </>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={4} offset={1}>
                            <DeleteOutlined className="dynamic-delete-button" onClick={() => remove(name)} />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm tài sản mới
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateBuilding;
