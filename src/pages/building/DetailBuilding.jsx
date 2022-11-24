import { Button, Card, Col, Divider, Modal, Row, Table, Tag } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import "./building.scss";
const DetailBuilding = ({ visible, close, id }) => {
  const [group_name, setGroupName] = useState();
  const [total_room, setTotalRoom] = useState();
  const [total_floor, setTotalFloor] = useState();
  const [service, setService] = useState();
  const [address_more_details, setAddress] = useState();
  const [dataSource, setDataSource] = useState();
  const [loading, setLoading] = useState(false);
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`manager/group/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        console.log(res);
        setGroupName(res.data.data.group_name);
        setTotalRoom(res.data.data.total_room);
        setTotalFloor(res.data.data.total_floor);
        setService(res.data.data.list_general_service);
        setAddress(res.data.data.address.address_more_details);
        setDataSource(res.data.data.list_rooms);
        setLoading(false);
      });
  }, [id]);
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
                    <Tag color="blue" className="text-tag">
                      <h3>
                        <HomeOutlined className="icon-size" />
                        <span className="font-size-tag">
                          <b> Thông tin {group_name} </b>
                        </span>
                      </h3>
                    </Tag>
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
                    <p>{total_floor}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <p>
                      <b>Số lượng phòng:</b>{" "}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>{total_room}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={5}>
                    <p>
                      <b>Địa chỉ:</b>{" "}
                    </p>
                  </Col>
                  <Col span={19}>
                    <p>{address_more_details}</p>
                  </Col>
                </Row>
              </Card>
            </Row>
            <Row style={{ width: "400px", marginTop: "30px" }}>
              <Card
                title={
                  <>
                    <Tag color="blue" className="text-tag">
                      <h3>
                        <span className="font-size-tag">
                          <b> Dịch vụ chung cư </b>
                        </span>
                      </h3>
                    </Tag>
                  </>
                }
                className="card card-left"
              >
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
                {service?.map((obj, idx) => {
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
                  <Tag color="blue" className="text-tag">
                    <h3>
                      <span className="font-size-tag">
                        <b> Thông tin phòng </b>
                      </span>
                    </h3>
                  </Tag>
                </>
              }
              className="card"
            >
              <Table
                bordered
                dataSource={dataSource}
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
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default DetailBuilding;
