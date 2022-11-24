import { Button, Form, Input, InputNumber, Modal } from "antd";
import React from "react";

function ModalExample({ visible, close }) {
  const onFinish = (e) => {
    close(false);
  };
  const onFinishFail = (e) => {};
  return (
    <>
      <Modal
        title="Cập nhật thông tin nhân viên"
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
          <Button htmlType="submit" key="submit" form="" type="primary">
            Tạo mới
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateEmployee}
          onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          name="UpdateStaff"
          id="UpdateStaff"
          autoComplete="off"
        >
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
            name="comfirmPassword"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Nhập lại mật khẩu:</b>
              </span>
            }
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
            <Radio.Group onChange={genderChange} defaultValue={gender} style={{ marginLeft: "-9px" }}>
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
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Khoá tài khoản nhân viên: </b>
              </span>
            }
          >
            <Switch checked={deactivate} onChange={deactivateChange} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
