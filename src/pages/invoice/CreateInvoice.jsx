import { Form, Card, notification, Button, Modal, DatePicker, Col, Row, InputNumber } from "antd";
import "./invoice.scss";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
const ADD_INVOICE_URL = "manager/bill/room/create";
const CreateInvoice = ({ visible, close, id, setFlag }) => {
  const [room_month, setRoomMonth] = useState(1);

  const [electMoney, setElecMoney] = useState();
  const [waterMoney, setWaterMoney] = useState();

  const [roomName, setRoomName] = useState();
  const [roomId, setRoomId] = useState();
  const [roomPrice, setRoomPrice] = useState();
  const [totalRenter, setTotalRenter] = useState();
  const [listService, setListService] = useState();
  const [vehiPrice, setVehiPrice] = useState(0);
  const [internetPrice, setInternetPrice] = useState(0);
  const [cleanPrice, setCleanPrice] = useState(0);
  const [otherPrice, setOtherPrice] = useState(0);
  const [newWater, setNewWater] = useState();
  const [newElec, setNewElec] = useState();
  const [vehiMonth, setVehiMonth] = useState();
  const [waterMonth, setWaterMonth] = useState();
  const [internetMonth, setInternetMonth] = useState();
  const [cleanMonth, setCleanMonth] = useState();
  const [otherMonth, setOtherMonth] = useState();
  const [water, setWater] = useState();
  const [elec, setElec] = useState();
  const [vehi, setVehi] = useState();
  const [internet, setInternet] = useState();
  const [clean, setClean] = useState();
  const [other, setOther] = useState();
  const [dateCreate, setDateCreate] = useState();
  const [paymentTerm, setPaymentTerm] = useState();
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");

  let day = moment().date();
  let month = moment().month();
  let year = moment().year();

  let date_create = `${year}-${month + 1}-${day}`;
  let date_payment = `${year}-${month + 1}-${day + 1}`;
  let date_create_format = moment(date_create, "YYYY-MM-DD");
  let date_payment_format = moment(date_payment, "YYYY-MM-DD");
  const initValues = {
    date_create_invoice: date_create_format,
    payment_term: date_payment_format,
  };
  const monthChange = (value) => {
    setRoomMonth(value);
  };
  useEffect(() => {
    if (visible) {
      setDateCreate(date_create);
    }
  }, [date_create, visible]);
  useEffect(() => {
    setPaymentTerm(date_payment);
  }, [date_payment]);
  useEffect(() => {
    if (visible) {
      axios
        .get(`manager/bill/room/information/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          form.setFieldsValue({
            old_elec:
              res.data.data?.list_general_service?.filter((electric) => electric.service_name === "electric").length > 0
                ? res.data.data.list_general_service?.find((electric) => electric.service_name === "electric")
                    .hand_over_general_service_index
                : null,
            new_elec:
              res.data.data?.list_general_service?.filter((electric) => electric.service_name === "electric").length > 0
                ? res.data.data.list_general_service?.find((electric) => electric.service_name === "electric")
                    .hand_over_general_service_index
                : null,
            old_water:
              res.data.data?.list_general_service?.filter((water) => water.service_name === "water").length > 0
                ? res.data.data.list_general_service?.find((vehicles) => vehicles.service_name === "water")
                    .hand_over_general_service_index
                : null,
            new_water:
              res.data.data?.list_general_service?.filter((water) => water.service_name === "water").length > 0
                ? res.data.data.list_general_service?.find((water) => water.service_name === "water")
                    .hand_over_general_service_index
                : null,
            waterMonth:
              res.data.data?.list_general_service?.filter((water) => water.service_name === "water").length > 0
                ? res.data.data.list_general_service?.find((water) => water.service_name === "water")
                    .hand_over_general_service_index
                : null,
            vehiMonth:
              res.data.data?.list_general_service?.filter((vehicles) => vehicles.service_name === "vehicles").length > 0
                ? res.data.data.list_general_service?.find((vehicles) => vehicles.service_name === "vehicles")
                    .hand_over_general_service_index
                : null,
            internetMonth:
              res.data.data?.list_general_service?.filter((internet) => internet.service_name === "internet").length > 0
                ? res.data.data.list_general_service?.find((internet) => internet.service_name === "internet")
                    .hand_over_general_service_index
                : null,
            cleanMonth:
              res.data.data?.list_general_service?.filter((clean) => clean.service_name === "cleaning").length > 0
                ? res.data.data.list_general_service?.find((clean) => clean.service_name === "cleaning")
                    .hand_over_general_service_index
                : null,
            otherMonth:
              res.data.data?.list_general_service?.filter((clean) => clean.service_name === "other").length > 0
                ? res.data.data.list_general_service?.find((clean) => clean.service_name === "other")
                    .hand_over_general_service_index
                : null,
          });
          setVehiMonth(
            res.data.data?.list_general_service?.filter((vehicles) => vehicles.service_name === "vehicles").length > 0
              ? res.data.data.list_general_service?.find((vehicles) => vehicles.service_name === "vehicles")
                  .hand_over_general_service_index
              : null
          );
          setWaterMonth(
            res.data.data?.list_general_service?.filter((water) => water.service_name === "water").length > 0
              ? res.data.data.list_general_service?.find((water) => water.service_name === "water")
                  .hand_over_general_service_index
              : null
          );
          setInternetMonth(
            res.data.data?.list_general_service?.filter((internet) => internet.service_name === "internet").length > 0
              ? res.data.data.list_general_service?.find((internet) => internet.service_name === "internet")
                  .hand_over_general_service_index
              : null
          );
          setCleanMonth(
            res.data.data?.list_general_service?.filter((clean) => clean.service_name === "cleaning").length > 0
              ? res.data.data.list_general_service?.find((clean) => clean.service_name === "cleaning")
                  .hand_over_general_service_index
              : null
          );
          setOtherMonth(
            res.data.data?.list_general_service?.filter((clean) => clean.service_name === "other").length > 0
              ? res.data.data.list_general_service?.find((clean) => clean.service_name === "other")
                  .hand_over_general_service_index
              : null
          );
          setRoomId(res.data.data.room_id);
          setRoomName(res.data.data.room_name);
          setRoomPrice(res.data.data.room_price);
          setListService(res.data.data.list_general_service);
          setTotalRenter(res.data.data.total_renter);
          setNewElec(
            res.data.data.list_general_service.find((electric) => electric.service_name === "electric")
              .hand_over_general_service_index
          );
          setNewWater(
            res.data.data.list_general_service.find((water) => water.service_name === "water")
              .hand_over_general_service_index
          );
        });
    }
  }, [visible]);
  const handleCreateInvoice = async (value) => {
    const invoice = [
      {
        room_id: roomId,
        total_room_money: roomPrice,
        total_service_money: serviceTotalMoney,
        payment_term: paymentTerm,
        created_time: dateCreate,
        service_bill: service_bill,
      },
    ];
    const response = await axios
      .post(ADD_INVOICE_URL, invoice, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Th??m m???i ho?? ????n th??nh c??ng",
          duration: 3,
          placement: "top",
        });
        close(false);
        setFlag(true);

        setTimeout(() => {
          setFlag(false);
        }, "500");
      })
      .catch((e) => {
        notification.error({
          message: "Th??m m???i ho?? ????n th???t b???i",
          description: "Vui l??ng ki???m tra l???i th??ng tin v?? th??? l???i.",
          duration: 3,
          placement: "top",
        });
        console.log(e);
      });
    // setFlag(false);
  };

  const newWaterChange = (value) => {
    setNewWater(value);
  };
  const newElecChange = (value) => {
    setNewElec(value);
  };
  const vehiMonthChange = (value) => {
    setVehiMonth(value);
  };
  const internetMonthChange = (value) => {
    setInternetMonth(value);
  };
  const cleanMonthChange = (value) => {
    setCleanMonth(value);
  };
  const vehiPeopleChange = (value) => {
    setVehiMonth(value);
  };
  const waterMonthChange = (value) => {
    setWaterMonth(value);
  };
  const waterPeopleChange = (value) => {
    setWaterMonth(value);
  };
  const internetPeopleChange = (value) => {
    setInternetMonth(value);
  };
  const cleanPeopleChange = (value) => {
    setCleanMonth(value);
  };
  const otherMonthChange = (value) => {
    setOtherMonth(value);
  };
  const otherPeopleChange = (value) => {
    setOtherMonth(value);
  };
  const disabledDate = (current) => {
    return current && current < moment(dateCreate, "YYYY-MM-DD");
  };
  const dateCreateChange = (date, dateString) => {
    let [day1, month1, year1] = dateString.split("-");
    let date1 = `${year1}-${month1}-${day1}`;
    setDateCreate(date1);
  };
  const paymentTermChange = (date, dateString) => {
    let [day1, month1, year1] = dateString.split("-");
    let date2 = `${year1}-${month1}-${day1}`;
    setPaymentTerm(date2);
  };
  const serviceArray = listService;
  let results = [];

  useEffect(() => {
    let serviceId = 0;
    let serviceType = 0;
    let servicePrice = 0;
    let serviceIndex = 0;
    let serviceTotalMoney = 0;
    if (
      serviceArray?.some((water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c")
    ) {
      servicePrice = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_price;
      serviceIndex =
        newWater -
        serviceArray.find((water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c")
          ?.hand_over_general_service_index;
      serviceTotalMoney =
        serviceArray.find((water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_id;

      serviceType = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_type_id;
      setWaterMoney(serviceTotalMoney);

      setWater({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((water) => water?.service_name === "water" && water.service_type_name === "Th??ng")) {
      servicePrice = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Th??ng"
      )?.service_price;
      serviceIndex = waterMonth;
      serviceTotalMoney =
        serviceArray.find((water) => water?.service_name === "water" && water.service_type_name === "Th??ng")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Th??ng"
      )?.service_id;

      serviceType = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Th??ng"
      )?.service_type_id;
      setWaterMoney(serviceTotalMoney);
      setWaterMonth(serviceIndex);
      setWater({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((water) => water?.service_name === "water" && water.service_type_name === "Ng?????i")) {
      servicePrice = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Ng?????i"
      )?.service_price;
      serviceIndex = waterMonth;
      serviceTotalMoney =
        serviceArray.find((water) => water?.service_name === "water" && water.service_type_name === "Ng?????i")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Ng?????i"
      )?.service_id;

      serviceType = serviceArray.find(
        (water) => water?.service_name === "water" && water.service_type_name === "Ng?????i"
      )?.service_type_id;
      setWaterMoney(serviceTotalMoney);
      setWaterMonth(serviceIndex);
      setWater({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (
      serviceArray?.some(
        (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
      )
    ) {
      servicePrice = serviceArray.find(
        (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_price;
      serviceIndex =
        newElec -
        serviceArray.find(
          (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
        )?.hand_over_general_service_index;
      serviceTotalMoney =
        serviceArray.find(
          (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
        )?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_id;

      serviceType = serviceArray.find(
        (electric) => electric?.service_name === "electric" && electric.service_type_name === "?????ng h??? ??i???n/n?????c"
      )?.service_type_id;
      setElecMoney(serviceTotalMoney);
      setElec({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (
      serviceArray?.some((vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Th??ng")
    ) {
      servicePrice = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Th??ng"
      )?.service_price;
      serviceIndex = vehiMonth;
      serviceTotalMoney =
        serviceArray.find((vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Th??ng")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Th??ng"
      )?.service_id;

      serviceType = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Th??ng"
      )?.service_type_id;
      setVehiPrice(servicePrice);
      setVehiMonth(serviceIndex);
      setVehi({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (
      serviceArray?.some((vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Ng?????i")
    ) {
      servicePrice = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Ng?????i"
      )?.service_price;
      serviceIndex = vehiMonth;
      serviceTotalMoney =
        serviceArray.find((vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Ng?????i")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Ng?????i"
      )?.service_id;

      serviceType = serviceArray.find(
        (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Ng?????i"
      )?.service_type_id;
      setVehiPrice(servicePrice);
      setVehiMonth(serviceIndex);
      setVehi({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (
      serviceArray?.some((internet) => internet?.service_name === "internet" && internet.service_type_name === "Th??ng")
    ) {
      servicePrice = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Th??ng"
      )?.service_price;
      serviceIndex = internetMonth;
      serviceTotalMoney =
        serviceArray.find((internet) => internet?.service_name === "internet" && internet.service_type_name === "Th??ng")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Th??ng"
      )?.service_id;

      serviceType = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Th??ng"
      )?.service_type_id;
      setInternetPrice(servicePrice);
      setInternetMonth(serviceIndex);
      setInternet({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (
      serviceArray?.some((internet) => internet?.service_name === "internet" && internet.service_type_name === "Ng?????i")
    ) {
      servicePrice = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Ng?????i"
      )?.service_price;
      serviceIndex = internetMonth;
      serviceTotalMoney =
        serviceArray.find((internet) => internet?.service_name === "internet" && internet.service_type_name === "Ng?????i")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Ng?????i"
      )?.service_id;

      serviceType = serviceArray.find(
        (internet) => internet?.service_name === "internet" && internet.service_type_name === "Ng?????i"
      )?.service_type_id;
      setInternetPrice(servicePrice);
      setInternetMonth(serviceIndex);
      setInternet({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Th??ng")) {
      servicePrice = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Th??ng"
      )?.service_price;
      serviceIndex = cleanMonth;
      serviceTotalMoney =
        serviceArray.find((clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Th??ng")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Th??ng"
      )?.service_id;

      serviceType = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Th??ng"
      )?.service_type_id;
      setCleanPrice(servicePrice);
      setCleanMonth(serviceIndex);
      setClean({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Ng?????i")) {
      servicePrice = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Ng?????i"
      )?.service_price;
      serviceIndex = cleanMonth;
      serviceTotalMoney =
        serviceArray.find((clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Ng?????i")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Ng?????i"
      )?.service_id;

      serviceType = serviceArray.find(
        (clean) => clean?.service_name === "cleaning" && clean.service_type_name === "Ng?????i"
      )?.service_type_id;
      setCleanPrice(servicePrice);
      setCleanMonth(serviceIndex);
      setClean({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((other) => other?.service_name === "other" && other.service_type_name === "Th??ng")) {
      servicePrice = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Th??ng"
      )?.service_price;
      serviceIndex = otherMonth;
      serviceTotalMoney =
        serviceArray.find((other) => other?.service_name === "other" && other.service_type_name === "Th??ng")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Th??ng"
      )?.service_id;

      serviceType = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Th??ng"
      )?.service_type_id;
      setOtherPrice(servicePrice);
      setOtherMonth(serviceIndex);
      setOther({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
    if (serviceArray?.some((other) => other?.service_name === "other" && other.service_type_name === "Ng?????i")) {
      servicePrice = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Ng?????i"
      )?.service_price;
      serviceIndex = otherMonth;
      serviceTotalMoney =
        serviceArray.find((other) => other?.service_name === "other" && other.service_type_name === "Ng?????i")
          ?.service_price * serviceIndex;
      serviceId = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Ng?????i"
      )?.service_id;

      serviceType = serviceArray.find(
        (other) => other?.service_name === "other" && other.service_type_name === "Ng?????i"
      )?.service_type_id;
      setOtherPrice(servicePrice);
      setOtherMonth(serviceIndex);
      setOther({
        service_id: serviceId,
        service_type: serviceType,
        service_price: servicePrice,
        service_index: serviceIndex,
        service_total_money: serviceTotalMoney,
      });
    }
  }, [serviceArray, newWater, newElec]);
  results?.push(elec, water, vehi, internet, other, clean);
  const service_bill = results.filter((element) => {
    return element !== undefined;
  });
  let serviceTotalMoney =
    internetPrice * internetMonth +
    vehiPrice * vehiMonth +
    electMoney +
    waterMoney +
    otherPrice * otherMonth +
    cleanMonth * cleanPrice;
  let totalMoney = serviceTotalMoney + roomPrice;
  return (
    <>
      <Modal
        title={<h2>T???o ho?? ????n cho ph??ng {roomName}</h2>}
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
                <p>T???ng c???ng ho?? ????n:</p>
                <p className="total_price">{totalMoney?.toLocaleString("vn") + " ??"}</p>
              </Col>
              <Col span={12} style={{ marginLeft: "100px" }}>
                <Button
                  key="back"
                  onClick={() => {
                    close(false);
                  }}
                >
                  ????ng
                </Button>

                <Button htmlType="submit" key="submit" form="createInvoice" type="primary">
                  T???o m???i
                </Button>
              </Col>
            </Row>
          </>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateInvoice}
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
                      <b>Ng??y t???o ho?? ????n:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n ng??y t???o ho?? ????n!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={dateCreateChange}
                    value={date_create_format}
                    placeholder="Nh???p ng??y t???o ho?? ????n"
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className="form-item"
                  name="payment_term"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>H???n ????ng ti???n:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n h???n ????ng ti???n!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={paymentTermChange}
                    placeholder="Nh???p h???n ????ng ti???n"
                    format="DD-MM-YYYY"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
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
                      <b>S??? th??ng:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nh???p s??? th??ng"
                    onChange={monthChange}
                    defaultValue={1}
                    min={0}
                    max={12}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Card className="card card-price">
              <Row>
                <Col span={13}>
                  <p>T??nh ti???n ph??ng</p>
                </Col>
                <Col span={7} offset={4}>
                  <p>Th??nh ti???n</p>
                </Col>
              </Row>
              <Row>
                <Col span={13}>
                  <b>
                    <span>{room_month} th??ng</span> x {roomPrice?.toLocaleString("vn") + " ??"}
                  </b>
                </Col>
                <Col span={7} offset={4}>
                  <b>{(room_month * roomPrice)?.toLocaleString("vn") + " ??"}</b>
                </Col>
              </Row>
            </Card>
            <span>
              <b>Ti???n d???ch v???:</b>
            </span>
            <Row>
              <Col span={24}>
                <p className="description">
                  <span>Ti???n d???ch v??? kh??ch thu?? s??? d???ng</span>
                </p>
              </Col>
            </Row>
            <Form.Item className="form-item" name="service" labelCol={{ span: 24 }}>
              {listService?.map((obj, idx) => {
                return (
                  <>
                    {obj.service_type_name === "?????ng h??? ??i???n/n?????c" && obj.service_name === "electric" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="old_elec">
                              <InputNumber
                                readOnly
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="S??? c??"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={10} offset={4}>
                            <Form.Item name="new_elec">
                              <InputNumber
                                min={obj.hand_over_general_service_index}
                                onChange={newElecChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="S??? m???i"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "?????ng h??? ??i???n/n?????c" && obj.service_name === "water" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="old_water">
                              <InputNumber
                                readOnly
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="S??? c??"
                              />
                            </Form.Item>
                          </Col>

                          <Col span={10} offset={4}>
                            <Form.Item name="new_water">
                              <InputNumber
                                onChange={newWaterChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="S??? m???i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Th??ng" && obj.service_name === "water" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="waterMonth">
                              <InputNumber
                                onChange={waterMonthChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Th??ng"
                                min={1}
                                max={12}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Ng?????i" && obj.service_name === "water" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="waterMonth">
                              <InputNumber
                                onChange={waterPeopleChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={1}
                                max={12}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Th??ng" && obj.service_name === "vehicles" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="vehiMonth">
                              <InputNumber
                                onChange={vehiMonthChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Th??ng"
                                min={1}
                                max={12}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Th??ng" && obj.service_name === "internet" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="internetMonth">
                              <InputNumber
                                onChange={internetMonthChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Th??ng"
                                min={1}
                                max={12}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Th??ng" && obj.service_name === "cleaning" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="cleanMonth">
                              <InputNumber
                                onChange={cleanMonthChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Th??ng"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Ng?????i" && obj.service_name === "vehicles" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="vehiMonth">
                              <InputNumber
                                onChange={vehiPeopleChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Ng?????i" && obj.service_name === "internet" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="internetMonth">
                              <InputNumber
                                onChange={internetPeopleChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Ng?????i" && obj.service_name === "cleaning" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="cleanMonth">
                              <InputNumber
                                onChange={cleanPeopleChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Ng?????i" && obj.service_name === "other" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="otherMonth">
                              <InputNumber
                                onChange={otherPeopleChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : obj.service_type_name === "Th??ng" && obj.service_name === "other" ? (
                      <Card className="card card-service" title={obj.service_show_name}>
                        <Row>
                          <Col span={10}>
                            <Form.Item name="otherMonth">
                              <InputNumber
                                onChange={otherMonthChange}
                                defaultValue={obj.hand_over_general_service_index}
                                addonAfter="Ng?????i"
                                min={obj.hand_over_general_service_index}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10}>
                            <span>Gi??: </span>
                            <b>{obj.service_price?.toLocaleString("vn") + " ??"}</b>
                          </Col>
                        </Row>
                      </Card>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            </Form.Item>
            <Card className="card card-price">
              <Row>
                <Col span={13}>
                  <p>Th??nh ti???n d???ch v???</p>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <b>{serviceTotalMoney?.toLocaleString("vn") + " ??"}</b>
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
