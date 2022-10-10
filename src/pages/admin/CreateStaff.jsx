import { Form, Input, InputNumber, Select } from "antd";
import React, { useState } from "react";
import axios from "../../api/axios";

const { Option } = Select;
const ADD_EMPLOYEE_URL = "manager/user/add-assistant-account";
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

const CreateStaff = () => {
  const [full_name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address_more_detail, setAddress_more_detail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [rolefinal, setRoles] = useState("");
  const [form] = Form.useForm();
  let roles = rolefinal.split(" ");
  console.log(full_name, user_name, phone_number, password, gender, roles, address_more_detail);

  const handleCreateEmployee = async (value) => {
    let cookie = localStorage.getItem("Cookie");
    // console.log(cookie);

    const employee = {
      full_name,
      user_name,
      phone_number,
      password,
      gender,
      roles,
      address_more_detail,
    };
    const response = await axios
      .post(ADD_EMPLOYEE_URL, employee, {
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
  const roleChange = (value) => {
    setRoles(value);
  };
  const genderChange = (value) => {
    setGender(value);
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="createStaff"
      id="createStaff"
      scrollToFirstError
      onFinish={handleCreateEmployee}
    >
      <Form.Item
        name="full_name"
        label="Tên nhân viên"
        rules={[
          {
            message: "Vui lòng nhập tên nhân viên!",
          },
          {
            required: true,
            message: "Vui lòng nhập tên nhân viên!",
          },
        ]}
      >
        <Input onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item
        name="user_name"
        label="Tên đăng nhập"
        rules={[
          {
            message: "Vui lòng nhập tên đăng nhập!",
          },
          {
            required: true,
            message: "Vui lòng nhập tên đăng nhập!",
          },
        ]}
      >
        <Input onChange={(e) => setUserName(e.target.value)} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            message: "Vui lòng nhập mật khẩu!",
          },
          {
            required: true,
            message: "Vui lòng nhập mật khẩu!",
          },
        ]}
      >
        <Input onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="phone_number"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại!",
          },
        ]}
      >
        <Input onChange={(e) => setPhoneNumber(e.target.value)} />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Giới tính"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập giới tính!",
          },
        ]}
      >
        <Select
          defaultValue="Nam"
          style={{
            width: 120,
          }}
          onChange={(value) => genderChange(value)}
        >
          <Option value="Nam">Nam</Option>
          <Option value="Nữ">Nữ</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="address_more_detail"
        label="Địa chỉ"
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
        <Input onChange={(e) => setAddress_more_detail(e.target.value)} />
      </Form.Item>
      <Form.Item
        name="roles"
        label="Vai trò"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập vai trò!",
          },
        ]}
      >
        <Select
          defaultValue="admin"
          style={{
            width: 120,
          }}
          onChange={(value) => roleChange(value)}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default CreateStaff;
