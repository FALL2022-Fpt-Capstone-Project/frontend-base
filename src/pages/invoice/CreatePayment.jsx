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
    setDateCreate(dateString);
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

    const response = await axios
      .post(ADD_INVOICE_URL, invoice, {
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
        close(false);
        setFlag(true);

        setTimeout(() => {
          setFlag(false);
        }, "500");
      })
      .catch((e) => {
        notification.error({
          message: "Thêm mới hoá đơn thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
        });
      });
    setFlag(false);
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
        title={<h2>Tạo hoá đơn chi {groupName}</h2>}
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
                <p className="total_price">{(groupMoney + serviceMoney + otherMoney).toLocaleString("vn") + " đ"}</p>
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
                      <b>Chọn chung cư:</b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chung cư để tạo hoá đơn!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn chung cư"
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
                      <b>Tổng tiền thuê chung cư:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền thuê chung cư"
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
                      <b>Tổng tiền dịch vụ:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền dịch vụ"
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
                      <b>Số tiền khác:</b>
                    </span>
                  }
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số tiền khác"
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
                      <b>Ghi chú:</b>
                    </span>
                  }
                >
                  <TextArea rows={4} />
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
