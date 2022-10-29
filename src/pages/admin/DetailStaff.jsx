import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./detailStaff.scss";
import { Layout, Descriptions, Button, Row, Col } from "antd";
import axios from "../../api/axios";
import { EditOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate, NavLink } from "react-router-dom";
const { Content, Sider, Header } = Layout;
const DetailStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const goBack = () => navigate("/home");
  const [user, setUser] = useState([]);
  const [roles, setRole] = useState();
  let cookie = localStorage.getItem("Cookie");
  let checkRole = localStorage.getItem("Role");
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
        setUser(res.data.body);
        setRole(role);
      });
  }, []);

  return (
    <div className="detail-staff">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
            <p className="header-title">Thông tin cá nhân</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <div className="basic-info" style={{ marginLeft: "5%" }}>
              <Row>
                <img
                  src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  style={{ width: "10%", marginBottom: "10px" }}
                  alt=""
                />
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Họ và tên: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>{user.full_name}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Tên đăng nhập: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>{user.user_name}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Giới tính: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>{user.gender}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Chức vụ: </p>
                </Col>
                <Col>
                  {roles === "ADMIN" ? (
                    <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>ADMIN</p>
                  ) : (
                    <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>Nhân viên</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Số điện thoại: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>{user.phone_number}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Địa chỉ: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>
                    {user.address_wards}, {user.address_district}, {user.address_city}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>Địa chỉ chi tiết: </p>
                </Col>

                <Col>
                  <p style={{ fontSize: "14px", padding: "3px 0 0 5px" }}>{user.address_more_detail}</p>
                </Col>
              </Row>
            </div>

            <div style={{ marginLeft: "3%" }}>
              {checkRole === "ROLE_ADMIN" ? (
                <Link to="/manage-admin">
                  <Button>Quay lại</Button>
                </Link>
              ) : (
                <Button onClick={goBack}>Quay lại</Button>
              )}
              <NavLink to={`/update-staff/${id}`}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{ margin: "20px 20px" }}
                  size="middle"
                  className="button-add"
                >
                  Sửa thông tin
                </Button>
              </NavLink>
            </div>
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

export default DetailStaff;
