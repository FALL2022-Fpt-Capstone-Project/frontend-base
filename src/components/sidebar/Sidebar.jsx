import "antd/dist/antd.min.css";
import {
  DashboardOutlined,
  LogoutOutlined,
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
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button, Card, Col, Menu, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import axios from "../../api/axios";
import UpdateStaff from "../../pages/admin/UpdateStaff";
const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [contractRenterLink, setContractRenterLink] = useState("/contract-renter");
  const [contractApartmentLink, setContractApartmentLink] = useState("/contract-apartment");
  const [updateStaff, setUpdateStaff] = useState(false);
  const onClickUpdateStaff = (id) => {
    setUpdateStaff(true);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/contract-renter/create") || location.pathname.includes("/contract-renter/edit")) {
      setContractRenterLink("/contract-renter/create");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/contract-renter/edit")) {
      setContractRenterLink(location.pathname);
    }
  }, [location.pathname]);
  console.log(location.pathname.includes("/contract-renter/edit"));
  useEffect(() => {
    if (location.pathname.includes("/contract-apartment/create")) {
      setContractApartmentLink("/contract-apartment/create");
    }
  }, [location.pathname]);

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
          <Menu.Item key={contractApartmentLink}>
            <SolutionOutlined />
            <span>Quản lý hợp đồng đi thuê</span>
            <Link to="/contract-apartment" />
          </Menu.Item>
          <Menu.Item key={contractRenterLink}>
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
          <Menu.Item key={contractRenterLink}>
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
        title={<h2>Thông tin cá nhân</h2>}
        className="modalStyle"
        open={isModalOpen}
        onCancel={handleCancel}
        width="500px"
        footer={[
          <>
            <Button onClick={handleCancel}>Quay lại</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ margin: "20px 20px" }}
              size="middle"
              className="button-add"
              onClick={() => onClickUpdateStaff(id)}
            >
              Sửa thông tin
            </Button>
          </>,
        ]}
      >
        <div
          className="basic-info"
          style={{
            marginLeft: "3%",
          }}
        >
          <Card className="card">
            <Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Họ và tên: </h4>
                </Col>
                <Col span={14}>
                  <p>{user.full_name}</p>
                </Col>
              </Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Tên đăng nhập:</h4>
                </Col>

                <Col span={14}>
                  <p>{user.user_name}</p>
                </Col>
              </Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Giới tính: </h4>
                </Col>

                <Col span={14}>{user.gender ? <p>Nam</p> : <p>Nữ</p>}</Col>
              </Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Chức vụ: </h4>
                </Col>
                <Col span={14}>{role === "ROLE_ADMIN" ? <p>ADMIN</p> : <p>Nhân viên</p>}</Col>
              </Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Số điện thoại:</h4>
                </Col>

                <Col span={14}>
                  <p>{user.phone_number}</p>
                </Col>
              </Row>
              <Row className="detail-row">
                <Col span={10}>
                  <h4>Địa chỉ chi tiết:</h4>
                </Col>

                <Col span={14}>
                  <p>{user.address_more_detail}</p>
                </Col>
              </Row>
            </Row>
          </Card>
        </div>
      </Modal>
      <UpdateStaff visible={updateStaff} close={setUpdateStaff} id={id} />
    </div>
  );
};

export default Sidebar;
