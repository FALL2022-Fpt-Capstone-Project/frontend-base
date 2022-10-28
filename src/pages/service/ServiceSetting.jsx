import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./serviceSetting.scss";
import { Button, Col, Form, Input, InputNumber, Layout, Row, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
function ServiceSetting(props) {
  const [componentSize, setComponentSize] = useState("default");
  const { Content, Sider, Header } = Layout;
  const APARTMENT_DATA_GROUP = "manager/group/get-group/1";
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [formEditSerivce] = Form.useForm();
  const { auth } = useAuth();
  useEffect(() => {
    apartmentGroup();
  }, []);
  let cookie = localStorage.getItem("Cookie");
  const apartmentGroup = async () => {
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataApartmentGroup(res.data.body.list_general_service);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(dataApartmentGroup);
  const onFinishEditService = (e) => {
    console.log(e);
  };
  const onFinishEditServiceFail = (e) => {
    console.log(e);
  };
  console.log(dataApartmentGroup);
  const listServiceType = dataApartmentGroup
    ?.map((obj, index) => obj?.service_type_name)
    ?.filter((service, i) => dataApartmentGroup?.map((obj, index) => obj?.service_type_name).indexOf(service) === i);

  return (
    <div className="service-setting">
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vh",
          overflow: "auto",
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p className="header-title">Thiết lập các dịch vụ</p>
          </Header>
          <Content style={{ margin: "10px 16px" }}>
            <div
              className="site-layout-background"
              style={{
                minHeight: 360,
                overflow: "auto",
              }}
            >
              <div style={{ overflow: "auto" }}>
                <Button htmlType="submit" style={{ float: "right" }} type="primary" form="edit-service">
                  Lưu
                </Button>
                <Button href="/service" type="default" style={{ marginRight: 5, float: "right" }}>
                  Quay lại
                </Button>
              </div>
              <Row>
                <Col span={16}>
                  <Form
                    form={formEditSerivce}
                    onFinish={onFinishEditService}
                    onFinishFailed={onFinishEditServiceFail}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 30 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    size={"default"}
                    id="edit-service"
                  >
                    {dataApartmentGroup.map((service, index) => (
                      <Row>
                        <Col span={8}>
                          <Form.Item
                            className="form-item"
                            name="service_show_name"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Tên dịch vụ: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tên dịch vụ",
                                whitespace: true,
                              },
                            ]}
                          >
                            <Input placeholder="Tên dịch vụ" style={{ width: "90%" }}></Input>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            className="form-item"
                            name="serivce_price"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Đơn giá (VND): </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá dịch vụ",
                              },
                            ]}
                          >
                            <InputNumber
                              defaultValue={0}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                              style={{ width: "90%" }}
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            className="form-item"
                            name="service_type_name"
                            labelCol={{ span: 24 }}
                            label={
                              <span>
                                <b>Cách tính giá dịch vụ: </b>
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn cách tính giá dịch vụ",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn cách tính giá dịch vụ"
                              optionFilterProp="children"
                              style={{ width: "90%" }}
                            >
                              <Select.Option value="">Tùy chọn</Select.Option>
                              {listServiceType.map((obj, index) => {
                                return <Select.Option value={obj}>{obj}</Select.Option>;
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </Form>
                  <Row>
                    <Col>
                      <PlusCircleOutlined style={{ fontSize: 30, marginBottom: 20, color: "#1890ff" }} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default ServiceSetting;
