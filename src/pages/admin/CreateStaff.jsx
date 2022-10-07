import { Form, Input, InputNumber, Select } from "antd";
import React from "react";
import axios from "../../api/axios";

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

const CreateStaff = () => {
  const [form] = Form.useForm();
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="createstaff"
      id="createStaff"
      scrollToFirstError
      // onFinish={handleCreateBuilding}
    >
      <Form.Item
        name="staff_name"
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
        <Input />
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
        <Input />
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
        <Input />
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
        <Input

        // onChange={changeFloor}
        />
      </Form.Item>
      <Form.Item
        name="role"
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
          // onChange={handleChange}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default CreateStaff;
