import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Button, Checkbox, Form, Input, notification } from "antd";
import "antd/dist/antd.min.css";
import "./login.scss";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "../../api/axios";
const LOGIN_URL = "auth/signin";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  // console.log(location);

  const [user_name, setUser] = useState("");
  const [password, setPwd] = useState("");

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ user_name, password }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      });
      console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response?.status.code));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.body.token;
      const roles = response?.data?.body.role;
      window.localStorage.setItem("Cookie", `${accessToken}`);
      window.localStorage.setItem("Role", `${roles}`);
      setAuth({ user_name, password, roles, accessToken });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 500) {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Vui lòng kiểm tra lại thông tin đăng nhập.",
          duration: 3,
        });
      } else if (err.response?.status === 401) {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Vui lòng kiểm tra lại thông tin đăng nhập.",
          duration: 3,
        });
      }
      // errRef.current.focus();
    }
  };
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="https://preview.redd.it/au30nopzypm41.jpg?auto=webp&s=f802cfa72ef59f9431e155df8c73a266de63feda"
            alt="Login"
          />
        </div>
        <Form name="login-form" initialValues={{ remember: true }} autoComplete="off" onFinish={handleSubmit}>
          <p className="form-title">Đăng nhập</p>
          <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập username!" }]}>
            <Input placeholder="Username" onChange={(e) => setUser(e.target.value)} value={user_name} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password placeholder="Mật khẩu" onChange={(e) => setPwd(e.target.value)} value={password} />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember">
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
