import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  notification,
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
import { Link } from "react-router-dom";
import PreviewAddAutoInvoice from "./PreviewAddAutoInvoice";
const LIST_BUILDING_FILTER = "manager/group/all";
const LIST_INVOICE_ADD_AUTO = "manager/bill/room/bill-status";
const LIST_INVOICE_PREVIEW = "manager/bill/room/create/preview";
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
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: "100%" }} />
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
  const [paymentCycle, setPaymentCycle] = useState(moment().date() < 16 ? 15 : 30);
  const [buildingName, setBuildingName] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSourceBilled, setDataSourceBilled] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceNotBilled, setDataSourceNotBilled] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [previewState, setPrevieState] = useState();
  const [paymentTerm, setPaymentTerm] = useState();
  const [dateCreate, setDateCreate] = useState();

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
          setBuildingFilter(res.data.data.list_group_contracted);
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
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getListInvoice();
  }, [cookie, building]);
  useEffect(() => {
    for (let i = 0; i < dataSource?.length; i++) {
      dataSource[i].key = i + 1;
    }
    const getListInvoice = () => {
      let billed = dataSource.filter((bill) => bill.is_billed === true);
      setDataSourceBilled(billed);
      let notBilled = dataSource.filter((bill) => bill.is_billed === false);
      setDataSourceNotBilled(notBilled);
      setSelectedRows(notBilled);
      setSelectedRowKeys(notBilled.map((obj) => obj.room_id));
    };
    getListInvoice();
  }, [dataSource]);

  const handlerPreview = async (value) => {
    const response = await axios
      .post(LIST_INVOICE_PREVIEW, selectedRows, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setPreviewInvoice(true);
        setPrevieState({ selectedRows, dateCreate, paymentTerm });
      })
      .catch((e) => {
        notification.error({
          message: "Thêm mới hoá đơn thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
        });
      });
  };

  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
      key: i + 1,
    });
  }

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
  useEffect(() => {
    setDateCreate(date_create);
  }, [date_create]);
  useEffect(() => {
    setPaymentTerm(date_payment);
  }, [date_payment]);
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
  const disabledDate = (current) => {
    return current && current < moment(dateCreate, "YYYY-MM-DD");
  };
  const buildingChange = (value, option) => {
    setBuilding(value);
    setBuildingName(option.label);
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const defaultColumnsNotBilled =
    dataSource
      .map((obj, idx) => {
        return obj.list_general_service;
      })[0]
      ?.some((water) => water?.service_name === "water" && water.service_type_name === "Tháng") ||
    dataSource
      .map((obj, idx) => {
        return obj.list_general_service;
      })[0]
      ?.some((water) => water?.service_name === "water" && water.service_type_name === "Người")
      ? [
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
            render: (text, record, index) => (
              <InputNumber
                min={record.room_old_electric_index}
                style={{ width: "100%" }}
                value={text}
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
            width: "11%",
            editable: true,
            render: (text, record, index) => (
              <InputNumber min={record.room_old_electric_index} style={{ width: "100%" }} value={text} />
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "is_in_bill_cycle",
            width: "10%",
            render: (_, record) => {
              let status;
              if (record.is_in_bill_cycle === true) {
                status = (
                  <Tag color="red" key={record.is_in_bill_cycle}>
                    Đến hạn đóng tiền phòng
                  </Tag>
                );
              } else if (record.is_in_bill_cycle === false) {
                status = (
                  <Tag color="default" key={record.is_in_bill_cycle}>
                    Chưa đến hạn đóng tiền phòng
                  </Tag>
                );
              }

              return <>{status}</>;
            },
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
              let otherPrice = 0;
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
                  (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
                )
              ) {
                cleanPrice =
                  record.list_general_service.find(
                    (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
                  )?.service_price * record.total_renter;
              }
              if (
                record.list_general_service.some(
                  (other) => other?.service_name === "other" && other.service_type_name === "Tháng"
                )
              ) {
                otherPrice = record.list_general_service.find(
                  (other) => other?.service_name === "other" && other.service_type_name === "Tháng"
                )?.service_price;
              } else if (
                record.list_general_service.some(
                  (other) => other?.service_name === "other" && other.service_type_name === "Người"
                )
              ) {
                otherPrice =
                  record.list_general_service.find(
                    (other) => other?.service_name === "other" && other.service_type_name === "Người"
                  )?.service_price * record.total_renter;
              }

              total =
                waterPrice + elecPrice + cleanPrice + vehiclesPrice + internetPrice + otherPrice + record.room_price;
              return (
                <>
                  <b>{total.toLocaleString("vn") + " đ"}</b>
                </>
              );
            },
          },
        ]
      : [
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
            render: (text, record, index) => (
              <InputNumber
                min={record.room_old_electric_index}
                style={{ width: "100%" }}
                value={text}
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
            width: "11%",
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
            width: "11%",
            editable: true,
            render: (text, record, index) => (
              <InputNumber min={record.room_old_water_index} style={{ width: "100%" }} value={text} />
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "is_in_bill_cycle",
            width: "10%",
            render: (_, record) => {
              let status;
              if (record.is_in_bill_cycle === true) {
                status = (
                  <Tag color="red" key={record.is_in_bill_cycle}>
                    Đến hạn đóng tiền phòng
                  </Tag>
                );
              } else if (record.is_in_bill_cycle === false) {
                status = (
                  <Tag color="default" key={record.is_in_bill_cycle}>
                    Chưa đến hạn đóng tiền phòng
                  </Tag>
                );
              }

              return <>{status}</>;
            },
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
              let otherPrice = 0;
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
                  (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
                )
              ) {
                cleanPrice =
                  record.list_general_service.find(
                    (cleaning) => cleaning?.service_name === "cleaning" && cleaning.service_type_name === "Người"
                  )?.service_price * record.total_renter;
              }
              if (
                record.list_general_service.some(
                  (other) => other?.service_name === "other" && other.service_type_name === "Tháng"
                )
              ) {
                otherPrice = record.list_general_service.find(
                  (other) => other?.service_name === "other" && other.service_type_name === "Tháng"
                )?.service_price;
              } else if (
                record.list_general_service.some(
                  (other) => other?.service_name === "other" && other.service_type_name === "Người"
                )
              ) {
                otherPrice =
                  record.list_general_service.find(
                    (other) => other?.service_name === "other" && other.service_type_name === "Người"
                  )?.service_price * record.total_renter;
              }

              total =
                waterPrice + elecPrice + cleanPrice + vehiclesPrice + internetPrice + otherPrice + record.room_price;
              return (
                <>
                  <b>{total.toLocaleString("vn") + " đ"}</b>
                </>
              );
            },
          },
        ];
  const defaultColumnsBilled =
    dataSource
      .map((obj, idx) => {
        return obj.list_general_service;
      })[0]
      ?.some((water) => water?.service_name === "water" && water.service_type_name === "Tháng") ||
    dataSource
      .map((obj, idx) => {
        return obj.list_general_service;
      })[0]
      ?.some((water) => water?.service_name === "water" && water.service_type_name === "Người")
      ? [
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
          },
          {
            title: "Tổng cộng",
            dataIndex: "total_money",
            render: (_, record) => {
              return (
                <>
                  <b>{record.total_money.toLocaleString("vn") + " đ"}</b>
                </>
              );
            },
          },
          {
            title: "Ngày lập phiếu",
            dataIndex: "created_time",
          },
        ]
      : [
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
            render: (_, record) => {
              return (
                <>
                  <b>{record.total_money.toLocaleString("vn") + " đ"}</b>
                </>
              );
            },
          },
          {
            title: "Ngày lập phiếu",
            dataIndex: "created_time",
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
    setSelectedRows(newData);
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
  const [previewInvoice, setPreviewInvoice] = useState(false);
  const onClickPreviewInvoice = () => {
    setPreviewInvoice(true);
  };
  return (
    <div className="invoice">
      <MainLayout
        title={
          <>
            <p style={{ marginTop: "30px" }}>
              Tạo mới nhanh hoá đơn{" "}
              <span style={{ fontSize: "14px", color: "#6B6A6A" }}>
                (Tạo mới nhanh hoá đơn theo tiêu chí kỳ thanh toán)
              </span>
            </p>
          </>
        }
        button={
          <Link to="/invoice">
            <Button type="primary" size="middle" className="button-add">
              Quay lại quản lý hoá đơn
            </Button>
          </Link>
        }
      >
        <Form
          form={form}
          onFinish={handlerPreview}
          layout="horizontal"
          size={"default"}
          id="previewInvoice"
          initialValues={initValues}
        >
          <Card className="card">
            <Row>
              <Col xs={24} lg={6}>
                <Row style={{ marginBottom: "8px" }}>
                  <b>* Chọn chung cư để tạo nhanh hoá đơn</b>
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
                  <DatePicker
                    onChange={dateCreateChange}
                    value={date_create_format}
                    placeholder="Nhập ngày tạo hoá đơn"
                    format="DD-MM-YYYY"
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
                    onChange={paymentTermChange}
                    placeholder="Nhập hạn đóng tiền"
                    format="DD-MM-YYYY"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24}>
                <Tabs defaultActiveKey="1" size="large">
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
                            rowKey={(record) => record.room_id}
                          />
                        </ConfigProvider>
                      </Form.Item>
                    </Form>
                    {selectedRowKeys.length !== 0 ? (
                      <Button
                        className="btn-add-invoice"
                        htmlType="submit"
                        key="submit"
                        form="previewInvoice"
                        onClick={handlerPreview}
                        type="primary"
                        size="middle"
                      >
                        Xem trước hoá đơn được tạo
                      </Button>
                    ) : (
                      <Button
                        className="btn-add-invoice"
                        htmlType="submit"
                        key="submit"
                        form="previewInvoice"
                        type="primary"
                        size="middle"
                        disabled
                      >
                        Xem trước hoá đơn được tạo
                      </Button>
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={`Phòng đã lập hoá đơn (${dataSourceBilled?.length})`} key="2">
                    <ConfigProvider renderEmpty={customizeRenderEmptyBilled}>
                      <Table
                        bordered
                        scroll={{
                          x: 700,
                        }}
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
      <PreviewAddAutoInvoice visible={previewInvoice} close={setPreviewInvoice} state={previewState} />
    </div>
  );
};

export default AddAutoInvoice;
