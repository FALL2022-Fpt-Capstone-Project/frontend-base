import React from "react";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import "antd/dist/antd.min.css";
import "./login.scss";

const Login = () => {
  return (
    <div className="login">
      <div className="form">
        <h1 className="login-title">Đăng nhập</h1>
        <Form name="normal_login" className="login-form" initialValues={{ remember: true }}>
          <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Nhớ mật khẩu</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
