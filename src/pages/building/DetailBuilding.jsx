import { Button, Card, Col, Divider, Modal, Row, Table, Tag } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import "./building.scss";
function DetailBuilding({ visible, close, data }) {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Modal
        title={<h2>Chi tiết chung cư</h2>}
        open={visible}
        width={1300}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} xl={8} span={8}>
            <Row style={{ width: "400px" }}>
              <Card
                title={
                  <>
                    <p> Thông tin {data?.group_name} </p>
                  </>
                }
                className="card card-left"
              >
                <Row>
                  <Col span={12}>
                    <p>
                      <b>Số lượng tầng:</b>{" "}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>{data?.total_floor}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p>
                      <b>Số lượng phòng:</b>{" "}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>{data?.total_room}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={5}>
                    <p>
                      <b>Địa chỉ:</b>{" "}
                    </p>
                  </Col>
                  <Col span={19}>
                    <p>{data?.address?.address_more_details}</p>
                  </Col>
                </Row>
              </Card>
            </Row>
            <Row style={{ width: "400px", marginTop: "30px" }}>
              <Card title={<p> Dịch vụ chung cư </p>} className="card card-left">
                <Row>
                  <Col span={8}>
                    <p>
                      <b>Tên dịch vụ</b>{" "}
                    </p>
                  </Col>
                  <Col span={8}>
                    <p>
                      <b>Giá</b>{" "}
                    </p>
                  </Col>
                  <Col span={8}>
                    <b>Cách tính</b>{" "}
                  </Col>
                </Row>
                {data?.list_general_service?.map((obj, idx) => {
                  return (
                    <>
                      <Row>
                        <Col span={8}>
                          <p>{obj.service_show_name}</p>
                        </Col>
                        <Col span={5}>
                          <p>{obj.service_price.toLocaleString("vn") + " đ"}</p>
                        </Col>
                        <Col span={11}>{obj.service_type_name}</Col>
                      </Row>
                    </>
                  );
                })}
              </Card>
            </Row>
          </Col>
          <Col xs={24} xl={16} span={16}>
            <Card
              title={
                <>
                  <p> Thông tin phòng </p>
                </>
              }
              className="card"
            >
              <Table
                bordered
                dataSource={data?.list_rooms}
                columns={[
                  {
                    title: "Tên phòng",
                    dataIndex: "room_name",
                  },
                  {
                    title: "Tầng",
                    dataIndex: "room_floor",
                  },
                  {
                    title: "Số người ở tối đa",
                    dataIndex: "room_limit_people",
                  },

                  {
                    title: "Diện tích phòng",
                    dataIndex: "room_area",
                    render: (value) => {
                      return value + " m2";
                    },
                  },
                  {
                    title: "Tiền phòng",
                    dataIndex: "room_price",
                    render: (value) => {
                      return value.toLocaleString("vn") + " đ";
                    },
                  },
                  {
                    title: "Số điện",
                    dataIndex: "room_current_electric_index",
                    render: (_, record) => {
                      let current_electric;
                      if (record.room_current_electric_index === null) {
                        current_electric = <p>0</p>;
                      } else {
                        current_electric = <p>{record.room_current_electric_index}</p>;
                      }
                      return <>{current_electric}</>;
                    },
                  },
                  {
                    title: "Số nước",
                    dataIndex: "room_current_water_index",
                    render: (_, record) => {
                      let current_water;
                      if (record.room_current_water_index === null) {
                        current_water = <p>0</p>;
                      } else {
                        current_water = <p>{record.room_current_water_index}</p>;
                      }
                      return <>{current_water}</>;
                    },
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "group_contract_id",
                    render: (_, record) => {
                      let contract;
                      if (record.group_contract_id === null) {
                        contract = (
                          <Tag color="default" key={record.status}>
                            Chưa được thuê
                          </Tag>
                        );
                      } else {
                        contract = (
                          <Tag color="green" key={record.status}>
                            Đã được thuê
                          </Tag>
                        );
                      }

                      return <>{contract}</>;
                    },
                  },
                ]}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default DetailBuilding;
