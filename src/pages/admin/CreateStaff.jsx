import { Form, Input, Radio, Select, Checkbox, Layout } from "antd";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import "./createStaff.scss";
import axios from "../../api/axios";
import { StepPanel } from "./StepPanel";
import useAuth from "../../hooks/useAuth";
const { Content, Sider, Header } = Layout;
const { Option } = Select;
const ADD_EMPLOYEE_URL = "manager/account/add-staff-account";
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

const adminOptions = [
  {
    label: "Quản lý cơ sở vật chất",
    value: 1,
  },
  {
    label: "Quản lý nguồn tiền",
    value: 2,
  },
  {
    label: "Quản lý hoá đơn",
    value: 3,
  },
  {
    label: "Quản lý hợp đồng",
    value: 4,
  },
  {
    label: "Quản lý nhân viên",
    value: 5,
  },
];
const staffOptions = [
  {
    label: "Quản lý cơ sở vật chất",
    value: 1,
  },
  {
    label: "Quản lý nguồn tiền",
    value: 2,
  },
  {
    label: "Quản lý hoá đơn",
    value: 3,
  },
  {
    label: "Quản lý hợp đồng",
    value: 4,
  },
];

const CreateStaff = () => {
  const { auth } = useAuth();
  let cookie = localStorage.getItem("Cookie");
  let role = auth.roles[0];
  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState("staff");

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleCreateEmployee = async (value) => {
    let rolefinal;
    let role;
    if (typeof value.roles == "undefined") {
      rolefinal = ["staff"];
    } else {
      role = value.roles;
      rolefinal = role.split();
    }
    if (typeof value.gender == "undefined") {
      value.gender = "Nam";
    }

    const employee = {
      full_name: value.full_name,
      user_name: value.user_name,
      password: value.password,
      phone_number: value.phone_number,
      gender: value.gender,
      role: rolefinal,
      address_more_detail: value.address_more_detail,
      permission: value.permission,
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
      .then(navigate("/manage-admin"))
      .catch((e) => console.log(e.request));
    console.log(JSON.stringify(response?.data));
    console.log(employee);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };
  const roleChange = (value) => {
    setRoles(value);
    console.log(value);
  };
  const Step1Form = () => {
    return (
      <>
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
          <Input autoComplete="off" />
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
          <Input autoComplete="off" />
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
          <Input autoComplete="off" />
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
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="gender" label="Giới tính">
          <Radio.Group onChange={genderChange} defaultValue={"Nam"}>
            <Radio value={"Nam"}>Nam</Radio>
            <Radio value={"Nữ"}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="address_more_detail"
          label="Địa chỉ"
          // rules={[
          //   {
          //     message: "Vui lòng nhập địa chỉ!",
          //   },
          //   {
          //     required: true,
          //     message: "Vui lòng nhập địa chỉ!",
          //   },
          // ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="roles" label="Vai trò">
          <Select
            defaultValue="Staff"
            style={{
              width: 120,
            }}
            onChange={roleChange}
          >
            <Option value="admin">ADMIN</Option>
            <Option value="staff">STAFF</Option>
          </Select>
        </Form.Item>
      </>
    );
  };
  const Step2Form = () => {
    return (
      <>
        {roles === "ROLE_ADMIN" || roles === "admin" || roles === "Admin" ? (
          <Form.Item name="permission" label="Quyền truy cập">
            <Checkbox.Group options={adminOptions} />
          </Form.Item>
        ) : (
          <Form.Item name="permission" label="Quyền truy cập">
            <Checkbox.Group options={staffOptions} />
          </Form.Item>
        )}
      </>
    );
  };

  const steps = [
    {
      step: 1,
      title: "Thông tin cơ bản",
      content: <Step1Form />,
    },
    {
      step: 2,
      title: "Cấp quyền nhân viên",
      content: <Step2Form />,
    },
  ];
  return (
    <div className="create-staff">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="layout-header"
            style={{
              margin: "0 16px",
            }}
          >
            <p className="header-title">Tạo mới nhân viên</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <Form
              {...formItemLayout}
              form={form}
              name="createStaff"
              id="createStaff"
              onFinish={handleCreateEmployee}
              style={{ margin: "30px", width: 700 }}
            >
              <StepPanel steps={steps} />
            </Form>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            ></div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CreateStaff;
