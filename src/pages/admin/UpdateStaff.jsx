import { Form, Input, Radio, Select, notification, Switch, Layout, Button } from "antd";
import "./updateStaff.scss";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import useAuth from "../../hooks/useAuth";
const { Content, Sider, Header } = Layout;
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

const UpdateStaff = () => {
  const { auth } = useAuth();
  const [full_name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address_more_detail, setAddress_more_detail] = useState("");
  // const [password, setPassword] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [gender, setGender] = useState("");
  const [deactivate, setDeactivate] = useState();
  const [rolefinal, setRoles] = useState("");

  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(rolefinal);
  let roles = rolefinal.split(" ");
  let cookie = localStorage.getItem("Cookie");
  let roleInfo = localStorage.getItem("Role");
  useEffect(() => {
    axios
      .get(`manager/account/staff-account/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        let roles = res.data.body.role[0];
        let role = roles.toString().slice(5);
        form.setFieldsValue({
          full_name: res.data.body?.full_name,
          user_name: res.data.body?.user_name,
          phone_number: res.data.body?.phone_number,
          address_more_detail: res.data.body?.address_more_detail,
          gender: res.data.body?.gender,
          roles: role,
          status: res.data.body?.deactiave,
        });
        setName(res.data.body?.full_name);
        setUserName(res.data.body?.user_name);
        setPhoneNumber(res.data.body?.phone_number);
        setAddress_more_detail(res.data.body?.address_more_detail);
        setGender(res.data.body?.gender);
        setRoles(role);
        setDeactivate(res.data.body?.deactivate);
        console.log(res.data.body);
      });
  }, []);
  const data = {
    full_name: full_name,
    user_name: user_name,
    phone_number: phone_number,
    gender: gender,
    address_more_detail: address_more_detail,
    deactivate: deactivate,
    role: roles,
    permission: [1],
  };

  function Update(e) {
    e.preventDefault();
    axios
      .put(`manager/account/update-account/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        if (roleInfo === "ROLE_ADMIN") {
          navigate("/manage-admin");
        } else {
          navigate("/home");
        }
        console.log(res);
      })
      .catch((e) =>
        notification.error({
          message: "Chỉnh sửa nhân viên thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
        })
      );
    console.log(data);
  }
  const roleChange = (value) => {
    setRoles(value);
    console.log(value);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };
  const deactivateChange = (value) => {
    setDeactivate(value);
  };
  return (
    <div className="update-staff">
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
            <p className="header-title">Chỉnh sửa thông tin nhân viên</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <Form
              {...formItemLayout}
              form={form}
              name="UpdateStaff"
              id="UpdateStaff"
              scrollToFirstError
              style={{ margin: "30px", width: 700 }}
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
                <Input onChange={(e) => setName(e.target.value)} value={full_name} />
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
                <Input onChange={(e) => setUserName(e.target.value)} value={user_name} />
              </Form.Item>
              {/* <Form.Item
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
              </Form.Item> */}
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
                <Input onChange={(e) => setPhoneNumber(e.target.value)} value={phone_number} />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính">
                <Radio.Group onChange={genderChange} defaultValue={gender}>
                  <Radio value={"Nam"}>Nam</Radio>
                  <Radio value={"Nữ"}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="address_more_detail" label="Địa chỉ">
                <Input onChange={(e) => setAddress_more_detail(e.target.value)} value={address_more_detail} />
              </Form.Item>
              {/* <Form.Item name="birth_date" label="Ngày sinh">
                <DatePicker placeholder="Chọn ngày sinh" format={"DD/MM/YYYY"} />
              </Form.Item> */}
              <Form.Item name="roles" label="Vai trò">
                <Select
                  defaultValue={roles}
                  style={{
                    width: 120,
                  }}
                  onChange={(value) => roleChange(value)}
                >
                  <Option value="Admin">ADMIN</Option>
                  <Option value="Staff">Nhân viên</Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Khoá tài khoản nhân viên">
                <Switch checked={deactivate} onChange={deactivateChange} />
              </Form.Item>
              {rolefinal === "ADMIN" ? (
                <NavLink to="/manage-admin">
                  <Button style={{ marginRight: "20px" }}>Quay lại</Button>
                </NavLink>
              ) : (
                <NavLink to="/home">
                  <Button style={{ marginRight: "20px" }}>Quay lại</Button>
                </NavLink>
              )}
              <Button type="primary" htmlType="submit" onClick={Update}>
                Cập nhật
              </Button>
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

export default UpdateStaff;
