import { Form, Input, Radio, Select, Checkbox, Switch, Layout, Button } from "antd";
import "./updateStaff.scss";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
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

const UpdateStaff = () => {
  const [full_name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address_more_detail, setAddress_more_detail] = useState("");
  // const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [permission, setPermission] = useState([]);
  const [deactivate, setDeactivate] = useState();
  const [rolefinal, setRoles] = useState("");
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  let roles = rolefinal.split(" ");

  let cookie = localStorage.getItem("Cookie");
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
          permission: res.data?.body.permission,
        });
        setName(res.data.body?.full_name);
        setUserName(res.data.body?.user_name);
        setPhoneNumber(res.data.body?.phone_number);
        setAddress_more_detail(res.data.body?.address_more_detail);
        setGender(res.data.body?.gender);
        setRoles(role);
        setPermission(res.data?.body.permission);
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
    permission: permission,
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
        navigate(`/detail-staff/${id}`);
        console.log(res);
      })
      .catch((e) => console.log(e.request));
    console.log(data);
  }
  const roleChange = (value) => {
    setRoles(value);
    console.log(value);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };

  const permissionChange = (value) => {
    setPermission(value);
  };
  const deactivateChange = (value) => {
    setDeactivate(value);
    console.log(value);
  };
  return (
    <div className="update-staff">
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
                  <Option value="Staff">STAFF</Option>
                </Select>
              </Form.Item>
              {rolefinal === "admin" || rolefinal === "ROLE_ADMIN" || rolefinal === "ADMIN" || rolefinal === "Admin" ? (
                <Form.Item name="permission" label="Quyền">
                  <Checkbox.Group options={adminOptions} defaultValue={permission} onChange={permissionChange} />
                </Form.Item>
              ) : (
                <Form.Item name="permission" label="Quyền">
                  <Checkbox.Group options={staffOptions} onChange={permissionChange} />
                </Form.Item>
              )}

              <Form.Item name="status" label="Khoá tài khoản nhân viên">
                <Switch checked={deactivate} onChange={deactivateChange} />
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: "20px" }} onClick={Update}>
                Cập nhật
              </Button>
              <NavLink to={`/detail-staff/${id}`}>
                <Button>Quay lại</Button>
              </NavLink>
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
