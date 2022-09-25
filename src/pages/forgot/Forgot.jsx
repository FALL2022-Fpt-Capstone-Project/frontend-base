import React from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "antd/dist/antd.min.css";
import "./forgot.scss";

const Forgot = () => {
  return (
    <div className="forgot">
      <div className="form">
        <h1 className="forgot-title">Quên mật khẩu</h1>
        <Form name="normal_login" className="forgotpassword-form" initialValues={{ remember: true }}>
          <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <p className="description">Vui lòng nhập email đã đăng ký, sau đó nhấn chọn gửi. Hệ thống sẽ gửi đến email của bạn mật khẩu mới.</p>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="forgotpassword-form-button">
              Gửi
            </Button>
          </Form.Item>
          <a className="return-login" href="/login">Quay về đăng nhập</a>
        </Form>
      </div>
    </div>
  );
};

export default Forgot;