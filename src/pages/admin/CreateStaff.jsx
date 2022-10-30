import { Form, Input, Radio, Checkbox, Layout, Button } from "antd";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate, NavLink } from "react-router-dom";
import useLocationForm from "../building/useLocationForm";
import "./createStaff.scss";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
const { Content, Sider, Header } = Layout;
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
const options = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Nhân viên" },
];

const CreateStaff = () => {
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm(false);
  const { cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard } = state;
  const [address_city, setBuildingCty] = useState("");
  const [address_district, setBuildingDistrict] = useState("");
  const [address_wards, setBuildingWard] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { auth } = useAuth();
  let cookie = localStorage.getItem("Cookie");
  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState("staff");

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const Address = () => {
    setBuildingCty(selectedCity?.label);
    setBuildingDistrict(selectedDistrict?.label);
    setBuildingWard(selectedWard?.label);
    // address();
  };
  useEffect(() => {
    Address();
  });
  const handleCreateEmployee = async (value) => {
    let rolefinal;
    if (typeof roles == "undefined") {
      rolefinal = ["staff"];
    } else {
      rolefinal = roles.split();
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
      address_city: address_city,
      address_district: address_district,
      address_wards: address_wards,
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
      .then(navigate("/manage-admin"))
      .catch((e) => console.log(e.request));
    console.log(JSON.stringify(response?.data));
    console.log(employee);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };
  const roleChange = (value) => {
    setRoles(value.value);
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
                <Form.Item name="building_address_city" label="Thành phố">
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
                <Form.Item name="building_address_district" label="Quận/Huyện">
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

                <Form.Item name="building_address_wards" label="Phường/Xã">
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
                <Form.Item name="address_more_detail" label="Địa chỉ">
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item name="roles" label="Vai trò">
                  <Select
                    defaultValue={{ label: "Nhân viên", value: "staff" }}
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
