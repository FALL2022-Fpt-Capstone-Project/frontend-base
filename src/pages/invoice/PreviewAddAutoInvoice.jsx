import { Button, Card, Col, DatePicker, Form, Modal, notification, Row, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./invoice.scss";
import moment from "moment";
import axios from "../../api/axios";
const ADD_INVOICE_URL = "manager/bill/room/create";

const PreviewAddAutoInvoice = ({ visible, close, state }) => {
  const navigate = useNavigate();

  const [paymentTerm, setPaymentTerm] = useState(state?.paymentTerm);
  const [dateCreate, setDateCreate] = useState(state?.dateCreate);

  console.log(state);
  let listInvoiceGenerate;
  if (state !== undefined) {
    listInvoiceGenerate = state.selectedRows?.map((obj, index) => {
      return { ...obj, key: index };
    })?.map(record => {
      let waterPrice = 0;
      let elecPrice = 0;
      let cleanPrice = 0;
      let vehiclesPrice = 0;
      let internetPrice = 0;
      let total = 0;

      if (
        record.list_general_service.some(
          (water) => water?.service_name === "water" && water.service_type_name === "Đồng hồ điện/nước"
        )
      ) {
        waterPrice =
          record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Đồng hồ điện/nước"
          )?.service_price *
          (record.room_current_water_index - record.room_old_water_index);
      } else if (
        record.list_general_service.some(
          (water) => water?.service_name === "water" && water.service_type_name === "Người"
        )
      ) {
        waterPrice =
          record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Người"
          )?.service_price * record.total_renter;
      } else if (
        record.list_general_service.some(
          (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
        )
      ) {
        waterPrice = record.list_general_service.find(
          (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
        )?.service_price;
      }
      if (
        record.list_general_service.find(
          (elec) => elec?.service_name === "electric" && elec.service_type_name === "Đồng hồ điện/nước"
        )
      ) {
        elecPrice =
          record.list_general_service.find(
            (elec) => elec?.service_name === "electric" && elec.service_type_name === "Đồng hồ điện/nước"
          )?.service_price *
          (record.room_current_electric_index - record.room_old_electric_index);
      }

      if (
        record.list_general_service.some(
          (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
        )
      ) {
        internetPrice = record.list_general_service.find(
          (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
        )?.service_price;
      } else if (
        record.list_general_service.some(
          (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
        )
      ) {
        internetPrice =
          record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
          )?.service_price * record.total_renter;
      }

      if (
        record.list_general_service.some(
          (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
        )
      ) {
        vehiclesPrice = record.list_general_service.find(
          (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
        )?.service_price;
      } else if (
        record.list_general_service.some(
          (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
        )
      ) {
        vehiclesPrice =
          record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
          )?.service_price * record.total_renter;
      }
      if (
        record.list_general_service.some(
          (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
        )
      ) {
        cleanPrice = record.list_general_service.find(
          (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
        )?.service_price;
      } else if (
        record.list_general_service.some(
          (vehicles) => vehicles?.service_name === "cleaning" && vehicles.service_type_name === "Người"
        )
      ) {
        cleanPrice =
          record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
          )?.service_price * record.total_renter;
      }

      total = waterPrice + elecPrice + cleanPrice + vehiclesPrice + internetPrice + record.room_price;
      return { ...record, total_money: total };
    });
  }
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  let date_create_format = moment(state?.dateCreate, "YYYY-MM-DD");
  let payment_term_format = moment(state?.paymentTerm, "YYYY-MM-DD");

  const initValues = {
    date_create_invoice: date_create_format,
    payment_term: payment_term_format,
  };

  const dateCreateChange = (date, dateString) => {
    setDateCreate(dateString);
  };
  const paymentTermChange = (date, dateString) => {
    setPaymentTerm(dateString);
  };
  const disabledDate = (current) => {
    return current && current < date_create_format;
  };
  const columnsNotBilled = [
    {
      title: "Tên phòng",
      dataIndex: "room_name",
    },
    {
      title: "Tầng",
      dataIndex: "room_floor",
    },
    {
      title: "Tiền phòng",
      dataIndex: "room_price",
    },

    {
      title: "Số điện cũ",
      dataIndex: "room_old_electric_index",
    },
    {
      title: "Số điện mới",
      dataIndex: "room_current_electric_index",
    },
    {
      title: "Số nước cũ",
      dataIndex: "room_old_water_index",
    },
    {
      title: "Số nước mới",
      dataIndex: "room_current_water_index",
    },
    {
      title: "Tổng cộng",
      dataIndex: "total_money",
      width: "11%",
      render: (record) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record)
      }
    },
  ];

  const handleCreateInvoice = async (value) => {
    let listPreview = value.items.map((obj) => {
      return {
        room_id: obj.room_id,
        room_price: obj.room_price,
        bill_cycle: obj.bill_cycle,
        list_general_service: obj.list_general_service,
        service_bill: obj.list_general_service.map((service) => {
          return {
            service_id: service.service_id,
            service_type: service.service_type_id,
            service_price: service.service_price,
            service_index:
              service.service_name === "electric"
                ? service.service_type_name === "Đồng hồ điện/nước"
                  ? obj.room_current_electric_index - obj.room_old_electric_index
                  : service.service_type_name === "Tháng"
                    ? 1
                    : obj.total_renter
                : service.service_name === "water"
                  ? service.service_type_name === "Đồng hồ điện/nước"
                    ? obj.room_current_water_index - obj.room_old_water_index
                    : service.service_type_name === "Tháng"
                      ? 1
                      : obj.total_renter
                  : service.service_name === "internet"
                    ? service.service_type_name === "Đồng hồ điện/nước"
                      ? 1
                      : service.service_type_name === "Tháng"
                        ? 1
                        : obj.total_renter
                    : service.service_type_name === "Đồng hồ điện/nước"
                      ? 1
                      : service.service_type_name === "Tháng"
                        ? 1
                        : obj.total_renter,
            service_total_money:
              service.service_name === "electric"
                ? service.service_type_name === "Đồng hồ điện/nước"
                  ? (obj.room_current_electric_index - obj.room_old_electric_index) * service.service_price
                  : service.service_type_name === "Tháng"
                    ? service.service_price
                    : obj.total_renter * service.service_price
                : service.service_name === "water"
                  ? service.service_type_name === "Đồng hồ điện/nước"
                    ? (obj.room_current_water_index - obj.room_old_water_index) * service.service_price
                    : service.service_type_name === "Tháng"
                      ? service.service_price
                      : obj.total_renter * service.service_price
                  : service.service_name === "internet"
                    ? service.service_type_name === "Đồng hồ điện/nước"
                      ? service.service_price
                      : service.service_type_name === "Tháng"
                        ? service.service_price
                        : obj.total_renter * service.service_price
                    : service.service_type_name === "Đồng hồ điện/nước"
                      ? service.service_price
                      : service.service_type_name === "Tháng"
                        ? service.service_price
                        : obj.total_renter * service.service_price,
          };
        }),
      };
    });
    let finalListPreview = listPreview.map((obj, idx) => {
      return {
        payment_term: paymentTerm,
        created_time: dateCreate,
        room_id: obj.room_id,
        total_room_money: obj.room_price * obj.bill_cycle,
        total_service_money: obj.service_bill.reduce(function (acc, obj) {
          return acc + obj.service_total_money;
        }, 0),
        service_bill: obj.service_bill,
      };
    });
    const response = await axios
      .post(ADD_INVOICE_URL, finalListPreview, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Thêm mới hoá đơn thành công",
          duration: 3,
          placement: "top",
        });
        setTimeout(() => {
          navigate("/invoice");
        }, 1000);
        console.log(res);
      })
      .catch((e) => {
        notification.error({
          message: "Thêm mới hoá đơn thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
        });
        console.log(e);
      });
    console.log(JSON.stringify(response?.data));
    console.log(listPreview);
    console.log(finalListPreview);
  };
  form.setFieldsValue({ items: listInvoiceGenerate });
  return (
    <>
      <Modal
        title={<h2>Xem trước tạo mới nhanh hoá đơn</h2>}
        open={visible}
        destroyOnClose={true}
        afterClose={() => form.resetFields()}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        width={"auto"}
        footer={[
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
          <Button
            className="btn-add-invoice"
            htmlType="submit"
            key="submit"
            form="createInvoice"
            type="primary"
            size="middle"
          >
            Tạo mới hoá đơn
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateInvoice}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createInvoice"
          initialValues={initValues}
        >
          <Card className="card">
            <Row>
              <Col lg={4} xs={24}>
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
              <Col lg={4} xs={24}>
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
                  <DatePicker
                    placeholder="Nhập hạn đóng tiền"
                    onChange={paymentTermChange}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24}>
                <p className="auto-description">
                  Bạn đã lựa chọn <b>{listInvoiceGenerate?.length}</b> phòng để tạo mới nhanh hoá đơn
                </p>
                <Form.Item name="items">
                  <Table
                    bordered
                    dataSource={listInvoiceGenerate}
                    scroll={{
                      x: 700,
                    }}
                    columns={columnsNotBilled}
                    pagination={{ pageSize: 5 }}
                  // loading={loading}
                  />
                  <Row justify="start">
                    <p>Tổng tiền tất cả hóa đơn:</p>
                    <p className="total-all-invoice">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        listInvoiceGenerate?.map((invoice) => invoice.total_money).reduce((pre, current) => pre + current, 0)
                      )}
                    </p>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export default PreviewAddAutoInvoice;
