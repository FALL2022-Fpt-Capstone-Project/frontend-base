import { Form, Input, Radio, Select, notification, Layout, Button } from "antd";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate, NavLink } from "react-router-dom";
import "./createStaff.scss";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
const { Content, Sider, Header } = Layout;
const ADD_EMPLOYEE_URL = "manager/staff/add";
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
const options = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Nhân viên" },
];

const CreateStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { auth } = useAuth();
  let cookie = localStorage.getItem("Cookie");
  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState("staff");

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleCreateEmployee = async (value) => {
    if (typeof value.roles == "undefined") {
      value.roles = "staff";
    }
    if (typeof value.gender == "undefined") {
      value.gender = true;
    }

    const employee = {
      full_name: value.full_name,
      user_name: value.user_name,
      password: value.password,
      phone_number: value.phone_number,
      gender: value.gender,
      roles: value.roles,
      address_more_detail: value.address_more_detail,
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
      .then(() => navigate("/manage-admin"))
      .catch((e) => {
        notification.error({
          message: "Thêm mới nhân viên thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
        });
      });
    console.log(JSON.stringify(response?.data));
    console.log(employee);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };

  const roleChange = (value) => {
    setRoles(value);
  };
  return (
    <div className="create-staff">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
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
                <Form.Item
                  name="full_name"
                  label="Tên nhân viên"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhân viên!",
                    },
                  ]}
                  labelAlign="left"
                >
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item
                  name="user_name"
                  label="Tên đăng nhập"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập!",
                    },
                  ]}
                  labelAlign="left"
                >
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                  labelAlign="left"
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="comfirmPassword"
                  label="Nhập lại mật khẩu"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                      },
                    }),
                  ]}
                  labelAlign="left"
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="phone_number"
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                      whitespace: true,
                    },
                    {
                      pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                      message: "Số điện thoại phải bắt đầu (+84,0,84)",
                    },
                  ]}
                  labelAlign="left"
                >
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính" labelAlign="left" style={{ paddingLeft: "10px" }}>
                  <Radio.Group onChange={genderChange} defaultValue={true}>
                    <Radio value={true}>Nam</Radio>
                    <Radio value={false}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="address_more_detail" label="Địa chỉ" labelAlign="left" style={{ paddingLeft: "10px" }}>
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item name="roles" label="Vai trò" labelAlign="left" style={{ paddingLeft: "10px" }}>
                  <Select
                    defaultValue="staff"
                    style={{
                      width: 120,
                    }}
                    onChange={roleChange}
                    options={options}
                  />
                </Form.Item>
                <NavLink to="/manage-admin">
                  <Button style={{ marginRight: "20px" }}>Quay lại</Button>
                </NavLink>
                <Button type="primary" htmlType="submit">
                  Tạo mới
                </Button>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CreateStaff;
