import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "antd/dist/antd.min.css";
import "./login.scss";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="https://preview.redd.it/au30nopzypm41.jpg?auto=webp&s=f802cfa72ef59f9431e155df8c73a266de63feda"
            alt="Login"
          />
        </div>
        <Form name="login-form" initialValues={{ remember: true }}>
          <p className="form-title">Đăng nhập</p>
          <Form.Item name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Ghi nhớ mật khẩu</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/forgot">
              Quên mật khẩu?
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
