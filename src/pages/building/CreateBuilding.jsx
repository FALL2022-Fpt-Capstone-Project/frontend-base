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
  const [district, setDistrict] = useState([]);
  const [districtCode, setDistrictCode] = useState("");

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

  useEffect(() => {
    const getDistrict = async () => {
      const rest = await fetch(`https://provinces.open-api.vn/api/p/${provincecode}?depth=2`);
      const getDis = await rest.json();
      setDistrict(await getDis);
      console.log(getDis);
    };

    getDistrict();
  }, [provincecode]);

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
        name="price"
        label="Tiền thuê chung cư"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số tiền thuê chung cư!",
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
            message: "Vui lòng chọn Thành phố!",
          },
          {
            required: true,
            message: "Vui lòng chọn Thành phố!",
          },
        ]}
      >
        <Select placeholder="Chọn Thành phố" onChange={handleProvince}>
          {province.map((provinceget) => (
            <Option key={provinceget.code} value={provinceget.code}>
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
            message: "Vui lòng chọn Quận/Huyện!",
          },
          {
            required: true,
            message: "Vui lòng chọn Quận/Huyện!",
          },
        ]}
      >
        <Select placeholder="Chọn Quận/Huyện">
          {province.map((provinceget) => (
            <Option key={provinceget.code} value={provinceget.code}>
              {provinceget.districts.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[
          {
            message: "Vui lòng chọn Phường/Xã!",
          },
          {
            required: true,
            message: "Vui lòng chọn Phường/Xã!",
          },
        ]}
      >
        <Select placeholder="Chọn Phường/Xã">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
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
