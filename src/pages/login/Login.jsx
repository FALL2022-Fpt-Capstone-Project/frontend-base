import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Button, Col, Form, Input, notification, Row, Spin } from "antd";
import "antd/dist/antd.min.css";
import "./login.scss";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "../../api/axios";
const LOGIN_URL = "auth/login";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const [user_name, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const getUserName = async (id, cookie) => {
    await axios
      .get("manager/staff/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        window.localStorage.setItem("name", res.data.data?.full_name);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    const response = axios
      .post(LOGIN_URL, JSON.stringify({ user_name, password }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      })
      .then((res) => {
        const accessToken = res?.data?.data.token;
        const roles = res?.data?.data.roles;
        const id = res?.data?.data.account_id;
        const permission = res?.data?.data.permission;
        window.localStorage.setItem("Cookie", `${accessToken}`);
        window.localStorage.setItem("Role", `${roles}`);
        window.localStorage.setItem("id", `${id}`);
        window.localStorage.setItem("permission", `${permission}`);
        setAuth({ user_name, password, roles, accessToken, id, permission });
        setUser("");
        setPwd("");
        getUserName(id, accessToken);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          notification.error({
            message: "????ng nh???p th???t b???i",
            description: "T??n ????ng nh???p ho???c m???t kh???u kh??ng ch??nh x??c.",
            duration: 3,
            placement: "top",
          });
        } else if (err.response?.status === 401) {
          notification.error({
            message: "????ng nh???p th???t b???i",
            description: "B???n kh??ng c?? quy???n truy c???p.",
            duration: 3,
            placement: "top",
          });
        }
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div className="login-page">
      <Spin size="large" spinning={loading}>
        <div className="login-heading">
          <h1 className="login-title">Qu???n l?? chung c?? mini</h1>
        </div>
        <div className="login-box">
          <Row>
            <Col span={12} xs={24} sm={24} md={24} lg={12}>
              <Form
                name="login-form"
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={handleSubmit}
                style={{ marginTop: "4rem" }}
              >
                <p className="form-title">????ng nh???p</p>
                <Form.Item name="username" rules={[{ required: true, message: "Vui l??ng nh???p t??n ????ng nh???p!" }]}>
                  <Input placeholder="T??n ????ng nh???p" onChange={(e) => setUser(e.target.value)} value={user_name} />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: "Vui l??ng nh???p m???t kh???u!" }]}>
                  <Input.Password placeholder="M???t kh???u" onChange={(e) => setPwd(e.target.value)} value={password} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    ????NG NH???P
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={12} xs={0} sm={0} md={0} lg={12}>
              <div className="illustration-wrapper">
                <img
                  src="https://preview.redd.it/au30nopzypm41.jpg?auto=webp&s=f802cfa72ef59f9431e155df8c73a266de63feda"
                  alt="Login"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default Login;
