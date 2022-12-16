import { Form, Card, notification, Button, Modal, DatePicker, Col, Row, InputNumber } from "antd";
import "./invoice.scss";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const CreatePayment = ({ visible }) => {
  const [dateCreate, setDateCreate] = useState();
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");

  let day = moment().date();
  let month = moment().month();
  let year = moment().year();

  let date_create = `${year}-${month + 1}-${day}`;
  let date_create_format = moment(date_create, "YYYY-MM-DD");
  const initValues = {
    date_create_invoice: date_create_format,
  };
  useEffect(() => {
    setDateCreate(date_create);
  }, [date_create]);
  const dateCreateChange = (date, dateString) => {
    setDateCreate(dateString);
  };
  const disabledDate = (current) => {
    return current && current < date_create_format;
  };
  return (
    <>
      <Modal
        title={<h2>Tạo hoá đơn chi cho</h2>}
        open={visible}
        // destroyOnClose={true}
        // afterClose={() => form.resetFields()}
        // onOk={() => {
        //   close(false);
        // }}
        // onCancel={() => {
        //   close(false);
        // }}
        footer={[
          <>
            <Row>
              <Col span={12} style={{ marginLeft: "-100px" }}>
                <p>Tổng cộng hoá đơn:</p>
                {/* <p className="total_price">3000000.toLocaleString("vn") + " đ"</p> */}
                <p className="total_price">300,000,000 đ</p>
              </Col>
              <Col span={12} style={{ marginLeft: "100px" }}>
                <Button
                  key="back"
                  onClick={() => {
                    // close(false);
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
          // onFinish={handleCreateInvoice}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createInvoice"
          initialValues={initValues}
          scrollToFirstError
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
                  <DatePicker
                    onChange={dateCreateChange}
                    value={date_create_format}
                    placeholder="Nhập ngày tạo hoá đơn"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="room_month"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tổng tiền thuê chung cư:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền thuê chung cư"
                    // onChange={monthChange}
                    defaultValue={10000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="room_month"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tổng tiền dịch vụ:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền dịch vụ"
                    // onChange={monthChange}
                    defaultValue={1000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="room_month"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số tiền khác:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền khác"
                    // onChange={monthChange}
                    defaultValue={2000000}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePayment;