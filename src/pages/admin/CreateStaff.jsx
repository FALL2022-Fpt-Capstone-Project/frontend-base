import { Form, Input, Card, Radio, Select, notification, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import "./createStaff.scss";
import axios from "../../api/axios";
const ADD_EMPLOYEE_URL = "manager/staff/add";
const LIST_ROLES_URL = "manager/staff/roles";

const CreateStaff = ({ visible, close }) => {
  let cookie = localStorage.getItem("Cookie");
  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState("staff");
  const [option, setOption] = useState([]);

  const [form] = Form.useForm();
  useEffect(() => {
    const getRoleFilter = async () => {
      const response = await axios
        .get(LIST_ROLES_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setOption(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getRoleFilter();
  }, [cookie]);
  let options = [];
  for (let i = 0; i < option.length; i++) {
    if (option[i] === "STAFF") {
      options.push({
        value: option[i].toLowerCase(),
        label: "Nhân viên",
      });
    } else {
      options.push({
        value: option[i].toLowerCase(),
        label: option[i],
      });
    }
  }
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
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then(
        () =>
          notification.success({
            message: "Thêm mới nhân viên thành công",
            duration: 3,
          }),
        close(false)
      )
      .catch((e) => {
        notification.error({
          message: "Thêm mới nhân viên thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
        });
      }, close(false));
    // console.log(JSON.stringify(response?.data));
    // console.log(employee);
  };
  const genderChange = (e) => {
    setGender(e.target.value);
  };

  const roleChange = (value) => {
    setRoles(value);
  };
  return (
    <>
      <Modal
        title="Thêm mới nhân viên"
        open={visible}
        destroyOnClose={true}
        afterClose={() => form.resetFields()}
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
          <Button htmlType="submit" key="submit" form="createStaff" type="primary">
            Tạo mới
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateEmployee}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createStaff"
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
                  required: true,
                  message: "Vui lòng nhập tên nhân viên!",
                },
              ]}
            >
              <Input autoComplete="off" placeholder="Nhập tên nhân viên" />
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
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input autoComplete="off" placeholder="Nhập tên đăng nhập" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="password"
              hasFeedback
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Mật khẩu:</b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="comfirmPassword"
              labelCol={{ span: 24 }}
              hasFeedback
              label={
                <span>
                  <b>Nhập lại mật khẩu:</b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu!",
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
              <Input.Password placeholder="Nhập lại mật khẩu" />
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
                  message: "Vui lòng nhập số điện thoại",
                  whitespace: true,
                },
                {
                  pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" style={{ width: "100%" }} autoComplete="off" />
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
              <Radio.Group onChange={genderChange} defaultValue={true}>
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
              <Input autoComplete="off" placeholder="Nhập địa chỉ" />
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
                defaultValue="staff"
                style={{
                  width: 120,
                }}
                onChange={roleChange}
                options={options}
              />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default CreateStaff;
