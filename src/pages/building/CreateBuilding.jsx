import { Form, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;
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

  const [province, setProvince] = useState([]);
  const [provincecode, setProvinceCode] = useState("");
  const [district, setDistrict] = useState(null);
  const [districtCode, setDistrictCode] = useState("");
  const [ward, setWard] = useState(null);

  useEffect(() => {
    const getProvince = async () => {
      const res = await fetch("https://provinces.open-api.vn/api/p?depth=2");
      const getPro = await res.json();
      setProvince(await getPro);
    };
    getProvince();
  }, []);

  const handleProvince = (value) => {
    const getProvinceCode = value;
    setProvinceCode(getProvinceCode);
  };
  // console.log(provincecode);
  useEffect(() => {
    const getDistrict = async () => {
      const rest = await fetch(`https://provinces.open-api.vn/api/p/${provincecode}?depth=2`);
      const getDis = await rest.json();
      setDistrict(null);
      setDistrict(await getDis);
    };
    getDistrict();
  }, [provincecode]);
  // console.log(district);
  // console.log(district.districts);
  const handleDistrict = (value) => {
    const getDistrictCode = value;
    setDistrictCode(getDistrictCode);
    // console.log(getProvinceCode);
  };
  useEffect(() => {
    const getWard = async () => {
      const rest = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const getWard = await rest.json();
      setWard(await getWard);
    };
    getWard();
  }, [districtCode]);
  return (
    <Form {...formItemLayout} form={form} name="createBuilding" id="createBuilding" scrollToFirstError>
      <Form.Item
        name="name"
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
        <Input />
      </Form.Item>

      <Form.Item
        name="floor"
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
        />
      </Form.Item>
      <Form.Item
        name="room"
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
        />
      </Form.Item>
      <Form.Item
        name="renter"
        label="Số người trong một phòng"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số người trong một phòng!",
          },
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="city"
        label="Thành phố"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Thành phố!",
          },
        ]}
      >
        <Select placeholder="Chọn Thành phố" onChange={handleProvince}>
          {province.map((provinceget, idx) => (
            <Option key={idx} value={provinceget.code}>
              {provinceget.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="district"
        label="Quận/Huyện"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Quận/Huyện!",
          },
        ]}
      >
        {district != null ? (
          <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrict}>
            {district.districts?.map((districtget, idx) => (
              <Option key={idx} value={districtget.code}>
                {districtget.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Select placeholder="Chọn Quận/Huyện">
            <Option value={""}></Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn Phường/Xã!",
          },
        ]}
      >
        {ward != null ? (
          <Select placeholder="Chọn Quận/Huyện">
            {ward.wards?.map((wardget) => (
              <Option key={wardget.code} value={wardget.code}>
                {wardget.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Select placeholder="Chọn Phường/Xã">
            <Option value={""}></Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item
        name="detail"
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
        <Input />
      </Form.Item>
    </Form>
  );
};

export default CreateBuilding;
