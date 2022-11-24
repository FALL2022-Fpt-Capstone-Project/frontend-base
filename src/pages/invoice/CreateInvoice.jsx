import { Form, Input, Card, Radio, Select, notification, Button, Modal, DatePicker, Col, Row, InputNumber } from "antd";
import dayjs from "dayjs";
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
  return (
    <>
      <Modal
        title={<h2>Tạo hoá đơn cho phòng 101, trọ xanh</h2>}
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
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="createInvoice" type="primary">
            Tạo mới
          </Button>,
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
                placeholder="Nhập số lượng người tối đa của phòng"
                onChange={monthChange}
              />
            </Form.Item>
            <Row>
              <Col span={24}>
                <p>
                  <i>
                    <p>
                      <span>{room_month} tháng</span>, <span>{room_day} ngày</span> x 3,000,000
                    </p>
                    <p>{price_format}</p>
                  </i>
                </p>
              </Col>
            </Row>
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
                placeholder="Nhập số lượng người tối đa của phòng"
                onChange={dayChange}
              />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="phone_number"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Số điện thoại: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                  whitespace: true,
                },
                {
                  pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" style={{ width: "100%" }} autoComplete="off" />
            </Form.Item>

            {/* <Form.Item
            className="form-item"
            name="gender"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Giới tính:</b>
              </span>
            }
          >
            <Radio.Group onChange={genderChange} defaultValue={true}>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item> */}
            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Địa chỉ: </b>
                </span>
              }
            >
              <Input autoComplete="off" placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default CreateInvoice;
