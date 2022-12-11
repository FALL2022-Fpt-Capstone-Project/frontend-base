import React, { useEffect, useState } from "react";
import "./detailStaff.scss";
import { Modal, Button, Row, Col, Card } from "antd";
import axios from "../../api/axios";
import { EditOutlined } from "@ant-design/icons";
import UpdateStaff from "./UpdateStaff";
const DetailStaff = ({ visible, close, id }) => {
  const [user, setUser] = useState([]);
  const [updateStaff, setUpdateStaff] = useState(false);
  const onClickUpdateStaff = (id) => {
    setUpdateStaff(true);
  };
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    if (visible) {
      axios
        .get(`manager/staff/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id, cookie, visible]);

  return (
    <>
      <Modal
        title={<h2>Thông tin cá nhân</h2>}
        className="modalStyle"
        open={visible}
        width="500px"
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <>
            <Button
              key="back"
              onClick={() => {
                close(false);
              }}
            >
              Đóng
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ margin: "20px 20px" }}
              size="middle"
              className="button-add"
              onClick={() => {
                onClickUpdateStaff(id);
                close(false);
              }}
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
                <Col span={14}>{user.role_name === "ROLE_ADMIN" ? <p>ADMIN</p> : <p>Nhân viên</p>}</Col>
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
    </>
  );
};

export default DetailStaff;
