import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import moment from "moment";
import Breadcrumbs from "../../components/BreadCrumb ";
import Sidebar from "../../components/sidebar/Sidebar";
import "./invoice.scss";
const LIST_BUILDING_FILTER = "manager/group/all/contracted";
const { Content, Sider, Header } = Layout;
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
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState("");
  const [building, setBuilding] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newElec, setNewElec] = useState();
  const [newWater, setNewWater] = useState();
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      room_name: 101,
      room_floor: 1,
      room_price: "3,000,000 đ",
      old_elec: 100,
      new_elec: 200,
      old_water: 150,
      new_water: 200,
      total_price: "4,700,00 đ",
      date_invoice: "25-11-2022",
    },
    {
      key: 2,
      room_name: 102,
      room_floor: 1,
      room_price: "3,000,000 đ",
      old_elec: 130,
      new_elec: 250,
      old_water: 160,
      new_water: 260,
      total_price: "4,700,00 đ",
      date_invoice: "25-11-2022",
    },
    {
      key: 3,
      room_name: 103,
      room_floor: 1,
      room_price: 2000000,
      old_elec: 50,
      new_elec: 200,
      old_water: 70,
      new_water: 100,
      total_price: 0,
      date_invoice: "25-11-2022",
    },
    {
      key: 4,
      room_name: 104,
      room_floor: 1,
      room_price: "3,000,000 đ",
      old_elec: 100,
      new_elec: 200,
      old_water: 150,
      new_water: 200,
      total_price: "4,700,00 đ",
      date_invoice: "25-11-2022",
    },
  ]);
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
  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  let day = moment().date();
  let month = moment().month();
  let year = moment().year();

  let date_create = moment().year(year).month(month).date(day);

  let date_create_format = moment(date_create, "DD-MM-YYYY");
  const initValues = {
    date_create_invoice: date_create_format,
  };

  const buildingChange = (value) => {
    setBuilding(value);
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  console.log(newElec);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const defaultColumns = [
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
      dataIndex: "old_elec",
    },
    {
      title: "Số điện mới",
      dataIndex: "new_elec",
      width: "10%",
      editable: true,
      render: (text, record, index) => (
        <InputNumber min={record.old_elec} style={{ width: "100%" }} value={record.new_elec} />
      ),
    },
    {
      title: "Số nước cũ",
      dataIndex: "old_water",
    },
    {
      title: "Số nước mới",
      dataIndex: "new_water",
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
  const columns = defaultColumns.map((col) => {
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
  return (
    <div className="invoice">
      <Layout>
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: "auto",
            // height: "100vh",
            position: "sticky",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header className="layout-header">
            <p className="header-title">Tạo mới nhanh hoá đơn</p>
          </Header>
          <Content className="layout-content">
            <Breadcrumbs />
            <Divider />
            <Row>
              <h4>Chọn chung cư để tạo nhanh hoá đơn</h4>
            </Row>
            <Row>
              <Select
                options={options}
                placeholder="Chọn chung cư"
                onChange={buildingChange}
                style={{ width: "250px", marginBottom: "20px" }}
              ></Select>
            </Row>
            <div className="site-layout-background">
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
                            <b> Tạo nhanh hoá đơn cho chung cư </b>
                          </span>
                        </h3>
                      </Tag>
                    </>
                  }
                  className="card"
                >
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
                        <Tabs.TabPane tab="Phòng chưa lập hoá đơn" key="1">
                          <p className="auto-description">
                            Bạn đã lựa chọn <b>{selectedRowKeys.length}/</b> phòng để tạo mới nhanh hoá đơn
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
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                                loading={loading}
                                rowSelection={rowSelection}
                                components={components}
                                rowClassName={() => "editable-row"}
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
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Phòng đã lập hoá đơn" key="2">
                          <Table
                            bordered
                            scroll={{
                              x: 700,
                            }}
                            // dataSource={dataSource}
                            dataSource={dataSource}
                            columns={columns}
                            pagination={{ pageSize: 5 }}
                            loading={loading}
                          />
                        </Tabs.TabPane>
                      </Tabs>
                    </Col>
                  </Row>
                </Card>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AddAutoInvoice;
