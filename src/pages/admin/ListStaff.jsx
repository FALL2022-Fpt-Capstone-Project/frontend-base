import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Tag, Row, Col, Button, Tabs, Form, Switch, Tooltip, notification } from "antd";
import axios from "../../api/axios";
import "./listStaff.scss";
import { EditOutlined, EyeOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import UpdateStaff from "./UpdateStaff";
import DetailStaff from "./DetailStaff";
const { Search } = Input;
const { RangePicker } = DatePicker;
const ListStaff = () => {
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [deactive, setDeactive] = useState(false);
  const [full_name, setFullname] = useState("");
  const [user_name, setUsername] = useState("");
  const [phone_number, setPhonenumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [id, setId] = useState();
  const LIST_EMPLOYEE_URL = "manager/staff";
  const LIST_ROLES_URL = "manager/staff/roles";
  const [updateStaff, setUpdateStaff] = useState(false);
  const [detailStaff, setDetailStaff] = useState(false);
  const [flag, setFlag] = useState(false);

  const onClickUpdateStaff = (id) => {
    setUpdateStaff(true);
    setId(id);
  };
  const onClickDetailStaff = (id) => {
    setDetailStaff(true);
    setId(id);
  };
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const [form] = Form.useForm();
  const options = [];
  let cookie = localStorage.getItem("Cookie");
  let role = localStorage.getItem("Role");
  const getAllEmployees = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data.filter((data) => data.role_name === "ROLE_STAFF"));
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "???? c?? l???i x???y ra, vui l??ng th??? l???i sau",
          duration: 3,
          placement: "top",
        });
      });
    setLoading(false);
  };
  useEffect(() => {
    getAllEmployees();
  }, []);
  useEffect(() => {
    if (flag) {
      getAllEmployees();
    }
  }, [flag]);

  const getFilterEmployees = async (value) => {
    const data = {
      full_name: full_name,
      user_name: user_name,
      deactive: deactive,
      startDate: startDate,
      endDate: endDate,
      phoneNumber: phone_number,
    };

    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        params: {
          name: full_name.trim(),
          userName: user_name.trim(),
          deactivate: deactive,
          startDate: startDate,
          endDate: endDate,
          phoneNumber: phone_number.trim(),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data.filter((data) => data.role_name === "ROLE_STAFF"));
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const deactiveChange = (value) => {
    setDeactive(value);
  };
  const nameChange = (e) => {
    setFullname(e.target.value);
  };
  const usernameChange = (e) => {
    setUsername(e.target.value);
  };
  const phonenumberChange = (e) => {
    setPhonenumber(e.target.value);
  };
  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const resetForm = async () => {
    form.resetFields();
    setDeactive("");
    setEndDate("");
    setStartDate("");
    setFullname("");
    setUsername("");
    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data.filter((data) => data.role_name === "ROLE_STAFF"));
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  return (
    <div className="list-staff">
      <div className="list-staff-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="T??m ki???m nhanh" key="1">
            <Search
              placeholder="T??m ki???m theo t??n nh??n vi??n, t??n ????ng nh???p, s??? ??i???n tho???i"
              style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="T??m ki???m n??ng cao" key="2">
            <Form
              {...formItemLayout}
              form={form}
              name="filterStaff"
              id="filterStaff"
              onFinish={getFilterEmployees}
              style={{ width: "100%" }}
            >
              <Row gutter={[16]} style={{ marginBottom: "20px" }}>
                <Row span={8}>
                  <Form.Item name="full_name" style={{ width: "300px", marginBottom: 0 }}>
                    <Col className="gutter-row" span={24} style={{ marginBottom: "15px" }}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          T??m ki???m theo t??n nh??n vi??n
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nh???p t??n nh??n vi??n" onChange={nameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="user_name" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          T??m ki???m theo t??n ????ng nh???p
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nh???p t??n ????ng nh???p" onChange={usernameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phone_number" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          T??m ki???m theo s??? ??i???n tho???i
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nh???p s??? ??i???n tho???i" onChange={phonenumberChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24} style={{ marginBottom: "15px" }}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Ng??y b???t ?????u l??m vi???c
                        </label>
                      </Row>
                      <Row>
                        <RangePicker format={"DD-MM-YYYY"} placeholder={["T???", "?????n"]} onChange={dateChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" style={{ width: "300px", marginTop: "30px" }}>
                    <Col className="gutter-row" span={24}>
                      <Switch onChange={deactiveChange} />{" "}
                      {deactive ? <span>Nh??n vi??n ???? ngh??? vi???c</span> : <span>Nh??n vi??n ??ang l??m vi???c</span>}
                    </Col>
                  </Form.Item>
                </Row>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col offset={10}>
                  <Row>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ marginRight: "20px" }}
                      onClick={getFilterEmployees}
                      htmlType="submit"
                    >
                      T??m ki???m
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={resetForm}>
                      ?????t l???i
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "T??n nh??n vi??n",
            dataIndex: "full_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return (
                String(record.full_name).toLowerCase()?.includes(value.toLowerCase().trim()) ||
                String(record.user_name).toLowerCase()?.includes(value.toLowerCase().trim()) ||
                String(record.phone_number).toLowerCase()?.includes(value.toLowerCase().trim())
              );
            },
          },
          {
            title: "T??n ????ng nh???p",
            dataIndex: "user_name",
          },
          {
            title: "S??? ??i???n tho???i",
            dataIndex: "phone_number",
          },
          {
            title: "Ng??y b???t ?????u l??m vi???c",
            dataIndex: "created_at",
            render: (date) => getFullDate(date),
          },
          {
            title: "Gi???i t??nh",
            dataIndex: "gender",
            render: (_, record) => {
              let gender;
              if (record.gender === true) {
                gender = <p>Nam</p>;
              } else {
                gender = <p>N???</p>;
              }
              return <>{gender}</>;
            },
          },
          {
            title: "Vai tr??",
            dataIndex: "role",
            render: (_, record) => {
              let role;
              if (record.role_name === "ROLE_ADMIN") {
                role = <p>ADMIN</p>;
              } else {
                role = <p>Nh??n Vi??n</p>;
              }
              return <>{role}</>;
            },
          },
          {
            title: "Tr???ng th??i",
            dataIndex: "status",
            render: (_, record) => {
              let status;
              if (record.is_deactivate === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    ???? ngh??? vi???c
                  </Tag>
                );
              } else if (record.is_deactivate === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    ??ang l??m vi???c
                  </Tag>
                );
              }

              return <>{status}</>;
            },
          },

          {
            title: "Thao t??c",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="Ch???nh s???a">
                    <EditOutlined className="icon" onClick={() => onClickUpdateStaff(record.account_id)} />
                  </Tooltip>
                  <Tooltip title="Xem th??ng tin">
                    <EyeOutlined
                      className="icon"
                      onClick={() => {
                        onClickDetailStaff(record.account_id);
                      }}
                    />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <DetailStaff visible={detailStaff} close={setDetailStaff} id={id} />
      <UpdateStaff visible={updateStaff} close={setUpdateStaff} id={id} />
    </div>
  );
};

export default ListStaff;
