import { Form, Card, notification, Button, Modal, DatePicker, Col, Row, InputNumber, Input, Select } from "antd";
import "./invoice.scss";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
const ADD_INVOICE_URL = "manager/bill/money-source/out/add";
const LIST_BUILDING_FILTER = "manager/group/all";
const { TextArea } = Input;
const CreatePayment = ({ visible, close, setFlag }) => {
  const [dateCreate, setDateCreate] = useState();
  const [groupMoney, setGroupMoney] = useState(0);
  const [serviceMoney, setServiceMoney] = useState(0);
  const [otherMoney, setOtherMoney] = useState(0);
  const [buildingFilter, setBuildingFilter] = useState("");
  const [building, setBuilding] = useState("");
  const [groupName, setGroupName] = useState();
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
    let [day1, month1, year1] = dateString.split("-");
    let date1 = `${year1}-${month1}-${day1}`;
    setDateCreate(date1);
  };
  useEffect(() => {
    const getBuildingFilter = async () => {
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data.list_group_contracted);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBuildingFilter();
  }, [cookie]);

  const handleCreateInvoice = async (value) => {
    if (typeof value.note === "undefined") {
      value.note = "";
    }
    const invoice = {
      group_id: building,
      time: dateCreate,
      room_group_money: groupMoney,
      service_money: serviceMoney,
      other_money: otherMoney,
      other_money_note: value.note,
    };
    console.log(invoice);
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
        setOtherMoney(0);
        setGroupMoney(0);
        setServiceMoney(0);
        setFlag(true);
        close(false);

        setTimeout(() => {
          setFlag(false);
        }, "1000");
      })
      .catch((e) => {
        notification.error({
          message: "Th??m m???i ho?? ????n th???t b???i",
          description: "Vui l??ng ki???m tra l???i th??ng tin v?? th??? l???i.",
          duration: 3,
          placement: "top",
        });
      });
    // setFlag(false);
  };
  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const buildingChange = (value, option) => {
    setBuilding(value);
    setGroupName(option.label);
  };
  const groupMoneyChange = (value) => {
    setGroupMoney(value);
  };
  const serviceMoneyChange = (value) => {
    setServiceMoney(value);
  };
  const otherMoneyChange = (value) => {
    setOtherMoney(value);
  };
  return (
    <>
      <Modal
        title={<h2>T???o ho?? ????n chi</h2>}
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
                <p className="total_price">{(groupMoney + serviceMoney + otherMoney).toLocaleString("vn") + " ??"}</p>
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
                  name="groupId"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Ch???n chung c??:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n chung c?? ????? t???o ho?? ????n!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Ch???n chung c??"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.trim().toLowerCase())
                    }
                    style={{ width: "100%", marginBottom: "5%" }}
                    onChange={buildingChange}
                    className="add-auto-filter"
                    options={options}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
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
            </Row>

            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="buiding_price"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>T???ng ti???n thu?? chung c??:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nh???p s??? ti???n thu?? chung c??"
                    onChange={groupMoneyChange}
                    defaultValue={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="service_price"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>T???ng ti???n d???ch v???:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nh???p s??? ti???n d???ch v???"
                    onChange={serviceMoneyChange}
                    defaultValue={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="other_price"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>S??? ti???n kh??c:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nh???p s??? ti???n kh??c"
                    onChange={otherMoneyChange}
                    defaultValue={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  className="form-item"
                  name="note"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Ghi ch??:</b>
                    </span>
                  }
                >
                  <TextArea placeholder="Ghi ch??" rows={4} />
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
