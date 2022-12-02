import {
  Form,
  Input,
  Card,
  Radio,
  Checkbox,
  notification,
  Button,
  Modal,
  DatePicker,
  Col,
  Row,
  InputNumber,
} from "antd";
import "./invoice.scss";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const CreateInvoice = ({ visible, close }) => {
  const [room_month, setRoomMonth] = useState(1);
  const [room_day, setRoomDay] = useState(0);
  // const [room_price, setRoomPrice] = useState();
  const dateFormat = "DD-MM-YYYY";
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const reload = () => window.location.reload();

  let day = moment().date();
  let month = moment().month();
  let year = moment().year();

  let date_create = `${day}-${month + 1}-${year}`;
  let date_term = `${day + 1}-${month + 1}-${year}`;
  let date_create_format = moment(date_create, "DD-MM-YYYY");
  let date_term_format = moment(date_term, "DD-MM-YYYY");
  console.log(date_create_format);
  const initValues = {
    date_create_invoice: date_create_format,
    payment_term: date_term_format,
  };

  const monthChange = (value) => {
    setRoomMonth(value);
  };
  const dayChange = (value) => {
    setRoomDay(value);
  };
  let price = 3000000 * room_month + (3000000 / 30) * room_day;
  console.log(price.toLocaleString("vn") + " đ");
  let price_format = price.toLocaleString("vn") + " đ";

  const service = [
    {
      service_name: "Dịch vụ điện",
      service_price: 1700,
      current: 100,
      new: 200,
    },
    {
      service_name: "Dịch vụ nước",
      service_price: 1700,
      current: 100,
      new: 200,
    },
    // {
    //   service_name: "Dịch vụ xe",
    //   service_price: 1700,
    //   service_type: "Người"
    // },
  ];

  return (
    <>
      <Modal
        title={<h2>Tạo hoá đơn cho phòng 101, Trọ xanh</h2>}
        open={visible}
        destroyOnClose={true}
        afterClose={() => form.resetFields()}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <>
            <Row>
              <Col span={12} style={{ marginLeft: "-100px" }}>
                <p>Tổng cộng hoá đơn:</p>
                <p className="total_price">3,000,000 đ</p>
              </Col>
              <Col span={12} style={{ marginLeft: "100px" }}>
                <Button
                  key="back"
                  onClick={() => {
                    close(false);
                  }}
                >
                  Đóng
                </Button>

                <Button htmlType="submit" key="submit" form="createInvoice" type="primary">
                  Tạo mới
                </Button>
              </Col>
            </Row>
          </>,
        ]}
      >
        <Form
          form={form}
          // onFinish={handleCreateEmployee}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createInvoice"
          initialValues={initValues}
        >
          <Card className="card">
            <Row>
              <Col span={12}>
                <Form.Item
                  className="form-item"
                  name="date_create_invoice"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Ngày tạo hoá đơn:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày tạo hoá đơn!",
                    },
                  ]}
                >
                  <DatePicker value={date_create_format} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className="form-item"
                  name="payment_term"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Hạn đóng tiền:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hạn đóng tiền!",
                    },
                  ]}
                >
                  <DatePicker value={date_term_format} />
                </Form.Item>
              </Col>
            </Row>
            <span>
              <b>Tiền thuê phòng:</b>
            </span>
            <Row>
              <Col span={24}>
                <p>
                  <i>
                    <p className="description">
                      <span>Nhập số tháng và số ngày lẻ (nếu có). </span>
                      <span>Ví dụ hóa đơn cho 1 tháng rưỡi -> nhập 1 tháng, 15 ngày.</span>
                    </p>
                  </i>
                </p>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  className="form-item"
                  name="room_month"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số tháng:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tháng"
                    onChange={monthChange}
                    defaultValue={1}
                    min={0}
                    max={12}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className="form-item"
                  name="room_day"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số ngày lẻ:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số ngày lẻ"
                    onChange={dayChange}
                    defaultValue={0}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Card className="card card-price">
              <Row>
                <Col span={13}>
                  <p>Tính tiền phòng</p>
                </Col>
                <Col span={7} offset={4}>
                  <p>Thành tiền</p>
                </Col>
              </Row>
              <Row>
                <Col span={13}>
                  <b>
                    <span>{room_month} tháng</span>, <span>{room_day} ngày</span> x 3,000,000 đ
                  </b>
                </Col>
                <Col span={7} offset={4}>
                  <b>{price_format}</b>
                </Col>
              </Row>
            </Card>
            <span>
              <b>Tiền dịch vụ:</b>
            </span>
            <Row>
              <Col span={24}>
                <p className="description">
                  <span>Tiền dịch vụ khách thuê sử dụng</span>
                </p>
              </Col>
            </Row>
            <Form.Item className="form-item" name="phone_number" labelCol={{ span: 24 }}>
              {service?.map((obj, idx) => {
                return (
                  <Checkbox.Group>
                    <Card className="card card-service">
                      <Checkbox>
                        <Row>
                          <Col span={10}>
                            <b>{obj.service_name}</b>
                          </Col>
                          <Col span={10} offset={4}>
                            <InputNumber defaultValue={obj.current} addonAfter="Số cũ" />
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Giá: </span>
                            <b>{obj.service_price}</b>
                          </Col>
                          <Col span={10} offset={4} style={{ marginTop: "5px" }}>
                            <InputNumber defaultValue={obj.new} addonAfter="Số mới" />
                          </Col>
                        </Row>
                      </Checkbox>
                    </Card>
                  </Checkbox.Group>
                );
              })}
            </Form.Item>
            <Card className="card card-price">
              <Row>
                <Col span={13}>
                  <p>Tính tiền dịch vụ</p>
                </Col>
                <Col span={7} offset={4}>
                  <p>Thành tiền</p>
                </Col>
              </Row>
              <Row>
                <Col span={13}>
                  <b>2 dịch vụ</b>
                </Col>
                <Col span={7} offset={4}>
                  <b>340,000 đ</b>
                </Col>
              </Row>
            </Card>
            <span>
              <b>Cộng thêm / Giảm trừ:</b>
            </span>
            <Row>
              <Col span={24}>
                <p className="description">
                  <span>Thường dành cho các trường hợp đặc biệt. Ví dụ cộng thêm ngày tết, giảm trừ covid...</span>
                </p>
              </Col>
            </Row>
            <Radio.Group defaultValue={1}>
              <Radio value={1} className="radio-add">
                Cộng thêm
              </Radio>
              <Radio value={2} className="radio-add">
                Giảm trừ
              </Radio>
            </Radio.Group>

            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Số tiền: </b>
                </span>
              }
            >
              <InputNumber style={{ width: "100%" }} controls={false} placeholder="Nhập số tiền" />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Lý do: </b>
                </span>
              }
            >
              <Input autoComplete="off" placeholder="Nhập lý do" />
            </Form.Item>
            <Card className="card card-price">
              <Row>
                <Col span={13}>
                  <p>Cộng thêm</p>
                </Col>
                <Col span={7} offset={4}>
                  <p>Thành tiền</p>
                </Col>
              </Row>
              <Row>
                <Col span={13}>
                  <p>Lý do:</p>
                </Col>
                <Col span={7} offset={4}>
                  <b>0 đ</b>
                </Col>
              </Row>
            </Card>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default CreateInvoice;
