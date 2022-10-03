import { Form, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "../../api/axios";
import useLocationForm from "./useLocationForm";

const ADD_EMPLOYEE_URL = "manager/add-building";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const CreateBuilding = () => {
  const [form] = Form.useForm();
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm(false);

  const { cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard } = state;

  // console.log(cityOptions);

  const [building_name, setBuildingName] = useState("");
  const [building_total_floor, setBuildingFloor] = useState("");
  const [building_total_room, setBuildingRoom] = useState("");
  const [building_address_city, setBuildingCty] = useState("");
  const [building_address_district, setBuildingDistrict] = useState("");
  const [building_address_wards, setBuildingWard] = useState("");
  const [building_address_more_detail, setBuildingAddress] = useState("");

  // console.log(selectedCity?.label);

  const Address = () => {
    setBuildingCty(selectedCity?.label);
    setBuildingDistrict(selectedDistrict?.label);
    setBuildingWard(selectedWard?.label);
    // address();
  };
  useEffect(() => {
    Address();
  });
  const handleCreateBuilding = async (value) => {
    let cookie = localStorage.getItem("Cookie");
    // console.log(cookie);

    const building = {
      building_name,
      building_total_room,
      building_total_floor,
      building_address_city,
      building_address_district,
      building_address_wards,
      building_address_more_detail,
    };
    const response = await axios
      .post(ADD_EMPLOYEE_URL, building, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((e) => console.log(e.request));
    console.log(JSON.stringify(response?.data));
    // console.log(value);
  };

  const changeRoom = (value) => {
    setBuildingRoom(value);
  };
  const changeFloor = (value) => {
    setBuildingFloor(value);
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="createBuilding"
      id="createBuilding"
      scrollToFirstError
      onFinish={handleCreateBuilding}
    >
      <Form.Item
        name="building_name"
        label="Tên chung cư"
        rules={[
          {
            message: "Vui lòng nhập tên chung cư!",
          },
          {
            required: true,
            message: "Vui lòng nhập tên chung cư!",
          },
        ]}
      >
        <Input onChange={(e) => setBuildingName(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="building_total_floor"
        label="Số tầng"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số tầng của chung cư!",
          },
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
          onChange={changeFloor}
        />
      </Form.Item>
      <Form.Item
        name="building_total_room"
        label="Số phòng"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số phòng của chung cư!",
          },
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
          onChange={changeRoom}
        />
      </Form.Item>

      <Form.Item
        name="building_address_city"
        label="Thành phố"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Thành phố!",
          },
        ]}
      >
        <Select
          name="cityId"
          key={`cityId_${selectedCity?.value}`}
          isDisabled={cityOptions.length === 0}
          options={cityOptions}
          onChange={(option) => onCitySelect(option)}
          placeholder="Tỉnh/Thành"
          defaultValue={selectedCity}
        />
      </Form.Item>
      <Form.Item
        name="building_address_district"
        label="Quận/Huyện"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Quận/Huyện!",
          },
        ]}
      >
        <Select
          name="districtId"
          key={`districtId_${selectedDistrict?.value}`}
          isDisabled={districtOptions.length === 0}
          options={districtOptions}
          onChange={(option) => onDistrictSelect(option)}
          placeholder="Quận/Huyện"
          defaultValue={selectedDistrict}
        />
      </Form.Item>

      <Form.Item
        name="building_address_wards"
        label="Phường/Xã"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Phường/Xã!",
          },
        ]}
      >
        <Select
          name="wardId"
          key={`wardId_${selectedWard?.value}`}
          isDisabled={wardOptions.length === 0}
          options={wardOptions}
          placeholder="Phường/Xã"
          onChange={(option) => onWardSelect(option)}
          defaultValue={selectedWard}
        />
      </Form.Item>

      <Form.Item
        name="building_address_more_detail"
        label="Địa chỉ chi tiết"
        rules={[
          {
            message: "Vui lòng nhập địa chỉ!",
          },
          {
            required: true,
            message: "Vui lòng nhập địa chỉ!",
          },
        ]}
      >
        <Input onChange={(e) => setBuildingAddress(e.target.value)} />
      </Form.Item>
    </Form>
  );
};

export default CreateBuilding;
