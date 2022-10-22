import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./detailStaff.scss";
import { Layout, Descriptions, Button } from "antd";
import axios from "../../api/axios";
import { Link, useParams } from "react-router-dom";
const { Content, Sider, Header } = Layout;
const DetailStaff = () => {
  const { id } = useParams();

  const [user, setUser] = useState([]);
  const [roles, setRole] = useState();
  const [permission, setPermission] = useState([]);
  let cookie = localStorage.getItem("Cookie");
  let permissionfinal = [];
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
        setPermission(res.data.body.permission);
      });
  }, []);
  permission.map((permission) => {
    if (permission === 1) {
      let permissionChange = "Quản lý cơ sở vật chất,";
      permissionfinal.push(permissionChange);
    }
    if (permission === 2) {
      let permissionChange = " Quản lý nguồn tiền,";
      permissionfinal.push(permissionChange);
    }
    if (permission === 3) {
      let permissionChange = " Quản lý hoá đơn,";
      permissionfinal.push(permissionChange);
    }
    if (permission === 4) {
      let permissionChange = " Quản lý hợp đồng";
      permissionfinal.push(permissionChange);
    }
    if (permission === 5 && user.role[0] === "ADMIN") {
      let permissionChange = ", Quản lý nhân viên";
      permissionfinal.push(permissionChange);
    }
  });
  return (
    <div className="detail-staff">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250}>
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
            <Descriptions title="Thông tin cơ bản">
              <Descriptions.Item label="Họ và tên">{user.full_name}</Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">{user.user_name}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{user.gender}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{roles}</Descriptions.Item>
              <Descriptions.Item label="Quyền hạn">{permissionfinal}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Thông tin liên hệ">
              <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{user.address_more_detail}</Descriptions.Item>
            </Descriptions>
            <Link to="/manage-admin">
              <Button htmlType="submit" type="primary">
                Quay lại
              </Button>
            </Link>
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
