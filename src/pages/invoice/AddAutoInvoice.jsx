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
  Radio,
  Row,
  Select,
  Table,
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
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
      add_sub: 0,
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
      add_sub: 0,
      total_price: "4,700,00 đ",
      date_invoice: "25-11-2022",
    },
    {
      key: 3,
      room_name: 103,
      room_floor: 1,
      room_price: "2,000,000 đ",
      old_elec: 50,
      new_elec: 200,
      old_water: 70,
      new_water: 100,
      add_sub: "300,000 đ",
      total_price: "4,700,00 đ",
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
      add_sub: 0,
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

  let date_create = `${day}-${month + 1}-${year}`;
  let date_term = `${day + 1}-${month + 1}-${year}`;
  let date_create_format = moment(date_create, "DD-MM-YYYY");
  let date_term_format = moment(date_term, "DD-MM-YYYY");
  const initValues = {
    date_create_invoice: date_create_format,
    payment_term: date_term_format,
  };

  const buildingChange = (value) => {
    setBuilding(value);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
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
      title: "Tiền phòng",
      dataIndex: "room_price",
    },

    {
      title: "Số điện cũ",
      dataIndex: "old_elec",
      editable: true,
    },
    {
      title: "Số điện mới",
      dataIndex: "new_elec",
      editable: true,
    },
    {
      title: "Số nước cũ",
      dataIndex: "old_water",
      editable: true,
    },
    {
      title: "Số nước mới",
      dataIndex: "new_water",
      editable: true,
    },
    {
      title: "Cộng thêm/Giảm trừ",
      dataIndex: "add_sub",
      editable: true,
    },
    {
      title: "Tổng cộng",
      dataIndex: "total_price",
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
  return (
    <div className="invoice">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
                <Row>
                  <Col span={7}>
                    <Row style={{ width: "400px" }}>
                      <Card
                        title={
                          <>
                            <Tag color="blue" className="text-tag">
                              <h3>
                                <HomeOutlined className="icon-size" />
                                <span className="font-size-tag">
                                  <b> Thông tin Chung cư Hoàng Nam </b>
                                </span>
                              </h3>
                            </Tag>
                          </>
                        }
                        className="card card-left"
                      >
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
                          <b>Cộng thêm / Giảm trừ:</b>
                        </span>
                        <Row>
                          <Col span={24}>
                            <p className="description">
                              <span>
                                Thường dành cho các trường hợp đặc biệt. Ví dụ cộng thêm ngày tết, giảm trừ covid...
                              </span>
                            </p>
                          </Col>
                        </Row>
                        <Radio.Group defaultValue={1}>
                          <Radio value={1} className="radio-add">
                            Cộng thêm
                          </Radio>
                          <Radio value={2} className="radio-add">
                            Giảm trừ
                          </Radio>
                        </Radio.Group>

                        <Form.Item
                          className="form-item"
                          name="address_more_detail"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Số tiền: </b>
                            </span>
                          }
                        >
                          <InputNumber style={{ width: "100%" }} controls={false} placeholder="Nhập số tiền" />
                        </Form.Item>
                        <Form.Item
                          className="form-item"
                          name="address_more_detail"
                          labelCol={{ span: 24 }}
                          label={
                            <span>
                              <b>Lý do: </b>
                            </span>
                          }
                        >
                          <Input autoComplete="off" placeholder="Nhập lý do" />
                        </Form.Item>
                      </Card>
                    </Row>
                    <Row style={{ width: "400px" }}>
                      <Card
                        title={
                          <>
                            <Tag color="blue" className="text-tag">
                              <h3>
                                <span className="font-size-tag">
                                  <b> Dịch vụ chung </b>
                                </span>
                              </h3>
                            </Tag>
                          </>
                        }
                        className="card card-left card-service"
                      >
                        <Row>
                          <Col span={8}>
                            <p>
                              <b>Tên dịch vụ</b>{" "}
                            </p>
                          </Col>
                          <Col span={8}>
                            <p>
                              <b>Giá</b>{" "}
                            </p>
                          </Col>
                          <Col span={8}>
                            <b>Cách tính</b>{" "}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p>Dịch vụ điện</p>
                          </Col>
                          <Col span={5}>
                            <p>3,500 đ</p>
                          </Col>
                          <Col span={11}>Đồng hồ điện/nước</Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p>Dịch vụ nước</p>
                          </Col>
                          <Col span={5}>
                            <p>4,500 đ</p>
                          </Col>
                          <Col span={11}>Đồng hồ điện/nước</Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p>Dịch vụ xe</p>
                          </Col>
                          <Col span={5}>
                            <p>50,000 đ</p>
                          </Col>
                          <Col span={11}>Người</Col>
                        </Row>
                      </Card>
                    </Row>
                  </Col>
                  <Col span={17}>
                    <Row>
                      <Card
                        title={
                          <>
                            <Tag color="blue" className="text-tag">
                              <h3>
                                <span className="font-size-tag">
                                  <b> Thông tin phòng </b>
                                </span>
                              </h3>
                            </Tag>
                          </>
                        }
                        className="card"
                      >
                        <Table
                          bordered
                          // dataSource={dataSource}
                          dataSource={dataSource}
                          columns={columns}
                          pagination={{ pageSize: 5 }}
                          loading={loading}
                          rowSelection={rowSelection}
                          components={components}
                          rowClassName={() => "editable-row"}
                        />
                      </Card>
                    </Row>
                    <Row justify="end">
                      <Button
                        className="btn-add-invoice"
                        htmlType="submit"
                        key="submit"
                        form="createInvoice"
                        type="primary"
                        size="large"
                      >
                        Tạo mới hoá đơn
                      </Button>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AddAutoInvoice;
