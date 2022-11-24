import { Form, Input, Radio, Select, notification, Switch, Layout, Button } from "antd";
import "./updateStaff.scss";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import useAuth from "../../hooks/useAuth";
import Breadcrumbs from "../../components/BreadCrumb ";
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
  const [password, setPassword] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [gender, setGender] = useState("");
  const [deactivate, setDeactivate] = useState();
  const [roles, setRoles] = useState("");

  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  let cookie = localStorage.getItem("Cookie");
  let roleInfo = localStorage.getItem("Role");
  useEffect(() => {
    axios
      .get(`manager/staff/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        let role = res.data.data?.role_name;
        let roleSlice = role.slice(5);
        let roleFinal = roleSlice.toLowerCase();
        form.setFieldsValue({
          full_name: res.data.data?.full_name,
          user_name: res.data.data?.user_name,
          phone_number: res.data.data?.phone_number,
          address_more_detail: res.data.data?.address_more_detail,
          gender: res.data.data?.gender,
          roles: roleFinal,
          status: res.data.data?.is_deactivate,
        });
        setName(res.data.data?.full_name);
        setUserName(res.data.data?.user_name);
        setPhoneNumber(res.data.data?.phone_number);
        setAddress_more_detail(res.data.data?.address_more_detail);
        setGender(res.data.data?.gender);
        setRoles(roleFinal);
        setDeactivate(res.data.data?.is_deactivate);
        console.log(res.data.data);
      });
  }, []);
  const data = {
    full_name: full_name,
    user_name: user_name,
    phone_number: phone_number,
    gender: gender,
    address_more_detail: address_more_detail,
    deactivate: deactivate,
    roles: roles,
    password: password,
  };

  function Update(e) {
    e.preventDefault();
    axios
      .put(`manager/staff/update/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        if (roleInfo === "ROLE_ADMIN") {
          navigate("/manage-staff");
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
          <Header className="layout-header">
            <p className="header-title">Chỉnh sửa thông tin nhân viên</p>
          </Header>
          <Content className="layout-content">
            <Breadcrumbs />
            <Form
              {...formItemLayout}
              form={form}
              name="UpdateStaff"
              id="UpdateStaff"
              scrollToFirstError
              style={{ margin: "30px", width: 700 }}
              autoComplete="off"
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
                labelAlign="left"
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
                labelAlign="left"
              >
                <Input onChange={(e) => setUserName(e.target.value)} value={user_name} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Đổi mật khẩu"
                hasFeedback
                style={{ paddingLeft: "10px" }}
                labelAlign="left"
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} style={{ marginLeft: "-9px" }} />
              </Form.Item>
              <Form.Item
                name="comfirmPassword"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                style={{ paddingLeft: "10px" }}
                labelAlign="left"
              >
                <Input.Password style={{ marginLeft: "-9px" }} />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                    message: "Số điện thoại phải bắt đầu (+84,0,84)",
                  },
                ]}
                labelAlign="left"
              >
                <Input onChange={(e) => setPhoneNumber(e.target.value)} value={phone_number} />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính" style={{ paddingLeft: "10px" }} labelAlign="left">
                <Radio.Group onChange={genderChange} defaultValue={gender} style={{ marginLeft: "-9px" }}>
                  <Radio value={true}>Nam</Radio>
                  <Radio value={false}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="address_more_detail" label="Địa chỉ" style={{ paddingLeft: "10px" }} labelAlign="left">
                <Input
                  onChange={(e) => setAddress_more_detail(e.target.value)}
                  value={address_more_detail}
                  style={{ marginLeft: "-9px" }}
                />
              </Form.Item>

              <Form.Item name="roles" label="Vai trò" style={{ paddingLeft: "10px" }} labelAlign="left">
                <Select
                  defaultValue={roles}
                  style={{
                    width: 120,
                    marginLeft: "-9px",
                  }}
                  onChange={(value) => roleChange(value)}
                >
                  <Option value="admin">ADMIN</Option>
                  <Option value="staff">Nhân viên</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="status"
                label="Khoá tài khoản nhân viên"
                style={{ paddingLeft: "10px" }}
                labelAlign="left"
              >
                <Switch checked={deactivate} onChange={deactivateChange} style={{ marginLeft: "-9px" }} />
              </Form.Item>
              {roleInfo === "ROLE_ADMIN" ? (
                <NavLink to="/manage-staff">
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
