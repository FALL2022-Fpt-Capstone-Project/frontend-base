import { Form, Input, Radio, Select, notification, Switch, Button, Modal, Card } from "antd";
import "./updateStaff.scss";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
const { Option } = Select;

const UpdateStaff = ({ visible, close, id }) => {
  const [full_name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address_more_detail, setAddress_more_detail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [deactivate, setDeactivate] = useState();
  const [roles, setRoles] = useState("");

  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");

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
      });
  }, [id, cookie]);

  const data = {
    full_name: full_name,
    user_name: user_name,
    phone_number: phone_number,
    gender: gender,
    address_more_detail: address_more_detail,
    deactivate: deactivate,
    roles: roles,
    // password: password,
  };
  function Update(e) {
    axios
      .put(`manager/staff/update/${id}`, password === "" ? data : { ...data, password: password }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        window.localStorage.setItem("name", data.full_name);
        notification.success({
          message: "Cập nhật thông tin nhân viên thành công",
          duration: 3,
          placement: "top",
        });
        close(false);
        setTimeout(() => {
          // reload();
        }, "3000");
      })
      .catch((e) =>
        notification.error({
          message: "Cập nhật thông tin thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
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
  const reload = () => window.location.reload();
  return (
    <>
      <Modal
        title={<h2>Chỉnh sửa thông tin nhân viên</h2>}
        open={visible}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="UpdateStaff" type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={Update}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          name="UpdateStaff"
          id="UpdateStaff"
          autoComplete="off"
        >
          <Card className="card">
            <Form.Item
              className="form-item"
              name="full_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Tên nhân viên:</b>
                </span>
              }
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
              <Input onChange={(e) => setName(e.target.value)} value={full_name} placeholder="Nhập tên nhân viên" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="user_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Tên đăng nhập:</b>
                </span>
              }
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
              <Input onChange={(e) => setUserName(e.target.value)} value={user_name} placeholder="Nhập tên đăng nhập" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="password"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Đổi mật khẩu:</b>
                </span>
              }
              hasFeedback
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="phone_number"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Số điện thoại: </b>
                </span>
              }
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
              <Input
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phone_number}
                placeholder="Số điện thoại"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              className="form-item"
              name="gender"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Giới tính:</b>
                </span>
              }
            >
              <Radio.Group onChange={genderChange} defaultValue={gender}>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Địa chỉ: </b>
                </span>
              }
            >
              <Input onChange={(e) => setAddress_more_detail(e.target.value)} value={address_more_detail} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="roles"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Vai trò: </b>
                </span>
              }
            >
              <Select
                defaultValue={roles}
                style={{
                  width: 120,
                }}
                onChange={(value) => roleChange(value)}
              >
                <Option value="admin">ADMIN</Option>
                <Option value="staff">Nhân viên</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Khoá tài khoản nhân viên: </b>
                </span>
              }
            >
              <Switch checked={deactivate} onChange={deactivateChange} />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateStaff;
