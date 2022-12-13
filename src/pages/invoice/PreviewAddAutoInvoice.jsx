import { Button, Card, Col, DatePicker, Form, InputNumber, notification, Row, Table, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import moment from "moment";
import axios from "../../api/axios";
const ADD_INVOICE_URL = "manager/bill/room/create";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          width: "100%",
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Vui lòng không để trống!`,
          },
        ]}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const PreviewAddAutoInvoice = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [listPreview, setListPreview] = useState([]);
  // const [finalListPreview, setFinalListPreview] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentTerm, setPaymentTerm] = useState(state?.paymentTerm);
  const [dateCreate, setDateCreate] = useState(state?.dateCreate);

  console.log(state);
  const listInvoiceGenerate = state.selectedRows?.map((obj, index) => {
    return { ...obj, key: index };
  });
  const [dataSource, setDataSource] = useState(listInvoiceGenerate);
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");

  let date_create_format = moment(state?.dateCreate, "YYYY-MM-DD");
  let payment_term_format = moment(state?.paymentTerm, "YYYY-MM-DD");

  const initValues = {
    date_create_invoice: date_create_format,
    payment_term: payment_term_format,
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
  const defaultColumnsNotBilled = [
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
      editable: true,
      width: "15%",
      render: (text, record) => (
        <InputNumber
          style={{ width: "50%" }}
          value={record.room_price}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
        />
      ),
    },

    {
      title: "Số điện cũ",
      dataIndex: "room_old_electric_index",
    },
    {
      title: "Số điện mới",
      dataIndex: "room_current_electric_index",
      width: "10%",
      editable: true,
      render: (text, record, index) => (
        <InputNumber min={record.room_old_electric_index} style={{ width: "100%" }} value={text} />
      ),
    },
    {
      title: "Số nước cũ",
      dataIndex: "room_old_water_index",
    },
    {
      title: "Số nước mới",
      dataIndex: "room_current_water_index",
      width: "10%",
      editable: true,
      render: (text, record, index) => (
        <InputNumber min={record.room_old_water_index} style={{ width: "100%" }} value={text} />
      ),
    },
    {
      title: "Tổng cộng",
      dataIndex: "total_money",
      width: "11%",
      render: (text, record, index) => {
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
        return (
          <>
            <b>{total.toLocaleString("vn") + " đ"}</b>
          </>
        );
      },
    },
  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const columnsNotBilled = defaultColumnsNotBilled.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  useEffect(() => {
    setListPreview(
      selectedRows.map((obj) => {
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
      })
    );
  }, [selectedRows]);

  console.log(listPreview);
  console.log(selectedRows);
  const handleCreateInvoice = async (value) => {
    let finalListPreview = listPreview.map((obj, idx) => {
      return {
        payment_term: paymentTerm,
        created_time: dateCreate,
        room_id: obj.room_id,
        total_room_money: obj.room_price * obj.bill_cycle,
        total_service_money: obj.service_bill.reduce(function (acc, obj) {
          return acc + obj.serviceTotalMoney;
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
    console.log(finalListPreview);
  };
  return (
    <div className="building">
      <MainLayout
        title="Xem trước hoá đơn tạo mới nhanh"
        button={
          <Link to="/invoice">
            <Button type="primary" icon={<ArrowLeftOutlined />} size="middle" className="button-add">
              Quản lý hoá đơn
            </Button>
          </Link>
        }
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
                  Bạn đã lựa chọn{" "}
                  <b>
                    {selectedRowKeys.length}/{dataSource?.length}
                  </b>{" "}
                  phòng để tạo mới nhanh hoá đơn
                </p>
                <Form>
                  <Form.Item
                    rules={[
                      {
                        message: "Vui lòng nhập trường này",
                      },
                      {
                        required: true,
                        message: "Vui lòng nhập trường này!",
                      },
                    ]}
                  >
                    <Table
                      bordered
                      // dataSource={dataSource}
                      dataSource={dataSource}
                      scroll={{
                        x: 700,
                      }}
                      columns={columnsNotBilled}
                      pagination={{ pageSize: 5 }}
                      // loading={loading}
                      rowSelection={rowSelection}
                      components={components}
                      rowClassName={() => "editable-row"}
                      rowKey={(record) => record.room_id}
                    />
                  </Form.Item>
                </Form>
                <Button
                  className="btn-add-invoice"
                  htmlType="submit"
                  key="submit"
                  form="createInvoice"
                  type="primary"
                  size="middle"
                >
                  Tạo mới hoá đơn
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </MainLayout>
    </div>
  );
};

export default PreviewAddAutoInvoice;
