import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "antd/dist/antd.min.css";
import "./login.scss";

const Login = () => {
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    let result = await fetch("https://rms-staging-env.herokuapp.com/api/auth/signin", {
      method: "post",
      body: JSON.stringify({ user_name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.warn(result);
  };
  console.log(user_name);

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="https://preview.redd.it/au30nopzypm41.jpg?auto=webp&s=f802cfa72ef59f9431e155df8c73a266de63feda"
            alt="Login"
          />
        </div>
        <Form name="login-form" initialValues={{ remember: true }} onFinish={handleLogin}>
          <p className="form-title">Đăng nhập</p>
          <Form.Item name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
            <Input placeholder="Số điện thoại" onChange={(e) => setUser_name(e.target.value)} value={user_name} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} value={password} />
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
