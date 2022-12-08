import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import moment from "moment";
import "./invoice.scss";
import MainLayout from "../../components/layout/MainLayout";
const LIST_BUILDING_FILTER = "manager/contract/group";
const LIST_INVOICE_ADD_AUTO = "manager/bill/room/bill-status";
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
const AddAutoInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState("");
  const [building, setBuilding] = useState(null);
  const [paymentCycle, setPaymentCycle] = useState(0);
  const [buildingName, setBuildingName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSourceBilled, setDataSourceBilled] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceNotBilled, setDataSourceNotBilled] = useState([]);
  // const [waterPriceByIndex, setWaterPriceByIndex] = useState();
  // const [waterPriceByMonth, setwaterPriceByMonth] = useState();
  // const [waterPriceByPeople, setWaterPriceByPeople] = useState();
  // const [elecPriceByIndex, setElecPriceByIndex] = useState();
  // const [elecPriceByMonth, setElecPriceByMonth] = useState();
  // const [elecPriceByPeople, setElecPriceByPeople] = useState();
  // const [vehiPriceByMonth, setVehiPriceByMonth] = useState();
  // const [vehiPriceByPeople, setVehiPriceByPeople] = useState();
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    const getBuildingFilter = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getBuildingFilter();
  }, [cookie]);

  useEffect(() => {
    const getListInvoice = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_INVOICE_ADD_AUTO, {
          params: {
            groupId: building,
            paymentCycle: paymentCycle,
            groupContractId: 11,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getListInvoice();
  }, [cookie, building, paymentCycle]);
  useEffect(() => {
    for (let i = 0; i < dataSource?.length; i++) {
      dataSource[i].key = i + 1;
    }
    const getListInvoice = () => {
      let billed = dataSource.filter((bill) => bill.is_billed === true);
      setDataSourceBilled(billed);
      let notBilled = dataSource.filter((bill) => bill.is_billed === false);
      setDataSourceNotBilled(notBilled);
    };
    getListInvoice();
  }, [dataSource]);

  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].contract_id,
    });
  }
  const optionPayment = [
    {
      label: "Tất cả các kỳ",
      value: 0,
    },
    {
      label: "Kỳ 15",
      value: 15,
    },
    {
      label: "Kỳ 30",
      value: 30,
    },
  ];
  let day = moment().date();
  let month = moment().month();
  let year = moment().year();

  let date_create = moment().year(year).month(month).date(day);

  let date_create_format = moment(date_create, "DD-MM-YYYY");
  const initValues = {
    date_create_invoice: date_create_format,
  };

  const buildingChange = (value, option) => {
    setBuilding(value);
    setBuildingName(option.label);
    console.log(value);
  };
  const paymentCycleChange = (value) => {
    setPaymentCycle(value);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  let service_bill = [];
  let serviceWater = {};
  let serviceElec = {};
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
      render: (value) => {
        return value.toLocaleString("vn") + " đ";
      },
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
      dataIndex: "total_price",
      width: "11%",
      render: (text, record, index) => {
        let waterPrice = 0;
        let elecPrice = 0;
        let cleanPrice = 0;
        let vehiclesPrice = 0;
        let internetPrice = 0;
        let serviceId = 0;
        let serviceType = 0;
        let servicePrice = 0;
        let serviceIndex = 0;
        let serviceTotalMoney = 0;
        let name;
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
          serviceIndex = record.room_current_water_index - record.room_old_water_index;
          servicePrice = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Đồng hồ điện/nước"
          )?.service_price;
          serviceTotalMoney = waterPrice;
          serviceId = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Đồng hồ điện/nước"
          )?.service_id;

          serviceType = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Đồng hồ điện/nước"
          )?.service_type_id;

          serviceWater.service_id = serviceId;
          serviceWater.service_type = serviceType;
        } else if (
          record.list_general_service.some(
            (water) => water?.service_name === "water" && water.service_type_name === "Người"
          )
        ) {
          waterPrice =
            record.list_general_service.find(
              (water) => water?.service_name === "water" && water.service_type_name === "Người"
            )?.service_price * record.total_renter;

          serviceIndex = record.total_renter;
          servicePrice = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Người"
          )?.service_price;
          serviceTotalMoney = waterPrice;
          name = "Nước người";

          serviceId = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Người"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Người"
          )?.service_type_id;
          serviceWater.service_id = serviceId;
          serviceWater.service_type = serviceType;
        } else if (
          record.list_general_service.some(
            (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
          )
        ) {
          waterPrice = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
          )?.service_price;
          name = "Nước tháng";

          serviceIndex = 1;
          servicePrice = waterPrice;
          serviceTotalMoney = waterPrice;

          serviceId = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (water) => water?.service_name === "water" && water.service_type_name === "Tháng"
          )?.service_type_id;
          serviceWater.service_id = serviceId;
          serviceWater.service_type = serviceType;
          serviceWater.service_price = servicePrice;
          serviceWater.service_index = serviceIndex;
          serviceWater.service_total_money = serviceTotalMoney;
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
          serviceId = record.list_general_service.find(
            (elec) => elec?.service_name === "electric" && elec.service_type_name === "Đồng hồ điện/nước"
          )?.service_id;
          serviceIndex = record.room_current_electric_index - record.room_old_electric_index;
          servicePrice = record.list_general_service.find(
            (elec) => elec?.service_name === "electric" && elec.service_type_name === "Đồng hồ điện/nước"
          )?.service_price;
          serviceTotalMoney = elecPrice;
          serviceType = record.list_general_service.find(
            (elec) => elec?.service_name === "electric" && elec.service_type_name === "Đồng hồ điện/nước"
          )?.service_type_id;
          serviceElec.service_id = serviceId;
          serviceElec.service_type = serviceType;
          serviceElec.service_price = servicePrice;
          serviceElec.service_index = serviceIndex;
          serviceElec.service_total_money = serviceTotalMoney;
        }

        if (
          record.list_general_service.some(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
          )
        ) {
          internetPrice = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
          )?.service_price;
          serviceId = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Tháng"
          )?.service_type_id;
          serviceIndex = 1;
          servicePrice = internetPrice;
          serviceTotalMoney = internetPrice;
          name = "inter tháng";
        } else if (
          record.list_general_service.some(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
          )
        ) {
          internetPrice =
            record.list_general_service.find(
              (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
            )?.service_price * record.total_renter;
          serviceId = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
          )?.service_type_id;

          serviceIndex = record.total_renter;
          servicePrice = record.list_general_service.find(
            (internet) => internet?.service_name === "internet" && internet.service_type_name === "Người"
          )?.service_price;
          serviceTotalMoney = internetPrice;
          name = "inter người";
        }

        if (
          record.list_general_service.some(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
          )
        ) {
          vehiclesPrice = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
          )?.service_price;
          serviceId = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Tháng"
          )?.service_type_id;
          serviceIndex = 1;
          servicePrice = vehiclesPrice;
          serviceTotalMoney = vehiclesPrice;
          name = "vehi tháng";
        } else if (
          record.list_general_service.some(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
          )
        ) {
          vehiclesPrice =
            record.list_general_service.find(
              (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
            )?.service_price * record.total_renter;
          serviceId = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
          )?.service_type_id;
          serviceIndex = record.total_renter;
          servicePrice = record.list_general_service.find(
            (vehicles) => vehicles?.service_name === "vehicles" && vehicles.service_type_name === "Người"
          )?.service_price;
          serviceTotalMoney = vehiclesPrice;
          name = "vehi người";
        }
        if (
          record.list_general_service.some(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
          )
        ) {
          cleanPrice = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
          )?.service_price;
          serviceId = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Tháng"
          )?.service_type_id;
          serviceIndex = 1;
          servicePrice = cleanPrice;
          serviceTotalMoney = cleanPrice;
          name = "clean Tháng";
        } else if (
          record.list_general_service.some(
            (vehicles) => vehicles?.service_name === "cleaning" && vehicles.service_type_name === "Người"
          )
        ) {
          cleanPrice =
            record.list_general_service.find(
              (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
            )?.service_price * record.total_renter;
          serviceId = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
          )?.service_id;
          serviceType = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
          )?.service_type_id;
          serviceIndex = record.total_renter;
          servicePrice = record.list_general_service.find(
            (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
          )?.service_price;
          serviceTotalMoney = cleanPrice;
          name = "clean người";
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
  service_bill.push(serviceElec, serviceWater);
  console.log(service_bill);
  const defaultColumnsBilled = [
    {
      title: "Tên phòng",
      dataIndex: "room_name",
    },
    {
      title: "Tầng",
      dataIndex: "room_floor",
    },

    {
      title: "Số điện cũ",
      dataIndex: "room_current_electric_index",
    },
    {
      title: "Số điện mới",
      dataIndex: "room_current_electric_index",
      width: "10%",
      editable: true,
      render: (text, record, index) => (
        <InputNumber min={record.old_elec} style={{ width: "100%" }} value={record.new_elec} />
      ),
    },
    {
      title: "Số nước cũ",
      dataIndex: "room_current_water_index",
    },
    {
      title: "Số nước mới",
      dataIndex: "room_current_water_index",
      width: "10%",
      editable: true,
      render: (text, record, index) => <InputNumber style={{ width: "100%" }} value={text} />,
    },
    {
      title: "Tổng cộng",
      dataIndex: "total_price",
      width: "11%",
      render: (text, record, index) => {
        let total = (record.new_elec - record.old_elec) * 3000 + (record.new_water - record.old_water) * 3000 + 3000000;
        console.log(total);
        return (
          <>
            <b>{total.toLocaleString("vn") + " đ"}</b>
          </>
        );
      },
    },
    {
      title: "Ngày lập phiếu",
      dataIndex: "date_invoice",
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
  const hasSelected = selectedRowKeys.length > 0;
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Vui lòng lựa chọn chung cư để hiển thị dữ liệu hoá đơn</p>
    </div>
  );
  const customizeRenderEmptyBilled = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Không có dữ liệu để hiển thị</p>
    </div>
  );
  return (
    <div className="invoice">
      <MainLayout title="Tạo mới nhanh hoá đơn">
        <Row>
          <Col xs={24} lg={4}>
            <Row>
              <h4>Chọn chung cư để tạo nhanh hoá đơn</h4>
            </Row>
            <Row>
              <Select
                options={options}
                placeholder="Chọn chung cư"
                onChange={buildingChange}
                className="add-auto-filter"
              ></Select>
            </Row>
          </Col>
          <Col xs={24} lg={4}>
            <Row>
              <h4>Lựa chọn kỳ thanh toán</h4>
            </Row>
            <Row>
              <Select
                defaultValue={0}
                options={optionPayment}
                placeholder="Chọn kỳ thanh toán"
                onChange={paymentCycleChange}
                className="add-auto-filter"
              ></Select>
            </Row>
          </Col>
        </Row>
        <Form
          form={form}
          // onFinish={handleCreateEmployee}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createInvoice"
          initialValues={initValues}
        >
          <Card
            title={
              <>
                <Tag color="blue" className="text-tag">
                  <h3>
                    <span className="font-size-tag">
                      <b> Tạo mới nhanh hoá đơn {buildingName}</b>
                    </span>
                  </h3>
                </Tag>
              </>
            }
            className="card"
          >
            <Row>
              {day === 15 || day === 30 ? "" : <p className="alert-red">* Hiện tại chưa đến thời gian tạo hoá đơn</p>}
            </Row>
            <Row>
              <p className="alert">* Tạo mới nhanh hoá đơn theo tiêu chí kỳ thanh toán</p>
            </Row>
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
                  <DatePicker value={date_create_format} placeholder="Nhập ngày tạo hoá đơn" />
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
                  <DatePicker placeholder="Nhập hạn đóng tiền" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24}>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab={`Phòng chưa lập hoá đơn (${dataSourceNotBilled?.length})`} key="1">
                    <p className="auto-description">
                      Bạn đã lựa chọn{" "}
                      <b>
                        {selectedRowKeys.length}/{dataSourceNotBilled?.length}
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
                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                          <Table
                            bordered
                            // dataSource={dataSource}
                            dataSource={dataSourceNotBilled}
                            scroll={{
                              x: 700,
                            }}
                            columns={columnsNotBilled}
                            pagination={{ pageSize: 5 }}
                            loading={loading}
                            rowSelection={rowSelection}
                            components={components}
                            rowClassName={() => "editable-row"}
                          />
                        </ConfigProvider>
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
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={`Phòng đã lập hoá đơn (${dataSourceBilled?.length})`} key="2">
                    <ConfigProvider renderEmpty={customizeRenderEmptyBilled}>
                      <Table
                        bordered
                        scroll={{
                          x: 700,
                        }}
                        // dataSource={dataSource}
                        dataSource={dataSourceBilled}
                        columns={defaultColumnsBilled}
                        pagination={{ pageSize: 5 }}
                        loading={loading}
                      />
                    </ConfigProvider>
                  </Tabs.TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
        </Form>
      </MainLayout>
    </div>
  );
};

export default AddAutoInvoice;
