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
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
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
    console.log(data);
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
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Search
              placeholder="Tìm kiếm theo tên nhân viên, tên đăng nhập, số điện thoại"
              style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
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
                          Tìm kiếm theo tên nhân viên
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên nhân viên" onChange={nameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="user_name" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo tên đăng nhập
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên đăng nhập" onChange={usernameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phone_number" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số điện thoại" onChange={phonenumberChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" style={{ width: "300px" }}>
                    <Col className="gutter-row" span={24} style={{ marginBottom: "15px" }}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Ngày bắt đầu làm việc
                        </label>
                      </Row>
                      <Row>
                        <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} onChange={dateChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" style={{ width: "300px", marginTop: "30px" }}>
                    <Col className="gutter-row" span={24}>
                      <Switch onChange={deactiveChange} />{" "}
                      {deactive ? <span>Nhân viên đã nghỉ việc</span> : <span>Nhân viên đang làm việc</span>}
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
                      Tìm kiếm
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={resetForm}>
                      Đặt lại
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
            title: "Tên nhân viên",
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
            title: "Tên đăng nhập",
            dataIndex: "user_name",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone_number",
          },
          {
            title: "Ngày bắt đầu làm việc",
            dataIndex: "created_at",
            render: (date) => getFullDate(date),
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            render: (_, record) => {
              let gender;
              if (record.gender === true) {
                gender = <p>Nam</p>;
              } else {
                gender = <p>Nữ</p>;
              }
              return <>{gender}</>;
            },
          },
          {
            title: "Vai trò",
            dataIndex: "role",
            render: (_, record) => {
              let role;
              if (record.role_name === "ROLE_ADMIN") {
                role = <p>ADMIN</p>;
              } else {
                role = <p>Nhân Viên</p>;
              }
              return <>{role}</>;
            },
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, record) => {
              let status;
              if (record.is_deactivate === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Đã nghỉ việc
                  </Tag>
                );
              } else if (record.is_deactivate === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    Đang làm việc
                  </Tag>
                );
              }

              return <>{status}</>;
            },
          },

          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="Chỉnh sửa">
                    <EditOutlined className="icon" onClick={() => onClickUpdateStaff(record.account_id)} />
                  </Tooltip>
                  <Tooltip title="Xem thông tin">
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
