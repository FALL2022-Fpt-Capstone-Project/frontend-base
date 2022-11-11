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
      .get(`manager/staff/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
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
            <span>Quản lý hợp đồng đi thuê</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key="/contract-renter">
            <SolutionOutlined />
            <span>Quản lý hợp đồng cho thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>
          <Menu.Item key="/manage-staff">
            <UserOutlined />
            <span>Quản lý nhân viên</span>
            <Link to="/manage-staff" />
          </Menu.Item>

          <Menu.Item key={`/manage-staff/detail-staff/${id}`}>
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
            <span>Quản lý hợp đồng cho thuê</span>
            <Link to="/contract-renter" />
          </Menu.Item>

          <Menu.Item key={`/manage-staff/detail-staff/${id}`}>
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
      <Modal
        title="Thông tin cá nhân"
        className="modalStyle"
        open={isModalOpen}
        footer={(null, null)}
        onCancel={handleCancel}
        width="700px"
      >
        <div
          className="basic-info"
          style={{
            marginLeft: "3%",
          }}
        >
          <Row>
            <Col span={12}>
              <img
                src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                style={{ width: "150px" }}
                alt=""
              />
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Họ và tên: </p>
                </Col>
                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.full_name}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Tên đăng nhập:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.user_name}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Giới tính: </p>
                </Col>

                <Col span={12}>
                  {user.gender ? (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nam</p>
                  ) : (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nữ</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Chức vụ: </p>
                </Col>
                <Col span={12}>
                  {role === "ROLE_ADMIN" ? (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>ADMIN</p>
                  ) : (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nhân viên</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Số điện thoại:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.phone_number}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Địa chỉ chi tiết:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.address_more_detail}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{ marginLeft: "3%" }}>
          <Button onClick={handleCancel}>Quay lại</Button>
          <NavLink to={`/manage-staff/update-staff/${id}`}>
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
