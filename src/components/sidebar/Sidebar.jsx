import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  LogoutOutlined,
  DollarOutlined,
  SolutionOutlined,
  ProfileOutlined,
  HomeOutlined,
  UserOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  BulbOutlined,
  GoldOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { Button, Col, Menu, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { auth } = useAuth();
  let id = localStorage.getItem("id");
  let cookie = localStorage.getItem("Cookie");
  let role = localStorage.getItem("Role");
  useEffect(() => {
    axios
      .get(`manager/account/staff-account/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setUser(res.data.body);
      });
  }, []);
  return (
    <div>
      {role === "ROLE_ADMIN" ? (
        <Menu
          theme="dark"
          defaultSelectedKeys={[window.location.pathname]}
          // selectedKeys={[window.location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang chủ</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key="/building">
            <ApartmentOutlined />
            <span>Quản lý chung cư</span>
            <Link to="/building" />
          </Menu.Item>
          <Menu.Item key="/room">
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key="/equiment">
            <BulbOutlined />
            <span>Quản lý trang thiết bị</span>
            <Link to="/equiment" />
          </Menu.Item>
          <Menu.Item>
            <DollarOutlined />
            <span>Quản lý nguồn tiền</span>
          </Menu.Item>

          <Menu.Item>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key="/contract-apartment">
            <SolutionOutlined />
            <span>Quản lý hợp đồng chung cư</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key="/contract-renter">
            <SolutionOutlined />
            <span>Quản lý hợp đồng khách thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>
          <Menu.Item key="/manage-admin">
            <UserOutlined />
            <span>Quản lý nhân viên</span>
            <Link to="/manage-admin" />
          </Menu.Item>

          <Menu.Item key={`/detail-staff/${id}`}>
            <IdcardOutlined />
            <span onClick={showModal}>Thông tin cá nhân</span>
            {/* <Link to={`/detail-staff/${id}`} /> */}
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          theme="dark"
          defaultSelectedKeys={[window.location.pathname]}
          // selectedKeys={[window.location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/home">
            <DashboardOutlined />
            <span>Trang chủ</span>
            <Link to="/home" />
          </Menu.Item>
          <Menu.Item key="/room">
            <HomeOutlined />
            <span>Quản lý phòng</span>
            <Link to="/room" />
          </Menu.Item>
          <Menu.Item key="/equiment">
            <BulbOutlined />
            <span>Quản lý trang thiết bị</span>
            <Link to="/equiment" />
          </Menu.Item>

          <Menu.Item>
            <ProfileOutlined />
            <span>Quản lý hoá đơn</span>
          </Menu.Item>
          <Menu.Item key="/service">
            <GoldOutlined />
            <span>Dịch vụ</span>
            <Link to="/service" />
          </Menu.Item>
          <Menu.Item key="/contract-renter">
            <SolutionOutlined />
            <span>Quản lý hợp đồng khách thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>

          <Menu.Item key={`/detail-staff/${id}`}>
            <IdcardOutlined />
            <span onClick={showModal}>Thông tin cá nhân</span>
            {/* <Link to={`/detail-staff/${id}`} /> */}
          </Menu.Item>

          <Menu.Item key="/login" onClick={() => localStorage.clear()}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      )}
      <Modal title="Thông tin cá nhân" open={isModalOpen} footer={(null, null)} onCancel={handleCancel}>
        <div
          className="basic-info"
          style={{
            marginLeft: "3%",
          }}
        >
          <Row>
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              style={{ width: "100px", marginBottom: "10px" }}
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
              {role === "ROLE_ADMIN" ? (
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
          <Button onClick={handleCancel}>Quay lại</Button>
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
      </Modal>
    </div>
  );
};

export default Sidebar;
